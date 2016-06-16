angular.module('app.controllers', [])

.controller('homeCtrl', function($scope) {
})

.controller('sequencesCtrl', function($scope) {
})

.controller('settingsCtrl', function($scope) {
})

.controller('mapOfDonorsCtrl', function($scope, $ionicPlatform, $state, $cordovaGeolocation, SettingsFactory, DonorsFactory) {

	console.log("!!!!!!!!!!!!!!! CONTROLLER CREATED  !!!!!!!!");


		$scope.$on( "$ionicView.enter", function( scopes, states ) {
			if ($scope.map)
				google.maps.event.trigger( $scope.map, 'resize' );
			// loadMap()
		});

		$scope.loadingMap = true;
		$scope.error = false;
		$scope.msgError = "";

		$scope.userMarker = null;
		$scope.userPosition = null;

		var loadMap = function () {

			var latLng = new google.maps.LatLng($scope.userPosition.coords.latitude, $scope.userPosition.coords.longitude);

			var mapOptions = {
				center: latLng,
				zoom: 10,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
				google.maps.event.trigger( $scope.map, 'resize' );
		};

		var addUserMarker = function (latLng) {

			if ($scope.userMarker) {
				$scope.userMarker.setMap(null);
			}

			var latLng = new google.maps.LatLng($scope.userPosition.coords.latitude, $scope.userPosition.coords.longitude);

			$scope.userMarker = new google.maps.Marker({
				position: latLng,
				map: $scope.map,
				title: 'User Name!!!',
				// animation: google.maps.Animation.DROP
			});

			var cityCircle = new google.maps.Circle({
			      strokeColor: '#FF0000',
			      strokeOpacity: 0.8,
			      strokeWeight: 1,
			      fillColor: '#FF0000',
			      fillOpacity: 0.15,
			      map: $scope.map,
			      center: latLng,
			      radius: Math.sqrt(2000) * 100
			    });

		}

		var loadDonors = function () {

			// Adiciona os donors da regiao
			DonorsFactory
			.getNear()
			.query({
				donorId: '5761ef637bd7fee2222883c2',
				distance: SettingsFactory.getDistance()
			})
			.$promise
			.then(function (donors) {

				donors.forEach(function (donor) {

					var latLng = new google.maps.LatLng(donor.lastPosition.coordinates[0], donor.lastPosition.coordinates[1]);

					var donorMarker = new google.maps.Marker({
						position: latLng,
						title: donor.name,
						label: donor.name,
						image: 'img/7H1FqEQguI8OP5NNHqCQ_10299136_650394668362881_7047276451530079508_n.jpg',
						animation: google.maps.Animation.DROP
					});

					donorMarker.addListener('click', function () {

						$scope.map.setCenter(donorMarker.getPosition());

						$state.go('menu.userDetail', {
							"donorId" : donor._id
						})
					});

					donorMarker.setMap($scope.map);
				});

			});

		};

		// Carrega a posição atual
		$cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true})
		.then(function(position){

				$scope.userPosition = position;

				loadMap();

				addUserMarker();

				loadDonors();

				$scope.loadingMap = false;

			},
			function(error){
				$scope.loadingMap = false;
				$scope.error = true;
				$scope.msgError = "Could not get location";
			});

			var watchOptions = {
		    timeout : 5000,
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
					$scope.userPosition = position;
					// addUserMarker(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		  });
})

.controller('loginCtrl', function($scope) {
})

.controller('createUserCtrl', function($scope) {
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
