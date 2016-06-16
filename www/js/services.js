angular.module('app.services', [])

.factory('SettingsFactory', ['$rootScope', '$cordovaGeolocation', function ($rootScope, $cordovaGeolocation) {

	var _self = this;

	var currentPosition;

	// Carrega a posição atual
	$cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
	.then(function(position){
		currentPosition = position;
	},
	function(error){
		console.log("Could not get location");
	});

	var api = {
		getCurrentPosition: function () {
			return currentPosition;
		},
		getDistance: function () {
			return 3000;
		}
	}

	return api;
}])

.factory('DonorsFactory', ['$resource', function($resource) {

		var api = {
			getDonors : function () {
				return $resource('http://192.168.3.106:4000/donors/:donorId',
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
				return $resource('http://192.168.3.106:4000/donors/near/:donorId/:distance',
				{
					donorId: '@donorId',
					distance: '@distance'
				});
			}
		};

		return api;
}])

;
