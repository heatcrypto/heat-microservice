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

/*
How to use

in Telegram

find the bot HeatBot (username heat_blockchain_bot)
send command to bot
/register anyword

or create the new bot. Bot must be configured "/setprivacy=DISABLED" to be able to receive users messages in the groups

in Heat

send not encrypted message to self:
/telegram register anyword

After these you will be receive heat messages in Telegram.

 */

/*
 todo

 what about encrypted heat messages?

 1. implement handle command from telegram
    /subscribe message|payment|assetTransfer|trade
    /unsubscribe message|payment|assetTransfer|trade

 1. Now values persist to java Properties file. This is a temporary solution for the sample.
    When there will be access from microservices to the persistent key-value store (maps), then transfer to them.

 2. store hash of register secret instead store as is

 3. group chat as trollbox  (https://help.chatfuel.com/telegram-messenger/bot-in-groups/how-do-i-make-my-bot-send-messages-to-a-group/)
    Create group chat in telegram (Heat Trollbox Group), add bot to the group.
    Telegram bot must be in non private mode, then it will be able to catch group messages.
    Microservice gets group chats messages from bot (by updates).
    Heat UI gets chat messages from Microservice (through API annotated functions) and shows them in the trollbox.
    Messages from Heat UI to Telegram group chat possible on behalf of the bot, bot writes e.g. "72732656345627: Hello, I want to buy Heat!"

 4. one-to-one messages (without tnxs, through microservice API) (is it useful?)

 */

/*

Ideas

Trust Telegram microservice to control account. Of course this account should not be a lot of money.
Commands from Telegram
    /privateKey GJ4J9FVKFV894KCRF9
        [356355353656] under control
    /clear
        [356355353656] not under control
    /sendMoney 736367288289929 0.00456
        [356355353656] sent 0.00456 heats to 736367288289929
    /balance
        [356355353656] balance is 50.737213 heats
 */

declare namespace microservice.telegram {

    interface TelegramServiceConfig {
        botToken: string;
        groupChatId: number;
        telegramPropertiesFile: string;
        //account: number;
    }

    interface TelegramMessage {
        username: string;
        text: string;
    }

}

module microservice.telegram {

    import Transaction = Java.com.heatledger.Transaction;
    import Trade = Java.com.heatledger.Trade;

    /* for debugging - capture JS variable to Java - allow to view JS variables in IDE */
    //const JAVA_DEBUG = Java.type("com.heatledger.microservice.NashornCapture");

    const SERVICENAME = 'telegram.service';

    const Timer = Java.type("java.util.Timer");
    const Properties = Java.type("java.util.Properties");
    const FileOutputStream = Java.type("java.io.FileOutputStream");
    const FileInputStream = Java.type("java.io.FileInputStream");
    const File = Java.type("java.io.File");

    function schedule(func, delay: number, period: number, threadName: string) {
        let timer = new Timer(threadName, true);
        timer.schedule(func, delay, period);
        return timer;
    }

    let telegramStore: { [key: string]: number; } = {};  // todo store to persistent

    @MicroService(SERVICENAME)
    export class TelegramService extends AbstractMicroService {

        private telegramHook: integrations.telegram.TelegramHook;
        private MAX_MESSAGES = 50;

        private properties;
        private propsFile: any;

        /*fictional strings so it doesn't accidentally coincided with the registration string (from user) in the telegram*/
        private heatRegistrationKeyPrefix = "_FromHeatRegW7V2B5Y_";
        private checkPreRegKeyPrefix = "_PreRegW7V2B5Y_";

        private messages: Array<TelegramMessage> = [];

        constructor(private config: TelegramServiceConfig) {
            super();

            this.telegramHook = new integrations.telegram.TelegramHook(config.botToken);

            this.properties = new Properties();

            this.propsFile = new File(config.telegramPropertiesFile);
            if (this.propsFile.exists()) {
                let ins = new FileInputStream(this.propsFile);
                this.properties.load(ins);
                ins.close();
            }

            /* Catch heat messages and forward them to registered telegram users */
            subscriber.create(SERVICENAME).message()
                .confirmations(1)
                .onAdd((event) => {
                    let tnx = event.getTransaction();
                    if (tnx.message && tnx.message.isText()) {
                        let messageText = Convert.toString(tnx.message.getMessage());
                        this.handleTxnMessage(tnx.senderId, tnx.recipientId, messageText);
                    } else {
                        this.handleTxnMessage(tnx.senderId, tnx.recipientId, "[encrypted message] ");
                    }
                })
                .subscribe();

            /* periodically get updates (new messages, conversations) from Telegram bot */
            let thisTelegramService = this;
            schedule(function () {
                try {
                    thisTelegramService.getTelegramUpdates();
                } catch (e) {
                    console.log("Telegram getUpdates error: " + e);
                }
            }, 1000, 4000, "microservice.telegram.getTelegramUpdates");
        }

        @Api('GET', 'telegram-trollbox/messages')
        public getMessages() {
            return JSON.stringify(
                this.messages.map(m => {
                    return { username: m.username, text: m.text };
                })
            );
        }

        @Api('POST', 'telegram-trollbox/send')
        public sendToTelegramGroup(body: string) {
            let payload = util.postBodyToJson(body);

            // verify the sender signature.
            let account = this.validateSignature(payload.publicKey, payload.signature);
            if (!account) {
                console.log("Could not verify signature");
                return null;
            }
            let text = `*${payload.username} | ${account}*: ${payload.message}`;
            if (text.length > 4096)
                return "Username and or message too long";

            /* this.notifyWebsocketListeners({username: payload.username, text: payload.message}); */

            return this.telegramHook.sendToTelegram(this.config.groupChatId, text);
        }

        public handleHeatPayment(tnx: Transaction) {
            console.log(`handleHeatPayment ${tnx.toString()}`)
        }

        public handleHeatAssetTransfer(tnx: Transaction) {
            console.log(`handleHeatAssetTransfer ${tnx.toString()}`)
        }

        public handleHeatTrade(trade: Trade) {
            console.log(`handleHeatTrade ${trade.toString()}`)
        }

        public handleTxnMessage(senderId: number, recipientId: number, message: string) {
            //JAVA_DEBUG.capture({"senderId": senderId, "recipientId": recipientId});

            if (senderId - recipientId == 0 && message.startsWith("/telegram")) {
                this.handleHeatCommandMessage(senderId, recipientId, message);
            } else {
                let chatId = this.resolveChatId(recipientId);
                console.log(`recipientId ${recipientId}  chatId ${chatId}`);
                if (chatId)
                    try {
                        this.telegramHook.sendToTelegram(chatId, `*${senderId}:* ${message}`);
                    } catch (e) {
                        console.log("Telegram sendMessage error: " + e);
                    }
            }

        }

        /**
         * Handle to self messages started with "/telegram"
         * Register message:
         * /telegram register MyTelegramSecret
         * /telegram unregister MyTelegramSecret
         */
        private handleHeatCommandMessage(senderId: number, recipientId: number, message: string) {
            let tokens: string[] = message.split(/\s+/);
            if (tokens.length < 2)
                return;
            if (tokens[1] == "register" || tokens[1] == "unregister")
                this.handleHeatRegister(senderId, tokens);
        }

        private handleHeatRegister(recipientId: number, commandTokens: string[]) {
            if (commandTokens.length != 3)
                return;
            let registerSecret = commandTokens[2];
            if (commandTokens[1] == "register") {
                // check if is present previous registerSecret
                let preRecipientId = this.properties.getProperty(this.checkPreRegKeyPrefix + registerSecret);
                if ( preRecipientId && preRecipientId != recipientId.toString() )
                    return;

                this.save(this.heatRegistrationKeyPrefix + recipientId.toString(), registerSecret);
                this.save(this.checkPreRegKeyPrefix + registerSecret, recipientId.toString());

                // if already registered in the Telegram send him congratulation
                let chatId = this.properties.getProperty(registerSecret);
                if (chatId)
                    this.telegramHook.sendToTelegram(chatId,
                        "Congratulations! You registered to receive Heat messages in Telegram.");
            } else if (commandTokens[1] == "unregister") {
                this.save(this.heatRegistrationKeyPrefix + recipientId.toString(), null);
                this.save(this.checkPreRegKeyPrefix + registerSecret, null);
            }
        }

        private resolveChatId(recipientId: number) {
            // 1. In Heat find registerSecret by recipientId
            // let bytes = heat.getReplicator().getKeyStoreAPI().getValue(recipientId, "telegram secret").getValue();
            // if (!bytes)
            //     return;
            //let registerSecret =  Convert.toString(bytes);

            let registerSecret = this.properties.getProperty(this.heatRegistrationKeyPrefix + recipientId);

            // 2. Find telegram chat_id by registerSecret

            if (registerSecret)
                return this.properties.getProperty(registerSecret);
        }

        private getTelegramUpdates() {
            let payload = this.telegramHook.getTelegramUpdates();
            if (!payload)
                return;
            for (let update of payload.result) {
                let message = update.message ? update.message : (update.edited_message ? update.edited_message : null);
                if (message) {
                    if (message.text) {
                        if (message.chat.id == this.config.groupChatId)
                            this.handleTelegramGroupMessage(message);  //message in telegram trollbox chat
                        else if (message.text.charAt(0) == "/")
                            this.handleTelegramCommand(message); //message in bot chat
                        else
                            ; //do not handle messages (not commands) in bot chat
                    }
                }
            }
        }

        private handleTelegramGroupMessage(message) {
            let tm: TelegramMessage = {
                username: message.from.first_name + (message.from.last_name ? " " + message.from.last_name : ""),
                text: message.forward_from ? `(forwarded from ${message.forward_from.first_name}) ${message.text}` : message.text
            };
            this.messages.push(tm);
            if (this.messages.length > this.MAX_MESSAGES)
                this.messages = this.messages.slice(this.messages.length - this.MAX_MESSAGES, this.MAX_MESSAGES);
            this.notifyWebsocketListeners(tm);
        }

        private handleTelegramCommand(message) {
            if (message.text.startsWith("/register", 0))
                this.handleTelegramRegister(message.chat.id, message.text);
        }

        /* notify websocket listeners, we send a TelegramMessage to connected clients */
        private notifyWebsocketListeners(tm: TelegramMessage) {
            heat.websocket.send({'microservice':'trollbox.service'}, tm);
        }

        /**
         * Store mapping registerSecret -> telegram chat_id.
         */
        private handleTelegramRegister(chatId: number, text: string) {
            let secret: string = text.substring(10);

            // check unique registerSecret
            let s = this.properties.getProperty(secret);
            if (s) {
                this.telegramHook.sendToTelegram(chatId,
                    "That word is already taken. Please choose another word for registering.");
                return;
            }

            this.save(secret, chatId.toString());
            //registerStore[secret] = chatId;
        }

        private save(key: string, value: string) {
            if (value)
                this.properties.setProperty(key, value);
            else
                this.properties.remove(key);
            let out = new FileOutputStream(this.propsFile);
            this.properties.store(out, new Date().toString());
            out.flush();
            out.close();
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

    }

}