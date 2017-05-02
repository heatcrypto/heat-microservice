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
module subscriber {
  export var COMPLETE = "COMPLETE";
  export var TRUE = "TRUE"
  export var FALSE = "FALSE";

  export function create(serviceId: string) {
    return new Subscriber(serviceId);
  }

  class Subscriber {
    constructor(private serviceId: string) { }

    public payment() {
      return new PaymentSubscriberBuilder(this.serviceId);
    }

    public assetTransfer() {
      return new AssetTransferSubscriberBuilder(this.serviceId);
    }
  }


  abstract class TransactionSubscriberBuilder {
    private serviceId: string;
    private _account: number = 0;
    private _sender: number = 0;
    private _recipient: number = 0;
    private _onAdd: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTransactionEvent> = null;
    private _onRemove: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTransactionEvent> = null;
    private _onConfirmed: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTransactionEvent> = null;
    private _unconfirmed: boolean = false;
    private _confirmations: number = 0;
    private _type: number;
    private _subtype: number;

    constructor(serviceId: string) {
      this.serviceId = serviceId;
    }

    public account(account: number) {
      this._account = account;
      return this;
    }

    public sender(sender: number) {
      this._sender = sender;
      return this;
    }

    public recipient(recipient: number) {
      this._recipient = recipient;
      return this;
    }

    public onAdd(onAdd: (event: Java.com.heatledger.scripting.NativeTransactionEvent) => void) {
      this._onAdd = onAdd;
      return this;
    }

    public onRemove(onRemove: (event: Java.com.heatledger.scripting.NativeTransactionEvent) => void) {
      this._onRemove = onRemove;
      return this;
    }

    public onConfirmed(onConfirmed: (event: Java.com.heatledger.scripting.NativeTransactionEvent) => void) {
      this._onConfirmed = onConfirmed;
      return this;
    }

    public unconfirmed(unconfirmed: boolean) {
      this._unconfirmed = unconfirmed;
      return this;
    }

    public confirmations(confirmations: number) {
      this._confirmations = confirmations;
      return this;
    }

    protected type(type: number) {
      this._type = type;
      return this;
    }

    protected subtype(subtype: number) {
      this._subtype = subtype;
      return this;
    }

    public subscribe() {
      var unsubscribe: Array<Java.java.lang.Runnable> = [];
      if (util.isDefined(this._onConfirmed)) {
        unsubscribe.push(this.subscribeConfirmed());
      }
      if (util.isDefined(this._onAdd) || util.isDefined(this._onRemove)) {
        unsubscribe.push(heat.events.subscribeTransaction(this._type, this._subtype, this._account, this._sender, this._recipient, this._unconfirmed, this._onAdd, this._onRemove));
      }
      return () => unsubscribe.forEach((fn) => { fn() });
    }

    private subscribeConfirmed(): Java.java.lang.Runnable {
      var unsubscribe: Array<Java.java.lang.Runnable> = [];
      var add = (event: Java.com.heatledger.scripting.NativeTransactionEvent) => {

        /* Always call addTransaction, if already added this operation does nothing */
        heat.transactionStore.addTransaction(this.serviceId, event.transaction);

        /* Determine if this invocation was completed already, if so exit */
        if (this.get(event.transaction.id, COMPLETE) == TRUE) {
          return;
        }

        var onConfirmed = (event: Java.com.heatledger.scripting.NativeTransactionEvent) => {

          /* Determine if this invocation was completed already, if so exit */
          if (this.get(event.transaction.id, COMPLETE) == TRUE) {
            return;
          }

          /* Call the onConfirmed handler */
          this._onConfirmed(event);
        };

        /* Register a listener for when the number of confirmations is reached */
        heat.transactionStore.registerConfirmedListener(event.transaction.id, this._confirmations, onConfirmed);
        unsubscribe.push(() => {
          heat.transactionStore.unRegisterConfirmedListener(event.transaction.id, this._confirmations, onConfirmed);
        });
      };
      unsubscribe.push(heat.events.subscribeTransaction(this._type, this._subtype, this._account, this._sender, this._recipient, this._unconfirmed, add, null));
      return () => unsubscribe.forEach((fn) => { fn() });
    }

    public get(transactionId: number, key: string): string {
      return heat.transactionStore.getEntryValue(this.serviceId, transactionId, key);
    }

    public put(transactionId: number, key: string, value: string) {
      return heat.transactionStore.setEntryValue(this.serviceId, transactionId, key, value);
    }
  }

  class PaymentSubscriberBuilder extends TransactionSubscriberBuilder {
    constructor(id) {
      super(id)
    }
    public subscribe() {
      this.type(0);
      this.subtype(0);
      return super.subscribe();
    }
  }

  class AssetTransferSubscriberBuilder extends TransactionSubscriberBuilder {
    constructor(id) {
      super(id)
    }
    public subscribe() {
      this.type(2);
      this.subtype(2);
      return super.subscribe();
    }
  }

}