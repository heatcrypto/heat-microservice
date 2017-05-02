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

/* As a work around until we fix https://github.com/dmdeklerk/typescript-generator/tree/nashorn 
   to generate better TypeScript compatible functional interface types.
   We add this typing and comment out the original declarations for all its entries in
   java.heatledger.interfaces.d.ts */

declare namespace Java {
  namespace java.util._function {
    export interface Consumer<T> {
      (arg0: T): void;
    }
  }

  namespace com.heatledger.scripting.BlockchainEventSubscriber {
    export interface Unregister extends java.lang.Runnable {
    }
  }

  namespace java.lang {
    export interface Runnable {
      (): void;
    }
  }

  namespace java.util._function {
    export interface BiConsumer<T, U> {
      (arg0: T, arg1: U): void;
    }
  }
}