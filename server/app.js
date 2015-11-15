'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var DEBUG = true;

var friendlyMessages = {
    IgnitionOn: "Engine on. We are ready to go on adventure!",
    IgnitionOff: "Shutting down.",
    LowBattery: "Warning warning you are low on battery level",
    FenceEntered: "Entering Officer Area. Please be prepared and follow the instruction.",
    FenceExited: "Exiting Officer Area. Now you are free again!",
    MILWarning: "Warning warning car malfunction. Are you sure your car is still working? You might want to stop nearby and check your engine.",
    Accident: "I detected accident happening. Are you OK? Do I need to call 911?",
    TowStart: "Help! I'm being kidnapped.",
    TowStop: "I guess I'll wait here for my master. Waiting waiting ...",
    HardAcceleration: "Woah, that is a hard acceleration. That is very bad for your engine. Don't do it again.",
    HardBrake: "Ah! Very harsh brake. Are you okay? Are you okay? Did you hit anyone?",
    HardRight: "Warning hard right",
    HardLeft: "Warning hard left",
    Speed: "Speeding detected. Make sure there is no police around! Wait ... maybe I can report my master for some reward. Nah, just kidding.",
    Park: "Seems like car has safely parked. It's a nice trip with you.",
    LowFuel: "Hmm ... seems like your fuel level is low. Here are the nearby gas stations."
};

var app = express();
var port = 3000;

var server = require('http').Server(app);

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('A user connected');
    setTimeout(function() {
        socket.emit('message', {message: 'Connected, Hello world'});
    }, 1000);
});

server.listen(port);
console.log('Express started on port ' + port);

// set up connection to mongoDB
mongoose.connect(
	'mongodb://localhost/gophr',
	{
		server: {
			socketOptions: {
				connectTimeoeutMS: 10000,
				keepAlive: 1
			}
		}
	}
);

mongoose.connection.once('open', function() {
	console.info(
		'Connected to MongoDB'
	);
});

mongoose.connection.on('error', function(err) {
	console.error(
		'Error happened in connection to MongoDB',
		{
			error: err
		}
	);
});

// parse json as body
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/message', function(req, res) {
    console.log(req.body);

    res.sendStatus(200);

    io.emit('message', {message: 'Incoming Message: ' + req.body.message});
});

app.post('/mojio/callback', function(req, res) {
    console.log('Getting mojio http post callback');
    console.log(req.body);

    io.emit('status', req.body);
    if (req.body.EventType !== 'TripStatus') {
        io.emit('message', {message: 'Incoming Message: ' + friendlyMessages[req.body.EventType]});
    }
});

app.use(function (req, res, next) {
    console.log(
        'HTTP request %s to url %s',
        req.method,
        req.originalUrl,
        {
            headers: req.headers
        }
    );
    next();
});
