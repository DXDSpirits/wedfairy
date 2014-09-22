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
    
    $('#view-hero').css({
        'min-height': $(window).height(),
        'padding-top': ($(window).height() - 260) / 2
    });
    
    $('body').on('click', 'a', function(e) {
        var target = $(e.currentTarget).attr('href');
        if (target && target[0] == '#') {
            e.preventDefault && e.preventDefault();
            $('body,html').animate({
                scrollTop: $(target).offset().top
            }, 1000);
        }
    });
    
    var App = window.App = {};
    
    var SectionViews = {};
    
    SectionViews['gallery'] = new (Amour.View.extend({
        initView: function() {
            this.stories = new Amour.Collection();
            this.galleryView = new (Amour.CollectionView.extend({
                ModelView: Amour.ModelView.extend({
                    className: 'col-sm-3 safari-window animated fadeIn',
                    template: '<div class="safari-buttons-bar"><i></i><i></i><i></i></div>' + 
                              '<div class="story-item img"><div class="dark-layer"><span>{{name}}</span></div></div>',
                    
                })
            }))({
                el: this.$('.gallery'),
                collection: this.stories
            });
        },
        render: function() {
            this.stories.reset([
                {
                    id: 1,
                    name: 'QiQi & XD'
                }, {
                    id: 2,
                    name: 'QiQi & XD'
                }, {
                    id: 3,
                    name: 'QiQi & XD'
                }, {
                    id: 4,
                    name: 'QiQi & XD'
                }, {
                    id: 5,
                    name: 'QiQi & XD'
                }, {
                    id: 6,
                    name: 'QiQi & XD'
                }, {
                    id: 7,
                    name: 'QiQi & XD'
                }, {
                    id: 8,
                    name: 'QiQi & XD'
                }
            ])
        }
    }))({el: $('#view-gallery')});
    
    SectionViews['howto'] = new (Amour.View.extend({
        events: {
            'click .slider-item': 'slideOnClick'
        },
        initView: function() {},
        slideOnClick: function(e) {
            var $item = $(e.currentTarget);
            var index = $item.prevAll().length;
            if (index == this.mean) return;
            var dir = index > this.mean ? 'slideLeft' : 'slideRight';
            var dis = Math.abs(index - this.mean);
            var speed = 600 / dis;
            var self = this;
            var animate = _.before(dis + 1, function() {
                self[dir](speed, animate);
            });
            this.$('.slider-item').removeClass('standout');
            animate();
            $item.addClass('standout');
        },
        calculateStyle: function(index) {
            var fullWidth = this.itemWidth + this.gap;
            var opacity = (index < 0 || index >= this.n) ? 0 : 1;
            if (index < this.mean) {
                return {
                    'width': this.itemWidth,
                    'height': this.itemWidth,
                    'top': this.itemWidth / 2,
                    'left': index * fullWidth,
                    'opacity': opacity
                };
            } else if (index > this.mean) {
                return {
                    'width': this.itemWidth,
                    'height': this.itemWidth,
                    'top': this.itemWidth / 2,
                    'left': this.gap + (index + 1) * fullWidth,
                    'opacity': opacity
                };
            } else {
                return {
                    'width': this.itemWidth * 2,
                    'height': this.itemWidth * 2,
                    'top': 0,
                    'left': this.gap + this.mean * fullWidth,
                    'opacity': opacity
                };
            }
        },
        slideRight: function(speed, callback) {
            var $lastItem = $('.slider-item:last-child');
            var style = this.calculateStyle(-1);
            $lastItem.clone().css(style).prependTo('.slider-wrapper');
            var animationEnd = _.after(this.n + 1, function() {
                $lastItem.remove();
                callback && callback();
            });
            var self = this;
            this.$('.slider-item').each(function(index) {
                var style = self.calculateStyle(index);
                $(this).animate(style, speed || 1000, animationEnd);
            });
        },
        slideLeft: function(speed, callback) {
            var $firstItem = $('.slider-item:first-child');
            var style = this.calculateStyle(this.n + 1);
            $firstItem.clone().css(style).appendTo('.slider-wrapper');
            var animationEnd = _.after(this.n + 1, function() {
                $firstItem.remove();
                callback && callback();
            });
            var self = this;
            this.$('.slider-item').each(function(index) {
                var style = self.calculateStyle(index - 1);
                $(this).animate(style, speed || 1000, animationEnd);
            });
        },
        render: function() {
            var gap = this.gap = 10;
            var n = this.n = this.$('.slider-item').length;
            var mean = this.mean = (n >> 1);
            var wrapperWidth = this.wrapperWidth = this.$('.slider-wrapper').innerWidth();
            var itemWidth = this.itemWidth = (wrapperWidth - (n + 1) * gap) / (n + 1);
            this.$('.slider-wrapper').css('height', itemWidth * 2);
            var self = this;
            this.$('.slider-item').each(function(index) {
                var style = self.calculateStyle(index);
                $(this).css(style);
            });
        }
    }))({el: $('#view-howto')});
    
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
    
    var initScroll = function () {
        var navbarIn = $('#view-hero').outerHeight();
        var $workflow = $('#view-workflow');
        var workflowIn = $workflow.offset().top - $workflow.outerHeight() / 2;
        var $features = $('#view-features');
        var featuresIn = $features.offset().top - $features.outerHeight() / 2;
        var $gallery = $('#view-gallery');
        var galleryIn = $gallery.offset().top - $gallery.outerHeight() / 2;
        var onScroll = _.throttle(function() {
            var scrollTop = $(window).scrollTop();
            $('#global-navbar').toggleClass('rollup', scrollTop < navbarIn);
            $workflow.find('.container').toggleClass('invisible', scrollTop < workflowIn);
            $features.find('.container').toggleClass('invisible', scrollTop < featuresIn);
            $gallery.find('.container').toggleClass('invisible', scrollTop < galleryIn);
        }, 500);
        $(window).scroll(onScroll);
    };
    
    App.start = function() {
        bindWxSharing();
        initScroll();
        fillImages();
        _.each(SectionViews, function(view, name) {
            view.render();
        });
    };
    
    App.start();
    
})();
