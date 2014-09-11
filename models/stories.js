var settings = require('../settings/settings.js');
var http = require('http');
var BufferHelper = require('./bufferhelper');
var APIHost = settings.API_HOST;


exports.getStoryByName = function(name, success, error) {
    http.get(APIHost + '/sites/storyname/' + name + '/', function(res) {
        if (res.statusCode == 404) {
            error && error('Cannot find story with name "' + name + '"');
        } else {
            var bufferHelper = new BufferHelper();
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('end', function() {
                success && success(JSON.parse(bufferHelper.toBuffer().toString()));
            });
        }
    }).on('error', function(e) {
        error && error(e.message);
    });
};


exports.getStoryById = function(id, success, error) {
    http.get(APIHost + '/sites/story/' + id + '/', function(res) {
        if (res.statusCode == 404) {
            error && error('Cannot find story with ID "' + id + '"');
        } else {
            var bufferHelper = new BufferHelper();
            res.on('data', function(chunk) {
                bufferHelper.concat(chunk);
            });
            res.on('end', function() {
                success && success(JSON.parse(bufferHelper.toBuffer().toString()));
            });
        }
    }).on('error', function(e) {
        error && error(e.message);
    });
};
