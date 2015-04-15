
(function() {
    if (!Amour.isMobile) {
        $('.wechat').attr('href', null);
    } else {
        $('.wechat').removeClass('wechat');
    }
    $('.visible-wechat').toggleClass('hidden', !Amour.isWeixin);

    var gallery_stories = [{
        id: 1, name: 'naturalcurly', title: '蜂蜜罐头',
        image: 'http://up.img.8yinhe.cn/o_18utie8c217e012rb1b461to5sr0m.jpg'
    }, {
        id: 2, name: 'gracemirage', title: 'A Never Ending Trip',
        image: 'http://up.img.8yinhe.cn/wechat/-WvB6oagDADKzkmnndFBLGv8tgRMCeTL3afrtdU7MJmsZxkhNvYfbtYfv87Pl-bp'
    }, {
        id: 3, name: 'we20150201', title: '有点潮，又有点萌',
        image: 'http://up.img.8yinhe.cn/o_19agli2b7j7c1bovk4idh696t7.jpg'
    }, {
        id: 4, name: 'B18F79', title: '逆袭的爱情',
        image: 'http://up.img.8yinhe.cn/o_18uqqn6js1k9p6mj1qa81ap21jid7.jpg'
    }, {
        id: 5, name: 'DW20150117', title: '择一城终老，遇一人白首',
        image: 'http://up.img.8yinhe.cn/o_19aiv35jm6e51a711cmg1pq6116117.jpg'
    }, {
        id: 6, name: 'FD2C14', title: '时常一起犯二！',
        image: 'http://up.img.8yinhe.cn/o_18ur3kp3jsqp10r51rcgao4jv97.jpg'
    }, {
        id: 7, name: 'xiaolei', title: '当爱射进球门',
        image: 'http://up.img.8yinhe.cn/o_18uq2tv092ou17jtmn1o571e3h9.jpg'
    }, {
        id: 8, name: 'fxfdz', title: '扬起风帆，铮爱启程',
        image: 'http://up.img.8yinhe.cn/o_191f51sggrsa18la24c1nv8141k1f.jpg'
    }, {
        id: 9, name: 'bef0a2', title: '长腿叔叔&小鱼老师',
        image: 'http://up.img.8yinhe.cn/o_196ebkt1p9l093odgnr7p1sn47.jpeg'
    }, {
        id: 10, name: 'd66cc9', title: '相遇 相识 相知 相恋 相爱 相伴',
        image: 'http://up.img.8yinhe.cn/o_1995u1cto17u71afm11blb6157h7.jpg'
    }, {
        id: 11, name: 'cbc823', title: '我心目中最美的太阳花',
        image: 'http://up.img.8yinhe.cn/o_199tc77ld1onllrr10f2h37181tn.png'
    }, {
        id: 12, name: 'a3149a', title: '天佑阳光',
        image: 'http://up.img.8yinhe.cn/o_193ntjnpkjk61g4jb7b1sfsl52f.jpg'
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
    }

    function fixViewProducts() {
        var $products = $('#view-products');
        var winh = $(window).height();
        var h = $products.outerHeight();
        $products.attr('data-_enter_products', 'transform:translate3d(0,' + (-winh) + 'px,0);');
        $products.attr('data-_leave_products', 'transform:translate3d(0,' + (-winh-h) + 'px,0);');
    }

    function fixViewCommunity() {
        var $community = $('#view-community');
        var winh = $(window).height();
        var h = $community.outerHeight();
        var footerH = $('#global-footer').height();
        // $community.attr('data-_enter_community', 'transform:translate3d(0,' + (-winh) + 'px,0);');
        $community.attr('data-_leave_community', 'transform:translate3d(0,' + ((winh-h) - footerH -20) + 'px,0);');
    }

    function start() {
        galleryView.render();
        fixViewProducts();
        // fixViewFeatures();
        fixViewCommunity();

        constants = {};
        constants.enter_products = '200p';
        constants.leave_products = '400p';
        constants.enter_community = '400p';
        constants.leave_community = '600p';
        
        var scroller = skrollr.init({
            smoothScrolling: false,
            constants: constants
        });
        
        $(window).resize(_.debounce(function() {
            fixViewProducts();
            fixViewCommunity();
            // fixViewFeatures();
            scroller.refresh();
        }, 100));
    }

    // _.delay(start, 3000);
    // _.delay(function() {
    //     $('#loading-screen').animate({
    //         opacity: 0
    //     }, 1000, function() {
    //         $(this).remove();
    //     });
    // }, 3000);
    start();
    $('#loading-screen').remove();

})();
