$(function() {
    var token = Amour.TokenAuth.get();
    if (token === null) {
        // $('.login-container').modal('show');
        $(".login-container").removeClass("hidden"); 
        $(".avatar-container").addClass("hidden");
    };
    Amour.ajax.on('unauthorized', function() {
        // $('.login-container').modal('show');
        $(".login-container").removeClass("hidden");
        $(".avatar-container").addClass("hidden");
    });
    // if(Amour.isMobile) {
    // if(window.screen.width <= 400) {
    //     // document.location.href="http://www.wedfairy.com/ranking";
    //     document.location.href="/ranking";
    // };
    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-popup': 'onClick',
                'click .story-cover': 'onClick',
            },
            className: 'animated fadeIn col-lg-4 col-md-4 col-sm-6 col-xs-12 story-item',
            template: $("#explore-story-template").html(),
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                data.likes = data.likes || 0
                data.views = (data.likes * 31 + data.comments * 73) || 0;
                return data;
            },
            onClick: function() {
                window.open('http://wedfairy.com/story/' + this.model.get('name'), '_blank');
            },

        })
    });

    var stories = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/storylist/',
        model: Amour.Models.Story
    }))();

    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-container')
    });

    $(document).on('click', '.filter .nav li a', function() {
        // var $aStr = document.getElementsByTagName("a").html();
        var $aStr = $(this).html();
        var $contentTitle = $('#content-title');
        if($aStr === "首页") {
            $contentTitle.html("");
        } else {
            $contentTitle.html("<h2>" + $aStr + "</h2>");
        }

    });



    // backbone router stuff
    var ROUTER = new (Backbone.Router.extend({
        routes: {
            ':schemaFilter': 'schemaFilter',
            '': 'schemaFilter'
        },
        schemaFilter: function(filterName) {
            var filterName = filterName || "all";
            var $selectedScene = $('.selected-scene');
            $('.scene-filter-menu').hide();
            $('.scene-filter-menu a').removeClass('active');
            var $temp = $('.scene-filter-menu [filter-name=' + filterName +"]");
            $temp.addClass("active");
            $selectedScene.find(".text").html($temp.html());
            if (filterName == "all") { // 'all' means we do not need schema-filter
                filterName = null;
            }
            
            stories.fetch({
                data: { schema: filterName },
                reset: true
            });
        }
    }))();

    Backbone.history.start();

});
