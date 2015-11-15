'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var friendlyMessages = {
    IgnitionOn: "Engine On",
    IgnitionOff: "Engine Off",
    LowBattery: "warning low battery level",
    FenceEntered: "Entering Officer Area",
    FenceExited: "Exiting Officer Area",
    MILWarning: "Warning car malfunction",
    Accident: "Accident Occured Are you OK?",
    TowStart: "Warning car being towed",
    TowStop: "End car tow",
    HardAcceleration: "Warning drastic speed up",
    HardBrake: "warning hard brake",
    HardRight: "warning hard right",
    HardLeft: "warning hard left",
    Speed: "warning excessive speed",
    Park: "car parked",
    LowFuel: "warning low fuel"
};

var app = express();
var port = 3000;

var server = require('http').Server(app);

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('A user connected');
    setTimeout(function() {
        socket.emit('message', {message: 'w, Hello world'});
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

    io.emit('message', {message: 'Hi, ' + req.body.message});
});

app.post('/mojio/callback', function(req, res) {
    console.log('Getting mojio http post callback');
    console.log(req.body);

    if (req.body.EventType !== 'TripStatus') {
        io.emit('message', {message: 'Hi, ' + friendlyMessages[req.body.EventType]});
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
