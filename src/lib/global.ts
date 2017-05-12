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
var console = new Console();

/* Java Class constants that expose static methods */
var Long: Java.java.lang.Long = Packages.java.lang.Long;
var ByteOrder: Java.java.nio.ByteOrder = Packages.java.nio.ByteOrder;
var ByteBuffer: Java.java.nio.ByteBuffer = Packages.java.nio.ByteBuffer;
var Heat: Java.com.heatledger.Heat = Packages.com.heatledger.Heat;
var Convert: Java.com.heatledger.util.Convert = Packages.com.heatledger.util.Convert;
var Crypto2: Java.com.heatledger.crypto.Crypto = Packages.com.heatledger.crypto.Crypto;
var Account: Java.com.heatledger.Account = Packages.com.heatledger.Account;
var EncryptedData: Java.com.heatledger.crypto.EncryptedData = Packages.com.heatledger.crypto.EncryptedData;
var Constants: Java.com.heatledger.Constants = Packages.com.heatledger.Constants;
var Fee: Java.com.heatledger.Fee = Packages.com.heatledger.Fee;