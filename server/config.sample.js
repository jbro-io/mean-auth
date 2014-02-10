'use strict';
//================================================================================
// Module
//================================================================================
module.exports = {
	mongoUri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/YOUR_DB_NAME',
	secret: process.env.JWT_SECRET || 'mysupersecret',
    google: {
        clientId: '',
        clientSecret: ''
    }
};