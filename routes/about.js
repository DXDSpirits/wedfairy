
var express = require('express');
var router = express.Router();

var routes = {
    '': 'about',
    'joinus': 'job',
    'contactus': 'contact',
    'law': 'law',
    'faq': 'faq',
    'press': 'press',
    'guide': 'guide',
    'team': 'team'
}

router.get('/', function(req, res) {
    res.render('about/about');
});

router.get('/:name', function(req, res) {
    var name = req.params.name;
    res.render('about/' + routes[name||'']);
});

module.exports = router;
