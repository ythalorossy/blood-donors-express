angular.module('app')

.controller('mapDonorCtrl', function($scope, $ionicPlatform, $state, $cordovaGeolocation, LocalStorage, SettingsFactory, DonorsFactory, GoogleMaps) {

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
