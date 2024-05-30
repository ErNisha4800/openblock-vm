require('babel-polyfill');
/**
* @license
../../../extension-support/argument-type  ../../../extension-support/block-type  format-message  face-api.js  ../../../engine/runtime  ../../../io/video  ../../../engine/stage-layering */
'use strict';

 var ArgumentType = require("../../extension-support/argument-type.js");
 var BlockType = require("../../extension-support/block-type.js");
 var formatMessage  = require("format-message/index.js");
 var faceapi = require("@vladmandic/face-api");
 var CheckDailyStat = require("blockzie-vm/src/engine/runtime.js");
 var Video = require("../../io/video.js");
 var StageLayering = require("../../engine/stage-layering.js");
 var data = [];
 var isStage = false;
 var size_buffer = false;
 var blockIconURI = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMzMiIGRhdGEtbmFtZT0iTGF5ZXIgMzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48c3R5bGU+LmNscy0xe29wYWNpdHk6MC4wOTt9LmNscy0ye2ZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MS41cHg7fS5jbHMtM3tmaWxsOiNmNmM3OTI7fS5jbHMtNHtmaWxsOiNkZGIzODQ7fS5jbHMtNXtmaWxsOiMyNjIyNjE7fS5jbHMtNntmaWxsOiNmY2M2OTA7fS5jbHMtN3tmaWxsOiNmNmM4OTk7fS5jbHMtOHtmaWxsOiMxYTFhMWE7fS5jbHMtOXtmaWxsOiNmZmY7fS5jbHMtMTB7ZmlsbDojOWJiMWMxO308L3N0eWxlPjwvZGVmcz48dGl0bGU+SWNvbl9GYWNlIERldGVjdGlvbjwvdGl0bGU+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIyNi4wOCA1LjYyIDMyLjgxIDUuNjIgMzIuODEgMTIuODYiLz48cG9seWxpbmUgY2xhc3M9ImNscy0yIiBwb2ludHM9IjI1Ljk5IDI4Ljk1IDMyLjcyIDI4Ljk1IDMyLjcyIDIxLjciLz48cG9seWxpbmUgY2xhc3M9ImNscy0yIiBwb2ludHM9IjEzLjQ2IDUuMTYgNi43MyA1LjE2IDYuNzMgMTIuNCIvPjxwb2x5bGluZSBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMTMuNTUgMjguNDkgNi44MiAyOC40OSA2LjgyIDIxLjI1Ii8+PHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMTUuOSwyNi44MXYxLjVsLTEuMjUsMy42MnMxLjg3LDMuNTcsNS40OSwyLjY3LDQuNjUtMy4yNiw0LjY1LTMuMjZsLTEuNC0zLjQ3TDIzLDI3LjE3WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTE1LjksMjcuMjl2MXMyLjg0LDIuOSw2LjMsMi45MywyLjA2LDAsMi4wNiwwbDAuNDUtLjExLTEuMDktMi43OUwyMy41NywyN1oiLz48cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik03Ljg4LDMyLjM1SDMxLjY1QTMuNjUsMy42NSwwLDAsMSwzNS4zLDM2djIuMTZhMCwwLDAsMCwxLDAsMEg0LjIzYTAsMCwwLDAsMSwwLDBWMzZBMy42NSwzLjY1LDAsMCwxLDcuODgsMzIuMzVaIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMjcsMjEuNThzMC4wNywxLjExLjgyLDAuMjcsMi44My00LjU5LjIzLTQuOTRsLTEuNDksMVoiLz48cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik0xMi40OSwyMS41OHMtMC4wNywxLjExLS44Mi4yNy0yLjgzLTQuNTktLjIzLTQuOTRsMS40OSwxWiIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTEyLDE3LjI2bDAuNDUsNC42NFMxNSwyOS40NSwxOS44LDI5Ljc0czcuMjQtOCw3LjI0LThsMC40MS0zLjZWMTEuODRMMjUuMTgsMTAuMkgyMC4zOWwtNS42MS4yNi0yLC4zN0wxMS42NiwxMloiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik0xMi4wOSwxOS43NmExNy41OCwxNy41OCwwLDAsMS0uODEtNC45YzAtMi4zNy0xLjctOSwzLjktOS40MiwwLDAsLjkyLTEuNjcsNC44OC0xLjM0czMuNjgtMiwzLjY4LTIsNy4zMywyLjE3LDQuNDMsMTIuNTFhMTEuNjYsMTEuNjYsMCwwLDEtLjc1LDUuMjFzLTAuOTUuMzMtLjMzLTUuMjdjMCwwLC45NS00Ljc2LTMuNDMtMy44N2ExOC4yLDE4LjIsMCwwLDEtNy43Ny0uMDZzLTUuMTUtMS4xNC0zLjY4LDQuODVDMTIuMiwxNS41MiwxMi44NywxOC4zNiwxMi4wOSwxOS43NloiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik0xNS4xOCwyNy42M2w0LjUxLDQuNzJhMTIuNzcsMTIuNzcsMCwwLDAtMi4xNiwycy0yLjIyLS41MS0zLjQ0LTMuNThaIi8+PHBhdGggY2xhc3M9ImNscy05IiBkPSJNMjQuMTgsMjcuNjNsLTQuNDksNC43MmExMi43NywxMi43NywwLDAsMSwyLjE2LDJzMi4yMi0uNTEsMy40NC0zLjU4WiIvPjxwYXRoIGNsYXNzPSJjbHMtMTAiIGQ9Ik0xNC4xNSwzMC44MXMxLjM0LDQuMTQsNS41NywzLjg2YTYuNDUsNi40NSwwLDAsMCw1LjU4LTMuODgsMy42OCwzLjY4LDAsMCwwLDEuNjMuNjUsOC4xMyw4LjEzLDAsMCwxLTcuMjYsNXMtNC43Mi40MS03LjE5LTQuOTJaIi8+PHBvbHlnb24gY2xhc3M9ImNscy01IiBwb2ludHM9IjEyLjQ4IDMxLjQ4IDEyLjk0IDMyLjM2IDcuMiAzMi40MyAxMi40OCAzMS40OCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtNSIgcG9pbnRzPSIyNi45MyAzMS40NCAyNi40MyAzMi40MyAzMS45NSAzMi4zNyAyNi45MyAzMS40NCIvPjwvc3ZnPg==";
 var menuIconURI = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMzMiIGRhdGEtbmFtZT0iTGF5ZXIgMzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQwIDQwIj48ZGVmcz48c3R5bGU+LmNscy0xe29wYWNpdHk6MC4wOTt9LmNscy0ye2ZpbGw6bm9uZTtzdHJva2U6I2ZmZjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MS41cHg7fS5jbHMtM3tmaWxsOiNmNmM3OTI7fS5jbHMtNHtmaWxsOiNkZGIzODQ7fS5jbHMtNXtmaWxsOiMyNjIyNjE7fS5jbHMtNntmaWxsOiNmY2M2OTA7fS5jbHMtN3tmaWxsOiNmNmM4OTk7fS5jbHMtOHtmaWxsOiMxYTFhMWE7fS5jbHMtOXtmaWxsOiNmZmY7fS5jbHMtMTB7ZmlsbDojOWJiMWMxO308L3N0eWxlPjwvZGVmcz48dGl0bGU+SWNvbl9GYWNlIERldGVjdGlvbjwvdGl0bGU+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIyNi4wOCA1LjYyIDMyLjgxIDUuNjIgMzIuODEgMTIuODYiLz48cG9seWxpbmUgY2xhc3M9ImNscy0yIiBwb2ludHM9IjI1Ljk5IDI4Ljk1IDMyLjcyIDI4Ljk1IDMyLjcyIDIxLjciLz48cG9seWxpbmUgY2xhc3M9ImNscy0yIiBwb2ludHM9IjEzLjQ2IDUuMTYgNi43MyA1LjE2IDYuNzMgMTIuNCIvPjxwb2x5bGluZSBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMTMuNTUgMjguNDkgNi44MiAyOC40OSA2LjgyIDIxLjI1Ii8+PHBhdGggY2xhc3M9ImNscy0zIiBkPSJNMTUuOSwyNi44MXYxLjVsLTEuMjUsMy42MnMxLjg3LDMuNTcsNS40OSwyLjY3LDQuNjUtMy4yNiw0LjY1LTMuMjZsLTEuNC0zLjQ3TDIzLDI3LjE3WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTE1LjksMjcuMjl2MXMyLjg0LDIuOSw2LjMsMi45MywyLjA2LDAsMi4wNiwwbDAuNDUtLjExLTEuMDktMi43OUwyMy41NywyN1oiLz48cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik03Ljg4LDMyLjM1SDMxLjY1QTMuNjUsMy42NSwwLDAsMSwzNS4zLDM2djIuMTZhMCwwLDAsMCwxLDAsMEg0LjIzYTAsMCwwLDAsMSwwLDBWMzZBMy42NSwzLjY1LDAsMCwxLDcuODgsMzIuMzVaIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMjcsMjEuNThzMC4wNywxLjExLjgyLDAuMjcsMi44My00LjU5LjIzLTQuOTRsLTEuNDksMVoiLz48cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik0xMi40OSwyMS41OHMtMC4wNywxLjExLS44Mi4yNy0yLjgzLTQuNTktLjIzLTQuOTRsMS40OSwxWiIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTEyLDE3LjI2bDAuNDUsNC42NFMxNSwyOS40NSwxOS44LDI5Ljc0czcuMjQtOCw3LjI0LThsMC40MS0zLjZWMTEuODRMMjUuMTgsMTAuMkgyMC4zOWwtNS42MS4yNi0yLC4zN0wxMS42NiwxMloiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik0xMi4wOSwxOS43NmExNy41OCwxNy41OCwwLDAsMS0uODEtNC45YzAtMi4zNy0xLjctOSwzLjktOS40MiwwLDAsLjkyLTEuNjcsNC44OC0xLjM0czMuNjgtMiwzLjY4LTIsNy4zMywyLjE3LDQuNDMsMTIuNTFhMTEuNjYsMTEuNjYsMCwwLDEtLjc1LDUuMjFzLTAuOTUuMzMtLjMzLTUuMjdjMCwwLC45NS00Ljc2LTMuNDMtMy44N2ExOC4yLDE4LjIsMCwwLDEtNy43Ny0uMDZzLTUuMTUtMS4xNC0zLjY4LDQuODVDMTIuMiwxNS41MiwxMi44NywxOC4zNiwxMi4wOSwxOS43NloiLz48cGF0aCBjbGFzcz0iY2xzLTkiIGQ9Ik0xNS4xOCwyNy42M2w0LjUxLDQuNzJhMTIuNzcsMTIuNzcsMCwwLDAtMi4xNiwycy0yLjIyLS41MS0zLjQ0LTMuNThaIi8+PHBhdGggY2xhc3M9ImNscy05IiBkPSJNMjQuMTgsMjcuNjNsLTQuNDksNC43MmExMi43NywxMi43NywwLDAsMSwyLjE2LDJzMi4yMi0uNTEsMy40NC0zLjU4WiIvPjxwYXRoIGNsYXNzPSJjbHMtMTAiIGQ9Ik0xNC4xNSwzMC44MXMxLjM0LDQuMTQsNS41NywzLjg2YTYuNDUsNi40NSwwLDAsMCw1LjU4LTMuODgsMy42OCwzLjY4LDAsMCwwLDEuNjMuNjUsOC4xMyw4LjEzLDAsMCwxLTcuMjYsNXMtNC43Mi40MS03LjE5LTQuOTJaIi8+PHBvbHlnb24gY2xhc3M9ImNscy01IiBwb2ludHM9IjEyLjQ4IDMxLjQ4IDEyLjk0IDMyLjM2IDcuMiAzMi40MyAxMi40OCAzMS40OCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtNSIgcG9pbnRzPSIyNi45MyAzMS40NCAyNi40MyAzMi40MyAzMS45NSAzMi4zNyAyNi45MyAzMS40NCIvPjwvc3ZnPg==";
 var totalSizes = [];
 var factor = 0;
var netModel;
var faces;
var drawOnStage = true;
const Runtime = require('../../engine/runtime');

 var MakerAttributes = [];

 for (var i = 0; i < 100; i++) {
   MakerAttributes[i] = {
     color4f: [Math.random(), Math.random(), Math.random(), 0.7],
     diameter: 3
   };
 }
 
 var faceThreshold = 0.5;
/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
const AvailableLocales = [  'en', 'gu', 'hi'];

const Message = {
  FaceDetection : {
        'en': ' Face Detection',
        'gu': 'ચહેરાની તપાસ',
        'hi': 'चेहरे का पहचान'
    },
     toggleStageVideoFeed: {
        'en': 'turn [VIDEO_STATE] video on stage with [TRANSPARENCY] % transparency ',
        'gu':'સ્ટેજ પર [VIDEO_STATE] % પારદર્શિતા સાથે [TRANSPARENCY] વિડિઓ ચાલુ કરો ',
        'hi': '[VIDEO_STATE] वीडियो को [TRANSPARENCY] % पारदर्शिता के साथ मंच पर चालू करें'
    },
    drawBoundingBox : {
        'en': 'Draw bounding box',
        'gu':'બાઉન્ડિંગ બોક્સ દોરો',
        'hi': 'बाउंडिंग बॉक्स बनाएं'
    },
    setThreshold : {
        'en': 'set detection threshold to [THRESHOLD]',
        'gu': 'ડિટેક્શન થ્રેશોલ્ડને [THRESHOLD] પર સેટ કરો',
        'hi': 'पहचान सीमा को [THRESHOLD] पर सेट करें'
    },
    analyseImage : {
        
        'en': 'analyse image from [FEED]',
        'gu': '[FEED] માંથી છબીનું વિશ્લેષણ કરો',
        'hi': '[FEED] से छवि का विश्लेषण करें'
    },
    getNumberFaces : {
      
        'en': 'get # faces',
        'gu': '# ચહેરા મેળવો ',
        'hi': '#चेहरे प्राप्त करें'

    },
    getOption : {
        
        'en': 'get expression of face [FACE]',
        'gu': 'ચહેરાની અભિવ્યક્તિ મેળવો [FACE]',
        'hi': 'चेहरे की अभिव्यक्ति प्राप्त करें [FACE]'
    },
    isExpression : {
       
        'en': 'is expression of face [FACE] [EXPRESSION]',
        'gu': 'ચહેરાની અભિવ્યક્તિ છે  [FACE] [EXPRESSION]',
        'hi': 'चेहरे की अभिव्यक्ति है [FACE] [EXPRESSION]'
    },
    boxPosition: {
        
        'en': 'get [POSITION] of face [FACE]',
        'gu': 'ચોક્કસ  [POSITION] પ્રાપ્ત કરો [FACE]',
        'hi': 'चेहरे की [POSITION] प्राप्त करें[FACE]'
    },
    faceLandmarksF : {
        
        'en': 'get [POSITION] of [LANDMARK] of face [FACE]',
        'gu': 'ચહેરા  [FACE] ના [LANDMARK] પરથી [POSITION] મેળવો',
        'hi': 'चेहरे के [LANDMARK] में से [POSITION] प्राप्त करें  [FACE]'
    },
    landmarks : {
       
        'en': 'get [POSITION] of landmark [LANDMARK] of face [FACE]',
        'gu': 'ચહેરા [FACE] ના સીમાચિહ્ન [LANDMARK] નું [POSITION] મેળવો',
        'hi': 'चेहरे [FACE] के लैंडमार्क [LANDMARK] की [POSITION] प्राप्त करें'
    },
    saveImage: {
        
      'en': 'add class [FACE] as [NAME] from [FEED]',
      'gu': '[FEED] માંથી [FACE] વર્ગને [NAME] તરીકે ઉમેરો',
      'hi': '[FEED] से [NAME] के रूप में वर्ग [FACE] जोड़ें'
  },
  deleteImage : {
      
      'en': 'reset class',
      'gu': 'વર્ગ ફરીથી સેટ કરો',
      'hi': 'कक्षा रीसेट करें'
  },
  getFace : {
     
      'en': 'get class of face [FACE] detected',
      'gu': 'ચહેરાનો વર્ગ [FACE] શોધી કાઢો',
      'hi': 'चेहरा वर्ग [FACE] खोजें।'
  },
  isClassDetected  : {
     
    'en': 'is [FACE] class detected',
    'gu': '[FACE] વર્ગ શોધાયેલ છે',
    'hi': '[FACE] वर्ग का पता चला'
},
doFaceMatching:  {
     
  'en': 'do face matching on [FEED]',
  'gu': '[FEED] પર ચહેરા મેચિંગ કરો',
  'hi': '[FEED] पर चेहरा मिलान करें।'
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
angry:{
  'en': 'angry',
  'gu': 'ગુસ્સો',
  'hi': 'गुस्सा'
},
disgusted:{
  'en':'disgusted',
  'gu': 'નારાજ',
  'hi': 'निराश'
},
fear:{
  'en':'fear',
  'gu': 'ભય',
  'hi': 'भय'
},
happy:{
  'en':'happy',
  'gu': 'ખુશ',
  'hi': 'खुश'
},
neutral:{
  'en':'natural',
  'gu': 'કુદરતી',
  'hi': 'प्राकृतिक'
},
sad:{
  'en':'sad',
  'gu': 'દુઃખ',
  'hi': 'दुख'
},
surprised:{
  'en':'surprised',
  'gu': 'આશ્ચર્ય',
  'hi': 'आश्चर्य'
},
camera:{
  'en':'camera',
  'gu':'કેમેરા',
  'hi':'कैमरा'
},
stage:{
  'en':'stage',
  'gu':'સ્ટેજ',
  'hi':'मंच'
},
x_position:{
 'en':'x position',
 'gu':'એક્સ સ્થિતિ',
 'hi': 'एक्स स्थिति'
},
Y_position:{
  'en':'Y position',
  'gu':'વાય સ્થિતિ',
  'hi': 'वाय स्थिति'
},
width:{
  'en':'width',
  'gu':'પહોળાઈ',
  'hi':'चौड़ाई'
},
height:{
  'en':'height',
  'gu':'ઊચ્ચાઈ',
  'hi':'ऊंचाई'
},
nose:{
  'en':'nose',
  'gu':'નાક',
  'hi':'नाक'
},
chin:{
  'en':'chin',
  'gu':'હડપચી',
  'hi':'हड़पची'

},
mouth:{
  'en':'mouth',
  'gu':'મુખ',
  'hi':'मुख'
},
left_eye:{
  'en':'left eye',
  'gu':'ડાબી આંખ'
  ,'hi':'बाएं आंख'
},
right_eye:{
  'en':'right eye',
  'gu':'જમણી આંખ',
  'hi':'दाएं आंख'
},
left_eyebrow:{
  'en':'left eyebrow',
  'gu':'ડાબી ભમર'
  ,'hi':'बायीं भौंह'
},
right_eyebrow:{
  'en':'right eyebrow',
  'gu':'જમણી ભમર',
  'hi':'दाएं भौंह'
},
age:{
  'en':'age',
  'gu':'ઉંમર',
  'hi':'उम्र'
},
gender:{
  'en':'gender',
  'gu':'જાતિ',
  'hi':'लिंग'
},
expression:{
  'en':'expression',
  'gu':'વ્યક્તિત્વ',
  'hi':'व्यक्तित्व'
},
show:{
  'en':'show',
  'gu':'બતાવો',
  'hi':'दिखाएं'
},
hide:{
  'en':'hide',
  'gu':'છુપાવો',
  'hi':'छिपाएं'
}
};

 class faceDetection {
   constructor(runtime){
    this.faceDetectionInit()
    var _this = this;
    var faceComparision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    
    this.fullFaceDescriptions = [];
    this.fullFaceDescriptions = [];

    for (var _i = 0; _i < 10; _i++) {
      this.fullFaceDescriptions.push([]);
    }

    this.faceComparision = [];

    if (faceComparision && faceComparision.length) {
      console.log("faceComparision.length", faceComparision.length);
      var faceKeys = Object.keys(faceComparision);
      console.log("faceKeys", faceKeys); // Pre load face data

      for (var faceIndex = 0; faceIndex < faceKeys.length; faceIndex++) {
        this.faceComparision[faceKeys[faceIndex]] = new faceapi.LabeledFaceDescriptors.fromJSON(faceComparision[faceKeys[faceIndex]]);
      }
    }

    this.runtime = runtime;
    this.locale = this.setLocale();
    this.runtime.emit('MODEL_LOADING');
    this.modelLoaded = false;
    var self = this;
    netModel = new Promise(function (formatMessage) {
      Promise.all([faceapi.loadSsdMobilenetv1Model('static/models/faceDetection/ssdMobilenetv1ModelWeightsManifest.json'), faceapi.loadFaceLandmarkModel('static/models/faceDetection/faceLandmark68ModelWeightsManifest.json'), faceapi.loadFaceExpressionModel('static/models/faceDetection/faceExpressionModelWeightsManifest.json'), faceapi.loadFaceRecognitionModel('static/models/faceDetection/faceRecognitionModelWeightsManifest.json')]).then(function () {
        runtime.renderer.requestSnapshot(function (data) {
          var image = document.createElement('img');

          image.onload = function () {
            faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
              minConfidence: faceThreshold
            })).withFaceLandmarks(false).withFaceDescriptors().withFaceExpressions().then(function (fullFaceDescriptions) {
              self.modelLoaded = true;
              faces = fullFaceDescriptions;
              isStage = true;
              runtime.emit('MODEL_LOADING_FINISHED', true);
              formatMessage('Done');
              return 'Done';
            });
          };

          image.setAttribute("src", data);
        });
      }).catch(function (err) {
        self.modelLoaded = false;

        _this.runtime.emit('MODEL_LOADING_FINISHED', false);
      });
      _this.globalVideoState = 'off';

      _this.runtime.ioDevices.video.disableVideo();
    });
    this.extensionName = 'Face Detection';
    this._canvas = document.querySelector('canvas');
    this._penSkinId = this.runtime.renderer.createPenSkin();
    var penDrawableId = this.runtime.renderer.createDrawable(StageLayering.IMAGE_LAYER);
    this.runtime.renderer.updateDrawableProperties(penDrawableId, {
      skinId: this._penSkinId
    });
  }
 getInfo() {
  this.locale = this.setLocale();
  return {
    id : "faceDetection",
    name : "Face Detection",
    blockIconURI : blockIconURI,
    menuIconURI : menuIconURI,
    colour : "#c64342",
    colourSecondary : "#b63535",
    colourTertiary : "#a42b2b",
    blocks : [
      {
        opcode: 'faceDetection',
        text: Message.FaceDetection[this.locale],
        blockType: BlockType.COMMAND,                                   
      },
    {
      opcode : "toggleStageVideoFeed",
      text: Message.toggleStageVideoFeed[this.locale],
      blockType : BlockType.COMMAND,
      arguments : {
        VIDEO_STATE : {
          type : ArgumentType.STRING,
          menu : "videoState",
          defaultValue : "on"
        },
        TRANSPARENCY : {
          type : ArgumentType.STRING,
          defaultValue : "0"
        }
      }
    }, {
      opcode : "drawBoundingBox",
      text: Message.drawBoundingBox[this.locale],
      blockType : BlockType.COMMAND,
      arguments : {
        OPTION : {
          type : ArgumentType.NUMBER,
          menu : "drawBox",
          defaultValue : "1"
        }
      }
    }, {
      opcode : "setThreshold",
      text: Message.setThreshold[this.locale],
      blockType : BlockType.COMMAND,
      arguments : {
        THRESHOLD : {
          type : ArgumentType.NUMBER,
          menu : "threshold",
          defaultValue : "0.5"
        }
      }
    }, {
      message : "Detection"
    }, {
      opcode : "analyseImage",
      text: Message.analyseImage[this.locale],
      blockType : BlockType.COMMAND,
      arguments : {
        FEED : {
          type : ArgumentType.NUMBER,
          menu : "feed",
          defaultValue : "1"
        }
      }
    }, "---", {
      opcode : "getNumberFaces",
      text: Message.drawBoundingBox[this.locale],
      blockType : BlockType.REPORTER
    }, {
      opcode : "getOption",
      text: Message.getOption[this.locale],
      blockType : BlockType.REPORTER,
      arguments : {
        FACE : {
          type : ArgumentType.STRING,
          menu : "faceNumber",
          defaultValue : "1"
        }
      }
    }, {
      opcode : "isExpression",
      text: Message.isExpression[this.locale],
      blockType : BlockType.BOOLEAN,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        },
        EXPRESSION : {
          type : ArgumentType.NUMBER,
          menu : "expression",
          defaultValue : "4"
        }
      }
    }, "---", {
      opcode : "boxPosition",
      text: Message.boxPosition[this.locale],
      blockType : BlockType.REPORTER,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        },
        POSITION : {
          type : ArgumentType.NUMBER,
          menu : "facePosition",
          defaultValue : "1"
        }
      }
    }, {
      opcode : "faceLandmarksF",
      text: Message.faceLandmarksF[this.locale],
      blockType : BlockType.REPORTER,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        },
        LANDMARK : {
          type : ArgumentType.NUMBER,
          menu : "faceLandmarks",
          defaultValue : "1"
        },
        POSITION : {
          type : ArgumentType.NUMBER,
          menu : "landmarkPosition",
          defaultValue : "1"
        }
      }
    }, {
      opcode : "landmarks",
      text: Message.landmarks[this.locale],
      blockType : BlockType.REPORTER,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        },
        LANDMARK : {
          type : ArgumentType.NUMBER,
          defaultValue : "1"
        },
        POSITION : {
          type : ArgumentType.NUMBER,
          menu : "landmarkPosition",
          defaultValue : "1"
        }
      }
    }, {
      message : "Face Recognition: Training"
    }, {
      opcode : "saveImage",
      text: Message.saveImage[this.locale],
      blockType : BlockType.COMMAND,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        },
        NAME : {
          type : ArgumentType.STRING,
          defaultValue : "Jarvis"
        },
        FEED : {
          type : ArgumentType.NUMBER,
          menu : "feed",
          defaultValue : "1"
        }
      }
    },
     {
      opcode : "deleteImage",
      text: Message.deleteImage[this.locale],
      blockType : BlockType.COMMAND
    }, {
      message : "Face Recognition: Testing"
    }, {
      opcode : "doFaceMatching",
      text: Message.doFaceMatching[this.locale],
      blockType : BlockType.COMMAND,
      arguments : {
        FEED : {
          type : ArgumentType.NUMBER,
          menu : "feed",
          defaultValue : "1"
        }
      }
    }, {
      opcode : "isClassDetected",
      text: Message.isClassDetected[this.locale],
      blockType : BlockType.BOOLEAN,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        }
      }
    }, {
      opcode : "getFace",
      text: Message.getFace[this.locale],
      blockType : BlockType.REPORTER,
      arguments : {
        FACE : {
          type : ArgumentType.NUMBER,
          menu : "faceNumber",
          defaultValue : "1"
        }
      }
    }],
    menus : {
      videoState : [{
        text : Message.off[this.locale],
        value : "off"
      }, {
        text : Message.on[this.locale],
        value : "on"
      }, {
        text : Message.on_flipp[this.locale],
        value : "onFlipped"
      }],
      faceNumber : {
        acceptReporters : true,
        items : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      },
      expression : {
        acceptReporters : true,
        items : [{
          text : Message.angry[this.locale],
          value : "1"
        }, {
          text :Message.disgusted[this.locale],
          value : "2"
        }, {
          text : Message.fear[this.locale],
          value : "3"
        }, {
          text : Message.happy[this.locale],
          value : "4"
        }, {
          text : Message.neutral[this.locale],
          value : "5"
        }, {
          text : Message.sad[this.locale],
          value : "6"
        }, {
          text : Message.surprised[this.locale],
          value : "7"
        }]
      },
      facePosition : {
        items : [{
          text : Message.x_position[this.locale],
          value : "1"
        }, {
          text : Message.Y_position[this.locale],
          value : "2"
        }, {
          text : Message.width[this.locale],
          value : "3"
        }, {
          text : Message.height[this.locale],
          value : "4"
        }]
      },
      feed : {
        items : [{
          text :Message.camera[this.locale],
          value : "1"
        }, {
          text : Message.stage[this.locale],
          value : "2"
        }]
      },
      option : {
        items : [{
          text : Message.age[this.locale],
          value : "1"
        }, {
          text : Message.gender[this.locale],
          value : "2"
        }, {
          text : Message.expression[this.locale],
          value : "3"
        }]
      },
      landmarkPosition : {
        items : [{
          text : Message.x_position[this.locale],
          value : "1"
        }, {
          text : Message.Y_position[this.locale],
          value : "2"
        }]
      },
      faceLandmarks : {
        items : [{
          text :  Message.nose[this.locale],
          value : "31"
        }, {
          text :  Message.chin[this.locale],
          value : "9"
        }, {
          text :  Message.mouth[this.locale],
          value : "3"
        }, {
          text :  Message.left_eye[this.locale],
          value : "1"
        }, {
          text : Message.right_eye[this.locale],
          value : "2"
        }, {
          text :  Message.left_eyebrow[this.locale],
          value : "20"
        }, {
          text :  Message.right_eyebrow[this.locale],
          value : "25"
        }]
      },
      drawBox : [{
        text : Message.show[this.locale],
        value : "1"
      }, {
        text : Message.hide[this.l],
        value : "2"
      }],
      threshold : {
        acceptReporters : true,
        items : ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"]
      }
    }
  };
}
_drawMark(x1, y1, x2, y2, x3, y3, x4, y4, width, height, num) {
  var widthScale = 480 / width;
  var heightScale = 360 / height;
  x1 = x1 * widthScale - width / 2 * widthScale;
  x2 = x2 * widthScale - width / 2 * widthScale;
  x3 = x3 * widthScale - width / 2 * widthScale;
  x4 = x4 * widthScale - width / 2 * widthScale;
  y1 = height / 2 * heightScale - y1 * heightScale;
  y2 = height / 2 * heightScale - y2 * heightScale;
  y3 = height / 2 * heightScale - y3 * heightScale;
  y4 = height / 2 * heightScale - y4 * heightScale;
  this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x1, y1, x2, y2);
  this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x2, y2, x3, y3);
  this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x4, y4, x3, y3);
  this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x4, y4, x1, y1);
}
_clearMark() {
  this.runtime.renderer.penClear(this._penSkinId);
}
toggleStageVideoFeed(args, util) {
  // if (!this.runtime.checkSessionExists(this.extensionName)) return;
  var state = args.VIDEO_STATE;
  this.globalVideoState = args.VIDEO_STATE;
  this.runtime.ioDevices.video.setPreviewGhost(args.TRANSPARENCY);

  if (state === 'off') {
    drawOnStage = false;

    this._clearMark();

    this.runtime.ioDevices.video.disableVideo();
  } else {
    this.runtime.ioDevices.video.enableVideo(); // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.

    this.runtime.ioDevices.video.mirror = state === 'on';
  }
}
  analyseImage(args, util) {
    var _this2 = this;

      var self = this; // if (!this.runtime.checkSessionExists(this.extensionName)) return;

      if (this.globalVideoState) {
        if (this.modelLoaded) {
          drawOnStage = true;

          if (args.FEED === '1') {
            var translatePromise = new Promise(function (formatMessage) {
              var canvas = document.createElement("canvas");
              canvas.width = 480;
              canvas.height = 360;
              var ctx = canvas.getContext("2d");

              var frame = _this2.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: faceDetection.DIMENSIONS
              });

              if (frame === null) {
                faces = [];
                formatMessage('Camera not ready!');
                return 'Camera not ready!';
              }

              ctx.putImageData(frame, 0, 0);
              var image = document.createElement('img');
              image.src = canvas.toDataURL("image/png");

              image.onload = function () {
                faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
                  minConfidence: faceThreshold
                })).withFaceLandmarks(false).withFaceDescriptors().withFaceExpressions().then(function (fullFaceDescriptions) {
                  faces = fullFaceDescriptions;
                  console.log(fullFaceDescriptions);

                  if (drawOnStage) {
                    self._clearMark();

                    for (var _i2 = 0; _i2 < faces.length; _i2++) {
                      self._drawMark(faces[_i2].detection.box.topLeft.x, faces[_i2].detection.box.topLeft.y, faces[_i2].detection.box.topRight.x, faces[_i2].detection.box.topRight.y, faces[_i2].detection.box.bottomRight.x, faces[_i2].detection.box.bottomRight.y, faces[_i2].detection.box.bottomLeft.x, faces[_i2].detection.box.bottomLeft.y, faces[_i2].detection.imageDims.width, faces[_i2].detection.imageDims.height, _i2);

                      var radians = function radians(a12, a22, b1, b2) {
                        return Math.atan2(b2 - a22, b1 - a12) % Math.PI;
                      };

                      var degrees = function degrees(theta) {
                        return theta * 180 / Math.PI;
                      };

                      var angle = {
                        roll: void 0,
                        pitch: void 0,
                        yaw: void 0
                      };
                      if (!faces[_i2] || !faces[_i2].landmarks._positions || faces[_i2].landmarks._positions.length !== 68) return angle;
                      var pt = faces[_i2].landmarks._positions;
                      angle.roll = degrees(-radians(pt[36]._x, pt[36]._y, pt[45]._x, pt[45]._y));
                      angle.pitch = degrees(radians(0, Math.abs(pt[0]._x - pt[30]._x) / pt[30]._x, Math.PI, Math.abs(pt[16]._x - pt[30]._x) / pt[30]._x));
                      var bottom = pt.reduce(function (prev, cur) {
                        return prev < cur._y ? prev : cur._y;
                      }, Infinity);
                      var top = pt.reduce(function (prev, cur) {
                        return prev > cur._y ? prev : cur._y;
                      }, -Infinity);
                      angle.yaw = degrees(Math.PI * (faces[_i2].landmarks._imgDims._height / (top - bottom) / 1.4 - 1));
                      console.log(angle);
                    }
                  }

                  isStage = false;
                  formatMessage('Done');
                  return 'Done';
                }).catch(function (err) {
                  faces = [];
                  console.log(err);
                  formatMessage('Error!');
                  return 'Error!';
                });
              };
            });
            return translatePromise;
          } else if (args.FEED === '2') {
            return new Promise(function (formatMessage) {
              _this2.runtime.renderer.requestSnapshot(function (data) {
                var image = document.createElement('img');

                image.onload = function () {
                  faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
                    minConfidence: faceThreshold
                  })).withFaceLandmarks(false).withFaceDescriptors().withFaceExpressions().then(function (fullFaceDescriptions) {
                    faces = fullFaceDescriptions;
                    isStage = true;

                    if (drawOnStage) {
                      self._clearMark();

                      for (var _i3 = 0; _i3 < faces.length; _i3++) {
                        self._drawMark(faces[_i3].detection.box.topLeft.x, faces[_i3].detection.box.topLeft.y, faces[_i3].detection.box.topRight.x, faces[_i3].detection.box.topRight.y, faces[_i3].detection.box.bottomRight.x, faces[_i3].detection.box.bottomRight.y, faces[_i3].detection.box.bottomLeft.x, faces[_i3].detection.box.bottomLeft.y, faces[_i3].detection.imageDims.width, faces[_i3].detection.imageDims.height, _i3);
                      }
                    }

                    formatMessage('Done');
                    return 'Done';
                  });
                };

                image.setAttribute("src", data);
              });
            });
          }
        } else {
          this.runtime.emit('MODEL_LOADING');
          return new Promise(function (formatMessage) {
            Promise.all([faceapi.loadSsdMobilenetv1Model('static/models/faceDetection/ssdMobilenetv1ModelWeightsManifest.json'), faceapi.loadFaceLandmarkModel('static/models/faceDetection/faceLandmark68ModelWeightsManifest.json'), faceapi.loadFaceExpressionModel('static/models/faceDetection/faceExpressionModelWeightsManifest.json'), faceapi.loadFaceRecognitionModel('static/models/faceDetection/faceRecognitionModelWeightsManifest.json')]).then(function () {
              _this2.runtime.emit('MODEL_LOADING_FINISHED', true);

              _this2.modelLoaded = true;

              if (args.FEED === '1') {
                var canvas = document.createElement("canvas");
                canvas.width = 480;
                canvas.height = 360;
                var ctx = canvas.getContext("2d");

                var frame = _this2.runtime.ioDevices.video.getFrame({
                  format: Video.FORMAT_IMAGE_DATA,
                  dimensions: faceDetection.DIMENSIONS
                });

                if (frame === null) {
                  faces = [];
                  formatMessage('Camera not ready!');
                  return 'Camera not ready!';
                }

                ctx.putImageData(frame, 0, 0);
                var image = document.createElement('img');
                image.src = canvas.toDataURL("image/png");

                image.onload = function () {
                  faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
                    minConfidence: faceThreshold
                  })).withFaceLandmarks(false).withFaceDescriptors().withFaceExpressions().then(function (fullFaceDescriptions) {
                    faces = fullFaceDescriptions;
                    console.log(faces);
                    isStage = false;

                    if (drawOnStage) {
                      self._clearMark();

                      for (var _i4 = 0; _i4 < faces.length; _i4++) {
                        self._drawMark(faces[_i4].detection.box.topLeft.x, faces[_i4].detection.box.topLeft.y, faces[_i4].detection.box.topRight.x, faces[_i4].detection.box.topRight.y, faces[_i4].detection.box.bottomRight.x, faces[_i4].detection.box.bottomRight.y, faces[_i4].detection.box.bottomLeft.x, faces[_i4].detection.box.bottomLeft.y, faces[_i4].detection.imageDims.width, faces[_i4].detection.imageDims.height, _i4);
                      }
                    }

                    formatMessage('Done');
                    return 'Done';
                  }).catch(function (err) {
                    faces = [];
                    formatMessage('No faces detected');
                    return 'No faces detected';
                  });
                };
              } else if (args.FEED === '2') {
                _this2.runtime.renderer.requestSnapshot(function (data) {
                  var image = document.createElement('img');

                  image.onload = function () {
                    faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
                      minConfidence: faceThreshold
                    })).withFaceLandmarks(false).withFaceDescriptors().withFaceExpressions().then(function (fullFaceDescriptions) {
                      console.log(faces);
                      faces = fullFaceDescriptions;
                      isStage = true;

                      if (drawOnStage) {
                        self._clearMark();

                        for (var _i5 = 0; _i5 < faces.length; _i5++) {
                          self._drawMark(faces[_i5].detection.box.topLeft.x, faces[_i5].detection.box.topLeft.y, faces[_i5].detection.box.topRight.x, faces[_i5].detection.box.topRight.y, faces[_i5].detection.box.bottomRight.x, faces[_i5].detection.box.bottomRight.y, faces[_i5].detection.box.bottomLeft.x, faces[_i5].detection.box.bottomLeft.y, faces[_i5].detection.imageDims.width, faces[_i5].detection.imageDims.height, _i5);
                        }
                      }

                      formatMessage('Done');
                      return 'Done';
                    });
                  };

                  image.setAttribute("src", data);
                });
              }
            }).catch(function (err) {
              _this2.runtime.emit('MODEL_LOADING_FINISHED', false);

              formatMessage('NULL');
            });
          });
        }
      } else {
        console.log('Camera Not Ready!');
        return 'Camera Not Ready!';
      }
    }

    getNumberFaces(args, util) {
      return faces.length;
    }

    getOption(args, util) {
      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (faces[parseInt(args.FACE, 10) - 1]) {
        var expressionValue = 0;
        var expression;

        if (faces[parseInt(args.FACE, 10) - 1].expressions.angry > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.angry;
          expression = 'angry';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.disgusted > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.disgusted;
          expression = 'disgusted';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.fearful > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.fearful;
          expression = 'fear';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.happy > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.happy;
          expression = 'happy';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.neutral > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.neutral;
          expression = 'neutral';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.sad > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.sad;
          expression = 'sad';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.surprised > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.surprised;
          expression = 'surprised';
        }

        return expression;
      } else {
        return "NULL";
      }
    }

    isExpression(args, util) {
      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (faces[parseInt(args.FACE, 10) - 1]) {
        var expressionValue = 0;
        var expression;

        if (faces[parseInt(args.FACE, 10) - 1].expressions.angry > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.angry;
          expression = '1';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.disgusted > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.disgusted;
          expression = '2';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.fearful > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.fearful;
          expression = '3';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.happy > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.happy;
          expression = '4';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.neutral > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.neutral;
          expression = '5';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.sad > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.sad;
          expression = '6';
        }

        if (faces[parseInt(args.FACE, 10) - 1].expressions.surprised > expressionValue) {
          expressionValue = faces[parseInt(args.FACE, 10) - 1].expressions.surprised;
          expression = '7';
        }

        if (args.EXPRESSION === expression) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    boxPosition(args, util) {
      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (faces[parseInt(args.FACE, 10) - 1]) {
        if (args.POSITION === "1") {
          var XPos = 240 * (faces[parseInt(args.FACE, 10) - 1].detection.box.left + faces[parseInt(args.FACE, 10) - 1].detection.box.right) / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;
          XPos = XPos - 240;
          return XPos.toFixed(1);
        } else if (args.POSITION === "2") {
          var YPos = 180 * (faces[parseInt(args.FACE, 10) - 1].detection.box.top + faces[parseInt(args.FACE, 10) - 1].detection.box.bottom) / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;
          YPos = 180 - YPos;
          return YPos.toFixed(1);
        } else if (args.POSITION === "3") {
          var Width = 480 * faces[parseInt(args.FACE, 10) - 1].detection.box.width / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;
          return Width.toFixed(1);
        } else if (args.POSITION === "4") {
          var Height = 360 * faces[parseInt(args.FACE, 10) - 1].detection.box.height / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;
          return Height.toFixed(1);
        }
      } else {
        return "NULL";
      }
    }

    landmarks(args, util) {
      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (faces[parseInt(args.FACE, 10) - 1]) {
        if (args.POSITION === "1") {
          var XPos = 480 * faces[parseInt(args.FACE, 10) - 1].landmarks.positions[parseInt(args.LANDMARK, 10) - 1].x / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;
          XPos = XPos - 240;
          return XPos.toFixed(1);
        } else if (args.POSITION === "2") {
          var YPos = 360 * faces[parseInt(args.FACE, 10) - 1].landmarks.positions[parseInt(args.LANDMARK, 10) - 1].y / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;
          YPos = 180 - YPos;
          return YPos.toFixed(1);
        }
      } else {
        return "NULL";
      }
    }

    faceLandmarksF(args, util) {
      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (faces[parseInt(args.FACE, 10) - 1]) {
        if (args.LANDMARK === "1") {
          if (args.POSITION === "1") {
            var XPos = 480 * ((faces[parseInt(args.FACE, 10) - 1].landmarks.positions[36].x + faces[parseInt(args.FACE, 10) - 1].landmarks.positions[39].x) / 2) / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;
            XPos = XPos - 240;
            return XPos.toFixed(1);
          } else if (args.POSITION === "2") {
            var YPos = 360 * ((faces[parseInt(args.FACE, 10) - 1].landmarks.positions[36].y + faces[parseInt(args.FACE, 10) - 1].landmarks.positions[39].y) / 2) / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;
            YPos = 180 - YPos;
            return YPos.toFixed(1);
          }
        } else if (args.LANDMARK === "2") {
          if (args.POSITION === "1") {
            var _XPos = 480 * ((faces[parseInt(args.FACE, 10) - 1].landmarks.positions[42].x + faces[parseInt(args.FACE, 10) - 1].landmarks.positions[45].x) / 2) / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;

            _XPos = _XPos - 240;
            return _XPos.toFixed(1);
          } else if (args.POSITION === "2") {
            var _YPos = 360 * ((faces[parseInt(args.FACE, 10) - 1].landmarks.positions[42].y + faces[parseInt(args.FACE, 10) - 1].landmarks.positions[45].y) / 2) / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;

            _YPos = 180 - _YPos;
            return _YPos.toFixed(1);
          }
        } else if (args.LANDMARK === "3") {
          if (args.POSITION === "1") {
            var _XPos2 = 480 * ((faces[parseInt(args.FACE, 10) - 1].landmarks.positions[48].x + faces[parseInt(args.FACE, 10) - 1].landmarks.positions[54].x) / 2) / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;

            _XPos2 = _XPos2 - 240;
            return _XPos2.toFixed(1);
          } else if (args.POSITION === "2") {
            var _YPos2 = 360 * ((faces[parseInt(args.FACE, 10) - 1].landmarks.positions[48].y + faces[parseInt(args.FACE, 10) - 1].landmarks.positions[54].y) / 2) / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;

            _YPos2 = 180 - _YPos2;
            return _YPos2.toFixed(1);
          }
        } else {
          if (args.POSITION === "1") {
            var _XPos3 = 480 * faces[parseInt(args.FACE, 10) - 1].landmarks.positions[parseInt(args.LANDMARK, 10) - 1].x / faces[parseInt(args.FACE, 10) - 1].detection.imageWidth;

            _XPos3 = _XPos3 - 240;
            return _XPos3.toFixed(1);
          } else if (args.POSITION === "2") {
            var _YPos3 = 360 * faces[parseInt(args.FACE, 10) - 1].landmarks.positions[parseInt(args.LANDMARK, 10) - 1].y / faces[parseInt(args.FACE, 10) - 1].detection.imageHeight;

            _YPos3 = 180 - _YPos3;
            return _YPos3.toFixed(1);
          }
        }
      } else {
        return "NULL";
      }
    }
    saveImage(args, util) {
      var _this3 = this;

      var self = this; // if (!this.runtime.checkSessionExists(this.extensionName)) return;

      if (args.FEED === '1') {
        drawOnStage = true;
        var translatePromise = new Promise(function (formatMessage) {
          var canvas = document.createElement("canvas");
          canvas.width = 480;
          canvas.height = 360;
          var ctx = canvas.getContext("2d");

          var frame = _this3.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            dimensions: faceDetection.DIMENSIONS
          });

          if (frame === null) {
            faces = [];
            formatMessage('Camera not ready!');
            return 'Camera not ready!';
          }

          ctx.putImageData(frame, 0, 0);
          var image = document.createElement('img');
          image.src = canvas.toDataURL("image/png");

          image.onload = function () {
            faceapi.detectSingleFace(image, new faceapi.SsdMobilenetv1Options({
              minConfidence: faceThreshold
            })).withFaceLandmarks(false).withFaceDescriptor().then(function (fullFaceDescription) {
              if (fullFaceDescription) {
                faces = [fullFaceDescription];
                console.log(faces, drawOnStage, self.fullFaceDescriptions);
                self.fullFaceDescriptions[parseInt(args.FACE, 10) - 1].push(fullFaceDescription.descriptor);
                console.log("1");
                self.faceComparision[parseInt(args.FACE, 10) - 1] = new faceapi.LabeledFaceDescriptors(args.NAME, self.fullFaceDescriptions[parseInt(args.FACE, 10) - 1]);
                console.log("2"); // self.drawBoundingBox({OPTION: 1}, util);

                console.log("3");

                if (drawOnStage) {
                  self._clearMark();

                  for (var _i6 = 0; _i6 < faces.length; _i6++) {
                    self._drawMark(faces[_i6].detection.box.topLeft.x, faces[_i6].detection.box.topLeft.y, faces[_i6].detection.box.topRight.x, faces[_i6].detection.box.topRight.y, faces[_i6].detection.box.bottomRight.x, faces[_i6].detection.box.bottomRight.y, faces[_i6].detection.box.bottomLeft.x, faces[_i6].detection.box.bottomLeft.y, faces[_i6].detection.imageDims.width, faces[_i6].detection.imageDims.height, _i6);
                  }
                }

                formatMessage('Done');
                return 'Done';
              } else {
                formatMessage('No face detected');
                return 'No face detected';
              }
            }).catch(function (err) {
              if (err.message == "Cannot read property 'length' of undefined") {
                formatMessage('No face detected');
                return 'No face detected';
              } else {
                formatMessage(err.message);
                return err.message;
              }
            });
          };
        });
        return translatePromise;
      } else if (args.FEED === '2') {
        return new Promise(function (formatMessage) {
          _this3.runtime.renderer.requestSnapshot(function (data) {
            var image = document.createElement('img');

            image.onload = function () {
              faceapi.detectSingleFace(image, new faceapi.SsdMobilenetv1Options({
                minConfidence: faceThreshold
              })).withFaceLandmarks(false).withFaceDescriptor().then(function (fullFaceDescription) {
                if (fullFaceDescription) {
                  faces = [fullFaceDescription];
                  console.log(faces, drawOnStage, self.fullFaceDescriptions);
                  self.fullFaceDescriptions[parseInt(args.FACE, 10) - 1].push(fullFaceDescription.descriptor);
                  console.log("1");
                  self.faceComparision[parseInt(args.FACE, 10) - 1] = new faceapi.LabeledFaceDescriptors(args.NAME, self.fullFaceDescriptions[parseInt(args.FACE, 10) - 1]);
                  console.log("2"); // self.drawBoundingBox({OPTION: 1}, util);

                  console.log("3");

                  self._clearMark();

                  for (var _i7 = 0; _i7 < faces.length; _i7++) {
                    self._drawMark(faces[_i7].detection.box.topLeft.x, faces[_i7].detection.box.topLeft.y, faces[_i7].detection.box.topRight.x, faces[_i7].detection.box.topRight.y, faces[_i7].detection.box.bottomRight.x, faces[_i7].detection.box.bottomRight.y, faces[_i7].detection.box.bottomLeft.x, faces[_i7].detection.box.bottomLeft.y, faces[_i7].detection.imageDims.width, faces[_i7].detection.imageDims.height, _i7);
                  }

                  formatMessage('Done');
                  return 'Done';
                } else {
                  faces = [];
                  formatMessage('No face detected');
                  return 'No face detected';
                }
              });
            };

            image.setAttribute("src", data);
          });
        });
      }
    }

    doFaceMatching(args, util) {
      var _this4 = this;

      var self = this;

      if (args.FEED === '1') {
        var translatePromise = new Promise(function (formatMessage) {
          var canvas = document.createElement("canvas");
          canvas.width = 480;
          canvas.height = 360;
          var ctx = canvas.getContext("2d");

          var frame = _this4.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            dimensions: faceDetection.DIMENSIONS
          });

          if (frame === null) {
            faces = [];
            formatMessage('Camera not ready!');
            return 'Camera not ready!';
          }

          ctx.putImageData(frame, 0, 0);
          var image = document.createElement('img');
          image.src = canvas.toDataURL("image/png");

          image.onload = function () {
            faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
              minConfidence: faceThreshold
            })).withFaceLandmarks(false).withFaceDescriptors().then(function (fullFaceDescriptions) {
              if (fullFaceDescriptions.length) {
                isStage = false;
                var faceMatcher = new faceapi.FaceMatcher(self.faceComparision);
                faces = fullFaceDescriptions;
                var _i8 = 0;
                fullFaceDescriptions.forEach(function (fd) {
                  var bestMatch = faceMatcher.findBestMatch(fd.descriptor);
                  faces[_i8].label = bestMatch.label;
                  faces[_i8].distance = bestMatch.distance;
                  _i8 = _i8 + 1;
                });

                if (drawOnStage) {
                  self._clearMark();

                  for (var _i9 = 0; _i9 < faces.length; _i9++) {
                    self._drawMark(faces[_i9].detection.box.topLeft.x, faces[_i9].detection.box.topLeft.y, faces[_i9].detection.box.topRight.x, faces[_i9].detection.box.topRight.y, faces[_i9].detection.box.bottomRight.x, faces[_i9].detection.box.bottomRight.y, faces[_i9].detection.box.bottomLeft.x, faces[_i9].detection.box.bottomLeft.y, faces[_i9].detection.imageDims.width, faces[_i9].detection.imageDims.height, _i9);
                  }
                }

                formatMessage('Done');
                return 'Done';
              } else {
                faces = [];
                formatMessage('No face detected');
                return 'No face detected';
              }
            }).catch(function (err) {
              console.log(err);

              if (err.message === "Cannot read property 'length' of undefined") {
                faces = [];
                formatMessage('No face detected');
                return 'No face detected';
              } else if (err.message == "FaceRecognizer.constructor - expected atleast one input") {
                formatMessage('Train Model before testing');
                return 'Train Model before testing';
              } else {
                faces = [];
                formatMessage(err.message);
                return err.message;
              }
            });
          };
        });
        return translatePromise;
      } else if (args.FEED === '2') {
        return new Promise(function (formatMessage) {
          _this4.runtime.renderer.requestSnapshot(function (data) {
            var image = document.createElement('img');

            image.onload = function () {
              faceapi.detectAllFaces(image, new faceapi.SsdMobilenetv1Options({
                minConfidence: faceThreshold
              })).withFaceLandmarks(false).withFaceDescriptors().withFaceExpressions().then(function (fullFaceDescriptions) {
                if (fullFaceDescriptions.length) {
                  isStage = true;
                  var faceMatcher = new faceapi.FaceMatcher(self.faceComparision);
                  faces = fullFaceDescriptions;
                  var _i10 = 0;
                  fullFaceDescriptions.forEach(function (fd) {
                    var bestMatch = faceMatcher.findBestMatch(fd.descriptor);
                    faces[_i10].label = bestMatch.label;
                    faces[_i10].distance = bestMatch.distance;
                    _i10 = _i10 + 1;
                  });

                  if (drawOnStage) {
                    self._clearMark();

                    for (var _i11 = 0; _i11 < faces.length; _i11++) {
                      self._drawMark(faces[_i11].detection.box.topLeft.x, faces[_i11].detection.box.topLeft.y, faces[_i11].detection.box.topRight.x, faces[_i11].detection.box.topRight.y, faces[_i11].detection.box.bottomRight.x, faces[_i11].detection.box.bottomRight.y, faces[_i11].detection.box.bottomLeft.x, faces[_i11].detection.box.bottomLeft.y, faces[_i11].detection.imageDims.width, faces[_i11].detection.imageDims.height, _i11);
                    }
                  }

                  formatMessage('Done');
                  return 'Done';
                } else {
                  faces = [];
                  formatMessage('No Face Detected');
                  return 'No Face Detected';
                }
              });
            };

            image.setAttribute("src", data);
          });
        });
      }
    }

    deleteImage(args, util) {
      this.faceComparision = [];
      this.fullFaceDescriptions = [];

      for (var _i12 = 0; _i12 < 10; _i12++) {
        this.fullFaceDescriptions.push([]);
      }

      faces = [];
    }

    isClassDetected(args, util) {
      var _this5 = this;

      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (this.faceComparision[parseInt(args.FACE, 10) - 1]) {
        var idClass = 0;
        var _i13 = 0;
        faces.forEach(function (face) {
          _i13 = _i13 + 1;

          if (face.label === _this5.faceComparision[parseInt(args.FACE, 10) - 1].label) {
            idClass = _i13;
          }
        });

        if (idClass === 0) {
          return false;
        }

        return true;
      }

      return false;
    }
    getFace(args, util) {
      // if (!this.runtime.checkSessionExists(this.extensionName)) return;
      if (faces[parseInt(args.FACE, 10) - 1]) {
        return faces[parseInt(args.FACE, 10) - 1].label;
      }

      return 'unknown';
    }

    drawBoundingBox(args, util) {
      var self = this;

      if (args.OPTION === "1") {
        drawOnStage = true;

        this._clearMark();

        for (var _i14 = 0; _i14 < faces.length; _i14++) {
          self._drawMark(faces[_i14].detection.box.topLeft.x, faces[_i14].detection.box.topLeft.y, faces[_i14].detection.box.topRight.x, faces[_i14].detection.box.topRight.y, faces[_i14].detection.box.bottomRight.x, faces[_i14].detection.box.bottomRight.y, faces[_i14].detection.box.bottomLeft.x, faces[_i14].detection.box.bottomLeft.y, faces[_i14].detection.imageDims.width, faces[_i14].detection.imageDims.height, _i14);
        }
      } else {
        drawOnStage = false;

        this._clearMark();
      }
    }

    toJSON() {
      var json = [];
      var faceKeys = Object.keys(this.faceComparision);

      for (var faceIndex = 0; faceIndex < faceKeys.length; faceIndex++) {
        if (typeof this.faceComparision[faceKeys[faceIndex]].toJSON === 'function') json[faceKeys[faceIndex]] = this.faceComparision[faceKeys[faceIndex]].toJSON();
      }

      return json;
    }

    setThreshold(args, util) {
      faceThreshold = parseFloat(args.THRESHOLD);
    }


  static get DIMENSIONS() {
    return [480, 360];  
  }
  async faceDetectionInit () {

    await faceapi.nets.tinyFaceDetector.loadFromUri('./static/models/faceDetection'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('./static/models/faceDetection'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('./static/models/faceDetection'),
    await faceapi.nets.faceExpressionNet.loadFromUri('./static/models/faceDetection'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/static/models/faceDetection'),
    console.log(faceapi.nets)

    //array to accommodate the facial deta (max 100)

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
 module.exports = faceDetection;
