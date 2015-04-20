$(function(){

    var self = this;
    var user = new Amour.Models.User();
    

    function isLogin(){
        return !!localStorage.getItem('auth-token');
    }

    function initPage(){

        if(isLogin()){
            user.fetch({
                success: function() {
                    $(".show-mobile-number").html("手机号: " + user.get('username'));
                }
            })
        }else{


        }

        $('.user-menu-btn').on('click', function(){
            $('.header .user-menu').toggleClass('view-hide');
        })

        $(document).on('click', '.login-btn', function(){
            var $container = $('#modal-container');
            $container.html($('#login-modal').clone());
            $container.fadeIn();
        });

        $('.logout-btn').on('click', function(){
            Amour.TokenAuth.clear();
            window.location.href = '/login';
        })
    }



    

    








    initPage();
});