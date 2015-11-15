'use strict';

/*
 * Express Dependencies
 */
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var DEBUG = true;

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
        socket.emit('message', {message: 'Connected, Hello world'});

        if (DEBUG) {
            var predefinedMoves = [{
                "EventType": "IgnitionOn",
                "Location": {
                    "Lat": 34.04945,
                    "Lng": -118.25290000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": "",
                "Heading": "",
                "Odometer": 0,
                "RPM": "",
                "Speed": "",
                "_viewStatus": "c",
                "$$hashKey": "object:3412"
            },
            {
                "EventType": "MovementStart",
                "Location": {
                    "Lat": 34.04945,
                    "Lng": -118.25290000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 80,
                "Heading": "",
                "Odometer": 0.003,
                "RPM": 1046,
                "Speed": 74,
                "_viewStatus": "c",
                "$$hashKey": "object:3413"
            },
            {
                "EventType": "HeadingChange",
                "Location": {
                    "Lat": 34.04948,
                    "Lng": -118.25286000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 79.6,
                "Heading": 0,
                "Odometer": 0.047005000000000005,
                "RPM": 1056,
                "Speed": 85,
                "_viewStatus": "c",
                "$$hashKey": "object:3414"
            },
            {
                "EventType": "LowBattery",
                "Location": {
                    "Lat": 34.050200000000004,
                    "Lng": -118.25391
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 79.4,
                "Heading": -50.388318254902345,
                "Odometer": 0.09400499999999999,
                "RPM": 633,
                "Speed": 30,
                "_viewStatus": "c",
                "$$hashKey": "object:3415"
            },
            {
                "EventType": "LowBattery",
                "Location": {
                    "Lat": 34.050520000000006,
                    "Lng": -118.25444000000002
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 79.1,
                "Heading": -53.91847276894612,
                "Odometer": 0.141005,
                "RPM": 1131,
                "Speed": 68,
                "_viewStatus": "c",
                "$$hashKey": "object:3416"
            },
            {
                "EventType": "HeadingChange",
                "Location": {
                    "Lat": 34.05158,
                    "Lng": -118.25607000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 77.9,
                "Heading": 0,
                "Odometer": 0.0013820000000000002,
                "RPM": 666,
                "Speed": 89,
                "_viewStatus": "c",
                "$$hashKey": "object:3417"
            },
            {
                "EventType": "HeadingChange",
                "Location": {
                    "Lat": 34.0516,
                    "Lng": -118.25609000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 77.4,
                "Heading": 0,
                "Odometer": 0.031384,
                "RPM": 408,
                "Speed": 42,
                "_viewStatus": "c",
                "$$hashKey": "object:3418"
            },
            {
                "EventType": "Acceleration",
                "Location": {
                    "Lat": 34.051210000000005,
                    "Lng": -118.25646
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 77,
                "Heading": -140.35697391334816,
                "Odometer": 0.094384,
                "RPM": 1095,
                "Speed": 45,
                "_viewStatus": "c",
                "$$hashKey": "object:3419"
            },
            {
                "EventType": "TripStatus",
                "Location": {
                    "Lat": 34.04961,
                    "Lng": -118.25792000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 75.7,
                "Heading": -142.59053226396577,
                "Odometer": 0.281384,
                "RPM": 314,
                "Speed": 89,
                "_viewStatus": "c",
                "$$hashKey": "object:3420"
            },
            {
                "EventType": "HeadingChange",
                "Location": {
                    "Lat": 34.04936,
                    "Lng": -118.25814000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 75.3,
                "Heading": 0,
                "Odometer": 0.001696,
                "RPM": 901,
                "Speed": 40,
                "_viewStatus": "c",
                "$$hashKey": "object:3421"
            },
            {
                "EventType": "HeadingChange",
                "Location": {
                    "Lat": 34.04937,
                    "Lng": -118.25816
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 74.9,
                "Heading": 0,
                "Odometer": 0.023698,
                "RPM": 1074,
                "Speed": 73,
                "_viewStatus": "c",
                "$$hashKey": "object:3422"
            },
            {
                "EventType": "Deceleration",
                "Location": {
                    "Lat": 34.050430000000006,
                    "Lng": -118.25983000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 74.3,
                "Heading": -52.682542074130765,
                "Odometer": 0.09369799999999999,
                "RPM": 659,
                "Speed": 59,
                "_viewStatus": "c",
                "$$hashKey": "object:3423"
            },
            {
                "EventType": "LowBattery",
                "Location": {
                    "Lat": 34.051100000000005,
                    "Lng": -118.26087000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 73.4,
                "Heading": -51.17880762877439,
                "Odometer": 0.186698,
                "RPM": 798,
                "Speed": 32,
                "_viewStatus": "c",
                "$$hashKey": "object:3424"
            },
            {
                "EventType": "Deceleration",
                "Location": {
                    "Lat": 34.051210000000005,
                    "Lng": -118.26104000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 72.6,
                "Heading": -58.89014333999182,
                "Odometer": 0.279698,
                "RPM": 1180,
                "Speed": 81,
                "_viewStatus": "c",
                "$$hashKey": "object:3425"
            },
            {
                "EventType": "TripStatus",
                "Location": {
                    "Lat": 34.051410000000004,
                    "Lng": -118.26135000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 71.5,
                "Heading": -55.40652323214795,
                "Odometer": 0.395698,
                "RPM": 965,
                "Speed": 86,
                "_viewStatus": "c",
                "$$hashKey": "object:3426"
            },
            {
                "EventType": "HeadingChange",
                "Location": {
                    "Lat": 34.05174,
                    "Lng": -118.26201
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 70.9,
                "Heading": 0,
                "Odometer": 0.05414,
                "RPM": 451,
                "Speed": 82,
                "_viewStatus": "c",
                "$$hashKey": "object:3427"
            },
            {
                "EventType": "MovementStop",
                "Location": {
                    "Lat": 34.05342,
                    "Lng": -118.26092000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": 70.2,
                "Heading": 29.54799274434413,
                "Odometer": 0.21414,
                "RPM": 1183,
                "Speed": 49,
                "_viewStatus": "c",
                "$$hashKey": "object:3428"
            },
            {
                "EventType": "IgnitionOff",
                "Location": {
                    "Lat": 34.05342,
                    "Lng": -118.26092000000001
                },
                "Accelerometer": {
                    "X": "",
                    "Y": "",
                    "Z": ""
                },
                "BatteryVoltage": "",
                "ConnectionLost": "",
                "Altitude": "",
                "Acceleration": "",
                "Deceleration": "",
                "Distance": "",
                "FuelEfficiency": "",
                "FuelLevel": "",
                "Heading": "",
                "Odometer": 1.353,
                "RPM": "",
                "Speed": "",
                "_viewStatus": "c",
                "$$hashKey": "object:3429"
            }];

            for (var i = 0; i < predefinedMoves.length; i ++ ) {
                io.emit('status', predefinedMoves[i]);
                if (predefinedMoves[i].EventType !== 'TripStatus') {
                    io.emit('message', {message: 'Incoming Message: ' + friendlyMessages[predefinedMoves[i].EventType]});
                }
            }
        }
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
