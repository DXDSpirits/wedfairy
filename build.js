
var requirejs = require('requirejs');

var build = function() {
    requirejs.optimize({
        baseUrl: __dirname + '/assets/javascripts/storytell',
        name: '../storytell',
        out: __dirname + '/assets/javascripts/storytell-built.js'
    }, function (buildResponse) {
        console.log(buildResponse);
    }, function(err) {
        console.log(err);
    });
};

module.exports = build;
