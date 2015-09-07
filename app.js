require('newrelic');

var settings = require('./settings/settings');
var express = require('express');
var path = require('path');
//var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var sass = require('node-sass-middleware');
var wechat = require('./middlewares/wechat');

var app = express();

app.set('env', settings.ENV);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// local vars
app.locals.build_no = settings.BUILD || Date.now();
app.locals.static_url = '/assets/';
app.locals.cdn_url = settings.CDN_URL;
app.locals.api_root = settings.API_ROOT;
app.locals.tat_static = settings.TAT_STATIC;

// misc
//app.use(favicon(__dirname + '/assets/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(sass({
    src: __dirname + '/assets/stylesheets/',
    dest: __dirname + '/assets/stylesheets/',
    prefix:  '/assets/stylesheets/',
    imagePath: settings.CDN_URL + 'images',
    //includePaths: [__dirname + '/lib/'],
    debug: app.get('env') == 'development', // Output debugging information
    force: app.get('env') == 'development', // Always re-compile
    outputStyle: 'compressed'
}));
app.use(compress());
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    maxAge: app.get('env') === 'development' ? 0 : 86400000
}));

app.use(wechat.signUrl());

// routes
app.use('/', require('./routes/index'));
app.use('/about', require('./routes/about'));
app.use('/my', require('./routes/my'));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
    return ;
    // next(err);
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
