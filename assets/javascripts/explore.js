$(function() {

    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-cover': 'onClick',
                // 'hover .story-cover': 'onHover'
            },
            className: 'animated fadeIn col-lg-2 col-md-3 col-sm-6 col-xs-6 story-item',
            template: $("#explore-story-template").html(),
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                data.likes = data.likes || 0
                data.views = (data.likes * 3 + data.comments * 7) || 0;
                return data;
            },
            onClick: function() {
                window.open('http://wedfairy.com/story/' + this.model.get('name'), '_blank');
            },
            // onHover: function() {
            	
            // }
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

    stories.on('reset add', function() {
        $(".loading").toggleClass("hidden", stories.next == null);
    });
    var isFetching = false;
    Backbone.on('next-page', function() {
        if (isFetching) return;
        if (stories.next) {
            isFetching = true;
            stories.fetchNext({
                remove: false, 
                success: function() {
                    isFetching = false;
                },
                error: function() {
                    isFetching = false;
                }
            });    
        }
    });

    Backbone.on("close-scene-filter-menu", (function() {
        var $menu = $('.scene-filter-menu');
        return function() {
            $menu.hide();
        }
    })());

    $(document).on('click', '.scene-filter .selected-scene', function() {
        var $menu = $('.scene-filter-menu');
        if ($menu.is(":visible")) {
            Backbone.trigger("close-scene-filter-menu");
        } else {
            $("html").off("click");
            $("html").on("click", function(e) {
                var $target = $(e.target);
                if ($target.closest(".scene-filter").length == 0 && $menu.is(":visible")) {
                    Backbone.trigger("close-scene-filter-menu");
                    $("html").off("click");
                }
            });
            $menu.show();
        }
    });

    // infinite scroll
    var throttle = _.throttle(function() {
        if ($(window).scrollTop() + $(window).height() >= $('body').height() - 260) {
            Backbone.trigger('next-page');
        }
    }, 200);
    $(window).scroll(throttle);

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
