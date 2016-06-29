angular.module('app.services', [])

//.constant('URLBase', 'http://192.168.3.106:4000')
//.constant('URLBase', 'http://192.168.1.10:4000')
.constant('URLBase', 'https://blood-donors-express-ythalorossy.c9users.io')

.factory('LocalStorage', function ($rootScope, $window) {

	angular.element($window).on('storage', function (event) {
			$rootScope.$apply();
	});

	return {
		setData : function (key, data) {
			$window.localStorage && $window.localStorage.setItem(key, JSON.stringify(data));
		},
		getData : function (key) {
			return $window.localStorage && JSON.parse($window.localStorage.getItem(key));
		},
		clearData : function () {
			$window.localStorage && $window.localStorage.clear();
		}
	}
})

.factory('AuthHttpRequestInterceptor', [function () {
	return {
		'request' : function (config) {
				console.log(config);
			return config;
		}
	}
}])

.factory('SettingsFactory', ['$rootScope', 'LocalStorage', '$cordovaGeolocation', function ($rootScope, LocalStorage, $cordovaGeolocation) {
	return {
		getCurrentPosition: function () {
			return LocalStorage.getData("Settings.currentPosition");
		},
		setCurrentPosition: function (position) {
			LocalStorage.setData('Settings.currentPosition', position);
		},
		getDistance: function () {
			return 3000;
		}
	};
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

.factory('User', function ($rootScope, $http, $q, URLBase, LocalStorage) {

		var userFactory = {
			authData : undefined
		};

		userFactory.setAuthData = function (data) {
			var defer = $q.defer();
			(function () {
				LocalStorage.setData('user', data.user);
				LocalStorage.setData('donor', data.donor);
				LocalStorage.setData('token', data.token);
				console.log("setted authdata");
				defer.resolve();
			})();

			return defer.promise;
		};

		// userFactory.isAuthenticated = function () {
		// 	return !angular.isUndefined(this.getAuthData());
		// };

		userFactory.register = function (user) {
			return $http.post(URLBase + '/users/register', user);
		};

		userFactory.login = function (user) {
			return $http.post(URLBase + '/users/login', user);
		};

		userFactory.logout = function () {
			var _self = this;

			return $http.post(URLBase + '/users/logout')
				.then(function (response) {
					_self.authData = undefined;
				});
		};

		return userFactory;
})

.factory('GoogleMaps', function($rootScope, $cordovaGeolocation, LocalStorage, DonorsFactory){

  var map = null;

  function initMap() {

		var currentPostion = LocalStorage.getData('Settings.currentPosition');

		var latLng = new google.maps.LatLng(
			currentPostion.coords.latitude,
			currentPostion.coords.longitude);

		var mapOptions = {
			center: latLng,
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce(map, 'idle', function() {

			var donor = LocalStorage.getData('donor');
			var donorMarker = new google.maps.Marker({
				position: latLng,
				title: donor.name,
				label: donor.name
			});

			donorMarker.setMap(map);

			$rootScope.$broadcast('$GoogleMapsReady');
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
})

;
