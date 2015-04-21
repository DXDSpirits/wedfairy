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

// explore 
router.get('/explore', function(req, res) {
    res.render('explore');
});

router.get('/quick-create', function(req, res) {
    res.render('quick-create');
});




module.exports = router;






