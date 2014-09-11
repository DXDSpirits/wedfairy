(function() {
    
    $('#qrcode-wrapper').qrcode({
        width: 150,
        height: 150,
        text: IFRAME_URL
    });
    
    var scrollTop = 150;
    if ($('body').scrollTop() < scrollTop) {
        setTimeout(function() {
            $('body').animate({ scrollTop: scrollTop }, 500);
        }, 1000);
    }

})();
