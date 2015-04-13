var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

// some static pages
router.get('/joinus', function(req, res) {
    res.render('page/job');
});

router.get('/contactus', function(req, res) {
    res.render('page/contact');
});

router.get('/', function(req, res) {
    res.render('page/about');
});

// help + law
router.get('/law', function(req, res) {
    res.render('page/law');
});

router.get('/help', function(req, res) {
    res.render('page/help');
});

module.exports = router;
