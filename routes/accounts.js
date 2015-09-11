var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();
var qiniu = require('qiniu');

// var routes = {
//     '': 'accounts',

// }

router.get('/change-password', function(req, res) {
    res.render('accounts/change-password');
});

// router.get('/', function(req, res) {
//     res.render('accounts/change-password');
// });

router.get('/forget-password', function(req, res) {
    res.render('accounts/forget-password');
});

module.exports = router;
