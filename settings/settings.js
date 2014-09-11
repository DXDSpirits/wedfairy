var fs = require('fs');

var CONFIG = {
    ENV : 'production',

    CDN_URL : 'http://wedfairy.qiniudn.com/',

    API_HOST : 'http://api.wedfairy.com',
    API_HOSTNAME : 'api.wedfairy.com',
    API_PORT : 80,
    API_PROTOCOL : 'http',
};

try {
    var CONFIG_LOCAL = require('./settings_local');
    for (var prop in CONFIG_LOCAL) {
        CONFIG[prop] = CONFIG_LOCAL[prop];
    }
} catch (e) {}

fs.closeSync(fs.openSync(__dirname + '/../assets/stylesheets/_local.scss', 'a'));

module.exports = CONFIG;
