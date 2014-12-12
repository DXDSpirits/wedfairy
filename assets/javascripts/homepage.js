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
        'padding-top': ($(window).height() - $('#view-hero > .container').outerHeight()) / 2
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
    
    if (!Amour.isMobile) {
        $('.wechat').attr('href', null);
    } else {
        $('.wechat').removeClass('wechat');
    }
    
    var App = window.App = {};
    
    var SectionViews = {};
    
    SectionViews['features'] = new (Amour.View.extend({
        events: {
            'mouseover .feature': 'hover'
        },
        initView: function() {
            this.feature == 0;
            for (var i=1; i<=4; i++) {
                var image = new Image();
                image.src = Amour.imageFullpath(['images/homepage/feature-', i, '.png'].join(''));
            }
        },
        hover: function(e) {
            var $target = $(e.currentTarget);
            var feature = $target.data('feature');
            if (feature == this.feature) return;
            this.feature = feature;
            var $img = this.$('.iphone-wrapper .img');
            var src = ['images/homepage/feature-', feature, '.png'].join('');
            $img.animate({
                opacity: 0
            }, 100, function() {
                Amour.loadBgImage($img, src);
                $img.animate({
                    opacity: 1
                }, 500);
            });
        },
        render: function() {}
    }))({el: $('#view-features')});
    
    SectionViews['gallery'] = new (Amour.View.extend({
        initView: function() {
            this.stories = new Amour.Collection();
            this.galleryView = new (Amour.CollectionView.extend({
                ModelView: Amour.ModelView.extend({
                    className: 'col-sm-4 col-md-3',
                    template: '<div class="safari-window animated fadeIn">' +
                              '<div class="safari-buttons-bar"><i></i><i></i><i></i></div>' +
                              '<div class="story-item img" data-bg-src="{{image}}">' +
                                  '<div class="dark-layer"><span>{{title}}</span></div>' +
                              '</div>' + '</div>',
                    events: { 'click .story-item': 'onClick' },
                    onClick: function() {
                        window.open('http://story.wedfairy.com/story/' + this.model.get('name'), '_blank');
                    }
                })
            }))({
                el: this.$('.gallery'),
                collection: this.stories
            });
        },
        render: function() {
            this.stories.reset([
                {
                    id: 1, name: 'naturalcurly', title: '蜂蜜罐头',
                    image: 'http://tatup.qiniudn.com/o_18v2sopo9pbo1kt9tdj1g1nvg9c.jpg'
                }, {
                    id: 2, name: 'xiaolei', title: '当爱射进球门',
                    image: 'http://tatup.qiniudn.com/o_18uq2tv092ou17jtmn1o571e3h9.jpg'
                }, {
                    id: 3, name: 'qidlove', title: 'QiQi & XD',
                    image: 'http://tatup.qiniudn.com/o_18s85df0c4iknei1jtd38mi9uj.jpg!thumbnail'
                }, {
                    id: 4, name: 'B18F79', title: '逆袭的爱情',
                    image: 'http://tatup.qiniudn.com/o_18uqqn6js1k9p6mj1qa81ap21jid7.jpg'
                }, {
                    id: 5, name: 'c92280', title: '择一城终老，遇一人白首',
                    image: 'http://tatup.qiniudn.com/o_18ut953i51ig383fta0178k1ia87.jpg'
                }, {
                    id: 6, name: 'FD2C14', title: '时常一起犯二！',
                    image: 'http://tatup.qiniudn.com/o_18ur3kp3jsqp10r51rcgao4jv97.jpg'
                }, {
                    id: 7, name: 'aef095', title: '藝叶知秋',
                    image: 'http://tatup.qiniudn.com/o_18vfk2t5h1s781ott13r81pd3g1j7.jpg'
                }, {
                    id: 8, name: 'fxfdz', title: '扬起风帆，铮爱启程',
                    image: 'http://tatup.qiniudn.com/o_191f51sggrsa18la24c1nv8141k1f.jpg'
                }
            ]);
        }
    }))({el: $('#view-gallery')});
    
    SectionViews['howto'] = new (Amour.View.extend({
        events: {
            'click .slider-item': 'slideOnClick',
            'click .slider-control': 'slideOnControl'
        },
        initView: function() {
            /*var hammertime = new Hammer(this.$('.slider-wrapper')[0]);
            var self = this;
            hammertime.on('swipeleft', function(ev) {
                self.slideTo(self.mean + 1);
            });
            hammertime.on('swiperight', function(ev) {
                self.slideTo(self.mean - 1);
            });*/
        },
        slideOnControl: function(e) {
            var $control = $(e.currentTarget);
            this.slideTo($control.hasClass('left') ? this.mean - 1 : this.mean + 1);
        },
        slideOnClick: function(e) {
            var $item = $(e.currentTarget);
            var index = $item.prevAll('.slider-item').length;
            this.slideTo(index, $item);
        },
        slideTo: function(index, $item) {
            if (index == this.mean) return;
            if (this.sliding) return;
            this.sliding = true;
            var $itemList = this.$('.slider-item');
            $item = $item || $itemList.slice(index, index + 1);
            var dir = index > this.mean ? 'slideLeft' : 'slideRight';
            var dis = Math.abs(index - this.mean);
            var stepSpeed = this.speed / dis;
            var self = this;
            var $control = this.$('.slider-control');
            $control.addClass('invisible');
            _.delay(function() {
                $control.removeClass('invisible');
                self.sliding = false;
            }, this.speed);
            var animate = _.before(dis + 1, function() {
                self[dir](stepSpeed, animate);
            });
            _.delay(function() {
                animate();
                $itemList.removeClass('standout');
                $item.addClass('standout');
            }, 100);
        },
        slideRight: function(speed, callback) {
            var $lastItem = $('.slider-item').last();
            var style = this.calculateStyle(-1);
            $lastItem.clone().css(style).prependTo('.slider-wrapper');
            var animationEnd = _.after(this.n + 1, function() {
                $lastItem.remove();
                callback && callback();
            });
            var self = this;
            this.$('.slider-item').each(function(index) {
                var style = self.calculateStyle(index);
                $(this).animate(style, speed || self.speed, animationEnd);
            });
        },
        slideLeft: function(speed, callback) {
            var $firstItem = $('.slider-item').first();
            var style = this.calculateStyle(this.n + 1);
            $firstItem.clone().css(style).appendTo('.slider-wrapper');
            var animationEnd = _.after(this.n + 1, function() {
                $firstItem.remove();
                callback && callback();
            });
            var self = this;
            this.$('.slider-item').each(function(index) {
                var style = self.calculateStyle(index - 1);
                $(this).animate(style, speed || self.speed, animationEnd);
            });
        },
        calculateStyle: function(index) {
            var opacity = (index < 0 || index >= this.n) ? 0 : 1;
            if (index < this.mean) {
                return {
                    'width': this.itemWidth,
                    'height': this.itemWidth,
                    'top': this.itemWidth,
                    'left': index * this.itemWidth,
                    'opacity': opacity
                };
            } else if (index > this.mean) {
                return {
                    'width': this.itemWidth,
                    'height': this.itemWidth,
                    'top': this.itemWidth,
                    'left': this.gap * 2 + (index + 2) * this.itemWidth,
                    'opacity': opacity
                };
            } else {
                return {
                    'width': this.itemWidth * 3,
                    'height': this.itemWidth * 3,
                    'top': 0,
                    'left': this.gap + this.mean * this.itemWidth,
                    'opacity': opacity
                };
            }
        },
        initCircles: function() {
            var speed = this.speed = 600;
            var gap = this.gap = 10;
            var n = this.n = this.$('.slider-item').length;
            var mean = this.mean = (n >> 1);
            var wrapperWidth = this.wrapperWidth = this.$('.slider-wrapper').innerWidth();
            var itemWidth = this.itemWidth = (wrapperWidth - 2 * gap) / (n + 2);
            var wrapperHeight = this.wrapperHeight = itemWidth * 3;
            this.$('.slider-wrapper').css('height', wrapperHeight);
            var self = this;
            this.$('.slider-item').each(function(index) {
                var style = self.calculateStyle(index);
                $(this).css(style);
            });
            var $sliderControl = this.$('.slider-control');
            $sliderControl.filter('.left').css({
                'top': (wrapperHeight - $sliderControl.outerHeight()) / 2,
                'left': itemWidth * mean + gap
            });
            $sliderControl.filter('.right').css({
                'top': (wrapperHeight - $sliderControl.outerHeight()) / 2,
                'right': itemWidth * mean + gap
            });
        },
        render: function() {
            var self = this;
            var debounce = _.debounce(function() {
                self.initCircles();
            }, 100);
            $(window).resize(debounce);
            debounce();
        }
    }))({el: $('#view-howto')});
    
    SectionViews['globalFooter'] = new (Amour.View.extend({
        initView: function() {
            this.$('.visible-wechat').toggleClass('hidden', !Amour.isWeixin);
        }
    }))({el: $('#global-footer')});
    
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
        image.src = Amour.imageFullpath('images/homepage/wechat-share-image.jpg');
        var message = {
            "img_url" : image.src,
            "img_width" : "640",
            "img_height" : "640",
            "link" : [window.location.origin, '?radius=', radius + 1].join(''),
            "desc" : '我们用独特的方式为坠入爱河的你，用你最喜欢的照片和文字，讲出自己的爱情故事',
            "title" : '八音盒，会讲故事的婚礼邀请函'
        };
        var onBridgeReady = function () {
            if (!window.WeixinJSBridge) return;
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                WeixinJSBridge.invoke('sendAppMessage', message);
            });
            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                var msg = _.clone(message);
                msg.title = '八音盒，一个会讲故事的婚礼邀请函';
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
        var windowHeight = $(window).height();
        var $navbar = $('#global-navbar');
        var navbarIn = $('#view-hero').outerHeight();
        var $workflow = $('#view-workflow');
        var workflowIn = $workflow.offset().top - windowHeight / 2;
        var $features = $('#view-features');
        var featuresIn = $features.offset().top - windowHeight / 2;
        var $howto = $('#view-howto');
        var howtoIn = $howto.offset().top - windowHeight / 2;
        var $gallery = $('#view-gallery');
        var galleryIn = $gallery.offset().top - windowHeight / 2;
        var onScroll = _.throttle(function() {
            var scrollTop = $(window).scrollTop();
            $navbar.toggleClass('rollup', scrollTop < navbarIn);
            $navbar.find('.collapse').removeClass('in');
            if (!Amour.isMobile) {
                $workflow.find('.container').toggleClass('invisible', scrollTop < workflowIn);
                $features.find('.container').toggleClass('invisible', scrollTop < featuresIn);
                $howto.find('.container').toggleClass('invisible', scrollTop < howtoIn);
                $gallery.find('.container').toggleClass('invisible', scrollTop < galleryIn);
            }
        }, 100);
        if (Amour.isMobile) {
            $workflow.find('.container').removeClass('invisible');
            $features.find('.container').removeClass('invisible');
            $howto.find('.container').removeClass('invisible');
            $gallery.find('.container').removeClass('invisible');
        }
        $(window).scroll(onScroll);
    };
    
    App.start = function() {
        bindWxSharing();
        initScroll();
        fillImages();
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
