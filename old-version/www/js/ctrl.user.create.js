angular.module('app')

.controller('createUserCtrl', function($state, $scope, $ionicPopup, SettingsFactory, User) {

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
;
