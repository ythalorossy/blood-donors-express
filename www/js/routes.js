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
	  .state('menu.home', {
	    url: '/home',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/home.html',
	        controller: 'homeCtrl'
	      }
	    }
	  })

	  .state('sequences', {
	    url: '/page2',
	    templateUrl: 'templates/sequences.html',
	    controller: 'sequencesCtrl'
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

	  .state('menu', {
	    url: '/side-menu21',
	    templateUrl: 'templates/menu.html',
	    abstract:true
	  })

	  .state('menu.mapOfDonors', {
	    url: '/map/donors',
	    views: {
	      'side-menu21': {
	        templateUrl: 'templates/mapOfDonors.html',
	        controller: 'mapOfDonorsCtrl'
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
