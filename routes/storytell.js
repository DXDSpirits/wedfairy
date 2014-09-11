var express = require('express');
var router = express.Router();

var stories = require('../models/stories');

router.param('storyName', function(req, res, next, storyName) {
    if (!/^[-a-zA-Z0-9_]+$/.test(storyName)) return;
    var success = function(story) {
        req.story = story;
        next();
    };
    var error = function(message) {
        var err = new Error(message);
        err.status = 404;
        next(err);
    };
    stories.getStoryByName(storyName, success, error);
});

router.get('/:storyName', function(req, res, next) {
    var story = req.story;
    res.render('storytell', {
        title: story.title,
        story: story,
        theme: story.theme || 'default'
    });
});

module.exports = router;
