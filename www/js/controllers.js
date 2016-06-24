angular.module('app.controllers', [])

.controller('createUserCtrl', function($rootScope, $scope, $ionicPopup, User) {

	$scope.user = {};

	$rootScope.$on('authLoggedIn', function () {
		$state.go("menu.home");
	});

	$scope.register = function () {

		console.log($scope.user);
		User
			.register($scope.user)
			.then(function (response) {
				User.setAuthData(response.data);
			},
			function (err) {
				var alertPopup = $ionicPopup.alert({
	          title: 'Login failed!',
	          template: 'Please check your credentials! <br />' + err
	      });
			}
		);
	};

})

.controller('loginCtrl', function($rootScope, $scope, $state, $ionicPopup, User) {

	$scope.user = {};

	$rootScope.$on('authLoggedIn', function () {
		$state.go("menu.home");
	});

	$scope.login = function () {
		User
		.login($scope.user)
		.then(function (response) {
			User.setAuthData(response.data);
		},
		function () {
			var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
      });
		});
	};

})

.controller('homeCtrl', function($rootScope, $scope, User) {

	$scope.token = User.getAuthData().token;

})

.controller('sequencesCtrl', function($scope) {
})

.controller('settingsCtrl', function($scope) {
})

.controller('mapOfDonorsCtrl', function($scope, $ionicPlatform, $state, $cordovaGeolocation, SettingsFactory, DonorsFactory, GoogleMaps) {

		$scope.loadingMap = true;

		console.log("||||||||||| REQUESTING GOOGLE MAPS INIT ||||||||||||");
		GoogleMaps.init();

		$scope.$on('$GoogleMapsReady', function () {
			$scope.loadingMap = false;
			console.log("||||||||||| RECEIVED GOOGLE MAPS READY ||||||||||||");
			loadDonors();
		});

		$scope.$on('$GoogleMapsError', function () {
			console.log("||||||||||| RECEIVED GOOGLE MAPS ERROR ||||||||||||");

		});


		function loadDonors() {

			DonorsFactory
			.getNear()
			.query({
				donorId: '5761ef637bd7fee2222883c2',
				distance: SettingsFactory.getDistance()
			})
			.$promise
			.then(function (donors) {

				var markers = donors.map(function (donor) {

					var donorMarker = new google.maps.Marker({
						position: new google.maps.LatLng(donor.lastPosition.coordinates[0], donor.lastPosition.coordinates[1]),
						title: donor.name,
						label: donor.name,
						image: 'img/7H1FqEQguI8OP5NNHqCQ_10299136_650394668362881_7047276451530079508_n.jpg',
						animation: google.maps.Animation.DROP
					});

					donorMarker.addListener('click', function () {
						// map.setCenter(donorMarker.getPosition());
						$state.go('menu.userDetail', {
							"donorId" : donor._id
						})
					});

					return donorMarker;
				});

				GoogleMaps.addMarkers(markers);

			});

		};

		// $scope.$on( "$ionicView.enter", function( scopes, states ) {
		// 	if ($scope.map)
		// 		google.maps.event.trigger( $scope.map, 'resize' );
		// });
		//
		// $scope.loadingMap = true;
		// $scope.error = false;
		// $scope.msgError = "";
		//
		// $scope.userMarker = null;
		// $scope.userPosition = SettingsFactory.getCurrentPosition();
		//
		//
		// $scope.map =  createMap();
		//
		// google.maps.event.addListenerOnce($scope.map, 'idle', function(){
		//
		// 	// google.maps.event.trigger( $scope.map, 'resize' );
		// 	$scope.loadingMap = false;
		//
		// 	addUserMarker();
		//
		// 	loadDonors();
		//
		// 	refreshMap();
		// });
		//
		//
		//  function createMap () {
		//
		// 	var latLng = new google.maps.LatLng($scope.userPosition.coords.latitude, $scope.userPosition.coords.longitude);
		//
		// 	var mapOptions = {
		// 		center: latLng,
		// 		zoom: 15,
		// 		mapTypeId: google.maps.MapTypeId.ROADMAP
		// 	};
		//
		// 	return new google.maps.Map(document.getElementById("map"), mapOptions);
		// }
		//
		// var refreshMap = function () {
		// 	google.maps.event.trigger( $scope.map, 'resize' );
		// }
		//
		// var loadMap = function () {
		//
		// 	var latLng = new google.maps.LatLng($scope.userPosition.coords.latitude, $scope.userPosition.coords.longitude);
		//
		// 	var mapOptions = {
		// 		center: latLng,
		// 		zoom: 15,
		// 		mapTypeId: google.maps.MapTypeId.ROADMAP
		// 	};
		//
 	// 		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		//
		// 	// google.maps.event.addListenerOnce($scope.map, 'idle', function(){
		// 		google.maps.event.trigger( $scope.map, 'resize' );
		// 		$scope.loadingMap = false;
		// 	// });
		// };
		//
		// var addUserMarker = function (latLng) {
		//
		// 	if ($scope.userMarker) {
		// 		$scope.userMarker.setMap(null);
		// 	}
		//
		// 	var latLng = new google.maps.LatLng($scope.userPosition.coords.latitude, $scope.userPosition.coords.longitude);
		//
		// 	$scope.userMarker = new google.maps.Marker({
		// 		position: latLng,
		// 		map: $scope.map,
		// 		title: 'User Name!!!',
		// 		// animation: google.maps.Animation.DROP
		// 	});
		//
		// 	var cityCircle = new google.maps.Circle({
		// 	      strokeColor: '#FF0000',
		// 	      strokeOpacity: 0.8,
		// 	      strokeWeight: 1,
		// 	      fillColor: '#FF0000',
		// 	      fillOpacity: 0.15,
		// 	      map: $scope.map,
		// 	      center: latLng,
		// 	      radius: Math.sqrt(2000) * 100
		// 	    });
		//
		// }
		//
		// var loadDonors = function () {
		//
		// 	// Adiciona os donors da regiao
		// 	DonorsFactory
		// 	.getNear()
		// 	.query({
		// 		donorId: '5761ef637bd7fee2222883c2',
		// 		distance: SettingsFactory.getDistance()
		// 	})
		// 	.$promise
		// 	.then(function (donors) {
		//
		// 		donors.forEach(function (donor) {
		//
		// 			var latLng = new google.maps.LatLng(donor.lastPosition.coordinates[0], donor.lastPosition.coordinates[1]);
		//
		// 			var donorMarker = new google.maps.Marker({
		// 				position: latLng,
		// 				title: donor.name,
		// 				label: donor.name,
		// 				image: 'img/7H1FqEQguI8OP5NNHqCQ_10299136_650394668362881_7047276451530079508_n.jpg',
		// 				animation: google.maps.Animation.DROP
		// 			});
		//
		// 			donorMarker.addListener('click', function () {
		//
		// 				$scope.map.setCenter(donorMarker.getPosition());
		//
		// 				$state.go('menu.userDetail', {
		// 					"donorId" : donor._id
		// 				})
		// 			});
		//
		// 			donorMarker.setMap($scope.map);
		// 		});
		//
		// 	});
		//
		// };

		// loadMap();
		//
		// addUserMarker();
		//
		// loadDonors();

})

.controller('userDetailCtrl', function($scope, donorId, DonorsFactory) {

	DonorsFactory
	.getDonors()
	.get({'donorId': donorId})
	.$promise
	.then(function(donor) {
			$scope.donor = donor;
			$scope.enableToDonate = true;
	});
})

.controller('messagesCtrl', function($scope) {
})
