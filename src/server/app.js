/*jshint node:true*/
'use strict';

var fs = require('fs');
var https = require('https');
var http = require('http');
var forceSSL = require('express-force-ssl');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 8000;
var four0four = require('./utils/404')();

var environment = process.env.NODE_ENV;

function rawBody(req, res, next) {
  req.setEncoding('utf8');
  req.rawBody = '';
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function(){
    next();
  });
}

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(rawBody);
app.use(logger('dev'));

//NEW PERE
var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false}
}));
var passport = require('passport');
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
//END NEW

app.use('/api', require('./routes'));

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
  case 'build':
    console.log('** BUILD **');
    app.use(express.static('./build/'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./build/index.html'));
    console.log('WARNING: OPEN BROWSER WITH HTTPS');
    https.createServer({
      key: fs.readFileSync('privkey1.pem'),
      cert: fs.readFileSync('cert1.pem')
    }, app).listen(port);

    app.use(forceSSL); //MODULE USED TO FORCE REDIRECTION
    console.log('WARNING: BE CAREFULL, WE ARE TRYING TO LAUNCH SERVER ON PORT 80.' +
                'CHECK IF ANY OTHER SERVER IS LISTENING ON SAME PORT (APACHE...)' +
                'WE WANT TO FORCE HTTP TO HTTPS REDIRECTION ALWAYS');

    http.createServer(app).listen(80);
    break;
  default:
    console.log('** DEV **');
    //app.use(express.static('./src/client/'));
    app.use(express.static('./'));
    //app.use(express.static('./tmp'));
    // Any invalid calls for templateUrls are under app/* and should return 404
    app.use('/app/*', function(req, res, next) {
      four0four.send404(req, res);
    });
    // Any deep link calls should return index.html
    app.use('/*', express.static('./src/client/index.html'));
    app.listen(port, function() {
      console.log('Express server listening on port ' + port);
      console.log('env = ' + app.get('env') +
      '\n__dirname = ' + __dirname +
      '\nprocess.cwd = ' + process.cwd());
    });
    break;
}
