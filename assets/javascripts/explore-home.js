$(function() {
    var token = Amour.TokenAuth.get();
    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-popup': 'onClick',
                'click .story-cover': 'onClick',
            },
            className: 'animated fadeIn col-md-4 col-sm-6 story-item',
            template: $("#newexplore-story-template").html(),
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                data.likes = data.likes || 0
                data.views = (data.likes * 31 + data.comments * 73) || 0;
                return data;
            },
            onClick: function() {
                var storyPreviewURL = 'http://wedfairy.com/story/' + this.model.get('name');
                window.open('http://story.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(storyPreviewURL), '_blank');
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
            className: 'animated fadeIn col-lg-3 col-md-4 col-sm-6 story-item five-stories',
            template: $("#newexplore-story-template").html(),
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                data.likes = data.likes || 0
                data.views = (data.likes * 31 + data.comments * 73) || 0;
                return data;
            },
            onClick: function() {
                var storyPreviewURL = 'http://wedfairy.com/story/' + this.model.get('name');
                window.open('http://story.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(storyPreviewURL), '_blank');
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

    storiesRanking.fetch({
        data: { 
            tag: "hot", 
            limit : 10
        },
        reset: true,
        success: function () {
            $(".title-ranking").removeClass("hidden");
        }
    });

    var screenWidth = document.body.scrollWidth;
    // if (screenWidth >= 1200) {
        storiesFeatured.fetch({
            data: { 
                tag: "staffpicks", 
                limit : 3
            },
            reset: true,
            success: function () {
                $(".title-fetured").removeClass("hidden");
            }
        });

        storiesHot.fetch({
            data: { 
                tag: "hot", 
                limit : 3
            },
            reset: true,
            success: function () {
                $(".title-hot").removeClass("hidden");
            }
        });

        storiesWedding.fetch({
            data: { 
                tag: "wedding", 
                limit : 5
            },
            reset: true,
            success: function () {
                $(".title-wedding").removeClass("hidden");
            }
        });

        storiesBaby.fetch({
            data: { 
                tag: "baby", 
                limit : 5
            },
            reset: true,
            success: function () {
                $(".title-baby").removeClass("hidden");
            }
        });

        storiesVoyage.fetch({
            data: { 
                tag: "voyage", 
                limit : 5
            },
            reset: true,
            success: function () {
                $(".title-voyage").removeClass("hidden");
            }
        });
    // } else {
    //     storiesFeatured.fetch({
    //         data: { 
    //             tag: "staffpicks", 
    //             limit : 4
    //         },
    //         reset: true,
    //         success: function () {
    //             $(".title-fetured").removeClass("hidden");
    //         }
    //     });

    //     storiesHot.fetch({
    //         data: { 
    //             tag: "hot", 
    //             limit : 4
    //         },
    //         reset: true,
    //         success: function () {
    //             $(".title-hot").removeClass("hidden");
    //         }
    //     });

    //     storiesWedding.fetch({
    //         data: { 
    //             tag: "wedding", 
    //             limit : 6
    //         },
    //         reset: true,
    //         success: function () {
    //             $(".title-wedding").removeClass("hidden");
    //         }
    //     });

    //     storiesBaby.fetch({
    //         data: { 
    //             tag: "baby", 
    //             limit : 6
    //         },
    //         reset: true,
    //         success: function () {
    //             $(".title-baby").removeClass("hidden");
    //         }
    //     });

    //     storiesVoyage.fetch({
    //         data: { 
    //             tag: "voyage", 
    //             limit : 6
    //         },
    //         reset: true,
    //         success: function () {
    //             $(".title-voyage").removeClass("hidden");
    //         }
    //     });
    // }
        

    Backbone.history.start();

});
