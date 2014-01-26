//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./models/User');
var config = require('./config');

//-------------------------------------------------------------------------
// Module
//-------------------------------------------------------------------------
module.exports = {
    startup: function(){
        mongoose.connect(config.mongoUri);
        //check connection to mongodb
        mongoose.connection.on('open', function(){
            console.log('--- connected to mongodb ---');
        });
    },
    saveUser: function(userInfo, callback){
        var newUser = new User({
            name: {
                first: userInfo.firstName,
                last: userInfo.lastName
            },
            email: userInfo.email,
            status: 'Offline'
        }).setPassword(userInfo.password, function(newUser){
            console.log('password set:', newUser);
            newUser.save(function(err){
                if(err) callback(err);
                callback(null, userInfo);
            });
        });
    },
    findOrCreateGoogleUser: function(firstName, lastName, email, callback){
        User.findOne({email: email}, function(erro, user){

            if(!user) {
                user = new User({
                    name: {
                        first: firstName,
                        last: lastName
                    },
                    email: email,
                    provider: 'google',
                    status: 'Online'
                });

                user.save(function(err, user){
                    if(err) callback(err);
                    callback(null, user);
                });
            }
            else {
                callback(null, user);
            }

        });
    },
    closeDB: function(){
        mongoose.disconnect();
    },
    getUsers: function(callback){
        //retrieves all users. selects only name and _id fields
        User.find({}, 'name _id', function(err, users){
            if(err) throw err;
            callback(null, users);
        });
    }
}; 