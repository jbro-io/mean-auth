'use strict';
//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var passport = require('passport');
var jwt = require('express-jwt');
var config = require('./config');
var AuthController = require('./controllers/auth');
var UserController = require('./controllers/user');

//================================================================================
// Functions
//================================================================================
function ensureAuthenticated(req, res, next) {
	console.log('user:', req.user);
	if(req.isAuthenticated()) return next();
	res.redirect('/login');
}

//-------------------------------------------------------------------------
// Module
//-------------------------------------------------------------------------
module.exports = function(app) {
	//AUTHENTICATION
	app.get('/logout', AuthController.logout);
	app.post('/login', AuthController.local);
	// app.get('/auth/salesforce', passport.authenticate('forcedotcom'));
	// app.get('/auth/salesforce/callback', AuthController.salesforce);
	// app.get('/auth/google', passport.authenticate('google'));
	// app.get('/auth/google/callback', AuthController.google);

	//USER MANAGEMENT
	app.post('/register', UserController.register);

	//API
	app.all('/api/*', jwt({secret:config.secret})); //ensure all api routes are protected
	app.get('/api/test', function(request, response){
		response.send(200, 'Success!');
	});

};
