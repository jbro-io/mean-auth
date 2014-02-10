'use strict';

var app = angular.module('app', [
	'ngRoute',
    'ngCookies',
    'ui.bootstrap',
    'authentication'
])

.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {
	$routeProvider.when('/login', {templateUrl: 'partials/authentication/login.html', controller: 'LoginController'});
	$routeProvider.when('/register', {templateUrl: 'partials/user/register.html', controller: 'UserController'});
	$routeProvider.when('/user/edit/:userId', {templateUrl: 'partials/user/edit.html', controller: 'UserController'});

    $routeProvider.when('/', {templateUrl: 'partials/main.html', controller: 'MainController'});
    $routeProvider.otherwise({redirectTo: '/register'});

    $httpProvider.defaults.useXDomain = true;

    //remove the x-requested-with header that angular adds by default for xhr requests
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

;