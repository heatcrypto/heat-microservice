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
module transactionBuilder {

  export function payment(secretPhrase: string) {
    return new PaymentBuilder(secretPhrase);
  }

  export function message(secretPhrase: string) {
    return new MessageBuilder(secretPhrase);
  }

  export function assetTransfer(secretPhrase: string) {
    return new AssetTransferBuilder(secretPhrase);
  }

  export function askOrderPlacement(secretPhrase: string) {
    return new AskOrderPlacementBuilder(secretPhrase);
  }

  export function askOrderCancellation(secretPhrase: string) {
    return new AskOrderCancellationBuilder(secretPhrase);
  }  

  export function bidOrderPlacement(secretPhrase: string) {
    return new BidOrderPlacementBuilder(secretPhrase);
  }

  export function bidOrderCancellation(secretPhrase: string) {
    return new BidOrderCancellationBuilder(secretPhrase);
  }  

  function createMessageAppendix(message: string, isText: boolean): Java.com.heatledger.Appendix.Message {
    let Message = Java.type('com.heatledger.Appendix.Message');
    let msg = isText ? message : Convert.parseHexString(message);
    return new Message(msg);
  }

  function createEncryptedMessage(secretPhrase: string, recipientPublicKey: Array<number>, message: string, isText: boolean): Java.com.heatledger.Appendix.EncryptedMessage {
    let EncryptedMessage = Java.type('com.heatledger.Appendix.EncryptedMessage');
    let plainText: Array<number> = isText ? Convert.toBytes(message) : Convert.parseHexString(message);
    let myPrivateKey = Crypto2.getPrivateKey(secretPhrase);
    let encryptedData = EncryptedData.encrypt(plainText, myPrivateKey, recipientPublicKey);
    return new EncryptedMessage(encryptedData, isText);
  }

  function createEncryptToSelfMessage(secretPhrase: string, message: string, isText: boolean): Java.com.heatledger.Appendix.EncryptToSelfMessage {
    let EncryptToSelfMessage = Java.type('com.heatledger.Appendix.EncryptToSelfMessage');
    let plainText: Array<number> = isText ? Convert.toBytes(message) : Convert.parseHexString(message);
    let myPrivateKey = Crypto2.getPrivateKey(secretPhrase);
    let theirPublicKey = Crypto2.getPublicKey(secretPhrase);
    let encryptedData = EncryptedData.encrypt(plainText, myPrivateKey, theirPublicKey);
    return new EncryptToSelfMessage(encryptedData, isText);
  }

  function createPublicKeyAnnouncement(publicKey: Array<number>): Java.com.heatledger.Appendix.PublicKeyAnnouncement {
    let PublicKeyAnnouncement = Java.type('com.heatledger.Appendix.PublicKeyAnnouncement');
    return new PublicKeyAnnouncement(publicKey);
  }

  class TransactionBuilder {
    protected _recipient: number;
    protected _recipientPublicKey: Array<number>;
    protected _attachment: Java.com.heatledger.Attachment;    
    protected _message: Java.com.heatledger.Appendix.Message;
    protected _encryptedMessage: Java.com.heatledger.Appendix.EncryptedMessage;
    protected _encryptToSelfMessage: Java.com.heatledger.Appendix.EncryptToSelfMessage;
    protected _publicKeyAnnouncement: Java.com.heatledger.Appendix.PublicKeyAnnouncement;
    protected _amountHQT: number = 0;
    protected _feeHQT: number = 1000000;
    protected _deadline: number = 1440;

    constructor(protected secretPhrase: string) {
      if (!util.isDefined(secretPhrase)) {
        throw new Error("Must provide a secretPhrase");
      }      
    }

    public build(): Java.com.heatledger.Transaction {
      let senderPublicKey = Crypto2.getPublicKey(this.secretPhrase);
      let builder: Java.com.heatledger.Transaction.Builder = heat.newTransactionBuilder(senderPublicKey, this._amountHQT, this._feeHQT, this._deadline, this._attachment);
      if (util.isDefined(this._recipient)) {
        builder.recipientId(this._recipient);
      }
      if (util.isDefined(this._message)) {
        builder.message(this._message);
      }
      if (util.isDefined(this._encryptedMessage)) {
        builder.encryptedMessage(this._encryptedMessage);
      }
      if (util.isDefined(this._encryptToSelfMessage)) {
        builder.encryptToSelfMessage(this._encryptToSelfMessage);
      }
      if (util.isDefined(this._publicKeyAnnouncement)) {
        builder.publicKeyAnnouncement(this._publicKeyAnnouncement);
      }
      let transaction = builder.build();
      transaction.sign(this.secretPhrase);
      return transaction;
    }    

    public broadcast(): Java.com.heatledger.Transaction {
      let transaction = this.build();
      heat.transactionProcessor.broadcast(transaction);
      return transaction;
    }

    public attachment(attachment: Java.com.heatledger.Attachment) {
      this._attachment = attachment;
      return this;
    }    

    public message(message: string, isText?: boolean) {
      let _isText = util.isDefined(isText) ? isText : true;
      this._message = createMessageAppendix(message, _isText);
      return this;
    }

    public encryptedMessage(message: string, isText?: boolean) {
      if (!util.isDefined(this._recipientPublicKey)) {
        throw new Error("Missing recipientPublicKey");
      }
      let _isText = util.isDefined(isText) ? isText : true;
      this._encryptedMessage = createEncryptedMessage(this.secretPhrase, this._recipientPublicKey, message, _isText);
      return this;
    }

    public encryptToSelfMessage(message: string, isText?: boolean) {
      let _isText = util.isDefined(isText) ? isText : true;
      this._encryptToSelfMessage = createEncryptToSelfMessage(this.secretPhrase, message, _isText);
      return this;
    }

    public recipient(recipient: number) {
      this._recipient = recipient;
      return this;
    }

    public recipientPublicKey(recipientPublicKey: Array<number>) {
      this._recipientPublicKey = recipientPublicKey;
      this._recipient = Account.getId(recipientPublicKey);
      this._publicKeyAnnouncement = createPublicKeyAnnouncement(recipientPublicKey);
      return this;
    }   

    public amountHQT(amountHQT: number) {
      this._amountHQT = amountHQT;
      return this;
    }

    public feeHQT(feeHQT: number) {
      this._feeHQT = feeHQT;
      return this;
    }

    public deadline(deadline: number) {
      this._deadline = deadline;
      return this;
    }
  }

  class PaymentBuilder extends TransactionBuilder {
    constructor(secretPhrase: string) {
      super(secretPhrase);
      let Payment = Java.type('com.heatledger.Attachment').ORDINARY_PAYMENT;
      this.attachment(Payment);
    }
  }

  class MessageBuilder extends TransactionBuilder {
    constructor(secretPhrase: string) {
      super(secretPhrase);
      let Message = Java.type('com.heatledger.Attachment').ARBITRARY_MESSAGE;
      this.attachment(Message);
    }
  }

  class AssetTransferBuilder extends TransactionBuilder {
    private _asset: number;
    private _quantity: number;

    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public asset(asset: number) {
      this._asset = asset;
      return this;
    }

    public quantity(quantity: number) {
      this._quantity = quantity;
      return this;
    }

    public build() {
      if (!util.isDefined(this._asset)) {
        throw new Error("You did not set which asset to transfer");
      }
      if (!util.isDefined(this._quantity)) {
        throw new Error("You did not set what quantity to transfer");
      }
      let ColoredCoinsAssetTransfer = Java.type('com.heatledger.Attachment').ColoredCoinsAssetTransfer;
      let attachment = new ColoredCoinsAssetTransfer(this._asset, this._quantity);
      this.attachment(attachment);
      return super.build();
    }
  }

  class OrderPlacementBuilder extends TransactionBuilder {
    protected _currency: number;
    protected _asset: number;
    protected _quantity: number;
    protected _price: number;
    protected _expiration: number = 360000; // 100 hours

    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public currency(currency: number) {
      this._currency = currency;
      return this;
    }

    public asset(asset: number) {
      this._asset = asset;
      return this;
    }

    public quantity(quantity: number) {
      this._quantity = quantity;
      return this;
    }

    public price(price: number) {
      this._price = price;
      return this;
    }

    public expiration(expiration: number) {
      if (expiration > Constants.MAX_ORDER_EXPIRATION) {
        throw new Error(`Expiration too high, max is ${Constants.MAX_ORDER_EXPIRATION}`);
      }
      if (expiration < Constants.MIN_ORDER_EXPIRATION) {
        throw new Error(`Expiration too low, min is ${Constants.MIN_ORDER_EXPIRATION}`);
      }
      this._expiration = expiration;
      return this;
    }

    protected verify() {
      if (!util.isDefined(this._currency)) {
        throw new Error("You did not set the currency");
      }
      if (!util.isDefined(this._asset)) {
        throw new Error("You did not set the asset");
      }
      if (!util.isDefined(this._quantity)) {
        throw new Error("You did not set the quantity");
      }
      if (!util.isDefined(this._price)) {
        throw new Error("You did not set the price");
      }            
    }
  }

  class AskOrderPlacementBuilder extends OrderPlacementBuilder {
    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public build() {
      this.verify();
      let ColoredCoinsAskOrderPlacement = Java.type('com.heatledger.Attachment').ColoredCoinsAskOrderPlacement;
      let attachment = new ColoredCoinsAskOrderPlacement(this._currency, this._asset, this._quantity, this._price, this._expiration);
      this.attachment(attachment);
      return super.build();      
    }
  }

  class BidOrderPlacementBuilder extends OrderPlacementBuilder {
    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public build() {
      this.verify();
      let ColoredCoinsBidOrderPlacement = Java.type('com.heatledger.Attachment').ColoredCoinsBidOrderPlacement;
      let attachment = new ColoredCoinsBidOrderPlacement(this._currency, this._asset, this._quantity, this._price, this._expiration);
      this.attachment(attachment);
      return super.build();      
    }
  }  

  class OrderCancellationBuilder extends TransactionBuilder {
    protected _order: number;
    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public order(order: number) {
      this._order = order;
      return this;
    }

    protected verify() {
      if (!util.isDefined(this._order)) {
        throw new Error("You did not set the order");
      }    
    }
  }

  class AskOrderCancellationBuilder extends OrderCancellationBuilder {
    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public build() {
      this.verify();
      let ColoredCoinsAskOrderCancellation = Java.type('com.heatledger.Attachment').ColoredCoinsAskOrderCancellation;
      let attachment = new ColoredCoinsAskOrderCancellation(this._order);
      this.attachment(attachment);
      return super.build();      
    }
  }

  class BidOrderCancellationBuilder extends OrderCancellationBuilder {
    constructor(secretPhrase: string) {
      super(secretPhrase);
    }

    public build() {
      this.verify();
      let ColoredCoinsBidOrderCancellation = Java.type('com.heatledger.Attachment').ColoredCoinsBidOrderCancellation;
      let attachment = new ColoredCoinsBidOrderCancellation(this._order);
      this.attachment(attachment);
      return super.build();      
    }
  }
}