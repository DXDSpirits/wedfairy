
(function() {

    var user = new Amour.Models.User();
    // console.log(location.href);

    var loginModal = new (Amour.View.extend({
        events: {
            'click .login-btn': 'login',
            'click .btn-wechat-login': 'wechatLogin',
            'click .switch-to-register': 'switchToRegister',
            'keydown input': 'keydownLogin'
        },
        login: function() {
            var username = this.$('input[name=username]').val() || null;
            var password = this.$('input[name=password]').val() || null;
            if (username && password) {
                user.login({ username : username, password : password }, {
                    error: function(){
                        alert('手机号或者密码错误，请重新输入');
                    },
                    success: function(){
                        var search = location.search;
                        search = search.replace(/[\?\&]?login=success|[\?\&]?register=success/, '');
                        search += search ? '&login=success' : '?login=success';
                        if (location.search == search) {
                            location.reload();
                        } else {
                            location.search = search;
                        }
                    }
                })
            } else {
                alert('请输入手机号和密码!');
            }
        },
        keydownLogin: function(e) {
            if (13 == e.keyCode) this.login();
        },
        wechatLogin: function() {
            localStorage.setItem('redirect-on-login', location.href);
            var url = 'https://open.weixin.qq.com/connect/qrconnect?appid=wxe2e28297d62b0270&redirect_uri=http://api.wedfairy.com/api/users/wechat-auth/&response_type=code&scope=snsapi_login&state=web%7C#wechat_redirect';
            location.href = url;
        },
        switchToRegister: function() {
            $('#loginModal').modal('hide');
            $('#registerModal').modal('show');
        }
    }))({
        el: $('#loginModal')
    });

    var registerModal = new (Amour.View.extend({
        events: {
            'click .register-btn': 'register',
            'click .switch-to-login': 'switchToLogin'
        },
        register: function() {
            var username = this.$('input[name=username]').val() || null;
            var password = this.$('input[name=password]').val() || null;
            var surePassword = this.$('input[name=password2]').val() || null;
            if (password !== surePassword) {
                alert("两次密码不一致");
            } else if (username && password) {
                var auth = { username : username, password : password };
                user.register(auth,{
                    error: function(model, response, options){
                        alert(response.responseJSON.username);
                    },
                    success: function(){
                        user.login(auth, {
                            success: function(){
                                var search = location.search;
                                search = search.replace(/[\?\&]?login=success|[\?\&]?register=success/, '');
                                search += search ? '&register=success' : '?register=success';
                                if (location.search == search) {
                                    location.reload();
                                } else {
                                    location.search = search;
                                }
                            }
                        })
                    },
                })
            } else {
                alert('请输入手机号和密码!');
            }
        },
        switchToLogin: function() {
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        }
    }))({
        el: $('#registerModal')
    });

    var globalHeader = new (Amour.View.extend({
        events: {
            'click .btn-logout': 'logout',
            'click .btn-login': 'gotoLogin',
            'click .btn-register': 'gotoRegister',
            'click .btn-accounts': 'gotoAccounts'
        },
        logout: function() {
            Amour.TokenAuth.clear();
            var search = location.search;
            search = search.replace(/[\?\&]?login=success|[\?\&]?register=success/, '');
            if (location.search == search) {
                location.reload();
            } else {
                location.search = search;
            }
        },
        gotoLogin: function() {
            if (Amour.isMobile) {
                location.href = 'http://compose.wedfairy.com/accounts/?url=' + encodeURIComponent(location.href) + '#login';
            } else {
                $('#loginModal').modal('show');
            }
        },
        gotoRegister: function() {
            if (Amour.isMobile) {
                location.href = 'http://compose.wedfairy.com/accounts/?url=' + encodeURIComponent(location.href) + '#register';
            } else {
                $('#registerModal').modal('show');
            }
        },
        gotoAccounts: function() {
            var token = Amour.TokenAuth.get();
            if (Amour.isMobile) {
                location.href = 'http://compose.wedfairy.com/corslogin/' + token;
            } else {
                // location.href = 'http://site.wedfairy.com/corslogin/' + token;
                location.href = "/my/";
            }
        },
        toggleUserinfo: function() {
            var token = Amour.TokenAuth.get();
            this.$(".anonymous").toggleClass("hidden", token != null);
            this.$(".userinfo").toggleClass("hidden", token == null);
        },
        fetchUserinfo: function() {
            if (!Amour.TokenAuth.get()) return;
            user.fetch();
        },
        render: function() {
            this.toggleUserinfo();
            this.fetchUserinfo();
        }
    }))({
        el: $('#global-header')
    });

    globalHeader.render();

    Amour.ajax.on('unauthorized', function() {
        globalHeader.toggleUserinfo();
    });

    $(document).on('click', '#global-footer-float-group .icon-arrow-up', function(){
        $('html,body').animate({
            scrollTop: 0
        }, 400);
    });

    var toggleBackToTop = _.throttle(function() {
        var screenheight = document.documentElement.scrollTop||document.body.scrollTop;
        if(screenheight>3000) {
            $('#global-footer-float-group .back-to-top').removeClass('hidden');
        }else {
            $('#global-footer-float-group .back-to-top').addClass('hidden');
        };
    }, 500);

    // $(window).on('scroll', toggleBackToTop);
    var currentURL = window.location.href;
    if(currentURL.indexOf("/my") > 0) {
        $(".page-title").html("我的故事");
        // $("#global-header .navbar .icon-logo").css("background-color", "transparent");
    }else if(currentURL.indexOf("forget-password") > 0){
        $(".page-title").html("找回密码");
    }else {
        $(".page-title").html("");
    }

})();
