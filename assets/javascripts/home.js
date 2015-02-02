(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
})();

(function() {
    
    var App = window.App = {};
    
    var SectionViews = {};
    
    SectionViews['hero'] = new (Amour.View.extend({
        
    }))({el: $('#view-hero')});
    
    SectionViews['products'] = new (Amour.View.extend({
        
    }))({el: $('#view-products')});
    
    SectionViews['features'] = new (Amour.View.extend({
        
    }))({el: $('#global-features')});
    
    var bindWxSharing = function() {
        wx.config(WX_CONFIG);
        var ready = function() {
            var match = window.location.search.match(/[\?\&]radius=(\d+)(&|$)/);
            var radius = match ? +match[1] : 0;
            var link = [window.location.origin, '?radius=', radius + 1].join('');
            var image = new Image();
            image.src = Amour.imageFullpath('images/wedding/wechat-share-image.jpg');
            wx.onMenuShareTimeline({
                title: '八音盒，一个会讲故事的婚礼邀请函',
                link: link,
                imgUrl: image.src
            });
            wx.onMenuShareAppMessage({
                title: '八音盒，会讲故事的婚礼邀请函',
                desc: '我们用独特的方式为坠入爱河的你，用你最喜欢的照片和文字，讲出自己的爱情故事',
                link: link,
                imgUrl: image.src
            });
        };
        ready();
        wx.ready(ready);
    };
    
    var initScroll = function () {
        
    };
    
    App.start = function() {
        bindWxSharing();
        initScroll();
        _.each(SectionViews, function(view, name) {
            view.render();
        });
        _.delay(function() {
            $('#loading-screen').animate({
                opacity: 0
            }, 1000, function() {
                $(this).remove();
            });
        }, 3000);
    };
    
    App.start();
    
})();
