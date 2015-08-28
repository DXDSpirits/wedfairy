
(function() {
    var $style = $('<style></style>');
    $style.text('.window-height{height:'+$(window).height()+'px;}').appendTo('head');
    $(window).resize(_.debounce(function() {
        $style.text('.window-height{height:'+$(window).height()+'px;}')
    }, 100));

    if (!Amour.isMobile) {
        $('.wechat').attr('href', null);
    } else {
        $('.wechat').removeClass('wechat');
    }
    $('.visible-wechat').toggleClass('hidden', !Amour.isWeixin);
    
    $('body').on('click', '.gallery .item', function() {
        location.href = '/explore';
    });
    $("#global-footer-float-group").addClass('hidden');

    function start() {
        // var constants = {};
        var scroller = skrollr.init({
            // constants: constants,
            smoothScrolling: false
        });
        // $(window).resize(_.debounce(function() {
        //     scroller.refresh();
        // }, 100));
        $('body').on('click', 'a', function(e) {
            var target = $(e.currentTarget).attr('href');
            if (target && target[0] == '#') {
                e.preventDefault && e.preventDefault();
                // $('body,html').animate({
                //     scrollTop: $(target).offset().top
                // }, 500);
                var offset = $(target).offset().top;
                scroller.animateTo(offset, {
                    duration: 500,
                    easing: 'sqrt'
                });
            }
        });
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
