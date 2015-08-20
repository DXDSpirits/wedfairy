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
    if(window.screen.width <= 400) {
        // document.location.href="http://www.wedfairy.com/ranking";
        document.location.href="/ranking";
    };
    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-popup': 'onClick',
                'click .story-cover': 'onClick',
            },
            className: 'animated fadeIn col-lg-3 col-md-3 col-sm-4 col-xs-12 story-item',
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

    var stories = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storiesRanking = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/story/',
        model: Amour.Models.Story
    }))();

    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-container')
    });

    var storyRankingGalleryView = new RankingStoryGalleryView({
        collection: storiesRanking,
        el: $('.story-ranking-container')
    });

    var isFetching = false;
    Backbone.on('next-page', function() {
        if (isFetching) return;
        if (stories.next) {
            isFetching = true;
            $(".loading").removeClass("hidden");
            _.delay(function() {
                stories.fetchNext({
                    remove: false, 
                    success: function() {
                        isFetching = false;
                        $(".loading").addClass("hidden");
                    },
                    error: function() {
                        isFetching = false;
                        $(".loading").addClass("hidden");
                    }
                });
            }, 200);
        }
    });

    $(document).ready(function() {
        var $aStr = document.location.pathname.split("\/")[2];
        var dict = {
            "featured"  : "推荐故事",
            "hot"       : "热门故事",
            "wedding"   : "婚礼邀请函",
            "baby"      : "宝贝故事",
            "voyage"    : "旅行故事",
            "lover"     : "爱情纪念日",
            "idol"      : "偶像故事",
            "friendship": "友情故事",
            "yearbook"  : "新年书",
            "personal"  : "个人故事",
            "food"      : "美食故事",
            "universal" : "通用故事"
        };
        // var $aStr = $(this).html();
        var $contentTitle = $('#content-title');
        if($aStr !== "首页") {
            $contentTitle.html("<h2>" + dict[$aStr] + "</h2>");
        }
    });

    // $(document).on('click', '.filter .nav li a', function() {
    //     // var $aStr = window.location.hash;
    //     var $aStr = $(this).html();
    //     var $contentTitle = $('#content-title');
    //     if($aStr === "首页") {
    //         $contentTitle.html("");
    //     } else {
    //         $contentTitle.html("<h2>" + $aStr + "</h2>");
    //     }
        
    //     // if ($menu.is(":visible")) {
    //     //     Backbone.trigger("close-scene-filter-menu");
    //     // } else {
    //     //     $("html").off("click");
    //     //     $("html").on("click", function(e) {
    //     //         var $target = $(e.target);
    //     //         if ($target.closest(".scene-filter").length == 0 && $menu.is(":visible")) {
    //     //             Backbone.trigger("close-scene-filter-menu");
    //     //             $("html").off("click");
    //     //         }
    //     //     });
    //     //     $menu.show();
    //     // }
    // });



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
            var filterName = EXPLORE_FILTER_NAME;
            // var filterName = filterName || "all";
            // var $selectedScene = $('.selected-scene');
            // $('.scene-filter-menu').hide();
            // $('.scene-filter-menu a').removeClass('active');
            // var $temp = $('.scene-filter-menu [filter-name=' + filterName +"]");
            // $temp.addClass("active");
            // $selectedScene.find(".text").html($temp.html());
            // if (filterName == "all") { // 'all' means we do not need schema-filter
            //     filterName = null;
            // }
            
            stories.fetch({
                data: { schema: filterName },
                reset: true,
                success: function () {
                    $("#content-title").removeClass("hidden");
                }
            });
        }
    }))();

    storiesRanking.fetch({
        data: { 
            schema: "wedding", 
            limit : 10
        },
        reset: true,
        success: function () {
            $(".title-ranking").removeClass("hidden");
        }
    });

    Backbone.history.start();

});
