require('babel-polyfill');
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Video = require('../../io/video');
const formatMessage = require('format-message');
const tf = require('@tensorflow/tfjs');
const mobilenetModule = require('./mobilenet.js');
const knnClassifier = require('@tensorflow-models/knn-classifier');

/**
 * Sensor attribute video sensor block should report.
 * @readonly
 * @enum {string}
 */
const SensingAttribute = {
    /** The amount of motion. */
    MOTION: 'motion',

    /** The direction of the motion. */
    DIRECTION: 'direction'
};

/**
 * Subject video sensor block should report for.
 * @readonly
 * @enum {string}
 */
const SensingSubject = {
    /** The sensor traits of the whole stage. */
    STAGE: 'Stage',

    /** The senosr traits of the area overlapped by this sprite. */
    SPRITE: 'this sprite'
};

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
const VideoState = {
    /** Video turned off. */
    OFF: 'off',

    /** Video turned on with default y axis mirroring. */
    ON: 'on',

    /** Video turned on without default y axis mirroring. */
    ON_FLIPPED: 'on-flipped'
};

let typeArr = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10'
]

/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

const Message = {
    Knn : {
          'en': ' Knn classifier',
          'gu': 'Knn ક્લાસિફાયર',
          'hi': 'Knn क्लासिफायरियर'
      },
      videoToggle: {
          'en': 'turn video [VIDEO_STATE] ',
          'gu':'વિડિઓ ચાલુ કરો [VIDEO_STATE]',
          'hi': 'वीडियो चालू करें [VIDEO_STATE]'
      },
      setVideoTransparency : {
          'en': 'set video transparency to [TRANSPARENCY]',
          'gu':'વિડિયો પારદર્શિતાને [TRANSPARENCY] પર સેટ કરો',
          'hi': 'वीडियो पारदर्शिता को [TRANSPARENCY] पर सेट करें'
      },
      isloaded : {
          'en': 'is loaded',
          'gu': 'લોડ થયેલ છે',
          'hi': 'लोड किया गया है'
      },
      trainA : {
          
          'en': 'Train 1 [STRING]',
          'gu': 'ટ્રેન 1 [STRING]',
          'hi': 'ट्रेन 1 [स्ट्रिंग]'
      },
      trainB : {
        
          'en': 'Train 2 [STRING]',
          'gu': 'ટ્રેન 2 [STRING] ',
          'hi': 'ट्रेन 2 [स्ट्रिंग]'
  
      },
      trainc : {
          
          'en': 'Train 3 [STRING]',
          'gu': 'ટ્રેન 3 [STRING]',
          'hi': 'ट्रेन 3 [स्ट्रिंग]'
      },
      train : {
         
          'en': 'Train label [type] [STRING]',
          'gu': 'ટ્રેન લેબલ [type] [STRING]',
          'hi': 'ट्रेन लेबल [type] [STRING]'
      },
      addTrainType: {
          
          'en': 'add train type',
          'gu': 'ટ્રેન પ્રકાર ઉમેરો',
          'hi': 'ट्रेन का प्रकार जोड़ें'
      },
      resetTrain : {
          
          'en': 'Reset [STRING]',
          'gu': 'રીસેટ કરો [STRING]',
          'hi': 'रीसेट करें [STRING'
      },
      Sample1 : {
         
          'en': 'Sample',
          'gu': 'નમૂના',
          'hi': 'सैंपल'
      },
      Sample2: {
          
        'en': 'Sample',
        'gu': 'નમૂના',
        'hi': 'सैंपल'
    },
    Sample3 : {
        
        'en': 'Sample',
        'gu': 'નમૂના',
        'hi': 'सैंपल'
    },
    Samples : {
       
        'en': 'Samples [STRING] ',
        'gu': 'નમૂનાઓ',
        'hi': 'सैंपलस'
    },
    getResult  : {
       
      'en': 'Result',
      'gu': 'પરિણામ',
      'hi': 'नतीजा'
  },
  getConfidence:  {
       
    'en': 'getConfidence [STRING] ',
    'gu': 'આત્મવિશ્વાસ મેળવો [STRING]',
    'hi': 'आत्मविश्वास प्राप्त करें [STRING]'
  },
  off:{
    'en': 'off',
    'gu': 'બંધ',
    'hi': 'बंद करें'
  },
  on:{
    'en': 'on',
    'gu': 'ચાલુ',
    'hi': 'चालू करें'
  },
  on_flipp:{
    'en': 'on flip',
    'gu': 'ફ્લિપ પર ચાલુ',
    'hi': 'फ्लिप पर चालू करें'
  },
  whenGetResult:{
    'en': 'When get  [STRING] ',
    'gu': 'જ્યારે મેળવો [STRING]',
    'hi': 'जब प्राप्त करें [STRING]'
  },
  label1:{
    'en': 'label1',
    'gu': 'લેબલ1',
    'hi': 'लेबल1'
  },
  label2:{
    'en': 'label2',
    'gu': 'લેબલ2',
    'hi': 'लेबल2'
  },
  label3:{
    'en': 'label3',
    'gu': 'લેબલ3',
    'hi': 'लेबल3'
  },
  label4:{
    'en': 'label4',
    'gu': 'લેબલ4',
    'hi': 'लेबल4'
  },
  };
   
  const AvailableLocales = ['en', 'hi', 'gu',];
  

class Scratch3Knn {
    constructor(runtime) {
        this.knn = null
        this.trainTypes = typeArr.map(item => {
            return 'label' + item
        })
        this.knnInit()
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this.locale = this.setLocale();

        /**
         * The last millisecond epoch timestamp that the video stream was
         * analyzed.
         * @type {number}
         */
        this._lastUpdate = null;
        this.KNN_INTERVAL = 1000
        if (this.runtime.ioDevices) {
            // Clear target motion state values when the project starts.
            this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));

            // Kick off looping the analysis logic.
            // this._loop();

            // Configure the video device with values from a globally stored
            // location.
            this.setVideoTransparency({
                TRANSPARENCY: 10
            });
            this.videoToggle({
                VIDEO_STATE: this.globalVideoState
            });
        }

        setInterval(async () => {
            if (this.globalVideoState === VideoState.ON) {
                await this.gotResult()
                console.log('knn result:', this.trainResult)
            }
        }, this.KNN_INTERVAL)
    }

    /**
     * After analyzing a frame the amount of milliseconds until another frame
     * is analyzed.
     * @type {number}
     */
    static get INTERVAL() {
        return 33;
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS() {
        return [480, 360];
    }

    /**
     * The key to load & store a target's motion-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.videoSensing';
    }

    /**
     * The default motion-related state, to be used when a target has no existing motion state.
     * @type {MotionState}
     */
    static get DEFAULT_MOTION_STATE() {
        return {
            motionFrameNumber: 0,
            motionAmount: 0,
            motionDirection: 0
        };
    }

    /**
     * The transparency setting of the video preview stored in a value
     * accessible by any object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoTransparency() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 10;
    }

    set globalVideoTransparency(transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    /**
     * The video state of the video preview stored in a value accessible by any
     * object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoState() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        return VideoState.ON;
    }

    set globalVideoState(state) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    /**
     * Reset the extension's data motion detection data. This will clear out
     * for example old frames, so the first analyzed frame will not be compared
     * against a frame from before reset was called.
     */
    reset() {
        const targets = this.runtime.targets;
        for (let i = 0; i < targets.length; i++) {
            const state = targets[i].getCustomState(Scratch3Knn .STATE_KEY);
            if (state) {
                state.motionAmount = 0;
                state.motionDirection = 0;
            }
        }
    }

    /**
     * Occasionally step a loop to sample the video, stamp it to the preview
     * skin, and add a TypedArray copy of the canvas's pixel data.
     * @private
     */
    _loop() {
        setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, Scratch3Knn .INTERVAL));

        // Add frame to detector
        const time = Date.now();
        if (this._lastUpdate === null) {
            this._lastUpdate = time;
        }
        const offset = time - this._lastUpdate;
        if (offset > Scratch3Knn .INTERVAL) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Scratch3Knn .DIMENSIONS
            });
            if (frame) {
                this._lastUpdate = time;
            }
        }
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu(info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    /**
     * @param {Target} target - collect motion state for this target.
     * @returns {MotionState} the mutable motion state associated with that
     *   target. This will be created if necessary.
     * @private
     */
    _getMotionState(target) {
        let motionState = target.getCustomState(Scratch3Knn .STATE_KEY);
        if (!motionState) {
            motionState = Clone.simple(Scratch3Knn .DEFAULT_MOTION_STATE);
            target.setCustomState(Scratch3Knn .STATE_KEY, motionState);
        }
        return motionState;
    }

    static get SensingAttribute() {
        return SensingAttribute;
    }

    /**
     * An array of choices of whether a reporter should return the frame's
     * motion amount or direction.
     * @type {object[]} an array of objects
     * @param {string} name - the translatable name to display in sensor
     *   attribute menu
     * @param {string} value - the serializable value of the attribute
     */
    get ATTRIBUTE_INFO() {
        return [
            {
                name: 'motion',
                value: SensingAttribute.MOTION
            },
            {
                name: 'direction',
                value: SensingAttribute.DIRECTION
            }
        ];
    }

    static get SensingSubject() {
        return SensingSubject;
    }

    /**
     * An array of info about the subject choices.
     * @type {object[]} an array of objects
     * @param {string} name - the translatable name to display in the subject menu
     * @param {string} value - the serializable value of the subject
     */
    get SUBJECT_INFO() {
        return [
            {
                name: 'stage',
                value: SensingSubject.STAGE
            },
            {
                name: 'sprite',
                value: SensingSubject.SPRITE
            }
        ];
    }

    /**
     * States the video sensing activity can be set to.
     * @readonly
     * @enum {string}
     */
    static get VideoState() {
        return VideoState;
    }

    /**
     * An array of info on video state options for the "turn video [STATE]" block.
     * @type {object[]} an array of objects
     * @param {string} name - the translatable name to display in the video state menu
     * @param {string} value - the serializable value stored in the block
     */
    get VIDEO_STATE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.off',
                    default: 'off',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.OFF
            },
            {
                name: formatMessage({
                    id: 'videoSensing.on',
                    default: 'on',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.ON
            },
            {
                name: formatMessage({
                    id: 'videoSensing.onFlipped',
                    default: 'on flipped',
                    description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
                        ' horizontally (reversed as in a mirror)'
                }),
                value: VideoState.ON_FLIPPED
            }
        ];
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        this.locale = this.setLocale();
        return {
            extensionId: 'faceapi',
            name: 'KNN Classifier',
            blocks: [
                {
                    opcode: 'videoToggle',
                    text:Message.videoToggle[this.locale],
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.NUMBER,
                            menu: 'VIDEO_STATE',
                            defaultValue: VideoState.ON
                        }
                    }
                },
                {
                    opcode: 'setVideoTransparency',
                    text: Message.setVideoTransparency[this.locale],
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'isloaded',
                    blockType: BlockType.BOOLEAN,
                    text: Message.isloaded[this.locale]
                },
                {
                    opcode: 'trainA',
                    blockType: BlockType.COMMAND,
                    text: Message.trainA[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "label1",
                            text:Message.label1[this.locale]
                        }
                    }
                },
                {
                    opcode: 'trainB',
                    blockType: BlockType.COMMAND,
                    text:  Message.trainB[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "label2",
                            text:Message.label2[this.locale]
                        }
                    }
                },
                {
                    opcode: 'trainC',
                    blockType: BlockType.COMMAND,
                    text:  Message.trainc[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "label3",
                            text:Message.label3[this.locale]
                        }
                    }
                },
                {
                    opcode: 'train',
                    blockType: BlockType.COMMAND,
                    text:  Message.train[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "label4"
                        },
                        type: {
                            type: ArgumentType.STRING,
                            menu: 'typemenu',
                            defaultValue: "4",
                            text:Message.label4[this.locale]
                        }
                    }
                },
                {
                    opcode: 'addTrainType',
                    blockType: BlockType.COMMAND,
                    text:  Message.addTrainType[this.locale]
                },
                {
                    opcode: 'resetTrain',
                    blockType: BlockType.COMMAND,
                    text:  Message.resetTrain[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "label1",
                            text:Message.label1[this.locale]
                        }
                    }
                },
                {
                    opcode: 'Sample1',
                    blockType: BlockType.REPORTER,
                    text: Message.Sample1[this.locale] + '1',
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            text:Message.label1[this.locale],
                            defaultValue: "label1"
                        }
                    }
                },
                {
                    opcode: 'Sample2',
                    blockType: BlockType.REPORTER,
                    text: Message.Sample2[this.locale]+ '2',
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            text:Message.label1[this.locale],
                            defaultValue: "label1"
                        }
                    }
                },
                {
                    opcode: 'Sample3',
                    blockType: BlockType.REPORTER,
                    text: Message.Sample3[this.locale] + '3',
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            text:Message.label1[this.locale],
                            defaultValue: "label1"
                        }
                    }
                },
                {
                    opcode: 'Samples',
                    blockType: BlockType.REPORTER,
                    text: Message.Samples[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            text:Message.label1[this.locale],
                            defaultValue: "label1"
                        }
                    }
                },
                {
                    opcode: 'getResult',
                    blockType: BlockType.REPORTER,
                    text: Message.getResult[this.locale],
                    arguments: {

                    }
                },
                {
                    opcode: 'getConfidence',
                    blockType: BlockType.REPORTER,
                    text: Message.getConfidence[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            text:Message.label1[this.locale],
                            defaultValue: "label1"
                        }
                    }
                },
                {
                    opcode: 'whenGetResult',
                    blockType: BlockType.HAT,
                    text: Message.whenGetResult[this.locale],
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            text:Message.label1[this.locale],
                            defaultValue: "label1"
                        }
                    }
                }
            ],
            menus: {
                ATTRIBUTE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.ATTRIBUTE_INFO)
                },
                SUBJECT: {
                    acceptReporters: true,
                    items: this._buildMenu(this.SUBJECT_INFO)
                },
                VIDEO_STATE: {
                    acceptReporters: true,
                    items:this._buildMenu(this.VIDEO_STATE_INFO),
                },
                typemenu: {
                    acceptReporters: true,
                    items: '_typeArr'
                }
            }
        };
    }

    _typeArr () {
        return typeArr.slice(3).map(item => item.toString())
    }
    /**
     * A scratch command block handle that configures the video state from
     * passed arguments.
     * @param {object} args - the block arguments
     * @param {VideoState} args.VIDEO_STATE - the video state to set the device to
     */
    videoToggle(args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this.runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }

    clearClass(classIndex) {
        this.classifier.clearClass(classIndex);
    }

    updateExampleCounts(args, util) {
        let counts = this.classifier.getClassExampleCount();
        this.runtime.emit('SAY', util.target, 'say', this.trainTypes.map((item, index) => {
            return item + '样本数：' + (counts[index] || 0) + '\n'
        }).join('\n'));
    }

    isloaded() {
        return Boolean(this.mobilenet)
    }
    train(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            console.log('请先打开摄像头')
            return
        }
        let index = typeArr.findIndex(item => item === args.type)
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, index);
            this.trainTypes[index] = args.STRING
        }
    }

    addTrainType() {
        typeArr.push((typeArr.length + 1).toString())
        this.trainTypes.push('label' + (this.trainTypes.length + 1).toString())
    }

    trainA(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            alert('请先打开摄像头')
            return
        }
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, 0);
            this.trainTypes[0] = args.STRING
        }
    }

    trainB(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            alert('请先打开摄像头')
            return
        }
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, 1);
            this.trainTypes[1] = args.STRING
        }
    }

    trainC(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            alert('请先打开摄像头')
            return
        }
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, 2);
            this.trainTypes[2] = args.STRING
        }
    }

    trainD(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            alert('请先打开摄像头')
            return
        }
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, 3);
            this.trainTypes[3] = args.STRING
            this.updateExampleCounts(args, util);
        }
    }

    trainE(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            alert('请先打开摄像头')
            return
        }
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, 4);
            this.trainTypes[4] = args.STRING
            this.updateExampleCounts(args, util);
        }
    }

    trainF(args, util) {
        if (this.globalVideoState === VideoState.OFF) {
            alert('请先打开摄像头')
            return
        }
        let img = document.createElement('img')
        img.src = this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_CANVAS,
            dimensions: Scratch3Knn.DIMENSIONS
        }).toDataURL("image/png")
        img.width = 480
        img.height = 360
        img.onload = () => {
            const img0 = tf.browser.fromPixels(img);
            const logits0 = this.mobilenet.infer(img0, 'conv_preds');
            this.classifier.addExample(logits0, 5);
            this.trainTypes[5] = args.STRING
            this.updateExampleCounts(args, util);
        }
    }
    Samples(args, util) {
        let counts = this.classifier.getClassExampleCount();
        let index = this.trainTypes.indexOf(args.STRING)
        return counts[index] || 0
    }
    Sample1(args, util) {
        let counts = this.classifier.getClassExampleCount();
        let index = 0
        return counts[index] || 0
    }
    Sample2(args, util) {
        let counts = this.classifier.getClassExampleCount();
        let index = 1
        return counts[index] || 0
    }
    Sample3(args, util) {
        let counts = this.classifier.getClassExampleCount();
        let index = 2
        return counts[index] || 0
    }
    resetTrain(args, util) {
        let counts = this.classifier.getClassExampleCount();
        let index = this.trainTypes.indexOf(args.STRING)
        if (!counts[index]) {
            alert('该类别无训练数据')
            return
        }
        if (index < 0) {
            alert('未找到对应类别')
            return
        }
        this.clearClass(index);
        // this.updateExampleCounts(args, util);
    }

    getResult(args, util) {
        return this.trainResult
    }
    getConfidence(args, util) {
        let index = this.trainTypes.indexOf(args.STRING)
        if (index === -1) {
            return 0
        }
        return (this.trainConfidences && this.trainConfidences[index]) || 0
    }
    gotResult(args, util) {
        return new Promise((resolve, reject) => {
            let img = document.createElement('img')
            let frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_CANVAS,
                dimensions: Scratch3Knn.DIMENSIONS
            })
            if (!Object.keys(this.classifier.getClassExampleCount()).length) {
                resolve()
                return
            }
            if (frame) {
                img.src = frame.toDataURL("image/png")
            } else {
                resolve()
                return
            }
            img.width = 480
            img.height = 360
            img.onload = async () => {
                const x = tf.browser.fromPixels(img);
                const xlogits = this.mobilenet.infer(x, 'conv_preds');
                console.log('Predictions:');
                let res = await this.classifier.predictClass(xlogits);
                console.log(this.classifier.getClassExampleCount(), res)
                this.trainResult = this.trainTypes[res.classIndex] || 0
                this.trainConfidences = res.confidences
                resolve(this.trainResult)
            }
        })
    }

    whenGetResult(args, util) {
        if (this.trainResult === undefined) {
            return false
        }
        setTimeout(() => {
            this.trainResult = undefined
        }, 100)
        return args.STRING === this.trainResult
    }

    async knnInit () {
        this.classifier = knnClassifier.create();
        this.mobilenet = await mobilenetModule.load();
    }

    setLocale() {
        let locale = formatMessage.setup().locale;
        if (AvailableLocales.includes(locale)) {
          return locale;
        } else {
          return 'en';
        }
      }

}

module.exports = Scratch3Knn;
