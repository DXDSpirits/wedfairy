
var CONFIG = {
    ENV : 'production',

    TAT_STATIC : 'http://static.wedfairy.com/',

    API_ROOT : 'http://api.wedfairy.com/api/',
    API_HOST : 'http://api.wedfairy.com',
    API_HOSTNAME : 'api.wedfairy.com',
    API_PORT : 80,
    API_PROTOCOL : 'http',

    CDN_URL : '/assets/',

    QINIUMUSIC: {
        ACCESS_KEY: '',
        SECRET_KEY: '',
        BUCKET_NAME: '',
        UPTOKEN_URL: '',
        DOMAIN: ''
    }
};

try {
    var CONFIG_LOCAL = require('./settings_local');
    for (var prop in CONFIG_LOCAL) {
        CONFIG[prop] = CONFIG_LOCAL[prop];
    }
} catch (e) {}

module.exports = CONFIG;
