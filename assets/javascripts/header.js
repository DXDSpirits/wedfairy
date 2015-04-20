$(function() {

    var self = this;
    var user = new Amour.Models.User();


    function isLogin() {
        return !!localStorage.getItem('auth-token');
    }

    function _renderRightNav(){
        if (isLogin()) {
            $('.right-nav').addClass("view-hide");
            $('.avatar-container').removeClass("view-hide");
        }else{
            $('.right-nav').removeClass("view-hide");
            $('.avatar-container').addClass("view-hide");
        }
    }

    function _loginEventBind(){
        Backbone.on("login-user", function() {
            var username = $('#modal-container .login-form .username-input').val() || null;
            var password = $('#modal-container .login-form .password-input').val() || null;
            if (username && password) {
                user.login({
                    username: username,
                    password: password
                }, {
                    "error": function() {
                        alert('手机号或者密码错误，请重新输入');
                    },
                    "success": function() {
                        $('#modal-container').html("登录成功");
                        _.delay(function(){
                            _renderRightNav();
                            Backbone.trigger('close-modal');
                        }, 500);

                    },
                })
            } else {
                alert('请输入手机号和密码!');
            }
        });


        $(document).on('click', '#login-modal .login-btn', function() {
            Backbone.trigger('login-user');
        });

        $(document).on('click', '.login-btn', function() {
            var $container = $('#modal-container');
            $container.html($('#login-modal').clone());
            $container.fadeIn();
        });

    }

    function initPage() {

        if (isLogin()) {
            user.fetch({
                success: function() {
                    $(".show-mobile-number").html("手机号: " + user.get('username'));
                    _renderRightNav();
                }
            })
        }

        _loginEventBind();

        $('.user-menu-btn').on('click', function() {
            $('.header .user-menu').toggleClass('view-hide');
        })

        $(document).on('click', '.register-btn', function() {
            var $container = $('#modal-container');
            $container.html($('#register-modal').clone());
            $container.fadeIn();
        });

        Backbone.on('close-modal', function(){
            var $container = $('#modal-container');
            $container.fadeOut(function() {
                $container.html('');
            });
        })

        $(document).on('click', '#modal-container .close', function() {
            Backbone.trigger('close-modal');
        })

        $('.logout-btn').on('click', function() {
            $('.header .user-menu').addClass('view-hide');
            Amour.TokenAuth.clear();
            _renderRightNav();
        })

        $(document).on('keydown', '#login-modal .password-input,' +
                                  '#register-modal .password-input2',function(e){
            if (13 == e.keyCode) {  // 27 is the ESC key
                Backbone.trigger('login-user');
            }
        });
    }









    initPage();
});