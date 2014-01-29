'use strict';

describe('Authentication Module:', function() {
	//instantiate authentication module
	beforeEach(module('authentication'));
	
	//mock $config service used to hold application configuration parameters
	beforeEach(module(function($provide) {
		$provide.value('$config', {
			server: 'serverurl'
		});
	}));

	it('should have an Auth service', inject(function(Auth) {
		expect(Auth).toBeDefined();
	}));

	it('should have an AuthInterceptor service', inject(function(AuthInterceptor) {
		expect(AuthInterceptor).toBeDefined();
	}));

	describe('Auth Service Tests:', function() {
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

		it('should have an isAuthenticated function', function(config) {
			expect(angular.isFunction(service.isAuthenticated)).toBe(true);
		});

		it('should have a login function', function() {
			expect(angular.isFunction(service.login)).toBe(true);
		});

		it('should have a logout function', function() {
			expect(angular.isFunction(service.logout)).toBe(true);
		});

		describe('isAuthenticated function', function() {
			var $win;

			beforeEach(function() {
				inject(function($window) {
					$win = $window;
				});

				delete $win.sessionStorage.token;
				delete $win.sessionStorage.expiration;
			});

			it('should pass when there are a token and expiration date', function() {
				$win.sessionStorage.token = 'abc123';
				$win.sessionStorage.expiration = tomorrow;

				expect(service.isAuthenticated()).toEqual(true);
			});

			it('should be false when the expiration has passed', function() {
				$win.sessionStorage.token = 'abc123';
				$win.sessionStorage.expiration = yesterday;

				expect($win.sessionStorage.length).toEqual(2);
				expect(service.isAuthenticated()).toEqual(false);
			});

			it('should be false when token and expiration are undefined', function() {
				expect($win.sessionStorage.token).toBeUndefined();
				expect($win.sessionStorage.expiration).toBeUndefined();
				expect($win.sessionStorage.length).toEqual(0);
				expect(service.isAuthenticated()).toEqual(false);
			});

			it('should be false when token is undefined', function() {
				$win.sessionStorage.expiration = tomorrow;

				expect($win.sessionStorage.token).toBeUndefined();
				expect($win.sessionStorage.length).toEqual(1);
				expect(service.isAuthenticated()).toEqual(false);
			});

			it('should be false when token is null', function() {
				$win.sessionStorage.token = 'abc';
				$win.sessionStorage.removeItem('token');

				expect($win.sessionStorage.getItem('token')).toBeNull();
				expect($win.sessionStorage.length).toEqual(0);
				expect(service.isAuthenticated()).toEqual(false);
			});

			it('should be false when token is an empty string', function() {
				$win.sessionStorage.token = '';

				expect($win.sessionStorage.length).toEqual(1);
				expect(service.isAuthenticated()).toEqual(false);
			});
		});

		describe('login function', function() {
			var $httpBackend;
			var credentials = {username: 'un', password: 'pw'};

			beforeEach(inject(function($injector, $config) {
				$httpBackend = $injector.get('$httpBackend');
			}));

			it('should fetch an authentication token and expiration date', inject(function($config, $window) {
				var response;
				$httpBackend.expectPOST($config.server+'/login', credentials).respond(200, {token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsIl9pZCI6IjUyOTA5NDU5YzNlMTM1MDQxNTAwMDAwMSIsImNvbXBhbnlJZCI6IjUyYTYxNDY1YzAzOTkzZTgzYmYwYTBiZSIsImVtYWlsIjoiam9ubnlicm9AZ21haWwuY29tIiwiZ3JvdXBzIjpbIjUyYWVhMTBjZDUyOGNiOTYxMzAwMDAwMSJdLCJsYXN0TG9naW4iOiIyMDE0LTAxLTI4VDA1OjU2OjQ3LjkwNVoiLCJwcm92aWRlciI6ImxvY2FsIiwic3RhdHVzIjoiT25saW5lIiwidG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKelkyOXdaU0k2SW5OamIzQmxPbU5zYVdWdWREcHBibU52YldsdVp6OWpiR2xsYm5ST1lXMWxQV3B2Ym01NVluSnZaMjFoYVd4amIyMGdjMk52Y0dVNlkyeHBaVzUwT205MWRHZHZhVzVuUDJGd2NGTnBaRDFCVURVMU4yTmlOR000TURjMk5tSXdOelUyTURaaU9UUmhOV0kxTmpSbFpqRTVKbU5zYVdWdWRFNWhiV1U5YW05dWJubGljbTluYldGcGJHTnZiU0lzSW1semN5STZJa0ZET0dNMllqQXlaR0ZoT1dJNFlUazVZVGN6WlRWbU1tWTVabVJtTkRCbU9UQWlMQ0psZUhBaU9qRXpPRGN5TWpNNE1UTjkubFppQ1RGbFpiN3RETVVId3ZZWGVtS2hfZ1E1U2xtSnIzZS1KTDFDemQ1QSIsIm5hbWUiOnsiZmlyc3QiOiJKb25hdGhhbiIsImxhc3QiOiJCcm9xdWlzdCJ9LCJleHAiOjEzOTA4ODg2NjcsImlhdCI6MTM5MDg4ODYwN30.KZk35eiIyjHuXUepAIW-mgihir-ahMvT6mnNRXcEVL0', expiration:'exp_date'});

				service.login(credentials).then(function(_response_) {
					response = _response_;
				});
				$httpBackend.flush();

				expect(response).toBeDefined();
				expect($window.sessionStorage.token).toBeDefined();
				expect($window.sessionStorage.expiration).toBeDefined();
			}));

			it('should remove the token when an error is returned', inject(function($config, $window) {
				$window.sessionStorage.token = 'faketoken';
				expect($window.sessionStorage.token).toEqual('faketoken');

				$httpBackend.expectPOST($config.server+'/login', {}).respond(200, {error: 'error message'});
				
				var response;
				var error;
				service.login({}).then(function(_response_) {
					response = _response_;
				}, function(_error_) {
					error = _error_;
				});
				$httpBackend.flush();

				expect(response).toBeUndefined();
				expect(error).toBeDefined();
				expect($window.sessionStorage.token).toBeUndefined();
			}));
		});

		describe('logout function', function() {
			it('should remove the token from sessionStorage when called', inject(function($window) {
				$window.sessionStorage.token = 'faketoken';
				expect($window.sessionStorage.token).toEqual('faketoken');

				service.logout();

				expect($window.sessionStorage.token).toBeUndefined();
			}));
		});
	});

	describe('AuthInterceptor Service tests:', function() {
		var service;

		beforeEach(function() {
			//inject service
			inject(function(AuthInterceptor) {
				service = AuthInterceptor;
			});

		});

		it('should have a request function', function() {
			expect(angular.isFunction(service.request)).toBe(true);
		});

		it('should have a response function', function() {
			expect(angular.isFunction(service.response)).toBe(true);
		});
	});

});

	