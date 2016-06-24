angular.module('app.services', [])

//.constant('URLBase', 'http://192.168.3.106:4000')
.constant('URLBase', 'http://192.168.1.10:4000')

.factory('AuthHttpRequestInterceptor', [function () {
	return {
		'request' : function (config) {
				console.log(config);
			return config;
		}
	}
}])

.factory('SettingsFactory', ['$rootScope', '$cordovaGeolocation', function ($rootScope, $cordovaGeolocation) {

	var api = {
		getCurrentPosition: function () {

			console.log("|||||||||||||  ", $rootScope.currentPosition, " |||||||||||||||||||");

			return $rootScope.currentPosition;
		},
		getDistance: function () {
			return 3000;
		}
	}

	return api;
}])

.factory('DonorsFactory', ['$resource', 'URLBase', function($resource, URLBase) {

		var api = {
			getDonors : function () {
				return $resource( URLBase + '/donors/:donorId',
				{
					donorId: '@donorId'
				},
				{
					'get':    {method:'GET'},
					'save':   {method:'POST'},
					'query':  {method:'GET', isArray:true},
					'remove': {method:'DELETE'},
					'delete': {method:'DELETE'}
				});
			},
			getNear : function () {
				return $resource( URLBase + '/donors/near/:donorId/:distance',
				{
					donorId: '@donorId',
					distance: '@distance'
				});
			}
		};

		return api;
}])

.factory('User', ['$rootScope', '$resource', '$http', 'URLBase', function ($rootScope, $resource, $http, URLBase) {

		var authFactory = {
			authData : undefined
		};

		authFactory.setAuthData = function (data) {
			this.authData = {
				user: data.user,
				token: data.token
			};
			$rootScope.$broadcast('authLoggedIn');
		};

		authFactory.getAuthData = function () {
			return this.authData;
		};

		authFactory.isAuthenticated = function () {
			return !angular.isUndefined(this.getAuthData());
		};

		authFactory.register = function (user) {
			return $http.post(URLBase + '/users/register', user);
		};

		authFactory.login = function (user) {
			return $http.post(URLBase + '/users/login', user);
		};

		authFactory.logout = function () {
			var _self = this;
			var _rootScope = $rootScope;

			return $http.post(URLBase + '/users/logout')
				.then(function (response) {
					_self.authData = undefined;
				});
		};

		return authFactory;

		// return $resource( URLBase + '/users/login', null, {
		// 		'login' : { method : 'POST' }
		// 	});
}])

.factory('GoogleMaps', function($rootScope, $cordovaGeolocation, SettingsFactory, DonorsFactory){

	var apiKey = false;
  var map = null;

  function initMap() {

    var options = {timeout: 10000, enableHighAccuracy: true};

		// Get the current position
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

			console.log("||||||||||| LOADED POSITION ||||||||||||");

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

			console.log("||||||||||| CREATING MAP ||||||||||||");
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
			console.log("|||||||||||  MAP CREATED ||||||||||||");
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
				console.log("||||||||||| FIRING GOOGLE MAPS READY ||||||||||||");
				$rootScope.$broadcast('$GoogleMapsReady');
      });

    }, function(error){
			console.log("||||||||||| FIRING GOOGLE MAPS ERROR ||||||||||||");
			$rootScope.$broadcast('$GoogleMapsError', error);
    });

  };

	function addMarkers (markers) {
		markers.forEach(function (marker) {
			marker.setMap(map);
		});
	}

	return {
		init : function () {
			initMap();
		},
		addMarkers: addMarkers
	};
});

;
