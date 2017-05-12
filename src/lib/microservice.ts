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
  interface ApiRoute {
    method: string;
    segments: Array<string>;
    propertyKey: string;
    target: any;
  }
}

module microservice {

  /* MicroService annotation */
  export function MicroService(name: string) {
    return function (target) {
      microservice.manager().addService(name, function () {
        function F(args): void {
          return target.apply(this, args);
        }
        F.prototype = target.prototype;
        return new F(arguments);
      });
    }
  }  

  /* Base class for all MicroService annotated classes */
  export abstract class AbstractMicroService {
    public destroy() {}
  }  

  /* Access the Service Manager */
  export function manager(): ServiceManager {
    return this['_manager'] || (this['_manager'] = new ServiceManager());
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
      this.running.push(this.createService(name, config));
      return 0;
    }

    /* Create and return a service instance */
    public createService(name: string, config: lang.IStringHashMap<any>): any {
      let service = this.services[name];
      let instance = service.factory.call(null, config);
      if (instance["__routes"]) {
        instance["__routes"].forEach(route=>{
          microservice.routes().register({
            method: route.method,
            segments: route.segments,
            propertyKey: route.propertyKey,
            target: instance
          })
        });
      }
      return instance;
    }
  }

  /* Api annotation */
  export function Api(method: string, path: string) {
    (function validate_path(path: string) {
      let segments = path.split('/');
      let foundNonStatic = false;
      segments.forEach((segment)=> {
        if (segment.charAt(0) == ":") {
          foundNonStatic = true;
        }
        else {
          if (foundNonStatic) {
            throw new Error(`Invalid path ${path} constant segment cannot follow a parameter segment`);
          }
        }
      });
    })(path);
    (function validate_method(method: string) {
      if (method != 'GET' && method != 'POST') {
        throw new Error(`Invalid method ${method}, must be GET or POST`);
      }
    })(method);
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      let routes = target["__routes"] || (target["__routes"]=[]);
      routes.push({
        method: method,
        segments: path.split('/'),
        propertyKey: propertyKey
      });
    };
  }  

  /* Access the Route Manager */
  export function routes(): RouteManager {
    return this['_routes'] || (this['_routes'] = new RouteManager());
  }  

  class RouteManager {
    public routes: Array<ApiRoute> = [];

    public register(route: ApiRoute) {
      this.routes.push(route);
    }

    public invoke(method: string, segments: Array<string>, body: string) {
      let route = this.findRoute(method, segments);
      if (!util.isDefined(route)) {
        return null;
      }
      // collect the parameters to pass to the microservice instance method
      let params = [];
      for (let i=0; i<route.segments.length; i++) {
        let segment = route.segments[i];
        if (segment.charAt(0)==':') {
          params.push(segments[i]);
        }
      }
      if (method=='POST') {
        params.push(body);
      }

      try {
        // invoke the method on the target class
        let fn = route.target[route.propertyKey];
        return fn.apply(route.target, params);
      } catch(e) {
        console.log("ERROR ROUTE INVOKE "+e);
      }
    }

    private findRoute(method: string, segments: Array<string>): ApiRoute {
      outer:
      for (let i=0; i<this.routes.length; i++) {
        let route = this.routes[i];
        // method must match GET or POST
        if (route.method != method) {
          continue;
        }
        // segment count must match
        if (route.segments.length != segments.length) {
          continue;
        }
        // path segments must match
        for (let j=0; j<route.segments.length; j++) {
          let segment = route.segments[j];          
          // required parameter segment (starts with :)
          if (segment.charAt(0) == ":") {
            if (!util.isDefined(segments[j])) {
              continue outer;
            }
          }
          // static segment
          else {
            if (segment != segments[j]) {
              continue outer;
            }
          }
        }
        // found a match
        return route;
      }
      return null;
    }
  }
}