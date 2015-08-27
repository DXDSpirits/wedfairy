
(function() {

    var token = Amour.TokenAuth.get();    

    $("#global-header .anonymous").toggleClass("hidden", token != null); 
    $("#global-header .userinfo").toggleClass("hidden", token == null);

    Amour.ajax.on('unauthorized', function() {
        $("#global-header .anonymous").removeClass("hidden");
        $("#global-header .userinfo").addClass("hidden");
    });

    var user = new Amour.Models.User();

    user.fetch({
        success: function() {
            var username = user.get('username');
            var usericon = '<i class="fa fa-user"></i>';
            $("#global-header .show-username").html(usericon + " " + username);
        }
    });

    $('#global-header .avatar').on('click', function() {
        var self = this;
        $('#global-header .user-menu').toggleClass('hidden');
    });


    $('#global-header .logout-btn').on('click', function() {
        Amour.TokenAuth.clear();
        window.location.reload();
    });

    $('#global-header [data-href]').on('click', function() {
        var href = $(this).attr('data-href');
        window.location.href = href;
    });

    (function() {
        var message = localStorage.getItem('notify-message');
        var $loginAlert = $('.login-alert')
        if (message) {
            showMessage(message);
            localStorage.removeItem('notify-message');
        }

        function showMessage(_message) {
            // console.log(_message);
            $loginAlert.find('.alert-text').html(_message);
            $loginAlert.show();
        }
    })()

    // 登录
    Backbone.on("login-user", function(){
        var username = $('#global-header .username-login-input').val() || null;
        var password = $('#global-header .password-login-input').val() || null;
        if (username && password) {
            user.login({ username : username, password : password },{
                "error": function(){
                    alert('手机号或者密码错误，请重新输入');
                },
                "success": function(){
                    console.log("success!")
                    window.location.reload();

                },
            })
        }else{
            // console.log(123);
            alert('请输入手机号和密码!');
        }
    });


    $(document).on('click', '#global-header .login-btn', function(){
        Backbone.trigger('login-user');
    })

    $('#global-header .username-login-input').on('keydown', function(e){
        if (13 == e.keyCode) {  // 27 is the ESC key
            Backbone.trigger('login-user');
        }
    });

    $('#global-header .password-login-input').on('keydown', function(e){
        if (13 == e.keyCode) {  // 27 is the ESC key
            Backbone.trigger('login-user');
        }
    });

    // $(document).on('submit', '#global-header #loginModal form', function() {
    //     Backbone.trigger('login-user');
    // })

    // 注册
    Backbone.on('register-user', function(){
        var username = $('#global-header .username-register-input').val() || null;
        var password = $('#global-header .password-register-input').val() || null;
        var surePassword = $('#global-header .password-register-input2').val() || null;


        if(password !== surePassword){
            alert("两次密码不一致");
            return ;
        }

        if (username && password) {
            var auth = { username : username, password : password };
            user.register(auth,{
                "error": function(model, response, options){
                    alert(response.responseJSON.username);
                },
                "success": function(){
                    user.login(auth, {
                        "success":function(){
                            window.location.reload();
                        }
                    })
                },
            })
        }else{
            alert('请输入手机号和密码!');
        }
    });
    $(document).on('click', '#global-header .register-btn', function(){
        Backbone.trigger('register-user');
    });

    $(document).on('click', '#global-header .switch-to-login', function() {
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
    });
    $(document).on('click', '#global-header .switch-to-register', function() {
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    });

    //back to top
    $(document).on('click', '#global-footer-float-group .icon-arrow-up', function(){
        $('html, body').animate({scrollTop: 0}, 400);
    });

    $(window).on('scroll', function() {
        var screenheight = document.documentElement.scrollTop||document.body.scrollTop;
        if(screenheight>3000) {
            $('#global-footer-float-group .back-to-top').removeClass('hidden');
        }else {
            $('#global-footer-float-group .back-to-top').addClass('hidden');
        };
    });

    $(document).on('click', "#global-header .btn-login", function() {
        if (Amour.isMobile) {
            document.location.href = "http://compose.wedfairy.com/accounts/?url=" + encodeURIComponent(location.href);
        }
    });

})();
