
(function() {

    var token = Amour.TokenAuth.get();

    $("#global-header .anonymous").toggleClass("hidden", token != null); 
    $("#global-header .userinfo").toggleClass("hidden", token = null);

    Amour.ajax.on('unauthorized', function() {
        $("#global-header .anonymous").removeClass("hidden");
        $("#global-header .userinfo").addClass("hidden");
    });

    var user = new Amour.Models.User();

    user.fetch({
        success: function() {
            var username = user.get('username');
            var usericon = '<i class="fa fa-user"></i>';
            $("#global-header .show-username").html(usericon +" " + username);
        }
    });

    $('#global-header .avatar').on('click', function() {
        var self = this;
        $('#global-header .user-menu').toggleClass('hidden');
    });


    $('#global-header .logout-btn').on('click', function() {
        Amour.TokenAuth.clear();
        window.location.href = '/login';
    });

    $('#global-header [data-href]').on('click', function() {
        var href = $(this).attr('data-href');
        window.location.href = href;
    });

})();
