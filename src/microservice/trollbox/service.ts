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
declare namespace microservice.trollbox {
  interface TrollboxServiceConfig {
    slack: integrations.slack.SlackHookConfig;
    channel: string;
  }
  interface TrollboxServiceMessage {
    username: string;
    text: string;
  }
}
module microservice.trollbox {    

  @MicroService('trollbox.service')
  export class TrollboxService {
    private MAX_MESSAGES = 50;

    /* @see integrations/slack/SlackHook for how the actual calls to slack API are done */
    private slackHook: integrations.slack.SlackHook;

    /* We keep a list of messages in memory, on load we populate this list with messages
       from the slack API, after initial load we add messages after they have been pushed 
       to our microservice from the slack event pusher. */
    private events: Array<integrations.slack.SlackMessageEvent> = [];

    constructor(private config: TrollboxServiceConfig) {

      /* Initialize our private SlackHook instance */
      this.slackHook = new integrations.slack.SlackHook(config.slack);

      /* Only on startup do we one time load the most recent messages from the #trollbox channel */
      let history = this.slackHook.channelHistory(config.channel);
      if (util.isArray(history)) {
        history.reverse().forEach(event=> {
          this.addMessageEvent(event);
        });
      }
    }

    /**
     * Use this to send messages to slack. Messages will be posted to #trollbox by the Trollbox bot.
     * To post to the #trollbox channel send a POST message containing { username: x, message: x} to:
     * 
     *    /microservice/trollbox/send
     */
    @Api('POST', 'trollbox/send')
    public sendToSlack(body: string) {
      let payload = util.postBodyToJson(body);

      // verify the sender signature.
      let account = this.validateSignature(payload.publicKey, payload.signature);
      if (!account) {
        console.log("Could not verify signature");
        return null;
      }
      let text = this.encodeMessage(payload.username+' ['+account+']', payload.message);
      if (text.length > 180)
        return "Username and or message too long";
      return this.slackHook.send(text);
    }

    /**
     * To enable clients to list the last messages we add a GET method that returns all messages in memory.
     * Result is an array of TrollboxServiceMessage { username: string, text: string }
     * 
     *    /microservice/trollbox/messages
     */
    @Api('GET', 'trollbox/messages')
    public getMessages() {
      return JSON.stringify(
        this.events.map(event => {
          let message = this.decodeMessage(event.text);
          return message || { username: event.user, text: event.text };
        })
      );
    }

    /**
     * Receive events from the slack event pusher.
     *  
     *    /microservice/trollbox/slack/events
     */
    @Api('POST', 'trollbox/slack/events')
    public slackEvent(body: string) {
      let payload = JSON.parse(body);
      if (payload.type == 'url_verification') { /* one time url verification. */
        return payload.challenge;
      }
      if (payload.type == 'hello') {            /* connection established */
        return 'Hi!';
      }
      if (payload.type == 'event_callback') {   /* message to slack channel */
        let event = payload.event;
        if (event.type == 'message' && event.channel == this.config.channel) {
          this.addMessageEvent(event);
          this.notifyWebsocketListeners(event);
        }
      }
    }

    /* notify websocket listeners, we send a TrollboxServiceMessage to connected clients */
    private notifyWebsocketListeners(event: integrations.slack.SlackMessageEvent) {
      console.log("NOTIFY websocket, event="+JSON.stringify(event));
      let message: TrollboxServiceMessage = this.decodeMessage(event.text) || ({
        text: event.text,
        username: event.user
      });
      heat.websocket.send({'microservice':'trollbox.service'}, message);
    }

    /* When sending messages from the website we have to include a username in the message (limitation of slack) */
    private encodeMessage(username: string, message: string): string {
      return `*${username}* says: ${message}`;
    }

    /* Parse encoded message or return null in case message does not include `username says:` (limitation of slack) */
    private decodeMessage(text: string): TrollboxServiceMessage {
      try {
        let parts = text.match(/^\*(.*)\*\ssays:\s([\s\S]*)/);
        return parts ? { username: parts[1], text: parts[2] } : null;
      } catch (e) {
        console.log(e);
        return null;
      }
    }

    /* Validates the signature and transforms the publicKey to a numeric id */
    private validateSignature(publicKey: string, signature: string): string {
      let signatureBytes = Convert.parseHexString(signature);
      let messageBytes = Convert.toBytes("hello");
      let publicKeyBytes = Convert.parseHexString(publicKey);
      if (Crypto2.verify(signatureBytes, messageBytes, publicKeyBytes)) {
        return Long.toUnsignedString(Account.getId(publicKeyBytes));
      }
    }

    private addMessageEvent(event:integrations.slack.SlackMessageEvent) {
      this.events.push(event);
      if (this.events.length > this.MAX_MESSAGES) {
        this.events = this.events.slice(this.events.length - this.MAX_MESSAGES, this.MAX_MESSAGES);
      }
    }
  }
}