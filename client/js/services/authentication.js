'use strict';

app
.factory('Auth', ['$location','$window','$rootScope', '$http', '$config', '$q', function($location, $window, $rootScope, $http, $config, $q){

	//used for decoding the jwt returned during authentication
	function url_base64_decode(str) {
		var output = str.replace('-','+').replace('_','/');
		switch(output.length % 4) {
			case 0:
				break;
			case 2:
				output += '==';
				break;
			case 3:
				output += '=';
				break;
			default:
				throw 'Illegal base64 url string!';
		}

		return window.atob(output);
	}

	return {
		isAuthenticated: function() {
			var token = $window.sessionStorage.token;
			var expiration = new Date($window.sessionStorage.expiration);
			var now = new Date();

			return (token === undefined || token === null || token === '' || expiration.getTime() <= now.getTime()) ? false : true;
		},
		login: function(user){
			var defer = $q.defer();
			var self = this;
			
			$http.post($config.server+'/login', user).then(function(response){
				console.log('Auth Response:', response);

				if(response.data.error) {
					//set authenticated flag
					self.isAuthenticated = false;

					//delete any token in storage
					delete $window.sessionStorage.token;
					
					defer.reject(response.data.error);
				}

				if(response.data.token) {
					//decode user data from jwt
					var encodedUser = response.data.token.split('.')[1];
					var user = JSON.parse(url_base64_decode(encodedUser));
					console.log('user:', user);

					//store token in sessionStorage
					$window.sessionStorage.token = response.data.token;
					$window.sessionStorage.expiration = response.data.expiration;

					//set path to root of application
					$location.path('/');
					
					defer.resolve(user);
				}

			}, function(error){
				console.log('Auth Error:', error);

				//erase the token upon failed login
				delete $window.sessionStorage.token;

				defer.reject();
			});

			return defer.promise;
		},
		logout: function() {
			//delete token in storage
			delete $window.sessionStorage.token;

			//TODO: delete token from server

			//change path to login screen
			$location.path('/login');

			return;
		}
	}
}])

.factory('AuthInterceptor', ['$q','$window','$location', function($q, $window, $location){
	return {
		request: function(config) {
			if(!config) config = {};
			config.headers = config.headers || {};

			if($window.sessionStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}

			return config;
		},
		response: function(response) {
			if(response.status === 401) {
				$location.path('/login');
			}

			return response || $q.when(response);
		}
	}
}])

.config(['$httpProvider', function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
}])

.run(['$rootScope','Auth','$location', function($rootScope, Auth, $location){
	//verify the user is authenticated when the user changes routes
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        //change route to login if user isnt authenticated
        if(!Auth.isAuthenticated()) $location.path('/login');
    });
}])
	
;