(function() {
    
    $('body').on('click', 'a', function(e) {
        var target = $(e.currentTarget).attr('href');
        if (target && target[0] == '#') {
            e.preventDefault && e.preventDefault();
            $('body').animate({
                scrollTop: $(target).offset().top
            }, 1000);
        }
    });
    
    var App = {};
    
    var SectionView = Amour.View.extend({});
    
    var StoriesView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: { 'click': 'viewStory' },
            className: 'story-item',
            template: function() {
                if (this.model.get('even')) {
                    return '<span class="img" data-bg-src="{{image}}"></span>' +
                           '<span class="text text-right">{{{text}}}<br><mark>(点击查看)</mark></span>';
                } else {
                    return '<span class="text text-left">{{{text}}}<br><mark>(点击查看)</mark></span>' +
                           '<span class="img" data-bg-src="{{image}}"></span>';
                }
            },
            viewStory: function() {
                var url = [window.location.origin, 'story', this.model.get('name')].join('/');
                if (Amour.isMobile) {
                    Amour.openWindow(url + '#demo');
                } else {
                    var $qrcode = $('#qrcode-modal');
                    $qrcode.find('.modal-title').html('请使用手机扫描二维码阅读');
                    $qrcode.find('.modal-body').empty().qrcode({
                        width: 300,
                        height: 300,
                        text: url
                    });
                    $qrcode.modal('show');
                }
            }
        })
    });
    
    var clientsView = new (SectionView.extend({
        initView: function() {
            var $text = this.$('.story-item .text');
            $text.height($text.siblings('.img').outerHeight());
            this.stories = new Amour.Collection();
            this.views = {
                stories: new StoriesView({
                    el: this.$('.wall'),
                    collection: this.stories
                })
            }
        },
        render: function() {
            this.stories.reset([
                {
                    name: 'qidlove',
                    text: 'QiQi & XD<br>简单的小爱情',
                    image: 'http://tatup.qiniudn.com/o_18s85df0c4iknei1jtd38mi9uj.jpg!thumbnail',
                    even: true
                }, {
                    name: 'xiaolei',
                    text: '小蕾和懿懿<br>当爱射进球门',
                    image: 'http://tatup.qiniudn.com/o_18uq2tv092ou17jtmn1o571e3h9.jpg',
                    even: false
                }, {
                    name: 'jimmy',
                    text: 'Jimmy & Sherry<br>梦中的婚礼',
                    image: 'http://tatup.qiniudn.com/o_18rdpvf6e15qj1j8v1gqg1cf2iong.jpg',
                    even: true
                }, {
                    name: 'catking',
                    text: '猫王和丫丫<br>大声说我爱你',
                    image: 'http://tatup.qiniudn.com/o_18uj9o2f2efl47ev2mglf1rvp7.jpg',
                    even: false
                }, {
                    name: 'B18F79',
                    text: '尤尤和小胖<br>逆袭的爱情',
                    image: 'http://tatup.qiniudn.com/o_18uqqn6js1k9p6mj1qa81ap21jid7.jpg',
                    even: true
                }
            ])
        }
    }))({el: $('#view-clients')});
    
    var contactView = new (SectionView.extend({
        events: {
            'submit form': 'sendMessage',
            'click .contact-weibo': 'contactWeibo',
            'click .contact-wechat': 'contactWechat'
        },
        initView: function() {
            this.messages = new (Amour.Collection.extend({
                url: Amour.APIHost + '/users/contactmessage/'
            }))();
        },
        contactWechat: function(e) {
            if (!Amour.isMobile) {
                e.preventDefault && e.preventDefault();
                var $qrcode = $('#qrcode-modal');
                var $img = $('<img>');
                $qrcode.find('.modal-title').html('请使用微信扫描二维码关注我们');
                $qrcode.find('.modal-body').empty().html($img);
                Amour.loadImage($img, 'images/wechat-qrcode.jpg');
                $qrcode.modal('show');
            }
        },
        contactWeibo: function(e) {
            if (!Amour.isMobile) {
                e.preventDefault && e.preventDefault();
                Amour.openWindow('http://weibo.com/u/5224024448');
            }
        },
        sendMessage: function(e) {
            if (e.preventDefault) e.preventDefault();
            var content = this.$('textarea').val();
            var purpose = this.$('[name=purpose]:checked').val();
            var sender = this.$('input[name=sender]').val() || null;
            if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(sender)) {
                sender = { email: sender };
            } else if (/^[\s()+-]*([0-9][\s()+-]*){6,20}$/.test(sender)) {
                sender = { phone: sender };
            } else {
                sender = null;
            }
            if (sender) {
                this.$('.fa-spin').removeClass('hidden');
                var self = this;
                this.messages.create({
                    message: purpose + content, 
                    phone: sender.phone,
                    email: sender.email,
                    name: sender.name
                }, {
                    success: function() {
                        self.$('.btn-send').text('已发送');
                        self.$('form').find('input,textarea,.btn').attr('disabled', true);
                        self.$('.help-block').text('感谢留言！我们会在24小时内联系你。');
                        setTimeout(function() {
                            $('body').animate({
                                scrollTop: self.$('.contact-social').offset().top
                            }, 2000);
                        }, 500);
                    }
                });
                this.$('textarea').val('');
            }
        }
    }))({el: $('#view-contact')});
    
    var HeroView = new (SectionView.extend({
        initView: function() {
            var days = Math.floor(((new Date('2014-08-03')) - (new Date())) / 86400000);
            this.$('>footer em').text(days);
        }
    }))({el: $('#view-hero')});
    
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
        var startTime = _.now();
        var imageLoadEnd = _.once(function() {
            callback && callback();
            var endTime = _.now();
            ga('send', 'timing', 'Load', 'Load Images', endTime - startTime);
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
        var image = new Image();
        image.src = Amour.imageFullpath('images/homepage/avatar.png');
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
        $('.views-wrapper,.view').css('min-height', $(window).height());
        $('.views-wrapper').addClass('invisible');
        clientsView.render();
        cacheImages(function() {
            fillImages();
            $('.views-wrapper').removeClass('invisible');
            var scrollTop = $('#view-hero').height() - $(window).height();
            if ($('body').scrollTop() < scrollTop) {
                setTimeout(function() {
                    $('body').animate({ scrollTop: scrollTop }, 500);
                }, 1000);
            }
        });
    };
    
    App.start();
})();
