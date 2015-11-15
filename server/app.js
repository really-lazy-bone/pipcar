'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var friendlyMessages = {
    'IgnitionOn': 'Hello there.',
    'IgnitionOff': 'Good bye',
    'HardBrake': 'Woah, what happened!? Are you okay?',
    'Accident': 'NO! Accident! Are you okay?',
    'HardAcceleration': 'Woah woah woah, slow down.',
    'Speed:': 'Woah woah woah, slow down!',
    'Park': 'You finally found a parking'
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

    io.emit('message', {message: 'w, ' + req.body.message});
});

app.post('/mojio/callback', function(req, res) {
    console.log('Getting mojio http post callback');
    console.log(req.body);

    if (req.body.EventType !== 'TripStatus') {
        io.emit('message', {message: 'w, ' + friendlyMessages[req.body.EventType]});
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
