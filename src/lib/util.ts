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
module util {
  export function isDefined(value) {return typeof value !== 'undefined'}
  export function isArray(value) {return Array.isArray(value)}

  export function decryptEncryptedMessage(transaction: Java.com.heatledger.Transaction, secretPhrase: string): string {
    var encryptedData = transaction.encryptedMessage.encryptedData;
    var privateKey = Crypto2.getPrivateKey(secretPhrase);
    var bytes = encryptedData.decrypt(privateKey, transaction.senderPublicKey);
    return Convert.toString(bytes);
  }

  /* Method to parse POST body to JSON, will try JSON first and otherwise parse x-www-form-urlencoded encoded string */
  export function postBodyToJson(body: string) {
    try {
      return JSON.parse(body);
    } catch (e) {
      let json = {};
      let parts = body.split('&');
      for (let i=0; i<parts.length; i++) {
        let split = parts[i].split('=');
        json[decodeURI(split[0])] = decodeURI(split[1]);
      }
      return json;
    }
  }
}