$(function() {
    var router = new (Backbone.Router.extend( {
        routes: {
            "":"chooseScene", // 
            ":scene":"chooseScene", // 
        },

        chooseScene: function(scene){
            var scene = scene || "wedding";
            console.log(scene);
        },


    }));





    Backbone.history.start();
});