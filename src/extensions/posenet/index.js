require('babel-polyfill');
/**
* @license
../../../extension-support/argument-type  ../../../extension-support/block-type  format-message  face-api.js  ../../../engine/runtime  ../../../io/video  ../../../engine/stage-layering */
'use strict';

 var ArgumentType = require("../../extension-support/argument-type.js");
 var BlockType = require("../../extension-support/block-type.js");
 var formatMessage  = require("format-message/index.js");
 var posenetModel  = require("@tensorflow-models/posenet/dist/posenet.esm.js");
 var Runtime = require('../../engine/runtime');
 var handPoseModel = require('@tensorflow-models/handpose/dist/handpose.esm.js');

 var Video = require("../../io/video.js");
 var StageLayering = require("../../engine/stage-layering.js");

 var _require = require('@tensorflow/tfjs-core/dist/tf-core.js');
 const tf = require('@tensorflow/tfjs');
///const { hide } = require('blockly/core/tooltip.js');
 var cos = _require.cos;

 var isStage = false;
var stageWidth = 0;
var stageHeight = 0;
var poseDetected = [];
var handDetected = [];
var drawOnStage = false;
var MakerAttributes = [];

for (var i = 0; i < 20; i++) {
  MakerAttributes[i] = {
    color4f: [Math.random(), Math.random(), Math.random(), 0.7]
  };
}
const Message = {
 posenet : {
        'en': ' Human Body' ,
        'gu': 'ચહેરાની તપાસ',
        'hi': 'चेहरे का पहचान'
    },
     toggleStageVideoFeed: {
        'en': 'turn [VIDEO_STATE] video on stage with [TRANSPARENCY] % transparency ',
        'gu':'સ્ટેજ પર [TRANSPARENCY] % પારદર્શિતા સાથે [VIDEO_STATE] વિડિઓ ચાલુ કરો ',
        'hi': '[VIDEO_STATE] वीडियो को [TRANSPARENCY] % पारदर्शिता के साथ मंच पर चालू करें'
    },
    drawBoundingBox : {
        'en': '[OPTION]detections',
        'gu':'[OPTION]તપાસ',
        'hi': '[OPTION]पता लगाना'
    },
    isDetected : {
        'en': 'is [PART] of person [PERSON] detected?',
        'gu': 'શું વ્યક્તિ [PERSON] નો [PART] મળી આવ્યો છે?',
        'hi': 'क्या व्यक्ति [PERSON] का [PART] पता चला है?'
    },
    analyseImage : {
        
        'en': 'analyse image for hand from camera',
        'gu': 'કેમેરામાંથી હાથ માટે છબીનું વિશ્લેષણ કરો',
        'hi': 'कैमरे से हाथ की छवि का विश्लेषण करें'
    },
    getPeopleCount : {
      
        'en': 'get # of peoples',
        'gu': '# લોકો મેળવો ',
        'hi': '## लोगों का प्राप्त करें'

    },
    getX : {
        
        'en': 'X position of [PART] of person [PERSON]',
        'gu': 'વ્યક્તિ [PERSON] ના [PART]ની X સ્થિતિ',
        'hi': 'व्यक्ति के [PART] की X स्थिति [PERSON]'
    },
    getY : {
       
        'en': 'Y position of [PART] of person [PERSON]',
        'gu': 'વ્યક્તિ [PERSON] ના [PART]ની Y સ્થિતિ',
        'hi': 'व्यक्ति के [PART] की Y स्थिति [PERSON]'
    },
    analyseImageHand: {
        'en': 'analyse image for hand from camera',
        'gu': 'કેમેરામાંથી હાથ માટે છબીનું વિશ્લેષણ કરો',
        'hi': 'कैमरे से हाथ की छवि का विश्लेषण करें'
    },
    isDetectedHand : {
        
        'en': 'is hand detected',
        'gu': 'હાથથી શોધી કાઢવામાં આવે છે',
        'hi': 'हाथ से पता लगाया गया है'
    },
    getPositionHand : {
       
        'en': '[POSITION] position of [PART] of [FINGER]',
        'gu': '[FINGER] ના [PART] ની [POSITION] સ્થિતિ',
        'hi': '[POSITION] [FINGER] के [PART] की स्थिति।'
    },
    getPositionNumberHand: {
        
      'en': '[POSITION] position of [PART]',
      'gu': '[PART] ની [POSITION] સ્થિતિ',
      'hi': '[POSITION] [PART] की स्थिति'
  },
  getHand : {
      
      'en': '[POSITION] of hand',
      'gu': 'હાથની [POSITION]',
      'hi': 'हाथ की [POSITION]'
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
left_ear:{
  'en':'left ear',
  'gu':'ડાબો કાન'
  ,'hi':'बाँयां कान'
},
right_ear:{
  'en':'right ear',
  'gu':'જમણો કાન'
  ,'hi':'दाहिना कान'
},
left_shoulder:{
  'en':'left sholder',
  'gu':'ડાબો ખભા',
  'hi':'बायाँ कंधा'
},
right_shoulder:{
  'en':'right shoulder',
  'gu':'જમણો ખભા',
  'hi':'दायां कंधा'
},
left_wrist:{
  'en':'left wrist',
  'gu':'ડાબું કાંડું',
  'hi':'बाईं कलाई'
},
right_wrist:{
  'en':'right wrist',
  'gu':'જમણું કાંડું',
  'hi':'दाहिनी कलाई'
},
left_heap:{
  'en':'left heap',
  'gu':'ડાબું હિપ',
  'hi':'बायां कूल्हा'
},
right_heap:{
  'en':'right heap',
  'gu':'જમણું હિપ',
  'hi':'दाहिना कूल्हा'
},
left_knee:{
  'en':'left knee',
  'gu':'ડાબો ઘૂંટણ',
  'hi':'बायां घुटना'
},
right_knee:{
  'en': 'right knee',
  'gu': 'જમણો ઘૂંટણ',
  'hi': 'दाहिना घुटना'
},
left_ankle:{
  'en':'left ankle',
  'gu': 'ડાબા પગની ઘૂંટી',
  'hi': 'बायां टखना'
},
right_ankle:{
  'en':'right ankle',
  'gu': 'જમણા પગની ઘૂંટી',
  'hi': 'दाहिना टखना'
},
left_elbow:{
  'en':'left elbow',
  'gu':'ડાબી કોણી',
  'hi':'बायां कोहनी'
},
right_elbow:{
  'en':'right elbow',
  'gu':'જમણી કોણી',
  'hi':'दाहिनी कोहनी'
},
top:{
  'en':'top',
  'gu': 'ટોચ',
  'hi': 'ऊपर '
},
middle1:{
  'en':'middle1',
  'gu': 'વચ્ચેની1',
  'hi': 'मध्यमा1'
},
middle2:{
  'en':'middle1',
  'gu': 'વચ્ચેની2',
  'hi': 'मध्यमा2'
},
bottom:{
  'en':'bottom',
  'gu': 'નીચે',
  'hi': 'निचला '
},
thumb:{
  'en':'thumb',
  'gu': 'અંગૂઠો',
  'hi': 'अँगूठा'
},
index_finger:{
  'en':'index finger',
  'gu': 'તર્જની',
  'hi': 'तर्जनी'
},
middle_finger:{
  'en':'middle_finger',
  'gu': 'વચલી આંગળી',
  'hi': 'बीच की ऊँगली'
},
ring_finger:{
  'en':'ring finger',
  'gu': 'રિંગ આંગળી',
  'hi': 'रिंग फिंगर'
},
pinky_finger:{
  'en':'pinky finger',
  'gu': 'ખુશ',
  'hi': 'ટચલી આંગળી'
},
top_of_thumb : {
     
  'en': 'top of thumb',
  'gu': 'અંગૂઠાની ટોચ',
  'hi': 'अँगूठे का ऊपरी भाग'
},
middle_1_of_thumb: {
 
'en': 'middle 1 of thumb',
'gu': 'અંગૂઠાની મધ્યમાં 1',
'hi': 'अंगूठे का मध्य 1'
},
middle_2_of_thumb:  {
 
'en': 'middle 2 of thumb',
'gu': 'અંગૂઠાની મધ્યમાં 2',
'hi': 'अंगूठे का मध्य 2'

},
bottom_of_thumb:{
  'en':'bottom of thumb',
  'gu': 'અંગૂઠાની નીચે',
  'hi': 'अंगूठे के नीचे'
},
top_of_index_finger:{
  'en':'top of index finger',
  'gu': 'તર્જની આંગળીની ટોચ',
  'hi': 'तर्जनी का ऊपरी भाग'
},
middle_1_of_index_finger:{
  'en':'middle 1 of index finger',
  'gu': 'તર્જની આંગળીનો મધ્ય ભાગ 1',
  'hi': 'तर्जनी का मध्य भाग 1'
},
middle_2_of_index_finger:{
  'en':'middle 2 of index finger',
  'gu': 'તર્જની આંગળીનો મધ્ય ભાગ 2',
  'hi': 'तर्जनी का मध्य भाग 2'
},
bottom_of_index_finger:{
  'en':'bottom of index finger',
  'gu': 'તર્જની નીચે',
  'hi': 'तर्जनी के नीचे'
},
top_of_middle_finger:{
  'en':'top of middle finger',
  'gu':'મધ્યમ આંગળી ઉપર',
  'hi': 'मध्यम अंगुली का ऊपरी भाग'
},
middle_1_of_middle_finger:{
  'en':'middle 1 of middle finger',
  'gu': 'મધ્યમ આંગળીનું મધ્ય 1',
  'hi': 'मध्यम अंगुली का मध्य 1'
},
middle_2_of_middle_finger:{
  'en':'middle 2 of middle finger',
  'gu': 'મધ્યમ આંગળીનું મધ્ય 2',
  'hi': 'मध्यम अंगुली का मध्य 2'
},
bottom_of_middle_finger:{
  'en':'bottom of middle finger',
  'gu': 'મધ્યમ આંગળીની નીચે',
  'hi': 'मध्यम अंगुली के नीचे'
},
top_of_ring_finger:{
  'en':'top of ring finger',
  'gu': 'રિંગ આંગળીની ટોચ',
  'hi': 'रिंग अंगुली का ऊपरी भाग'
},
middle_1_of_ring_finger:{
  'en':'middle 1 of ring finger',
  'gu': 'રિંગ આંગળીની મધ્ય 1',
  'hi': 'रिंग अंगुली का मध्य 1'
},
middle_2_of_ring_finger:{
  'en':'middle 2 of ring finger',
  'gu': 'રિંગ આંગળીની મધ્ય 2',
  'hi': 'रिंग अंगुली का मध्य 2'
},
bottom_of_ring_finger:{
  'en':'bottom of ring finger',
  'gu': 'રિંગ આંગળીની નીચે',
  'hi': 'रिंग अंगुली के नीचे'
},
top_of_pinky_finger:{
  'en':'top of pinky finger',
  'gu': 'ગુલાબી આંગળીની ટોચ',
  'hi': 'गुलाबी अंगुली का ऊपरी भाग'
},
middle_1_of_pinky_finger:{
  'en':'middle 1 of pinky finger',
  'gu': 'ગુલાબી આંગળીની મધ્ય 1',
  'hi': 'गुलाबी अंगुली का मध्य 1'
},
middle_2_of_pinky_finger:{
  'en':'middle 1 of pinky finger',
  'gu': 'ગુલાબી આંગળીની મધ્ય 1',
  'hi': 'गुलाबी अंगुली का मध्य 1'
},
bottom_of_pinky_finger:{
  'en':'bottom of pinky finger',
  'gu': 'ગુલાબી આંગળીની નીચે',
  'hi': 'गुलाबी अंगुली के नीचे'
},
show:{
  'en':'show',
  'gu': 'બતાવો',
  'hi':'दिखाओ'
},
hide:{
  'en':'hide',
  'gu':'છુપાવો',
  'hi':'छिपाओ'
}

};
 
const AvailableLocales = ['en', 'hi', 'gu',];
var netModel;
var netModel2;
var netModel2Hand;
var blockIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNlNWIyYWE7c3Ryb2tlOiM1OTRhNDI7c3Ryb2tlLXdpZHRoOjAuMTZweDt9LmNscy0xLC5jbHMtMntzdHJva2UtbWl0ZXJsaW1pdDoxMDt9LmNscy0ye2ZpbGw6bm9uZTtzdHJva2U6I2ZmZjIwMDtzdHJva2Utd2lkdGg6MC4zMXB4O30uY2xzLTN7ZmlsbDojZWQyMDI0O308L3N0eWxlPjwvZGVmcz48dGl0bGU+aGFuZCBwb3NlPC90aXRsZT48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik04LjQyLDIxLjI4QzcuMywxOC41LDYsMTcuNDYsNC43OCwxNC4zYTE3LjM4LDE3LjM4LDAsMCwxLS42NS0yLjEzLDEuNjIsMS42MiwwLDAsMSwuMjEtMS44OEEwLjg2LDAuODYsMCwwLDEsNSwxMC4yM2MwLjkxLDAuMjIsMS4zNCwxLjQ4LDEuNSwxLjg0YTI1LjgzLDI1LjgzLDAsMCwwLDQsNi4wNiwxLjE2LDEuMTYsMCwwLDAsMSwuMzQsMS4wOCwxLjA4LDAsMCwwLC4xOS0xYy0wLjI1LTItMS4zLTcuMDYtMS4zMS0xMC40MmExNi4zNSwxNi4zNSwwLDAsMSwuMS0xLjc5LDEuMzksMS4zOSwwLDAsMSwxLjIxLS44N0ExLjQ2LDEuNDYsMCwwLDEsMTIuOTIsNmEzMy44NywzMy44NywwLDAsMCwuNzgsNS40N2MwLjQ2LDIsMS4zMSw0Ljg0LDEuMzEsNC44NGEwLjU4LDAuNTgsMCwwLDAsLjM5LjM0LDAuNDYsMC40NiwwLDAsMCwuMjQtMC4zNEMxNi4xMSwxNC43NiwxNS45MSw4LDE1LjkxLDhBMjYuOTMsMjYuOTMsMCwwLDEsMTYsNC45MWE0LjM5LDQuMzksMCwwLDEsLjMzLTIuMDlsMCwwYTEuNzIsMS43MiwwLDAsMSwxLjI0LTEsMS43NywxLjc3LDAsMCwxLDEuNSwxLjY1bDAsMTEuOTJhMC44NCwwLjg0LDAsMCwwLC41MiwxLDAuNzEsMC43MSwwLDAsMCwuNS0wLjM4bDIuMTQsNy40M2E2My4yMyw2My4yMywwLDAsMCwxLDguMzUsMzYuMDYsMzYuMDYsMCwwLDAsMSw0LjEyLDMzLjQ2LDMzLjQ2LDAsMCwwLDEuNDQsMy43NmwtMTIuMzEtLjEzYy0wLjIzLTEuMjUtLjM4LTIuMjYtMC40OC0yLjk1YTEzLjI3LDEzLjI3LDAsMCwwLS42Ni0zLjE3Yy0wLjIyLS41Ny0wLjQ0LTEtMC41NS0xLjJhNDkuNzcsNDkuNzcsMCwwLDEtMi42Mi03LjgyQzguNDEsMjEuNTksOC43NCwyMi4xLDguNDIsMjEuMjhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAuMDksMTZsNS0xMC42MWExLjcyLDEuNzIsMCwwLDEsMS41NS0xYzAuNTYsMC4xNywxLDEuMjcuNTMsMi42MkwyMy42MywxNy43NGE3LjY3LDcuNjcsMCwwLDAsMCw0LjQxLDEuNiwxLjYsMCwwLDAsLjc3Ljk0YzAuMzMsMC4xNS43NiwwLjE1LDEuODMtLjMzYTE3Ljc4LDE3Ljc4LDAsMCwwLDIuMjEtMS4yN0E4Ljg0LDguODQsMCwwLDEsMzEsMjAuMjhhMy40NCwzLjQ0LDAsMCwxLDIuNjQuMTMsMi45NCwyLjk0LDAsMCwxLDEuMjYsMS43LDE3LDE3LDAsMCwwLTQuNDgsMi44MWMtMC4yNy4yNC0xLjIzLDEuMjMtMy4xNCwzLjE5YTM4LjQsMzguNCwwLDAsMS0yLjc2LDIuNzEsMTIuMjQsMTIuMjQsMCwwLDEtMy4xNCwyYy0wLjMuMTMtLjU1LDAuMjMtMC43MywwLjI5Ii8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTEuMjEsMzAuOTRhNC43Miw0LjcyLDAsMCwwLDIuNTIsMi43NCw0LjI5LDQuMjksMCwwLDAsMS45Mi4zIi8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxMS42OSA1Ljk3IDExLjc1IDguODkgMTEuOTQgMTEuOTkgMTMuMzkgMTkuODQgMTcuMTcgMzAuMzIgOS45MSAyMS4yNyA3LjU3IDE2LjI5IDUuODUgMTMuOTcgNS4xMyAxMS41OSIvPjxwb2x5bGluZSBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMjYuMjEgNS41NiAyNC44NSA4Ljc1IDIzLjU4IDEyLjYgMjAuNzIgMTkuMzIgMTcuMTcgMzAuMzIgMTcuMjkgMTguNzEgMTcuMjQgMTAuMDcgMTcuNDMgNi4xNyAxNy41MiAzLjIxIi8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzMi44MyAyMS4yNSAyOC40MiAyMy41OSAyNS4xOCAyNi40NiAyMSAyOC40OCAxNy4xNyAzMC4zMiIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMzIuNzMiIGN5PSIyMS40IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyOC4zOSIgY3k9IjIzLjcxIiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyNS41MSIgY3k9IjI2LjEyIiByPSIwLjU5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAuMzggMTkuNDMpIHJvdGF0ZSgtMzUuMTIpIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNy4zMiIgY3k9IjMwLjg0IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyNi4zMSIgY3k9IjUuNSIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMjQuOTIiIGN5PSI4LjU1IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyMi45MiIgY3k9IjEzLjgyIiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyMC44OCIgY3k9IjE5LjEiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjE3LjI5IiBjeT0iMTkuMTMiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjEzLjU0IiBjeT0iMjAuMTkiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjkuOTkiIGN5PSIyMS4zOCIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTcuNDciIGN5PSIzLjM2IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxMS42MyIgY3k9IjUuNzciIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjUuMiIgY3k9IjExLjY3IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNy40IiBjeT0iNi41MyIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTcuMyIgY3k9IjEwLjg0IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxMS43NSIgY3k9IjguOTQiIHI9IjAuNTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUzIDE3LjEzKSByb3RhdGUoLTcwLjk4KSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTEuOTIiIGN5PSIxMS45NCIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iNS45NiIgY3k9IjE0LjExIiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSI3LjYxIiBjeT0iMTYuNDIiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjIxLjM4IiBjeT0iMjguNDMiIHI9IjAuNTkiLz48L3N2Zz4=';
var menuIconURI = 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNlNWIyYWE7c3Ryb2tlOiM1OTRhNDI7c3Ryb2tlLXdpZHRoOjAuMTZweDt9LmNscy0xLC5jbHMtMntzdHJva2UtbWl0ZXJsaW1pdDoxMDt9LmNscy0ye2ZpbGw6bm9uZTtzdHJva2U6I2ZmZjIwMDtzdHJva2Utd2lkdGg6MC4zMXB4O30uY2xzLTN7ZmlsbDojZWQyMDI0O308L3N0eWxlPjwvZGVmcz48dGl0bGU+aGFuZCBwb3NlPC90aXRsZT48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik04LjQyLDIxLjI4QzcuMywxOC41LDYsMTcuNDYsNC43OCwxNC4zYTE3LjM4LDE3LjM4LDAsMCwxLS42NS0yLjEzLDEuNjIsMS42MiwwLDAsMSwuMjEtMS44OEEwLjg2LDAuODYsMCwwLDEsNSwxMC4yM2MwLjkxLDAuMjIsMS4zNCwxLjQ4LDEuNSwxLjg0YTI1LjgzLDI1LjgzLDAsMCwwLDQsNi4wNiwxLjE2LDEuMTYsMCwwLDAsMSwuMzQsMS4wOCwxLjA4LDAsMCwwLC4xOS0xYy0wLjI1LTItMS4zLTcuMDYtMS4zMS0xMC40MmExNi4zNSwxNi4zNSwwLDAsMSwuMS0xLjc5LDEuMzksMS4zOSwwLDAsMSwxLjIxLS44N0ExLjQ2LDEuNDYsMCwwLDEsMTIuOTIsNmEzMy44NywzMy44NywwLDAsMCwuNzgsNS40N2MwLjQ2LDIsMS4zMSw0Ljg0LDEuMzEsNC44NGEwLjU4LDAuNTgsMCwwLDAsLjM5LjM0LDAuNDYsMC40NiwwLDAsMCwuMjQtMC4zNEMxNi4xMSwxNC43NiwxNS45MSw4LDE1LjkxLDhBMjYuOTMsMjYuOTMsMCwwLDEsMTYsNC45MWE0LjM5LDQuMzksMCwwLDEsLjMzLTIuMDlsMCwwYTEuNzIsMS43MiwwLDAsMSwxLjI0LTEsMS43NywxLjc3LDAsMCwxLDEuNSwxLjY1bDAsMTEuOTJhMC44NCwwLjg0LDAsMCwwLC41MiwxLDAuNzEsMC43MSwwLDAsMCwuNS0wLjM4bDIuMTQsNy40M2E2My4yMyw2My4yMywwLDAsMCwxLDguMzUsMzYuMDYsMzYuMDYsMCwwLDAsMSw0LjEyLDMzLjQ2LDMzLjQ2LDAsMCwwLDEuNDQsMy43NmwtMTIuMzEtLjEzYy0wLjIzLTEuMjUtLjM4LTIuMjYtMC40OC0yLjk1YTEzLjI3LDEzLjI3LDAsMCwwLS42Ni0zLjE3Yy0wLjIyLS41Ny0wLjQ0LTEtMC41NS0xLjJhNDkuNzcsNDkuNzcsMCwwLDEtMi42Mi03LjgyQzguNDEsMjEuNTksOC43NCwyMi4xLDguNDIsMjEuMjhaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAuMDksMTZsNS0xMC42MWExLjcyLDEuNzIsMCwwLDEsMS41NS0xYzAuNTYsMC4xNywxLDEuMjcuNTMsMi42MkwyMy42MywxNy43NGE3LjY3LDcuNjcsMCwwLDAsMCw0LjQxLDEuNiwxLjYsMCwwLDAsLjc3Ljk0YzAuMzMsMC4xNS43NiwwLjE1LDEuODMtLjMzYTE3Ljc4LDE3Ljc4LDAsMCwwLDIuMjEtMS4yN0E4Ljg0LDguODQsMCwwLDEsMzEsMjAuMjhhMy40NCwzLjQ0LDAsMCwxLDIuNjQuMTMsMi45NCwyLjk0LDAsMCwxLDEuMjYsMS43LDE3LDE3LDAsMCwwLTQuNDgsMi44MWMtMC4yNy4yNC0xLjIzLDEuMjMtMy4xNCwzLjE5YTM4LjQsMzguNCwwLDAsMS0yLjc2LDIuNzEsMTIuMjQsMTIuMjQsMCwwLDEtMy4xNCwyYy0wLjMuMTMtLjU1LDAuMjMtMC43MywwLjI5Ii8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTEuMjEsMzAuOTRhNC43Miw0LjcyLDAsMCwwLDIuNTIsMi43NCw0LjI5LDQuMjksMCwwLDAsMS45Mi4zIi8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxMS42OSA1Ljk3IDExLjc1IDguODkgMTEuOTQgMTEuOTkgMTMuMzkgMTkuODQgMTcuMTcgMzAuMzIgOS45MSAyMS4yNyA3LjU3IDE2LjI5IDUuODUgMTMuOTcgNS4xMyAxMS41OSIvPjxwb2x5bGluZSBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMjYuMjEgNS41NiAyNC44NSA4Ljc1IDIzLjU4IDEyLjYgMjAuNzIgMTkuMzIgMTcuMTcgMzAuMzIgMTcuMjkgMTguNzEgMTcuMjQgMTAuMDcgMTcuNDMgNi4xNyAxNy41MiAzLjIxIi8+PHBvbHlsaW5lIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzMi44MyAyMS4yNSAyOC40MiAyMy41OSAyNS4xOCAyNi40NiAyMSAyOC40OCAxNy4xNyAzMC4zMiIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMzIuNzMiIGN5PSIyMS40IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyOC4zOSIgY3k9IjIzLjcxIiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyNS41MSIgY3k9IjI2LjEyIiByPSIwLjU5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAuMzggMTkuNDMpIHJvdGF0ZSgtMzUuMTIpIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNy4zMiIgY3k9IjMwLjg0IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyNi4zMSIgY3k9IjUuNSIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMjQuOTIiIGN5PSI4LjU1IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyMi45MiIgY3k9IjEzLjgyIiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIyMC44OCIgY3k9IjE5LjEiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjE3LjI5IiBjeT0iMTkuMTMiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjEzLjU0IiBjeT0iMjAuMTkiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjkuOTkiIGN5PSIyMS4zOCIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTcuNDciIGN5PSIzLjM2IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxMS42MyIgY3k9IjUuNzciIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjUuMiIgY3k9IjExLjY3IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxNy40IiBjeT0iNi41MyIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTcuMyIgY3k9IjEwLjg0IiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSIxMS43NSIgY3k9IjguOTQiIHI9IjAuNTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0wLjUzIDE3LjEzKSByb3RhdGUoLTcwLjk4KSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTEuOTIiIGN5PSIxMS45NCIgcj0iMC41OSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iNS45NiIgY3k9IjE0LjExIiByPSIwLjU5Ii8+PGNpcmNsZSBjbGFzcz0iY2xzLTMiIGN4PSI3LjYxIiBjeT0iMTYuNDIiIHI9IjAuNTkiLz48Y2lyY2xlIGNsYXNzPSJjbHMtMyIgY3g9IjIxLjM4IiBjeT0iMjguNDMiIHI9IjAuNTkiLz48L3N2Zz4=';

class posenet {
    constructor(runtime){
        this.runtime = runtime;
        console.log('Using TensorFlow backend: ', tf.getBackend());
    var self = this;
    this.modelLoaded = false;
    this.runtime.emit('MODEL_LOADING');
    this.locale = this.setLocale();
    netModel = new Promise(function (resolve) {
      posenetModel.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: {
          width: 480,
          height: 360
        },
        multiplier: 0.75,
        modelUrl: 'static/models/poseDetection/modelStride16.json'
      }).then(function (net) {
        netModel2 = net;
        console.log(net);
        handPoseModel.load().then(function (netHand) {
          netModel2Hand = netHand;
          runtime.renderer.requestSnapshot(function (data) {
            var image = document.createElement('img');

            image.onload = function () {
              isStage = true;
              stageWidth = image.width;
              stageHeight = image.height;
              netModel2.estimateMultiplePoses(image, {
                flipHorizontal: false
              }).then(function (poses) {
                poseDetected = poses;
                netModel2Hand.estimateHands(image, {
                  flipHorizontal: false
                }).then(function (posesHand) {
                  handDetected = posesHand;
                  self.modelLoaded = true;
                  runtime.emit('MODEL_LOADING_FINISHED', true);
                  resolve('Done');
                  return 'Done';
                });
              });
            };

            image.setAttribute("src", data);
          });
        }).catch(function (err) {
          runtime.emit('MODEL_LOADING_FINISHED', true);
        });
      }).catch(function (err) {
        runtime.emit('MODEL_LOADING_FINISHED', true);
      });
    });
    this.globalVideoState = 'off';
    this.runtime.ioDevices.video.disableVideo();
    this.extensionName = "Human Body Detection";
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
      id: 'posenet',
      name: 'Human Body',
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
            type: ArgumentType.STRING,
            defaultValue: '0'
          }
        }
      }, {
        opcode: 'drawBoundingBox',
        text: Message.drawBoundingBox[this.locale],
        blockType: BlockType.COMMAND,
        arguments: {
          OPTION: {
            type: ArgumentType.NUMBER,
            menu: 'drawBox',
            defaultValue: '1'
          }
        }
      }, {
        message: 'Pose Detection'
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
        opcode: 'getPeopleCount',
        text: Message.getPeopleCount[this.locale],
        blockType: BlockType.REPORTER
      }, {
        opcode: 'getX',
        text: Message.getX[this.locale],
        blockType: BlockType.REPORTER,
        arguments: {
          PERSON: {
            type: ArgumentType.STRING,
            menu: 'personNumbers',
            defaultValue: '1'
          },
          PART: {
            type: ArgumentType.STRING,
            menu: 'parts',
            defaultValue: '0'
          }
        }
      }, {
        opcode: 'getY',
        text: Message.getY[this.locale],
        blockType: BlockType.REPORTER,
        arguments: {
          PERSON: {
            type: ArgumentType.STRING,
            menu: 'personNumbers',
            defaultValue: '1'
          },
          PART: {
            type: ArgumentType.STRING,
            menu: 'parts',
            defaultValue: '0'
          }
        }
      }, {
        opcode: 'isDetected',
        text: Message.isDetected[this.locale],
        blockType: BlockType.BOOLEAN,
        arguments: {
          PERSON: {
            type: ArgumentType.STRING,
            menu: 'personNumbers',
            defaultValue: '1'
          },
          PART: {
            type: ArgumentType.STRING,
            menu: 'parts',
            defaultValue: '0'
          }
        }
      }, {
        message: 'Hand Detection'
      }, {
        opcode: 'analyseImageHand',
        text: Message.analyseImage[this.locale],
        blockType: BlockType.COMMAND
      }, "---", {
        opcode: 'isDetectedHand',
        text: Message.isDetectedHand[this.locale],
        blockType: BlockType.BOOLEAN
      }, {
        opcode: 'getPositionHand',
        text: Message.getPositionHand[this.locale],
        blockType: BlockType.REPORTER,
        arguments: {
          POSITION: {
            type: ArgumentType.NUMBER,
            menu: 'position',
            defaultValue: '1'
          },
          FINGER: {
            type: ArgumentType.NUMBER,
            menu: 'finger',
            defaultValue: '1'
          },
          PART: {
            type: ArgumentType.NUMBER,
            menu: 'partsHand',
            defaultValue: '4'
          }
        }
      }, {
        opcode: 'getPositionNumberHand',
        text: Message.getPositionNumberHand[this.locale],
        blockType: BlockType.REPORTER,
        arguments: {
          POSITION: {
            type: ArgumentType.NUMBER,
            menu: 'position',
            defaultValue: '1'
          },
          PART: {
            type: ArgumentType.NUMBER,
            menu: 'fingerNumber',
            defaultValue: '4'
          }
        }
      }, {
        opcode: 'getHand',
        text: Message.getHand[this.locale],
        blockType: BlockType.REPORTER,
        arguments: {
          POSITION: {
            type: ArgumentType.NUMBER,
            menu: 'handPosition',
            defaultValue: '1'
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
        parts: {
          acceptReporters: true,
          items: [{
            text: Message.nose[this.locale],
            value: '0'
          }, {
            text: Message.left_eye[this.locale],
            value: '1'
          }, {
            text: Message.right_eye[this.locale],
            value: '2'
          }, {
            text: Message.left_ear[this.locale],
            value: '3'
          }, {
            text: Message.right_ear[this.locale],
            value: '4'
          }, {
            text: Message.left_shoulder[this.locale],
            value: '5'
          }, {
            text: Message.right_shoulder[this.locale],
            value: '6'
          }, {
            text: Message.left_elbow[this.locale],
            value: '7'
          }, {
            text: Message.right_elbow[this.locale],
            value: '8'
          }, {
            text: Message.left_wrist[this.locale],
            value: '9'
          }, {
            text: Message.right_wrist[this.locale],
            value: '10'
          }, {
            text: Message.left_heap[this.locale],
            value: '11'
          }, {
            text: Message.right_heap[this.locale],
            value: '12'
          }, {
            text: Message.left_knee[this.locale],
            value: '13'
          }, {
            text: Message.right_knee[this.locale],
            value: '14'
          }, {
            text: Message.left_ankle[this.locale],
            value: '15'
          }, {
            text: Message.right_ankle[this.locale],
            value: '16'
          }]
        },
        feed: {
          items: [{
            text: Message.camera[this.locale],
            value: '1'
          }, {
            text: Message.stage[this.locale],
            value: '2'
          }]
        },
        partsHand: {
          acceptReporters: true,
          items: [{
            text: Message.top[this.locale],
            value: '4'
          }, {
            text: Message.middle1[this.locale],
            value: '3'
          }, {
            text:Message.middle2[this.locale],
            value: '2'
          }, {
            text: Message.bottom[this.locale],
            value: '1'
          }]
        },
        handPosition: {
          items: [{
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
          }]
        },
        position: {
          items: [{
            text: 'x',
            value: '1'
          }, {
            text: 'y',
            value: '2'
          }]
        },
        finger: {
          acceptReporters: true,
          items: [{
            text: Message.thumb[this.locale],
            value: '1'
          }, {
            text: Message.index_finger[this.locale],
            value: '2'
          }, {
            text: Message.middle_finger[this.locale],
            value: '3'
          }, {
            text: Message.ring_finger[this.locale],
            value: '4'
          }, {
            text: Message.pinky_finger[this.locale],
            value: '5'
          }]
        },
        fingerNumber: {
          acceptReporters: true,
          items: [{
            text: Message.top_of_thumb[this.locale],
            value: '4'
          }, {
            text: Message.middle_1_of_thumb[this.locale],
            value: '3'
          }, {
            text: Message.middle_2_of_thumb[this.locale],
            value: '2'
          }, {
            text: Message.bottom_of_thumb[this.locale],
            value: '1'
          }, {
            text: Message.top_of_index_finger[this.locale],
            value: '8'
          }, {
            text: Message.middle_1_of_index_finger[this.locale],
            value: '7'
          }, {
            text: Message.middle_2_of_index_finger[this.locale],
            value: '6'
          }, {
            text: Message.bottom_of_index_finger[this.locale],
            value: '5'
          }, {
            text: Message.top_of_middle_finger[this.locale],
            value: '12'
          }, {
            text: Message.middle_1_of_middle_finger[this.locale],
            value: '11'
          }, {
            text: Message.middle_2_of_middle_finger[this.locale],
            value: '10'
          }, {
            text: Message.bottom_of_middle_finger[this.locale],
            value: '9'
          }, {
            text:  Message.top_of_ring_finger[this.locale],
            value: '16'
          }, {
            text:  Message.middle_1_of_ring_finger[this.locale],
            value: '15'
          }, {
            text:  Message.middle_2_of_ring_finger[this.locale],
            value: '14'
          }, {
            text:  Message.bottom_of_ring_finger[this.locale],
            value: '13'
          }, {
            text:  Message.top_of_pinky_finger[this.locale],
            value: '20'
          }, {
            text:  Message.middle_1_of_pinky_finger[this.locale],
            value: '19'
          }, {
            text: Message.middle_2_of_pinky_finger[this.locale],
            value: '18'
          }, {
            text: Message.bottom_of_pinky_finger[this.locale],
            value: '17'
          }]
        },
        drawBox: [{
          text: Message.show[this.locale],
          value: '1'
        }, {
          text: Message.hide[this.locale],
          value: '2'
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
    var _this = this;

    var self2 = this;
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;

    if (this.modelLoaded) {
      if (args.FEED === '1') {
        isStage = false;
        var translatePromise = new Promise(function (resolve) {
          var frame = _this.runtime.ioDevices.video.getFrame({
            format: Video.FORMAT_IMAGE_DATA,
            dimensions: posenet.DIMENSIONS
          });

          netModel2.estimateMultiplePoses(frame, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.25
          }).then(function (poses) {
            poseDetected = poses;
            console.log(poseDetected);

            if (poseDetected) {
              var index = 0;

              for (var _i = 0; _i < poseDetected.length; _i++) {
                if (poseDetected[_i] > 0.15) {
                  index = _i;
                }
              }

              if (poseDetected.length !== index + 1) {
                poseDetected.splice(index + 1, poseDetected.length - index - 1);
              }
            }

            console.log(poseDetected);

            if (drawOnStage) {
              self2._clearMark();

              for (var _i2 = 0; _i2 < poseDetected.length; _i2++) {
                self2._drawMark(poseDetected[_i2].keypoints, posenet.DIMENSIONS[0], posenet.DIMENSIONS[1], _i2);
              }
            }

            resolve('Done');
            return 'Done';
          }).catch(function (err) {
            poseDetected = [];
            resolve('Camera not ready!');
            return 'Camera not ready!';
          });
        });
        return translatePromise;
      } else if (args.FEED === '2') {
        var _translatePromise = new Promise(function (resolve) {
          _this.runtime.renderer.requestSnapshot(function (data) {
            var image = document.createElement('img');

            image.onload = function () {
              isStage = true;
              stageWidth = image.width;
              stageHeight = image.height;
              netModel2.estimateMultiplePoses(image, {
                flipHorizontal: false
              }).then(function (poses) {
                poseDetected = poses;

                if (poseDetected) {
                  var index = 0;

                  for (var _i3 = 0; _i3 < poseDetected.length; _i3++) {
                    if (poseDetected[_i3] > 0.15) {
                      index = _i3;
                    }
                  }

                  if (poseDetected.length !== index + 1) {
                    poseDetected.splice(index + 1, poseDetected.length - index - 1);
                  }
                }

                console.log(poseDetected);

                if (drawOnStage) {
                  self2._clearMark();

                  for (var _i4 = 0; _i4 < poseDetected.length; _i4++) {
                    self2._drawMark(poseDetected[_i4].keypoints, stageWidth, stageHeight, _i4);
                  }
                }

                resolve('Done');
                return 'Done';
              });
            };

            image.setAttribute("src", data);
          });
        });

        return _translatePromise;
      }
    } else {
      var self = this;
      self.runtime.emit('MODEL_LOADING');
      return new Promise(function (resolve) {
        posenetModel.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: {
            width: 480,
            height: 360
          },
          multiplier: 0.75,
          modelUrl: 'static/models/poseDetection/modelStride16.json'
        }).then(function (net) {
          handPoseModel.load().then(function (netHand) {
            netModel2Hand = netHand;
            self.runtime.emit('MODEL_LOADING_FINISHED', true);
            netModel2 = net;
            self.modelLoaded = true;

            if (args.FEED === '1') {
              isStage = false;
              var frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: posenet.DIMENSIONS
              });
              netModel2.estimateMultiplePoses(frame, {
                flipHorizontal: false
              }).then(function (poses) {
                poseDetected = poses;

                if (poseDetected) {
                  var index = 0;

                  for (var _i5 = 0; _i5 < poseDetected.length; _i5++) {
                    if (poseDetected[_i5] > 0.15) {
                      index = _i5;
                    }
                  }

                  if (poseDetected.length !== index + 1) {
                    poseDetected.splice(index + 1, poseDetected.length - index - 1);
                  }
                }

                console.log(poseDetected);

                if (drawOnStage) {
                  self2._clearMark();

                  for (var _i6 = 0; _i6 < poseDetected.length; _i6++) {
                    self2._drawMark(poseDetected[_i6].keypoints, posenet.DIMENSIONS[0], posenet.DIMENSIONS[1], _i6);
                  }
                }

                resolve('Done');
                return 'Done';
              }).catch(function (err) {
                poseDetected = [];
                resolve('Camera not ready!');
                return 'Camera not ready!';
              });
            } else if (args.FEED === '2') {
              self.runtime.renderer.requestSnapshot(function (data) {
                var image = document.createElement('img');

                image.onload = function () {
                  isStage = true;
                  stageWidth = image.width;
                  stageHeight = image.height;
                  netModel2.estimateMultiplePoses(image, {
                    flipHorizontal: false
                  }).then(function (poses) {
                    poseDetected = poses;

                    if (poseDetected) {
                      var index = 0;

                      for (var _i7 = 0; _i7 < poseDetected.length; _i7++) {
                        if (poseDetected[_i7] > 0.15) {
                          index = _i7;
                        }
                      }

                      if (poseDetected.length !== index + 1) {
                        poseDetected.splice(index + 1, poseDetected.length - index - 1);
                      }
                    }

                    console.log(poseDetected);

                    if (drawOnStage) {
                      self2._clearMark();

                      for (var _i8 = 0; _i8 < poseDetected.length; _i8++) {
                        self2._drawMark(poseDetected[_i8].keypoints, stageWidth, stageHeight, _i8);
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
            self.runtime.emit('MODEL_LOADING_FINISHED', false);
          });
        }).catch(function (err) {
          self.runtime.emit('MODEL_LOADING_FINISHED', false);
        });
      });
    }
  }
  _drawMark(keypoints, width, height, num) {
    var widthScale = 480 / width;
    var heightScale = 360 / height;

    for (var _i9 = 0; _i9 < 17; _i9++) {
      var MakerAttributes1 = {
        color4f: MakerAttributes[num].color4f,
        diameter: 10
      };

      if (keypoints[_i9].score > 0.5) {
        this.runtime.renderer.penPoint(this._penSkinId, MakerAttributes1, keypoints[_i9].position.x * widthScale - width / 2 * widthScale, height / 2 * heightScale - keypoints[_i9].position.y * heightScale);
      }
    }

    ad = posenetModel.getAdjacentKeyPoints(keypoints, 0.5);
    console.log(ad);
    console.log(MakerAttributes);

    for (var _i10 = 0; _i10 < ad.length; _i10++) {
      var _MakerAttributes = {
        color4f: MakerAttributes[num].color4f,
        diameter: 3
      };
      this.runtime.renderer.penLine(this._penSkinId, _MakerAttributes, ad[_i10][0].position.x * widthScale - width / 2 * widthScale, height / 2 * heightScale - ad[_i10][0].position.y * heightScale, ad[_i10][1].position.x * widthScale - width / 2 * widthScale, height / 2 * heightScale - ad[_i10][1].position.y * heightScale);
    }
  }
  _clearMark() {
    this.runtime.renderer.penClear(this._penSkinId);
  }

  getPeopleCount(args, util) {
    return poseDetected.length;
  }
  getX(args, util) {
    if (poseDetected[parseInt(args.PERSON, 10) - 1] && poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)]) {
      if (poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].score > 0.5) {
        if (!isStage) {
          var XPos = poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].position.x - 240;
          return XPos.toFixed(1);
        } else {
          var _XPos = -1 * (240 - poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].position.x * 480 / stageWidth);

          return _XPos.toFixed(1);
        }
      }

      return "NULL";
    } else {
      return "NULL";
    }
  }
  getY(args, util) {
    if (poseDetected[parseInt(args.PERSON, 10) - 1] && poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)]) {
      if (poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].score > 0.5) {
        if (!isStage) {
          var YPos = 180 - poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].position.y;
          return YPos.toFixed(1);
        } else {
          var _YPos = 180 - poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].position.y * 360 / stageHeight;

          return _YPos.toFixed(1);
        }
      }

      return "NULL";
    } else {
      return "NULL";
    }
  }

  isDetected(args, util) {
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;

    if (poseDetected[parseInt(args.PERSON, 10) - 1] && poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)]) {
      if (poseDetected[parseInt(args.PERSON, 10) - 1].keypoints[parseInt(args.PART, 10)].score > 0.5) {
        return true;
      }

      return false;
    } else {
      return false;
    }
  }

  analyseImageHand(args, util) {
    var _this2 = this;

    var self2 = this;
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;

    if (this.modelLoaded) {
      var translatePromise = new Promise(function (resolve) {
        var frame = _this2.runtime.ioDevices.video.getFrame({
          format: Video.FORMAT_IMAGE_DATA,
          dimensions: posenet.DIMENSIONS
        });

        netModel2Hand.estimateHands(frame, {
          flipHorizontal: false
        }).then(function (posesHand) {
          handDetected = posesHand;
          console.log(handDetected);

          if (drawOnStage) {
            self2._clearMarkHand();

            for (var _i11 = 0; _i11 < handDetected.length; _i11++) {
              self2._drawMarkHand(handDetected[_i11], posenet.DIMENSIONS[0], posenet.DIMENSIONS[1], _i11);
            }
          }

          resolve('Done');
          return 'Done';
        }).catch(function (err) {
          handDetected = [];
          resolve('Camera not ready!');
          return 'Camera not ready!';
        });
      });
      return translatePromise;
    } else {
      var self = this;
      self.runtime.emit('MODEL_LOADING');
      return new Promise(function (resolve) {
        posenetModel.load().then(function (net) {
          handPoseModel.load().then(function (netHand) {
            var _this3 = this;

            netModel2Hand = netHand;
            self.runtime.emit('MODEL_LOADING_FINISHED', true);
            netModel2 = net;
            self.modelLoaded = true;
            var translatePromise = new Promise(function (resolve) {
              var frame = _this3.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: posenet.DIMENSIONS
              });

              netModel2Hand.estimateHands(frame, {
                flipHorizontal: false
              }).then(function (posesHand) {
                handDetected = posesHand;

                if (drawOnStage) {
                  self2._clearMarkHand();

                  for (var _i12 = 0; _i12 < handDetected.length; _i12++) {
                    self2._drawMarkHand(handDetected[_i12], posenet.DIMENSIONS[0], posenet.DIMENSIONS[1], _i12);
                  }
                }

                resolve('Done');
                return 'Done';
              }).catch(function (err) {
                handDetected = [];
                resolve('Camera not ready!');
                return 'Camera not ready!';
              });
            });
            return translatePromise;
          }).catch(function (err) {
            self.runtime.emit('MODEL_LOADING_FINISHED', false);
          });
        }).catch(function (err) {
          self.runtime.emit('MODEL_LOADING_FINISHED', false);
        });
      });
    }
  }

  _drawMarkHand(handDetected, width, height, num) {
    var widthScale = 480 / width;
    var heightScale = 360 / height;

    for (var _i13 = 0; _i13 < 21; _i13++) {
      var MakerAttributes1 = {
        color4f: MakerAttributes[num].color4f,
        diameter: 10
      };
      this.runtime.renderer.penPoint(this._penSkinId, MakerAttributes1, handDetected.landmarks[_i13][0] * widthScale - width / 2 * widthScale, height / 2 * heightScale - handDetected.landmarks[_i13][1] * heightScale);
    }

    for (var _i14 = 0; _i14 < 5; _i14++) {
      var _MakerAttributes2 = {
        color4f: MakerAttributes[num].color4f,
        diameter: 3
      };

      for (var j = 0; j < 3; j++) {
        this.runtime.renderer.penLine(this._penSkinId, _MakerAttributes2, handDetected.landmarks[_i14 * 4 + j + 1][0] * widthScale - width / 2 * widthScale, height / 2 * heightScale - handDetected.landmarks[_i14 * 4 + j + 1][1] * heightScale, handDetected.landmarks[_i14 * 4 + j + 2][0] * widthScale - width / 2 * widthScale, height / 2 * heightScale - handDetected.landmarks[_i14 * 4 + j + 2][1] * heightScale);
      }
    }

    for (var _i15 = 0; _i15 < 5; _i15++) {
      var _MakerAttributes3 = {
        color4f: MakerAttributes[num].color4f,
        diameter: 3
      };
      this.runtime.renderer.penLine(this._penSkinId, _MakerAttributes3, handDetected.landmarks[0][0] * widthScale - width / 2 * widthScale, height / 2 * heightScale - handDetected.landmarks[0][1] * heightScale, handDetected.landmarks[_i15 * 4 + 1][0] * widthScale - width / 2 * widthScale, height / 2 * heightScale - handDetected.landmarks[_i15 * 4 + 1][1] * heightScale);
    }
  }
  _clearMarkHand() {
    this.runtime.renderer.penClear(this._penSkinId);
  }
  isDetectedHand(args, util) {
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;

    if (handDetected.length === 0) {
      return false;
    } else {
      return true;
    }
  }
  getPositionHand(args, util) {
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;
    console.log(handDetected);

    if (handDetected.length === 1) {
      if (args.FINGER === '1') {
        if (args.POSITION === '1') {
          var XPos = handDetected[0].annotations.thumb[parseInt(args.PART, 10) - 1][0];
          XPos = XPos - 240;
          return XPos.toFixed(1);
        } else if (args.POSITION === '2') {
          var YPos = handDetected[0].annotations.thumb[parseInt(args.PART, 10) - 1][1];
          YPos = 180 - YPos;
          return YPos.toFixed(1);
        }
      } else if (args.FINGER === '2') {
        if (args.POSITION === '1') {
          var _XPos2 = handDetected[0].annotations.indexFinger[parseInt(args.PART, 10) - 1][0];
          _XPos2 = _XPos2 - 240;
          return _XPos2.toFixed(1);
        } else if (args.POSITION === '2') {
          var _YPos2 = handDetected[0].annotations.indexFinger[parseInt(args.PART, 10) - 1][1];
          _YPos2 = 180 - _YPos2;
          return _YPos2.toFixed(1);
        }
      } else if (args.FINGER === '3') {
        if (args.POSITION === '1') {
          var _XPos3 = handDetected[0].annotations.middleFinger[parseInt(args.PART, 10) - 1][0];
          _XPos3 = _XPos3 - 240;
          return _XPos3.toFixed(1);
        } else if (args.POSITION === '2') {
          var _YPos3 = handDetected[0].annotations.middleFinger[parseInt(args.PART, 10) - 1][1];
          _YPos3 = 180 - _YPos3;
          return _YPos3.toFixed(1);
        }
      } else if (args.FINGER === '4') {
        if (args.POSITION === '1') {
          var _XPos4 = handDetected[0].annotations.ringFinger[parseInt(args.PART, 10) - 1][0];
          _XPos4 = _XPos4 - 240;
          return _XPos4.toFixed(1);
        } else if (args.POSITION === '2') {
          var _YPos4 = handDetected[0].annotations.ringFinger[parseInt(args.PART, 10) - 1][1];
          _YPos4 = 180 - _YPos4;
          return _YPos4.toFixed(1);
        }
      } else if (args.FINGER === '5') {
        if (args.POSITION === '1') {
          var _XPos5 = handDetected[0].annotations.pinky[parseInt(args.PART, 10) - 1][0];
          _XPos5 = _XPos5 - 240;
          return _XPos5.toFixed(1);
        } else if (args.POSITION === '2') {
          var _YPos5 = handDetected[0].annotations.pinky[parseInt(args.PART, 10) - 1][1];
          _YPos5 = 180 - _YPos5;
          return _YPos5.toFixed(1);
        }
      }

      return "NULL";
    } else {
      return "NULL";
    }
  }

  getPositionNumberHand(args, util) {
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;

    if (handDetected.length === 1) {
      if (args.POSITION === '1') {
        var XPos = handDetected[0].landmarks[parseInt(args.PART, 10)][0];
        XPos = XPos - 240;
        return XPos.toFixed(1);
      } else if (args.POSITION === '2') {
        var YPos = handDetected[0].landmarks[parseInt(args.PART, 10)][1];
        YPos = 180 - YPos;
        return YPos.toFixed(1);
      }
    } else {
      return "NULL";
    }
  }

  getHand(args, util) {
    //if (!this.runtime.checkSessionExists(this.extensionName)) return;
console.log("testt");
    if (handDetected.length === 1) {
      if (args.POSITION === '1') {
        var XPos = (handDetected[0].boundingBox.topLeft[0] + handDetected[0].boundingBox.bottomRight[0]) / 2;
        XPos = XPos - 240;
        return XPos.toFixed(1);
      } else if (args.POSITION === '2') {
        var YPos = (handDetected[0].boundingBox.topLeft[1] + handDetected[0].boundingBox.bottomRight[1]) / 2;
        YPos = 180 - YPos;
        return YPos.toFixed(1);
      } else if (args.POSITION === '3') {
        var _YPos6 = handDetected[0].boundingBox.bottomRight[0] - handDetected[0].boundingBox.topLeft[0];

        return _YPos6.toFixed(1);
      } else if (args.POSITION === '4') {
        var _YPos7 = handDetected[0].boundingBox.bottomRight[1] - handDetected[0].boundingBox.topLeft[1];

        return _YPos7.toFixed(1);
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

      for (var _i16 = 0; _i16 < poseDetected.length; _i16++) {
        self2._drawMark(poseDetected[_i16].keypoints, stageWidth, stageHeight, _i16);
      }

      for (var _i17 = 0; _i17 < handDetected.length; _i17++) {
        self2._drawMarkHand(handDetected[_i17], posenet.DIMENSIONS[0], posenet.DIMENSIONS[1], _i17);
      }
    } else {
      drawOnStage = false;

      this._clearMark();
    }
  }

  DIMENSIONS() {
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
module.exports = posenet;

