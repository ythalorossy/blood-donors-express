angular.module('app')

.controller('homeCtrl', function($rootScope, $scope, User, LocalStorage) {

  $scope.user = LocalStorage.getData('user');
  $scope.donor = LocalStorage.getData('donor');
})
