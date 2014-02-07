'use strict';
//================================================================================
// Libraries
//================================================================================
var express = require('express');
var path    = require('path');
var passport = require('passport');
var cors = require('./server/controllers/cors');
var globalErrorHandler = require('./server/error');
var routes = require('./server/routes');
var db = require('./server/db');

//================================================================================
// Properties
//================================================================================
var app = express();
var port = process.env.PORT || 7000;

//================================================================================
// Configuration
//================================================================================
app.configure('development',function() {
    console.log('!! DEVELOPMENT MODE !!');
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    console.log('!! PRODUCTION MODE !!');
    app.use(express.logger());
    app.use(express.errorHandler());
});

//================================================================================
// Middleware
//================================================================================
app.use(cors());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));
app.use(globalErrorHandler);

//================================================================================
// Server
//================================================================================
db.startup();
routes(app);

app.listen(port, function() {
  console.log('Listening on ' + port);
});