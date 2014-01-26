//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var bcrypt = require('bcrypt');

//-------------------------------------------------------------------------
// Schema Definition
//-------------------------------------------------------------------------
var UserSchema = new Schema({
	name: {
		first: { type:String, required: false },
		last: { type:String, required: false }
	},
	email: { type:String, required: true },
	status: { type:String, required: false },
	facebook: {
		id: { type:String },
		token: { type:String }
	},
	google: {
		id: { type:String },
		token: { type:String }
	},
	salesforce: {
		id: { type:String },
		token: { type:String }
	},
	createdDate: { type: Date, default: Date.now },
	lastLogin: { type:Date },

	//password
	salt: { type:String, required: false, select: false },
	hash: { type:String, required: false, select: false }
});

//-------------------------------------------------------------------------
// Methods
//-------------------------------------------------------------------------
UserSchema.methods.setPassword = function(password, done){
	var self = this;
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(password, salt, function(err, hash){
			self.hash = hash;
			self.salt = salt;
			done(self);
		});
	});
}

UserSchema.method('verifyPassword', function(password, callback){
	bcrypt.compare(password, this.hash, callback);
})

UserSchema.static('authenticate', function(email, password, callback){
	//lookup user by email
	this.findOne({email:email}, '+salt +hash', function(err, user){
		if(err) return callback(err);
		if(!user) return callback(null, false);

		user.verifyPassword(password, function(err, passwordCorrect){
			if(err) return callback(err);
			if(!passwordCorrect) return callback(null, false);

			user.lastLogin = new Date();
			user.save(function(err, user){
				if(err) return callback(err);
				return callback(null, user);
			});
		})
	})
})

UserSchema.static('authenticateGoogle', function(identifier, profile, callback){
	this.findOne({provider: 'google', email: identifier}, function(err, user){
		if(err) return callback(err);
		if(!user) return callback(null, false);

		return callback(null, user);
	})
})

//-------------------------------------------------------------------------
// Module
//-------------------------------------------------------------------------
module.exports = mongoose.model('User', UserSchema);