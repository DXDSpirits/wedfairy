define(function() {
    
    $('.views-wrapper').addClass('hidden');
    
    var App = {
        EventViewClass: {},
        EventViews: {}
    };
    
    App.vent = new Amour.EventAggregator();
    
    App.story = new Amour.Models.Story(BOOST.STORY_DATA);
    App.schema = new Amour.Models.Schema(BOOST.STORY_DATA.schemaDetail);
    App.theme = BOOST.STORY_DATA.theme || 'default';
    
    $('body').attr('data-theme', App.theme);
    
    $('body').on('click', 'a', function(e) {
        var target = $(e.currentTarget).attr('href');
        if (target && target[0] == '#') {
            e.preventDefault && e.preventDefault();
            App.scrollToElement(target);
        }
    });
    
    App.scrollToElement = function(target) {
        $('body').animate({
            scrollTop: $(target).offset().top
        }, 1000);
    };
    
    var templates = {};
    var fetchTemplates = function(callback) {
        var theme = App.theme;
        var TPL_PAIRS = App.story.storyEvents.map(function(storyEvent) {
            var name = storyEvent.get('name');
            var tpl_path = ['themes', theme, 'templates', name + '.tpl'].join('/');
            return [name, Amour.StaticURL + tpl_path];
        });
        var n = TPL_PAIRS.length;
        var startTime = _.now();
        _.each(TPL_PAIRS, function(pair) {
            var name = pair[0], src = pair[1];
            $.get(src, function(tpl) {
                templates[name] = tpl;
                if ((--n) == 0) {
                    var endTime = _.now();
                    ga('send', 'timing', 'Load', 'Load Templates', endTime - startTime);
                    callback();
                }
            });
        });
    };
    
    var cacheImages = function(callback) {
        var imageList = [];
        $('img[data-src]').each(function() {
            imageList.push($(this).data('src'));
        });
        $('.img[data-bg-src]').each(function() {
            imageList.push($(this).data('bg-src'));
        });
        imageList = _.compact(imageList);
        var $loadingScreen = $('.loading-screen');
        var loadingImage = App.story.getData('loadingImage');
        if (loadingImage) {
            $loadingScreen.addClass('fullscreen');
            Amour.loadBgImage($loadingScreen, loadingImage);
        }
        var startTime = _.now();
        var imageLoadEnd = _.once(function() {
            callback && callback();
            var endTime = _.now();
            ga('send', 'timing', 'Load', 'Load Images', endTime - startTime);
            if (Amour.isMobile && App.story.getData('lotteryImage')) {
                App.initLottery();
            }
            setTimeout(function() {
                $loadingScreen.animate({opacity: 0}, 1000, function() {
                    $(this).css({opacity: 1}).addClass('hidden');
                });
            }, 500);
        });
        var succ = new function() {
            var $percent = $loadingScreen.find('.loading-text>span');
            var loadingProgress = 1;
            var progressDelay = 200;
            var start = this.start = function() {
                if (loadingProgress <= 100) {
                    $percent.text(loadingProgress++);
                    _.delay(start, progressDelay);
                } else {
                    imageLoadEnd();
                }
            }
            this.rush = function() {
                progressDelay = 10;
            }
        };
        _.defer(succ.start);
        var hit = _.after(imageList.length + 1, succ.rush);
        _.defer(hit);
        _.each(imageList, function(imageSrc) {
            var image = new Image();
            image.onload = hit;
            image.onerror = hit;
            image.src = Amour.imageFullpath(imageSrc);
        });
    };
    
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
        var message = {
            "img_width" : "640",
            "img_height" : "640",
            "link" : [window.location.origin, '/story/', App.story.get('name'), '?radius=', radius + 1].join(''),
            "desc" : App.story.get('description'),
            "title" : App.story.get('title')
        };
        var coverImage = App.story.getData('coverImage');
        if (coverImage) {
            var img_url = Amour.imageFullpath(coverImage).split('?')[0];
            if (/qiniudn\.com/.test(img_url)) img_url += '!square';
            message['img_url'] = img_url;
        }
        var onBridgeReady = function () {
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                WeixinJSBridge.invoke('sendAppMessage', message);
            });
            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                WeixinJSBridge.invoke('shareTimeline', message);
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
        var $wrapper = $('.views-wrapper');
        var options = App.story.getData('options') || {};
        var theme = App.theme;
        App.story.storyEvents.forEach(function(storyEvent) {
            var name = storyEvent.get('name');
            var eventView = App.EventViews[name] = new App.EventViewClass[name]({
                id: 'view-' + name,
                template: templates[name],
                storyEvent: storyEvent
            });
            eventView.$el.attr('data-theme', theme).css('min-height', $(window).height());
            $wrapper.append(eventView.renderPage().el);
        });
        cacheImages(function() {
            fillImages();
            $wrapper.removeClass('hidden');
        });
        Amour.trigger('StorytellAppReady');
    };
    
    App.initMusic = function() {
        var music = App.story.getData('loadingMusic');
        if (music) {
            var audio = new Audio();
            audio.src = music;
            $('body').one('touchstart', function() {
                audio.play();
            });
        }
    }
    
    App.tell = function() {
        App.initMusic();
        Backbone.history.start();
        fetchTemplates(App.start);
    };
    
    return App;
});
