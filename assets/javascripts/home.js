
(function() {
    if (!Amour.isMobile) {
        $('.wechat').attr('href', null);
    } else {
        $('.wechat').removeClass('wechat');
    }
    $('.visible-wechat').toggleClass('hidden', !Amour.isWeixin);

    var gallery_stories = [{
        id: 1, name: 'naturalcurly', title: '蜂蜜罐头',
        image: 'http://up.img.8yinhe.cn/o_18v2sopo9pbo1kt9tdj1g1nvg9c.jpg'
    }, {
        id: 2, name: 'xiaolei', title: '当爱射进球门',
        image: 'http://up.img.8yinhe.cn/o_18uq2tv092ou17jtmn1o571e3h9.jpg'
    }, {
        id: 3, name: 'qidlove', title: 'QiQi & XD',
        image: 'http://up.img.8yinhe.cn/o_18s85df0c4iknei1jtd38mi9uj.jpg'
    }, {
        id: 4, name: 'B18F79', title: '逆袭的爱情',
        image: 'http://up.img.8yinhe.cn/o_18uqqn6js1k9p6mj1qa81ap21jid7.jpg'
    }, {
        id: 5, name: 'c92280', title: '择一城终老，遇一人白首',
        image: 'http://up.img.8yinhe.cn/o_18ut953i51ig383fta0178k1ia87.jpg'
    }, {
        id: 6, name: 'FD2C14', title: '时常一起犯二！',
        image: 'http://up.img.8yinhe.cn/o_18ur3kp3jsqp10r51rcgao4jv97.jpg'
    }, {
        id: 7, name: 'aef095', title: '藝叶知秋',
        image: 'http://up.img.8yinhe.cn/o_18vfk2t5h1s781ott13r81pd3g1j7.jpg'
    }, {
        id: 8, name: 'fxfdz', title: '扬起风帆，铮爱启程',
        image: 'http://up.img.8yinhe.cn/o_191f51sggrsa18la24c1nv8141k1f.jpg'
    }, {
        id: 9, name: 'c92280', title: '择一城终老，遇一人白首',
        image: 'http://up.img.8yinhe.cn/o_18ut953i51ig383fta0178k1ia87.jpg'
    }, {
        id: 10, name: 'FD2C14', title: '时常一起犯二！',
        image: 'http://up.img.8yinhe.cn/o_18ur3kp3jsqp10r51rcgao4jv97.jpg'
    }, {
        id: 11, name: 'aef095', title: '藝叶知秋',
        image: 'http://up.img.8yinhe.cn/o_18vfk2t5h1s781ott13r81pd3g1j7.jpg'
    }, {
        id: 12, name: 'fxfdz', title: '扬起风帆，铮爱启程',
        image: 'http://up.img.8yinhe.cn/o_191f51sggrsa18la24c1nv8141k1f.jpg'
    }];

    var galleryView = new (Amour.View.extend({
        initView: function() {
            this.stories = new Amour.Collection();
            this.galleryView = new (Amour.CollectionView.extend({
                ModelView: Amour.ModelView.extend({
                    className: 'story-item',
                    template: '<div class="story-wrapper img" data-bg-src="{{image}}"><div class="text"><p>{{title}}</p></div></div>',
                    events: { 'click .story-wrapper': 'onClick' },
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
            this.stories.reset(gallery_stories);
        }
    }))({el: $('#view-features')});

    function fixViewFeatures() {
        var winh = $(window).height();
        var winw = $(window).width();
        
        var $composeBtn = $('#view-features .fg-lg .compose-button');
        if (winw / winh > 1920 / 1080) {
            $composeBtn.css({
                'left': '66%',
                'bottom': '0',
                'margin-bottom': '25%'
            });
        } else {
            $composeBtn.css({
                'left': winw / 2 + (1920 * winh) / (1080 * 2) * 0.31,
                'bottom': '45%',
                'margin-bottom': '0'
            });
        }

        var p = parseInt($('#global-footer').outerHeight() / winh * 100);
        $('#view-features').attr('data-_leave_features', 'transform:translate3d(0,-' + p + '%,0);')

        var $star = $('#view-features svg');
        var $gallery = $('#view-features .gallery');
        var svgH = winh * 0.9;
        var svgW = winw * 0.9;
        $star.attr('data-_enter_features-600p',
            "top:50%;left:50%;width:" + svgW +"px;height:" + svgH + "px;margin-left:" + (-svgW/2) + "px;margin-top:" + (-svgH/2) + "px;");
    }

    function start() {
        galleryView.render();
        fixViewFeatures();

        constants = {};
        constants.enter_products = '200p';
        constants.leave_products = '400p';
        constants.enter_features = '400p';
        constants.leave_features = '1150p';
        
        var scroller = skrollr.init({
            constants: constants
        });
        
        //$('.view').css('min-height', $(window).height());
        $(window).resize(_.debounce(function() {
            //$('.view').css('min-height', $(window).height());
            fixViewFeatures();
            scroller.refresh();
        }, 100));

        /*_.delay(function() {
            $('#view-hero .story-star').addClass('dropping');
        }, 1000);*/
    }
    _.delay(start, 3000);
    _.delay(function() {
        $('#loading-screen').animate({
            opacity: 0
        }, 1000, function() {
            $(this).remove();
        });
    }, 3000);

})();
