

'use strict';

var express = require('express'),
  app = express(),
  bluemix = require('./config/bluemix'),
  watson = require('watson-developer-cloud'),
  extend = require('util')._extend,
  fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '20mb'}));

 var cors = require('cors');
app.use(cors({credentials: false}));

 var http = require('http').Server(app);
 var io = require('socket.io')(http);

 io.on('connection', function(socket){
    io.emit('disaster', "Hello");
});




// Bootstrap application settings
require('./config/express')(app);


// // if bluemix credentials exists, then override local
// var credentials = extend({
//     version: 'v2',
//     url: '<url>',
//     username: '<username>',
//     password: '<password>'
// }, bluemix.getServiceCreds('personality_insights')); // VCAP_SERVICES
//
// // Create the service wrapper
// var personalityInsights = new watson.personality_insights(credentials);

// render index page
app.get('/', function(req, res) {
  res.send("hahah");
});

app.post('/disaster', function (req, res) {
  var data = req.body;
  console.log(JSON.stringify(data));
  res.sendStatus(200);
});
// app.post('/', function(req, res) {
//   personalityInsights.profile(req.body, function(err, profile) {
//     if (err) {
//       if (err.message){
//         err = { error: err.message };
//       }
//       return res.status(err.code || 500).json(err || 'Error processing the request');
//     }
//     else
//       return res.json(profile);
//   });
// });

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
