var db = require('../db-connector');
var User = require('../models/User');

module.exports = {
	register: function(request, response){
	    //TODO: verify request body

	    var newUser = request.body;
	    newUser.provider = 'local';

	    db.saveUser(newUser, function(err, user){
	    	if(err) response.send(400, err);
	    	
	    	response.send(200, user);
	    });
	},
	allUsers: function(request, response){

		db.getUsers(function(err, users){
			if(err) response.send({error: err});

			response.send(200, users);
		});

	},
	usersWithGroups: function(request, response) {

		User.find({})
			.populate('groups')
			.exec(function(err, users){
				if(err) console.log('usersWithGroups::ERROR:', err);
				response.send(users);
			});

	},
	usersAndGroups: function(request, response, next) {

		db.getUsersAndGroups(function(err, data){
			if(err) {
				next(err);
			} else {
				response.send(data);
			}
		})
	}
}