var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();
var qiniu = require('qiniu');

router.get('/', function(req, res) {
    //res.render('home');
    res.render('homepage');
});

router.get('/corslogin/:token', function(req, res, next) {
    var token = req.params.token;
    res.render('corslogin', {
        token: token
    });
});

router.get('/create', function(req, res) {
    res.render('create');
});

router.get('/newhome', function(req, res) {
    res.redirect('/');
});

router.get('/wedding', function(req, res) {
    res.render('wedding');
});

router.get('/portfolio', function(req, res) {
    res.redirect('/staff/portfolio');
});

router.get('/staff/portfolio', function(req, res) {
    res.render('portfolio');
});

router.get('/staff/uploadmusic', function(req, res) {
    res.render('uploadmusic');
});

router.get('/staff/analytics', function(req, res) {
    res.render('analytics');
});

router.get('/ranking', function(req, res) {
    res.render('ranking');
});

// explore
router.get('/explore', function(req, res) {
    res.render('explore-home');
});

// explore
router.get('/explore/:filterName', function(req, res) {
    var filterName = req.params.filterName;
    res.render('explore', {
        filterName: filterName
    });
});

//contact
router.get('/contact', function(req, res) {
    res.redirect('about/contactus');
});

//uploadmusic

qiniu.conf.ACCESS_KEY = settings.QINIUMUSIC.ACCESS_KEY;
qiniu.conf.SECRET_KEY = settings.QINIUMUSIC.SECRET_KEY;

var putPolicy = new qiniu.rs.PutPolicy(settings.QINIUMUSIC.BUCKET_NAME);
router.get('/music/uptoken', function(req, res, next) {
    var token = putPolicy.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});

//upload image
var putPolicyImg = new qiniu.rs.PutPolicy(settings.QINIUIMG.BUCKET_NAME);
router.get('/gallery/uptoken', function(req, res, next) {
    var token = putPolicyImg.token();
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token
        });
    }
});


module.exports = router;
