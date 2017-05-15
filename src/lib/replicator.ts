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
module replicator {

  /* Registers a BundleReplicator from your microservices */
  export function registerBundleReplicator(replicator: AbstractBundleReplicator<any>) {
    let bundle              = replicator.$$config.bundle;
    let replicatorId        = replicator.$$config.id;
    let seed                = bundle.seed;
    let includeUnconfirmed  = !!replicator.$$config.includeUnconfirmed;
    let recipient           = replicator.$$config.recipient||0;
    let sender              = replicator.$$config.sender||0;
    let secretPhrase        = replicator.$$config.secretPhrase||null;
    let updates             = replicator.$$updates;

    heat.replicator.scriptHelper.registerBundleReplicator(
      replicatorId, 
      seed, 
      includeUnconfirmed, 
      recipient, 
      sender, 
      secretPhrase,
      // onAdd
      (buffer: Java.java.nio.ByteBuffer, event: Java.com.heatledger.scripting.NativeTransactionEvent) => {
        try {
          let object = bundle.decode(ScriptableByteBuffer.wrap(buffer));
          if (object) {
            replicator.add(object, event);
          }
        } catch (e) {
          console.log(e);
        }
      },
      // onRemove
      (buffer: Java.java.nio.ByteBuffer, event: Java.com.heatledger.scripting.NativeTransactionEvent) => {
        try {
          let object = bundle.decode(ScriptableByteBuffer.wrap(buffer));
          if (object) {
            replicator.add(object, event);
          }
        } catch (e) {
          console.log(e);
        }
      }
    );
    heat.replicator.scriptHelper.updateSchema(replicatorId, updates);
  }

  /* Annotation for registering replicators */
  export function BundleReplicator(name: string) {
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

  /**
   * Abstract base class for message bundles, the seed constructor paramater
   * is a long and is used to uniquely identify a bundle message on the java
   * side. This way we only do any javascript processing in case the java
   * parts already determined the binary message attached has a high chance
   * of being an actual bundle message and not some other random message.
   */
  export abstract class BundleMessage<T> {

    /**
     * Constructs a bundle message, the seed is a unique long used by the java
     * parts while constructing the message header.
     * 
     * @param seed 
     */
    constructor(public seed: number) {};

    /**
     * Encodes a bundle object to a ByteBuffer, the buffer provided already
     * has the required message headers applied and is supposed to use 
     * relative put operations only.
     * 
     * @param object the object we want to encode
     * @param buffer the (wrapped) ByteBuffer to write the encoding to
     */
    abstract encode(object: T, buffer: ScriptableByteBuffer);

    /**
     * Decodes a (wrapped) ByteBuffer to a bundle object. The buffer position
     * is at the start of the encoded data since the java parts already 
     * processed the bundle message header.
     * 
     * @param buffer 
     */
    abstract decode(buffer: ScriptableByteBuffer): T;

    /**
     * Create a binary message bundle. Returns a byte array.
     */
    public create(object: T): Array<number> {
      let buffer = ScriptableByteBuffer.create();
      buffer.putLong(this.seed);
      this.encode(object, buffer);
      return buffer.toArray();
    }
  }  

  interface BundleReplicatorConfig {
    id: string;
    bundle: BundleMessage<any>;
    includeUnconfirmed?: boolean;
    recipient?: number;
    sender?: number;
    secretPhrase?: string;
  }

  /* Base class for bundle replicators */
  export abstract class AbstractBundleReplicator<T> {
    public $$updates: Array<string> = [];
    
    /**
     * Bundle replicators always construct and provide a Bundle instance 
     * to their super constructor. The java parts expect to be able to use this
     * object to:
     * 
     *  1. determine the unique bundle seed
     *  2. encode bundle objects to bytes
     *  3. decode a set of bytes back to a bundle object
     * 
     * @param $$config BundleReplicatorConfig
     */
    constructor(public $$config: BundleReplicatorConfig) {}

    /**
     * Method to ascribe any kind of update to the database schema, should be 
     * called from the constructor. Note that the vendor argument passed to the 
     * constructor should determine the sql dialect to use (@see replicator.VENDOR)
     * 
     * @param sql string of sql to update, use a single sql statement per call
     */
    protected update(sql: string) {
      this.$$updates.push(sql);
    }

    /**
     * Required method that should clear all data in the replicated table, this is called by 
     * the java parts whenever a full rescan is about to start. 
     * A full rescan will re-apply all previously processed transactions and should be trusted
     * to completely rebuilt your entire data model.
     */
    abstract clear();

    /**
     * Fired on either adding a confirmed transaction or an unconfirmed transaction
     * if those are enabled of course.
     * 
     * @param object the decoded binary bundle as object
     * @param event the transaction wrapped in a NativeTransactionEvent (so it includes `unconfirmed`)
     */
    abstract add(object: T, event: Java.com.heatledger.scripting.NativeTransactionEvent);

    /**
     * Fired when a transaction was removed, could happen multiple times but will always 
     * follow a call to `add`
     * 
     * @param object the decoded binary bundle as object
     * @param event the transaction wrapped in a NativeTransactionEvent (so it includes `unconfirmed`)
     */
    abstract remove(object: T, event: Java.com.heatledger.scripting.NativeTransactionEvent);
  }
}