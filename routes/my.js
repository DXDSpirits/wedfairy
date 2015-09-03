
var express = require('express');
var router = express.Router();

var routes = {
    '': 'my',

}

router.get('/', function(req, res) {
    res.render('my/my');
});

// router.get('/:name', function(req, res) {
//     var name = req.params.name;
//     res.render('my/' + routes[name||'']);
// });

// explore 
router.get('/:filterName', function(req, res) {
    var filterName = req.params.filterName;
    res.render('my/my', {
        filterName: filterName
    });
});
module.exports = router;
