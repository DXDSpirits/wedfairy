var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('wedding');
});

router.get('/newhome', function(req, res) {
    res.render('homepage');
});

router.get('/portfolio', function(req, res) {
    res.render('portfolio');
});

router.get('/ranking', function(req, res) {
    res.render('ranking');
});

module.exports = router;
