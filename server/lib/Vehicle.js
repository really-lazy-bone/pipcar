!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Vehicle=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var MojioModel;

  module.exports = MojioModel = (function() {
    MojioModel._resource = 'Schema';

    MojioModel._model = 'Model';

    function MojioModel(json) {
      this._client = null;
      this.validate(json);
    }

    MojioModel.prototype.setField = function(field, value) {
      this[field] = value;
      return this[field];
    };

    MojioModel.prototype.getField = function(field) {
      return this[field];
    };

    MojioModel.prototype.validate = function(json) {
      var field, value, _results;
      _results = [];
      for (field in json) {
        value = json[field];
        _results.push(this.setField(field, value));
      }
      return _results;
    };

    MojioModel.prototype.stringify = function() {
      return JSON.stringify(this, this.replacer);
    };

    MojioModel.prototype.replacer = function(key, value) {
      if (key === "_client" || key === "_schema" || key === "_resource" || key === "_model") {
        return void 0;
      } else {
        return value;
      }
    };

    MojioModel.prototype.query = function(criteria, callback) {
      var property, query_criteria, value;
      if (this._client === null) {
        callback("No authorization set for model, use authorize(), passing in a mojio _client where login() has been called successfully.", null);
        return;
      }
      if (criteria instanceof Object) {
        if (criteria.criteria == null) {
          query_criteria = "";
          for (property in criteria) {
            value = criteria[property];
            query_criteria += "" + property + "=" + value + ";";
          }
          criteria = {
            criteria: query_criteria
          };
        }
        return this._client.request({
          method: 'GET',
          resource: this.resource(),
          parameters: criteria
        }, (function(_this) {
          return function(error, result) {
            return callback(error, _this._client.model(_this.model(), result));
          };
        })(this));
      } else if (typeof criteria === "string") {
        return this._client.request({
          method: 'GET',
          resource: this.resource(),
          parameters: {
            id: criteria
          }
        }, (function(_this) {
          return function(error, result) {
            return callback(error, _this._client.model(_this.model(), result));
          };
        })(this));
      } else {
        return callback("criteria given is not in understood format, string or object.", null);
      }
    };

    MojioModel.prototype.get = function(criteria, callback) {
      return this.query(criteria, callback);
    };

    MojioModel.prototype.create = function(callback) {
      if (this._client === null) {
        callback("No authorization set for model, use authorize(), passing in a mojio _client where login() has been called successfully.", null);
        return;
      }
      return this._client.request({
        method: 'POST',
        resource: this.resource(),
        body: this.stringify()
      }, callback);
    };

    MojioModel.prototype.post = function(callback) {
      return this.create(callback);
    };

    MojioModel.prototype.save = function(callback) {
      if (this._client === null) {
        callback("No authorization set for model, use authorize(), passing in a mojio _client where login() has been called successfully.", null);
        return;
      }
      return this._client.request({
        method: 'PUT',
        resource: this.resource(),
        body: this.stringify(),
        parameters: {
          id: this._id
        }
      }, callback);
    };

    MojioModel.prototype.put = function(callback) {
      return this.save(callback);
    };

    MojioModel.prototype["delete"] = function(callback) {
      return this._client.request({
        method: 'DELETE',
        resource: this.resource(),
        parameters: {
          id: this._id
        }
      }, callback);
    };

    MojioModel.prototype.observe = function(parent, observer_callback, callback, options) {
      if (parent == null) {
        parent = null;
      }
      if ((parent != null)) {
        return this._client.observe(this.resource, parent, observer_callback, callback, options = {});
      } else {
        return this._client.observe(this, null, observer_callback, callback, options);
      }
    };

    MojioModel.prototype.unobserve = function(parent, observer_callback, callback) {
      if (parent == null) {
        parent = null;
      }
      if ((parent != null)) {
        return this._client.unobserve(this.resource, parent, observer_callback, callback);
      } else {
        return this._client.unobserve(this, null, observer_callback, callback);
      }
    };

    MojioModel.prototype.store = function(model, key, value, callback) {
      return this._client.store(model, key, value, callback);
    };

    MojioModel.prototype.storage = function(model, key, callback) {
      return this._client.storage(model, key, callback);
    };

    MojioModel.prototype.unstore = function(model, key, callback) {
      return this._client.unstore(model, key, callback);
    };

    MojioModel.prototype.statistic = function(expression, callback) {
      return callback(null, true);
    };

    MojioModel.prototype.resource = function() {
      return this._resource;
    };

    MojioModel.prototype.model = function() {
      return this._model;
    };

    MojioModel.prototype.schema = function() {
      return this._schema;
    };

    MojioModel.prototype.authorization = function(client) {
      this._client = client;
      return this;
    };

    MojioModel.prototype.id = function() {
      return this._id;
    };

    MojioModel.prototype.mock = function(type, withid) {
      var field, value, _ref;
      if (withid == null) {
        withid = false;
      }
      _ref = this.schema();
      for (field in _ref) {
        value = _ref[field];
        if (field === "Type") {
          this.setField(field, this.model());
        } else if (field === "UserName") {
          this.setField(field, "Tester");
        } else if (field === "Email") {
          this.setField(field, "test@moj.io");
        } else if (field === "Password") {
          this.setField(field, "Password007!");
        } else if (field !== '_id' || withid) {
          switch (value) {
            case "Integer":
              this.setField(field, "0");
              break;
            case "Boolean":
              this.setField(field, false);
              break;
            case "String":
              this.setField(field, "test" + Math.random());
          }
        }
      }
      return this;
    };

    return MojioModel;

  })();

}).call(this);

},{}],2:[function(_dereq_,module,exports){
// Generated by CoffeeScript 1.8.0
(function() {
  var MojioModel, Vehicle,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MojioModel = _dereq_('./MojioModel');

  module.exports = Vehicle = (function(_super) {
    __extends(Vehicle, _super);

    Vehicle.prototype._schema = {
      "Type": "Integer",
      "OwnerId": "String",
      "MojioId": "String",
      "Name": "String",
      "VIN": "String",
      "LicensePlate": "String",
      "IgnitionOn": "Boolean",
      "VehicleTime": "String",
      "LastTripEvent": "String",
      "LastLocationTime": "String",
      "LastLocation": {
        "Lat": "Float",
        "Lng": "Float",
        "FromLockedGPS": "Boolean",
        "Dilution": "Float"
      },
      "LastSpeed": "Float",
      "FuelLevel": "Float",
      "LastAcceleration": "Float",
      "LastAccelerometer": "Object",
      "LastAltitude": "Float",
      "LastBatteryVoltage": "Float",
      "LastDistance": "Float",
      "LastHeading": "Float",
      "LastVirtualOdometer": "Float",
      "LastOdometer": "Float",
      "LastRpm": "Float",
      "LastFuelEfficiency": "Float",
      "CurrentTrip": "String",
      "LastTrip": "String",
      "LastContactTime": "String",
      "MilStatus": "Boolean",
      "DiagnosticCodes": "Object",
      "FaultsDetected": "Boolean",
      "LastLocationTimes": "Array",
      "LastLocations": "Array",
      "LastSpeeds": "Array",
      "LastHeadings": "Array",
      "LastAltitudes": "Array",
      "Viewers": "Array",
      "_id": "String",
      "_deleted": "Boolean"
    };

    Vehicle.prototype._resource = 'Vehicles';

    Vehicle.prototype._model = 'Vehicle';

    function Vehicle(json) {
      Vehicle.__super__.constructor.call(this, json);
    }

    Vehicle._resource = 'Vehicles';

    Vehicle._model = 'Vehicle';

    Vehicle.resource = function() {
      return Vehicle._resource;
    };

    Vehicle.model = function() {
      return Vehicle._model;
    };

    return Vehicle;

  })(MojioModel);

}).call(this);

},{"./MojioModel":1}]},{},[2])
(2)
});