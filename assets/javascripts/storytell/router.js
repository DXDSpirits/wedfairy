define(['storytell/app'], function(App) {
    
    App.router = new (Backbone.Router.extend({
        routes : {
            'demo': 'demo',
            'preview/:view': 'preview'
        },
        demo: function() {
            var $btn = $('<div class="btn btn-block btn-lg">返回</div>');
            $btn.css({
                'position': 'fixed',
                'z-index': 9999,
                'bottom': 0,
                'left': 0,
                'width': '100%',
                'margin': 0,
                'color': '#fff',
                'background-color': 'rgba(0, 0, 0, 0.2)'
            });
            $btn.one('click', function() {
                $('body').animate({opacity: 0}, 300, function() {
                    //window.close();
                    window.history.back();
                });
            });
            setTimeout(function() {
                $btn.prependTo('body');
            }, 1000);
        },
        preview : function(view) {
            var one = App.story.storyEvents.find(function(model) {
                return model.get('name') == view;
            });
            one && App.story.set('storyEvents', [one.toJSON()]);
            this.demo();
        }
    }))();
    
});
