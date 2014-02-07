'use strict';
//================================================================================
// Libraries
//================================================================================
var User = require('../models/User');

//================================================================================
// Functions
//================================================================================
function saveUser(userInfo, callback) {
    var newUser = new User({
        name: {
            first: userInfo.firstName,
            last: userInfo.lastName
        },
        email: userInfo.email,
        status: 'Offline'
    }).setPassword(userInfo.password, function(newUser) {
        console.log('password set:', newUser);
        newUser.save(function(err){
            if(err) callback(err);
            callback(null, userInfo);
        });
    });
}

// function findOrCreateGoogleUser(firstName, lastName, email, callback) {
//     User.findOne({email: email}, function(err, user){
//         if(!user) {
//             user = new User({
//                 name: {
//                     first: firstName,
//                     last: lastName
//                 },
//                 email: email,
//                 provider: 'google',
//                 status: 'Online'
//             });

//             user.save(function(err, user){
//                 if(err) {
//                     callback(err);
//                 } else {
//                     callback(null, user);
//                 }
//             });
//         }
//         else {
//             callback(null, user);
//         }

//     });
// }

//================================================================================
// Module
//================================================================================
module.exports = {
	register: function(req, res, next){
	    //TODO: verify request body

	    saveUser(req.body, function(err, user) {
            if(err) {
                next(err);
            } else {
                res.send(200, user);
            }
	    });
	}
};