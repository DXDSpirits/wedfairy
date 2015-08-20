$(function() {
    var token = Amour.TokenAuth.get();
    if (token === null) {
        $(".login-container").removeClass("hidden"); 
        $(".user-info").addClass("hidden");
    };
    Amour.ajax.on('unauthorized', function() {
        $(".login-container").removeClass("hidden");
        $(".user-info").addClass("hidden");
    });
    // if(Amour.isMobile) {
    // if(window.screen.width <= 400) {
    //     // document.location.href="http://www.wedfairy.com/ranking";
    //     document.location.href="/ranking";
    // };
    //Fetured and Hot stories
    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-popup': 'onClick',
                'click .story-cover': 'onClick',
            },
            className: 'animated fadeIn col-lg-4 col-md-4 col-sm-6 col-xs-12 story-item',
            template: $("#newexplore-story-template").html(),
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

    //Wedding/Baby/Voyage stories
    var FiveStoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-popup': 'onClick',
                'click .story-cover': 'onClick',
            },
            className: 'animated fadeIn col-lg-3 col-md-4 col-sm-6 col-xs-12 story-item five-stories',
            template: $("#newexplore-story-template").html(),
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

    // ranking stories
    var RankingStoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-cover': 'onClick',
            },
            className: 'animated fadeIn col-lg-12 col-md-12 col-sm-12 col-xs-12 ranking-story-item',
            template: $("#ranking-story-template").html(),
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


    var storiesFeatured = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storiesHot = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storiesRanking = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storiesWedding = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storiesBaby = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storiesVoyage = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    //views
    var storyFeaturedGalleryView = new StoryGalleryView({
        collection: storiesFeatured,
        el: $('.story-featured-container')
    });

    var storyHotGalleryView = new StoryGalleryView({
        collection: storiesHot,
        el: $('.story-hot-container')
    });

    // var stories = new (Amour.Collection.extend({
    //     url: Amour.APIRoot + 'search/story/',
    //     model: Amour.Models.Story
    // }))();

    var storyRankingGalleryView = new RankingStoryGalleryView({
        collection: storiesRanking,
        el: $('.story-ranking-container')
    });

    var storyWeddingGalleryView = new FiveStoryGalleryView({
        collection: storiesWedding,
        el: $('.story-wedding-container')
    });

    var storyBabyGalleryView = new FiveStoryGalleryView({
        collection: storiesBaby,
        el: $('.story-baby-container')
    });

    var storyVoyageGalleryView = new FiveStoryGalleryView({
        collection: storiesVoyage,
        el: $('.story-voyage-container')
    });

    // $(document).on('click', '.filter .nav li a', function() {
    //     // var $aStr = document.getElementsByTagName("a").html();
    //     var $aStr = $(this).html();
    //     var $contentTitle = $('#content-title');
    //     if($aStr === "首页") {
    //         $contentTitle.html("");
    //     } else {
    //         $contentTitle.html("<h2>" + $aStr + "</h2>");
    //     }
    // });

    storiesFeatured.fetch({
        data: { 
            schema: "food", 
            limit : 3
        },
        reset: true,
        success: function () {
            $(".title-fetured").removeClass("hidden");
        }
    });

    storiesHot.fetch({
        data: { 
            schema: "idol", 
            limit : 3
        },
        reset: true,
        success: function () {
            $(".title-hot").removeClass("hidden");
        }
    });

    storiesRanking.fetch({
        data: { 
            schema: "yearbook", 
            limit : 10
        },
        reset: true,
        success: function () {
            $(".title-ranking").removeClass("hidden");
        }
    });

    storiesWedding.fetch({
        data: { 
            schema: "wedding", 
            limit : 5
        },
        reset: true,
        success: function () {
            $(".title-wedding").removeClass("hidden");
        }
    });

    storiesBaby.fetch({
        data: { 
            schema: "baby", 
            limit : 5
        },
        reset: true,
        success: function () {
            $(".title-baby").removeClass("hidden");
        }
    });

    storiesVoyage.fetch({
        data: { 
            schema: "voyage", 
            limit : 5
        },
        reset: true,
        success: function () {
            $(".title-voyage").removeClass("hidden");
        }
    });

    // backbone router stuff
    // var ROUTER = new (Backbone.Router.extend({
    //     routes: {
    //         ':schemaFilter': 'schemaFilter',
    //         '': 'schemaFilter'
    //     },
    //     schemaFilter: function(filterName) {
    //         // var filterName = EXPLORE_FILTER_NAME;
    //         var filterName = filterName || "all";
    //         var $selectedScene = $('.selected-scene');
    //         $('.scene-filter-menu').hide();
    //         $('.scene-filter-menu a').removeClass('active');
    //         var $temp = $('.scene-filter-menu [filter-name=' + filterName +"]");
    //         $temp.addClass("active");
    //         $selectedScene.find(".text").html($temp.html());
    //         if (filterName == "all") { // 'all' means we do not need schema-filter
    //             filterName = null;
    //         }
            
    //         stories.fetch({
    //             data: { schema: "wedding" },
    //             reset: true
    //         });
    //     }
    // }))();

    Backbone.history.start();

});
