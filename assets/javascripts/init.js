
(function() {
    
    var user = new Amour.Models.User();

    var registerModal = new (Amour.View.extend({
        events: {
            'click .login-btn': 'login',
            'click .switch-to-register': 'switchToRegister',
            'keydown #loginModal input': 'keydownLogin',
        },
        login: function() {
            var username = this.$('input[name=username]').val() || null;
            var password = this.$('input[name=password]').val() || null;
            if (username && password) {
                user.login({ username : username, password : password },{
                    error: function(){
                        alert('手机号或者密码错误，请重新输入');
                    },
                    success: function(){
                        console.log("success!")
                        window.location.reload();
                    }
                })
            } else {
                alert('请输入手机号和密码!');
            }
        },
        keydownLogin: function(e) {
            if (13 == e.keyCode) {
                this.login();
            }
        },
        switchToRegister: function() {
            $('#loginModal').modal('hide');
            $('#registerModal').modal('show');
        },
    }))({
        el: $('#loginModal')
    });

    var loginModal = new (Amour.View.extend({
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
            'click .btn-login': 'login',
            'click .btn-register': 'register'
        },
        logout: function() {
            Amour.TokenAuth.clear();
            window.location.reload();
        },
        login: function() {
            if (Amour.isMobile) {
                location.href = 'http://compose.wedfairy.com/accounts/?url=' + encodeURIComponent(location.href) + '#login';
            } else {
                $('#loginModal').modal('show');
            }
        },
        register: function() {
            if (Amour.isMobile) {
                location.href = 'http://compose.wedfairy.com/accounts/?url=' + encodeURIComponent(location.href) + '#register';
            } else {
                $('#registerModal').modal('show');
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


    //back to top
    $(document).on('click', '#global-footer-float-group .icon-arrow-up', function(){
        $('html, body').animate({scrollTop: 0}, 400);
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

})();
