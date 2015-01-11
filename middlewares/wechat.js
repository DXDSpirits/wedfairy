var settings = require('../settings/settings.js');
var https = require('https');

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
    https.get(url, function(res) {
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

var WECHAT_TICKET = '';

(function repeat() {
    console.log('Update Wechat JSAPI Ticket');
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential' +
              '&appid=' + settings.WECHAT.APPID + 
              '&secret=' + settings.WECHAT.APPSECRET;
    request(url, function(res) {
        console.log(JSON.stringify(res));
        var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi' +
                  '&access_token=' + res.access_token;
        request(url, function(res) {
            console.log(JSON.stringify(res));
            WECHAT_TICKET = res.ticket;
        });
    });
    setTimeout(repeat, 3600 * 1000);
})();

module.exports = function() {
    return function(req, res, next) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        var sig = sign(WECHAT_TICKET, fullUrl);
        res.locals.wx_config = {
            appId: settings.WECHAT.APPID,
            timestamp: sig.timestamp,
            nonceStr: sig.nonceStr,
            signature: sig.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
        };
        next();
    };
};
