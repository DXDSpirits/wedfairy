var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();
var qiniu = require('qiniu');

var routes = {
    '': 'my',

};

router.get('/', function(req, res) {
    res.render('my/my');
});

router.get('/gallery', function(req, res) {
    res.render('my/mygallery');
});

router.get('/music', function(req, res) {
    res.render('my/mymusic');
});

module.exports = router;
