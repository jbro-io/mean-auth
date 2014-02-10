'use strict';

app.controller('MainController', ['$scope','$http','$config','Auth','$location', function($scope, $http, $config, Auth, $location){

	$scope.test = function() {
		$http.get($config.server+'/api/test').then(function(response){
			console.log('Test Response:', response);
			Auth.isAuthenticated();
		});

	}

	$scope.register = function() {
		$location.path('/register');
	}

	$scope.logout = function() {
		Auth.logout();
	}

}]);