'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

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

var Mojio, mojio, config;

config = {
    application: process.env.MOJIO_APLICATION_KEY,
    secret: process.env.MOJIO_SECRET_KEY,
    hostname: 'api.moj.io',
    version: 'v1',
    port: '443',
    scheme: 'https'
};

Mojio = require('./lib/MojioClient.js');

mojio = new Mojio(config);

mojio.login(process.env.MOJIO_USERNAME, process.env.MOJIO_PASSWORD, function(error, result) {
    if (error) {
        return console.log("error: " + error);
    } else {
        return console.log("success:" + result);
    }
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

app.get('/mojio/callback', function(req, res) {
    res.render('')
});
