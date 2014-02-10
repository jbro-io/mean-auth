'use strict';
//================================================================================
// Libraries
//================================================================================
var passport       = require('passport');
var jwt            = require('express-jwt');
var config         = require('./config');
var AuthController = require('./controllers/auth');
var UserController = require('./controllers/user');

//================================================================================
// Module
//================================================================================
module.exports = function(app) {
	//AUTHENTICATION
	app.get('/logout', AuthController.logout);
	app.post('/login', AuthController.local);
	app.get('/auth/google', passport.authenticate('google'));
	app.get('/auth/google/callback', AuthController.google);
	app.get('/auth/salesforce', passport.authenticate('forcedotcom'));
	app.get('/auth/salesforce/callback', AuthController.salesforce);
	// app.get('/auth/twitter', passport.authenticate('twitter'));
	// app.get('/auth/twitter/callback', AuthController.twitter);
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', AuthController.github);

	//USER MANAGEMENT
	app.post('/register', UserController.register);

	//API
	app.all('/api/*', jwt({secret:config.secret})); //ensure all api routes are protected
	app.all('/api/*', AuthController.slidingRefresh); //automatically refreshes the JWT if the user is authenticated
	app.get('/api/test', function(request, response) {
		response.send(200, 'Success!');
	});

};
