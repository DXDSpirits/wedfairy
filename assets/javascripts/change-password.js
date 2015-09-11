(function() {

    $("#global-footer-float-group").addClass('hidden');
    var token = Amour.TokenAuth.get();
    Amour.ajax.on('unauthorized forbidden', function() {
        $('#loginModal').modal('show');
    });
    if(token == null) {
        $('#loginModal').modal('show');
    };
    
    var user = new Amour.Models.User();
    var userName;
    var correctOld;
    user.fetch({
        success: function() {
            window.userName = user.get('username');
        }
    });
    
    $(document).on('click', '.sure-btn', function(){
        var passwordOld = $('.password-old').val() || null;
        var password = $('.password-input').val() || null;
        var surePassword = $('.sure-password-input').val() || null;
        user.login({ username : window.userName, password : passwordOld }, {
            error: function(){
                alert('请输入正确原密码');
            },
            success: function(){
                if(!password){
                    alert("请输入密码");
                    return ;
                }

                if(password !== surePassword){
                    alert("两次密码不一致");
                    return ;
                }

                user.change_password(password, {
                    success: function(model, response, options) {
                        alert("修改成功");
                    },
                    error: function(model, response, options) {
                        alert("出错啦");
                    }
                });
                window.location.href = "/my";
            }
        })     
    })
})();