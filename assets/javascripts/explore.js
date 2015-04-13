$(function() {



    var curPage = 1;
    var totoalPage = 1;
    var isFetching = false;
    var sceneFilter = null;

    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .story-cover': 'onClick'
            },
            className: 'col-xs-12 col-sm-4 col-md-3 story-item',
            template: $("#explore-story-template").html(),

            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                data.likes = data.likes || 0
                data.views = (data.likes * 3 + data.comments * 7) | 0;
                return data;
            },
            onClick: function() {
                window.open('http://wedfairy.com/story/' + this.model.get('name'), '_blank');
            },

        }),
        addAll: function(_collection, options) {
            var self = this;
            self.$el.fadeOut(function(){
                Amour.CollectionView.prototype.addAll.call(self, _collection, options);
                self.$el.fadeIn();
            })
        }
    });

    var stories = new(Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/storylist/',
        model: Amour.Models.Story
    }))();

    var renderStories = new Amour.Collection();

    var storyGalleryView = new StoryGalleryView({
        collection: renderStories,
        el: $('.story-container')
    });

    stories.fetch();

    stories.on('reset add', function() {
        Backbone.trigger("render");
    });

    Backbone.on("render", function(){
        totoalPage = ((stories.length-1)/8 | 0) + 1;
        renderStories.reset(stories.slice(curPage*8-8,curPage*8));
        showPagination();
    })


    function showPagination(){
        // show pagination if necessary
        $('.pagination-btn').css("visibility" ,"visible");
        if(curPage == 1){
            $('.prev-btn').css("visibility" ,"hidden");
        }

        if(!stories.next && curPage == totoalPage){
            $('.next-btn').css("visibility" ,"hidden");
        }

    }

    $(document).on('click', '.prev-btn', function(){
        curPage --;
        Backbone.trigger("render");
    })

    $(document).on('click', '.next-btn', function(){
        var needRender = false;

        if(curPage < totoalPage ){
            curPage ++;
            needRender = true;
        }
        if(curPage == totoalPage && stories.next ){
            needRender = false;
            isFetching = true;
            stories.fetchNext({
                remove: false, 
                data: {schema: sceneFilter},
                success: function() {
                    isFetching = false;
                    totoalPage = ((stories.length-1)/8 | 0) + 1;
                    Backbone.trigger("render");
                }
            });    
        }

        if(needRender){
            Backbone.trigger("render");
        }

    })

    $(document).on('click', '.scene-filter .selected-scene', function(){
        var $menu = $('.scene-filter-menu');
        if($menu.is(":visible")){
            $menu.hide();
        }else{
            $menu.show();
        }

    })


    // infinite scroll
    if(!$(".pagination-btn").is(":visible")){
        Backbone.off("render");
        Backbone.on("render", function(){
            renderStories.reset(stories.models);
        })


        var throttle = function() {
            var scrollTop = $(window).scrollTop();
            if(isFetching){
                _.delay(throttle, 200);
            }
            if ($(window).scrollTop() + $(window).height() >= $('body').height() - 150) {
                $('.next-btn').click();
            }
        };
        $(window).scroll(throttle);
    }



    // backbone router stuff
    var ROUTER = new (Backbone.Router.extend({
        routes: {':schemaFilter': 'schemaFilter'},
        schemaFilter: function(filterName){
            // console.log(filterName);
            $('.scene-filter-menu').hide();
            $('.scene-filter-menu a').removeClass('active');
            $('.scene-filter-menu [filter-name=' + filterName +"]").addClass("active");
            if(filterName == "all"){
                filterName = null;
            }
            sceneFilter = filterName;
            stories.fetch({
                data:{schema: filterName},
                reset: true,
                silent: true,
                success: function(){
                    curPage = 1;
                    totoalPage = ((stories.length-1)/8 | 0) + 1;
                    Backbone.trigger("render");
                }                
            });

        }
    }))()


    Backbone.history.start()

})











