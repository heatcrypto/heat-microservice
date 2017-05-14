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
type ScriptablePreparedStatement = Java.com.heatledger.replicate.ReplicatorScriptHelper.ScriptablePreparedStatement;
type ScriptableResultSet = Java.com.heatledger.replicate.ReplicatorScriptHelper.ScriptableResultSet;

module db {
  
  /**
   * Wraps the creation of a PreparedStatement in a closure, the java parts will handle the
   * connection and anything that needs to be closed for you.
   * Used for update statements that do not return a value.
   * 
   * @param statement 
   * @param callback 
   */
  export function statement(statement: string, callback: (pstmt: ScriptablePreparedStatement) => void) {
    heat.replicator.scriptHelper.preparedStatement(statement, callback);
  }

  /**
   * Wraps the creation of a PreparedStatement in a closure, the java parts will handle the
   * connection and anything that needs to be closed for you. The difference with `db.statement`
   * is that whatever you return from the calback method is returned from this method.
   * Used for selecting single results mostly, @see `db.iterator` for when you want to return
   * multiple values.
   * 
   * @param statement 
   * @param callback 
   * @returns whatever value the callback returned
   */
  export function select<T>(statement: string, callback: (pstmt: ScriptablePreparedStatement) => T): T {
    let result = [];
    heat.replicator.scriptHelper.preparedStatement(statement, (pstmt: ScriptablePreparedStatement) => {
      result.push(callback(pstmt));
    });
    return result[0];
  }

  /**
   * Easy managed way to iterate over a result set while translating results to domain objects before 
   * passing them to the iterator.
   * 
   * @param statement string SQL statement
   * @param setup function closure that should initialize the prepared statement - DONT call execute on it!
   * @param translator function that translates a result set object to a domain object
   * @param consumer function that receives the iterator, do your iteratings within this method.
   */
  export function iterator<T>(statement: string, 
                              setup: (pstmt: ScriptablePreparedStatement) => void,
                              translator: (pstmt: ScriptableResultSet) => T,
                              consumer: (iterator: Java.java.util.Iterator<T>) => void) {
    heat.replicator.scriptHelper.resultSetIterator(statement, setup, translator, consumer);
  }

  /**
   * Runs a series of update statements.
   * 
   * @param updates array of string statements
   */
  export function batch(updates: Array<string>) {
    heat.replicator.scriptHelper.batchUpdate(updates);
  }
}