'use strict';

app.controller('UserController', ['$scope','$timeout','$window','Auth', 
						  function($scope, $timeout, $window, Auth){

	$scope.user = {
		email: 'jonnybro@gmail.com',
		password: '1234'
	};

	function resetUser(){
		$scope.user = {};
	}

	function addMessage(type, text){

		var className;

		switch(type){
			case 'success':
				className = 'alert-success';
				break;
			case 'error':
				className = 'alert-danger';
				break;
			case 'warning':
				className = 'alert-warning';
				break;
			default :
				className = 'alert-info';
				break;
		}

		$timeout(function(){
			$scope.message = {
				className: className,
				text: text
			};
		});
	}

	$scope.login = function(){
		Auth.login($scope.user).then(function(){
			console.log('Authenticated:', Auth.isAuthenticated());
		});
	}

	$scope.loginWithGoogle = function(){
		$window.location.href = '/auth/google';
	}
}]);