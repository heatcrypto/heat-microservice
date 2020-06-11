/*
 * The MIT License (MIT)
 * Copyright (c) 2020 Heat Ledger Ltd.
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
module microservice.sample {

    const SERVICE_NAME = 'sample-events.service';

    @MicroService(SERVICE_NAME)
    export class EventsSampleService extends AbstractMicroService {

        constructor(private config: any) {
            super();

            subscriber.create(SERVICE_NAME).transaction()
                .confirmations(1)
                .onAdd(event => {
                    console.log(`${SERVICE_NAME}  confirmations=1  onAdd  tx ${event.transaction.id}`)
                })
                .onConfirmed(event => {
                    console.log(`${SERVICE_NAME}  confirmations=1  onConfirmed  tx ${event.transaction.id}`)
                })
                .onComplete(event => {
                    console.log(`${SERVICE_NAME}  confirmations=1  onComplete  tx ${event.transaction.id}`)
                    /* override status to NOT COMPLETE so the next 'onConfirmed' and 'onComplete' (with greater confirmations)
                    on this transaction will be invoked */
                    heat.transactionStore.setEntryValue(SERVICE_NAME, event.transaction.id, subscriber.COMPLETE, subscriber.FALSE);
                })
                .subscribe()

            subscriber.create(SERVICE_NAME).transaction()
                .confirmations(2)
                .onAdd(event => {
                    console.log(`${SERVICE_NAME}  confirmations=2  onAdd  tx ${event.transaction.id}`)
                })
                .onConfirmed(event => {
                    console.log(`${SERVICE_NAME}  confirmations=2  onConfirmed  tx ${event.transaction.id}`)
                })
                .subscribe()

            subscriber.create(SERVICE_NAME).block()
                .onPush(block => {
                    console.log(`${SERVICE_NAME} onPush  block ${block.id}`)
                })
                .subscribe()
        }

    }

}