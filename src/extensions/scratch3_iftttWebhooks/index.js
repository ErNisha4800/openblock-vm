const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const AvailableLocales = ['en', 'ja', 'ja-Hira', 'th', 'zh-cn','gu','hi'];
const Message = {
    set_value1: {
        'ja': 'value1を[VALUE1]にする',
        'ja-Hira': 'value1を[VALUE1]にする',
        'en': 'set value1 to [VALUE1]',
        'zh-cn': '将 value1 设为 [VALUE1]',
        'th': 'ตั้งค่า value1 เป็น [VALUE1]',
        'gu': 'વેલ્યુ1ને [VALUE1] પર સેટ કરો',
        'hi': 'वैल्यू1 को [VALUE1] पर सेट करें',

    },
    set_value2: {
        'ja': 'value2を[VALUE2]にする',
        'ja-Hira': 'value2を[VALUE2]にする',
        'en': 'set value2 to [VALUE2]',
        'zh-cn': '将value2设为[VALUE2]',
        'th': 'ตั้งค่า value2 เป็น [VALUE2]',
        'gu': 'વેલ્યુ2ને [VALUE2] પર સેટ કરો',
        'hi': 'वैल्यू2 को [VALUE2] पर सेट करें',
    },
    set_value3: {
        'ja': 'value3を[VALUE3]にする',
        'ja-Hira': 'value3を[VALUE3]にする',
        'en': 'set value3 to [VALUE3]',
        'zh-cn': '将value3设为[VALUE3]',
        'th': 'ตั้งค่า value3 เป็น [VALUE3]',
        'gu': 'વેલ્યુ3ને [VALUE3] પર સેટ કરો',
        'hi': 'वैल्यू3 को [VALUE3] पर सेट करें',
    },
    send: {
        'ja': '送る',
        'ja-Hira': 'おくる',
        'en': 'send',
        'zh-cn': '发送',
        'th': 'ส่ง',
        'gu': 'મોકલો',
        'hi': 'भेजें',
    },
    getEvent:{
        'en':'Event',
        'gu':'પ્રસંગ',
        'hi':'आयोजन'
    },
    getKey:{
        'en':'Key',
        'gu':'ચાવી',
        'hi':'चाबी'
    },
    getValue1:{
        'en':'Value1',
        'gu':'વેલ્યુ1',
        'hi':'वैल्यू1'
    },
    getValue2:{
        'en':'Value2',
        'gu':'વેલ્યુ2',
        'hi':'वैल्यू2'
    },
    getValue3:{
        'en':'Value3',
        'gu':'વેલ્યુ3',
        'hi':'वैल्यू3'
    },
    setIftttKey:{
        'en':'IFTTT key:[KEY]',
        'gu':'IFTTT કી:[KEY]',
        'hi':'IFTTT चाबी :[KEY]'
    },
    setIftttEvent:{
        'en':'IFTTT event :[EVENT]',
        'gu':'IFTTT ઇવેન્ટ :[EVENT]',
        'hi':'IFTTT इवेंट :[EVENT]'
    }
};

class Scratch3IFTTTWebhooks {
    constructor (runtime) {
        this.runtime = runtime;
        this.event = '';
        this.key = '';
        this.value1 = '';
        this.value2 = '';
        this.value3 = '';
    }

    getInfo () {
        this.locale = this.setLocale();

        return {
            id: 'iftttWebhooks',
            name: 'IFTTT Webhooks',
            blocks: [
                {
                    opcode: 'setIftttEvent',
                    blockType: BlockType.COMMAND,
                    text: Message.setIftttEvent[this.locale],
                    arguments: {
                        EVENT: {
                            type: ArgumentType.STRING,
                            defaultValue: 'event_name'
                        }
                    }
                },
                {
                    opcode: 'setIftttKey',
                    blockType: BlockType.COMMAND,
                    text: Message.setIftttKey[this.locale],
                    arguments: {
                        KEY: {
                            type: ArgumentType.STRING,
                            defaultValue: 'key'
                        }
                    }
                },
                {
                    opcode: 'setValue1',
                    blockType: BlockType.COMMAND,
                    text: Message.set_value1[this.locale],
                    arguments: {
                        VALUE1: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value1'
                        }
                    }
                },
                {
                    opcode: 'setValue2',
                    blockType: BlockType.COMMAND,
                    text: Message.set_value2[this.locale],
                    arguments: {
                        VALUE2: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value2'
                        }
                    }
                },
                {
                    opcode: 'setValue3',
                    blockType: BlockType.COMMAND,
                    text: Message.set_value3[this.locale],
                    arguments: {
                        VALUE3: {
                            type: ArgumentType.STRING,
                            defaultValue: 'value3'
                        }
                    }
                },
                {
                    opcode: 'getIfttt',
                    blockType: BlockType.COMMAND,
                    text: Message.send[this.locale]
                },
                {
                    opcode: 'getEvent',
                    blockType: BlockType.REPORTER,
                    text: Message.getEvent[this.locale]
                },
                {
                    opcode: 'getKey',
                    blockType: BlockType.REPORTER,
                    text: Message.getKey[this.locale]
                },
                {
                    opcode: 'getValue1',
                    blockType: BlockType.REPORTER,
                    text: Message.getValue1[this.locale]
                },
                {
                    opcode: 'getValue2',
                    blockType: BlockType.REPORTER,
                    text: Message.getValue2[this.locale]
                },
                {
                    opcode: 'getValue3',
                    blockType: BlockType.REPORTER,
                    text: Message.getValue3[this.locale]
                }
            ],
            menus: {
            }
        };
    }

    getIfttt () {
        const value1 = Cast.toString(this.value1);
        const value2 = Cast.toString(this.value2);
        const value3 = Cast.toString(this.value3);
        var jsonData = {"value1": value1, "value2": value2, "value3": value3};
        var xhr = new XMLHttpRequest();
        var url = 'https://ifttt2scratch.herokuapp.com/?event=' + this.event + '&key=' + this.key;
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(jsonData));
    }

    setIftttEvent (args) {
        this.event = Cast.toString(args.EVENT);
    }
    setIftttKey (args) {
        this.key = Cast.toString(args.KEY);
    }
    setValue1 (args) {
        this.value1 = Cast.toString(args.VALUE1);
    }
    setValue2 (args) {
        this.value2 = Cast.toString(args.VALUE2);
    }
    setValue3 (args) {
        this.value3 = Cast.toString(args.VALUE3);
    }

    getEvent () {
        return this.event;
    }
    getKey () {
        return this.key;
    }
    getValue1 () {
        return this.value1;
    }
    getValue2 () {
        return this.value2;
    }
    getValue3 () {
        return this.value3;
    }
    setLocale () {
        let locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
            return locale;
        }
        return 'en';
    }
}

module.exports = Scratch3IFTTTWebhooks;
