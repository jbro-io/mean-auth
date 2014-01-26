//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var db = require('../db-connector');
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
        User.authenticate(email, password, function(err, user){
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
	var user = user.toObject();
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
	local: function(request, response, next){
		//authenticate request with passport
		passport.authenticate('local', function(error, user, info){
			if(error) next(error);
			if(!user) return response.send(401, 'Invalid credentials.');
			
			//send signed token upon successful login
			response.send(200, getSignedToken(user));
		})(request, response, next);
	},
	logout: function(request, response){
		console.log('user:', request.user);
		
			
	}
}