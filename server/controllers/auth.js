'use strict';
//================================================================================
// Libraries
//================================================================================
var passport = require('passport');
var jwt      = require('jsonwebtoken');
var config   = require('../config');
var User     = require('../models/User');

//================================================================================
// Passport
//================================================================================
var LocalStrategy = require('passport-local').Strategy;
var localStrategy = new LocalStrategy({
        usernameField: 'email'
    },
    function (email, password, done){
        User.authenticate(email, password, function(err, user) {
            return done(err, user);
        });
    }
);
passport.use(localStrategy);
//--------------------------------------------------------------------------------
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleStrategy = new GoogleStrategy({
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: 'http://localhost:7000/auth/google/callback',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('Google Profile:', profile);
        User.authenticateOAuth(accessToken, refreshToken, profile._json, function(err, user) {
            return done(err, user);
        });
    }
);
passport.use(googleStrategy);
//--------------------------------------------------------------------------------
var SalesforceStrategy = require('passport-forcedotcom').Strategy;
var salesforceStrategy = new SalesforceStrategy({
        clientID: config.salesforce.clientId,
        clientSecret: config.salesforce.clientSecret,
        callbackURL: 'http://localhost:7000/auth/salesforce/callback',
        scope: ['id']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('Salesforce Profile:', profile);
        User.authenticateOAuth(accessToken, refreshToken, profile, function(err, user) {
            return done(err, user);
        });
    }
);
// passport.use(salesforceStrategy);
//--------------------------------------------------------------------------------
// var TwitterStrategy = require('passport-twitter').Strategy;
// var twitterStrategy = new TwitterStrategy({
//         consumerKey: config.twitter.apiKey,
//         consumerSecret: config.twitter.apiSecret,
//         callbackURL: 'http://localhost:7000/auth/twitter/callback'
//     },
//     function(accessToken, tokenSecret, profile, done) {
//         console.log('Twitter Access Token:', accessToken);
//         console.log('Twitter Token Secret:', tokenSecret);
//         console.log('Twitter Profile:', profile);
//         User.authenticateOAuth(accessToken, tokenSecret, profile, function(err, user) {
//             return done(err, user);
//         });
//     }
// );
// passport.use(twitterStrategy);
//--------------------------------------------------------------------------------
var GithubStrategy = require('passport-github').Strategy;
var githubStrategy = new GithubStrategy({
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: 'http://localhost:7000/auth/github/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log('Github Profile:', profile);
        User.authenticateOAuth(accessToken, refreshToken, profile._json, function(err, user) {
            return done(err, user);
        });
    }
);
passport.use(githubStrategy);
//--------------------------------------------------------------------------------
passport.serializeUser(function (user, done){
    done(null, user.id);
});
passport.deserializeUser(function (id, done){
    User.findById(id, function (err, user){
        done(err, user);
    });
});

//================================================================================
// Functions
//================================================================================
function getSignedToken(user) {
	//remove salt and hash properties from user object to sign so they aren't
    //returned with the token
	user = user.toObject();
	if(user.salt) delete user.salt;
	if(user.hash) delete user.hash;

	//instantiate token to sign
	return jwt.sign(user, config.secret, { expiresInMinutes: 1 });
}

//================================================================================
// Module
//================================================================================
module.exports = {
	local: function(req, res, next) {
		//authenticate request with passport
		passport.authenticate('local', function(error, user) {
			if(error) return next(error);
            if(!user) return res.send(401, 'Invalid credentials.');

            //send signed token upon successful login
            res.send(200, getSignedToken(user));
		})(req, res, next);
	},
    google: function(req, res, next) {
        passport.authenticate('google', function(err, user) {
            if(err) return next(err);
            if(!user) return res.send(401, 'User record not found.');

            res.cookie('token', getSignedToken(user));
            res.redirect('/');
        })(req, res, next);
    },
    salesforce: function(req, res, next) {
        passport.authenticate('forcedotcom', function(err, user) {
            if(err) return next(err);
            if(!user) return res.send(401, 'User record not found.');

            res.cookie('token', getSignedToken(user));
            res.redirect('/');
        })(req, res, next);
    },
    github: function(req, res, next) {
        passport.authenticate('github', function(err, user) {
            if(err) return next(err);
            if(!user) return res.send(401, 'User record not found.');

            res.cookie('token', getSignedToken(user));
            res.redirect('/');
        })(req, res, next);
    },
	logout: function(req, res) {
		console.log('user:', req.user);
        res.clearCookie('auth');
        res.send(200);
	}
};