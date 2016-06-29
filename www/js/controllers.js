angular.module('app.controllers', [])

.controller('createUserCtrl', function($rootScope, $state, $scope, $ionicPopup, SettingsFactory, User) {

	$scope.user = {};

	$scope.register = function () {

		if(SettingsFactory.getCurrentPosition()) {
			$scope.user.lastPosition = {
        type: 'Point',
        coordinates: [
					SettingsFactory.getCurrentPosition().coords.latitude,
					SettingsFactory.getCurrentPosition().coords.longitude
				]
      };
		}

		User
			.register($scope.user)
			.then(function (response) {

				User.setAuthData(response.data)
 			   .then(function (data) {
 				   $state.go("menu.home");
 			   });
			},
			function (err) {
				var alertPopup = $ionicPopup.alert({
	          title: 'Register failed!',
	          template: 'Please check your data! <br />' + err
	      });
			}
		);
	};

})

.controller('loginCtrl', function($rootScope, $scope, $state, $ionicPopup, User, LocalStorage) {

	$scope.user = {};

	if (LocalStorage.getData('user')) {
		$state.go("menu.home");
	}

	$scope.login = function () {

		User
		.login($scope.user)
		.then(function (response) {

			 User.setAuthData(response.data)
			   .then(function (data) {
				   $state.go("menu.home");
			   });
		},
		function () {
			var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
      });
		});
	};

})

.controller('homeCtrl', function($rootScope, $scope, User, LocalStorage) {
	console.log('creating homeCtrl;....');
	$scope.user = LocalStorage.getData('user');
	$scope.donor = LocalStorage.getData('donor');
})

.controller('settingsCtrl', function($scope) {
})

.controller('mapOfDonorsCtrl', function($scope, $ionicPlatform, $state, $cordovaGeolocation, LocalStorage, SettingsFactory, DonorsFactory, GoogleMaps) {

		$scope.loadingMap = true;

		var currentPostion = LocalStorage.getData('Settings.currentPosition');

		GoogleMaps.init();

		$scope.$on('$GoogleMapsReady', function () {
			$scope.loadingMap = false;
			loadDonors();
		});

		$scope.$on('$GoogleMapsError', function () {
			console.log("||||||||||| RECEIVED GOOGLE MAPS ERROR ||||||||||||");
		});

		function loadDonors() {

			DonorsFactory
			.getNear()
			.query({
				donorId: LocalStorage.getData('donor')._id,
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

						$state.go('menu.userDetail', {
							"donorId" : donor._id
						})

					});

					return donorMarker;
				});

				GoogleMaps.addMarkers(markers);

			});

		};
})

.controller('userDetailCtrl', function($scope, donorId, DonorsFactory) {

	DonorsFactory
	.getDonors()
	.get({'donorId': donorId})
	.$promise
	.then(function(donor) {
		console.log(donor);
			$scope.donor = donor;
			$scope.enableToDonate = true;
	});
})

.controller('messagesCtrl', function($scope) {
})
