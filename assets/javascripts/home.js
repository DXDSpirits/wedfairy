
(function() {
    
    var winh = $(window).height();
    
    constants = {};
    constants.height_hero = winh;
    constants.enter_products = winh;
    constants.leave_hero = winh + 1;
    constants.leave_products = 2 * winh;
    constants.enter_features = 2 * winh;
    
    skrollr.init({
        constants: constants
    });
    
})();
