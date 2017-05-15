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
module replicator.customer {

  export interface Customer {
    name: string;
    address: string;
  }

  class CustomerReplicatorBundle extends BundleMessage<Customer> {
    constructor() { super(1234567) }
    encode(customer: Customer, buffer: ScriptableByteBuffer) {
      buffer.putString(customer.name);
      buffer.putString(customer.address);
    }
    decode(buffer: ScriptableByteBuffer): Customer {
      return { 
        name: buffer.getString(), 
        address: buffer.getString() 
      };
    }
  }

  export class CustomerReplicator extends AbstractBundleReplicator<Customer> {

    private CLEAR_ALL: string;
    private INSERT: string;
    private REMOVE: string;
    private SELECT_BY: string;
    private SELECT_ALL: string;
    private COUNT: string;

    constructor(secretPhrase: string) {
      super({
        id: 'customer',
        includeUnconfirmed: true,
        bundle: new CustomerReplicatorBundle(),
        secretPhrase: secretPhrase
      });
      this.update(`
        CREATE TABLE IF NOT EXISTS customer (
          transaction_id BIGINT NOT NULL, 
          name VARCHAR NOT NULL, 
          address VARCHAR NOT NULL
        )
      `);
      this.update('CREATE UNIQUE INDEX IF NOT EXISTS transaction_id_customer_idx ON customer (transaction_id)');
      this.update('CREATE UNIQUE INDEX IF NOT EXISTS name_customer_idx ON customer (name)');

      this.CLEAR_ALL  = `TRUNCATE TABLE customer`;
      this.INSERT     = 'MERGE INTO customer (transaction_id, name, address) KEY (transaction_id) VALUES(?,?,?)';
      this.REMOVE     = 'DELETE FROM customer WHERE transaction_id = ?';
      this.SELECT_BY  = 'SELECT transaction_id, name, address FROM customer WHERE name = ?';
      this.SELECT_ALL = 'SELECT transaction_id, name, address FROM customer'; 
      this.COUNT      = 'SELECT COUNT(*) FROM customer';
    }

    //@Override [called from Java parts - mandatory!!]
    public clear() {
      db.batch([this.CLEAR_ALL]);
    }

    //@Override [called from Java parts - mandatory!!]
    public add(customer: Customer, event: Java.com.heatledger.scripting.NativeTransactionEvent) {
      db.statement(this.INSERT, (pstmt) => {
        pstmt.setLong(1, event.transaction.id);
        pstmt.setString(2, customer.name);
        pstmt.setString(3, customer.address);
        pstmt.executeUpdate();
      });
    }

    //@Override [called from Java parts - mandatory!!]
    public remove(customer: Customer, event: Java.com.heatledger.scripting.NativeTransactionEvent) {
      db.statement(this.REMOVE, (pstmt) => {
        pstmt.setLong(1, event.transaction.id);
        pstmt.executeUpdate();
      });
    }

    /**
     * Returns a single customer by name.
     * 
     * @param name 
     * @returns Customer
     */
    public getCustomerByName(name: string): Customer {
      return db.select(this.SELECT_BY, (pstmt) => {
        pstmt.setString(1, name);
        let result = pstmt.executeQuery();
        if (result && result.next()) {
          return { name: result.getString('name'), address: result.getString('address') }
        }
      });
    }

    /**
     * Counts the number of customers in the database
     * 
     * @returns count
     */
    public getCustomerCount(): number {
      return db.select(this.COUNT, (pstmt) => {
        let result = pstmt.executeQuery();
        if (result && result.next()) {
          return result.getInt(1);
        }
      });      
    }

    /**
     * Returns all customers in the database, use from, to parameters to limit 
     * what section of all customers you want to see.
     * 
     * @param from 
     * @param to 
     * @returns customers Array<Customer>
     */
    public getAllCustomers(from: number, to: number): Array<Customer> {
      let customers = [];
      db.iterator(this.SELECT_ALL + ' ' + db.limitsClause(from, to), 
        // setup and execute the query
        (pstmt) => {
          db.setLimits(1, pstmt, from, to);
          return pstmt.executeQuery();
        }, 
        // translate a sql result to a Customer
        (result) => {
          return { name: result.getString('name'), address: result.getString('address') }
        }, 
        // use the fully setup and translated iterator here, collects all customers
        (iterator) => {
          iterator.forEachRemaining(c => {
            customers.push(c);
          })
        }
      );
      return customers;
    }
  }
}