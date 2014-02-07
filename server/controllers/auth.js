'use strict';
//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config');
var User = require('../models/User');

//-------------------------------------------------------------------------
// Passport Strategies
//-------------------------------------------------------------------------
var LocalStrategy = require('passport-local').Strategy;
var localStrategy = new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done){
        User.authenticateLocal(email, password, function(err, user) {
            return done(err, user);
        });
    }
);
passport.use(localStrategy);

//-------------------------------------------------------------------------
// Methods
//-------------------------------------------------------------------------
function getSignedToken(user){
	//remove salt and hash properties from user object to sign
	user = user.toObject();
	if(user.salt) delete user.salt;
	if(user.hash) delete user.hash;

	//instantiate token to sign
	var expiresMins = 1;
	var token = jwt.sign(user, config.secret, { expiresInMinutes: expiresMins });
	var now = new Date();
	var expiration = new Date(now.getTime() + (1000 * 60 * expiresMins));

	return { token: token, expiration: expiration };
}

//-------------------------------------------------------------------------
// Module
//-------------------------------------------------------------------------
module.exports = {
	local: function(req, res, next){
		//authenticate request with passport
		passport.authenticate('local', function(error, user, info) {
			if(error) {
                next(error);
            } else if(!user) {
                return res.send(401, 'Invalid credentials.');
            }

			//send signed token upon successful login
			res.send(200, getSignedToken(user));
		})(req, res, next);
	},
	logout: function(req, res){
		console.log('user:', req.user);
        res.send(200);
	}
};