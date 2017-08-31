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

declare namespace integrations.telegram {

    interface TelegramEvent {
    }

}

module integrations.telegram {

    let updatePosition: number = 0;

    export class TelegramHook {

        constructor(private botToken: string) {
        }

        public sendToTelegram(chatId: number, text: string) {
            let client = heat.createHTTPClient();
            return client.get(
                `https://api.telegram.org/bot${this.botToken}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${text}`
            );
        }

        public getTelegramUpdates() {
            let client = heat.createHTTPClient();
            let response = client.get(`https://api.telegram.org/bot${this.botToken}/getUpdates?offset=${updatePosition + 1}`);
            let payload = JSON.parse(response);
            for (let update of payload.result) {
                if (update.update_id > updatePosition)
                    updatePosition = update.update_id;
            }
            return payload;
        }

    }

}