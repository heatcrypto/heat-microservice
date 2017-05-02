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
module microservice.gateway {

  /* These are the user configurations that are passed to this micro service */
  interface GatewayServiceSettings {

    /* The secret phrase for the heat account that will receive the assets */
    heat_secret_phrase: string;

    /* The bitcoin private key for the account that does the payments */
    btc_private_key: string;

    /* The user token to connect to the https://blockcypher.com to do bitcoin payments */
    btc_token: string;
  }

  @MicroService('gateway.service')
  class GatewayService extends AbstractMicroService<GatewayServiceSettings> {

    private subscriber = subscriber.create('gateway.service.btc').assetTransfer();

    constructor(config: Config) {
      super(config);

      /* We calculate the heat account id from its secret phrase */
      var heat_account = Account.getId(Crypto2.getPublicKey(this.settings.heat_secret_phrase));

      /* Setup the event listener that listens for 
          - asset transfer
          - to heat_account
          - from anyone
          - with 10 confirmations
          - only for transfers not marked COMPLETE */
      this.subscriber.recipient(heat_account)
        .confirmations(10)
        .onConfirmed((event) => {
          this.onAssetTransfer(event.transaction);
        })
        .subscribe();
    }

    /**
     * The asset transfer has 10 confirmations and was not marked COMPLETE which means
     * it was not processed. If it was marked COMPLETE this method would not be called
     * since the subscriber logic is aware on a per transaction basis if it was 
     * processed or not.
     * 
     * @param transaction 
     */
    private onAssetTransfer(transaction: Java.com.heatledger.Transaction) {

      /* The bitcoin address is provided as an encrypted message attachment to the asset transfer */
      var btc_address = util.decryptEncryptedMessage(transaction, this.settings.heat_secret_phrase);

      /* Before we send the BTC payment we mark this transaction as COMPLETE, a more complex 
         and secure solution would mark the payment as PENDING and will contain one more step
         where we confirm payment status. (this catches cases where a btc payment fails for
         whatever reason) */
      this.subscriber.put(transaction.id, subscriber.COMPLETE, subscriber.TRUE);

      /* The gateway usage fee is 0.25% */
      var quantity = attachment.quantity - (attachment.quantity * .0025);

      /* Now we are ready to send our btc payment, we send 1 BTC for each 1 BTC asset received */
      var attachment: Java.com.heatledger.Attachment.ColoredCoinsAssetTransfer = <any> transaction.attachment;
      var response = this.sendBTC(btc_address, quantity);

      /* Store the bitcoin transaction id and timestamp, without any error checking to keep this
         example lean. A more complex sample would of course include error checking and a more
         complex control flow to deal with such issues. */
      this.subscriber.put(transaction.id, 'BTC.TRANSACTION.ID', response.transactionId);
      this.subscriber.put(transaction.id, 'BTC.TRANSACTION.TIMESTAMP', response.transactionTimestamp);
    }

    private sendBTC(btc_recipient: string, btc_amount: number) {
      var microtx = {
        from_private: this.settings.btc_private_key,
        to_address: btc_recipient,
        value_satoshis: btc_amount
      };
      var url = 'https://api.blockcypher.com/v1/bcy/test/txs/micro?token=' + this.settings.btc_token;
      return JSON.parse(heat.createHTTPClient().post(url, JSON.stringify(microtx)));
    }
  }
}