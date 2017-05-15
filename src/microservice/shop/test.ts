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
module microservice.shop {
  export function test() {

    // generate the first block
    driver.generateBlock('fake');

    // create an account
    let accountSecretPhrase = 'hello';
    let accountPublicKey = Crypto2.getPublicKey(accountSecretPhrase);
    let account = Account.getId(accountPublicKey);
    
    // create the shop service which in turn creates the customer bundle replicator 
    let service = <ShopService> microservice.manager().createService('shop.service', {
      recipient: account,
      secretPhrase: accountSecretPhrase
    });

    // get the customer bundle
    let bundle = <replicator.BundleMessage<replicator.customer.Customer>> service.customers.$$config.bundle;

    // create a cusomer
    let customer: replicator.customer.Customer = {
      name: 'dirk',
      address: 'Sunny Blv. 777'
    };

    // create the binary bundle message, prepare since: transactionBuilder wants it as HEX
    let messageHex = Convert.toHexString(bundle.create(customer));

    console.log("INSERTING THIS customer="+JSON.stringify(customer));

    // send a message to service account with attached bundle message
    transactionBuilder.payment('fake')
                      .recipientPublicKey(accountPublicKey)
                      .encryptedMessage(messageHex, false) // <- the bundle message is binary and encrypted
                      .amountHQT(1000)
                      .broadcast();

    // generate a block to be subject
    driver.generateBlock('fake');

    // see if we have the customer
    let ret = service.customers.getCustomerByName('dirk');
    if (ret.name != 'dirk') {
      throw new Error("Wrong!!");
    }
    else {
      console.log("SUCCESS!! FOUND THIS customer="+JSON.stringify(ret));
    }
    heat.exit();
  }
}