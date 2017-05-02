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
declare var Java: any;
declare var Packages: any;
declare namespace Java {
  namespace java.lang {
    export interface Long {
      parseUnsignedLong(s: string): number;
      toUnsignedString(i: number): string;
      /**
       * Compares two {@code long} values numerically.
       * The value returned is identical to what would be returned by:
       * <pre>
       *    Long.valueOf(x).compareTo(Long.valueOf(y))
       * </pre>
       *
       * @param  x the first {@code long} to compare
       * @param  y the second {@code long} to compare
       * @return the value {@code 0} if {@code x == y};
       *         a value less than {@code 0} if {@code x < y}; and
       *         a value greater than {@code 0} if {@code x > y}
       */
      compare(x: number, y: number): number;
    }
  }
  namespace java.nio {
    export interface ByteOrder {
      BIG_ENDIAN: ByteOrder;
      LITTLE_ENDIAN: ByteOrder;
    }
    export interface ByteBuffer {
      allocate(capacity: number): ByteBuffer;
      wrap(array: Array<number>, offset: number, length: number): ByteBuffer;
      wrap(array: Array<number>): ByteBuffer;
    }
  }
  namespace com.heatledger {
    export interface Account {
      getId(publicKey: Array<number>): number;
    }
  }
  namespace com.heatledger.crypto {
    export interface Crypto {
      getPublicKey(secretPhrase: string): Array<number>;
      getPrivateKey(secretPhrase: string): Array<number>;
      sign(message: Array<number>, secretPhrase: string): Array<number>;
      verify(signature: Array<number>, message: Array<number>, publicKey: Array<number>): boolean;
      aesEncrypt(plaintext: Array<number>, myPrivateKey: Array<number>, theirPublicKey: Array<number>): Array<number>;
      aesEncrypt(plaintext: Array<number>, myPrivateKey: Array<number>, theirPublicKey: Array<number>, nonce: Array<number>): Array<number>;
      aesDecrypt(ivCiphertext: Array<number>, myPrivateKey: Array<number>, theirPublicKey: Array<number>): Array<number>;
      aesDecrypt(ivCiphertext: Array<number>, myPrivateKey: Array<number>, theirPublicKey: Array<number>, nonce: Array<number>): Array<number>;
      getSharedSecret(myPrivateKey: Array<number>, theirPublicKey: Array<number>): Array<number>;
    }
  }
  namespace com.heatledger.util {
    export interface Convert {
      parseHexString(hex: string): Array<number>;
      toHexString(bytes: Array<number>): string;
      parseLong(o: any): number;
      fullNameToLong(fullNameUTF8: string): number;
      fullNameToLong(bytes: Array<number>): number;
      fullHashToId(hash: Array<number>): number;
      fullHashToId(hash: string): number;
      fromEpochTime(epochTime: number): number;
      emptyToNull(s: string): string;
      nullToEmpty(s: string): string;
      emptyToNull(bytes: Array<number>): Array<number>;
      toBytes(s: string): Array<number>;
      toString(bytes: Array<number>): string;
      readString(buffer: java.nio.ByteBuffer, numBytes: number, maxLength: number): string;
      compress(bytes: Array<number>): Array<number>;
      uncompress(bytes: Array<number>): Array<number>;
      toLiteral(array: Array<number>): string;
    }
  }
  /* Temp measure until we get typescript-generator to list classes within interfaces */
  namespace com.heatledger.Attachment {
    export interface ColoredCoinsAssetTransfer {
      assetId: number;
      quantity: number;
    }
    export interface ColoredCoinsAskOrderCancellation {
      orderId: number;
    }
    export interface ColoredCoinsAskOrderPlacement {
      currencyId: number;
      assetId: number;
      quantityQNT: number;
      price: number;
      expiration: number;
    }
    export interface ColoredCoinsBidOrderCancellation {
      orderId: number;
    }
    export interface ColoredCoinsBidOrderPlacement {
      currencyId: number;
      assetId: number;
      quantityQNT: number;
      price: number;
      expiration: number;
    }
  }
}
