(function() {

    $("#global-footer-float-group").addClass('hidden');
    var token = Amour.TokenAuth.get();
    // Amour.ajax.on('unauthorized forbidden', function() {
    //     $('#loginModal').modal('show');
    // });
    // if(token == null) {
    //     $('#loginModal').modal('show');
    // };
    
    var user = new Amour.Models.User();

    // user.fetch({
    //     success: function() {
    //         // var username = user.get('username');
    //     }
    // });
    
    var forgetPassword= new (Amour.View.extend({
        events: {
            'click .btn-send-code': 'sendCode',
            'click .btn-confirm-pwd': 'confirmPwd',
            'click .pwdvisible': 'pwdVisible'
        },
        initPage: function() {},
        onError: function(error) {
            if (error.mobile) {
                alert(error.mobile);
            } else if (error.code) {
                alert(error.code);
            } else {
                alert('手机号或者验证码错误，请重新输入');
            }
        },
        sendCode: function(e) {
            e && e.preventDefault && e.preventDefault();
            var mobile = this.$('input[name=mobile]').val();
            if (mobile) {
                var self = this;
                var model = new (Amour.Model.extend({
                    urlRoot: Amour.APIRoot + 'users/forget_password/'
                }))({ mobile:  mobile});
                model.save({}, {
                    success: function(model, response, options) {
                        self.$('.btn-send-code').attr('disabled', true).text('验证码已发送');
                        // self.$('.step-two').removeClass('invisible');
                    },
                    error: function(model, response, options) {
                        self.onError(response.responseJSON);
                    }
                });
            }
        },
        pwdVisible: function() {
            this.$('.pwdvisible').toggleClass('on');
            var checked = this.$('.pwdvisible').hasClass('on');
            this.$('.pwdvisible').text(checked ? '隐藏密码': '显示密码');
            this.$('input[name=password]').attr('type', checked ? 'text': 'password');
        },
        confirmPwd: function(e) {
            e && e.preventDefault && e.preventDefault();
            var mobile = this.$('input[name=mobile]').val();
            var password = this.$('input[name=password]').val();
            var code = this.$('input[name=code]').val();
            if (mobile && password && code) {
                var self = this;
                var model = new (Amour.Model.extend({
                    urlRoot: Amour.APIRoot + 'users/reset_password/'
                }))({
                    mobile: mobile,
                    code: code,
                    password: password
                });
                model.save({}, {
                    success: function(model, response, options) {
                        alert('密码重置成功');
                        App.user.login({
                            username : model.get('mobile'),
                            password : model.get('password')
                        }, {
                            success: function(model, response, options) {
                                App.router.navigate('');
                            },
                            error : function(model, response, options) {
                                self.onError(response.responseJSON);
                            }
                        });
                    },
                    error: function(model, response, options) {
                        self.onError(response.responseJSON);
                    }
                });
            }
        },
        clearFormStates: function() {
            this.$('.form-group').removeClass('has-error');
            this.$('.help-block').text('');
        },
        render: function() {
            this.clearFormStates();
            this.$('input').val('');
            this.$('.btn-send-code').removeAttr('disabled').text('发送验证码');
            return this;
        }
    }))({el: $('#view-forget')});
})();