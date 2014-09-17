(function() {
    
    $('#view-hero').css({
        'min-height': $(window).height(),
        'padding-top': ($(window).height() - 260) / 2
    });
    
    $('body').on('click', 'a', function(e) {
        var target = $(e.currentTarget).attr('href');
        if (target && target[0] == '#') {
            e.preventDefault && e.preventDefault();
            $('body').animate({
                scrollTop: $(target).offset().top
            }, 1000);
        }
    });
    
    var onScroll = _.throttle(function() {
        $('#global-navbar').toggleClass('hidden', window.scrollY < $(window).height());
    }, 100);
    
    $(window).scroll(onScroll);
    
    var App = window.App = {};
    
    var SectionView = Amour.View.extend({});
    
    var HeroView = new (SectionView.extend({
        initView: function() {
            var days = Math.floor(((new Date('2014-08-03')) - (new Date())) / 86400000);
            this.$('>footer em').text(days);
        }
    }))({el: $('#view-hero')});
    
    var fillImages = function() {
        $('img[data-src]').each(function() {
            var src = $(this).data('src');
            src && Amour.loadImage($(this), src);
        });
        $('.img[data-bg-src]').each(function() {
            var src = $(this).data('bg-src');
            src && Amour.loadBgImage($(this), src);
        });
    };
    
    var bindWxSharing = function() {
        var match = window.location.search.match(/[\?\&]radius=(\d+)(&|$)/);
        var radius = match ? +match[1] : 0;
        var image = new Image();
        image.src = Amour.imageFullpath('images/homepage/hero-bg.jpg');
        var message = {
            "img_url" : image.src,
            "img_width" : "640",
            "img_height" : "640",
            "link" : [window.location.origin, '?radius=', radius + 1].join(''),
            "desc" : '我们用独特的方式为坠入爱河的你，用你最喜欢的照片和文字，讲出自己的爱情故事',
            "title" : '八音盒'
        };
        var onBridgeReady = function () {
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                WeixinJSBridge.invoke('sendAppMessage', message);
            });
            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                var msg = _.clone(message);
                msg.title = '八音盒，用独特的方式为你讲出自己的爱情故事';
                WeixinJSBridge.invoke('shareTimeline', msg);
            });
        };
        if (window.WeixinJSBridge) {
            onBridgeReady();
        } else {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }
    };
    
    App.start = function() {
        bindWxSharing();
        //$('.views-wrapper,.view').css('min-height', $(window).height());
        fillImages();
    };
    
    App.start();
    
})();
