angular.module('app')

.controller('loginCtrl', function($scope, $state, $ionicPopup, User, LocalStorage) {

  $scope.user = {};

  if (LocalStorage.getData('user')) {
    $state.go("menu.home");
  }

  $scope.login = function() {

    User
      .login($scope.user)
      .then(function(response) {

          User.setAuthData(response.data)
            .then(function(data) {
              $state.go("menu.home");
            });
        },
        function() {
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        });
  };

})
