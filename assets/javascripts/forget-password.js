(function() {

    $("#global-footer-float-group").addClass('hidden');
    
    var forgetPassword = new (Amour.View.extend({
        events: {
            'click .btn-send-code': 'sendCode',
            'click .btn-confirm-pwd': 'confirmPwd',
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
                        resendCountDown(30);
                    },
                    error: function(model, response, options) {
                        self.onError(response.responseJSON);
                    }
                });
            }
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
    }))({el: $('#view-forget-password')});

    var resendCountDown = function(resendInterval) {
        if(resendInterval == 0 ) {
            $('.resend-hint').addClass('hidden');
            $('.btn-send-code').removeClass('btn-disable').removeAttr('disabled');
            // return;
        }else if(resendInterval>0){
            $('.btn-send-code').attr('disabled', true).addClass('btn-disable');
            $('.resend-hint').removeClass('hidden').html(resendInterval + "s后可再次发送");
            resendInterval-=1;
            setTimeout(function() {
                resendCountDown(resendInterval);
            }, 1000)
        }
    }
})();