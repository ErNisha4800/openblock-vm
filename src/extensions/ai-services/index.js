require('babel-polyfill');
/**
* @license
../../../extension-support/argument-type  ../../../extension-support/block-type  format-message  face-api.js  ../../../engine/runtime  ../../../io/video  ../../../engine/stage-layering */
'use strict';


var ArgumentType = require("openblock-vm/src/extension-support/argument-type.js");
 var BlockType = require("openblock-vm/src/extension-support/block-type.js");
 var formatMessage  = require("format-message/index.js");
 
 var Runtime = require('openblock-vm/src/engine/runtime');
 var blockIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMzQiIGRhdGEtbmFtZT0iTGF5ZXIgMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGRlZnM+PHN0eWxlPi5jbHMtMSwuY2xzLTEwLC5jbHMtNywuY2xzLTgsLmNscy05e2ZpbGw6bm9uZTt9LmNscy0ye2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtM3tvcGFjaXR5OjAuNTt9LmNscy00e2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aC0yKTt9LmNscy01e29wYWNpdHk6MC4wOTt9LmNscy02e2ZpbGw6I2YzZTAyYzt9LmNscy0xMCwuY2xzLTcsLmNscy04LC5jbHMtOXtzdHJva2U6I2M1NDM0MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9LmNscy03e3N0cm9rZS13aWR0aDoxLjA2cHg7fS5jbHMtOHtzdHJva2Utd2lkdGg6MC44NnB4O30uY2xzLTl7c3Ryb2tlLXdpZHRoOjAuOTRweDt9LmNscy0xMHtzdHJva2Utd2lkdGg6MC45OHB4O308L3N0eWxlPjxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj48cmVjdCBpZD0iX1JlY3RhbmdsZV8iIGRhdGEtbmFtZT0iJmx0O1JlY3RhbmdsZSZndDsiIGNsYXNzPSJjbHMtMSIgeD0iLTI5NS42OSIgeT0iLTM5NC4zMSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzNzIiLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoLTIiPjxyZWN0IGlkPSJfUmVjdGFuZ2xlXzIiIGRhdGEtbmFtZT0iJmx0O1JlY3RhbmdsZSZndDsiIGNsYXNzPSJjbHMtMSIgeD0iNDYuODEiIHk9Ii0yNDEuMDUiIHdpZHRoPSIyNjMuMzMiIGhlaWdodD0iMjE4Ii8+PC9jbGlwUGF0aD48L2RlZnM+PHRpdGxlPkljb25fQUktMDI8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtNiIgZD0iTTkuNTcsMTQuNDNMNiwyMS4yNGExLjE4LDEuMTgsMCwwLDAsMSwxLjczbDEuMzgsMC4wOWExLjE4LDEuMTgsMCwwLDEsMS4xMSwxLjE5bDAsNS44OGExLjE4LDEuMTgsMCwwLDAsMS4xMiwxLjE5bDQuNjksMC4yNmExLjE4LDEuMTgsMCwwLDEsMS4xMiwxLjE4djQuNDdhMS4xOCwxLjE4LDAsMCwwLDEuMTgsMS4xOGg5Ljg3YTEuMTgsMS4xOCwwLDAsMCwxLjE4LTEuMjlMMjguMDcsMzEuOHMtMC41NC0yLjQ5LDEuMTktNi4yM2MyLTQuNDEsMy40Ni01LjUsNC05LjQzYTEzLjUxLDEzLjUxLDAsMCwwLS44MS02LjgzQTEyLjgsMTIuOCwwLDAsMCwyOS41OCw1YTExLjQ3LDExLjQ3LDAsMCwwLTUuMzYtMy4xNCwxMS4zMiwxMS4zMiwwLDAsMC03LjUzLjg3LDEyLjM5LDEyLjM5LDAsMCwwLTQuOTMsMy45LDExLjgyLDExLjgyLDAsMCwwLTIsNC4yNCw5LjQ4LDkuNDgsMCwwLDAtLjA5LDIuODNBMS4yLDEuMiwwLDAsMSw5LjU3LDE0LjQzWiIvPjxjaXJjbGUgY2xhc3M9ImNscy03IiBjeD0iMTUuOTkiIGN5PSIxMS44OSIgcj0iMi43MSIvPjxjaXJjbGUgY2xhc3M9ImNscy04IiBjeD0iMjYuNDciIGN5PSI3LjAzIiByPSIxLjUiLz48Y2lyY2xlIGNsYXNzPSJjbHMtOSIgY3g9IjIxLjg3IiBjeT0iMjEuMjciIHI9IjEuNTEiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMTAiIGN4PSIxNi41MyIgY3k9IjI2LjQ5IiByPSIxLjg3Ii8+PGxpbmUgY2xhc3M9ImNscy03IiB4MT0iMjEuODciIHkxPSIyMi43OCIgeDI9IjIxLjg3IiB5Mj0iMzguNDEiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik0xOSwxMS44OWgxLjY4YTEuMTgsMS4xOCwwLDAsMSwxLjE4LDEuMThWMTkuNiIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTI2LjQ3LDguNTNWMTVhMS4xOCwxLjE4LDAsMCwxLTEuMTgsMS4xOEgyMi4zNCIvPjxsaW5lIGNsYXNzPSJjbHMtNyIgeDE9IjkuNTIiIHkxPSIyNi40OSIgeDI9IjE0LjY2IiB5Mj0iMjYuNDkiLz48L3N2Zz4='; // eslint-disable-next-line max-len

var menuIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMzQiIGRhdGEtbmFtZT0iTGF5ZXIgMzQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGRlZnM+PHN0eWxlPi5jbHMtMSwuY2xzLTEwLC5jbHMtNywuY2xzLTgsLmNscy05e2ZpbGw6bm9uZTt9LmNscy0ye2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aCk7fS5jbHMtM3tvcGFjaXR5OjAuNTt9LmNscy00e2NsaXAtcGF0aDp1cmwoI2NsaXAtcGF0aC0yKTt9LmNscy01e29wYWNpdHk6MC4wOTt9LmNscy02e2ZpbGw6I2YzZTAyYzt9LmNscy0xMCwuY2xzLTcsLmNscy04LC5jbHMtOXtzdHJva2U6I2M1NDM0MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9LmNscy03e3N0cm9rZS13aWR0aDoxLjA2cHg7fS5jbHMtOHtzdHJva2Utd2lkdGg6MC44NnB4O30uY2xzLTl7c3Ryb2tlLXdpZHRoOjAuOTRweDt9LmNscy0xMHtzdHJva2Utd2lkdGg6MC45OHB4O308L3N0eWxlPjxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoIj48cmVjdCBpZD0iX1JlY3RhbmdsZV8iIGRhdGEtbmFtZT0iJmx0O1JlY3RhbmdsZSZndDsiIGNsYXNzPSJjbHMtMSIgeD0iLTI5NS42OSIgeT0iLTM5NC4zMSIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIzNzIiLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iY2xpcC1wYXRoLTIiPjxyZWN0IGlkPSJfUmVjdGFuZ2xlXzIiIGRhdGEtbmFtZT0iJmx0O1JlY3RhbmdsZSZndDsiIGNsYXNzPSJjbHMtMSIgeD0iNDYuODEiIHk9Ii0yNDEuMDUiIHdpZHRoPSIyNjMuMzMiIGhlaWdodD0iMjE4Ii8+PC9jbGlwUGF0aD48L2RlZnM+PHRpdGxlPkljb25fQUktMDI8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtNiIgZD0iTTkuNTcsMTQuNDNMNiwyMS4yNGExLjE4LDEuMTgsMCwwLDAsMSwxLjczbDEuMzgsMC4wOWExLjE4LDEuMTgsMCwwLDEsMS4xMSwxLjE5bDAsNS44OGExLjE4LDEuMTgsMCwwLDAsMS4xMiwxLjE5bDQuNjksMC4yNmExLjE4LDEuMTgsMCwwLDEsMS4xMiwxLjE4djQuNDdhMS4xOCwxLjE4LDAsMCwwLDEuMTgsMS4xOGg5Ljg3YTEuMTgsMS4xOCwwLDAsMCwxLjE4LTEuMjlMMjguMDcsMzEuOHMtMC41NC0yLjQ5LDEuMTktNi4yM2MyLTQuNDEsMy40Ni01LjUsNC05LjQzYTEzLjUxLDEzLjUxLDAsMCwwLS44MS02LjgzQTEyLjgsMTIuOCwwLDAsMCwyOS41OCw1YTExLjQ3LDExLjQ3LDAsMCwwLTUuMzYtMy4xNCwxMS4zMiwxMS4zMiwwLDAsMC03LjUzLjg3LDEyLjM5LDEyLjM5LDAsMCwwLTQuOTMsMy45LDExLjgyLDExLjgyLDAsMCwwLTIsNC4yNCw5LjQ4LDkuNDgsMCwwLDAtLjA5LDIuODNBMS4yLDEuMiwwLDAsMSw5LjU3LDE0LjQzWiIvPjxjaXJjbGUgY2xhc3M9ImNscy03IiBjeD0iMTUuOTkiIGN5PSIxMS44OSIgcj0iMi43MSIvPjxjaXJjbGUgY2xhc3M9ImNscy04IiBjeD0iMjYuNDciIGN5PSI3LjAzIiByPSIxLjUiLz48Y2lyY2xlIGNsYXNzPSJjbHMtOSIgY3g9IjIxLjg3IiBjeT0iMjEuMjciIHI9IjEuNTEiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMTAiIGN4PSIxNi41MyIgY3k9IjI2LjQ5IiByPSIxLjg3Ii8+PGxpbmUgY2xhc3M9ImNscy03IiB4MT0iMjEuODciIHkxPSIyMi43OCIgeDI9IjIxLjg3IiB5Mj0iMzguNDEiLz48cGF0aCBjbGFzcz0iY2xzLTciIGQ9Ik0xOSwxMS44OWgxLjY4YTEuMTgsMS4xOCwwLDAsMSwxLjE4LDEuMThWMTkuNiIvPjxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTI2LjQ3LDguNTNWMTVhMS4xOCwxLjE4LDAsMCwxLTEuMTgsMS4xOEgyMi4zNCIvPjxsaW5lIGNsYXNzPSJjbHMtNyIgeDE9IjkuNTIiIHkxPSIyNi40OSIgeDI9IjE0LjY2IiB5Mj0iMjYuNDkiLz48L3N2Zz4=';
var axios = require("axios/index.js"); // const AI_SERVER_ENDPOINT = "https://us-central1-pictobloxdev.cloudfunctions.net/aiServer";

var AI_SERVER_ENDPOINT = "https://asia-east2-pictobloxdev.cloudfunctions.net/aiServerAsiaEast2";
var SPEECH_END_POINT = AI_SERVER_ENDPOINT + "/speech-analyze";
var VISION_END_POINT = AI_SERVER_ENDPOINT + "/vision-analyze";
var VISION_URL_END_POINT = AI_SERVER_ENDPOINT + "/vision-url-analyze";
var TEXT_RECOGNITION_ANALYZE = AI_SERVER_ENDPOINT + "/text-recognition-analyze";
var OCR_ANALYZE = AI_SERVER_ENDPOINT + "/ocr-analyze";
var FACE_ANALYZE = AI_SERVER_ENDPOINT + "/face-analyze";
var CHECK_HANDWRITTEN_TEXT = AI_SERVER_ENDPOINT + '/check-handwritten-text-status';
var loudness = 33;
/**
 * Class for the AI related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

function _base64ToArrayBuffer(base64) {
  var block = base64.split(";");
  var contentType = block[0].split(":")[1];
  var b64Data = block[1].split(",")[1];
  var binary_string = window.atob(b64Data);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  } //  bytes = bytes.filter(function(val) {
  //     return val !== 0;
  // });
  // console.log(`in _base64ToArrayBuffer`)
  //  console.log(bytes)


  return bytes;
}

const Message = {
  toggleStageVideoFeed: {
    'en': 'turn [VIDEO_STATE] video on stage with [TRANSPARENCY] % transparency',
    'hi': '[VIDEO_STATE] वीडियो को [TRANSPARENCY] % पारदर्शिता के साथ मंच पर चालू करें',
    'gu': '[TRANSPARENCY] % પારદર્શિતા સાથે સ્ટેજ પર [VIDEO_STATE] વિડિઓ ચાલુ કરો'
  },
  speech2Text: {
    'en': 'recognize speech for [TIME] s in [LANGUAGE]',
    'hi': '[LANGUAGE] में [TIME] सेकंड के लिए भाषण पहचानें',
    'gu': '[LANGUAGE] માં [TIME] માટે ભાષણ ઓળખો'
  },
  expectedLoudness: {
    'en': 'set noise removal threshold to [LOUDNESS] %]',
    'hi': 'शोर हटाने की सीमा को [LOUDNESS] % पर सेट करें',
    'gu': 'અવાજ દૂર કરવાની થ્રેશોલ્ડને [LOUDNESS] % પર સેટ કરો'
  },
  analyseImageContentFromCamera: {
    'en': 'recognize [OPTION] in image after [TIME] seconds',
    'hi': '[TIME] सेकंड के बाद छवि में [OPTION] को पहचानें',
    'gu': '[TIME] સેકન્ડ પછી છબીમાં [OPTION] ઓળખો'
  },
  analyseImageContentFromApplication: {
    'en': 'recognize [OPTION] in image from [IMAGE]',
    'hi': '[IMAGE] से छवि में [OPTION] को पहचानें',
    'gu': '[IMAGE] માંથી ઇમેજમાં [OPTION] ઓળખો'
  },
  analyseImageContentFromURL: {
    'en': 'recognize [OPTION] in image from URL [IMAGE]',
    'hi': 'URL [IMAGE] से छवि में [OPTION] को पहचानें',
    'gu': 'URL [IMAGE] માંથી ઇમેજમાં [OPTION] ઓળખો'
  },
  speechResult: {
    'en': 'speech recognition result',
    'hi': 'वाक् पहचान परिणाम',
    'gu': 'વાણી ઓળખ પરિણામ'
  },
  imageFeatureCount: {
    'en': 'recognized [OPTION] count',
    'hi': 'मान्यता प्राप्त [OPTION] गिनती',
    'gu': 'માન્ય [OPTION] ગણતરી'
  },
  imageResultFirst: {
    'en': 'recognized [OPTION] [INDEX] name',
    'hi': 'मान्यता प्राप्त [OPTION] [INDEX] नाम',
    'gu': 'ઓળખાયેલ [OPTION] [INDEX] નામ'
  },
  imageResultFirstInfo: {
    'en': 'recognized [OPTION] [INDEX] [INFO]',
    'hi': 'मान्यता प्राप्त [OPTION] [INDEX] [INFO]',
    'gu': 'માન્ય [OPTION] [INDEX] [INFO]'
  },
  imageResultSecond: {
    'en': '[OPTION] recognition result',
    'hi': '[OPTION] मान्यता परिणाम',
    'gu': '[OPTION] માન્યતા પરિણામ'
  },
  handwrittenTextResult: {
    'en': 'handwritten text result',
    'hi': 'हस्तलिखित पाठ परिणाम',
    'gu': 'હસ્તલિખિત ટેક્સ્ટ પરિણામ'
  },
  printedTextRecognize: {
    'en': 'printed text result',
    'hi': 'मुद्रित पाठ परिणाम',
    'gu': 'મુદ્રિત ટેક્સ્ટ પરિણામ'
  },
  faceCount: {
    'en': 'recognized face count',
    'hi': 'पहचाने गए चेहरे की गिनती',
    'gu': 'ઓળખાયેલ ચહેરાની સંખ્યા'
  },
  faceFeaturesResult: {
    'en': 'recognized [OPTION] of face [INDEX]t',
    'hi': 'चेहरे की पहचान [OPTION] [INDEX]',
    'gu': 'ચહેરા [INDEX] ની ઓળખ [OPTION]'
  },
  emotionIs: {
    'en': 'emotion [EMOTION] for face [INDEX]?',
    'hi': 'भावना [EMOTION] चेहरे के लिए [INDEX]?',
    'gu': 'ચહેરા [INDEX] માટે લાગણી [EMOTION]?'
  },
  headPosition: {
    'en': 'head gesture [GESTURE] angle for face [INDEX]',
    'hi': 'सिर का इशारा [GESTURE] चेहरे के लिए कोण [INDEX]',
    'gu': 'ચહેરા માટે માથાનો હાવભાવ [GESTURE] કોણ [INDEX]'
  },
  headLocation: {
    'en': 'recognized [OPTION] for face [INDEX]',
    'hi': 'चेहरे के लिए पहचाना गया [OPTION] [INDEX]',
    'gu': 'ચહેરા [INDEX] માટે માન્ય [OPTION]'
  },
  headLocation: {
    'en': 'recognized [OPTION] for face [INDEX]',
    'hi': 'चेहरे के लिए पहचाना गया [OPTION] [INDEX]',
    'gu': 'ચહેરા [INDEX] માટે માન્ય [OPTION]'
},
image_features:{
  'en': 'image features',
  'hi': 'छवि विशेषताएं',
  'gu': 'છબી વિશેષતાઓ'
},
face_details:{
  'en': 'face details',
  'hi': 'चेहरे की विवरण',
  'gu': 'ચહેરાની વિગતો'
},
handwritten_text:{
  'en': 'handwritten text',
  'hi': 'हस्तलिखित पाठ',
  'gu': 'હસ્તલિખિત લખાણ'
},
printed_text:{
  'en': 'printed text',
  'hi': 'मुद्रित पाठ',
  'gu': 'છાપેલ ટેક્સ્ટ '
},
celebrity:{
  'en': 'celebrity',
  'hi': 'सेलिब्रिटी',
  'gu': 'સ્ટાર'
},
brand:{
  'en': 'brand',
  'hi': 'ब्रांड',
  'gu': 'બ્રાન્ડ'
},
object:{
  'en': 'object',
  'hi': 'वस्तु',
  'gu': 'પદાર્થ'
},
image_tag:{
  'en': 'image tag',
  'hi': 'छवि टैग',
  'gu': 'છબી ટેગ'
},
stage:{
  'en':'stage',
  'gu':'સ્ટેજ',
  'hi':'मंच'
},
costume:{
  'en':'costume',
  'hi':'पोशाक',
  'gu':'પોશાક'
},
backdrop:{
  'en':'backdrop',
  'hi':'पृष्ठभूमि',
  'gu':'પૃષ્ઠભૂમિ'
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
 confidence:{
   'en':'confidence',
   'gu':'વિશ્વાસ',
   'hi':'विश्वास'
 },
 landmark:{
  'en':'landmark',
  'gu':'સીમાચિહ્ન',
  'hi':'सीमा चिन्ह'
 },
 image_description:{
  'en':'image description',
  'gu':'છબી વર્ણન',
  'hi':'छवि वर्णन'
 },
 age:{
  'en':'age',
  'gu':'ઉંમર',
  'hi':'उम्र'
 },
 gender:{
  'en':'gender',
  'gu':'જાતિ',
  'hi':'जाति'
 },
 emotions:{
  'en':'emotions',
  'gu':'લાગણીઓ',
  'hi':'भावनाएँ'
},
 hapiness:{
  'en':'hapiness',
  'gu':'ખુશી',
  'hi':'ખુશી'
 },
 anger:{
  'en':'anger',
  'gu':'ગુસ્સો',
  'hi':'क्रोध'
 },
 contempt:{
  'en':'contempt',
  'gu':'નિંદા',
  'hi':'निंदा'
 },
 disgust:{
  'en':'disgust',
  'gu':'નફરત',
  'hi':'नफरत'
 },
 fear:{
  'en':'fear',
  'gu':'ભય',
  'fear':'डर'
 },
 sadness:{
  'en':'sadness',
  'gu':'દુઃખ',
  'hi':'दुःख'
 },
 neutral:{
  'en':'neutral',
  'gu':'કુદરતી',
  'hi':'प्राकृतिक'
 },
 surprise:{
  'en':'surprise',
  'gu':'આશ્ચર્ય',
  'hi':'आश्चर्य'
 },
 roll:{
  'en':'roll',
  'gu':'રોલ',
  'hi':'रोल'
 },
 pitch:{
  'en':'pitch',
  'gu':'પિચ',
  'hi':'पिच'
 },
 yaw:{
  'en':'yaw',
  'gu':'યો',
  'hi':'यो'
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
}
}

const AvailableLocales = ['en', 'hi', 'gu'];

class AIServicesBlocks{
    constructor(runtime){
        /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;
    this.locale = this.setLocale();
    //this.runtime.checkInternetConnection();
    /**
     * Last recognized speech
     * @type {String}
     * @private
     */

    this._currentRecognizedSpeech = '';
    /**
     * Last Image analyse result
     * @type {String}
     * @private
     */

    this.imageAnalyseResult = '';
    this.printedTextResult = '';
    this.faceAnalyseResult = '';
    this.handwrittenTextRecognized = [];
    this.extensionName = 'Artificial Intelligence';
    }

    getInfo() {
      this.locale = this.setLocale();
        return {
          id: 'aiServices',
          name: formatMessage({
            id: 'aiServices.categoryName',
            default: this.extensionName,
            description: 'AI Services using Google Cloud Platform'
          }),
          blockIconURI: blockIconURI,
          menuIconURI: menuIconURI,
          colour: '#c64342',
          colourSecondary: '#b63535',
          colourTertiary: '#a42b2b',
          blocks: [{
            message: formatMessage({
              id: 'posenet.blockSeparatorMessage1',
              default: 'Settings',
              description: 'Settings'
            })
          }, {
            opcode: 'toggleStageVideoFeed',
            text: Message.toggleStageVideoFeed[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              VIDEO_STATE: {
                type: ArgumentType.STRING,
                menu: 'videoState',
                defaultValue: 'on'
              },
              TRANSPARENCY: {
                type: ArgumentType.NUMBER,
                default: 1
              }
            }
          }, {
            message: 'Recognition'
          }, {
            opcode: 'speech2Text',
            text: Message.speech2Text[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              TIME: {
                type: ArgumentType.NUMBER,
                menu: 'countDown',
                defaultValue: 2
              },
              LANGUAGE: {
                type: ArgumentType.STRING,
                menu: 'languages',
                defaultValue: 'en-US'
              }
            }
          }, {
            opcode: 'expectedLoudness',
            text: Message.expectedLoudness[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              LOUDNESS: {
                type: ArgumentType.STRING,
                defaultValue: '30'
              }
            }
          }, "---", {
            opcode: 'analyseImageContentFromCamera',
            text: Message.analyseImageContentFromCamera[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'recognizeOptionsMenu',
                defaultValue: 'imageFeatures'
              },
              TIME: {
                type: ArgumentType.NUMBER,
                menu: 'countDown',
                defaultValue: '2'
              }
            }
          }, {
            opcode: 'analyseImageContentFromApplication',
            text: Message.analyseImageContentFromApplication[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'recognizeOptionsMenu',
                defaultValue: 'imageFeatures'
              },
              IMAGE: {
                type: ArgumentType.STRING,
                menu: 'pictoOptions',
                defaultValue: 'stage'
              }
            }
          }, {
            opcode: 'analyseImageContentFromURL',
            text: Message.analyseImageContentFromURL[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'recognizeOptionsMenu',
                defaultValue: 'imageFeatures'
              },
              URL: {
                type: ArgumentType.STRING,
                defaultValue: ' '
              }
            }
          }, {
            message: 'Speech Recognition'
          }, {
            opcode: 'speechResult',
            text: Message.speechResult[this.locale],
            blockType: BlockType.REPORTER
          }, {
            message: 'Image Features'
          }, {
            opcode: 'imageFeatureCount',
            text: Message.imageFeatureCount[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OPTION: {
                type: ArgumentType.NUMBER,
                menu: 'imageFeatureFirst',
                defaultValue: 'objects'
              }
            }
          }, {
            opcode: 'imageResultFirst',
            text: Message.imageResultFirst[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'imageFeatureFirst',
                defaultValue: 'objects'
              },
              INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          }, {
            opcode: 'imageResultFirstInfo',
            text: Message.imageResultFirstInfo[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'imageFeatureFirstAnother',
                defaultValue: 'objects'
              },
              INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              },
              INFO: {
                type: ArgumentType.STRING,
                menu: 'imageFeatureFirstInfo',
                defaultValue: 'xPos'
              }
            }
          }, {
            opcode: 'imageResultSecond',
            text: Message.imageResultSecond[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'imageFeatureSecond',
                defaultValue: 'landmark'
              }
            }
          }, {
            message: formatMessage({
              id: 'aiServices.blockSeparatorMessage4',
              default: 'OCR Recognition',
              description: 'Blocks separator message'
            })
          }, {
            opcode: 'handwrittenTextResult',
            text: Message.handwrittenTextResult[this.locale],
            blockType: BlockType.REPORTER
          }, {
            opcode: 'printedTextRecognize',
            text: Message.printedTextRecognize[this.locale],
            blockType: BlockType.REPORTER
          }, {
            message: 'Face Features'
          }, {
            opcode: 'faceCount',
            text: Message.faceCount[this.locale],
            blockType: BlockType.REPORTER
          }, {
            opcode: 'faceFeaturesResult',
            text: Message.faceFeaturesResult[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'ageGenderOption',
                defaultValue: 'age'
              },
              INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          }, {
            opcode: 'emotionIs',
            text: Message.emotionIs[this.locale] ,
            blockType: BlockType.BOOLEAN,
            arguments: {
              EMOTION: {
                type: ArgumentType.STRING,
                menu: 'emotions',
                defaultValue: 'happiness'
              },
              INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: '1'
              }
            }
          }, {
            opcode: 'headPosition',
            text: Message.headPosition[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              GESTURE: {
                type: ArgumentType.STRING,
                menu: 'headPosition',
                defaultValue: 'roll'
              },
              INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: '1'
              }
            }
          }, {
            opcode: 'headLocation',
            text: Message.headLocation[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'headLocationInfo',
                defaultValue: 'xPos'
              },
              INDEX: {
                type: ArgumentType.NUMBER,
                defaultValue: '1'
              }
            }
          }],
          menus: {
            countDown: {
              acceptReporters: true,
              items: ['2', '5', '10', '15', '30']
            },
            pictoOptions: [{
              text: Message.stage[this.locale],
              value: 'stage'
            }, {
              text: Message.costume[this.locale],
              value: 'costume'
            }, {
              text: Message.backdrop[this.locale],
              value: 'backdrop'
            }],
            recognizeOptionsMenu: [{
              text: Message.image_features[this.locale],
              value: 'imageFeatures'
            }, {
              text: Message.face_details[this.locale],
              value: 'faceDetails'
            }, {
              text: Message.handwritten_text[this.locale],
              value: 'handWrittenText'
            }, {
              text: Message.printed_text[this.locale],
              value: 'printedText'
            }],
            imageFeatureFirst: [{
              text: Message.celebrity[this.locale],
              value: 'celebrity'
            }, {
              text: Message.brand[this.locale],
              value: 'brand'
            }, {
              text: Message.object[this.locale],
              value: 'objects'
            }, {
              text: Message.image_tag[this.locale],
              value: 'imageRecognition'
            }],
            imageFeatureFirstAnother: [{
              text: Message.celebrity[this.locale],
              value: 'celebrity'
            }, {
              text: Message.brand[this.locale],
              value: 'brand'
            }, {
              text: Message.object[this.locale],
              value: 'objects'
            }],
            imageFeatureFirstInfo: [{
              text: Message.x_position[this.locale],
              value: 'xPos'
            }, {
              text: Message.Y_position[this.locale],
              value: 'yPos'
            }, {
              text: Message.width[this.locale],
              value: 'width'
            }, {
              text: Message.height[this.locale],
              value: 'height'
            }, {
              text: Message.confidence[this.locale],
              value: 'confidence'
            }],
            imageFeatureSecond: [{
              text: Message.landmark[this.locale],
              value: 'landmark'
            }, {
              text: Message.image_description[this.locale],
              value: 'imageDescription'
            }],
            ageGenderOption: [{
              text: Message.age[this.locale],
              value: 'age'
            }, {
              text: Message.gender[this.locale],
              value: 'gender'
            }, {
              text: Message.emotions[this.locale],
              value: 'emotion'
            }],
            emotions: [{
              text: Message.hapiness[this.locale],
              value: 'happiness'
            }, {
              text: Message.anger[this.locale],
              value: 'anger'
            }, {
              text: Message.contempt[this.locale],
              value: 'contempt'
            }, {
              text: Message.disgust[this.locale],
              value: 'disgust'
            }, {
              text: Message.fear[this.locale],
              value: 'fear'
            }, {
              text: Message.neutral[this.locale],
              value: 'neutral'
            }, {
              text: Message.sadness[this.locale],
              value: 'sadness'
            }, {
              text: Message.surprise[this.locale],
              value: 'surprise'
            }],
            headPosition: [{
              text: Message.roll[this.locale],
              value: 'roll'
            }, {
              text: Message.yaw[this.locale],
              value: 'yaw'
            }, {
              text: Message.pitch[this.locale],
              value: 'pitch'
            }],
            headLocationInfo: [{
              text: Message.x_position[this.locale],
              value: 'xPos'
            }, {
              text: Message.Y_position[this.locale],
              value: 'yPos'
            }, {
              text: Message.width[this.locale],
              value: 'width'
            }, {
              text: Message.height[this.locale],
              value: 'height'
            }],
            videoState: [{
              text: Message.off[this.locale],
              value: 'off'
            }, {
              text: Message.on[this.locale],
              value: 'on'
            }, {
              text: Message.on_flipp[this.locale],
              value: 'onFlipped'
            }],
            languages: [{
              text: 'Arabic',
              value: 'ar-AE'
            }, {
              text: 'Catalan',
              value: 'ca-ES	'
            }, {
              text: 'Danish',
              value: 'da-DK'
            }, {
              text: 'German',
              value: 'da-de'
            }, {
              text: 'English (United Kingdom)',
              value: 'en-GB'
            }, {
              text: 'English (United States)',
              value: 'en-US'
            }, {
              text: 'Spanish',
              value: 'es-ES'
            }, {
              text: 'Finnish',
              value: 'fi-FI'
            }, {
              text: 'French',
              value: 'fr-FR'
            }, {
              text: 'Gujarati',
              value: 'gu-IN'
            }, {
              text: 'Hindi',
              value: 'hi-IN'
            }, {
              text: 'Italian',
              value: 'it-IT'
            }, {
              text: 'Japanese',
              value: 'ja-JP'
            }, {
              text: 'Korean',
              value: 'ko-KR'
            }, {
              text: 'Marathi',
              value: 'mr-IN	'
            }, {
              text: 'Norwegian',
              value: 'nb-NO'
            }, {
              text: 'Dutch',
              value: 'nl-NL'
            }, {
              text: 'Polish',
              value: 'pl-PL'
            }, {
              text: 'Portuguese',
              value: 'pt-PT'
            }, {
              text: 'Russian',
              value: 'ru-RU'
            }, {
              text: 'Swedish',
              value: 'sv-SE'
            }, {
              text: 'Tamil',
              value: 'ta-IN'
            }, {
              text: 'Telugu',
              value: 'te-IN'
            }, {
              text: 'Thai',
              value: 'th-TH'
            }, {
              text: 'Turkish',
              value: 'tr-TR'
            }, {
              text: 'Chinese (Mandarin)',
              value: 'zh-CN'
            }, {
              text: 'Chinese (Traditional)',
              value: 'zh-HK'
            }]
          }
        };
      }

      scale(number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
      }
      silence_remove(byteArrays, greater_128_average, lessor_128_average) {
        var consider_array = [];
        var final_byteArrays = [byteArrays[0]];
        var continue_silence = 2; // for (let temp_index = 0; temp_index < 10; temp_index++) {       // take first 10 samples 
        //     final_byteArrays.push(byteArrays[temp_index])
        // }
  
        for (var temp_index = 0; temp_index < byteArrays.length; temp_index++) {
          // Create array which check the threshold
          if (greater_128_average[temp_index] < 255 - loudness & lessor_128_average[temp_index] > loudness) {
            consider_array.push(1);
          } else {
            consider_array.push(0);
          }
        } // console.log(`consider_array size`)
        // console.log(consider_array.reduce((a, b) => a + b, 0))
  
  
        var index = 1;
        var check_count = 0;
  
        while (index < byteArrays.length) {
          // Loop for all the sample 
          if (consider_array[index] == 0) {
            check_count = 1;
  
            for (var check_index = 1; check_index < continue_silence & index + check_index < byteArrays.length; check_index++) {
              if (consider_array[index + check_index] == 0) {
                // if there are 10 consicutive 0s then consider first 2 and last 2
                check_count += 1;
              }
            }
  
            if (check_count == continue_silence) {// final_byteArrays.push(byteArrays[index])
              // final_byteArrays.push(byteArrays[index + 1])
              // final_byteArrays.push(byteArrays[index + continue_silence - 1])
              // final_byteArrays.push(byteArrays[index + continue_silence - 2])
            } else {
              // otherwise consider all of them
              for (var _check_index = 0; _check_index < continue_silence & index + _check_index < byteArrays.length; _check_index++) {
                final_byteArrays.push(byteArrays[index + _check_index]);
              } // final_byteArrays.push(byteArrays.slice(index, index + 10));
  
            }
  
            index += continue_silence;
          } else {
            // if there is audio consider it
            final_byteArrays.push(byteArrays[index]);
            index += 1;
          } // console.log(index)
  
        } // index = byteArrays.indexOf(final_byteArrays[final_byteArrays.length-1]) + 1     // find last considered sample index
        // for (let check_index = index; check_index < byteArrays.length; check_index++) {
        //     final_byteArrays.push(byteArrays[check_index])                  // add last 10 samples
        // }
        // console.log(`final_byteArrays`)
        // console.log(final_byteArrays)
  
  
        return final_byteArrays;
      }
      b64toBlob(rawData, sliceSize) {
        var block = rawData.split(";");
        var contentType = block[0].split(":")[1];
        var b64Data = block[1].split(",")[1];
        contentType = contentType || '';
        sliceSize = sliceSize || 1024; // let audio_ctx = new (window.AudioContext || window.webkitAudioContext)();
        // // const audio_ctx = new AudioContext();
        // const analyser = audio_ctx.createAnalyser();
        // analyser.fftSize = 32;
        // const audio_el = new Audio();
        // audio_el.src = audio_data;
        // const node = audio_ctx.createMediaElementSource(audio_el);
        // node.connect(audio_ctx.destination);
        // node.connect(analyser);
        // let audio_ctx = new (window.AudioContext || window.webkitAudioContext)();
        // // const audio_ctx = new AudioContext();
        // const analyser = audio_ctx.createAnalyser();
        // analyser.fftSize = 32;
        // const audio_el = new Audio();
        // audio_el.src = audio_data;
        // const node = audio_ctx.createMediaElementSource(audio_el);
        // node.connect(audio_ctx.destination);
        // node.connect(analyser);
  
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        var greater_128_average = [];
        var lessor_128_average = [];
  
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
          var byteNumbers = new Array(slice.length);
          var greater_128 = [];
          var lessor_128 = [];
  
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
  
            if (byteNumbers[i] < 128) {
              lessor_128.push(byteNumbers[i]);
            } else {
              greater_128.push(byteNumbers[i]);
            }
          }
  
          var byteArray = new Uint8Array(byteNumbers);
          greater_128_average.push(greater_128.reduce(function (a, b) {
            return a + b;
          }, 0) / greater_128.length);
          lessor_128_average.push(lessor_128.reduce(function (a, b) {
            return a + b;
          }, 0) / lessor_128.length); // console.log("Average G: ", greater_128.reduce((a, b) => a + b, 0) / greater_128.length, "\t Average L: ", lessor_128.reduce((a, b) => a + b, 0) / lessor_128.length) // average
          // console.log("Maximum: ", byteArray.reduce(function (a, b) { return Math.max(a, b); })) // maximum
          // analyser.getByteTimeDomainData(byteArray);
          // if (byteArray.some(v => v)) {
          //     byteArrays.push(byteArray);
          // }
  
          byteArrays.push(byteArray);
        } // console.log(`in b64toBlob before silence`)
        // console.log(byteArrays)
        // console.log(`capable for silence check: ${byteArrays != ''} , ${byteArrays.length}`)
  
  
        if (byteArrays != '' & byteArrays.length >= 50) {
          byteArrays = this.silence_remove(byteArrays, greater_128_average, lessor_128_average);
        }
  
        var blob = new Blob(byteArrays, {
          type: contentType
        });
        var reader = new FileReader();
        reader.readAsDataURL(blob);
  
        reader.onloadend = function () {
          var base64data = reader.result; // console.log(`blob to base64`)
          // console.log(base64data);
        };
  
        return blob;
      }
      makeHttpRequest(url, body, params, api_key) {
        var contentType = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'application/octet-stream';
        return axios({
          method: 'post',
          url: url,
          params: params,
          headers: {
            'ocp-apim-subscription-key': api_key,
            'content-type': contentType
          },
          data: body
        }).then(function (resp) {
          return resp;
        });
      }

      handleHttpError() {
        this.runtime.emit('REQUEST_TIMED_OUT');
      }
      checkHandwrittenTextStatus(url) {
        return axios({
          method: 'post',
          url: CHECK_HANDWRITTEN_TEXT,
          headers: {
            'content-type': 'application/json'
          },
          data: {
            url: url
          }
        }).then(function (resp) {
          return resp;
        });
      }
      toggleStageVideoFeed(args, util) {
        var state = args.VIDEO_STATE;
        this.globalVideoState = args.VIDEO_STATE;
        this.runtime.ioDevices.video.setPreviewGhost(args.TRANSPARENCY);
  
        if (state === 'off') {
          this.runtime.ioDevices.video.disableVideo();
        } else {
          this.runtime.ioDevices.video.enableVideo(); // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
  
          this.runtime.ioDevices.video.mirror = state === 'on';
        }
      }

      storeImageSize(base64) {
        var self = this;
        var img = new Image();
  
        img.onload = function () {
          self.faceImageSize = {
            width: img.width,
            height: img.height
          };
        };
  
        img.src = base64;
      }
      expectedLoudness(args, util) {
        loudness = parseInt(this.scale(args.LOUDNESS, 0, 100, 10, 55));
      }
      /**
       * Convert the Speech into text.
       * @param  {object} args Block arguments
       * @param {object} util Utility object provided by the runtime.
       * @return {Promise} A promise that resolves after playing the sound
       */
       speech2Text(args, util) {
        var _this = this;
  
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
        util.runtime.emit('CAPTURE_AUDIO', args.TIME > 0 ? args.TIME < 60 ? args.TIME : 60 : 0);
        return new Promise(function (resolve) {
          setTimeout(function () {
            if (util.runtime.aiBlockDataFromGUI !== null) {
              var params = {
                language: args.LANGUAGE
              };
  
              _this.runtime.doAIServerCall({
                url: SPEECH_END_POINT,
                data: _this.b64toBlob(util.runtime.aiBlockDataFromGUI),
                params: params,
                contentType: "application/octet-stream"
              }).then(function (resp) {
                _this._currentRecognizedSpeech = resp.data.DisplayText;
              }).catch(function (err) {
                console.log(err.response);
                _this._currentRecognizedSpeech = "NULL";
  
                _this.handleHttpError();
              }).finally(function () {
                util.runtime.aiBlockDataFromGUI = null;
                resolve();
              });
            } else {
              resolve();
            }
          }, args.TIME * 1000 + 500);
        }).catch(function (err) {});
      }
      /**
       * Last recognized speech result.
       * @param  {object} args Block arguments
       * @param {object} util Utility object provided by the runtime.
       * @return {Promise} A promise that resolves after playing the sound
       */
       speechResult(args, util) {
        return this._currentRecognizedSpeech ? this._currentRecognizedSpeech : 'NULL';
      } //Image Analysis Blocks

      analyseImageContentFromCamera(args, util) {
        var _this2 = this;
  
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
  
        switch (args.OPTION) {
          case 'imageFeatures':
            util.runtime.emit('CAPTURE_IMAGE', args.TIME);
            return new Promise(function (resolve) {
              setTimeout(function () {
                if (util.runtime.aiBlockDataFromGUI !== null) {
                  var img = _this2.b64toBlob(util.runtime.aiBlockDataFromGUI);
  
                  var params = {
                    visualFeatures: ['Brands', 'Description', 'Objects'] + '',
                    details: ['Celebrities', 'Landmarks'] + ''
                  };
  
                  _this2.runtime.doAIServerCall({
                    url: VISION_END_POINT,
                    data: img,
                    params: params,
                    contentType: "application/octet-stream"
                  }).then(function (resp) {
                    _this2.imageAnalyseResult = resp.data;
                  }).catch(function (err) {
                    _this2.handleHttpError();
                  }).finally(function () {
                    util.runtime.aiBlockDataFromGUI = null;
                    resolve();
                  });
                } else {
                  resolve();
                }
              }, args.TIME * 1000 + 500);
            });
            break;
  
          case 'handWrittenText':
            util.runtime.emit('CAPTURE_IMAGE', args.TIME);
            return new Promise(function (resolve) {
              setTimeout(function () {
                if (util.runtime.aiBlockDataFromGUI !== null) {
                  _this2.handwrittenTextRecognized = [];
  
                  var img = _this2.b64toBlob(util.runtime.aiBlockDataFromGUI);
  
                  var params = {
                    mode: "Handwritten"
                  };
  
                  _this2.runtime.doAIServerCall({
                    url: TEXT_RECOGNITION_ANALYZE,
                    data: img,
                    params: params,
                    contentType: "application/octet-stream"
                  }).then(function (resp) {
                    var stopInterval = false;
                    var timer = setInterval(function () {
                      _this2.handwrittenTextRecognized = [];
  
                      _this2.checkHandwrittenTextStatus(resp.data).then(function (response) {
                        if (response.data != "") {
                          var temp = [];
                          clearInterval(timer);
  
                          for (line in response.data.lines) {
                            temp.push(response.data.lines[line].text);
                          }
  
                          _this2.handwrittenTextRecognized = temp;
                        }
                      }).catch(function (e) {}).finally(function () {
                        util.runtime.aiBlockDataFromGUI = null;
                        resolve();
                      });
                    }, 1000);
                  }).catch(function (err) {
                    _this2.handleHttpError();
  
                    resolve();
                  });
                } else {
                  resolve();
                }
              }, args.TIME * 1000 + 500);
            });
            break;
  
          case 'printedText':
            util.runtime.emit('CAPTURE_IMAGE', args.TIME);
            return new Promise(function (resolve) {
              setTimeout(function () {
                if (util.runtime.aiBlockDataFromGUI !== null) {
                  var img = _this2.b64toBlob(util.runtime.aiBlockDataFromGUI);
  
                  var params = {};
  
                  _this2.runtime.doAIServerCall({
                    url: OCR_ANALYZE,
                    data: img,
                    params: params,
                    contentType: "application/octet-stream"
                  }).then(function (resp) {
                    _this2.printedTextResult = resp.data;
                  }).catch(function (err) {
                    _this2.handleHttpError();
                  }).finally(function () {
                    util.runtime.aiBlockDataFromGUI = null;
                    resolve();
                  });
                } else {
                  resolve();
                }
              }, args.TIME * 1000 + 500);
            });
            break;
  
          case 'faceDetails':
            util.runtime.emit('CAPTURE_IMAGE', args.TIME);
            return new Promise(function (resolve) {
              setTimeout(function () {
                if (util.runtime.aiBlockDataFromGUI !== null) {
                  var img = _this2.b64toBlob(util.runtime.aiBlockDataFromGUI);
  
                  _this2.storeImageSize(util.runtime.aiBlockDataFromGUI);
  
                  var params = {
                    recognitionModel: 'recognition_02',
                    returnFaceId: false,
                    returnFaceLandmarks: false,
                    returnRecognitionModel: false,
                    returnFaceAttributes: ['age', 'gender', 'headPose', 'smile', 'emotion'] + ''
                  };
  
                  _this2.runtime.doAIServerCall({
                    url: FACE_ANALYZE,
                    data: img,
                    params: params,
                    contentType: "application/octet-stream"
                  }).then(function (resp) {
                    _this2.faceAnalyseResult = resp.data;
                  }).catch(function (err) {
                    _this2.handleHttpError();
                  }).finally(function () {
                    util.runtime.aiBlockDataFromGUI = null;
                    resolve();
                  });
                } else {
                  resolve();
                }
              }, args.TIME * 1000 + 500);
            });
            break;
  
          default:
            break;
        }
      }

      analyseImageContentFromURL(args, util) {
        var _this3 = this;
  
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
        if (args.URL === "") return;
  
        switch (args.OPTION) {
          case 'imageFeatures':
            return new Promise(function (resolve) {
              var params = {
                visualFeatures: ['Brands', 'Description', 'Objects'] + '',
                details: ['Celebrities', 'Landmarks'] + ''
              };
  
              _this3.runtime.doAIServerCall({
                url: VISION_END_POINT,
                data: {
                  "url": args.URL
                },
                params: params,
                contentType: "application/json"
              }).then(function (resp) {
                _this3.imageAnalyseResult = resp.data;
              }).catch(function (err) {
                _this3.handleHttpError();
              }).finally(function () {
                resolve();
              });
            });
            break;
  
          case 'handWrittenText':
            return new Promise(function (resolve) {
              _this3.handwrittenTextRecognized = [];
              var params = {
                mode: "Handwritten"
              };
  
              _this3.runtime.doAIServerCall({
                url: TEXT_RECOGNITION_ANALYZE,
                data: {
                  "url": args.URL
                },
                params: params,
                contentType: "application/json"
              }).then(function (resp) {
                var stopInterval = false;
                var timer = setInterval(function () {
                  _this3.handwrittenTextRecognized = [];
  
                  _this3.checkHandwrittenTextStatus(resp.data).then(function (response) {
                    if (response.data != "") {
                      var temp = [];
                      clearInterval(timer);
  
                      for (line in response.data.lines) {
                        temp.push(response.data.lines[line].text);
                      }
  
                      _this3.handwrittenTextRecognized = temp;
                    }
                  }).catch(function (e) {}).finally(function () {
                    util.runtime.aiBlockDataFromGUI = null;
                    resolve();
                  });
  
                  ;
  
                  if (stopInterval) {
                    clearInterval(timer);
                  }
                }, 1000);
              }).catch(function (err) {
                _this3.handleHttpError();
  
                resolve();
              }).finally(function () {});
            });
            break;
  
          case 'printedText':
            return new Promise(function (resolve) {
              var params = {};
  
              _this3.runtime.doAIServerCall({
                url: OCR_ANALYZE,
                data: {
                  "url": args.URL
                },
                params: params,
                contentType: "application/json"
              }).then(function (resp) {
                _this3.printedTextResult = resp.data;
              }).catch(function (err) {
                _this3.handleHttpError();
              }).finally(function () {
                resolve();
              });
            });
            break;
  
          case 'faceDetails':
            return new Promise(function (resolve) {
              var params = {
                recognitionModel: 'recognition_02',
                returnFaceId: false,
                returnFaceLandmarks: false,
                returnRecognitionModel: false,
                returnFaceAttributes: ['age', 'gender', 'headPose', 'smile', 'emotion'] + ''
              };
  
              _this3.runtime.doAIServerCall({
                url: FACE_ANALYZE,
                data: {
                  "url": args.URL
                },
                params: params,
                contentType: "application/json"
              }).then(function (resp) {
                _this3.faceAnalyseResult = resp.data;
              }).catch(function (err) {
                _this3.handleHttpError();
              }).finally(function () {
                resolve();
              });
            });
            break;
  
          default:
            break;
        }
      }

      makeImageRequestForApplication(args, util, img, resolve) {
        var _this4 = this;
  
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
        var url = null;
        var params = null;
        var imgBlob = null;
  
        switch (args.OPTION) {
          case 'imageFeatures':
            imgBlob = this.b64toBlob(img);
            params = {
              visualFeatures: ['Brands', 'Description', 'Objects'] + '',
              details: ['Celebrities', 'Landmarks'] + ''
            };
            this.runtime.doAIServerCall({
              url: VISION_END_POINT,
              data: imgBlob,
              params: params,
              contentType: "application/octet-stream"
            }).then(function (resp) {
              _this4.imageAnalyseResult = resp.data;
            }).catch(function (err) {
              _this4.handleHttpError();
            }).finally(function () {
              resolve();
            });
            break;
  
          case 'handWrittenText':
            this.handwrittenTextRecognized = [];
            imgBlob = this.b64toBlob(img);
            params = {
              mode: "Handwritten"
            };
            this.runtime.doAIServerCall({
              url: TEXT_RECOGNITION_ANALYZE,
              data: imgBlob,
              params: params,
              contentType: "application/octet-stream"
            }).then(function (resp) {
              var stopInterval = false;
              var timer = setInterval(function () {
                _this4.handwrittenTextRecognized = [];
  
                _this4.checkHandwrittenTextStatus(resp.data).then(function (response) {
                  if (response.data != "") {
                    var temp = [];
                    clearInterval(timer);
  
                    for (line in response.data.lines) {
                      temp.push(response.data.lines[line].text);
                    }
  
                    _this4.handwrittenTextRecognized = temp;
                  }
                }).catch(function (e) {}).finally(function () {
                  util.runtime.aiBlockDataFromGUI = null;
                  resolve();
                });
  
                ;
  
                if (stopInterval) {
                  clearInterval(timer);
                }
              }, 1000);
            }).catch(function (err) {
              resolve();
  
              _this4.handleHttpError();
            }).finally(function () {});
            break;
  
          case 'printedText':
            imgBlob = this.b64toBlob(img);
            this.runtime.doAIServerCall({
              url: OCR_ANALYZE,
              data: imgBlob,
              params: params,
              contentType: "application/octet-stream"
            }).then(function (resp) {
              _this4.printedTextResult = resp.data;
            }).catch(function (err) {
              _this4.handleHttpError();
            }).finally(function () {
              util.runtime.aiBlockDataFromGUI = null;
              resolve();
            });
            break;
  
          case 'faceDetails':
            this.storeImageSize(img);
            imgBlob = this.b64toBlob(img);
            params = {
              recognitionModel: 'recognition_02',
              returnFaceId: false,
              returnFaceLandmarks: false,
              returnRecognitionModel: false,
              returnFaceAttributes: ['age', 'gender', 'headPose', 'smile', 'emotion'] + ''
            };
            this.runtime.doAIServerCall({
              url: FACE_ANALYZE,
              data: imgBlob,
              params: params,
              contentType: "application/octet-stream"
            }).then(function (resp) {
              _this4.faceAnalyseResult = resp.data;
            }).catch(function (err) {
              _this4.handleHttpError();
            }).finally(function () {
              util.runtime.aiBlockDataFromGUI = null;
              resolve();
            });
            break;
  
          default:
            break;
        }
      }
      svgString2Image(svgString, format, callback) {
        format = format ? format : 'png';
        var canvas = document.createElement('canvas');
        var image = new Image();
  
        image.onload = function () {
          canvas.width = image.width > 50 ? image.width : 50;
          canvas.height = image.height > 50 ? image.height : 50;
          var context = canvas.getContext('2d');
          context.drawImage(image, 0, 0, image.width > 50 ? image.width : 50, image.height > 50 ? image.height : 50);
          var pngData = canvas.toDataURL('image/' + format);
          callback(pngData);
        };
  
        image.src = svgString;
      }
      analyseImageContentFromApplication(args, util) {
        var _this5 = this;
  
        return new Promise(function (resolve) {
          var img = '';
          var costume = '';
          var data = '';
  
          switch (args.IMAGE) {
            case 'stage':
              _this5.runtime.renderer.requestSnapshot(function (data) {
                _this5.makeImageRequestForApplication(args, util, data, resolve);
              });
  
              break;
  
            case 'costume':
              costume = util.target.getCurrentCostume();
              data = costume.asset.data.reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
              }, '');
              img = 'data:' + costume.asset.assetType.contentType + ';base64,' + btoa(data);
  
              if (costume.asset.assetType.contentType === "image/png") {
                _this5.makeImageRequestForApplication(args, util, img, resolve);
              } else {
                _this5.svgString2Image(img, 'png', function (img) {
                  _this5.makeImageRequestForApplication(args, util, img, resolve);
                });
              }
  
              break;
  
            case 'backdrop':
              costume = util.runtime.getTargetForStage().getCurrentCostume();
              data = costume.asset.data.reduce(function (data, byte) {
                return data + String.fromCharCode(byte);
              }, '');
              img = 'data:' + costume.asset.assetType.contentType + ';base64,' + btoa(data);
  
              if (costume.asset.assetType.contentType === "image/png") {
                _this5.makeImageRequestForApplication(args, util, img, resolve);
              } else {
                _this5.svgString2Image(img, 'png', function (img) {
                  //if backdrop is plain 50*50 image (which what comes by default if no backdrop is added)
                  if (img == 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAkElEQVRoQ+2SwQkAMAyEkv2X7g6CUIL9nxDtzpG3R+6YDvmtZEUqIhnoa0liMbYiWJ00rIgkFmMrgtVJw4pIYjG2IlidNKyIJBZjK4LVScOKSGIxtiJYnTSsiCQWYyuC1UnDikhiMbYiWJ00rIgkFmMrgtVJw4pIYjG2IlidNKyIJBZjK4LVScOKSGIx9kyRBxCRADOd5J92AAAAAElFTkSuQmCC') resolve();
  
                  _this5.makeImageRequestForApplication(args, util, img, resolve);
                });
              }
  
              break;
  
            default:
              break;
          }
        });
      } //Image Content Result Block
      imageFeatureCount(args, util) {
        var count = 0;
  
        switch (args.OPTION) {
          case 'brand':
            try {
              count = this.imageAnalyseResult.brands.length;
              break;
            } catch (e) {
              return 0;
            }
  
          case 'celebrity':
            try {
              var celebArray = {};
  
              for (category in this.imageAnalyseResult.categories) {
                if (this.imageAnalyseResult.categories[category].detail && this.imageAnalyseResult.categories[category].detail.celebrities) {
                  for (celeb in this.imageAnalyseResult.categories[category].detail.celebrities) {
                    celebArray[this.imageAnalyseResult.categories[category].detail.celebrities[celeb].name] = this.imageAnalyseResult.categories[category].detail.celebrities[celeb];
                  }
                }
              }
  
              count = Object.keys(celebArray).length;
              break;
            } catch (e) {
              return 0;
            }
  
          case 'objects':
            try {
              count = this.imageAnalyseResult.objects.length;
              break;
            } catch (e) {
              return 0;
            }
  
          case 'imageRecognition':
            try {
              return this.imageAnalyseResult.categories.length;
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          default:
            break;
        }
  
        return count;
      }
      imageResultFirst(args, util) {
        switch (args.OPTION) {
          case 'celebrity':
            try {
              var celebArray = {};
  
              for (category in this.imageAnalyseResult.categories) {
                if (this.imageAnalyseResult.categories[category].detail && this.imageAnalyseResult.categories[category].detail.celebrities) {
                  for (celeb in this.imageAnalyseResult.categories[category].detail.celebrities) {
                    celebArray[this.imageAnalyseResult.categories[category].detail.celebrities[celeb].name] = this.imageAnalyseResult.categories[category].detail.celebrities[celeb];
                  }
                }
              }
  
              var celebData = [];
  
              for (celeb in celebArray) {
                celebData.push(celeb);
              }
  
              return args.INDEX <= celebData.length && args.INDEX > 0 ? celebData[args.INDEX - 1] : 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'brand':
            try {
              return args.INDEX <= this.imageAnalyseResult.brands.length && args.INDEX > 0 ? this.imageAnalyseResult.brands[args.INDEX - 1].name : 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'objects':
            var dataBuffer = [];
  
            try {
              for (object in this.imageAnalyseResult.objects) {
                dataBuffer.push(this.imageAnalyseResult.objects[object].object);
              }
  
              return args.INDEX <= dataBuffer.length && args.INDEX > 0 ? dataBuffer[args.INDEX - 1] : 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'imageRecognition':
            try {
              return args.INDEX <= this.imageAnalyseResult.categories.length && args.INDEX > 0 ? this.imageAnalyseResult.categories[args.INDEX - 1].name : 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          default:
            break;
        }
  
        return result === '' ? 'NULL' : result;
      }
      imageResultFirstInfo(args, util) {
        var dataObject = [];
  
        switch (args.OPTION) {
          case 'celebrity':
            try {
              var celebArray = {};
  
              for (category in this.imageAnalyseResult.categories) {
                if (this.imageAnalyseResult.categories[category].detail && this.imageAnalyseResult.categories[category].detail.celebrities) {
                  for (celeb in this.imageAnalyseResult.categories[category].detail.celebrities) {
                    celebArray[this.imageAnalyseResult.categories[category].detail.celebrities[celeb].name] = this.imageAnalyseResult.categories[category].detail.celebrities[celeb];
                  }
                }
              }
  
              for (celeb in celebArray) {
                dataObject.push(celebArray[celeb]);
              }
  
              if (!(args.INDEX <= dataObject.length && args.INDEX > 0)) return 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'brand':
            try {
              dataObject = this.imageAnalyseResult.brands;
              if (!(args.INDEX <= dataObject.length && args.INDEX > 0)) return 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'objects':
            try {
              for (object in this.imageAnalyseResult.objects) {
                dataObject.push(this.imageAnalyseResult.objects[object]);
              }
  
              if (!(args.INDEX <= dataObject.length && args.INDEX > 0)) return 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          default:
            break;
        }
  
        var target = dataObject[args.INDEX - 1];
  
        var _ref = target.rectangle ? {
          position: target.rectangle,
          terms: {
            height: 'h',
            width: 'w',
            left: 'x',
            top: 'y'
          }
        } : {
          position: target.faceRectangle,
          terms: {
            height: 'height',
            width: 'width',
            left: 'left',
            top: 'top'
          }
        },
            position = _ref.position,
            terms = _ref.terms;
  
        switch (args.INFO) {
          case 'xPos':
            return (position[terms.left] + position[terms.width] / 2) * 480 / this.imageAnalyseResult.metadata.width - 240;
            break;
  
          case 'yPos':
            return 180 - (position[terms.top] + position[terms.height] / 2) * 360 / this.imageAnalyseResult.metadata.height;
            break;
  
          case 'width':
            return position[terms.width] * 480 / this.imageAnalyseResult.metadata.width;
            break;
  
          case 'height':
            return position[terms.height] * 360 / this.imageAnalyseResult.metadata.height;
            break;
  
          case 'confidence':
            return target.confidence;
            break;
  
          default:
            break;
        }
      }
      imageResultSecond(args, util) {
        switch (args.OPTION) {
          case 'landmark':
            try {
              var _result = null;
              var landmarkConfidence = 0;
  
              for (category in this.imageAnalyseResult.categories) {
                if (this.imageAnalyseResult.categories[category].detail && this.imageAnalyseResult.categories[category].detail.landmarks) {
                  for (landmark in this.imageAnalyseResult.categories[category].detail.landmarks) {
                    if (this.imageAnalyseResult.categories[category].detail.landmarks[landmark].confidence > landmarkConfidence) {
                      _result = this.imageAnalyseResult.categories[category].detail.landmarks[landmark].name;
                      landmarkConfidence = this.imageAnalyseResult.categories[category].detail.landmarks[landmark].confidence;
                    }
                  }
                }
              }
  
              return _result ? _result : 'NULL';
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'imageDescription':
            try {
              return this.imageAnalyseResult.description.captions[0].text;
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          default:
            break;
        }
      } //OCR Result Blocks

      handwrittenTextResult(args, util) {
        var result = this.handwrittenTextRecognized.join(' ');
        return result === '' ? 'NULL' : result;
      }
      printedTextRecognize(args, util) {
        var text = [];
  
        for (region in this.printedTextResult.regions) {
          for (line in this.printedTextResult.regions[region].lines) {
            for (word in this.printedTextResult.regions[region].lines[line].words) {
              text.push(this.printedTextResult.regions[region].lines[line].words[word]['text']);
            }
          }
        }
  
        return text.join('') === '' ? 'NULL' : text.join(' ');
      } //Face Features blocks
      faceCount(args, util) {
        try {
          return this.faceAnalyseResult.length;
        } catch (e) {
          return 'NULL';
        }
      }
      faceFeaturesResult(args, util) {
        if (!(args.INDEX <= this.faceAnalyseResult.length && args.INDEX > 0)) return 'NULL';
        var result = '';
  
        switch (args.OPTION) {
          case 'age':
            try {
              result = this.faceAnalyseResult[args.INDEX - 1].faceAttributes.age;
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'gender':
            try {
              result = this.faceAnalyseResult[args.INDEX - 1].faceAttributes.gender;
            } catch (e) {
              return 'NULL';
            }
  
            break;
  
          case 'emotion':
            try {
              var emotions = this.faceAnalyseResult[args.INDEX - 1].faceAttributes.emotion;
              return Object.keys(emotions).reduce(function (a, b) {
                return emotions[a] > emotions[b] ? a : b;
              });
            } catch (e) {
              return 'NULL';
            }
  
          default:
            break;
        }
  
        return result === '' ? 'NULL' : result;
      }
      emotionIs(args, util) {
        if (!(args.INDEX <= this.faceAnalyseResult.length && args.INDEX > 0)) return 'NULL';
  
        try {
          var emotions = this.faceAnalyseResult[args.INDEX - 1].faceAttributes.emotion;
          return Object.keys(emotions).reduce(function (a, b) {
            return emotions[a] > emotions[b] ? a : b;
          }) === args.EMOTION;
        } catch (e) {
          return false;
        }
      }
      headPosition(args, util) {
        if (!(args.INDEX <= this.faceAnalyseResult.length && args.INDEX > 0)) return 'NULL';
  
        try {
          return this.faceAnalyseResult[args.INDEX - 1].faceAttributes.headPose[args.GESTURE];
        } catch (e) {
          return 'NULL';
        }
      }
      headLocation(args, util) {
        if (!(args.INDEX <= this.faceAnalyseResult.length && args.INDEX > 0)) return 'NULL';
  
        try {
          switch (args.OPTION) {
            case 'xPos':
              return (this.faceAnalyseResult[args.INDEX - 1].faceRectangle.left + this.faceAnalyseResult[args.INDEX - 1].faceRectangle.width / 2) * 480 / this.faceImageSize.width - 240;
  
            case 'yPos':
              return 180 - (this.faceAnalyseResult[args.INDEX - 1].faceRectangle.top + this.faceAnalyseResult[args.INDEX - 1].faceRectangle.height / 2) * 360 / this.faceImageSize.height;
  
            case 'height':
              return this.faceAnalyseResult[args.INDEX - 1].faceRectangle.height * 360 / this.faceImageSize.height;
  
            case 'width':
              return this.faceAnalyseResult[args.INDEX - 1].faceRectangle.width * 480 / this.faceImageSize.width;
  
            default:
              break;
          }
        } catch (e) {
          return 'NULL';
        }
      }

      STATE_KEY(){
        return 'aiServices';
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

module.exports = AIServicesBlocks;
