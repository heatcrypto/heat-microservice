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
declare var heat: Java.com.heatledger.scripting.ScriptGlobalBinding;
// Generated using typescript-generator version 1.24-SNAPSHOT on 2017-05-02 14:37:31.

declare namespace Java {

  namespace com.heatledger.scripting {

    export interface ScriptGlobalBinding {
      application: string;
      blockchain: com.heatledger.Blockchain;
      blockchainProcessor: com.heatledger.BlockchainProcessor;
      driver: com.heatledger.Driver;
      epochtime: number;
      events: com.heatledger.scripting.BlockchainEventSubscriber;
      logger: org.slf4j.Logger;
      persist: com.heatledger.persist.Persist;
      simpleStore: com.heatledger.persist.SimpleStore;
      transactionProcessor: com.heatledger.TransactionProcessor;
      transactionStore: com.heatledger.scripting.TransactionStore;
      version: string;

      getAccountId(publicKey: any): number;

      getAccountByName(accountNameHash: number): com.heatledger.Account;

      getAccountByName(fullNameUTF8: string): com.heatledger.Account;

      getApplication(): string;

      getTransactionProcessor(): com.heatledger.TransactionProcessor;

      getPersist(): com.heatledger.persist.Persist;

      getSimpleStore(): com.heatledger.persist.SimpleStore;

      getAsset(assetId: number): com.heatledger.Asset;

      getBidOrders(currencyId: number, assetId: number): java.util.Iterator<com.heatledger.Order.Bid>;

      newMarket(currencyId: number, assetId: number): com.heatledger.scripting.NativeMarket;

      fastForwardTime(count: number): void;

      getTransactionStore(): com.heatledger.scripting.TransactionStore;

      createHTTPClient(): com.heatledger.scripting.HTTPClient;

      getAskOrders(currencyId: number, assetId: number): java.util.Iterator<com.heatledger.Order.Ask>;

      getEvents(): com.heatledger.scripting.BlockchainEventSubscriber;

      getDriver(): com.heatledger.Driver;

      newTransactionBuilder(senderPublicKey: any, amountHQT: number, feeHQT: number, deadline: number, attachment: com.heatledger.Attachment): com.heatledger.Transaction.Builder;

      getBlockchainProcessor(): com.heatledger.BlockchainProcessor;

      getEpochtime(): number;

      getAccount(id: number): com.heatledger.Account;

      getAccount(publicKey: any): com.heatledger.Account;

      getAskOrder(orderId: number): com.heatledger.Order.Ask;

      getBidOrder(orderId: number): com.heatledger.Order.Bid;

      getBlockchain(): com.heatledger.Blockchain;

      newBundle(): com.heatledger.scripting.NativeBundle;

      getVersion(): string;

      getLogger(): org.slf4j.Logger;

      exit(): void;
    }

  }

  namespace com.heatledger {

    export interface Blockchain {
      allBlocksShared: java.util.Iterator<com.heatledger.Block>;
      height: number;
      lastBlock: com.heatledger.Block;

      getBlock(blockId: number): com.heatledger.Block;

      getHeight(): number;

      getLastBlock(): com.heatledger.Block;

      getBlockAtHeight(height: number): com.heatledger.Block;

      hasBlock(blockId: number): boolean;

      getAllBlocksShared(): java.util.Iterator<com.heatledger.Block>;

      getBlocks(from: number, to: number): java.util.Iterator<com.heatledger.Block>;

      getBlocksReversed(from: number, to: number): java.util.Iterator<com.heatledger.Block>;

      getBlockIdsAfter(blockId: number, limit: number): number[];

      getBlocksAfter(blockId: number, limit: number): com.heatledger.Block[];

      getBlockIdAtHeight(height: number): number;
    }

  }

  namespace com.heatledger {

    export interface BlockchainProcessor extends com.heatledger.util.Observable<com.heatledger.Block, com.heatledger.BlockchainProcessor.Event> {
      applyingAccept: boolean;
      lastBlockchainFeeder: com.heatledger.peer.Peer;
      lastBlockchainFeederHeight: number;
      minRollbackHeight: number;
      scanning: boolean;

      getLastBlockchainFeeder(): com.heatledger.peer.Peer;

      getLastBlockchainFeederHeight(): number;

      isScanning(): boolean;

      getMinRollbackHeight(): number;

      processPeerBlock(request: { [index: string]: any }): void;

      fullReset(): void;

      setGetMoreBlocks(getMoreBlocks: boolean): void;

      popOffTo(height: number): com.heatledger.Block[];

      isApplyingAccept(): boolean;

      scan(height: number, validate: boolean): void;
    }

  }

  namespace com.heatledger {

    export interface Driver {

      rollbackToHeight(height: number): com.heatledger.Block[];

      generateBlock(generatorSecretPhrase: string): com.heatledger.Block;

      sendMoney(senderSecretPhrase: string, recipientSecretPhrase: string, amount: number, broadcast: boolean): com.heatledger.Transaction;

      sendMessage(senderSecretPhrase: string, recipientSecretPhrase: string, message: any, broadcast: boolean): com.heatledger.Transaction;

      sendMessage(senderSecretPhrase: string, recipientSecretPhrase: string, message: string, broadcast: boolean): com.heatledger.Transaction;

      sendEncryptedMessage(senderSecretPhrase: string, recipientSecretPhrase: string, message: any, broadcast: boolean): com.heatledger.Transaction;

      sendEncryptedMessage(senderSecretPhrase: string, recipientSecretPhrase: string, message: string, broadcast: boolean): com.heatledger.Transaction;

      assetIssue(senderSecretPhrase: string, descriptionUrl: string, descriptionHash: any, quantityQNT: number, decimals: number, message: any, appendixes: com.heatledger.Appendix[], dillutable: boolean, broadcast: boolean): com.heatledger.Transaction;

      assetIssue(senderSecretPhrase: string, descriptionUrl: string, descriptionHash: any, quantityQNT: number, decimals: number, message: any, dillutable: boolean, broadcast: boolean): com.heatledger.Transaction;

      assetIssue(senderSecretPhrase: string, descriptionUrl: string, descriptionHash: any, quantityQNT: number, decimals: number, dillutable: boolean, broadcast: boolean): com.heatledger.Transaction;

      assetIssueMore(senderSecretPhrase: string, asset: number, quantityQNT: number, broadcast: boolean): com.heatledger.Transaction;

      transferAsset(senderSecretPhrase: string, recipientSecretPhrase: string, asset: number, quantity: number, broadcast: boolean): com.heatledger.Transaction;

      placeAsk(senderSecretPhrase: string, currency: number, asset: number, price: number, quantity: number, expiration: number, broadcast: boolean): com.heatledger.Transaction;

      placeBid(senderSecretPhrase: string, currency: number, asset: number, price: number, quantity: number, expiration: number, broadcast: boolean): com.heatledger.Transaction;

      cancelAsk(senderSecretPhrase: string, orderId: number, broadcast: boolean): com.heatledger.Transaction;

      cancelBid(senderSecretPhrase: string, orderId: number, broadcast: boolean): com.heatledger.Transaction;

      whiteListMarket(senderSecretPhrase: string, currencyId: number, assetId: number, broadcast: boolean): com.heatledger.Transaction;

      broadcastTransaction(transaction: com.heatledger.Transaction): void;
    }

  }

  namespace com.heatledger.scripting {

    export interface BlockchainEventSubscriber {

      subscribeBundle(bundle: com.heatledger.scripting.NativeBundle, account: number, secretPhrase: string, recipient: number, sender: number, unconfirmed: boolean, isPrivate: boolean, onAdd: java.util._function.Consumer<com.heatledger.scripting.NativeBundleEvent>, onRemove: java.util._function.Consumer<com.heatledger.scripting.NativeBundleEvent>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      subscribeAskOrder(market: com.heatledger.scripting.NativeMarket, account: number, unconfirmed: boolean, onCreate: java.util._function.Consumer<com.heatledger.scripting.NativeOrderEvent>, onUpdate: java.util._function.Consumer<com.heatledger.scripting.NativeOrderEvent>, onDelete: java.util._function.Consumer<com.heatledger.scripting.NativeOrderEvent>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      subscribeBidOrder(market: com.heatledger.scripting.NativeMarket, account: number, unconfirmed: boolean, onCreate: java.util._function.Consumer<com.heatledger.scripting.NativeOrderEvent>, onUpdate: java.util._function.Consumer<com.heatledger.scripting.NativeOrderEvent>, onDelete: java.util._function.Consumer<com.heatledger.scripting.NativeOrderEvent>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      subscribeTrade(market: com.heatledger.scripting.NativeMarket, account: number, buyer: number, seller: number, unconfirmed: boolean, onAdd: java.util._function.Consumer<com.heatledger.scripting.NativeTradeEvent>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      subscribeBlock(generator: number, onPush: java.util._function.Consumer<com.heatledger.Block>, onPop: java.util._function.Consumer<com.heatledger.Block>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      subscribeTransaction(type: number, subtype: number, account: number, sender: number, recipient: number, unconfirmed: boolean, onAdd: java.util._function.Consumer<com.heatledger.scripting.NativeTransactionEvent>, onRemove: java.util._function.Consumer<com.heatledger.scripting.NativeTransactionEvent>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      subscribeMessage(account: number, secretPhrase: string, sender: number, recipient: number, unconfirmed: boolean, isPrivate: boolean, onAdd: java.util._function.Consumer<com.heatledger.scripting.NativeMessageEvent>, onRemove: java.util._function.Consumer<com.heatledger.scripting.NativeMessageEvent>): com.heatledger.scripting.BlockchainEventSubscriber.Unregister;

      getInstance(): com.heatledger.scripting.BlockchainEventSubscriber;
    }

  }

  namespace org.slf4j {

    export interface Logger {
      ROOT_LOGGER_NAME: string;
      debugEnabled: boolean;
      errorEnabled: boolean;
      infoEnabled: boolean;
      name: string;
      traceEnabled: boolean;
      warnEnabled: boolean;

      trace(arg0: string, arg1: any[]): void;

      trace(arg0: string, arg1: java.lang.Throwable): void;

      trace(arg0: org.slf4j.Marker, arg1: string): void;

      trace(arg0: org.slf4j.Marker, arg1: string, arg2: any): void;

      trace(arg0: org.slf4j.Marker, arg1: string, arg2: any, arg3: any): void;

      trace(arg0: org.slf4j.Marker, arg1: string, arg2: any[]): void;

      trace(arg0: org.slf4j.Marker, arg1: string, arg2: java.lang.Throwable): void;

      trace(arg0: string): void;

      trace(arg0: string, arg1: any): void;

      trace(arg0: string, arg1: any, arg2: any): void;

      isTraceEnabled(arg0: org.slf4j.Marker): boolean;

      isTraceEnabled(): boolean;

      isErrorEnabled(): boolean;

      isErrorEnabled(arg0: org.slf4j.Marker): boolean;

      isDebugEnabled(arg0: org.slf4j.Marker): boolean;

      isDebugEnabled(): boolean;

      isInfoEnabled(): boolean;

      isInfoEnabled(arg0: org.slf4j.Marker): boolean;

      info(arg0: string, arg1: any): void;

      info(arg0: string): void;

      info(arg0: org.slf4j.Marker, arg1: string, arg2: any): void;

      info(arg0: org.slf4j.Marker, arg1: string): void;

      info(arg0: string, arg1: any, arg2: any): void;

      info(arg0: string, arg1: any[]): void;

      info(arg0: org.slf4j.Marker, arg1: string, arg2: java.lang.Throwable): void;

      info(arg0: org.slf4j.Marker, arg1: string, arg2: any[]): void;

      info(arg0: string, arg1: java.lang.Throwable): void;

      info(arg0: org.slf4j.Marker, arg1: string, arg2: any, arg3: any): void;

      isWarnEnabled(): boolean;

      isWarnEnabled(arg0: org.slf4j.Marker): boolean;

      warn(arg0: string): void;

      warn(arg0: string, arg1: any): void;

      warn(arg0: org.slf4j.Marker, arg1: string, arg2: any): void;

      warn(arg0: org.slf4j.Marker, arg1: string, arg2: any, arg3: any): void;

      warn(arg0: org.slf4j.Marker, arg1: string, arg2: any[]): void;

      warn(arg0: org.slf4j.Marker, arg1: string, arg2: java.lang.Throwable): void;

      warn(arg0: string, arg1: any[]): void;

      warn(arg0: string, arg1: any, arg2: any): void;

      warn(arg0: string, arg1: java.lang.Throwable): void;

      warn(arg0: org.slf4j.Marker, arg1: string): void;

      getName(): string;

      debug(arg0: string, arg1: any, arg2: any): void;

      debug(arg0: string, arg1: any[]): void;

      debug(arg0: string, arg1: java.lang.Throwable): void;

      debug(arg0: string, arg1: any): void;

      debug(arg0: string): void;

      debug(arg0: org.slf4j.Marker, arg1: string, arg2: java.lang.Throwable): void;

      debug(arg0: org.slf4j.Marker, arg1: string, arg2: any[]): void;

      debug(arg0: org.slf4j.Marker, arg1: string, arg2: any, arg3: any): void;

      debug(arg0: org.slf4j.Marker, arg1: string): void;

      debug(arg0: org.slf4j.Marker, arg1: string, arg2: any): void;

      error(arg0: org.slf4j.Marker, arg1: string, arg2: any): void;

      error(arg0: org.slf4j.Marker, arg1: string): void;

      error(arg0: org.slf4j.Marker, arg1: string, arg2: any[]): void;

      error(arg0: org.slf4j.Marker, arg1: string, arg2: any, arg3: any): void;

      error(arg0: org.slf4j.Marker, arg1: string, arg2: java.lang.Throwable): void;

      error(arg0: string): void;

      error(arg0: string, arg1: any): void;

      error(arg0: string, arg1: any, arg2: any): void;

      error(arg0: string, arg1: any[]): void;

      error(arg0: string, arg1: java.lang.Throwable): void;
    }

  }

  namespace com.heatledger.persist {

    export interface Persist extends java.io.Closeable, com.heatledger.persist.Transactional, com.heatledger.persist.HeightProvider, com.heatledger.persist.Versioned {
      SCAN_RESCAN_BOOLEAN: string;
      SCAN_HEIGHT_INT: string;
      SCAN_VALIDATE_BOOLEAN: string;
      VERSION_LATEST: string;
      VERSION_BLACKLIST: string;
      HARDFORK_094_COMPLETE: string;
      VERSION: string;
      ALL_ZEROS: any;
      dir: any;

      blocks(): com.heatledger.persist.BlocksStore;

      getHeight(): number;

      getDir(): any;

      accounts(): com.heatledger.persist.AccountMap;

      accountAssets(): com.heatledger.persist.AccountAssetMap;

      peers(): com.heatledger.persist.PeerMap;

      assets(): com.heatledger.persist.AssetMap;

      accountNames(): com.heatledger.persist.AccountNamesMap;

      whitelistAccounts(): com.heatledger.persist.WhitelistAccountMap;

      whitelistMarkets(): com.heatledger.persist.WhitelistMarketMap;

      effectiveBalance(): com.heatledger.persist.EffectiveBalanceMap;

      unconfirmedPool(): com.heatledger.persist.UnconfirmedPool;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      clearDerived(): void;

      orders(): com.heatledger.persist.OrderMap;

      publicKeys(): com.heatledger.persist.PublicKeyMapImproved;

      shutdown(): void;

      clear(): void;

      trim(trimAtHeight: number): void;

      getInstance(): com.heatledger.persist.Persist;

      close(): void;

      getFile(name: string): any;
    }

  }

  namespace com.heatledger.persist {

    export interface SimpleStore {

      setIntProperty(key: string, value: number): com.heatledger.persist.SimpleStore;

      setBooleanProperty(key: string, value: boolean): com.heatledger.persist.SimpleStore;

      getIntProperty(key: string, defaultValue: number): number;

      shutdown(): void;

      setProperty(key: string, value: string): com.heatledger.persist.SimpleStore;

      getProperty(key: string, defaultValue: string): string;

      getInstance(): com.heatledger.persist.SimpleStore;

      flush(): void;

      getBooleanProperty(key: string, defaultValue: boolean): boolean;
    }

  }

  namespace com.heatledger {

    export interface TransactionProcessor extends com.heatledger.util.Observable<com.heatledger.Transaction[], com.heatledger.TransactionProcessor.Event> {
      allUnconfirmedTransactions: java.util.Iterator<com.heatledger.Transaction>;

      processPeerTransactions(request: { [index: string]: any }): void;

      parseTransaction(bytes: any): com.heatledger.Transaction;

      parseTransaction(json: { [index: string]: any }): com.heatledger.Transaction;

      processLater(transactions: com.heatledger.Transaction[]): void;

      getAllUnconfirmedTransactions(): java.util.Iterator<com.heatledger.Transaction>;

      getUnconfirmedTransaction(transactionId: number): com.heatledger.Transaction;

      removeLostTransactions(transactions: com.heatledger.TransactionImpl[]): void;

      broadcast(transaction: com.heatledger.Transaction): void;
    }

  }

  namespace com.heatledger.scripting {

    export interface TransactionStore {

      getEntryValue(serviceId: string, transactionId: number, entryName: string): string;

      addTransaction(serviceId: string, transaction: com.heatledger.Transaction): void;

      setEntryValue(serviceId: string, transactionId: number, entryName: string, entryValue: string): void;

      registerConfirmedListener(transactionId: number, confirmations: number, listener: java.util._function.Consumer<com.heatledger.scripting.NativeTransactionEvent>): void;

      unRegisterConfirmedListener(transactionId: number, confirmations: number, listener: java.util._function.Consumer<com.heatledger.scripting.NativeTransactionEvent>): void;

      getInstance(): com.heatledger.scripting.TransactionStore;
    }

  }

  namespace com.heatledger {

    export interface Account extends com.heatledger.persist.Marshalable {
      TOTAL_MARSHALLED_SIZE: number;
      accountName: number;
      balanceHQT: number;
      currentLeasingHeightFrom: number;
      currentLeasingHeightTo: number;
      currentLesseeId: number;
      effectiveBalanceHeat: number;
      id: number;
      keyHeight: number;
      lessors: java.util.Iterator<com.heatledger.Account>;
      nextLeasingHeightFrom: number;
      nextLeasingHeightTo: number;
      nextLesseeId: number;
      publicKey: any;
      unconfirmedBalanceHQT: number;

      getAccountByName(accountName: number): com.heatledger.Account;

      getAsset(assetId: number): com.heatledger.Account.AccountAsset;

      getAccount(publicKey: any): com.heatledger.Account;

      getAccount(id: number): com.heatledger.Account;

      getCurrentLeasingHeightFrom(bytes: any): number;

      getCurrentLeasingHeightFrom(): number;

      getCurrentLeasingHeightTo(): number;

      getCurrentLeasingHeightTo(bytes: any): number;

      getCurrentLesee(bytes: any): number;

      addToVirtualAssetBalance(assetId: number, quantity: number): void;

      getVirtualBalance(accountId: number, assetId: number, unconfirmedBalance: number): number;

      addAssetListener(listener: com.heatledger.util.Listener<com.heatledger.Account.AccountAsset>, eventType: com.heatledger.Account.Event): boolean;

      removeAssetListener(listener: com.heatledger.util.Listener<com.heatledger.Account.AccountAsset>, eventType: com.heatledger.Account.Event): boolean;

      addLeaseListener(listener: com.heatledger.util.Listener<com.heatledger.Account.AccountLease>, eventType: com.heatledger.Account.Event): boolean;

      removeLeaseListener(listener: com.heatledger.util.Listener<com.heatledger.Account.AccountLease>, eventType: com.heatledger.Account.Event): boolean;

      addVirtualListener(listener: com.heatledger.util.Listener<com.heatledger.AccountAssetKey>, eventType: com.heatledger.Account.Event): boolean;

      removeVirtualListener(listener: com.heatledger.util.Listener<com.heatledger.AccountAssetKey>, eventType: com.heatledger.Account.Event): boolean;

      getAccountIdByName(accountName: number): number;

      getMarshalledSize(): number;

      getKeyHeight(): number;

      getAccountName(): number;

      setAccountName(accountName: number): void;

      encryptTo(data: any, senderSecretPhrase: string): com.heatledger.crypto.EncryptedData;

      decryptFrom(encryptedData: com.heatledger.crypto.EncryptedData, recipientSecretPhrase: string): any;

      getBalanceHQT(): number;

      getUnconfirmedBalanceHQT(): number;

      getEffectiveBalanceHeat(): number;

      getLessors(): java.util.Iterator<com.heatledger.Account>;

      getGuaranteedBalanceHQT(numberOfConfirmations: number): number;

      getGuaranteedBalanceHQT(numberOfConfirmations: number, currentHeight: number): number;

      getAssetBalance(assetId: number): number;

      getUnconfirmedAssetBalance(assetId: number): number;

      getCurrentLesseeId(): number;

      getNextLesseeId(): number;

      getNextLeasingHeightFrom(): number;

      getNextLeasingHeightTo(): number;

      addToAssetBalance(assetId: number, quantity: number): void;

      addToUnconfirmedAssetBalance(assetId: number, quantity: number): void;

      addToAssetAndUnconfirmedAssetBalance(assetId: number, quantity: number): void;

      addToBalanceHQT(amountHQT: number): void;

      addToUnconfirmedBalanceHQT(amountHQT: number): void;

      addToBalanceAndUnconfirmedBalanceHQT(amountHQT: number): void;

      removeListener(listener: com.heatledger.util.Listener<com.heatledger.Account>, eventType: com.heatledger.Account.Event): boolean;

      addListener(listener: com.heatledger.util.Listener<com.heatledger.Account>, eventType: com.heatledger.Account.Event): boolean;

      write(buffer: java.nio.ByteBuffer): number;

      read(buffer: java.nio.ByteBuffer): void;

      getId(publicKey: any): number;

      getId(): number;

      getPublicKey(): any;
    }

  }

  namespace com.heatledger {

    export interface Asset extends com.heatledger.persist.Marshalable {
      TOTAL_MARSHALLED_SIZE: number;
      accountId: number;
      decimals: number;
      descriptionHash: any;
      descriptionUrl: string;
      dillutable: boolean;
      id: number;
      quantityQNT: number;

      getAccountId(): number;

      getAsset(id: number): com.heatledger.Asset;

      hasAsset(id: number): boolean;

      getDescriptionUrl(): string;

      getDescriptionHash(): any;

      getQuantityQNT(): number;

      updateQuantityQNT(quantityQNT: number): void;

      getDecimals(): number;

      getDillutable(): boolean;

      removeListener(listener: com.heatledger.util.Listener<com.heatledger.Asset>, eventType: com.heatledger.Asset.Event): boolean;

      addListener(listener: com.heatledger.util.Listener<com.heatledger.Asset>, eventType: com.heatledger.Asset.Event): boolean;

      write(buffer: java.nio.ByteBuffer): number;

      read(buffer: java.nio.ByteBuffer): void;

      getId(): number;
    }

  }

  namespace java.util {

    export interface Iterator<E> {

      remove(): void;

      hasNext(): boolean;

      next(): E;

      forEachRemaining(arg0: java.util._function.Consumer<any>): void;
    }

  }

  namespace com.heatledger.Order {

    export interface Bid extends com.heatledger.Order {

      getBidOrder(orderId: number): com.heatledger.Order.Bid;

      isCurrentlyValid(): boolean;

      removeListener(listener: com.heatledger.util.Listener<com.heatledger.Order.Bid>, eventType: com.heatledger.Order.Event): boolean;

      addListener(listener: com.heatledger.util.Listener<com.heatledger.Order.Bid>, eventType: com.heatledger.Order.Event): boolean;

      getType(): string;
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeMarket {
      assetId: number;
      currencyId: number;

      getCurrencyId(): number;

      getAssetId(): number;
    }

  }

  namespace com.heatledger.scripting {

    export interface HTTPClient {

      post(url: string, json: string): string;

      get(url: string): string;
    }

  }

  namespace com.heatledger.Order {

    export interface Ask extends com.heatledger.Order {

      getAskOrder(orderId: number): com.heatledger.Order.Ask;

      isCurrentlyValid(): boolean;

      removeListener(listener: com.heatledger.util.Listener<com.heatledger.Order.Ask>, eventType: com.heatledger.Order.Event): boolean;

      addListener(listener: com.heatledger.util.Listener<com.heatledger.Order.Ask>, eventType: com.heatledger.Order.Event): boolean;

      getType(): string;
    }

  }

  namespace com.heatledger.Transaction {

    export interface Builder {

      publicNameAssignment(publicNameAssignment: com.heatledger.Appendix.PublicNameAssignment): com.heatledger.Transaction.Builder;

      ecBlockId(blockId: number): com.heatledger.Transaction.Builder;

      recipientId(recipientId: number): com.heatledger.Transaction.Builder;

      encryptedMessage(encryptedMessage: com.heatledger.Appendix.EncryptedMessage): com.heatledger.Transaction.Builder;

      encryptToSelfMessage(encryptToSelfMessage: com.heatledger.Appendix.EncryptToSelfMessage): com.heatledger.Transaction.Builder;

      publicKeyAnnouncement(publicKeyAnnouncement: com.heatledger.Appendix.PublicKeyAnnouncement): com.heatledger.Transaction.Builder;

      privateNameAnnouncement(privateNameAnnouncement: com.heatledger.Appendix.PrivateNameAnnouncement): com.heatledger.Transaction.Builder;

      privateNameAssignment(privateNameAssignment: com.heatledger.Appendix.PrivateNameAssignment): com.heatledger.Transaction.Builder;

      publicNameAnnouncement(publicNameAnnouncement: com.heatledger.Appendix.PublicNameAnnouncement): com.heatledger.Transaction.Builder;

      ecBlockHeight(height: number): com.heatledger.Transaction.Builder;

      height(height: number): com.heatledger.Transaction.Builder;

      build(): com.heatledger.Transaction;

      build(secretPhrase: string): com.heatledger.TransactionImpl;

      timestamp(timestamp: number): com.heatledger.Transaction.Builder;

      message(message: com.heatledger.Appendix.Message): com.heatledger.Transaction.Builder;
    }

  }

  namespace com.heatledger {

    export interface Attachment extends com.heatledger.Appendix {
      ORDINARY_PAYMENT: com.heatledger.Attachment.EmptyAttachment;
      ARBITRARY_MESSAGE: com.heatledger.Attachment.EmptyAttachment;
      transactionType: com.heatledger.TransactionType;

      getTransactionType(): com.heatledger.TransactionType;
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeBundle {
      bundleHeader: any;
      minLength: number;
      sortedFields: com.heatledger.scripting.BundleField[];

      addString(name: string): com.heatledger.scripting.NativeBundle;

      getSortedFields(): com.heatledger.scripting.BundleField[];

      getBundleHeader(): any;

      addBoolean(name: string): com.heatledger.scripting.NativeBundle;

      addByte(name: string): com.heatledger.scripting.NativeBundle;

      addShort(name: string): com.heatledger.scripting.NativeBundle;

      addInteger(name: string): com.heatledger.scripting.NativeBundle;

      addLong(name: string): com.heatledger.scripting.NativeBundle;

      getMinLength(): number;
    }

  }

  namespace com.heatledger {

    export interface Block extends com.heatledger.persist.Marshalable {
      JSONObject: { [index: string]: any };
      baseTarget: number;
      blockSignature: any;
      bytes: any;
      cumulativeDifficulty: number;
      generationSignature: any;
      generatorId: number;
      generatorPublicKey: any;
      height: number;
      id: number;
      nextBlockId: number;
      payloadHash: any;
      payloadLength: number;
      previousBlockHash: any;
      previousBlockId: number;
      stringId: string;
      timestamp: number;
      totalAmountHQT: number;
      totalFeeHQT: number;
      transactions: com.heatledger.Transaction[];
      version: number;

      getHeight(): number;

      getJSONObject(): { [index: string]: any };

      getTotalFeeHQT(): number;

      getPayloadHash(): any;

      getStringId(): string;

      getNextBlockId(): number;

      getPayloadLength(): number;

      getGeneratorPublicKey(): any;

      getPreviousBlockId(): number;

      getPreviousBlockHash(): any;

      getTotalAmountHQT(): number;

      getGenerationSignature(): any;

      getBlockSignature(): any;

      getBaseTarget(): number;

      getCumulativeDifficulty(): number;

      getGeneratorId(): number;

      getTransactions(): com.heatledger.Transaction[];

      getVersion(): number;

      getTimestamp(): number;

      getBytes(): any;

      getId(): number;
    }

  }

  namespace com.heatledger.peer {

    export interface Peer extends java.lang.Comparable<com.heatledger.peer.Peer> {
      announcedAddress: string;
      application: string;
      blacklisted: boolean;
      blacklistingCause: string;
      downloadedVolume: number;
      hallmark: com.heatledger.peer.Hallmark;
      lastUpdated: number;
      peerAddress: string;
      platform: string;
      software: string;
      state: com.heatledger.peer.Peer.State;
      uploadedVolume: number;
      version: string;
      weight: number;
      wellKnown: boolean;

      getWeight(): number;

      isBlacklisted(): boolean;

      blacklist(cause: java.lang.Exception): void;

      blacklist(cause: string): void;

      getApplication(): string;

      getPeerAddress(): string;

      getAnnouncedAddress(): string;

      getSoftware(): string;

      getHallmark(): com.heatledger.peer.Hallmark;

      shareAddress(): boolean;

      isWellKnown(): boolean;

      unBlacklist(): void;

      deactivate(): void;

      getDownloadedVolume(): number;

      getUploadedVolume(): number;

      getLastUpdated(): number;

      getBlacklistingCause(): string;

      getVersion(): string;

      getPlatform(): string;

      send(request: org.json.simple.JSONStreamAware): { [index: string]: any };

      send(request: org.json.simple.JSONStreamAware, maxResponseSize: number): { [index: string]: any };

      remove(): void;

      getState(): com.heatledger.peer.Peer.State;
    }

  }

  namespace com.heatledger {

    export interface Transaction {
      ECBlockHeight: number;
      ECBlockId: number;
      JSONObject: { [index: string]: any };
      amountHQT: number;
      appendages: com.heatledger.Appendix[];
      attachment: com.heatledger.Attachment;
      block: com.heatledger.Block;
      blockId: number;
      blockTimestamp: number;
      bytes: any;
      deadline: number;
      encryptToSelfMessage: com.heatledger.Appendix.EncryptToSelfMessage;
      encryptedMessage: com.heatledger.Appendix.EncryptedMessage;
      expiration: number;
      feeHQT: number;
      fullHash: string;
      height: number;
      id: number;
      index: number;
      message: com.heatledger.Appendix.Message;
      privateNameAnnouncement: com.heatledger.Appendix.PrivateNameAnnouncement;
      privateNameAssignment: com.heatledger.Appendix.PrivateNameAssignment;
      publicKeyAnnouncement: com.heatledger.Appendix.PublicKeyAnnouncement;
      publicNameAnnouncement: com.heatledger.Appendix.PublicNameAnnouncement;
      publicNameAssignment: com.heatledger.Appendix.PublicNameAssignment;
      recipientId: number;
      safeIndex: number;
      senderId: number;
      senderPublicKey: any;
      signature: any;
      stringId: string;
      timestamp: number;
      type: com.heatledger.TransactionType;
      unsignedBytes: any;
      version: number;

      getBlock(): com.heatledger.Block;

      getHeight(): number;

      getJSONObject(): { [index: string]: any };

      getStringId(): string;

      getRecipientId(): number;

      getSenderId(): number;

      getPublicKeyAnnouncement(): com.heatledger.Appendix.PublicKeyAnnouncement;

      getEncryptedMessage(): com.heatledger.Appendix.EncryptedMessage;

      getSenderPublicKey(): any;

      getBlockId(): number;

      getSafeIndex(): number;

      getBlockTimestamp(): number;

      getDeadline(): number;

      getAmountHQT(): number;

      getFeeHQT(): number;

      getFullHash(): string;

      getAttachment(): com.heatledger.Attachment;

      verifySignature(): boolean;

      getUnsignedBytes(): any;

      getEncryptToSelfMessage(): com.heatledger.Appendix.EncryptToSelfMessage;

      getPrivateNameAnnouncement(): com.heatledger.Appendix.PrivateNameAnnouncement;

      getPrivateNameAssignment(): com.heatledger.Appendix.PrivateNameAssignment;

      getPublicNameAnnouncement(): com.heatledger.Appendix.PublicNameAnnouncement;

      getPublicNameAssignment(): com.heatledger.Appendix.PublicNameAssignment;

      getAppendages(): com.heatledger.Appendix[];

      getECBlockHeight(): number;

      getECBlockId(): number;

      sign(secretPhrase: string): void;

      validate(): void;

      getVersion(): number;

      getIndex(): number;

      getTimestamp(): number;

      getExpiration(): number;

      getBytes(): any;

      getMessage(): com.heatledger.Appendix.Message;

      getId(): number;

      getType(): com.heatledger.TransactionType;

      getSignature(): any;
    }

  }

  namespace com.heatledger.scripting.BlockchainEventSubscriber {

    export interface Unregister extends java.lang.Runnable {

      run(): void;

      add(args: java.lang.Runnable[]): void;
    }

  }

  /*namespace java.util._function {

    export interface Consumer<T> {

      andThen(arg0: java.util._function.Consumer<any>): java.util._function.Consumer<T>;

      accept(arg0: T): void;
    }

  }*/

  namespace com.heatledger.scripting {

    export interface NativeBundleEvent extends com.heatledger.scripting.NativeTransactionEvent {
      bundle: { [index: string]: any };

      getBundle(): { [index: string]: any };
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeOrderEvent extends com.heatledger.scripting.NativeEvent {
      order: com.heatledger.Order;

      getOrder(): com.heatledger.Order;
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeTradeEvent extends com.heatledger.scripting.NativeEvent {
      trade: com.heatledger.Trade;

      getTrade(): com.heatledger.Trade;
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeTransactionEvent extends com.heatledger.scripting.NativeEvent {
      transaction: com.heatledger.Transaction;

      getTransaction(): com.heatledger.Transaction;
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeMessageEvent extends com.heatledger.scripting.NativeTransactionEvent {
      message: com.heatledger.scripting.NativeMessage;

      getMessage(): com.heatledger.scripting.NativeMessage;
    }

  }

  namespace java.lang {

    export interface Throwable extends java.io.Serializable {
      cause: java.lang.Throwable;
      localizedMessage: string;
      message: string;
      stackTrace: java.lang.StackTraceElement[];
      suppressed: java.lang.Throwable[];

      printStackTrace(): void;

      printStackTrace(arg0: java.io.PrintWriter): void;

      printStackTrace(arg0: java.io.PrintStream): void;

      fillInStackTrace(): java.lang.Throwable;

      getCause(): java.lang.Throwable;

      initCause(arg0: java.lang.Throwable): java.lang.Throwable;

      toString(): string;

      getMessage(): string;

      getLocalizedMessage(): string;

      getStackTrace(): java.lang.StackTraceElement[];

      setStackTrace(arg0: java.lang.StackTraceElement[]): void;

      addSuppressed(arg0: java.lang.Throwable): void;

      getSuppressed(): java.lang.Throwable[];
    }

  }

  namespace org.slf4j {

    export interface Marker extends java.io.Serializable {
      ANY_MARKER: string;
      ANY_NON_NULL_MARKER: string;
      name: string;

      hasChildren(): boolean;

      hasReferences(): boolean;

      add(arg0: org.slf4j.Marker): void;

      remove(arg0: org.slf4j.Marker): boolean;

      equals(arg0: any): boolean;

      hashCode(): number;

      getName(): string;

      contains(arg0: org.slf4j.Marker): boolean;

      contains(arg0: string): boolean;

      iterator(): java.util.Iterator<org.slf4j.Marker>;
    }

  }

  namespace com.heatledger.persist {

    export interface BlocksStore extends java.io.Closeable, com.heatledger.persist.Transactional {
      allBlocksNonShared: java.util.Iterator<com.heatledger.BlockImpl>;
      allBlocksShared: java.util.Iterator<com.heatledger.BlockImpl>;
      blocksFile: com.heatledger.persist.BlocksFile;

      getBlock(blockId: number): com.heatledger.BlockImpl;

      getBlockAtHeight(height: number): com.heatledger.BlockImpl;

      hasBlock(blockId: number): boolean;

      getAllBlocksShared(): java.util.Iterator<com.heatledger.BlockImpl>;

      getBlocksAfter(blockId: number, limit: number): com.heatledger.BlockImpl[];

      getBlockIdAtHeight(height: number): number;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      getTransaction(transactionId: number): com.heatledger.Transaction;

      hasTransaction(transactionId: number): boolean;

      getBlocksFile(): com.heatledger.persist.BlocksFile;

      addBlock(block: com.heatledger.BlockImpl): void;

      getAllBlocksNonShared(): java.util.Iterator<com.heatledger.BlockImpl>;

      getBlocksShared(from: number, to: number): java.util.Iterator<com.heatledger.BlockImpl>;

      getBlocksNonShared(from: number, to: number): java.util.Iterator<com.heatledger.BlockImpl>;

      getBlocksNonSharedReversed(from: number, to: number): java.util.Iterator<com.heatledger.BlockImpl>;

      getBlocksIdsAfter(blockId: number, limit: number): number[];

      dumpTransactions(): void;

      findLastBlock(): com.heatledger.BlockImpl;

      findOneBeforeLastBlock(): com.heatledger.BlockImpl;

      deleteBlocksFrom(blockId: number): void;

      dumpBlocksRestore(): void;

      clear(): void;

      create(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface AccountMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned, com.heatledger.persist.RestorableMapListener, com.heatledger.persist.PersistObservable<number, com.heatledger.Account> {

      dump(): void;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      getLessors(accountId: number, height: number): java.util.Iterator<com.heatledger.Account>;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      dumpVersion(): void;

      dumpVersionAnalysis(): void;

      getLeaseChangingAccounts(height: number): java.util.Iterator<com.heatledger.Account>;

      dumpRestore(): void;

      forEachUsing(consumer: java.util._function.BiConsumer<number, com.heatledger.Account>): void;

      removeListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Account>): boolean;

      addListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Account>): boolean;

      get(id: number): com.heatledger.Account;

      count(): number;

      clear(): void;

      trim(trimAtHeight: number): void;

      size(): number;

      delete(account: com.heatledger.Account): void;

      create(): void;

      save(account: com.heatledger.Account): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface AccountAssetMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned, com.heatledger.persist.RestorableMapListener, com.heatledger.persist.PersistObservable<number, com.heatledger.Account.AccountAsset> {
      accountAssetsSlow: { [index: string]: com.heatledger.Account.AccountAsset[] };

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      getAccountAssetsSlow(): { [index: string]: com.heatledger.Account.AccountAsset[] };

      forEachUsing(consumer: java.util._function.Consumer<com.heatledger.Account.AccountAsset>): void;

      removeListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Account.AccountAsset>): boolean;

      addListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Account.AccountAsset>): boolean;

      get(account: number, asset: number): com.heatledger.Account.AccountAsset;

      clear(): void;

      trim(trimAtHeight: number): void;

      delete(accountAsset: com.heatledger.Account.AccountAsset): void;

      create(): void;

      save(accountAsset: com.heatledger.Account.AccountAsset): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface PeerMap extends java.io.Closeable, com.heatledger.persist.Transactional {

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      loadPeers(): string[];

      deletePeers(peers: string[]): void;

      addPeers(peers: string[]): void;

      clear(): void;

      create(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface AssetMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned, com.heatledger.persist.RestorableMapListener, com.heatledger.persist.PersistObservable<number, com.heatledger.Asset> {

      getAsset(id: number): com.heatledger.Asset;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      hasAsset(id: number): boolean;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      foreachAssetSlow(consumer: java.util._function.Consumer<com.heatledger.Asset>): void;

      removeListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Asset>): boolean;

      addListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Asset>): boolean;

      clear(): void;

      trim(trimAtHeight: number): void;

      create(): void;

      save(asset: com.heatledger.Asset): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface AccountNamesMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned, com.heatledger.persist.RestorableMapListener, com.heatledger.persist.PersistObservable<number, number> {

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      removeListener(listener: com.heatledger.persist.PersistListener<number, number>): boolean;

      addListener(listener: com.heatledger.persist.PersistListener<number, number>): boolean;

      remove(accountName: number): void;

      get(accountName: number): number;

      put(accountName: number, account: number): void;

      count(): number;

      clear(): void;

      trim(trimAtHeight: number): void;

      create(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface WhitelistAccountMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned {

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      setHeightProvider(heightProvider: com.heatledger.persist.HeightProvider): void;

      allowed(assetId: number, accountId: number): boolean;

      add(assetId: number, accountId: number, endHeight: number): void;

      clear(): void;

      trim(trimAtHeight: number): void;

      delete(assetId: number, accountId: number): void;

      create(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface WhitelistMarketMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned {

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      allowed(currencyId: number, assetId: number): boolean;

      add(currencyId: number, assetId: number): void;

      clear(): void;

      trim(trimAtHeight: number): void;

      create(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface EffectiveBalanceMap extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned, com.heatledger.persist.RestorableMapListener {

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      getGuaranteedBalanceHQT(account: number, balanceHQT: number, numberOfConfirmations: number, currentHeight: number): number;

      addToGuaranteedBalanceHQT(account: number, amountHQT: number, blockchainHeight: number): void;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      put(accountId: number, addAmountHQT: number, height: number): void;

      clear(): void;

      trim(trimAtHeight: number): void;

      create(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface UnconfirmedPool extends java.io.Closeable, com.heatledger.persist.Transactional, com.heatledger.persist.RestorableMapListener {
      CONSTANT_VALUE_SIZE: number;
      expiredTransactions: java.util.Iterator<com.heatledger.UnconfirmedTransaction>;
      file: any;
      sortedTransactions: java.util.Iterator<com.heatledger.UnconfirmedTransaction>;

      dump(writer: java.io.PrintWriter): void;

      dump(): void;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      addTransaction(transaction: com.heatledger.UnconfirmedTransaction): void;

      getTransaction(transactionId: number): com.heatledger.UnconfirmedTransaction;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      dumpRestore(): void;

      getExpiredTransactions(): java.util.Iterator<com.heatledger.UnconfirmedTransaction>;

      getSortedTransactions(): java.util.Iterator<com.heatledger.UnconfirmedTransaction>;

      removeTransaction(transaction: com.heatledger.Transaction): boolean;

      hasTransaction(transactionId: number): boolean;

      clear(): void;

      create(): void;

      close(): void;

      getFile(): any;
    }

  }

  namespace com.heatledger.persist {

    export interface OrderMap extends java.io.Closeable, com.heatledger.persist.Transactional, com.heatledger.persist.Versioned {

      getBidOrders(currencyId: number, assetId: number): java.util.Iterator<com.heatledger.Order.Bid>;

      getAskOrders(currencyId: number, assetId: number): java.util.Iterator<com.heatledger.Order.Ask>;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      getAskOrder(id: number): com.heatledger.Order.Ask;

      getBidOrder(id: number): com.heatledger.Order.Bid;

      removeAsk(currencyId: number, assetId: number, orderId: number): void;

      getNextAskOrder(pairKey: com.heatledger.persist.OrderPairKey): com.heatledger.Order.Ask;

      getNextBidOrder(pairKey: com.heatledger.persist.OrderPairKey): com.heatledger.Order.Bid;

      getNextUnconfirmedAskOrder(pairKey: com.heatledger.persist.OrderPairKey): com.heatledger.Order.Ask;

      getNextUnconfirmedBidOrder(pairKey: com.heatledger.persist.OrderPairKey): com.heatledger.Order.Bid;

      getExpiredAskOrders(expiration: number): java.util.Iterator<com.heatledger.Order.Ask>;

      getExpiredBidOrders(expiration: number): java.util.Iterator<com.heatledger.Order.Bid>;

      removeBid(currencyId: number, assetId: number, orderId: number): void;

      resetAskUnconfirmed(orderIds: number[]): void;

      resetBidUnconfirmed(orderIds: number[]): void;

      addAskListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Order.Ask>): boolean;

      removeAskListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Order.Ask>): boolean;

      addBidListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Order.Bid>): boolean;

      removeBidListener(listener: com.heatledger.persist.PersistListener<number, com.heatledger.Order.Bid>): boolean;

      dumpAsk(): void;

      dumpBid(): void;

      dumpSortedOrderIds(): void;

      forEachAskOrderSlow(consumer: java.util._function.Consumer<com.heatledger.Order.Ask>): void;

      forEachBidOrderSlow(consumer: java.util._function.Consumer<com.heatledger.Order.Bid>): void;

      clear(): void;

      trim(trimAtHeight: number): void;

      create(): void;

      save(bid: com.heatledger.Order.Bid): void;

      save(ask: com.heatledger.Order.Ask): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface PublicKeyMapImproved extends com.heatledger.persist.Transactional, java.io.Closeable, com.heatledger.persist.Versioned, com.heatledger.persist.RestorableMapListener {

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      rollback(rollbackToHeight: number): void;

      getAccountPublicKey(id: number): com.heatledger.AccountPublicKey;

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;

      forEachAccountPublicKey(consumer: java.util._function.BiConsumer<number, com.heatledger.AccountPublicKey>): void;

      has(id: number): boolean;

      put(id: number, keyHeight: number, publicKey: any): void;

      clear(): void;

      trim(trimAtHeight: number): void;

      size(): number;

      create(): void;

      close(): void;
    }

  }

  namespace java.io {

    export interface Closeable extends java.lang.AutoCloseable {

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface Transactional {
      inTransaction: boolean;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface HeightProvider {
      height: number;

      getHeight(): number;
    }

  }

  namespace com.heatledger.persist {

    export interface Versioned {

      rollback(rollbackToHeight: number): void;

      trim(trimAtHeight: number): void;
    }

  }

  namespace com.heatledger {

    export interface TransactionImpl extends com.heatledger.Transaction, com.heatledger.persist.Marshalable {
      senderPublicKeyApplied: boolean;
      size: number;

      getBlock(): com.heatledger.Block;

      getHeight(): number;

      parseTransaction(buffer: java.nio.ByteBuffer): com.heatledger.TransactionImpl;

      getJSONObject(): { [index: string]: any };

      getStringId(): string;

      getRecipientId(): number;

      getSenderId(): number;

      getPublicKeyAnnouncement(): com.heatledger.Appendix.PublicKeyAnnouncement;

      getEncryptedMessage(): com.heatledger.Appendix.EncryptedMessage;

      getSenderPublicKey(): any;

      getBlockId(): number;

      getSafeIndex(): number;

      getBlockTimestamp(): number;

      getDeadline(): number;

      getAmountHQT(): number;

      getFeeHQT(): number;

      getFullHash(): string;

      getAttachment(): com.heatledger.Attachment;

      verifySignature(): boolean;

      getUnsignedBytes(): any;

      getEncryptToSelfMessage(): com.heatledger.Appendix.EncryptToSelfMessage;

      getPrivateNameAnnouncement(): com.heatledger.Appendix.PrivateNameAnnouncement;

      getPrivateNameAssignment(): com.heatledger.Appendix.PrivateNameAssignment;

      getPublicNameAnnouncement(): com.heatledger.Appendix.PublicNameAnnouncement;

      getPublicNameAssignment(): com.heatledger.Appendix.PublicNameAssignment;

      getAppendages(): com.heatledger.Appendix[];

      getECBlockHeight(): number;

      getECBlockId(): number;

      setHeight(height: number): void;

      isSenderPublicKeyApplied(): boolean;

      createFromBuffer(buffer: java.nio.ByteBuffer): com.heatledger.TransactionImpl;

      isAccountNameDuplicate(accountNameDuplicates: { [index: string]: number }): boolean;

      sign(secretPhrase: string): void;

      validate(): void;

      getVersion(): number;

      getIndex(): number;

      getTimestamp(): number;

      getExpiration(): number;

      bytes(): any;

      equals(o: any): boolean;

      hashCode(): number;

      getBytes(): any;

      write(buffer: java.nio.ByteBuffer): number;

      getMessage(): com.heatledger.Appendix.Message;

      read(buffer: java.nio.ByteBuffer): void;

      getId(): number;

      getType(): com.heatledger.TransactionType;

      getSignature(): any;

      getSize(): number;
    }

  }

  namespace com.heatledger.Account {

    export interface AccountAsset {
      accountId: number;
      assetId: number;
      quantity: number;
      unconfirmedQuantity: number;

      getAccountId(): number;

      getAssetId(): number;

      getQuantity(): number;

      getUnconfirmedQuantity(): number;

      setQuantity(quantity: number): void;

      setUnconfirmedQuantity(unconfirmedQuantity: number): void;

      toString(): string;
    }

  }

  namespace com.heatledger.util {

    export interface Listener<T> {

      notify(t: T): void;
    }

  }

  namespace com.heatledger.Account {

    export interface AccountLease {
      lessorId: number;
      lesseeId: number;
      fromHeight: number;
      toHeight: number;
    }

  }

  namespace com.heatledger {

    export interface AccountAssetKey {
      accountId: number;
      assetId: number;

      getAccountId(): number;

      getAssetId(): number;

      equals(o: any): boolean;

      hashCode(): number;
    }

  }

  namespace com.heatledger.crypto {

    export interface EncryptedData {
      EMPTY_DATA: com.heatledger.crypto.EncryptedData;
      data: any;
      nonce: any;
      size: number;

      readEncryptedData(buffer: java.nio.ByteBuffer, length: number, maxLength: number, nonce: number): com.heatledger.crypto.EncryptedData;

      readEncryptedData(buffer: java.nio.ByteBuffer, length: number, maxLength: number): com.heatledger.crypto.EncryptedData;

      getNonce(): any;

      getData(): any;

      encrypt(plaintext: any, myPrivateKey: any, theirPublicKey: any): com.heatledger.crypto.EncryptedData;

      decrypt(myPrivateKey: any, theirPublicKey: any): any;

      getSize(): number;
    }

  }

  namespace java.nio {

    export interface ByteBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.ByteBuffer> {
      char: string;
      double: number;
      float: number;
      int: number;
      long: number;
      short: number;

      get(arg0: number): number;

      get(arg0: any, arg1: number, arg2: number): java.nio.ByteBuffer;

      get(): number;

      get(arg0: any): java.nio.ByteBuffer;

      put(arg0: any, arg1: number, arg2: number): java.nio.ByteBuffer;

      put(arg0: number): java.nio.ByteBuffer;

      put(arg0: java.nio.ByteBuffer): java.nio.ByteBuffer;

      put(arg0: number, arg1: number): java.nio.ByteBuffer;

      put(arg0: any): java.nio.ByteBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      compareTo(arg0: any): number;

      compareTo(arg0: java.nio.ByteBuffer): number;

      getShort(): number;

      getShort(arg0: number): number;

      putShort(arg0: number, arg1: number): java.nio.ByteBuffer;

      putShort(arg0: number): java.nio.ByteBuffer;

      getChar(arg0: number): string;

      getChar(): string;

      putChar(arg0: number, arg1: string): java.nio.ByteBuffer;

      putChar(arg0: string): java.nio.ByteBuffer;

      getInt(): number;

      getInt(arg0: number): number;

      putInt(arg0: number): java.nio.ByteBuffer;

      putInt(arg0: number, arg1: number): java.nio.ByteBuffer;

      getLong(arg0: number): number;

      getLong(): number;

      putLong(arg0: number, arg1: number): java.nio.ByteBuffer;

      putLong(arg0: number): java.nio.ByteBuffer;

      getFloat(): number;

      getFloat(arg0: number): number;

      putFloat(arg0: number): java.nio.ByteBuffer;

      putFloat(arg0: number, arg1: number): java.nio.ByteBuffer;

      getDouble(arg0: number): number;

      getDouble(): number;

      putDouble(arg0: number, arg1: number): java.nio.ByteBuffer;

      putDouble(arg0: number): java.nio.ByteBuffer;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): any;

      array(): any;

      arrayOffset(): number;

      wrap(arg0: any): java.nio.ByteBuffer;

      wrap(arg0: any, arg1: number, arg2: number): java.nio.ByteBuffer;

      allocate(arg0: number): java.nio.ByteBuffer;

      duplicate(): java.nio.ByteBuffer;

      allocateDirect(arg0: number): java.nio.ByteBuffer;

      slice(): java.nio.ByteBuffer;

      asReadOnlyBuffer(): java.nio.ByteBuffer;

      compact(): java.nio.ByteBuffer;

      order(arg0: java.nio.ByteOrder): java.nio.ByteBuffer;

      order(): java.nio.ByteOrder;

      asCharBuffer(): java.nio.CharBuffer;

      asShortBuffer(): java.nio.ShortBuffer;

      asIntBuffer(): java.nio.IntBuffer;

      asLongBuffer(): java.nio.LongBuffer;

      asFloatBuffer(): java.nio.FloatBuffer;

      asDoubleBuffer(): java.nio.DoubleBuffer;
    }

  }

  namespace com.heatledger.persist {

    export interface Marshalable {

      write(buffer: java.nio.ByteBuffer): number;

      read(buffer: java.nio.ByteBuffer): void;
    }

  }

  namespace com.heatledger {

    export interface Order {
      accountId: number;
      assetId: number;
      cancelled: boolean;
      currencyId: number;
      currentlyValid: boolean;
      expiration: number;
      height: number;
      id: number;
      price: number;
      quantity: number;
      timestamp: number;
      transactionHeight: number;
      transactionIndex: number;
      type: string;
      unconfirmed: boolean;
      unconfirmedQuantity: number;

      getHeight(): number;

      getAccountId(): number;

      isCurrentlyValid(): boolean;

      getUnconfirmed(): boolean;

      getCurrencyId(): number;

      getAssetId(): number;

      getQuantity(): number;

      getUnconfirmedQuantity(): number;

      setCancelled(cancelled: boolean): void;

      getCancelled(): boolean;

      removeExpiredOrders(lastBlock: com.heatledger.Block): void;

      getPrice(): number;

      getTransactionHeight(): number;

      getTransactionIndex(): number;

      getTimestamp(): number;

      getExpiration(): number;

      toString(): string;

      init(): void;

      getId(): number;

      getType(): string;
    }

  }

  namespace com.heatledger.Appendix {

    export interface PublicNameAssignment extends com.heatledger.Appendix.AbstractAppendix {
      fullName: any;
      nameHash: number;

      getFullName(): any;

      getFee(): com.heatledger.Fee;

      getNameHash(): number;
    }

  }

  namespace com.heatledger.Appendix {

    export interface EncryptedMessage extends com.heatledger.Appendix.AbstractEncryptedMessage {
    }

  }

  namespace com.heatledger.Appendix {

    export interface EncryptToSelfMessage extends com.heatledger.Appendix.AbstractEncryptedMessage {
    }

  }

  namespace com.heatledger.Appendix {

    export interface PublicKeyAnnouncement extends com.heatledger.Appendix.AbstractAppendix {
      publicKey: any;

      getFee(): com.heatledger.Fee;

      getPublicKey(): any;
    }

  }

  namespace com.heatledger.Appendix {

    export interface PrivateNameAnnouncement extends com.heatledger.Appendix.AbstractAppendix {
      name: number;

      getFee(): com.heatledger.Fee;

      getName(): number;
    }

  }

  namespace com.heatledger.Appendix {

    export interface PrivateNameAssignment extends com.heatledger.Appendix.AbstractAppendix {
      name: number;

      getFee(): com.heatledger.Fee;

      getName(): number;
    }

  }

  namespace com.heatledger.Appendix {

    export interface PublicNameAnnouncement extends com.heatledger.Appendix.AbstractAppendix {
      fullName: any;
      nameHash: number;

      getFullName(): any;

      getFee(): com.heatledger.Fee;

      getNameHash(): number;
    }

  }

  namespace com.heatledger.Appendix {

    export interface Message extends com.heatledger.Appendix.AbstractAppendix {
      message: any;
      text: boolean;

      getFee(): com.heatledger.Fee;

      isText(): boolean;

      getMessage(): any;
    }

  }

  namespace com.heatledger.Attachment {

    export interface EmptyAttachment extends com.heatledger.Attachment.AbstractAttachment {
    }

  }

  namespace com.heatledger {

    export interface TransactionType {
      TYPE_PAYMENT: number;
      TYPE_MESSAGING: number;
      TYPE_COLORED_COINS: number;
      TYPE_ACCOUNT_CONTROL: number;
      SUBTYPE_PAYMENT_ORDINARY_PAYMENT: number;
      SUBTYPE_MESSAGING_ARBITRARY_MESSAGE: number;
      SUBTYPE_COLORED_COINS_ASSET_ISSUANCE: number;
      SUBTYPE_COLORED_COINS_ASSET_ISSUE_MORE: number;
      SUBTYPE_COLORED_COINS_ASSET_TRANSFER: number;
      SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT: number;
      SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT: number;
      SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION: number;
      SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION: number;
      SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_ADDITION: number;
      SUBTYPE_COLORED_COINS_WHITELIST_ACCOUNT_REMOVAL: number;
      SUBTYPE_COLORED_COINS_WHITELIST_MARKET: number;
      SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING: number;
      subtype: number;
      type: number;

      getSubtype(): number;

      isUnconfirmedDuplicate(transaction: com.heatledger.Transaction, duplicates: { [index: string]: { [index: string]: boolean } }): boolean;

      canHaveRecipient(): boolean;

      mustHaveRecipient(): boolean;

      findTransactionType(type: number, subtype: number): com.heatledger.TransactionType;

      toString(): string;

      getType(): number;
    }

  }

  namespace com.heatledger {

    export interface Appendix {
      JSONObject: { [index: string]: any };
      fee: com.heatledger.Fee;
      size: number;
      version: number;

      putBytes(buffer: java.nio.ByteBuffer): void;

      getJSONObject(): { [index: string]: any };

      getFee(): com.heatledger.Fee;

      getVersion(): number;

      getSize(): number;
    }

  }

  namespace com.heatledger.scripting {

    export interface BundleField {
      fingerprint: string;
      minLength: number;
      name: string;

      getMinLength(): number;

      getFingerprint(): string;

      getName(): string;

      decode(buffer: java.nio.ByteBuffer): any;

      encode(buffer: java.nio.ByteBuffer, value: any): void;
    }

  }

  namespace com.heatledger.peer {

    export interface Hallmark {
      accountId: number;
      date: number;
      hallmarkString: string;
      host: string;
      publicKey: any;
      signature: any;
      valid: boolean;
      weight: number;

      getWeight(): number;

      getAccountId(): number;

      parseDate(dateValue: string): number;

      formatDate(date: number): string;

      generateHallmark(secretPhrase: string, host: string, weight: number, date: number): string;

      parseHallmark(hallmarkString: string): com.heatledger.peer.Hallmark;

      getHallmarkString(): string;

      isValid(): boolean;

      getDate(): number;

      getSignature(): any;

      getHost(): string;

      getPublicKey(): any;
    }

  }

  namespace java.lang {

    export interface Exception extends java.lang.Throwable {
    }

  }

  namespace org.json.simple {

    export interface JSONStreamAware {

      writeJSONString(arg0: java.io.Writer): void;
    }

  }

  namespace com.heatledger.util {

    export interface Observable<T, E> {

      removeListener(listener: com.heatledger.util.Listener<T>, eventType: E): boolean;

      addListener(listener: com.heatledger.util.Listener<T>, eventType: E): boolean;
    }

  }

  /*namespace java.lang {

    export interface Runnable {

      run(): void;
    }

  }*/

  namespace com.heatledger.scripting {

    export interface NativeEvent {
      unconfirmed: boolean;

      getUnconfirmed(): boolean;
    }

  }

  namespace com.heatledger {

    export interface Trade {
      askOrderHeight: number;
      askOrderId: number;
      assetId: number;
      assetProperties: string;
      bidOrderHeight: number;
      bidOrderId: number;
      blockId: number;
      buy: boolean;
      buyerId: number;
      currencyId: number;
      currencyProperties: string;
      height: number;
      price: number;
      quantity: number;
      sellerId: number;
      timestamp: number;

      getHeight(): number;

      getCurrencyId(): number;

      getAssetId(): number;

      getBlockId(): number;

      getBuyerId(): number;

      getSellerId(): number;

      getQuantity(): number;

      getAskOrderId(): number;

      getBidOrderId(): number;

      getAskOrderHeight(): number;

      getBidOrderHeight(): number;

      getCurrencyProperties(): string;

      getAssetProperties(): string;

      isBuy(): boolean;

      addRemoveTradesListener(listener: com.heatledger.util.Listener<com.heatledger.Trade[]>, eventType: com.heatledger.Trade.Event): boolean;

      removeRemoveTradesListener(listener: com.heatledger.util.Listener<com.heatledger.Trade[]>, eventType: com.heatledger.Trade.Event): boolean;

      getPrice(): number;

      getTimestamp(): number;

      removeListener(listener: com.heatledger.util.Listener<com.heatledger.Trade>, eventType: com.heatledger.Trade.Event): boolean;

      addListener(listener: com.heatledger.util.Listener<com.heatledger.Trade>, eventType: com.heatledger.Trade.Event): boolean;

      toString(): string;
    }

  }

  namespace com.heatledger.scripting {

    export interface NativeMessage {
      asString: string;
      data: any;
      text: boolean;

      getAsString(): string;

      getData(): any;

      isText(): boolean;
    }

  }

  namespace java.lang {

    export interface StackTraceElement extends java.io.Serializable {
      className: string;
      fileName: string;
      lineNumber: number;
      methodName: string;
      nativeMethod: boolean;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      getFileName(): string;

      getLineNumber(): number;

      getClassName(): string;

      getMethodName(): string;

      isNativeMethod(): boolean;
    }

  }

  namespace java.io {

    export interface PrintWriter extends java.io.Writer {

      println(arg0: number): void;

      println(arg0: string[]): void;

      println(arg0: number): void;

      println(arg0: string): void;

      println(arg0: any): void;

      println(arg0: number): void;

      println(arg0: string): void;

      println(arg0: boolean): void;

      println(): void;

      println(arg0: number): void;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.io.PrintWriter;

      append(arg0: java.lang.CharSequence): java.io.PrintWriter;

      append(arg0: java.lang.CharSequence): java.lang.Appendable;

      append(arg0: string): java.lang.Appendable;

      append(arg0: java.lang.CharSequence): java.io.Writer;

      append(arg0: string): java.io.Writer;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.io.Writer;

      append(arg0: string): java.io.PrintWriter;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.lang.Appendable;

      format(arg0: java.util.Locale, arg1: string, arg2: any[]): java.io.PrintWriter;

      format(arg0: string, arg1: any[]): java.io.PrintWriter;

      write(arg0: string[], arg1: number, arg2: number): void;

      write(arg0: string, arg1: number, arg2: number): void;

      write(arg0: string[]): void;

      write(arg0: number): void;

      write(arg0: string): void;

      print(arg0: number): void;

      print(arg0: number): void;

      print(arg0: number): void;

      print(arg0: string): void;

      print(arg0: boolean): void;

      print(arg0: any): void;

      print(arg0: string): void;

      print(arg0: string[]): void;

      print(arg0: number): void;

      flush(): void;

      close(): void;

      checkError(): boolean;

      printf(arg0: java.util.Locale, arg1: string, arg2: any[]): java.io.PrintWriter;

      printf(arg0: string, arg1: any[]): java.io.PrintWriter;
    }

  }

  namespace java.io {

    export interface PrintStream extends java.io.FilterOutputStream, java.lang.Appendable, java.io.Closeable {

      println(arg0: number): void;

      println(arg0: number): void;

      println(arg0: number): void;

      println(arg0: any): void;

      println(arg0: string): void;

      println(arg0: string[]): void;

      println(): void;

      println(arg0: boolean): void;

      println(arg0: string): void;

      println(arg0: number): void;

      append(arg0: java.lang.CharSequence): java.lang.Appendable;

      append(arg0: string): java.lang.Appendable;

      append(arg0: string): java.io.PrintStream;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.lang.Appendable;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.io.PrintStream;

      append(arg0: java.lang.CharSequence): java.io.PrintStream;

      format(arg0: java.util.Locale, arg1: string, arg2: any[]): java.io.PrintStream;

      format(arg0: string, arg1: any[]): java.io.PrintStream;

      write(arg0: number): void;

      write(arg0: any, arg1: number, arg2: number): void;

      print(arg0: boolean): void;

      print(arg0: number): void;

      print(arg0: number): void;

      print(arg0: number): void;

      print(arg0: any): void;

      print(arg0: string): void;

      print(arg0: string[]): void;

      print(arg0: string): void;

      print(arg0: number): void;

      flush(): void;

      close(): void;

      checkError(): boolean;

      printf(arg0: string, arg1: any[]): java.io.PrintStream;

      printf(arg0: java.util.Locale, arg1: string, arg2: any[]): java.io.PrintStream;
    }

  }

  namespace java.io {

    export interface Serializable {
    }

  }

  namespace com.heatledger {

    export interface BlockImpl extends com.heatledger.Block, com.heatledger.persist.Marshalable {
      NEXT_BLOCK_ID_INDEX: number;
      transactions: com.heatledger.TransactionImpl[];

      getHeight(): number;

      getJSONObject(): { [index: string]: any };

      getTotalFeeHQT(): number;

      getPayloadHash(): any;

      getStringId(): string;

      getNextBlockId(): number;

      getPayloadLength(): number;

      getGeneratorPublicKey(): any;

      getPreviousBlockId(): number;

      getPreviousBlockHash(): any;

      getTotalAmountHQT(): number;

      getGenerationSignature(): any;

      getBlockSignature(): any;

      getBaseTarget(): number;

      getCumulativeDifficulty(): number;

      getGeneratorId(): number;

      getTransactions(): com.heatledger.TransactionImpl[];

      setTransactions(blockTransactions: com.heatledger.TransactionImpl[]): void;

      parseBlock(blockData: { [index: string]: any }): com.heatledger.BlockImpl;

      setPrevious(block: com.heatledger.BlockImpl): void;

      sign(secretPhrase: string): void;

      getVersion(): number;

      getTimestamp(): number;

      equals(o: any): boolean;

      hashCode(): number;

      getBytes(): any;

      write(buffer: java.nio.ByteBuffer): number;

      read(buffer: java.nio.ByteBuffer): void;

      getId(): number;

      reset(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface BlocksFile extends java.io.Closeable, com.heatledger.persist.Transactional {
      blockIdMap: com.heatledger.persist.RestorableMap;
      elementCount: number;
      file: any;
      isReadonly: boolean;
      transactionIdMap: com.heatledger.persist.RestorableMap;

      hasBlock(id: number): boolean;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      hasTransaction(transactionId: number): boolean;

      addBlock(block: com.heatledger.BlockImpl): void;

      dumpTransactions(): void;

      deleteBlocksFrom(id: number): void;

      dumpBlocksRestore(): void;

      updateNextBlockIdForBlock(id: number, nextBlockId: number): void;

      getElementCount(): number;

      createSharedIterator(index: number, length: number): java.util.Iterator<com.heatledger.BlockImpl>;

      createNonSharedIterator(index: number, length: number): java.util.Iterator<com.heatledger.BlockImpl>;

      createReverseNonSharedIterator(index: number, length: number): java.util.Iterator<com.heatledger.BlockImpl>;

      getById(id: number, marshalable: com.heatledger.persist.Marshalable): boolean;

      getBlockHeight(id: number): number;

      findBlockIdAtIndex(index: number): number;

      lasBlockId(): number;

      oneBeforeLasBlockId(): number;

      getTransactionBlockId(transactionId: number): number;

      getTransactionIdMap(): com.heatledger.persist.RestorableMap;

      getBlockIdMap(): com.heatledger.persist.RestorableMap;

      getIsReadonly(): boolean;

      getByIndex(index: number, marshalable: com.heatledger.persist.Marshalable): boolean;

      clear(): void;

      push(blockId: number, marshalable: com.heatledger.persist.Marshalable, transactionIds: number[]): void;

      pop(): void;

      create(): void;

      close(): void;

      getFile(): any;
    }

  }

  /*namespace java.util._function {

    export interface BiConsumer<T, U> {

      andThen(arg0: java.util._function.BiConsumer<any, any>): java.util._function.BiConsumer<T, U>;

      accept(arg0: T, arg1: U): void;
    }

  }*/

  namespace com.heatledger.persist {

    export interface PersistListener<KEY, VALUE> {

      notifyRemove(key: KEY, value: VALUE): void;

      notifyPut(key: KEY, value: VALUE): void;
    }

  }

  namespace com.heatledger.persist {

    export interface RestorableMapListener {

      restorableMapOnPut(key: any, value: any): void;

      restorableMapOnRemove(key: any): void;
    }

  }

  namespace com.heatledger {

    export interface UnconfirmedTransaction extends com.heatledger.persist.SortedLinkedList.SortedLinkedListAbstractNode, com.heatledger.Transaction, com.heatledger.persist.Marshalable {
      HEIGHT_INDEX: number;
      ARRIVAL_TIMESTAMP_INDEX: number;
      TRANSACTION_BYTES_LENGTH_INDEX: number;
      TRANSACTION_BYTES_INDEX: number;
      arrivalTimestamp: number;
      size: number;
      transaction: com.heatledger.TransactionImpl;

      getBlock(): com.heatledger.Block;

      getHeight(): number;

      getJSONObject(): { [index: string]: any };

      getStringId(): string;

      getRecipientId(): number;

      getSenderId(): number;

      getPublicKeyAnnouncement(): com.heatledger.Appendix.PublicKeyAnnouncement;

      getEncryptedMessage(): com.heatledger.Appendix.EncryptedMessage;

      getSenderPublicKey(): any;

      getBlockId(): number;

      getSafeIndex(): number;

      getBlockTimestamp(): number;

      getDeadline(): number;

      getAmountHQT(): number;

      getFeeHQT(): number;

      getFullHash(): string;

      getAttachment(): com.heatledger.Attachment;

      verifySignature(): boolean;

      getUnsignedBytes(): any;

      getEncryptToSelfMessage(): com.heatledger.Appendix.EncryptToSelfMessage;

      getPrivateNameAnnouncement(): com.heatledger.Appendix.PrivateNameAnnouncement;

      getPrivateNameAssignment(): com.heatledger.Appendix.PrivateNameAssignment;

      getPublicNameAnnouncement(): com.heatledger.Appendix.PublicNameAnnouncement;

      getPublicNameAssignment(): com.heatledger.Appendix.PublicNameAssignment;

      getAppendages(): com.heatledger.Appendix[];

      getECBlockHeight(): number;

      getECBlockId(): number;

      getTransaction(): com.heatledger.TransactionImpl;

      setHeight(height: number): void;

      getArrivalTimestamp(): number;

      sign(secretPhrase: string): void;

      validate(): void;

      getVersion(): number;

      getIndex(): number;

      getTimestamp(): number;

      getExpiration(): number;

      equals(o: any): boolean;

      hashCode(): number;

      getBytes(): any;

      write(buffer: java.nio.ByteBuffer): number;

      getMessage(): com.heatledger.Appendix.Message;

      read(buffer: java.nio.ByteBuffer): void;

      getId(): number;

      getType(): com.heatledger.TransactionType;

      getSignature(): any;

      getSize(): number;
    }

  }

  namespace com.heatledger.persist {

    export interface OrderPairKey {

      equals(o: any): boolean;

      toString(): string;

      hashCode(): number;
    }

  }

  namespace com.heatledger {

    export interface AccountPublicKey {
      keyHeight: number;
      publicKey: any;

      getKeyHeight(): number;

      setPublicKey(publicKey: any): void;

      setKeyHeight(keyHeight: number): void;

      getPublicKey(): any;
    }

  }

  namespace java.lang {

    export interface AutoCloseable {

      close(): void;
    }

  }

  namespace java.nio {

    export interface ByteOrder {
      BIG_ENDIAN: java.nio.ByteOrder;
      LITTLE_ENDIAN: java.nio.ByteOrder;

      toString(): string;

      nativeOrder(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface CharBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.CharBuffer>, java.lang.Appendable, java.lang.CharSequence, java.lang.Readable {

      get(arg0: number): string;

      get(): string;

      get(arg0: string[], arg1: number, arg2: number): java.nio.CharBuffer;

      get(arg0: string[]): java.nio.CharBuffer;

      put(arg0: string): java.nio.CharBuffer;

      put(arg0: number, arg1: string): java.nio.CharBuffer;

      put(arg0: java.nio.CharBuffer): java.nio.CharBuffer;

      put(arg0: string[]): java.nio.CharBuffer;

      put(arg0: string, arg1: number, arg2: number): java.nio.CharBuffer;

      put(arg0: string): java.nio.CharBuffer;

      put(arg0: string[], arg1: number, arg2: number): java.nio.CharBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      append(arg0: string): java.lang.Appendable;

      append(arg0: string): java.nio.CharBuffer;

      append(arg0: java.lang.CharSequence): java.nio.CharBuffer;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.lang.Appendable;

      append(arg0: java.lang.CharSequence): java.lang.Appendable;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.nio.CharBuffer;

      hashCode(): number;

      compareTo(arg0: java.nio.CharBuffer): number;

      compareTo(arg0: any): number;

      length(): number;

      charAt(arg0: number): string;

      subSequence(arg0: number, arg1: number): java.lang.CharSequence;

      subSequence(arg0: number, arg1: number): java.nio.CharBuffer;

      chars(): any;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): string[];

      array(): any;

      arrayOffset(): number;

      read(arg0: java.nio.CharBuffer): number;

      wrap(arg0: java.lang.CharSequence): java.nio.CharBuffer;

      wrap(arg0: string[], arg1: number, arg2: number): java.nio.CharBuffer;

      wrap(arg0: string[]): java.nio.CharBuffer;

      wrap(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.nio.CharBuffer;

      allocate(arg0: number): java.nio.CharBuffer;

      duplicate(): java.nio.CharBuffer;

      slice(): java.nio.CharBuffer;

      asReadOnlyBuffer(): java.nio.CharBuffer;

      compact(): java.nio.CharBuffer;

      order(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface ShortBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.ShortBuffer> {

      get(arg0: number[], arg1: number, arg2: number): java.nio.ShortBuffer;

      get(arg0: number[]): java.nio.ShortBuffer;

      get(): number;

      get(arg0: number): number;

      put(arg0: number[]): java.nio.ShortBuffer;

      put(arg0: number[], arg1: number, arg2: number): java.nio.ShortBuffer;

      put(arg0: number, arg1: number): java.nio.ShortBuffer;

      put(arg0: java.nio.ShortBuffer): java.nio.ShortBuffer;

      put(arg0: number): java.nio.ShortBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      compareTo(arg0: any): number;

      compareTo(arg0: java.nio.ShortBuffer): number;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): number[];

      array(): any;

      arrayOffset(): number;

      wrap(arg0: number[], arg1: number, arg2: number): java.nio.ShortBuffer;

      wrap(arg0: number[]): java.nio.ShortBuffer;

      allocate(arg0: number): java.nio.ShortBuffer;

      duplicate(): java.nio.ShortBuffer;

      slice(): java.nio.ShortBuffer;

      asReadOnlyBuffer(): java.nio.ShortBuffer;

      compact(): java.nio.ShortBuffer;

      order(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface IntBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.IntBuffer> {

      get(arg0: number[], arg1: number, arg2: number): java.nio.IntBuffer;

      get(arg0: number[]): java.nio.IntBuffer;

      get(): number;

      get(arg0: number): number;

      put(arg0: number[]): java.nio.IntBuffer;

      put(arg0: number[], arg1: number, arg2: number): java.nio.IntBuffer;

      put(arg0: number, arg1: number): java.nio.IntBuffer;

      put(arg0: java.nio.IntBuffer): java.nio.IntBuffer;

      put(arg0: number): java.nio.IntBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      compareTo(arg0: any): number;

      compareTo(arg0: java.nio.IntBuffer): number;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): number[];

      array(): any;

      arrayOffset(): number;

      wrap(arg0: number[], arg1: number, arg2: number): java.nio.IntBuffer;

      wrap(arg0: number[]): java.nio.IntBuffer;

      allocate(arg0: number): java.nio.IntBuffer;

      duplicate(): java.nio.IntBuffer;

      slice(): java.nio.IntBuffer;

      asReadOnlyBuffer(): java.nio.IntBuffer;

      compact(): java.nio.IntBuffer;

      order(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface LongBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.LongBuffer> {

      get(arg0: number[], arg1: number, arg2: number): java.nio.LongBuffer;

      get(arg0: number[]): java.nio.LongBuffer;

      get(): number;

      get(arg0: number): number;

      put(arg0: number[]): java.nio.LongBuffer;

      put(arg0: number[], arg1: number, arg2: number): java.nio.LongBuffer;

      put(arg0: number, arg1: number): java.nio.LongBuffer;

      put(arg0: java.nio.LongBuffer): java.nio.LongBuffer;

      put(arg0: number): java.nio.LongBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      compareTo(arg0: any): number;

      compareTo(arg0: java.nio.LongBuffer): number;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): number[];

      array(): any;

      arrayOffset(): number;

      wrap(arg0: number[], arg1: number, arg2: number): java.nio.LongBuffer;

      wrap(arg0: number[]): java.nio.LongBuffer;

      allocate(arg0: number): java.nio.LongBuffer;

      duplicate(): java.nio.LongBuffer;

      slice(): java.nio.LongBuffer;

      asReadOnlyBuffer(): java.nio.LongBuffer;

      compact(): java.nio.LongBuffer;

      order(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface FloatBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.FloatBuffer> {

      get(arg0: number[], arg1: number, arg2: number): java.nio.FloatBuffer;

      get(arg0: number[]): java.nio.FloatBuffer;

      get(): number;

      get(arg0: number): number;

      put(arg0: number[]): java.nio.FloatBuffer;

      put(arg0: number[], arg1: number, arg2: number): java.nio.FloatBuffer;

      put(arg0: number, arg1: number): java.nio.FloatBuffer;

      put(arg0: java.nio.FloatBuffer): java.nio.FloatBuffer;

      put(arg0: number): java.nio.FloatBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      compareTo(arg0: any): number;

      compareTo(arg0: java.nio.FloatBuffer): number;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): number[];

      array(): any;

      arrayOffset(): number;

      wrap(arg0: number[], arg1: number, arg2: number): java.nio.FloatBuffer;

      wrap(arg0: number[]): java.nio.FloatBuffer;

      allocate(arg0: number): java.nio.FloatBuffer;

      duplicate(): java.nio.FloatBuffer;

      slice(): java.nio.FloatBuffer;

      asReadOnlyBuffer(): java.nio.FloatBuffer;

      compact(): java.nio.FloatBuffer;

      order(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface DoubleBuffer extends java.nio.Buffer, java.lang.Comparable<java.nio.DoubleBuffer> {

      get(arg0: number[], arg1: number, arg2: number): java.nio.DoubleBuffer;

      get(arg0: number[]): java.nio.DoubleBuffer;

      get(): number;

      get(arg0: number): number;

      put(arg0: number[]): java.nio.DoubleBuffer;

      put(arg0: number[], arg1: number, arg2: number): java.nio.DoubleBuffer;

      put(arg0: number, arg1: number): java.nio.DoubleBuffer;

      put(arg0: java.nio.DoubleBuffer): java.nio.DoubleBuffer;

      put(arg0: number): java.nio.DoubleBuffer;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      compareTo(arg0: any): number;

      compareTo(arg0: java.nio.DoubleBuffer): number;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): number[];

      array(): any;

      arrayOffset(): number;

      wrap(arg0: number[], arg1: number, arg2: number): java.nio.DoubleBuffer;

      wrap(arg0: number[]): java.nio.DoubleBuffer;

      allocate(arg0: number): java.nio.DoubleBuffer;

      duplicate(): java.nio.DoubleBuffer;

      slice(): java.nio.DoubleBuffer;

      asReadOnlyBuffer(): java.nio.DoubleBuffer;

      compact(): java.nio.DoubleBuffer;

      order(): java.nio.ByteOrder;
    }

  }

  namespace java.nio {

    export interface Buffer {
      direct: boolean;
      readOnly: boolean;

      limit(arg0: number): java.nio.Buffer;

      limit(): number;

      clear(): java.nio.Buffer;

      remaining(): number;

      isDirect(): boolean;

      hasArray(): boolean;

      array(): any;

      position(arg0: number): java.nio.Buffer;

      position(): number;

      arrayOffset(): number;

      capacity(): number;

      mark(): java.nio.Buffer;

      reset(): java.nio.Buffer;

      flip(): java.nio.Buffer;

      rewind(): java.nio.Buffer;

      hasRemaining(): boolean;

      isReadOnly(): boolean;
    }

  }

  namespace com.heatledger {

    export interface Fee {
      ARBITRARY_MESSAGE_FEE: com.heatledger.Fee;
      ORDINARY_PAYMENT_FEE: com.heatledger.Fee;
      EFFECTIVE_BALANCE_LEASING_FEE: com.heatledger.Fee;
      ORDER_CANCELLATION_FEE: com.heatledger.Fee;
      ORDER_PLACEMENT_FEE: com.heatledger.Fee;
      ASSET_TRANSFER_FEE: com.heatledger.Fee;
      ASSET_ISSUE_MORE_FEE: com.heatledger.Fee;
      WHITELIST_ACCOUNT_FEE: com.heatledger.Fee;
      WHITELIST_MARKET_FEE: com.heatledger.Fee;
      ASSET_ISSUANCE_FEE: com.heatledger.Fee;
      PRIVATE_NAME_ANNOUNCEMENT_APPENDIX_FEE: com.heatledger.Fee;
      PRIVATE_NAME_ASSIGNEMENT_APPENDIX_FEE: com.heatledger.Fee;
      PUBLIC_NAME_ANNOUNCEMENT_APPENDIX_FEE: com.heatledger.Fee;
      PUBLIC_NAME_ASSIGNEMENT_APPENDIX_FEE: com.heatledger.Fee;
      PUBLICKEY_ANNOUNCEMENT_APPENDIX_FEE: com.heatledger.Fee;
      MESSAGE_APPENDIX_FEE: com.heatledger.Fee;
      ENCRYPTED_MESSAGE_APPENDIX_FEE: com.heatledger.Fee;
    }

  }

  namespace com.heatledger.Appendix {

    export interface AbstractAppendix extends com.heatledger.Appendix {

      putBytes(buffer: java.nio.ByteBuffer): void;

      getJSONObject(): { [index: string]: any };

      getVersion(): number;

      getSize(): number;
    }

  }

  namespace com.heatledger.Appendix {

    export interface AbstractEncryptedMessage extends com.heatledger.Appendix.AbstractAppendix {
      encryptedData: com.heatledger.crypto.EncryptedData;
      text: boolean;

      getFee(): com.heatledger.Fee;

      getEncryptedData(): com.heatledger.crypto.EncryptedData;

      isText(): boolean;
    }

  }

  namespace com.heatledger.Attachment {

    export interface AbstractAttachment extends com.heatledger.Appendix.AbstractAppendix, com.heatledger.Attachment {
    }

  }

  namespace java.io {

    export interface Writer extends java.lang.Appendable, java.io.Closeable, java.io.Flushable {

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.io.Writer;

      append(arg0: string): java.io.Writer;

      append(arg0: java.lang.CharSequence): java.io.Writer;

      append(arg0: string): java.lang.Appendable;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.lang.Appendable;

      append(arg0: java.lang.CharSequence): java.lang.Appendable;

      write(arg0: string[]): void;

      write(arg0: string[], arg1: number, arg2: number): void;

      write(arg0: number): void;

      write(arg0: string, arg1: number, arg2: number): void;

      write(arg0: string): void;

      flush(): void;

      close(): void;
    }

  }

  namespace java.lang {

    export interface Comparable<T> {

      compareTo(arg0: T): number;
    }

  }

  namespace java.lang {

    export interface CharSequence {

      toString(): string;

      length(): number;

      charAt(arg0: number): string;

      subSequence(arg0: number, arg1: number): java.lang.CharSequence;

      chars(): any;

      codePoints(): any;
    }

  }

  namespace java.lang {

    export interface Appendable {

      append(arg0: java.lang.CharSequence): java.lang.Appendable;

      append(arg0: java.lang.CharSequence, arg1: number, arg2: number): java.lang.Appendable;

      append(arg0: string): java.lang.Appendable;
    }

  }

  namespace java.util {

    export interface Locale extends java.lang.Cloneable, java.io.Serializable {
      ENGLISH: java.util.Locale;
      FRENCH: java.util.Locale;
      GERMAN: java.util.Locale;
      ITALIAN: java.util.Locale;
      JAPANESE: java.util.Locale;
      KOREAN: java.util.Locale;
      CHINESE: java.util.Locale;
      SIMPLIFIED_CHINESE: java.util.Locale;
      TRADITIONAL_CHINESE: java.util.Locale;
      FRANCE: java.util.Locale;
      GERMANY: java.util.Locale;
      ITALY: java.util.Locale;
      JAPAN: java.util.Locale;
      KOREA: java.util.Locale;
      CHINA: java.util.Locale;
      PRC: java.util.Locale;
      TAIWAN: java.util.Locale;
      UK: java.util.Locale;
      US: java.util.Locale;
      CANADA: java.util.Locale;
      CANADA_FRENCH: java.util.Locale;
      ROOT: java.util.Locale;
      PRIVATE_USE_EXTENSION: string;
      UNICODE_LOCALE_EXTENSION: string;
      ISO3Country: string;
      ISO3Language: string;
      country: string;
      displayCountry: string;
      displayLanguage: string;
      displayName: string;
      displayScript: string;
      displayVariant: string;
      extensionKeys: string[];
      language: string;
      script: string;
      unicodeLocaleAttributes: string[];
      unicodeLocaleKeys: string[];
      variant: string;

      equals(arg0: any): boolean;

      toString(): string;

      hashCode(): number;

      clone(): any;

      getLanguage(): string;

      getDefault(arg0: java.util.Locale.Category): java.util.Locale;

      getDefault(): java.util.Locale;

      lookup(arg0: java.util.Locale.LanguageRange[], arg1: java.util.Locale[]): java.util.Locale;

      filter(arg0: java.util.Locale.LanguageRange[], arg1: java.util.Locale[]): java.util.Locale[];

      filter(arg0: java.util.Locale.LanguageRange[], arg1: java.util.Locale[], arg2: java.util.Locale.FilteringMode): java.util.Locale[];

      setDefault(arg0: java.util.Locale.Category, arg1: java.util.Locale): void;

      setDefault(arg0: java.util.Locale): void;

      getAvailableLocales(): java.util.Locale[];

      getISOCountries(): string[];

      getISOLanguages(): string[];

      getScript(): string;

      getCountry(): string;

      getVariant(): string;

      hasExtensions(): boolean;

      stripExtensions(): java.util.Locale;

      getExtension(arg0: string): string;

      getExtensionKeys(): string[];

      getUnicodeLocaleAttributes(): string[];

      getUnicodeLocaleType(arg0: string): string;

      getUnicodeLocaleKeys(): string[];

      toLanguageTag(): string;

      forLanguageTag(arg0: string): java.util.Locale;

      getISO3Language(): string;

      getISO3Country(): string;

      getDisplayLanguage(arg0: java.util.Locale): string;

      getDisplayLanguage(): string;

      getDisplayScript(arg0: java.util.Locale): string;

      getDisplayScript(): string;

      getDisplayCountry(arg0: java.util.Locale): string;

      getDisplayCountry(): string;

      getDisplayVariant(): string;

      getDisplayVariant(arg0: java.util.Locale): string;

      getDisplayName(arg0: java.util.Locale): string;

      getDisplayName(): string;

      filterTags(arg0: java.util.Locale.LanguageRange[], arg1: string[]): string[];

      filterTags(arg0: java.util.Locale.LanguageRange[], arg1: string[], arg2: java.util.Locale.FilteringMode): string[];

      lookupTag(arg0: java.util.Locale.LanguageRange[], arg1: string[]): string;
    }

  }

  namespace java.io {

    export interface FilterOutputStream extends java.io.OutputStream {

      write(arg0: any, arg1: number, arg2: number): void;

      write(arg0: any): void;

      write(arg0: number): void;

      flush(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface RestorableMap extends java.io.Closeable, com.heatledger.persist.Transactional {
      chronicleMap: { [index: string]: any };
      empty: boolean;

      dump(): void;

      isInTransaction(): boolean;

      beginTransaction(): void;

      endTransaction(): void;

      rollbackTransaction(): void;

      getUsing(key: any, usingValue: any): any;

      dumpRestore(): void;

      forEachUsing(consumer: java.util._function.BiConsumer<any, any>, usingKey: any, usingValue: any): void;

      forEachUsing(consumer: java.util._function.BiConsumer<any, any>): void;

      setListener(listener: com.heatledger.persist.RestorableMapListener): void;

      setViewer(viewer: com.heatledger.persist.RestorableMapViewer): void;

      getChronicleMap(): { [index: string]: any };

      build(builder: com.heatledger.persist.RestorableMapBuilder): com.heatledger.persist.RestorableMap;

      remove(key: any): void;

      remove(key: any, value: any): boolean;

      get(key: any): any;

      put(key: any, value: any): void;

      clear(): void;

      isEmpty(): boolean;

      size(): number;

      create(): void;

      close(): void;

      containsKey(key: any): boolean;

      forEach(consumer: java.util._function.BiConsumer<any, any>): void;
    }

  }

  namespace com.heatledger.persist {

    export interface PersistObservable<KEY, VALUE> {

      removeListener(listener: com.heatledger.persist.PersistListener<KEY, VALUE>): boolean;

      addListener(listener: com.heatledger.persist.PersistListener<KEY, VALUE>): boolean;
    }

  }

  namespace com.heatledger.persist.SortedLinkedList {

    export interface SortedLinkedListAbstractNode {
    }

  }

  namespace java.lang {

    export interface Readable {

      read(arg0: java.nio.CharBuffer): number;
    }

  }

  namespace java.io {

    export interface Flushable {

      flush(): void;
    }

  }

  namespace java.util.Locale {

    export interface LanguageRange {
      MAX_WEIGHT: number;
      MIN_WEIGHT: number;
      range: string;
      weight: number;

      getWeight(): number;

      getRange(): string;

      mapEquivalents(arg0: java.util.Locale.LanguageRange[], arg1: { [index: string]: string[] }): java.util.Locale.LanguageRange[];

      equals(arg0: any): boolean;

      hashCode(): number;

      parse(arg0: string): java.util.Locale.LanguageRange[];

      parse(arg0: string, arg1: { [index: string]: string[] }): java.util.Locale.LanguageRange[];
    }

  }

  namespace java.lang {

    export interface Cloneable {
    }

  }

  namespace java.io {

    export interface OutputStream extends java.io.Closeable, java.io.Flushable {

      write(arg0: any, arg1: number, arg2: number): void;

      write(arg0: any): void;

      write(arg0: number): void;

      flush(): void;

      close(): void;
    }

  }

  namespace com.heatledger.persist {

    export interface RestorableMapViewer {

      keyToString(key: any): string;

      valueToMap(key: any, value: any): { [index: string]: any };

      tracePut(key: any, value: any): void;

      traceRemove(key: any): void;

      printAll(maps: { [index: string]: any }[]): void;
    }

  }

  namespace com.heatledger.persist {

    export interface RestorableMapBuilder {

      constantKeySample(constantKeySample: any): com.heatledger.persist.RestorableMapBuilder;

      constantValueSample(constantValueSample: any): com.heatledger.persist.RestorableMapBuilder;

      restoreEntries(restoreEntries: number): com.heatledger.persist.RestorableMapBuilder;

      emptyRestoreConstant(emptyRestoreConstant: any): com.heatledger.persist.RestorableMapBuilder;

      build(): com.heatledger.persist.RestorableMap;

      deleteOnExit(deleteOnExit: boolean): com.heatledger.persist.RestorableMapBuilder;

      file(file: any): com.heatledger.persist.RestorableMapBuilder;

      entries(entries: number): com.heatledger.persist.RestorableMapBuilder;
    }

  }

  namespace com.heatledger.Account {

    export type Event = "BALANCE" | "UNCONFIRMED_BALANCE" | "ASSET_BALANCE" | "UNCONFIRMED_ASSET_BALANCE" | "LEASE_SCHEDULED" | "LEASE_STARTED" | "LEASE_ENDED" | "PUBLIC_KEY" | "VIRTUAL_BALANCE";

  }

  namespace com.heatledger.Asset {

    export type Event = "ASSET_ISSUED";

  }

  namespace com.heatledger.Order {

    export type Event = "ORDER_CREATE" | "ORDER_UPDATE" | "ORDER_DELETE";

  }

  namespace com.heatledger.peer.Peer {

    export type State = "NON_CONNECTED" | "CONNECTED" | "DISCONNECTED";

  }

  namespace com.heatledger.BlockchainProcessor {

    export type Event = "BLOCK_PUSHED" | "BLOCK_POPPED" | "BLOCK_GENERATED" | "BLOCK_SCANNED" | "BEFORE_RESCAN" | "RESCAN_BEGIN" | "RESCAN_END" | "BEFORE_BLOCK_ACCEPT" | "BEFORE_BLOCK_APPLY" | "AFTER_BLOCK_APPLY" | "TEST_MAYBE_THROW_EXCEPTION" | "TEST_MAYBE_SYSTEM_CRASH" | "FULL_RESCAN_BEGIN" | "FULL_RESCAN_END" | "BLOCKCHAIN_READY";

  }

  namespace com.heatledger.TransactionProcessor {

    export type Event = "REMOVED_UNCONFIRMED_TRANSACTIONS" | "ADDED_UNCONFIRMED_TRANSACTIONS" | "ADDED_CONFIRMED_TRANSACTIONS" | "TEST_MAYBE_THROW_EXCEPTION" | "TEST_MAYBE_SYSTEM_CRASH";

  }

  namespace com.heatledger.Trade {

    export type Event = "TRADE" | "REMOVE_TRADES";

  }

  namespace java.util.Locale {

    export type Category = "DISPLAY" | "FORMAT";

  }

  namespace java.util.Locale {

    export type FilteringMode = "AUTOSELECT_FILTERING" | "EXTENDED_FILTERING" | "IGNORE_EXTENDED_RANGES" | "MAP_EXTENDED_RANGES" | "REJECT_EXTENDED_RANGES";

  }

}
