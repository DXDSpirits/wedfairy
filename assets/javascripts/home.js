
(function() {
    if (!Amour.isMobile) {
        $('.wechat').attr('href', null);
    } else {
        $('.wechat').removeClass('wechat');
    }
    $('.visible-wechat').toggleClass('hidden', !Amour.isWeixin);

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

    _.delay(start, 3000);
    _.delay(function() {
        $('#loading-screen').animate({
            opacity: 0
        }, 1000, function() {
            $(this).remove();
        });
    }, 3000);
    //start();
    //$('#loading-screen').remove();
    
})();
