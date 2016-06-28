// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngResource', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform, $rootScope, $cordovaGeolocation, SettingsFactory, GoogleMaps) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

		// Carrega a posição atual
		// $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
		// .then(
		// 	function(position){
		// 		console.log("APP: Getting location");
		// 		SettingsFactory.setCurrentPosition(position);
		// 		console.log('APP: Location got ' + position );
		// 	},
		// 	function(error){
		// 		console.log("Could not get location");
		// 	}
		// );

		$cordovaGeolocation.watchPosition({
			timeout : 10000, // Default: 10s
			enableHighAccuracy: false // may cause errors if true
		})
		.then(
			null,
			function(err) { },
			function(position) {
				SettingsFactory.setCurrentPosition({
					coords: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}
				});
			}
		);

  });
})
