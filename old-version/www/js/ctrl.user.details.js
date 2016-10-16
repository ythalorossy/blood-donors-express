angular.module('app')

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
