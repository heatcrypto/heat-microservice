/*
 * The MIT License (MIT)
 * Copyright (c) 2017 Heat Ledger Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
declare namespace microservice {
  interface Config {
    account: string;
    settings: lang.IStringHashMap<any>;
    methods: lang.IStringHashMap<Method>;
  }
  interface Method {
    fee?: string;
    param?: lang.IStringHashMap<any>;
  }
  interface Call {
    service: string;
    method: string;
    param: lang.IStringHashMap<string>;
  }
}

module microservice {

  /* MicroService annotation */
  export function MicroService(name: string) {
    return function (target) {
      microservice.getServiceManager().addService(name, function () {
        function F(args): void {
          return target.apply(this, args);
        }
        F.prototype = target.prototype;
        return new F(arguments);
      });
    }
  }  

  /* Base class for all MicroService annotated classes */
  export abstract class AbstractMicroService<T> {
    protected settings: T;
    constructor(protected config: microservice.Config) {
      this.settings = <T> config.settings;
    }
  }  

  /* Access the ServiceManager */
  export function getServiceManager(): ServiceManager {
    return this['serviceManager'] || (this['serviceManager'] = new ServiceManager());
  }

  class Service {
    constructor(public name: string, public factory: Function) { }
  }

  class ServiceManager {
    private services: lang.IStringHashMap<Service> = {};
    private running: Array<any> = [];

    /* Add a service, called from MicroService annotation */
    public addService(name: string, factory: Function) {
      this.services[name] = new Service(name, factory);
    }

    /* Tests if a service is registered, called from java */
    public hasService(name: string): boolean {
      return !!this.services[name];
    }    

    /* Create and run a service instance, called from java */
    public runService(name: string, config: lang.IStringHashMap<any>): number {
      var service = this.services[name];
      if (!service) {
        return 1;
      }
      this.running.push(service.factory.call(null, config));
      return 0;
    }
  }

}