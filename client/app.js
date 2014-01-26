var app = angular.module('app', [
	'ngRoute',
])

.config(['$routeProvider','$httpProvider','$locationProvider', 
 function($routeProvider, $httpProvider, $locationProvider){
	$routeProvider.when('/login', {templateUrl: 'partials/user/auth.html', controller: 'UserController'});
	$routeProvider.when('/register', {templateUrl: 'partials/user/register.html', controller: 'UserController'});
	$routeProvider.when('/user/edit/:userId', {templateUrl: 'partials/user/edit.html', controller: 'UserController'});
    
    $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'MainController'});
    $routeProvider.otherwise({redirectTo: '/register'});

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

;