var SERVER_URL = 'http://107.170.112.209:3000';

var socket = io.connect(SERVER_URL);

angular.module('pipcar', ['ionic', 'ngCordova', 'ngMaterial'])

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

.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('blue');
})

.controller('HomeCtrl', function($scope, $http, $ionicPopup, $ionicLoading, $cordovaMedia) {
  var vm = this;

  vm.messageQueue = [];
  vm.speaking = false;
  vm.getAlertInfo = getAlertInfo;
  vm.requestForHelp = requestForHelp;
  vm.sendText = sendText;

  socket.on('emergency', activateEmergency);

  var carIcon = L.AwesomeMarkers.icon({
    prefix: 'ion',
    icon: 'ion-model-s',
    markerColor: 'blue'
  });
  var officerMarker = L.AwesomeMarkers.icon({
    prefix: 'ion',
    icon: 'ion-person',
    markerColor: 'green'
  });
  var officerPositions = [
    [34.0508078,-118.2554419],
    [34.0568068,-118.2504419],
    [34.0458068,-118.2544419],
    [34.0458068,-118.2580419],
    [34.0524068,-118.2500419]
  ];

  function getAlertInfo () {
    var alertPopup = $ionicPopup.alert({
      title: 'Earthquake Alert',
      template: '<b>Warning!</b> <br> you are in the affected area of earthquake. <br> Please follow by the instructions from officers to leave area safely.'
    });
  }

  function requestForHelp () {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br>Finding nearby police officers'
    });
    setTimeout(function() {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Officer Hsu',
        template: 'Found one nearby officer, Hsu. Officer will start assisting you to with voice instructions.'
      });
    }, 1000);
  }

  function sendText () {
    // function recognizeSpeech() {
    //   var maxMatches = 5;
    //   var promptString = "Speak now"; // optional
    //   var language = "en-US";                     // optional
    //   window.plugins.speechrecognizer.startRecognize(function(result){
    //     alert(result);
    //     // Send text to twilio
    //   }, function(errorMessage){
    //     alert(errorMessage);
    //   }, maxMatches, promptString, language);
    // }
    //
    // document.addEventListener('deviceready', recognizeSpeech);
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> <br>Sending I\'m okay text.'
    });
    $http.post(SERVER_URL + '/twilio/send', {
      lat: vm.lag,
      long: vm.long
    }).then(function() {
      $ionicLoading.hide();
    });
  }

  initMap();

  function initMap () {
    vm.map = L.map('map', { zoomControl:false }).setView([34.0508078,-118.2554419], 15);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      id: 'rcliao.cigfua5ev854ztdm6xuj8jj1g',
      accessToken: 'pk.eyJ1IjoicmNsaWFvIiwiYSI6ImNpZ2Z1YTZzdjd1ZXl0bW01eTl1N3JrNngifQ.wLdfXWUF0P2H2kiQxrjGXA'
    }).addTo(vm.map);

    var lat  = 34.0490078;
    var long = -118.2554419;
    vm.marker = L.marker([lat, long], {icon: carIcon}).addTo(vm.map);

    $http.get('http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson').then(function(response) {
      var sfGeoJson = response.data;
      L.geoJson(sfGeoJson, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: feature.properties.mag,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: .7,
            fillOpacity: 0.6
          });
        },
        onEachFeature: function(feature, layer) {
          if (feature.properties && feature.properties.place) {
            layer.bindPopup(feature.properties.place);
          }
        }
      }).addTo(vm.map);
    });
  }

  function activateEmergency (active) {
    if (active) {
      var media = $cordovaMedia.newMedia('/android_asset/www/sound/alert.mp3');

      media.play();

      getAlertInfo();

      vm.emergency = true;
      var circle = L.circle([34.0508078,-118.2554419], 10000, {
        color: 'orange',
        fillColor: '#ffc900',
        fillOpacity: 0.2
      }).addTo(vm.map)
        .bindPopup('10km NW of CA, Los Angeles');

      officerPositions.forEach(addOfficer);
    } else {
      console.log('meh');
    }
  }

  function addOfficer (LatLng) {
    var circle = L.circle(LatLng, 300, {
      color: 'green',
      fillColor: '#4CAF50',
      fillOpacity: 0.2
    }).addTo(vm.map);
    var officer = L.marker(LatLng, {icon: officerMarker}).addTo(vm.map);

    return {
      circle: circle,
      officer: officer
    };
  }

  document.addEventListener('deviceready', function() {
    socket.on('status', function(data) {
      vm.lat  = data.Location.Lat;
      vm.long = data.Location.Lng;
      var newLatLng = new L.LatLng(vm.lat, vm.long);
      vm.marker.setLatLng(newLatLng);
      vm.map.panTo(newLatLng);

      if (data.Speed) {
        vm.speed = data.Speed;
      }

      if (data.FuelLevel) {
        vm.fuelLevel = data.FuelLevel;
      }

      if (data.FuelEfficiency) {
        vm.fuelEfficiency = data.FuelEfficiency;
      }

      $scope.$digest();
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
          speakFirstInQueue();
        }, function(reason) {
          speakFirstInQueue();
        });
    } else {
      vm.speaking = false;
    }
  }
})
