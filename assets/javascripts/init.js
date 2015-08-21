(function() {
    var user = new Amour.Models.User();
    user.fetch({
        success: function() {
            var username = user.get('username');
            var usericon = '<i class="fa fa-user"></i>';
            $(".show-username").html(usericon +" " + username);
        }
    })
    $('.user-menu-btn').on('click', function() {
        var self = this;

        $('.header .user-menu').toggleClass('hidden');
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