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

    public transaction() {
      return new TransactionSubscriberBuilder(this.serviceId);
    }

    public payment() {
      return new PaymentSubscriberBuilder(this.serviceId);
    }

    public assetTransfer() {
      return new AssetTransferSubscriberBuilder(this.serviceId);
    }

    public message() {
      return new MessageSubscriberBuilder(this.serviceId);
    }

    public order() {
      return new OrderSubscriberBuilder(this.serviceId);
    }

    public trade() {
      return new TradeSubscriberBuilder(this.serviceId);
    }

    public block() {
      return new BlockSubscriberBuilder(this.serviceId);
    }
  }

  class TransactionNoRecipientSubscriberBuilder {
    private serviceId: string;
    protected _account: number = 0;
    private _sender: number = 0;
    protected _recipient: number = 0;
    private _onAdd: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTransactionEvent> = null;
    private _onRemove: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTransactionEvent> = null;
    private _onConfirmed: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTransactionEvent> = null;
    private _unconfirmed: boolean = false;
    private _confirmations: number;
    private _type: number;
    private _subtype: number;

    constructor(serviceId: string) {
      this.serviceId = serviceId;
    }

    public sender(sender: number) {
      this._sender = sender;
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
        if (!util.isDefined(this._confirmations)) {
          throw new Error("You must set 'confirmations' on a builder when using 'onComplete'");
        }
        unsubscribe.push(this.subscribeConfirmed());
      }
      if (util.isDefined(this._onAdd) || util.isDefined(this._onRemove)) {
        unsubscribe.push(heat.events.subscribeTransaction(this._type, this._subtype, this._account, this._sender,
            this._recipient, this._unconfirmed, this._onAdd, this._onRemove));
      }
      return () => unsubscribe.forEach((fn) => { fn() });
    }

    private subscribeConfirmed(): Java.java.lang.Runnable {
      var unsubscribe: Array<Java.java.lang.Runnable> = [];
      var add = (event: Java.com.heatledger.scripting.NativeTransactionEvent) => {

        /* Always call addTransaction, if already added this operation does nothing */
        heat.transactionStore.addTransaction(this.serviceId, event.transaction);

        /* Determine if this invocation was completed already, if so exit */
        if (heat.transactionStore.getEntryValue(this.serviceId, event.transaction.id, COMPLETE) == TRUE) {
          return;
        }

        var onConfirmed = (event: Java.com.heatledger.scripting.NativeTransactionEvent) => {

          /* Determine if this invocation was completed already, if so exit */
          if (heat.transactionStore.getEntryValue(this.serviceId, event.transaction.id, COMPLETE) == TRUE) {
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
  }

  /**
   * All transaction types subscriber
   */
  class TransactionSubscriberBuilder extends TransactionNoRecipientSubscriberBuilder {

    constructor(id) {
      super(id)
    }

    public account(account: number) {
      this._account = account;
      return this;
    }

    public recipient(recipient: number) {
      this._recipient = recipient;
      return this;
    }

    public subscribe() {
      this.type(-1);
      this.subtype(-1);
      return super.subscribe();
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

  class MessageSubscriberBuilder extends TransactionSubscriberBuilder {
    constructor(id) {
      super(id)
    }
    public subscribe() {
      this.type(1);
      this.subtype(0);
      return super.subscribe();
    }
  }

  class OrderSubscriberBuilder {
    private serviceId: string;
    private _account: number = 0;
    private _onCreate: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeOrderEvent> = null;
    private _onUpdate: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeOrderEvent> = null;
    private _onDelete: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeOrderEvent> = null;
    private _unconfirmed: boolean = false;
    private _currency: number;
    private _asset: number;
    private _excludeAskOrders: boolean = false;
    private _excludeBidOrders: boolean = false;

    constructor(serviceId: string) {
      this.serviceId = serviceId;
    }

    public account(account: number) {
      this._account = account;
      return this;
    }

    public currency(currency: number) {
      this._currency = currency;
      return this;
    }

    public asset(asset: number) {
      this._asset = asset;
      return this;
    }

    public excludeAskOrders(excludeAskOrders: boolean) {
      this._excludeAskOrders = excludeAskOrders;
      return this;
    }

    public excludeBidOrders(excludeBidOrders: boolean) {
      this._excludeBidOrders = excludeBidOrders;
      return this;
    }

    public onCreate(onCreate: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeOrderEvent>) {
      this._onCreate = onCreate;
      return this;
    }

    public onUpdate(onUpdate: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeOrderEvent>) {
      this._onUpdate = onUpdate;
      return this;
    }

    public onDelete(onDelete: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeOrderEvent>) {
      this._onDelete = onDelete;
      return this;
    }

    public unconfirmed(unconfirmed: boolean) {
      this._unconfirmed = unconfirmed;
      return this;
    }

    public subscribe() {
      let market = null;
      if (util.isDefined(this._currency) && util.isDefined(this._asset)) {
        market = heat.newMarket(this._currency, this._asset);
      }
      var unsubscribe: Array<Java.java.lang.Runnable> = [];
      if (!this._excludeAskOrders) {
        unsubscribe.push(heat.events.subscribeAskOrder(market, this._account, this._unconfirmed, this._onCreate, this._onUpdate, this._onDelete));
      }
      if (!this._excludeBidOrders) {
        unsubscribe.push(heat.events.subscribeBidOrder(market, this._account, this._unconfirmed, this._onCreate, this._onUpdate, this._onDelete));
      }
      return () => unsubscribe.forEach((fn)=>fn());
    }
  }

  class TradeSubscriberBuilder {
    private serviceId: string;
    private _currency: number;
    private _asset: number;
    private _account: number = 0;
    private _buyer: number = 0;
    private _seller: number = 0;
    private _unconfirmed: boolean = false;
    private _onAdd: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTradeEvent> = null;

    constructor(serviceId: string) {
      this.serviceId = serviceId;
    }

    public currency(currency: number) {
      this._currency = currency;
      return this;
    }

    public asset(asset: number) {
      this._asset = asset;
      return this;
    }

    public account(account: number) {
      this._account = account;
      return this;
    }

    public buyer(buyer: number) {
      this._buyer = buyer;
      return this;
    }

    public seller(seller: number) {
      this._seller = seller;
      return this;
    }

    public unconfirmed(unconfirmed: boolean) {
      this._unconfirmed = unconfirmed;
      return this;
    }

    public onAdd(onAdd: Java.java.util._function.Consumer<Java.com.heatledger.scripting.NativeTradeEvent>) {
      this._onAdd = onAdd;
      return this;
    }

    public subscribe() {
      let market = null;
      if (util.isDefined(this._currency) && util.isDefined(this._asset)) {
        market = heat.newMarket(this._currency, this._asset);
      }
      return heat.events.subscribeTrade(market, this._account, this._buyer, this._seller, this._unconfirmed, this._onAdd);
    }
  }

  class BlockSubscriberBuilder {
    private serviceId: string;
    private _generator: number = 0;
    private _onPush: Java.java.util._function.Consumer<Java.com.heatledger.Block> = null;
    private _onPop: Java.java.util._function.Consumer<Java.com.heatledger.Block> = null;

    constructor(serviceId: string) {
      this.serviceId = serviceId;
    }

    public generator(generator: number) {
      this._generator = generator;
      return this;
    }

    public onPush(onPush: Java.java.util._function.Consumer<Java.com.heatledger.Block>) {
      this._onPush = onPush;
      return this;
    }

    public onPop(onPop: Java.java.util._function.Consumer<Java.com.heatledger.Block>) {
      this._onPop = onPop;
      return this;
    }

    public subscribe() {
      return heat.events.subscribeBlock(this._generator, this._onPop, this._onPush);
    }
  }
}