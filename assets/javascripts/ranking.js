(function() {

    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click': 'onClick'
            },
            className: 'story-item clearfix',
            template: '<div class="img pull-left" data-bg-src="{{data.coverImage}}"></div>' +
                      '<div class="text pull-left"><p>{{title}}</p><div class="desc">{{description}}</div></div>' +
                      '<div class="index"></div>' +
                      '<i class="fa fa-angle-right"></i>',
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                return data;
            },
            onClick: function() {
                window.open('http://wedfairy.com/story/' + this.model.get('name'), '_blank');
            }
        })
    });


    // filter
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



    var stories = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-list')
    });

    stories.fetch();
    stories.on('reset add', function() {
        $('#btn-more').toggleClass('hidden', stories.next == null);
    });

    var fetchMore = function() {
        var btn = $('#btn-more');
        btn.button('loading');
        stories.fetchNext({
            remove: false,
            success: function () {
                btn.button('reset');
            }
        });
    };

    $('#btn-more').click(fetchMore);
    var throttle = _.throttle(function() {
        var scrollTop = $(window).scrollTop();
        if ($(window).scrollTop() + $(window).height() >= $('body').height() - 150) {
            fetchMore();
        }
    }, 200);
    $(window).scroll(throttle);

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


})();
