//-------------------------------------------------------------------------
// Libraries
//-------------------------------------------------------------------------
var express = require("express");
var path    = require('path');
var DB = require('./server/db-connector');
var passport = require('passport');

//-------------------------------------------------------------------------
// Variables
//-------------------------------------------------------------------------
var app = express();
var db;
var allowedDomains;

//-------------------------------------------------------------------------
// App Setup
//-------------------------------------------------------------------------
app.configure('development',function(){
    console.log('!! DEVELOPMENT MODE !!');
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    //CORS - Allowed Domains (Development)
    allowedDomains = [];
});

app.configure('production', function(){
    console.log('!! PRODUCTION MODE !!');
    app.use(express.logger());
    app.use(express.errorHandler());

    //CORS - Allowed Domains (Production)
    allowedDomains = [];
});

var allowCrossDomain = function(req, res, next){
    //check if request origin is in allowed domains list
    if(allowedDomains.indexOf(req.headers.origin) != -1)
    {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    }

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) 
    {
        res.send(200);
    }
    else 
    {
        next();
    }
};

app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'client')));

//-------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------
db = new DB.startup();

require('./server/routes')(app);

var port = process.env.PORT || 7000;
app.listen(port, function() {
  console.log("Listening on " + port);
});