'use strict';
//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var mongoose = require('mongoose');
var config = require('./config');

//-------------------------------------------------------------------------
// Module
//-------------------------------------------------------------------------
module.exports = {
    startup: function() {
        //check connection to mongodb
        mongoose.connection.on('open', function() {
            console.log('--- connected to mongodb ---');
        });
        mongoose.connect(config.mongoUri);
    }
};