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
module microservice.fx {    

  class MidMarket {
    constructor(public market: string, public time: number, public mid: string) {}
    toString() {
      return `${this.market} ${this.time} ${this.mid}`;
    }
  }

  interface FxServiceConfig {
    appId: string; // [HIDDEN]
    markets: string[]; // ['EURUSD','USDCHF','USDJPY','EURGBP']
    symbols: { [assetId: string]: string };
  }

  @MicroService('fx.service')
  export class FxService {

    private storage: {[s:string]: Array<MidMarket>} = {};
    private assetToSymbol: {[s:string]:string} = {};
    private symbolToAsset: {[s:string]:string} = {};

    constructor(private config: FxServiceConfig) {
      this.assetToSymbol = this.config.symbols;
      for (let p in this.assetToSymbol) this.symbolToAsset[this.assetToSymbol[p]] = p;
      timer.setInterval(()=> {
        try {
          this.store(this.getMidMarkets(this.config.markets));
        } catch(e) {
          console.log(e);
        }
      }, 0, 2000);

      timer.setInterval(()=> {
        try {        
          this.updateHouseOrders();
        } catch(e) {
          console.log(e);
        }
      }, 0, 30000);      
    }

    private getMidMarkets(markets: string[]): Array<MidMarket> {
      let url  = `http://api.forexfeed.net/data/${this.config.appId}/i-1/f-json/s-${markets.join(',')}`;
      let json = JSON.parse(heat.createHTTPClient().get(url));
      let result: Array<MidMarket> = [];
      markets.forEach((market) => {
        let data = json['data'][market];
        if (data) {
          let time = data[0].time;
          let mid  = data[0].mid;
          result.push(new MidMarket(market, time, mid))
        }
      });
      return result;
    }

    private store(markets: Array<MidMarket>) {
      markets.forEach((market)=> {
        let list = this.storage[market.market] || (this.storage[market.market] = []);
        list.push(market);
      });
      this.cleanup();
    }

    private cleanup() {
      for (let market in this.storage) {
        if (Array.isArray(this.storage[market])) {
          this.storage[market] = this.storage[market].slice(-30);
        }
      }
    }

    @Api('GET', 'fx/list/:currency/:asset')
    public list(currency: string, asset: string) {
      let market = this.assetToSymbol[currency] + this.assetToSymbol[asset]
      return JSON.stringify(
        this.storage[market].map(entry => {
          return {
            time: entry.time,
            mid: entry.mid
          }
        })
      );
    }

    private getMidMarketPrice(market:string): string {
      let list = this.storage[market];
      return list ? list[list.length - 1].mid : null;
    }

    private updateHouseOrders() {
      let secret = "user1";
      let issuer = Account.getId(Crypto2.getPublicKey(secret));
      let currency = Long.parseUnsignedLong(this.symbolToAsset['EUR']);
      let asset = Long.parseUnsignedLong(this.symbolToAsset['USD']);

      console.log(`curr=${this.symbolToAsset['EUR']} ass=${this.symbolToAsset['USD']}`)

      // the mid market price
      let midmarket = this.getMidMarketPrice('EURUSD');
      if (midmarket == null)
        return;

      // determine the house ask + bid price, spread is 1%
      let midQNT = Long.parseLong(Convert.toQNT(midmarket));
      let spreadQNT = (midQNT / 100) * 1;
      let askQNT = midQNT + spreadQNT;
      let bidQNT = midQNT - spreadQNT;      

      // remove existing ask orders
      let askOrderIterator = heat.getAskOrders(currency, asset);
      let askOrders: Array<string> = [];
      if (askOrderIterator) {
        while (askOrderIterator.hasNext()) {
          askOrders.push(Long.toUnsignedString(askOrderIterator.next().getId()));
        }
      }
      askOrders.forEach(id => {
        try {
          transactionBuilder.askOrderCancellation(secret).order(Long.parseUnsignedLong(id)).broadcast();
        } catch (e) {
          console.log(e);
        }
      });

      // remove existing bid orders
      let bidOrderIterator = heat.getBidOrders(currency, asset);
      let bidOrders = [];
      if (bidOrderIterator) {
        while (bidOrderIterator.hasNext()) {
          bidOrders.push(Long.toUnsignedString(bidOrderIterator.next().getId()));
        }
      }
      bidOrders.forEach(id => {
        try {
          transactionBuilder.bidOrderCancellation(secret).order(Long.parseUnsignedLong(id)).broadcast();
        } catch (e) {
          console.log(e);
        }
      });

      // place ask orders
      try {
        transactionBuilder.askOrderPlacement(secret)
                          .currency(currency)
                          .asset(asset)
                          .quantity(Long.parseLong(Convert.toQNT("1000000")))
                          .price(askQNT)
                          .broadcast();

        // place bid orders
        transactionBuilder.bidOrderPlacement(secret)
                          .currency(currency)
                          .asset(asset)      
                          .quantity(Long.parseLong(Convert.toQNT("1000000")))
                          .price(bidQNT)
                          .broadcast();
      } catch (e) {
        console.log('Managed exception '+e+' last block '+heat.blockchain.height);
      }
    }
  }
}