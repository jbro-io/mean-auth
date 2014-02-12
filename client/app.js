'use strict';

var app = angular.module('app', [
	'ngRoute',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'authentication'
])

.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/authentication/login.html', controller: 'LoginController'});
	$routeProvider.when('/register', {templateUrl: 'partials/user/register.html', controller: 'UserController'});
	$routeProvider.when('/user/edit/:userId', {templateUrl: 'partials/user/edit.html', controller: 'UserController'});

    $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'MainController'});
    $routeProvider.otherwise({redirectTo: '/register'});

    //CORS
    // $httpProvider.defaults.useXDomain = true; //sets IE to use XDomainRequest instead of XHR
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

;