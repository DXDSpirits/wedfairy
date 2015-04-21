$(function() {

    var self = this;
    var user = new Amour.Models.User();


    function isLogin() {
        return !!localStorage.getItem('auth-token');
    }

    function _renderRightNav() {
        if (isLogin()) {
            $(".show-mobile-number").html("手机号: " + user.get('username'));
            $('.right-nav').addClass("view-hide");
            $('.avatar-container').removeClass("view-hide");
        } else {
            $('.right-nav').removeClass("view-hide");
            $('.avatar-container').addClass("view-hide");
        }
    }

    function _loginEventBind() {
        Backbone.on("login-user", function() {
            var username = $('#global-header-modal-container .login-form .username-input').val() || null;
            var password = $('#global-header-modal-container .login-form .password-input').val() || null;
            if (username && password) {
                user.login({
                    username: username,
                    password: password
                }, {
                    "error": function() {
                        alert('手机号或者密码错误，请重新输入');
                    },
                    "success": function() {
                        $('#global-header-modal-container').html("登录成功");
                        _.delay(function() {
                            _renderRightNav();
                            Backbone.trigger('close-modal');
                        }, 500);

                    },
                })
            } else {
                alert('请输入手机号和密码!');
            }
        });


        $(document).on('click', '#global-header-modal-container .login-btn', function() {
            Backbone.trigger('login-user');
        });

        $(document).on('click', '.right-nav .login-btn,'
                     + '#global-header-modal-container .register-form .to-login-btn', function() {
            var $container = $('#global-header-modal-container');
            $container.html($('.modal-template-container .login-form').clone());
            $container.fadeIn();
        });

    }

    function _registerEventBind() {
        $(document).on('click', '.register-form .register-btn', function() {
            var username = $('#global-header-modal-container .username-input').val() || null;
            var password = $('#global-header-modal-container .password-input').val() || null;
            var surePassword = $('#global-header-modal-container .password-input2').val() || null;


            if (password !== surePassword) {
                alert("两次密码不一致");
                return;
            }

            if (username && password) {
                var auth = {
                    username: username,
                    password: password
                };
                user.register(auth, {
                    "error": function(model, response, options) {
                        alert(response.responseJSON.username);
                    },
                    "success": function() {
                        // redirect
                        user.login(auth, {
                            "success": function() {
                                $('#global-header-modal-container').html("注册成功");
                                _.delay(function() {
                                    _renderRightNav();
                                    Backbone.trigger('close-modal');
                                }, 500);
                            }

                        })
                    },
                })
            } else {
                alert('请输入手机号和密码!');
            }


        })



        $(document).on('click', '.right-nav .register-btn,'
                              + '#global-header-modal-container .login-form .to-register-btn', function() {
            var $container = $('#global-header-modal-container');
            $container.html($('.modal-template-container .register-form').clone());
            $container.fadeIn();
        });
    }

    function initPage() {

        if (isLogin()) {
            user.fetch({
                success: function() {
                    _renderRightNav();
                }
            })
        }

        _loginEventBind();
        _registerEventBind();

        $('.user-menu-btn, .avatar-container').on('click', function(e) {
            e.stopPropagation();
            $('.header .user-menu').toggleClass('view-hide');
        })


        Backbone.on('close-modal', function() {
            var $container = $('#global-header-modal-container');
            $container.fadeOut(function() {
                $container.html('');
            });
        })

        $(document).on('click', '#global-header-modal-container .close', function() {
            Backbone.trigger('close-modal');
        })

        $('.logout-btn').on('click', function() {
            $('.header .user-menu').addClass('view-hide');
            Amour.TokenAuth.clear();
            _renderRightNav();
        })

        $(document).on('keydown', '.login-form .password-input,' +
            '.register-form .password-input2', function(e) {
                if (13 == e.keyCode) { // 27 is the ESC key
                    Backbone.trigger('login-user');
                }
        });

        $(document).on('click', '.right-nav .menu-btn', function(){
            $('.header .extra-menu').toggleClass('view-hide');
        });

    }









    initPage();
});