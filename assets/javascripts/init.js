(function() {
    $('.user-menu-btn').on('click', function() {
        var self = this;
        var user = new Amour.Models.User();
        if($('.header .user-menu').hasClass('view-hide')){
            user.fetch({
                success: function() {
                    // alert("Hi!");
                    var username = user.get('username');
                    // alert(username)
                    var usericon = '<i class="fa fa-user"></i>';
                    $(".show-username").html(usericon +" " + username);
                }
            })
        }

        $('.header .user-menu').toggleClass('view-hide');
    });


    $('.logout-btn').on('click', function() {
        Amour.TokenAuth.clear();
        window.location.href = '/login';
    });

    $('[data-href]').on('click', function() {
        var href = $('[data-href]').attr('data-href');
        window.location.href = href;
    });
})();