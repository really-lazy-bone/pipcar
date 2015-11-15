var SERVER_URL = 'http://107.170.112.209:3000';

var socket = io.connect(SERVER_URL);

angular.module('pipcar', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.run(function($cordovaToast) {
  socket.on('connect', function(socket) {
    document.addEventListener('deviceready', function() {
      $cordovaToast.showShortBottom('connected to server via socket io');
    });
  });
})

.controller('HomeCtrl', function($cordovaGeolocation) {
  var vm = this;

  vm.messageQueue = [];
  vm.speaking = false;

  initMap();

  function initMap () {
    var map = L.map('map').setView([34.0488827, -118.2585095], 14);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      minZoom: 13,
      maxZoom: 18,
      id: 'rcliao.cigfua5ev854ztdm6xuj8jj1g',
      accessToken: 'pk.eyJ1IjoicmNsaWFvIiwiYSI6ImNpZ2Z1YTZzdjd1ZXl0bW01eTl1N3JrNngifQ.wLdfXWUF0P2H2kiQxrjGXA'
    }).addTo(map);
  }

  document.addEventListener('deviceready', function() {
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
      .getCurrentPosition(posOptions)
      .then(function (position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
        vm.marker = L.marker([lat, long]).addTo(map);
      }, function(err) {
        // error
      });

    var watchOptions = {
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        // error
      },
      function(position) {
        var lat  = position.coords.latitude
        var long = position.coords.longitude
        var newLatLng = new L.LatLng(lat, long);
        vm.marker.setLatLng(newLatLng);
    });

    socket.on('message', function(data) {
      vm.messageQueue.push(data.message);
      if (!vm.speaking) {
        vm.speaking = true;
        speakFirstInQueue();
      }
    });
  }, false);

  function speakFirstInQueue () {
    if (vm.messageQueue.length) {
      var message = vm.messageQueue.shift();
      TTS.speak(
        message,
        function() {
          if (vm.messageQueue.length) {
            speakFirstInQueue();
          }
        }, function(reason) {
          if (vm.messageQueue.length) {
            speakFirstInQueue();
          }
        });
    } else {
      vm.speaking = false;
    }
  }
})
