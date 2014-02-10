'use strict';

describe('Authentication Module:', function() {
	
	//mock $config service used to hold application configuration parameters
	beforeEach(module(function($provide) {
		$provide.value('$config', ConfigMock);
	}));

	//load authentication module
	beforeEach(module('authentication'));

	describe('Auth', function() {
		it('should have an Auth service', inject(function(Auth) {
			expect(Auth).toBeDefined();
		}));

		var service;
		var today = new Date();
		var tomorrow = new Date(today.getTime() + (24*60*60*1000));
		var yesterday = new Date(today.getTime() - (24*60*60*1000));

		beforeEach(function() {
			//inject service
			inject(function(Auth) {
				service = Auth;
			});
		});

		//verify implementation
		it('should have an isAuthenticated function', function(config) {
			expect(angular.isFunction(service.isAuthenticated)).toBe(true);
		});

		it('should have a login function', function() {
			expect(angular.isFunction(service.login)).toBe(true);
		});

		it('should have a logout function', function() {
			expect(angular.isFunction(service.logout)).toBe(true);
		});

		describe('isAuthenticated()', function() {
			var $win;

			beforeEach(function() {
				inject(function($window) {
					$win = $window;
				});

				delete $win.sessionStorage.token;
				delete $win.sessionStorage.expiration;

				spyOn(service, 'isAuthenticated').andCallThrough();
			});

			afterEach(function() {
				expect(service.isAuthenticated).toHaveBeenCalled();
			});

			it('should pass when there are a token and expiration date', function() {
				$win.sessionStorage.token = 'abc123';
				$win.sessionStorage.expiration = tomorrow.toString();

				var authenticated = service.isAuthenticated();
				
				expect(authenticated).toBe(true);
			});

			it('should be false when the expiration has passed', function() {
				$win.sessionStorage.token = 'abc123';
				$win.sessionStorage.expiration = yesterday.toString();

				var authenticated = service.isAuthenticated();

				expect($win.sessionStorage.length).toBe(2);
				expect(authenticated).toBe(false);
			});

			it('should be false when token and expiration are undefined', function() {
				expect($win.sessionStorage.token).toBeUndefined();
				expect($win.sessionStorage.expiration).toBeUndefined();
				expect($win.sessionStorage.length).toEqual(0);

				var authenticated = service.isAuthenticated();

				expect(authenticated).toBe(false);
			});

			it('should be false when token is undefined', function() {
				$win.sessionStorage.expiration = tomorrow;
				expect($win.sessionStorage.token).toBeUndefined();
				expect($win.sessionStorage.length).toEqual(1);
				
				var authenticated = service.isAuthenticated();

				expect(authenticated).toBe(false);
			});

			it('should be false when token is null', function() {
				$win.sessionStorage.token = 'abc';
				$win.sessionStorage.removeItem('token');

				expect($win.sessionStorage.getItem('token')).toBeNull();
				expect($win.sessionStorage.length).toEqual(0);

				var authenticated = service.isAuthenticated();

				expect(authenticated).toEqual(false);
			});

			it('should be false when token is an empty string', function() {
				$win.sessionStorage.token = '';
				$win.sessionStorage.expiration = tomorrow.toString();
				expect($win.sessionStorage.length).toEqual(2);

				var authenticated = service.isAuthenticated();

				expect(authenticated).toBe(false);
			});
		});

		describe('login()', function() {
			var $httpBackend;
			var credentials = {username: 'un', password: 'pw'};

			beforeEach(inject(function($injector) {
				$httpBackend = $injector.get('$httpBackend');

				spyOn(service, 'login').andCallThrough();
			}));

			afterEach(function() {
				expect(service.login).toHaveBeenCalled();

				$httpBackend.verifyNoOutstandingExpectation();
    			$httpBackend.verifyNoOutstandingRequest();
			});

			it('should fetch an authentication token and expiration date', inject(function($config, $window) {
				
				$httpBackend.expectPOST($config.server+'/login', credentials).respond(200, {token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsIl9pZCI6IjUyOTA5NDU5YzNlMTM1MDQxNTAwMDAwMSIsImNvbXBhbnlJZCI6IjUyYTYxNDY1YzAzOTkzZTgzYmYwYTBiZSIsImVtYWlsIjoiam9ubnlicm9AZ21haWwuY29tIiwiZ3JvdXBzIjpbIjUyYWVhMTBjZDUyOGNiOTYxMzAwMDAwMSJdLCJsYXN0TG9naW4iOiIyMDE0LTAxLTI4VDA1OjU2OjQ3LjkwNVoiLCJwcm92aWRlciI6ImxvY2FsIiwic3RhdHVzIjoiT25saW5lIiwidG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKelkyOXdaU0k2SW5OamIzQmxPbU5zYVdWdWREcHBibU52YldsdVp6OWpiR2xsYm5ST1lXMWxQV3B2Ym01NVluSnZaMjFoYVd4amIyMGdjMk52Y0dVNlkyeHBaVzUwT205MWRHZHZhVzVuUDJGd2NGTnBaRDFCVURVMU4yTmlOR000TURjMk5tSXdOelUyTURaaU9UUmhOV0kxTmpSbFpqRTVKbU5zYVdWdWRFNWhiV1U5YW05dWJubGljbTluYldGcGJHTnZiU0lzSW1semN5STZJa0ZET0dNMllqQXlaR0ZoT1dJNFlUazVZVGN6WlRWbU1tWTVabVJtTkRCbU9UQWlMQ0psZUhBaU9qRXpPRGN5TWpNNE1UTjkubFppQ1RGbFpiN3RETVVId3ZZWGVtS2hfZ1E1U2xtSnIzZS1KTDFDemQ1QSIsIm5hbWUiOnsiZmlyc3QiOiJKb25hdGhhbiIsImxhc3QiOiJCcm9xdWlzdCJ9LCJleHAiOjEzOTA4ODg2NjcsImlhdCI6MTM5MDg4ODYwN30.KZk35eiIyjHuXUepAIW-mgihir-ahMvT6mnNRXcEVL0', expiration:'exp_date'});

				var response;
				service.login(credentials).then(function(_response_) {
					response = _response_;
				});

				$httpBackend.flush();
				
				expect(response).toBeDefined();
				expect($window.sessionStorage.token).toBeDefined();
				expect($window.sessionStorage.expiration).toBeDefined();
			}));

			it('should remove the token and expiration when an error is returned', inject(function($config, $window) {
				$window.sessionStorage.token = 'faketoken';
				$window.sessionStorage.expiration = tomorrow.toString();
				expect($window.sessionStorage.token).toEqual('faketoken');
				expect($window.sessionStorage.expiration).toEqual(tomorrow.toString());

				$httpBackend.expectPOST($config.server+'/login', {}).respond(200, {error: 'error message'});
				
				var response, error;
				service.login({}).then(function(_response_) {
					response = _response_;
				}, function(_error_) {
					error = _error_;
				});

				$httpBackend.flush();

				expect(response).toBeUndefined();
				expect(error).toBeDefined();
				expect($window.sessionStorage.token).toBeUndefined();
				expect($window.sessionStorage.expiration).toBeUndefined();
			}));

			it('should remove the token and expiration when a server error occurs', inject(function($config, $window) {
				$window.sessionStorage.token = 'faketoken';
				$window.sessionStorage.expiration = tomorrow.toString();
				expect($window.sessionStorage.token).toEqual('faketoken');
				expect($window.sessionStorage.expiration).toEqual(tomorrow.toString());

				$httpBackend.expectPOST($config.server+'/login', {}).respond(500, 'error message');
				
				var response, error;
				service.login({}).then(function(_response_) {
					response = _response_;
				}, function(_error_) {
					error = _error_;
				});

				$httpBackend.flush();

				expect(response).toBeUndefined();
				expect(error).toBeDefined();
				expect($window.sessionStorage.token).toBeUndefined();
				expect($window.sessionStorage.expiration).toBeUndefined();
			}));
		});

		describe('logout()', function() {

			beforeEach(function() {
				spyOn(service, 'logout').andCallThrough();
			});

			afterEach(function() {
				expect(service.logout).toHaveBeenCalled();
			});

			it('should remove the token and expiration from sessionStorage when called', inject(function($window) {
				$window.sessionStorage.token = 'faketoken';
				$window.sessionStorage.expiration = tomorrow.toString();
				expect($window.sessionStorage.token).toEqual('faketoken');
				expect($window.sessionStorage.expiration).toBeDefined();

				service.logout();
				
				expect($window.sessionStorage.token).toBeUndefined();
				expect($window.sessionStorage.expiration).toBeUndefined();
			}));
		});
	});
	
	describe('AuthInterceptor', function() {
		var interceptor, httpProvider;

		beforeEach(function() {
			module(function($httpProvider) {
				httpProvider = $httpProvider;
			});

			//inject service
			inject(function($injector) {
				interceptor = $injector.get('AuthInterceptor');
			});

		});

		it('should exist', function() {
			expect(interceptor).toBeDefined();
		});

		it('should be in the $httpProvider interceptors array', function() {
			expect(httpProvider.interceptors.length).toBe(1);
			expect(httpProvider.interceptors[0]).toBe('AuthInterceptor');
		});

		it('should have a request function', function() {
			expect(angular.isFunction(interceptor.request)).toBe(true);
		});

		it('should have a response function', function() {
			expect(angular.isFunction(interceptor.response)).toBe(true);
		});

		describe('request function', function() {

			beforeEach(function() {
				spyOn(interceptor, 'request').andCallThrough();
			});

			afterEach(function() {
				expect(interceptor.request).toHaveBeenCalled();
			});

			it('should add a headers property to the config object passed in', function() {
				var config = {name:'test'};
				expect(config.headers).toBeUndefined();

				var result = interceptor.request(config);

				expect(result.name).toBe('test');
				expect(result.headers).toBeDefined();
			});

			it('should return an object with a headers property even when config was not passed in', function() {
				var result = interceptor.request();
				
				expect(result.headers).toBeDefined();
			});

			it('should set the Authorization header when an autheorization token is found', inject(function($window) {
				$window.sessionStorage.token = 'abc123';

				var result = interceptor.request();

				expect(result.headers.Authorization).toBeDefined();
			}));

		});
	});

	describe('LoginController', function() {
		var $scope, $window, Auth, createController, $rootScope;

		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$window = $injector.get('$window');
			Auth = $injector.get('Auth');

			var $controller = $injector.get('$controller');

			createController = function() {
				return $controller('LoginController', {
					'$scope' : $scope
				});
			};
		}));

		it('should exist', function() {
			var controller = createController();
			expect(controller).toBeTruthy();
		});

		describe('$scope', function() {
			var controller;

			beforeEach(function() {
				controller = createController();
			});

			it('should have a user property', function() {
				expect($scope.user).toBeDefined();
			});

			it('should have a login function', function() {
				expect(angular.isFunction($scope.login)).toBeTruthy();
			});

			it('should have a loginWithGoogle function', function() {
				expect(angular.isFunction($scope.loginWithGoogle)).toBeTruthy();
			});

			describe('login()', function() {
				it('should call the Auth.login function', function() {
					//setup spy to verify Auth.login is called
					spyOn(Auth, 'login').andCallThrough();

					$scope.login({});

					expect(Auth.login).toHaveBeenCalled();
				});

				it('should populate $scope.message on an invalid login', function() {

				});
			});
		})

			
			
	});

});

	