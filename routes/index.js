var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('homepage');
});

router.get('/portfolio', function(req, res) {
    res.render('portfolio');
});

module.exports = router;
