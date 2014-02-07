'use strict';
//================================================================================
// Module
//================================================================================
module.exports = {
	mongoUri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/dialer',
	secret: process.env.JWT_SECRET || 'mysupersecret'
};