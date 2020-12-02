const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const ProgramModeType = require('../../extension-support/program-mode-type');
const Serialport = require('../../io/serialport');
const Base64Util = require('../../util/base64-util');
const formatMessage = require('format-message');

const Firmata = require('../../lib/firmata/firmata');

/**
 * The list of USB device filters.
 * @readonly
 */
const PNPID_LIST = [
    //https://github.com/arduino/Arduino/blob/1.8.0/hardware/arduino/avr/boards.txt#L51-L58
    'USB\\VID_2341&PID_0043',
    'USB\\VID_2341&PID_0001',
    'USB\\VID_2A03&PID_0043',
    'USB\\VID_2341&PID_0243',
    // For chinese clones that use CH340
    'USB\\VID_1A86&PID_7523'
];

/**
 * Configuration of serialport
 * @readonly
 */
const CONFIG = {
    baudRate: 57600,
    dataBits: 8,
    stopBits: 1
};

/**
 * Configuration of build and flash. Used by arduino_debug and avrdude.
 * @readonly
 */
const DIVECE_OPT = {
    type: 'arduino',
    board: 'arduino:avr:uno',
    partno: 'atmega328p'
}

/**
 * A string to report connect firmata timeout.
 * @type {string}
 */
const ConnectFirmataTimeout = 'Arduino UNO extension connect firmata timeout';

/**
 * A time interval to wait (in milliseconds) before reporting to the serialport socket
 * that data has stopped coming from the peripheral.
 */
const SerialportTimeout = 5000;

/**
 * A time interval to wait (in milliseconds) while a block that sends a serialport message is running.
 * @type {number}
 */
const SerialportSendInterval = 5;

/**
 * Manage communication with a Arduino Uno peripheral over a Scrath Link client socket.
 */
class ArduinoUno{

    /**
     * Construct a Arduino communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} deviceId - the id of the extension
     */
    constructor (runtime, deviceId) {
        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The serialport connection socket for reading/writing peripheral data.
         * @type {SERIALPORT}
         * @private
         */
        this._serialport = null;
        this._runtime.registerPeripheralExtension(deviceId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._deviceId = deviceId;

        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the serialport socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

        /**
        * Pending data list. If busy is set when send, the data will push into this array to
        * waitting to be sended.
        */
        this._pendingData = [];

        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);

        /**
         * Firmata connection.
         */
        this._firmata = null;
    }

    /**
     * Called by the runtime when user wants to upload code to a peripheral.
     */
    upload(code) {
        var base64Str = Buffer.from(code).toString('base64');
        this._serialport.upload(base64Str, DIVECE_OPT, 'base64');
    }

    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this._serialport) {
            this._serialport.disconnect();
        }
        this._serialport = new Serialport(this._runtime, this._deviceId, {
            filters: {
                pnpid: PNPID_LIST,
            }
        }, this._onConnect);
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect(id) {
        if (this._serialport) {
            this._serialport.connectPeripheral(id, { config: CONFIG });
        }
    }

    /**
     * Disconnect from the peripheral.
     */
    disconnect () {
        if (this._serialport) {
            this._serialport.disconnect();
        }
    }

    /**
     * Return true if connected to the peripheral.
     * @return {boolean} - whether the peripheral is connected.
     */
    isConnected () {
        let connected = false;
        if (this._serialport) {
            connected = this._serialport.isConnected();
        }
        return connected;
    }

    /**
     * Send a message to the peripheral Serialport socket.
     * @param {number} command - the Serialport command hex.
     * @param {Uint8Array} message - the message to write
     */
    send (message) {
        if (!this.isConnected()) return;

        // If busy push this data to _pendingData.
        if (this._busy) {
            this._pendingData.push(message.toString());
            return;
        }

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const data = Base64Util.uint8ArrayToBase64(message);

        this._serialport.write(data, 'base64').then(() => {
            this._busy = false;

            // If _pendingData is not empty call this func to send _pendingData.
            if (this._pendingData.length !== 0) {
                this.send(this._pendingData.shift().split(','));
                window.clearTimeout(this._busyTimeoutID);
            }
        });
    }

    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect () {
        this._serialport.read(this._onMessage);
        this._firmata = new Firmata(this.send.bind(this));

        this._timeoutID = window.setTimeout(
            () => this._serialport.handleDisconnectError(ConnectFirmataTimeout),
            SerialportTimeout
        );

        // If time out means failed to connect firmata.
        this._firmata.on("ready", function () {
            window.clearTimeout(this._timeoutID);
        }.bind(this));
    }

    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {object} data - the incoming BLE data.
     * @private
     */
    _onMessage(base64) {
        // parse data
        const data = Base64Util.base64ToUint8Array(base64);
        this._firmata.onReciveData(data);
    }

    /**
     * @param {PIN} pin - the pin to set.
     * @param {MODE} mode - the pin mode to set.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    setPinMode(pin, mode) {
        switch (mode) {
            case Mode.Input:
                mode = this._firmata.MODES.INPUT;
                break;
            case Mode.Output:
                mode = this._firmata.MODES.OUTPUT;
                break;
            case Mode.InputPullup:
                mode = this._firmata.MODES.PULLUP;
                break;
        }
        return this._firmata.pinMode(pin, mode);
    }

    /**
     * @param {PIN} pin - the pin to set.
     * @param {LEVEL} level - the pin level to set.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    setDigitalOutput(pin, level) {
        return this._firmata.digitalWrite(pin, level);
    }

    /**
     * @param {PIN} pin - the pin to set.
     * @param {VALUE} level - the pin level to set.
     * @return {Promise} - a Promise that resolves when writing to peripheral.
     */
    setPwmOutput(pin, value) {
        if (value < 0) {
            value = 0;
        }
        if (value > 255) {
            value = 255;
        }
        this._firmata.pinMode(pin, this._firmata.MODES.PWM);
        return this._firmata.pwmWrite(pin, value);
    }

    /**
     * @param {PIN} pin - the pin to read.
     * @return {Promise} - a Promise that resolves when read from peripheral.
     */
    readDigitalPin(pin) {
        return new Promise(resolve => {
            this._firmata.digitalRead(pin, (value) => {
                resolve(value);
            });
        });
    }

    /**
     * @param {PIN} pin - the pin to read.
     * @return {Promise} - a Promise that resolves when read from peripheral.
     */
    readAnalogPin(pin) {
        // Shifting to analog pin number.
        pin = pin - 14;
        this._firmata.pinMode(pin, this._firmata.MODES.ANALOG);
        return new Promise(resolve => {
            this._firmata.analogRead(pin, (value) => {
                resolve(value);
            });
        });
    }
}

const DigitalPins = {
    D0: 0,
    D1: 1,
    D2: 2,
    D3: 3,
    D4: 4,
    D5: 5,
    D6: 6,
    D7: 7,
    D8: 8,
    D9: 9,
    D10: 10,
    D11: 11,
    D12: 12,
    D13: 13
};

const AnaglogPins = {
    A0: 14,
    A1: 15,
    A2: 16,
    A3: 17,
    A4: 18,
    A5: 19
};

const Level = {
    High: 1,
    Low: 0
};

const PwmPins = {
    D3: 3,
    D5: 5,
    D6: 6,
    D9: 9,
    D10: 10,
    D11: 11
};

const Buadrate = {
    B4800: 4800,
    B9600: 9600,
    B19200: 19200,
    B38400: 38400,
    B57600: 57600,
    B115200: 115200
};

const Mode = {
    Input: 'INPUT',
    Output: 'OUTPUT',
    InputPullup: 'INPUT_PULLUP'
};

/**
 * Scratch 3.0 blocks to interact with a Arduino Uno peripheral.
 */
class Scratch3ArduinoUnoDevice {
    /**
     * @return {string} - the ID of this extension.
     */
    static get DEVICE_ID () {
        return 'arduinoUno';
    }

    get PINS_MENU() {
        return [
            {
                text: '0',
                value: DigitalPins.D0
            },
            {
                text: '1',
                value: DigitalPins.D1
            },
            {
                text: '2',
                value: DigitalPins.D2
            },
            {
                text: '3',
                value: DigitalPins.D3
            },
            {
                text: '4',
                value: DigitalPins.D4
            },
            {
                text: '5',
                value: DigitalPins.D5
            },
            {
                text: '6',
                value: DigitalPins.D6
            },
            {
                text: '7',
                value: DigitalPins.D7
            },
            {
                text: '8',
                value: DigitalPins.D8
            },
            {
                text: '9',
                value: DigitalPins.D9
            },
            {
                text: '10',
                value: DigitalPins.D10
            },
            {
                text: '11',
                value: DigitalPins.D11
            },
            {
                text: '12',
                value: DigitalPins.D12
            },
            {
                text: '13',
                value: DigitalPins.D13
            },
            {
                text: 'A0',
                value: AnaglogPins.A0
            },
            {
                text: 'A1',
                value: AnaglogPins.A1
            },
            {
                text: 'A2',
                value: AnaglogPins.A2
            },
            {
                text: 'A3',
                value: AnaglogPins.A3
            },
            {
                text: 'A4',
                value: AnaglogPins.A4
            },
            {
                text: 'A5',
                value: AnaglogPins.A5
            }
        ];
    }

    get MODE_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'arduinoUno.modeMenu.input',
                    default: 'Input',
                    description: 'label for input pin mode'
                }),
                value: Mode.Input
            },
            {
                text: formatMessage({
                    id: 'arduinoUno.modeMenu.output',
                    default: 'Output',
                    description: 'label for output pin mode'
                }),
                value: Mode.Output
            },
            {
                text: formatMessage({
                    id: 'arduinoUno.modeMenu.inputPullup',
                    default: 'Input-pullup',
                    description: 'label for input-pullup pin mode'
                }),
                value: Mode.InputPullup
            },
        ];
    }

    get DIGITAL_PINS_MENU () {
        return [
            {
                text: '0',
                value: DigitalPins.D0
            },
            {
                text: '1',
                value: DigitalPins.D1
            },
            {
                text: '2',
                value: DigitalPins.D2
            },
            {
                text: '3',
                value: DigitalPins.D3
            },
            {
                text: '4',
                value: DigitalPins.D4
            },
            {
                text: '5',
                value: DigitalPins.D5
            },
            {
                text: '6',
                value: DigitalPins.D6
            },
            {
                text: '7',
                value: DigitalPins.D7
            },
            {
                text: '8',
                value: DigitalPins.D8
            },
            {
                text: '9',
                value: DigitalPins.D9
            },
            {
                text: '10',
                value: DigitalPins.D10
            },
            {
                text: '11',
                value: DigitalPins.D11
            },
            {
                text: '12',
                value: DigitalPins.D12
            },
            {
                text: '13',
                value: DigitalPins.D13
            }
        ];
    }

    get ANALOG_PINS_MENU () {
        return [
            {
                text: 'A0',
                value: AnaglogPins.A0
            },
            {
                text: 'A1',
                value: AnaglogPins.A1
            },
            {
                text: 'A2',
                value: AnaglogPins.A2
            },
            {
                text: 'A3',
                value: AnaglogPins.A3
            },
            {
                text: 'A4',
                value: AnaglogPins.A4
            },
            {
                text: 'A5',
                value: AnaglogPins.A5
            }
        ];
    }

    get LEVEL_MENU() {
        return [
            {
                text: formatMessage({
                    id: 'arduinoUno.levelMenu.high',
                    default: 'High',
                    description: 'label for high level'
                }),
                value: Level.High
            },
            {
                text: formatMessage({
                    id: 'arduinoUno.levelMenu.low',
                    default: 'Low',
                    description: 'label for low level'
                }),
                value: Level.Low
            },
        ];
    }

    get PWM_PINS_MENU() {
        return [
            {
                text: '3',
                value: PwmPins.D3
            },
            {
                text: '5',
                value: PwmPins.D5
            },
            {
                text: '6',
                value: PwmPins.D6
            },
            {
                text: '9',
                value: PwmPins.D9
            },
            {
                text: '10',
                value: PwmPins.D10
            },
            {
                text: '11',
                value: PwmPins.D11
            }
        ];
    }

    get BAUDTATE_MENU() {
        return [
            {
                text: '4800',
                value: Buadrate.B4800
            },
            {
                text: '9600',
                value: Buadrate.B9600
            },
            {
                text: '19200',
                value: Buadrate.B19200
            },
            {
                text: '38400',
                value: Buadrate.B38400
            },
            {
                text: '57600',
                value: Buadrate.B57600
            },
            {
                text: '115200',
                value: Buadrate.B115200
            }
        ];
    }

    /**
     * Construct a set of Arduino blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new Arduino uno peripheral instance
        this._peripheral = new ArduinoUno(this.runtime, Scratch3ArduinoUnoDevice.DEVICE_ID);
    }

    /**
     * @returns {Array.<object>} metadata for this extension and its blocks.
     */
    getInfo () {
        return [
            {
                id: 'pin',
                name: formatMessage({
                    default: 'Pins',
                    description: 'The name of the arduino uno device pin category',
                    id: 'arduinoUno.category.pins',
                }),
                color1: '#4C97FF',
                color2: '#3373CC',
                color3: '#3373CC',

                blocks: [
                    {
                        opcode: 'setPinMode',
                        text: formatMessage({
                            id: 'arduinoUno.pins.setPinMode',
                            default: 'set pin [PIN] mode [MODE]',
                            description: 'arduinoUno set pin mode'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: 'pins',
                                defaultValue: DigitalPins.D0
                            },
                            MODE: {
                                type: ArgumentType.STRING,
                                menu: 'mode',
                                defaultValue: Mode.Input
                            }
                        }
                    },
                    {
                        opcode: 'setDigitalOutput',
                        text: formatMessage({
                            id: 'arduinoUno.pins.setDigitalOutput',
                            default: 'set digital pin [PIN] out [LEVEL]',
                            description: 'arduinoUno set digital pin out'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: 'pins',
                                defaultValue: DigitalPins.D0
                            },
                            LEVEL: {
                                type: ArgumentType.STRING,
                                menu: 'level',
                                defaultValue: Level.High
                            }
                        }
                    },
                    {

                        opcode: 'setPwmOutput',
                        text: formatMessage({
                            id: 'arduinoUno.pins.setPwmOutput',
                            default: 'set pwm pin [PIN] out [OUT]',
                            description: 'arduinoUno set pwm pin out'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: 'pwmPins',
                                defaultValue: PwmPins.D3
                            },
                            OUT: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'readDigitalPin',
                        text: formatMessage({
                            id: 'arduinoUno.pins.readDigitalPin',
                            default: 'read digital pin [PIN]',
                            description: 'arduinoUno read digital pin'
                        }),
                        blockType: BlockType.BOOLEAN,
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: 'pins',
                                defaultValue: DigitalPins.D0
                            }
                        }
                    },
                    {
                        opcode: 'readAnalogPin',
                        text: formatMessage({
                            id: 'arduinoUno.pins.readAnalogPin',
                            default: 'read analog pin [PIN]',
                            description: 'arduinoUno read analog pin'
                        }),
                        blockType: BlockType.REPORTER,
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: 'analogPins',
                                defaultValue: AnaglogPins.A0
                            }
                        }
                    },
                    '---',
                    {

                        opcode: 'setServoOutput',
                        text: formatMessage({
                            id: 'arduinoUno.pins.setServoOutput',
                            default: 'set servo pin [PIN] out [OUT]',
                            description: 'arduinoUno set servo pin out'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            PIN: {
                                type: ArgumentType.STRING,
                                menu: 'pwmPins',
                                defaultValue: PwmPins.D3
                            },
                            OUT: {
                                type: ArgumentType.ANGLE,
                                defaultValue: 0
                            }
                        }
                    }
                ],
                menus: {
                    pins: {
                        items: this.PINS_MENU
                    },
                    mode: {
                        items: this.MODE_MENU
                    },
                    digitalPins: {
                        items: this.DIGITAL_PINS_MENU
                    },
                    analogPins: {
                        items: this.ANALOG_PINS_MENU
                    },
                    level: {
                        acceptReporters: true,
                        items: this.LEVEL_MENU
                    },
                    pwmPins: {
                        items: this.PWM_PINS_MENU
                    }
                }
            },
            {
                id: 'serial',
                name: formatMessage({
                    default: 'Serial',
                    description: 'The name of the arduino uno device serial category',
                    id: 'arduinoUno.category.serial',
                }),
                color1: '#9966FF',
                color2: '#774DCB',
                color3: '#774DCB',

                blocks: [
                    {
                        opcode: 'setSerialBaudrate',
                        text: formatMessage({
                            id: 'arduinoUno.serial.setSerialBaudrate',
                            default: 'set serial baudrate [VALUE]',
                            description: 'arduinoUno set serial baudrate'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                menu: 'baudrate',
                                defaultValue: Buadrate.B9600
                            }
                        },
                        programMode: [ProgramModeType.UPLOAD]
                    },
                    {
                        opcode: 'serialPrintString',
                        text: formatMessage({
                            id: 'arduinoUno.serial.serialPrintString',
                            default: 'serial print string [VALUE]',
                            description: 'arduinoUno serial print string'
                        }),
                        blockType: BlockType.COMMAND,
                        arguments: {
                            VALUE: {
                                type: ArgumentType.STRING,
                                defaultValue: 'hello'
                            }
                        },
                        programMode: [ProgramModeType.UPLOAD]
                    },
                    {
                        opcode: 'serialRecivedDataLength',
                        text: formatMessage({
                            id: 'arduinoUno.serial.serialRecivedDataLength',
                            default: 'serial recived data length',
                            description: 'arduinoUno serial recived data length'
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD]
                    },
                    {
                        opcode: 'serialReadAByte',
                        text: formatMessage({
                            id: 'arduinoUno.serial.serialReadAByte',
                            default: 'serial read a byte',
                            description: 'arduinoUno serial read a byte'
                        }),
                        blockType: BlockType.REPORTER,
                        programMode: [ProgramModeType.UPLOAD]
                    }
                ],
                menus: {
                    baudrate: {
                        items: this.BAUDTATE_MENU
                    }
                }
            }
        ]
    }

    /**
     * Set pin mode.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after the set pin mode is done.
     */
    setPinMode(args) {
        this._peripheral.setPinMode(args.PIN, args.MODE);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, SerialportSendInterval);
        });
    }

    /**
     * Set pin digital out level.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after the set pin digital out level is done.
     */
    setDigitalOutput(args) {
        this._peripheral.setDigitalOutput(args.PIN, args.LEVEL);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, SerialportSendInterval);
        });
    }

    /**
     * Set pin pwm out value.
     * @param {object} args - the block's arguments.
     * @return {Promise} - a Promise that resolves after the set pin pwm out value is done.
     */
    setPwmOutput(args) {
        this._peripheral.setPwmOutput(args.PIN, args.OUT);
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, SerialportSendInterval);
        });
    }

    /**
     * Read pin digital level.
     * @param {object} args - the block's arguments.
     * @return {boolean} - true if read high level, false if read low level.
     */
    readDigitalPin(args) {
        return this._peripheral.readDigitalPin(args.PIN);
    }

    /**
     * Read analog pin.
     * @param {object} args - the block's arguments.
     * @return {number} - analog value fo the pin.
     */
    readAnalogPin(args) {
        return this._peripheral.readAnalogPin(args.PIN);
    }
}

module.exports = Scratch3ArduinoUnoDevice;
