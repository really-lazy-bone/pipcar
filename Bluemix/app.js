/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'),
  app = express(),
  bluemix = require('./config/bluemix'),
  watson = require('watson-developer-cloud'),
  extend = require('util')._extend;

//avoid "request too large" exception
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var tradeOffCredentials = extend({
  version: 'v1',
  username: '<username>',
  password: '<password>'
}, bluemix.getServiceCreds('tradeoff_analytics')); // VCAP_SERVICES

// Create the service wrapper
var tradeoffAnalytics = watson.tradeoff_analytics(tradeOffCredentials);


// if bluemix credentials exists, then override local
var tradeOffCredentials = extend({
  version: 'v1',
  username: '<username>',
  password: '<password>'
}, bluemix.getServiceCreds('text_to_speech')); // VCAP_SERVICES

var textToSpeech = watson.text_to_speech(tradeOffCredentials);


var specialCharactersToWords = {

  "0": " zero ",
  "1": " one ",
  "2": " two ",
  "3": " three ",
  "4": " four ",
  "5": " five ",
  "6": " six ",
  "7": " seven ",
  "8": " eight ",
  "9": " nine ",
  "+": " plus ",
  "-": " minus ",
  "*": " multiply ",
  "%": " divide ",
  ")": " right parenthesis ",
  "(": " left parenthesis ",
  "=": " equals ",
};

//So Watson will pronounce the puncutation
function replaceSpecialCharactersWithEnglish(stringToCheck) {
  var stringToReturn = stringToCheck;


  for (var property in specialCharactersToWords) {

    if (specialCharactersToWords.hasOwnProperty(property)) {

      if (stringToReturn.indexOf(property) >= 0)
        //stringToReturn = stringToReturn.replaceAll(property, specialCharactersToWords[property]);
        stringToReturn = stringToReturn.split(property).join(specialCharactersToWords[property]);
    }


  }

  return stringToReturn;

}

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

//Needed to convert audio for mobile playback, android doesn't like the codex watson returns
app.post('/speech', function (req, res) {

  var speechData = req.body;
  console.log("generate speech mp3");
  console.log("text: " + speechData.text);
  console.log("filename: " + speechData.filename);
  var params = {
    text: replaceSpecialCharactersWithEnglish(speechData.text),
    voice: 'VoiceEnUsMichael', // Optional voice
    accept: 'audio/wav'
  };

  var outputFileName = speechData.filename;

  var reader = text_to_speech.synthesize(params);

  reader.pipe(fs.createWriteStream('./audio/' + outputFileName + '.wav'));
  reader.on('end', function () {


    var input = fs.createReadStream('./audio/' + outputFileName + '.wav');
    var output = fs.createWriteStream('./audio/' + outputFileName + '.mp3');
    // start reading the WAV file from the input
    var wavReader = new wav.Reader();

    // we have to wait for the "format" event before we can start encoding
    wavReader.on('format', onFormat);

    // and start transferring the data
    input.pipe(wavReader);

    function onFormat(format) {
      console.error('WAV format: %j', format);

      // encoding the wave file into an MP3 is as simple as calling pipe()
      var encoder = new lame.Encoder(format);
      wavReader.pipe(encoder).pipe(output);
      wavReader.on('end', function () {

        //res.sendFile(path.join(__dirname, '../audio', outputFileName + '.mp3'));
        // res.download('./audio/' + outputFileName + '.mp3', outputFileName + '.mp3');
        res.sendStatus(200);
      });
    }

  });
});

app.post('/demo/dilemmas/', function(req, res) {
  var params = extend(req.body);
  params.metadata_header = getMetadata(req);

  tradeoffAnalytics.dilemmas(params, function(err, dilemma) {
    if (err)
      return res.status(Number(err.code) || 502).send(err.error || err.message || 'Error processing the request');
    else
      return res.json(dilemma);
  });
});

app.post('/demo/events/', function(req, res) {
  var params = extend(req.body);
  params.metadata_header = getMetadata(req);

  tradeoffAnalytics.events(params, function(err) {
    if (err)
      return res.status(Number(err.code) || 502).send(err.error || err.message || 'Error forwarding events');
    else
      return res.send();
  });
});

function getMetadata(req) {
	var metadata = req.header('x-watson-metadata');
	if (metadata) {
		metadata += "client-ip:" + req.ip;
	}
	return metadata;
}

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
