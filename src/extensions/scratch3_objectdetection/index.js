require('babel-polyfill');
/**
* @license
../../../extension-support/argument-type  ../../../extension-support/block-type  format-message  face-api.js  ../../../engine/runtime  ../../../io/video  ../../../engine/stage-layering */
'use strict';

 var ArgumentType = require("../../extension-support/argument-type.js");
 var BlockType = require("../../extension-support/block-type.js");
 var formatMessage  = require("format-message/index.js");
 var cocoSsd = require("@tensorflow-models/coco-ssd/dist/index.js");
 var Video = require("../../io/video.js");
 var StageLayering = require("../../engine/stage-layering.js");
 const Runtime = require('../../engine/runtime');
const tf = require('@tensorflow/tfjs');

 objectDetected = [];
var isStage = false;
var stageWidth = 480;
var stageHeight = 360;
var netModel;
var netModel2;
var drawOnStage = false;
var MakerAttributes = [];

for (var i = 0; i < 20; i++) {
  MakerAttributes[i] = {
    color4f: [Math.random(), Math.random(), Math.random(), 0.7],
    diameter: 3
  };
}

var minScore = 0.5;
var minNumBoxes = 50;
var baseModel = 'lite_mobilenet_v2';
var baseURL = 'static/models/objectDetection/model.json';
var blockIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZWYyNzA7fS5jbHMtMntmaWxsOiNmYmIwNDA7fS5jbHMtM3tmaWxsOiMwNDA1MDQ7fS5jbHMtNHtmaWxsOiNmZmY7fS5jbHMtNSwuY2xzLTd7ZmlsbDpub25lO3N0cm9rZTojMWExNTE3O3N0cm9rZS1taXRlcmxpbWl0OjEwO30uY2xzLTV7c3Ryb2tlLXdpZHRoOjAuNXB4O30uY2xzLTZ7ZmlsbDojMWExNTE3O30uY2xzLTd7c3Ryb2tlLXdpZHRoOjAuMjlweDt9LmNscy04e2ZpbGw6I2U4NmFhODt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPk9iamVjdCBEZXRlY3Rpb248L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYuNzMsMTYuNzhhOC43OCw4Ljc4LDAsMCwwLTMsMi45NUE5LjM1LDkuMzUsMCwwLDAsMi41LDI1LjA3YzAuMzYsNC4yNiwzLjg5LDYuODYsNC44Niw3LjU3LDMuOCwyLjgsNy45NCwyLjY3LDEyLjc4LDIuNTNDMjYsMzUsMzEuMjgsMzQuODQsMzQuNDIsMzAuODZhMTEuMTksMTEuMTksMCwwLDAsMi4xOS03LjUxLDExLjc4LDExLjc4LDAsMCwwLTQuNjktOC4yOWMwLjg4LTQuOTMuNjItOC43Mi0uOS05LjMtMS4xNi0uNDUtMywxLTMuODgsMS43MWExMC4wNywxMC4wNywwLDAsMC0yLjczLDMuMzcsMTUuMjcsMTUuMjcsMCwwLDAtMTAuNjQuOTRBMTAsMTAsMCwwLDAsMTAuODIsOC40QzkuODgsNy43Myw4LjMzLDYuNjIsNy4yNSw3LjE2Yy0wLjkxLjQ1LTEsMS44My0xLjE3LDMuNDJBMTcuMzMsMTcuMzMsMCwwLDAsNi43MywxNi43OFoiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTIiIGN4PSIxMS44OCIgY3k9IjIzLjI2IiByeD0iMi45NSIgcnk9IjMuMzUiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTIiIGN4PSIyNy4yOCIgY3k9IjIyLjYiIHJ4PSIyLjk1IiByeT0iMy4zNSIvPjxlbGxpcHNlIGNsYXNzPSJjbHMtMyIgY3g9IjEyLjQ0IiBjeT0iMjMuMjIiIHJ4PSIyLjM4IiByeT0iMi45Ii8+PGVsbGlwc2UgY2xhc3M9ImNscy00IiBjeD0iMTEuMjciIGN5PSIyMi42IiByeD0iMC41OCIgcnk9IjAuNzMiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTMiIGN4PSIyNi42NCIgY3k9IjIyLjU2IiByeD0iMi4zOCIgcnk9IjIuOSIvPjxlbGxpcHNlIGNsYXNzPSJjbHMtNCIgY3g9IjI1LjQ2IiBjeT0iMjEuOTUiIHJ4PSIwLjU4IiByeT0iMC43MyIvPjxsaW5lIGNsYXNzPSJjbHMtNSIgeDE9IjMxLjk0IiB5MT0iMjUuNjYiIHgyPSIzNC43NCIgeTI9IjI0LjI5Ii8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iMzIuMDciIHkxPSIyNi45IiB4Mj0iMzQuNjgiIHkyPSIyNi45Ii8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iMzIuMTQiIHkxPSIyOC4zMyIgeDI9IjM0LjI5IiB5Mj0iMjguOTgiLz48bGluZSBjbGFzcz0iY2xzLTUiIHgxPSI4LjEiIHkxPSIyNi42OCIgeDI9IjUuMyIgeTI9IjI1LjMyIi8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iNy45NyIgeTE9IjI3LjkyIiB4Mj0iNS4zNyIgeTI9IjI3LjkyIi8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iNy45MSIgeTE9IjI5LjM1IiB4Mj0iNS43NiIgeTI9IjMwIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMTkuMzIsMjcuNDlsMiwwYTAuMjksMC4yOSwwLDAsMSwuMi40OWwtMSwxYTAuMjksMC4yOSwwLDAsMS0uNDEsMGwtMS0xQTAuMjksMC4yOSwwLDAsMSwxOS4zMiwyNy40OVoiLz48bGluZSBjbGFzcz0iY2xzLTciIHgxPSIyMC4yOSIgeTE9IjMwLjQyIiB4Mj0iMjAuMjkiIHkyPSIyOC40NCIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTguNDIsMTZjMC4zNywwLjA4LjUyLS42NCwxLjU1LTEuMzcsMS4yNC0uODgsMi4wNi0wLjU3LDIuMzItMS4xNiwwLjMzLS43NS0wLjczLTEuODgtMS45My0zLjE2LTEtMS4wOC0xLjU2LTEuNjYtMi0xLjUxLTAuNjUuMjItLjYzLDEuODQtMC42LDMuNjlDNy43OCwxMy43OCw3LjgxLDE1Ljg0LDguNDIsMTZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzAuMzYsMTQuMjZjLTAuMzcuMDgtLjUyLTAuNjQtMS41NS0xLjM3LTEuMjQtLjg4LTIuMDYtMC41Ny0yLjMyLTEuMTYtMC4zMy0uNzUuNzMtMS44OCwxLjkzLTMuMTYsMS0xLjA4LDEuNTYtMS42NiwyLTEuNTEsMC42NSwwLjIyLjYzLDEuODQsMC42LDMuNjlDMzEsMTIuMDcsMzEsMTQuMTMsMzAuMzYsMTQuMjZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjAuMzUsMTAuMjlsLTEsNC43Ny0xLjExLTQuNjNjMC4zLDAsLjYyLTAuMDgsMS0wLjFTMjAsMTAuMjksMjAuMzUsMTAuMjlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMuNjYsMTAuNjVMMjAuNzIsMTdsMS4xLTYuNjMsMC43OSwwLjA5QzIzLDEwLjUxLDIzLjMzLDEwLjU3LDIzLjY2LDEwLjY1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE2Ljc0LDEwLjcxbDEuMTYsNy0zLTYuNGMwLjI4LS4xMS41OS0wLjIxLDAuOTEtMC4zMVoiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik0xOS4yLDMxLjY2YTEuNiwxLjYsMCwwLDAsLjI1LDEsMS4yMiwxLjIyLDAsMCwwLC44MS41OSwxLjIsMS4yLDAsMCwwLDEtLjM5LDEuNDIsMS40MiwwLDAsMCwuMjgtMS4yNiwyLDIsMCwwLDEtMS4yMy0xLjE4Ii8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMTYuNjEsMzAuNTRhMiwyLDAsMCwwLDIuMTcsMS4yLDIsMiwwLDAsMCwxLjUzLTEuMzgsMiwyLDAsMCwwLC42NiwxLDIuMDgsMi4wOCwwLDAsMCwxLjY0LjM1LDIuNDIsMi40MiwwLDAsMCwxLjQxLS44Ii8+PC9zdmc+';
var menuIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZWYyNzA7fS5jbHMtMntmaWxsOiNmYmIwNDA7fS5jbHMtM3tmaWxsOiMwNDA1MDQ7fS5jbHMtNHtmaWxsOiNmZmY7fS5jbHMtNSwuY2xzLTd7ZmlsbDpub25lO3N0cm9rZTojMWExNTE3O3N0cm9rZS1taXRlcmxpbWl0OjEwO30uY2xzLTV7c3Ryb2tlLXdpZHRoOjAuNXB4O30uY2xzLTZ7ZmlsbDojMWExNTE3O30uY2xzLTd7c3Ryb2tlLXdpZHRoOjAuMjlweDt9LmNscy04e2ZpbGw6I2U4NmFhODt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPk9iamVjdCBEZXRlY3Rpb248L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTYuNzMsMTYuNzhhOC43OCw4Ljc4LDAsMCwwLTMsMi45NUE5LjM1LDkuMzUsMCwwLDAsMi41LDI1LjA3YzAuMzYsNC4yNiwzLjg5LDYuODYsNC44Niw3LjU3LDMuOCwyLjgsNy45NCwyLjY3LDEyLjc4LDIuNTNDMjYsMzUsMzEuMjgsMzQuODQsMzQuNDIsMzAuODZhMTEuMTksMTEuMTksMCwwLDAsMi4xOS03LjUxLDExLjc4LDExLjc4LDAsMCwwLTQuNjktOC4yOWMwLjg4LTQuOTMuNjItOC43Mi0uOS05LjMtMS4xNi0uNDUtMywxLTMuODgsMS43MWExMC4wNywxMC4wNywwLDAsMC0yLjczLDMuMzcsMTUuMjcsMTUuMjcsMCwwLDAtMTAuNjQuOTRBMTAsMTAsMCwwLDAsMTAuODIsOC40QzkuODgsNy43Myw4LjMzLDYuNjIsNy4yNSw3LjE2Yy0wLjkxLjQ1LTEsMS44My0xLjE3LDMuNDJBMTcuMzMsMTcuMzMsMCwwLDAsNi43MywxNi43OFoiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTIiIGN4PSIxMS44OCIgY3k9IjIzLjI2IiByeD0iMi45NSIgcnk9IjMuMzUiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTIiIGN4PSIyNy4yOCIgY3k9IjIyLjYiIHJ4PSIyLjk1IiByeT0iMy4zNSIvPjxlbGxpcHNlIGNsYXNzPSJjbHMtMyIgY3g9IjEyLjQ0IiBjeT0iMjMuMjIiIHJ4PSIyLjM4IiByeT0iMi45Ii8+PGVsbGlwc2UgY2xhc3M9ImNscy00IiBjeD0iMTEuMjciIGN5PSIyMi42IiByeD0iMC41OCIgcnk9IjAuNzMiLz48ZWxsaXBzZSBjbGFzcz0iY2xzLTMiIGN4PSIyNi42NCIgY3k9IjIyLjU2IiByeD0iMi4zOCIgcnk9IjIuOSIvPjxlbGxpcHNlIGNsYXNzPSJjbHMtNCIgY3g9IjI1LjQ2IiBjeT0iMjEuOTUiIHJ4PSIwLjU4IiByeT0iMC43MyIvPjxsaW5lIGNsYXNzPSJjbHMtNSIgeDE9IjMxLjk0IiB5MT0iMjUuNjYiIHgyPSIzNC43NCIgeTI9IjI0LjI5Ii8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iMzIuMDciIHkxPSIyNi45IiB4Mj0iMzQuNjgiIHkyPSIyNi45Ii8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iMzIuMTQiIHkxPSIyOC4zMyIgeDI9IjM0LjI5IiB5Mj0iMjguOTgiLz48bGluZSBjbGFzcz0iY2xzLTUiIHgxPSI4LjEiIHkxPSIyNi42OCIgeDI9IjUuMyIgeTI9IjI1LjMyIi8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iNy45NyIgeTE9IjI3LjkyIiB4Mj0iNS4zNyIgeTI9IjI3LjkyIi8+PGxpbmUgY2xhc3M9ImNscy01IiB4MT0iNy45MSIgeTE9IjI5LjM1IiB4Mj0iNS43NiIgeTI9IjMwIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNMTkuMzIsMjcuNDlsMiwwYTAuMjksMC4yOSwwLDAsMSwuMi40OWwtMSwxYTAuMjksMC4yOSwwLDAsMS0uNDEsMGwtMS0xQTAuMjksMC4yOSwwLDAsMSwxOS4zMiwyNy40OVoiLz48bGluZSBjbGFzcz0iY2xzLTciIHgxPSIyMC4yOSIgeTE9IjMwLjQyIiB4Mj0iMjAuMjkiIHkyPSIyOC40NCIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTguNDIsMTZjMC4zNywwLjA4LjUyLS42NCwxLjU1LTEuMzcsMS4yNC0uODgsMi4wNi0wLjU3LDIuMzItMS4xNiwwLjMzLS43NS0wLjczLTEuODgtMS45My0zLjE2LTEtMS4wOC0xLjU2LTEuNjYtMi0xLjUxLTAuNjUuMjItLjYzLDEuODQtMC42LDMuNjlDNy43OCwxMy43OCw3LjgxLDE1Ljg0LDguNDIsMTZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMzAuMzYsMTQuMjZjLTAuMzcuMDgtLjUyLTAuNjQtMS41NS0xLjM3LTEuMjQtLjg4LTIuMDYtMC41Ny0yLjMyLTEuMTYtMC4zMy0uNzUuNzMtMS44OCwxLjkzLTMuMTYsMS0xLjA4LDEuNTYtMS42NiwyLTEuNTEsMC42NSwwLjIyLjYzLDEuODQsMC42LDMuNjlDMzEsMTIuMDcsMzEsMTQuMTMsMzAuMzYsMTQuMjZaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjAuMzUsMTAuMjlsLTEsNC43Ny0xLjExLTQuNjNjMC4zLDAsLjYyLTAuMDgsMS0wLjFTMjAsMTAuMjksMjAuMzUsMTAuMjlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMuNjYsMTAuNjVMMjAuNzIsMTdsMS4xLTYuNjMsMC43OSwwLjA5QzIzLDEwLjUxLDIzLjMzLDEwLjU3LDIzLjY2LDEwLjY1WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE2Ljc0LDEwLjcxbDEuMTYsNy0zLTYuNGMwLjI4LS4xMS41OS0wLjIxLDAuOTEtMC4zMVoiLz48cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik0xOS4yLDMxLjY2YTEuNiwxLjYsMCwwLDAsLjI1LDEsMS4yMiwxLjIyLDAsMCwwLC44MS41OSwxLjIsMS4yLDAsMCwwLDEtLjM5LDEuNDIsMS40MiwwLDAsMCwuMjgtMS4yNiwyLDIsMCwwLDEtMS4yMy0xLjE4Ii8+PHBhdGggY2xhc3M9ImNscy03IiBkPSJNMTYuNjEsMzAuNTRhMiwyLDAsMCwwLDIuMTcsMS4yLDIsMiwwLDAsMCwxLjUzLTEuMzgsMiwyLDAsMCwwLC42NiwxLDIuMDgsMi4wOCwwLDAsMCwxLjY0LjM1LDIuNDIsMi40MiwwLDAsMCwxLjQxLS44Ii8+PC9zdmc+';

/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

const AvailableLocales = [  'en', 'hi', 'gu'];

const Message ={
  objectDetection: {
    'en': 'object Detection',
    'hi': 'ऑब्जेक्ट डिटेक्शन',
    'gu': 'ઑબ્જેક્ટ ડિટેક્શન',
},
toggleStageVideoFeed: {
    'en': 'turn [VIDEO_STATE] video on stage with [TRANSPARENCY] % transparency',
    'hi': '[VIDEO_STATE] वीडियो को [TRANSPARENCY] % पारदर्शिता के साथ स्टेज पर चालू करें',
    'gu': '[TRANSPARENCY] % પારદર્શિતા સાથે સ્ટેજ પર [VIDEO_STATE] વિડિઓ ચાલુ કરો',
},
drawBoundingBox: {
    'en': '[OPTION] bounding box',
    'hi': '[OPTION] बाउंडिंग बॉक्स',
    'gu': '[OPTION] બાઉન્ડિંગ બોક્સ',
},
setThreshold: {
    'en': 'set detection threshold to [THRESHOLD]',
    'hi': 'पहचान सीमा को [THRESHOLD] पर सेट करें',
    'gu': 'ડિટેક્શન થ્રેશોલ્ડને [THRESHOLD] પર સેટ કરો',
},
analyseImage: {
    'en': 'analyse image from [FEED]',
    'hi': '[FEED] से छवि का विश्लेषण करें',
    'gu': '[FEED] માંથી છબીનું વિશ્લેષણ કરો',
},
getObjectCount: {
    'en': 'get # of objects',
    'hi': '# वस्तुएँ प्राप्त करें',
    'gu': '# વસ્તુઓ મેળવો',
},
getDetails: {
    'en': '[OPTION] of object [OBJECT]',
    'hi': 'ऑब्जेक्ट का [OPTION] [OBJECT]',
    'gu': 'ઑબ્જેક્ટ [OBJECT] નો [OPTION]',
},
isDetected: {
    'en': 'is [OBJECT] detected?',
    'hi': 'क्या [OBJECT] का पता लगाया गया है?',
    'gu': 'શું [OBJECT] શોધાયેલ છે?',
},
getNoDetected: {
    'en': 'get number of [OBJECT] detected?',
    'hi': 'पता लगाये गए [OBJECT] की संख्या प्राप्त करें?',
    'gu': 'શોધાયેલ [OBJECT] નો નંબર મેળવો?',
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
class:{
  'en':'class',
  'gu':'વર્ગ',
  'hi':'क्लास'
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
person:{
  'en':'person',
  'gu':'વ્યક્તિ',
  'hi':'आदमी'
},
bicycle:{
  'en': 'bicycle',
  'gu': 'સાયકલ',
  'hi': 'साइकिल'
},
car:{
  'en':'car',
  'gu': 'ગાડી',
  'hi': 'मोटर'
},
motorcycle:{
  'en':'motorcycle',
  'gu': 'મોટરસાઇકલ',
  'hi': 'मोटरसाइकिल'
},
airplane:{
  'en':'airplane',
  'gu': 'વિમાન',
  'hi': 'हवाई जहाज'
},
bus:{
  'en':'bus',
  'gu': 'બસ',
  'hi': 'बस'
},
train:{
  'en':'train',
  'gu': 'આગગાડી',
  'hi': 'रेलगाड़ी'
},
truck:{
  'en':'truck',
  'gu':'ખટારો',
  'hi':'ट्रक'

},
boat:{
  'en':'boat',
  'gu':'હોડી',
  'hi':'नाव'
},
traffic_light:{
  'en':'traffic light',
  'gu':'ટ્રાફિક લાઇટ'
  ,'hi':'ट्रैफिक लाइट'
},
fire_hydrant:{
  'en':'fire hydrant',
  'gu':'ફાયર હાઇડ્રન્ટ',
  'hi':'अग्नि हाईड्रेंट'
},
stop_sign:{
  'en':'stop sign',
  'gu':'સ્ટોપનું ચિહ્ન'
  ,'hi':'रुकने का चिन्ह'
},
parking_meter:{
  'en':'parking meter',
  'gu':'પાર્કિંગ મીટર',
  'hi':'पार्किंग मीटर'
},
bench:{
  'en':'bench',
  'gu':'પાટલી',
  'hi':'तिपाई'
},
bird:{
  'en':'bird',
  'gu':'પક્ષી',
  'hi':'चिड़िया'
},
cat:{
  'en':'cat',
  'gu':'બિલાડી',
  'hi':'बिल्ली'
},
dog:{
  'en':'dog',
  'gu':'કૂતરો',
  'hi':'कुत्ता'
},
horse:{
  'en':'horse',
  'gu':'ઘોડો',
  'hi':'घोड़ा'
},
sheep:{
  'en':'sheep',
  'gu':'ઘેટાં',
  'hi':'भेड़'
},
cow:{
  'en':'cow',
  'gu':'ગાય',
  'hi':'गाय'
},
elephant:{
  'en':'elephant',
  'gu':'હાથી',
  'hi':'हाथी'
},
bear:{
  'en':'bear',
  'gu':'રીંછ',
  'hi':'भालू'
},
zebra:{
  'en':'zebra',
  'gu':'ઝેબ્રા',
  'hi':'ज़ेबरा'
},
giraffe:{
  'en':'giraffe',
  'gu':'જિરાફ',
  'hi':'जिराफ़'
},
backpack:{
  'en':'backpack',
  'gu':'બેકપેક',
  'hi':'बैकपैक'
},
umbrella:{
  'en':'umbrella',
  'gu':'છત્રી',
  'hi':'छाता'
},
handbag:{
  'en':'handbag',
  'gu':'હેંડબેગ',
  'hi':'हैंडबैग'
},
tie:{
  'en':'tie',
  'gu':'ટાઇ',
  'hi':'टाई'
},
suitcase:{
  'en':'suitcase',
  'gu':'સુટકેસ',
  'hi':'सूटकेस'
},
frisbee:{
  'en':'frisbee',
  'gu':'ફ્રિસ્બી',
  'hi':'फ़्रिस्बी'
},
skis:{
  'en':'skis',
  'gu':'સ્કીઝ',
  'hi':'स्कीज़'
},
snowboard:{
  'en':'snowboard',
  'gu':'સ્નો બોર્ડ',
  'hi':'स्नो बोर्ड'
},
sports_ball:{
  'en':'sports ball',
  'gu':'સ્પોર્ટ બોલ',
  'hi':'स्पोर्ट्स बॉल'
},
kite:{
  'en':'kite',
  'gu':'પતંગ',
  'hi':'पतंग'
},
baseball_bat:{
  'en':'baseball bat',
  'gu':'બેઝબોલ બેટ',
  'hi':'बेस्बाल का बल्ला'
},
baseball_glove:{
  'en':'baseball glove',
  'gu':'બેઝબોલ ગ્લોવ',
  'hi':'बेसबॉल दस्ताना'
},
skateboard:{
  'en':'skateboard',
  'gu':'સ્કેટબોર્ડ',
  'hi':'स्केटबोर्ड'
},
surfboard:{
  'en':'surfboard',
  'gu':'સર્ફબોર્ડ',
  'hi':'सर्फबोर्ड'
},
tennis_racket:{
  'en':'tennis racket',
  'gu':'ટેનિસ રેકેટ',
  'hi':'टेनिस रैकेट'
},
bottle:{
  'en':'bottle',
  'gu':'બોટલ',
  'hi':'बोतल'
},
wine_glass:{
  'en':'wine glass',
  'gu':'વાઇન ગ્લાસ',
  'hi':'वाइन ग्लास'
},
cup:{
  'en':'cup',
  'gu':'કપ',
  'hi':'कप'
},
fork:{
  'en':'fork',
  'gu':'ફોર્ક',
  'hi':'फोर्क'
},
knife:{
  'en':'knife',
  'gu':'છરી',
  'hi':' चाकू'
},
spoon:{
  'en':'spoon',
  'gu':'ચમચી',
  'hi':'चम्मच'
},
bowl:{
  'en':'bowl',
  'gu':'વાટકી',
  'hi':'कटोरा'
},
banana:{
  'en':'banana',
  'gu':'કેળા',
  'hi':'केला'
},
apple:{
  'en':'apple',
  'gu':'સફરજન',
  'hi':'सेब'
},
sandwich:{
  'en':'sandwich',
  'gu':'સેન્ડવીચ',
  'hi':'सैंडविच'
},
orrange:{
  'en':'orrange',
  'gu':'નારંગી',
  'hi':'नारंगी'
},
broccoli:{
  'en':'broccoli',
  'gu':'બ્રોકોલી',
  'hi':'ब्रोकोली'
},
carrot:{
  'en':'carrot',
  'gu':'ગાજર',
  'hi':'गाजर'
},
hot_dog:{
  'en':'hot dog',
  'gu':'હોટ ડોગ',
  'hi':'हॉट डॉग'
},
pizza:{
  'en':'pizza',
  'gu':'પિઝ્ઝા',
  'hi':'पिज्जा'
},
donut:{
  'en':'donut',
  'gu':'મીઠાઈ',
  'hi':'मिठाई'
},
cake:{
  'en':'cake',
  'gu':'કેક',
  'hi':'केक'
},
chair:{
  'en':'chair',
  'gu':'ખુરશી',
  'hi':'कुरसी'
},
couch:{
  'en':'couch',
  'gu':'સોફા',
  'hi':'सोफ़ा'
},
potted_plant:{
  'en':'potted plant',
  'gu':'પોટેડ પ્લાન્ટ',
  'hi':'पॉटेड प्लांट'
},
bed:{
  'en':'bed',
  'gu':'બેડ',
  'hi':'बेड'
},
dining_table:{
  'en':'dining table',
  'gu':'જમવાનું ટેબલ',
  'hi':'खाना की टेबल'
},
toilet:{
  'en':'toilet',
  'gu':'શૌચાલય',
  'hi':'शौचालय'
},
tv:{
  'en':'tv',
  'gu':'ટીવી',
  'hi':'टीवी'
},
laptop:{
  'en':'laptop',
  'gu':'લેપટોપ',
  'hi':'लैपटॉप'
},
mouse:{
  'en':'mouse',
  'gu':'માઉસ',
  'hi':'माउस'
},
remote:{
  'en':'remote',
  'gu':'રિમોટ',
  'hi':'रिमोट'
},
keyboard:{
  'en':'keyboard',
  'gu':'કીબોર્ડ',
  'hi':'कीबोर्ड'
},
cell_phone:{
  'en':'cell phone',
  'gu':'સેલ ફોન',
  'hi':'सेल फोन'
},
microwave:{
  'en':'microwave',
  'gu':'માઇક્રોવેવ',
  'hi':'माइक्रोवेव'
},
oven:{
  'en':'oven',
  'gu':'ઓવન',
  'hi':'ओवन'
},
toaste:{
  'en':'toaste',
  'gu':'ટોસ્ટર',
  'hi':'टोस्टर'
},
sink:{
  'en':'sink',
  'gu':'સિંક',
  'hi':'सिंक'
},
refrigerator:{
  'en':'refrigerator',
  'gu':'રેફ્રિજરેટર',
  'hi':'रेफ्रिजरेटर'
},
book:{
  'en':'book',
  'gu':'પુસ્તક',
  'hi':'किताब'
},
clock:{
  'en':'clock',
  'gu':'ઘડિયાળ',
  'hi':'घड़ी'
},
vase:{
  'en':'vase',
  'gu':'ફૂલદાની',
  'hi':'गुलदान'
},
scissors:{
  'en':'scissors',
  'gu':'કાતર',
  'hi':'कैंची'

},
teddy_bear:{
  'en':'teddy bear',
  'gu':'ટેડી બિઅર',
  'hi':'टेडी बियर'
},
hair_drier:{
  'en':'hair drier',
  'gu':'હેર ડ્રાયર',
  'hi':'हेयर ड्रायर'
},
toothbrush:{
  'en':'toothbrush',
  'gu':'ટૂથબ્રશ',
  'hi':'टूथब्रश'
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

}

class objectDetection{
    constructor(runtime){

        var _this = this;
        console.log('Using TensorFlow backend: ', tf.getBackend());
        this.runtime = runtime;
        this.locale = this.setLocale();
    console.log('MODEL_LOADING');
    this.modelLoaded = false;
    var self = this;
    netModel = new Promise(function (resolve) {

      cocoSsd.load({
        base: 'lite_mobilenet_v2',
        modelUrl: 'static/models/objectDetection/model.json'
      }).catch(function (err) {
      })
      .then(function (net) {
        

        netModel2 = net;

        self.runtime.renderer.requestSnapshot(function (data) {
          var image = document.createElement('img');
          console.log("testing ss"+image);
          image.onload = function () {
            netModel2.detect(image, minNumBoxes, minScore).then(function (prediction) {
              isStage = true;
              stageWidth = image.width;
              stageHeight = image.height;
              objectDetected = prediction;
              // runtime.emit('MODEL_LOADING_FINISHED', true);
              console.log('Model_Loading_Finished');
              self.modelLoaded = true;
              resolve('Done');
              return "Done";
            });
          };

          image.setAttribute("src", data);
        })
      }).catch(function (err) {
        console.log('mylog'+err) ;
        // _this.runtime.emit('MODEL_LOADING_FINISHED', false);
      });
    });
    this.globalVideoState = 'off';
    this.runtime.ioDevices.video.disableVideo();
    this.extensionName = 'Object Detection';
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
          id: 'objectDetection',
          name: 'Object Detection',
          blockIconURI: blockIconURI,
          menuIconURI: menuIconURI,
          colour: '#c64342',
          colourSecondary: '#b63535',
          colourTertiary: '#a42b2b',
          blocks: [{
            message: formatMessage({
              id: 'objectDetection.blockSeparatorMessage1',
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
                type: ArgumentType.STRING,
                defaultValue: '0'
              }
            }
          }, {
            opcode: 'drawBoundingBox',
            text:  Message.drawBoundingBox[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              OPTION: {
                type: ArgumentType.STRING,
                menu: 'drawBox',
                defaultValue: '1'
              }
            }
          }, {
            opcode: 'setThreshold',
            text: Message.setThreshold[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              THRESHOLD: {
                type: ArgumentType.NUMBER,
                menu: 'threshold',
                defaultValue: '0.5'
              }
            }
          }, {
            message: formatMessage({
              id: 'objectDetection.blockSeparatorMessage2',
              default: 'Analyse Image',
              description: 'Analyse Feed'
            })
          }, {
            opcode: 'analyseImage',
            text: Message.analyseImage[this.locale],
            blockType: BlockType.COMMAND,
            arguments: {
              FEED: {
                type: ArgumentType.NUMBER,
                menu: 'feed',
                defaultValue: '1'
              }
            }
          }, "---", {
            opcode: 'getObjectCount',
            text: Message.getObjectCount[this.locale],
            blockType: BlockType.REPORTER
          }, {
            opcode: 'getDetails',
            text: Message.getDetails[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OBJECT: {
                type: ArgumentType.NUMBER,
                menu: 'personNumbers',
                defaultValue: '1'
              },
              OPTION: {
                type: ArgumentType.NUMBER,
                menu: 'objectOption',
                defaultValue: '0'
              }
            }
          }, {
            opcode: 'isDetected',
            text: Message.isDetected[this.locale],
            blockType: BlockType.BOOLEAN,
            arguments: {
              OBJECT: {
                type: ArgumentType.STRING,
                menu: 'objects',
                defaultValue: 'person'
              }
            }
          }, {
            opcode: 'getNoDetected',
            text: Message.getNoDetected[this.locale],
            blockType: BlockType.REPORTER,
            arguments: {
              OBJECT: {
                type: ArgumentType.STRING,
                menu: 'objects',
                defaultValue: 'person'
              }
            }
          }],
          menus: {
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
            personNumbers: {
              acceptReporters: true,
              items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
            },
            objectOption: [{
              text: Message.class[this.locale],
              value: '0'
            }, {
              text: Message.x_position[this.locale],
              value: '1'
            }, {
              text: Message.Y_position[this.locale],
              value: '2'
            }, {
              text: Message.width[this.locale],
              value: '3'
            }, {
              text: Message.height[this.locale],
              value: '4'
            }, {
              text: Message.confidence[this.locale],
              value: '5'
            }],
            feed: {
              items: [{
                text: Message.camera[this.locale],
                value: '1'
              }, {
                text:Message.stage[this.locale],
                value: '2'
              }]
            },
            drawBox: [{
              text: Message.show[this.locale],
              value: '1'
            }, {
              text: Message.hide[this.locale],
              value: '2'
            }],
            threshold: {
              acceptReporters: true,
              items: ['0.95', '0.9', '0.85', '0.8', '0.75', '0.7', '0.6', '0.5', '0.4', '0.3']
            },
            objects: [{
              text:Message.person[this.locale],
              value: "person"
            }, {
              text: Message.bicycle[this.locale],
              value: "bicycle"
            }, {
              text: Message.car[this.locale],
              value: "car"
            }, {
              text: Message.motorcycle[this.locale],
              value: "motorcycle"
            }, {
              text: Message.airplane[this.locale],
              value: "airplane"
            }, {
              text: Message.bus[this.locale],
              value: "bus"
            }, {
              text: Message.train[this.locale],
              value: "train"
            }, {
              text: Message.truck[this.locale],
              value: "truck"
            }, {
              text: Message.boat[this.locale],
              value: "boat"
            }, {
              text: Message.traffic_light[this.locale],
              value: "traffic light"
            }, {
              text: Message.fire_hydrant[this.locale],
              value: "fire hydrant"
            }, {
              text: Message.stop_sign[this.locale],
              value: "stop sign"
            }, {
              text: Message.parking_meter[this.locale],
              value: "parking meter"
            }, {
              text: Message.bench[this.locale],
              value: "bench"
            }, {
              text: Message.bird[this.locale],
              value: "bird"
            }, {
              text: Message.cat[this.locale],
              value: "cat"
            }, {
              text: Message.dog[this.locale],
              value: "dog"
            }, {
              text: Message.horse[this.locale],
              value: "horse"
            }, {
              text: Message.sheep[this.locale],
              value: "sheep"
            }, {
              text:Message.cow[this.locale],
              value: "cow"
            }, {
              text: Message.elephant[this.locale],
              value: "elephant"
            }, {
              text: Message.bear[this.locale],
              value: "bear"
            }, {
              text: Message.zebra[this.locale],
              value: "zebra"
            }, {
              text: Message.giraffe[this.locale],
              value: "giraffe"
            }, {
              text: Message.backpack[this.locale],
              value: "backpack"
            }, {
              text: Message.umbrella[this.locale],
              value: "umbrella"
            }, {
              text: Message.handbag[this.locale],
              value: "handbag"
            }, {
              text:Message.tie[this.locale],
              value: "tie"
            }, {
              text: Message.suitcase[this.locale],
              value: "suitcase"
            }, {
              text: Message.frisbee[this.locale],
              value: "frisbee"
            }, {
              text: Message.skis[this.locale],
              value: "skis"
            }, {
              text: Message.snowboard[this.locale],
              value: "snowboard"
            }, {
              text: Message.sports_ball[this.locale],
              value: "sports ball"
            }, {
              text: Message.kite[this.locale],
              value: "kite"
            }, {
              text: Message.baseball_bat[this.locale],
              value: "baseball bat"
            }, {
              text: Message.baseball_glove[this.locale],
              value: "baseball glove"
            }, {
              text: Message.skateboard[this.locale],
              value: "skateboard"
            }, {
              text: Message.surfboard[this.locale],
              value: "surfboard"
            }, {
              text: Message.tennis_racket[this.locale],
              value: "tennis racket"
            }, {
              text: Message.bottle[this.locale],
              value: "bottle"
            }, {
              text: Message.wine_glass[this.locale],
              value: "wine glass"
            }, {
              text: Message.cup[this.locale],
              value: "cup"
            }, {
              text: Message.fork[this.locale],
              value: "fork"
            }, {
              text: Message.knife[this.locale],
              value: "knife"
            }, {
              text: Message.spoon[this.locale],
              value: "spoon"
            }, {
              text: Message.bowl[this.locale],
              value: "bowl"
            }, {
              text:Message.banana[this.locale],
              value: "banana"
            }, {
              text: Message.apple[this.locale],
              value: "apple"
            }, {
              text: Message.sandwich[this.locale],
              value: "sandwich"
            }, {
              text: Message.orrange[this.locale],
              value: "orange"
            }, {
              text: Message.broccoli[this.locale],
              value: "broccoli"
            }, {
              text: Message.carrot[this.locale],
              value: "carrot"
            }, {
              text: Message.hot_dog[this.locale],
              value: "hot dog"
            }, {
              text: Message.pizza[this.locale],
              value: "pizza"
            }, {
              text: Message.donut[this.locale],
              value: "donut"
            }, {
              text: Message.cake[this.locale],
              value: "cake"
            }, {
              text: Message.chair[this.locale],
              value: "chair"
            }, {
              text: Message.couch[this.locale],
              value: "couch"
            }, {
              text: Message.potted_plant[this.locale],
              value: "potted plant"
            }, {
              text: Message.bed[this.locale],
              value: "bed"
            }, {
              text: Message.dining_table[this.locale],
              value: "dining table"
            }, {
              text: Message.toilet[this.locale],
              value: "toilet"
            }, {
              text: Message.tv[this.locale],
              value: "tv"
            }, {
              text: Message.laptop[this.locale],
              value: "laptop"
            }, {
              text: Message.mouse[this.locale],
              value: "mouse"
            }, {
              text: Message.remote[this.locale],
              value: "remote"
            }, {
              text: Message.keyboard[this.locale],
              value: "keyboard"
            }, {
              text: Message.cell_phone[this.locale],
              value: "cell phone"
            }, {
              text: Message.microwave[this.locale],
              value: "microwave"
            }, {
              text: Message.oven[this.locale],
              value: "oven"
            }, {
              text: Message.toaste[this.locale],
              value: "toaster"
            }, {
              text: Message.sink[this.locale],
              value: "sink"
            }, {
              text: Message.refrigerator[this.locale],
              value: "refrigerator"
            }, {
              text: Message.book[this.locale],
              value: "book"
            }, {
              text: Message.clock[this.locale],
              value: "clock"
            }, {
              text: Message.vase[this.locale],
              value: "vase"
            }, {
              text: Message.scissors[this.locale],
              value: "scissors"
            }, {
              text: Message.teddy_bear[this.locale],
              value: "teddy bear"
            }, {
              text: Message.hair_drier[this.locale],
              value: "hair drier"
            }, {
              text: Message.toothbrush[this.locale],
              value: "toothbrush"
            }]
          }
          
        };
      }

      toggleStageVideoFeed(args, util) {
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
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
      
      analyseImage(args, util) {
        var _this2 = this;
  
        var self2 = this;
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
        
        if (this.modelLoaded) {
        
          if (args.FEED === '1') {
            var translatePromise = new Promise(function (resolve) {
              var frame = _this2.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: objectDetection.DIMENSIONS
              });
  
              netModel2.detect(frame, minNumBoxes, minScore).then(function (prediction) {
                isStage = false;
                objectDetected = prediction;
  
                if (drawOnStage) {
                  self2._clearMark();
  
                  for (var _i = 0; _i < objectDetected.length; _i++) {
                    self2._drawMark(objectDetected[_i].bbox[0], objectDetected[_i].bbox[1], objectDetected[_i].bbox[2], objectDetected[_i].bbox[3], objectDetection.DIMENSIONS[0], objectDetection.DIMENSIONS[1], _i);
                  }
                }
  
                resolve('Done');
                return 'Done';
              }).catch(function (err) {
                objectDetected = [];
                resolve('Camera not ready!');
                return 'Camera not ready!';
              });
            });
            return translatePromise;
          } else if (args.FEED === '2') {
            return new Promise(function (resolve) {
              _this2.runtime.renderer.requestSnapshot(function (data) {
                var image = document.createElement('img');
  
                image.onload = function () {
                  netModel2.detect(image, minNumBoxes, minScore).then(function (prediction) {
                    isStage = true;
                    stageWidth = image.width;
                    stageHeight = image.height;
                    objectDetected = prediction;
  
                    if (drawOnStage) {
                      self2._clearMark();
  
                      for (var _i2 = 0; _i2 < objectDetected.length; _i2++) {
                        self2._drawMark(objectDetected[_i2].bbox[0], objectDetected[_i2].bbox[1], objectDetected[_i2].bbox[2], objectDetected[_i2].bbox[3], stageWidth, stageHeight, _i2);
                      }
                    }
  
                    resolve('Done');
                    return 'Done';
                  });
                };
  
                image.setAttribute("src", data);
              });
            });
          }
        } else {
          this.runtime.emit('MODEL_LOADING');
          var self = this;
          return new Promise(function (resolve) {
            cocoSsd.load().then(function (net) {
              netModel2 = net;
              self.runtime.emit('MODEL_LOADING_FINISHED', true);
              self.modelLoaded = true;
  
              if (args.FEED === '1') {
                var frame = this.runtime.ioDevices.video.getFrame({
                  format: Video.FORMAT_IMAGE_DATA,
                  dimensions: objectDetection.DIMENSIONS
                });
                netModel2.detect(frame, minNumBoxes, minScore).then(function (prediction) {
                  isStage = false;
                  objectDetected = prediction;
  
                  if (drawOnStage) {
                    self2._clearMark();
  
                    for (var _i3 = 0; _i3 < objectDetected.length; _i3++) {
                      self2._drawMark(objectDetected[_i3].bbox[0], objectDetected[_i3].bbox[1], objectDetected[_i3].bbox[2], objectDetected[_i3].bbox[3], objectDetection.DIMENSIONS[0], objectDetection.DIMENSIONS[1], _i3);
                    }
                  }
  
                  resolve('Done');
                  return 'Done';
                }).catch(function (err) {
                  objectDetected = [];
                  resolve('Camera not ready!');
                  return 'Camera not ready!';
                });
              } else if (args.FEED === '2') {
                self.runtime.renderer.requestSnapshot(function (data) {
                  var image = document.createElement('img');
  
                  image.onload = function () {
                    netModel2.detect(image, minNumBoxes, minScore).then(function (prediction) {
                      isStage = true;
                      stageWidth = image.width;
                      stageHeight = image.height;
                      objectDetected = prediction;
  
                      if (drawOnStage) {
                        self2._clearMark();
  
                        for (var _i4 = 0; _i4 < objectDetected.length; _i4++) {
                          self2._drawMark(objectDetected[_i4].bbox[0], objectDetected[_i4].bbox[1], objectDetected[_i4].bbox[2], objectDetected[_i4].bbox[3], stageWidth, stageHeight, _i4);
                        }
                      }
  
                      resolve('Done');
                      return 'Done';
                    });
                  };
  
                  image.setAttribute("src", data);
                });
              }
            }).catch(function (err) {
              _this2.runtime.emit('MODEL_LOADING_FINISHED', false);
  
              resolve('');
            });
          });
        }
      }
      _drawMark(x1, y1, w, h, width, height, num) {
        var widthScale = 480 / width;
        var heightScale = 360 / height;
        x1 = x1 * widthScale - width / 2 * widthScale;
        var x2 = x1 + w * widthScale;
        var x3 = x2;
        var x4 = x1;
        y1 = height / 2 * heightScale - y1 * heightScale;
        var y2 = y1;
        var y3 = y1 - h * heightScale;
        var y4 = y3;
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x1, y1, x2, y2);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x2, y2, x3, y3);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x4, y4, x3, y3);
        this.runtime.renderer.penLine(this._penSkinId, MakerAttributes[num], x4, y4, x1, y1);
      }
      _clearMark() {
        this.runtime.renderer.penClear(this._penSkinId);
      }

      getObjectCount(args, util) {
        return objectDetected.length;
      }

      getDetails(args, util) {
        //if (!this.runtime.checkSessionExists(this.extensionName)) return;
  
        if (objectDetected[parseInt(args.OBJECT, 10) - 1] && objectDetected[parseInt(args.OBJECT, 10) - 1].score > 0.3) {
          if (args.OPTION === "0") {
            return objectDetected[parseInt(args.OBJECT, 10) - 1].class;
          } else if (args.OPTION === "1") {
            if (!isStage) {
              var XPos = objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[0] + objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[2] / 2;
              XPos = XPos - 240;
              return XPos.toFixed(1);
            } else {
              var _XPos = 480 * (objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[0] + objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[2] / 2) / stageWidth;
  
              _XPos = _XPos - 240;
              return _XPos.toFixed(1);
            }
          } else if (args.OPTION === "2") {
            if (!isStage) {
              var YPos = objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[1] + objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[3] / 2;
              YPos = 180 - YPos;
              return YPos.toFixed(1);
            } else {
              var _YPos = 360 * (objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[1] + objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[3] / 2) / stageHeight;
  
              _YPos = 180 - _YPos;
              return _YPos.toFixed(1);
            }
          } else if (args.OPTION === "3") {
            if (!isStage) {
              var Width = objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[2];
              return Width.toFixed(1);
            } else {
              var _Width = 480 * objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[2] / stageWidth;
  
              return _Width.toFixed(1);
            }
          } else if (args.OPTION === "4") {
            if (!isStage) {
              var Height = objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[3];
              return Height.toFixed(1);
            } else {
              var _Height = 360 * objectDetected[parseInt(args.OBJECT, 10) - 1].bbox[3] / stageHeight;
  
              return _Height.toFixed(1);
            }
          } else if (args.OPTION === "5") {
            var Confidence = objectDetected[parseInt(args.OBJECT, 10) - 1].score;
            return Confidence.toFixed(2);
          }
        } else {
          return "NULL";
        }
      }
      drawBoundingBox(args, util) {
        var self2 = this;
  
        if (args.OPTION === "1") {
          drawOnStage = true;
  
          self2._clearMark();
  
          for (var _i5 = 0; _i5 < objectDetected.length; _i5++) {
            self2._drawMark(objectDetected[_i5].bbox[0], objectDetected[_i5].bbox[1], objectDetected[_i5].bbox[2], objectDetected[_i5].bbox[3], objectDetection.DIMENSIONS[0], objectDetection.DIMENSIONS[1], _i5);
          }
        } else {
          drawOnStage = false;
  
          this._clearMark();
        }
      }

      setThreshold(args, util) {
        minScore = parseFloat(args.THRESHOLD);
      }
      isDetected(args, util) {
        var isObjectDetected = false;
  
        for (var _i6 = 0; _i6 < objectDetected.length; _i6++) {
          if (objectDetected[_i6].class === args.OBJECT) {
            isObjectDetected = true;
          }
        }
  
        return isObjectDetected;
      }
      getNoDetected(args, util) {
        var objectCount = 0;
  
        for (var _i7 = 0; _i7 < objectDetected.length; _i7++) {
          if (objectDetected[_i7].class === args.OBJECT) {
            objectCount = objectCount + 1;
          }
        }
  
        return objectCount;
      }

      static get DIMENSIONS() {
        return [480, 360];  
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
module.exports = objectDetection;