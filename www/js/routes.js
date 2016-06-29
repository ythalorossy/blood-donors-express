angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	$httpProvider.interceptors.push('AuthHttpRequestInterceptor');

	// Default router
	$urlRouterProvider.otherwise('/user/login')

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

		.state('menu', {
			url: '/side-menu21',
			templateUrl: 'templates/menu.html',
			controller : function ($scope, $state, LocalStorage) {
				$scope.logout = function () {
					LocalStorage.clearData();
					$state.go('login');
				};
			},
			abstract:true
		})

	  .state('menu.home', {
			cache: false,
	    url: '/home',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/home.html',
	        controller: 'homeCtrl'
	      }
	    },
			resolve: {
				user : ['LocalStorage', function (LocalStorage) {
					return LocalStorage.getData('user');
				}],
				donor: ['LocalStorage', function (LocalStorage) {
					return LocalStorage.getData('donor')
				}]
			}
	  })

	  .state('menu.settings', {
	    url: '/settings',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/settings.html',
	        controller: 'settingsCtrl'
	      }
	    }
	  })

	  .state('menu.mapOfDonors', {
	    url: '/map/donors',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/mapOfDonors.html',
	        controller: 'mapDonorCtrl'
	      }
	    }
	  })

	  .state('login', {
	    url: '/user/login',
	    templateUrl: 'templates/login.html',
	    controller: 'loginCtrl'
	  })

	  .state('createUser', {
	    url: '/user/create',
	    templateUrl: 'templates/createUser.html',
	    controller: 'createUserCtrl'
	  })

	  .state('menu.userDetail', {
	    url: '/user/detail',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/userDetail.html',
	        controller: 'userDetailCtrl'
	      }
	    },
			params : {
				donorId : null
			},
			resolve: {
				donorId : ['$stateParams', function ($stateParams) {
					return $stateParams.donorId;
				}]
			}

	  })

	  .state('menu.messages', {
	    url: '/messages',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/messages.html',
	        controller: 'messagesCtrl'
	      }
	    }
	  })
})

;
