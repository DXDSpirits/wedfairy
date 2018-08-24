
var CONFIG = {
    ENV : 'production',

    TAT_STATIC : 'https://static.wedfairy.com/',

    API_ROOT : 'https://api.wedfairy.com/api/',
    API_HOST : 'https://api.wedfairy.com',
    API_HOSTNAME : 'api.wedfairy.com',
    API_PORT : 80,
    API_PROTOCOL : 'http',

    CDN_URL : '/assets/',

    QINIUMUSIC: {
        ACCESS_KEY: '',
        SECRET_KEY: '',
        BUCKET_NAME: ''
    },

    QINIUIMG: {
        ACCESS_KEY: '',
        SECRET_KEY: '',
        BUCKET_NAME: ''
    }
};

try {
    var CONFIG_LOCAL = require('./settings_local');
    for (var prop in CONFIG_LOCAL) {
        CONFIG[prop] = CONFIG_LOCAL[prop];
    }
} catch (e) {}

module.exports = CONFIG;
