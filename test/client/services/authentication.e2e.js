'use strict';

describe('Application E2E:', function() {

	beforeEach(function() {
		browser().navigateTo('/');
	});

	describe('Testing AuthRoutes:', function() {
		it('should jump to /login when a valid token does not exist', function() {
			browser().navigateTo('#/');
			expect(browser().location().path()).toBe('/login');
		});

		it('should jump to / when a user successfully logs in', function() {

		});

		it('should display an error message when a user unsuccessfully logs in', function() {

		});
	});

});