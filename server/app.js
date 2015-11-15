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
    HardAcceleration: "Woah, that is a heavy acceleration. Hint hint: this is very bad for your engine.",
    HardBrake: "Very harsh brake. Are you okay? Did you hit anyone?",
    HardRight: "Warning hard right",
    HardLeft: "Warning hard left",
    Speed: "Speeding detected. Make sure there is no police around! Wait ... maybe I can report my master for some reward. Nah, just kidding.",
    Park: "Seems like car has safely parked. It's a nice trip with you.",
    LowFuel: "Hmm ... seems like your fuel level is low. Here are the nearby gas stations."
};
var simulateJson = [
    {
        "EventType": "MovementStart",
        "Location": {
            "Lat": 34.05623,
            "Lng": -118.24961
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
        "Odometer": 0.012,
        "RPM": 507,
        "Speed": 33,
        "_viewStatus": "c",
        "$$hashKey": "object:784"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.056360000000005,
            "Lng": -118.24981000000001
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
        "FuelLevel": 79.9,
        "Heading": -51.883561051374784,
        "Odometer": 0.023,
        "RPM": 832,
        "Speed": 79,
        "_viewStatus": "c",
        "$$hashKey": "object:785"
    },
    {
        "EventType": "HeadingChange",
        "Location": {
            "Lat": 34.056360000000005,
            "Lng": -118.24981000000001
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
        "FuelLevel": 79.7,
        "Heading": 0,
        "Odometer": 0.012022999999999999,
        "RPM": 523,
        "Speed": 50,
        "_viewStatus": "c",
        "$$hashKey": "object:786"
    },
    {
        "EventType": "Acceleration",
        "Location": {
            "Lat": 34.05642,
            "Lng": -118.24990000000001
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
        "Heading": -51.17704127923162,
        "Odometer": 0.025023,
        "RPM": 449,
        "Speed": 66,
        "_viewStatus": "c",
        "$$hashKey": "object:787"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05632,
            "Lng": -118.25001
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
        "Heading": -137.65593907019786,
        "Odometer": 0.037023,
        "RPM": 437,
        "Speed": 78,
        "_viewStatus": "c",
        "$$hashKey": "object:788"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.056140000000006,
            "Lng": -118.25019
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
        "FuelLevel": 79.3,
        "Heading": -140.35859605391215,
        "Odometer": 0.050023000000000005,
        "RPM": 524,
        "Speed": 80,
        "_viewStatus": "c",
        "$$hashKey": "object:789"
    },
    {
        "EventType": "LowBattery",
        "Location": {
            "Lat": 34.055960000000006,
            "Lng": -118.25035000000001
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
        "Heading": -143.6306985507594,
        "Odometer": 0.062023,
        "RPM": 983,
        "Speed": 86,
        "_viewStatus": "c",
        "$$hashKey": "object:790"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05574,
            "Lng": -118.25055
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
        "FuelLevel": 79,
        "Heading": -143.01381207445922,
        "Odometer": 0.07502299999999999,
        "RPM": 1148,
        "Speed": 32,
        "_viewStatus": "c",
        "$$hashKey": "object:791"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05565,
            "Lng": -118.25065000000001
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
        "FuelLevel": 78.8,
        "Heading": -137.36890146613916,
        "Odometer": 0.08702299999999999,
        "RPM": 885,
        "Speed": 52,
        "_viewStatus": "c",
        "$$hashKey": "object:792"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055580000000006,
            "Lng": -118.25072000000002
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
        "FuelLevel": 78.7,
        "Heading": -140.3584226278258,
        "Odometer": 0.100023,
        "RPM": 1016,
        "Speed": 59,
        "_viewStatus": "c",
        "$$hashKey": "object:793"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055550000000004,
            "Lng": -118.25077
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
        "FuelLevel": 78.5,
        "Heading": -125.91222372698445,
        "Odometer": 0.112023,
        "RPM": 759,
        "Speed": 71,
        "_viewStatus": "c",
        "$$hashKey": "object:794"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055510000000005,
            "Lng": -118.25082
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
        "FuelLevel": 78.4,
        "Heading": -133.99753327562496,
        "Odometer": 0.124023,
        "RPM": 438,
        "Speed": 53,
        "_viewStatus": "c",
        "$$hashKey": "object:795"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055440000000004,
            "Lng": -118.25091
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
        "FuelLevel": 78.2,
        "Heading": -133.19146510152564,
        "Odometer": 0.137023,
        "RPM": 1054,
        "Speed": 85,
        "_viewStatus": "c",
        "$$hashKey": "object:796"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05539,
            "Lng": -118.25101000000001
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
        "FuelLevel": 78.1,
        "Heading": -121.11107764128633,
        "Odometer": 0.149023,
        "RPM": 554,
        "Speed": 51,
        "_viewStatus": "c",
        "$$hashKey": "object:797"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05536,
            "Lng": -118.25109
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
        "Heading": -114.3527694216607,
        "Odometer": 0.162023,
        "RPM": 333,
        "Speed": 83,
        "_viewStatus": "c",
        "$$hashKey": "object:798"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05534,
            "Lng": -118.25118
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
        "FuelLevel": 77.8,
        "Heading": -105.01462871256956,
        "Odometer": 0.17402299999999998,
        "RPM": 751,
        "Speed": 46,
        "_viewStatus": "c",
        "$$hashKey": "object:799"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05532,
            "Lng": -118.25124000000001
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
        "FuelLevel": 77.6,
        "Heading": -111.91662748619024,
        "Odometer": 0.187023,
        "RPM": 665,
        "Speed": 66,
        "_viewStatus": "c",
        "$$hashKey": "object:800"
    },
    {
        "EventType": "HardAcceleration",
        "Location": {
            "Lat": 34.0553,
            "Lng": -118.25132
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
        "FuelLevel": 77.5,
        "Heading": -106.79122424258361,
        "Odometer": 0.199023,
        "RPM": 1135,
        "Speed": 84,
        "_viewStatus": "c",
        "$$hashKey": "object:801"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05529,
            "Lng": -118.25139000000001
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
        "Heading": -99.7832432352559,
        "Odometer": 0.212023,
        "RPM": 1136,
        "Speed": 65,
        "_viewStatus": "c",
        "$$hashKey": "object:802"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055240000000005,
            "Lng": -118.25162
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
        "FuelLevel": 77.2,
        "Heading": -104.70245715820732,
        "Odometer": 0.224023,
        "RPM": 342,
        "Speed": 36,
        "_viewStatus": "c",
        "$$hashKey": "object:803"
    },
    {
        "EventType": "HeadingChange",
        "Location": {
            "Lat": 34.055240000000005,
            "Lng": -118.25162
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
        "FuelLevel": 77.1,
        "Heading": 0,
        "Odometer": 0.022247,
        "RPM": 384,
        "Speed": 71,
        "_viewStatus": "c",
        "$$hashKey": "object:804"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055150000000005,
            "Lng": -118.25232000000001
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
        "FuelLevel": 76.9,
        "Heading": -98.82094777760204,
        "Odometer": 0.043247,
        "RPM": 947,
        "Speed": 85,
        "_viewStatus": "c",
        "$$hashKey": "object:805"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055130000000005,
            "Lng": -118.25244
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
        "FuelLevel": 76.8,
        "Heading": -101.37417697851242,
        "Odometer": 0.065247,
        "RPM": 1136,
        "Speed": 45,
        "_viewStatus": "c",
        "$$hashKey": "object:806"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055110000000006,
            "Lng": -118.25254000000001
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
        "FuelLevel": 76.6,
        "Heading": -103.57154519773593,
        "Odometer": 0.087247,
        "RPM": 575,
        "Speed": 51,
        "_viewStatus": "c",
        "$$hashKey": "object:807"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05509,
            "Lng": -118.25264000000001
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
        "FuelLevel": 76.5,
        "Heading": -103.57154212661516,
        "Odometer": 0.108247,
        "RPM": 1152,
        "Speed": 81,
        "_viewStatus": "c",
        "$$hashKey": "object:808"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.055060000000005,
            "Lng": -118.25274
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
        "FuelLevel": 76.3,
        "Heading": -109.90531003738698,
        "Odometer": 0.130247,
        "RPM": 574,
        "Speed": 30,
        "_viewStatus": "c",
        "$$hashKey": "object:809"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05501,
            "Lng": -118.25283
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
        "FuelLevel": 76.2,
        "Heading": -123.84403471713188,
        "Odometer": 0.15224700000000002,
        "RPM": 1031,
        "Speed": 52,
        "_viewStatus": "c",
        "$$hashKey": "object:810"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05492,
            "Lng": -118.25299000000001
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
        "FuelLevel": 76,
        "Heading": -124.17399811527855,
        "Odometer": 0.173247,
        "RPM": 723,
        "Speed": 78,
        "_viewStatus": "c",
        "$$hashKey": "object:811"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05487,
            "Lng": -118.25306
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
        "FuelLevel": 75.9,
        "Heading": -130.76597949867516,
        "Odometer": 0.195247,
        "RPM": 594,
        "Speed": 79,
        "_viewStatus": "c",
        "$$hashKey": "object:812"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.054840000000006,
            "Lng": -118.2531
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
        "Heading": -132.15290913191564,
        "Odometer": 0.21624700000000002,
        "RPM": 904,
        "Speed": 52,
        "_viewStatus": "c",
        "$$hashKey": "object:813"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.054790000000004,
            "Lng": -118.25315
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
        "FuelLevel": 75.6,
        "Heading": -140.35816258401331,
        "Odometer": 0.23824700000000001,
        "RPM": 588,
        "Speed": 87,
        "_viewStatus": "c",
        "$$hashKey": "object:814"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05474,
            "Lng": -118.2532
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
        "FuelLevel": 75.4,
        "Heading": -140.35814598478566,
        "Odometer": 0.260247,
        "RPM": 359,
        "Speed": 36,
        "_viewStatus": "c",
        "$$hashKey": "object:815"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.054610000000004,
            "Lng": -118.25333
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
        "Heading": -140.35809369344497,
        "Odometer": 0.281247,
        "RPM": 573,
        "Speed": 47,
        "_viewStatus": "c",
        "$$hashKey": "object:816"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05447,
            "Lng": -118.25345000000002
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
        "FuelLevel": 75.1,
        "Heading": -144.61961308400123,
        "Odometer": 0.303247,
        "RPM": 1008,
        "Speed": 34,
        "_viewStatus": "c",
        "$$hashKey": "object:817"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.054280000000006,
            "Lng": -118.25359
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
        "FuelLevel": 75,
        "Heading": -148.5967936368205,
        "Odometer": 0.325247,
        "RPM": 734,
        "Speed": 78,
        "_viewStatus": "c",
        "$$hashKey": "object:818"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05427,
            "Lng": -118.2536
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
        "Heading": -140.35799461104324,
        "Odometer": 0.346247,
        "RPM": 467,
        "Speed": 85,
        "_viewStatus": "c",
        "$$hashKey": "object:819"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05418,
            "Lng": -118.25364
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
        "FuelLevel": 74.7,
        "Heading": -159.78498174395247,
        "Odometer": 0.368247,
        "RPM": 387,
        "Speed": 74,
        "_viewStatus": "c",
        "$$hashKey": "object:820"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05413,
            "Lng": -118.25369
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
        "FuelLevel": 74.6,
        "Heading": -140.35794343109615,
        "Odometer": 0.390247,
        "RPM": 695,
        "Speed": 30,
        "_viewStatus": "c",
        "$$hashKey": "object:821"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05382,
            "Lng": -118.25398000000001
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
        "FuelLevel": 74.4,
        "Heading": -142.22215350567973,
        "Odometer": 0.41124700000000003,
        "RPM": 325,
        "Speed": 86,
        "_viewStatus": "c",
        "$$hashKey": "object:822"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05335,
            "Lng": -118.25442000000001
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
        "Heading": -142.2016355899749,
        "Odometer": 0.433247,
        "RPM": 441,
        "Speed": 75,
        "_viewStatus": "c",
        "$$hashKey": "object:823"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.053140000000006,
            "Lng": -118.25462
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
        "FuelLevel": 74.1,
        "Heading": -141.72423214588076,
        "Odometer": 0.455247,
        "RPM": 385,
        "Speed": 82,
        "_viewStatus": "c",
        "$$hashKey": "object:824"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05313,
            "Lng": -118.25463
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
        "FuelLevel": 74,
        "Heading": -140.3576159201475,
        "Odometer": 0.47624700000000003,
        "RPM": 993,
        "Speed": 62,
        "_viewStatus": "c",
        "$$hashKey": "object:825"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05312,
            "Lng": -118.25464000000001
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
        "FuelLevel": 73.8,
        "Heading": -140.357612662448,
        "Odometer": 0.498247,
        "RPM": 883,
        "Speed": 77,
        "_viewStatus": "c",
        "$$hashKey": "object:826"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.053110000000004,
            "Lng": -118.25464000000001
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
        "FuelLevel": 73.7,
        "Heading": -180,
        "Odometer": 0.5202469999999999,
        "RPM": 1062,
        "Speed": 44,
        "_viewStatus": "c",
        "$$hashKey": "object:827"
    },
    {
        "EventType": "Acceleration",
        "Location": {
            "Lat": 34.053000000000004,
            "Lng": -118.25476
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
        "FuelLevel": 73.5,
        "Heading": -137.8914502285237,
        "Odometer": 0.5412469999999999,
        "RPM": 1037,
        "Speed": 57,
        "_viewStatus": "c",
        "$$hashKey": "object:828"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05299,
            "Lng": -118.25476
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
        "Heading": -180,
        "Odometer": 0.5632469999999999,
        "RPM": 503,
        "Speed": 55,
        "_viewStatus": "c",
        "$$hashKey": "object:829"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05299,
            "Lng": -118.25477000000001
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
        "FuelLevel": 73.2,
        "Heading": -89.9999972066446,
        "Odometer": 0.584247,
        "RPM": 838,
        "Speed": 34,
        "_viewStatus": "c",
        "$$hashKey": "object:830"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05292,
            "Lng": -118.25483000000001
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
        "FuelLevel": 73.1,
        "Heading": -144.61912416019726,
        "Odometer": 0.606247,
        "RPM": 1009,
        "Speed": 31,
        "_viewStatus": "c",
        "$$hashKey": "object:831"
    },
    {
        "EventType": "HardBrake",
        "Location": {
            "Lat": 34.05292,
            "Lng": -118.25484000000002
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
        "FuelLevel": 72.9,
        "Heading": -89.99999720664687,
        "Odometer": 0.628247,
        "RPM": 318,
        "Speed": 64,
        "_viewStatus": "c",
        "$$hashKey": "object:832"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.052870000000006,
            "Lng": -118.25488000000001
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
        "FuelLevel": 72.8,
        "Heading": -146.4629034668543,
        "Odometer": 0.6492469999999999,
        "RPM": 1126,
        "Speed": 38,
        "_viewStatus": "c",
        "$$hashKey": "object:833"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05286,
            "Lng": -118.25489
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
        "Heading": -140.35752633327365,
        "Odometer": 0.6712469999999999,
        "RPM": 662,
        "Speed": 54,
        "_viewStatus": "c",
        "$$hashKey": "object:834"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.052800000000005,
            "Lng": -118.25495000000001
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
        "FuelLevel": 72.5,
        "Heading": -140.35750067106937,
        "Odometer": 0.693247,
        "RPM": 386,
        "Speed": 31,
        "_viewStatus": "c",
        "$$hashKey": "object:835"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05265,
            "Lng": -118.25508
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
        "FuelLevel": 72.4,
        "Heading": -144.3196146656045,
        "Odometer": 0.714247,
        "RPM": 829,
        "Speed": 85,
        "_viewStatus": "c",
        "$$hashKey": "object:836"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05225,
            "Lng": -118.25546000000001
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
        "FuelLevel": 72.2,
        "Heading": -141.7936433124063,
        "Odometer": 0.736247,
        "RPM": 458,
        "Speed": 65,
        "_viewStatus": "c",
        "$$hashKey": "object:837"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05212,
            "Lng": -118.25559000000001
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
        "FuelLevel": 72.1,
        "Heading": -140.35726692692117,
        "Odometer": 0.758247,
        "RPM": 541,
        "Speed": 71,
        "_viewStatus": "c",
        "$$hashKey": "object:838"
    },
    {
        "EventType": "TripStatus",
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
        "FuelLevel": 71.9,
        "Heading": -141.4567716360637,
        "Odometer": 0.7792469999999999,
        "RPM": 311,
        "Speed": 55,
        "_viewStatus": "c",
        "$$hashKey": "object:839"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.051260000000006,
            "Lng": -118.25641000000002
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
        "FuelLevel": 71.8,
        "Heading": -142.0528787600266,
        "Odometer": 0.8012469999999999,
        "RPM": 915,
        "Speed": 85,
        "_viewStatus": "c",
        "$$hashKey": "object:840"
    },
    {
        "EventType": "TripStatus",
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
        "FuelLevel": 71.6,
        "Heading": -140.35697391334816,
        "Odometer": 0.823247,
        "RPM": 612,
        "Speed": 50,
        "_viewStatus": "c",
        "$$hashKey": "object:841"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.051140000000004,
            "Lng": -118.25653000000001
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
        "Heading": -140.35694837943947,
        "Odometer": 0.844247,
        "RPM": 1109,
        "Speed": 38,
        "_viewStatus": "c",
        "$$hashKey": "object:842"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.051010000000005,
            "Lng": -118.25666000000001
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
        "FuelLevel": 71.3,
        "Heading": -140.3568983711757,
        "Odometer": 0.866247,
        "RPM": 1106,
        "Speed": 72,
        "_viewStatus": "c",
        "$$hashKey": "object:843"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.050920000000005,
            "Lng": -118.25675000000001
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
        "FuelLevel": 71.2,
        "Heading": -140.35687305322028,
        "Odometer": 0.887247,
        "RPM": 1137,
        "Speed": 33,
        "_viewStatus": "c",
        "$$hashKey": "object:844"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05066,
            "Lng": -118.25698000000001
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
        "FuelLevel": 71,
        "Heading": -143.76073336261106,
        "Odometer": 0.9092469999999999,
        "RPM": 1136,
        "Speed": 36,
        "_viewStatus": "c",
        "$$hashKey": "object:845"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.05013,
            "Lng": -118.25744000000002
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
        "Heading": -144.27939725227696,
        "Odometer": 0.9312469999999999,
        "RPM": 1148,
        "Speed": 39,
        "_viewStatus": "c",
        "$$hashKey": "object:846"
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
        "FuelLevel": 70.7,
        "Heading": -142.59053226396577,
        "Odometer": 0.952247,
        "RPM": 1150,
        "Speed": 55,
        "_viewStatus": "c",
        "$$hashKey": "object:847"
    },
    {
        "EventType": "TripStatus",
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
        "FuelLevel": 70.6,
        "Heading": -143.90310889549806,
        "Odometer": 0.974247,
        "RPM": 635,
        "Speed": 86,
        "_viewStatus": "c",
        "$$hashKey": "object:848"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.048770000000005,
            "Lng": -118.25868000000001
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
        "FuelLevel": 70.4,
        "Heading": -142.8252935683841,
        "Odometer": 0.996247,
        "RPM": 1189,
        "Speed": 72,
        "_viewStatus": "c",
        "$$hashKey": "object:849"
    },
    {
        "EventType": "TripStatus",
        "Location": {
            "Lat": 34.048680000000004,
            "Lng": -118.25877000000001
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
        "FuelLevel": 70.3,
        "Heading": -140.35612938117094,
        "Odometer": 1.017247,
        "RPM": 419,
        "Speed": 40,
        "_viewStatus": "c",
        "$$hashKey": "object:850"
    },
    {
        "EventType": "FenceEntered",
        "Location": {
            "Lat": 34.048460000000006,
            "Lng": -118.25897
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
        "FuelLevel": 70.1,
        "Heading": -143.01144764244634,
        "Odometer": 1.039247,
        "RPM": 891,
        "Speed": 54,
        "_viewStatus": "c",
        "$$hashKey": "object:851"
    }
];

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
    if (friendlyMessages[req.body.EventType]) {
        io.emit('message', {message: 'Incoming Message: ' + friendlyMessages[req.body.EventType]});
    }
});

app.post('/mojio/simulate', function(req, res) {
    console.log('Simulating moves');

    res.sendStatus(200);

    var index = 0;

    broadCastNextMove();

    function broadCastNextMove () {
        console.log('Broad casting move ' + index);
        if (index < simulateJson.length) {
            io.emit('status', simulateJson[index]);
            if (friendlyMessages[simulateJson[index].EventType]) {
                io.emit('message', {message: 'Incoming Message: ' + friendlyMessages[simulateJson[index].EventType]});
            }
            index ++;
            setTimeout(broadCastNextMove, 250);
        } else {
            console.log('Simulation ends. Starting emergency mode. WARNING WARNING');
            io.emit('emergency', true);
        }
    }
});

app.post('/twilio/send', function(req, res) {
    var client = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_ACCOUNT_SECRET);

    var recipients = [];

    recipients.forEach(function() {
        client.sendMessage({
            from: '+16262380913',
            to: recipient,
            body: 'There has been an accident in my area but I am ok. I am at http://maps.google.com/maps?q=' + req.body.lat + ',' + req.body.long,
        }, function(err, res) {
        });
    });
})

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
