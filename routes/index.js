var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('homepage');
});

router.get('/desktop', function(req, res) {
    res.render('desktop', {
        url: req.query.url || '/'
    });
});

module.exports = router;
