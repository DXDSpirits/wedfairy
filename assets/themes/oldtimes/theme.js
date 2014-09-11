(function() {
    
    var initIScroll = function() {
        var $wrapper = $('.views-wrapper');
        var $scroll = $('<div id="scroll-wrapper"></div>');
        $scroll.css({
            'position': 'relative',
            'overflow-x': 'hidden',
            'overflow-y': 'scroll',
            'height': $(window).height(),
            'width': $(window).width()
        });
        $scroll.insertBefore($wrapper).html($wrapper);
        //App.iScroll = new IScroll('#scroll-wrapper');
    };
    
    var start = function() {
        //console.log('Init Theme Aki');
    };
    
    Amour.on('StorytellAppReady', start);
    
})();
