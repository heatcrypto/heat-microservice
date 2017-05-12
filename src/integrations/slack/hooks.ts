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
declare namespace integrations.slack {
  interface SlackHookConfig {
    url: string; 
    token: string;
  }
  interface SlackMessageEvent {
    type: string;   // "message",
    user: string;   // ***
    text: string;
    ts: string;     // "1494455657.040443",
    channel: string;// "C5C4GPU9M",
  }
}
module integrations.slack {
  export class SlackHook {
    constructor(private config: SlackHookConfig) {}

    /* Sends a message to the channel configured for slack config url.
       @see https://api.slack.com/incoming-webhooks for further details. */
    public send(message: string) {
      let client = heat.createHTTPClient();
      return client.post(this.config.url, JSON.stringify({
        text: message
      }));
    }

    /* Retrieves a list of most recent messages to channel.
       @see https://api.slack.com/methods/channels.history for further details. */
    public channelHistory(channel: string): Array<SlackMessageEvent> {
      let client = heat.createHTTPClient();
      let url = `https://slack.com/api/channels.history?token=${this.config.token}&channel=${channel}&pretty=1`;
      let payload = JSON.parse(client.get(url));
      if (payload && payload.ok) {
        return payload.messages;
      }
      return null;
    }
  }
}