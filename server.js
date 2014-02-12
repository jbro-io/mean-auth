'use strict';
//================================================================================
// Libraries
//================================================================================
var express            = require('express');
var path               = require('path');
var passport           = require('passport');
var cors               = require('./server/controllers/cors');
var globalErrorHandler = require('./server/error');
var routes             = require('./server/routes');
var db                 = require('./server/db');

//================================================================================
// Properties
//================================================================================
var app  = express();
var port = process.env.PORT || 7000;

//================================================================================
// Configuration
//================================================================================
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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
app.use(cors());                                            //CORS implementation
app.use(express.compress());                                //Compress response data with gzip / deflate. This middleware should be placed "high" within the stack to ensure all responses may be compressed.
app.use(express.bodyParser());                              //Request body parsing middleware supporting JSON, urlencoded, and multipart requests. This middleware is simply a wrapper for the json(), urlencoded(), and multipart() middleware.
app.use(express.methodOverride());                          //Faux HTTP method support. Use if you want to simulate DELETE/PUT
app.use(express.static(path.join(__dirname, 'client')));    //serve up static files (html, js, css, etc.)
app.use(passport.initialize());                             //initializes passport
app.use(app.router);                                        //application routes
app.use(globalErrorHandler);                                //handles all unresolved errors from the next() method

//================================================================================
// Initialization
//================================================================================
db.startup();   //initializes our database
routes(app);    //wires up all our routes

app.listen(port, function() {
  console.log('Listening on ' + port);
});