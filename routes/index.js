var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/newhome', function(req, res) {
    res.render('home');
});

router.get('/wedding', function(req, res) {
    res.render('wedding');
});

router.get('/portfolio', function(req, res) {
    res.render('portfolio');
});

router.get('/ranking', function(req, res) {
    res.render('ranking');
});


// some static pages
router.get('/joinus', function(req, res) {
    res.render('page/job');
});

router.get('/contactus', function(req, res) {
    res.render('page/contact');
});

router.get('/aboutus', function(req, res) {
    res.render('page/about');
});

// explore 
router.get('/explore', function(req, res) {
    res.render('explore');
});


module.exports = router;






