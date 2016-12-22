angular.module('starter.controllers', ['firebase'])

.controller('MapCtrl', function($scope, $ionicLoading) {

  var marker;
  var linea = new Array ();
  var flightPath;
  var firebase = new Firebase("https://dondeando.firebaseio.com/test");

  /*$scope.cambio = function () {
    if (flightPath) {
      flightPath.setMap(null);
      linea = [];
    }
    console.log($scope.data.singleSelect);
    //$scope.centerOnLine();
    var firebase = new Firebase("https://dondeando.firebaseio.com/pos_desde_servicio");

    firebase.on("child_added", function(snapshot, prevChildKey) {
    var newPosition = snapshot.val();
    //console.log (newPosition);
    var pos = newPosition.split (",");

    var latLng = new google.maps.LatLng(pos[0], pos[1]);

    linea.push (latLng);
    $scope.map.setCenter (latLng);

    flightPath = new google.maps.Polyline({
      path: linea,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    flightPath.setMap($scope.map);
    $scope.centerOnLine();
    });

  };*/
  //var firebase = new Firebase("https://dondeando.firebaseio.com/coords/"+$scope.data.singleSelect);
  //console.log ($scope.data.singleSelect);

  $scope.mapCreated = function(map) {
    $scope.map = map;
  };
  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: $scope.map
      });
      var infowindow = new google.maps.InfoWindow({
        content: "contentString"
      });
      marker.addListener('click', function() {
        alert ("click");
        infowindow.open($scope.map, marker);
      });
    }, function (error) {
      alert('Unable to get location: ' + error.message);
      $scope.loading.hide();
    });
  };
  $scope.centerOnLine = function () {
    if (marker) {
      marker.setMap (null);
    }
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < linea.length; i++) {
      bounds.extend(linea[i]);
    }
    $scope.map.fitBounds(bounds);
    //console.log ("centrando");
    return;
  };

  firebase.on("child_added", function(snapshot, prevChildKey) {    
    //console.log (prevChildKey);
    var posAnterior;

    var anterior;
    if (prevChildKey != null) {
      anterior = firebase.child (prevChildKey);
      anterior.on('value', function(snapshot) {
        posAnterior =  snapshot;
      });
    }
    else
      posAnterior = snapshot;
    
    var latLng = new google.maps.LatLng(snapshot.val().latitud, snapshot.val().longitud);
    //console.log (latLng);
    linea.push (latLng);
    //$scope.map.setCenter ({newPosition.latitud, newPosition.longitud});
    /*marker = new google.maps.Marker({
        //position: latLng,
        position: new google.maps.LatLng(snapshot.val().latitud, snapshot.val().longitud),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 3,
          strokeColor: '#0000FA'
        },
        map: $scope.map
      });*/    

    $scope.map.setCenter(new google.maps.LatLng(snapshot.val().latitud, snapshot.val().longitud));
    var flightPath = new google.maps.Polyline({
      path: [(new google.maps.LatLng(posAnterior.val().latitud, posAnterior.val().longitud)),
              (new google.maps.LatLng(snapshot.val().latitud, snapshot.val().longitud))],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.6,
      strokeWeight: 6
    });
    flightPath.setMap($scope.map);
    //$scope.centerOnLine();

    cityCircle = new google.maps.Circle({
      strokeColor: '#FFFFFF',
      strokeOpacity: 1,
      strokeWeight: 1,
      fillColor: '#00FF00',
      fillOpacity: 0.6,
      map: $scope.map,
      center:  new google.maps.LatLng(snapshot.val().latitud, snapshot.val().longitud),
      radius: 8
    });
  });



});
