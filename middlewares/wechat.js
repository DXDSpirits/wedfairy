var settings = require('../settings/settings.js');
var http = require('http');
var APIRoot = settings.API_ROOT;


function createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}

function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + '';
}

function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function(key) {
        newArgs[key.toLowerCase()] = args[key];
    });
    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
}

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须与调用 JSAPI 时的页面 URL 完全一致
 *
 * @returns
 */
function sign(jsapi_ticket, url) {
    var ret = {
        jsapi_ticket : jsapi_ticket,
        nonceStr : createNonceStr(),
        timestamp : createTimestamp(),
        url : url
    };
    var string = raw(ret);
    jsSHA = require('jssha');
    shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');
    return ret;
}

function request(url, success) {
    http.get(url, function(res) {
        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            success && success(JSON.parse(data));
        });
    }).on('error', function(e) {
        console.error(e.message);
    });
}

var WECHAT_ACCESS_TOKEN = '';
var WECHAT_TICKET = '';
var WECHAT_APPID = '';

(function repeat() {
    console.log('Update Wechat JSAPI Ticket');
    var url = APIRoot + 'clients/wechat-jsapi-ticket/';
    request(url, function(res) {
        WECHAT_TICKET = res.ticket;
        WECHAT_APPID = res.appid;
        WECHAT_ACCESS_TOKEN = res.access_token;
        console.log(JSON.stringify(res));
    });
    setTimeout(repeat, 1800 * 1000);
})();

exports.signUrl = function() {
    return function(req, res, next) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var sig = sign(WECHAT_TICKET, fullUrl);
        res.locals.wx_config = {
            appId: WECHAT_APPID,
            timestamp: sig.timestamp,
            nonceStr: sig.nonceStr,
            signature: sig.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage', 'previewImage']
        };
        next();
    };
};

exports.getAccessToken = function() {
    return WECHAT_ACCESS_TOKEN;
};
