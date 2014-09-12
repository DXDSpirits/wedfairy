var settings = require('./settings/settings');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');

var app = express();

app.set('env', settings.ENV);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// local vars
app.locals.build_no = settings.BUILD || Date.now();
app.locals.static_url = '/assets/';
app.locals.cdn_url = settings.CDN_URL;
app.locals.api_host = settings.API_HOST;

// misc
app.use(favicon(__dirname + '/assets/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('node-compass')({
    cache: app.get('env') !== 'development',
    project: path.join(__dirname, 'assets'),
    sass: '.',
    css: '.'
}));
app.use(compress());
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    maxAge: app.get('env') === 'development' ? 0 : 86400000
}));

// routes
app.use('/', require('./routes/index'));
app.use('/story', require('./routes/storytell'));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status || 500,
        stack: err.stack
    });
});

if (app.get('env') !== 'development') {
    require('./build')();
}

module.exports = app;
