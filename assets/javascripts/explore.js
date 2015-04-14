$(function() {



    var isFetching = false;
    var sceneFilter = null;

    _.repeat = function(func, wait) {
        var wait = wait || 1000;

        return function _wrapper() {
            func();
            _.delay(function() {
                _wrapper();
            }, wait);
        }
    }
    

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
        addOne: function(item){
            console.log("add one");
            var self = this;
            _.delay(function(){
                Amour.CollectionView.prototype.addOne.call(self, item);
                $(".loading").css("visibility", "hidden");
            }, 500)
        },
       
    });

    var stories = new(Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/storylist/',
        model: Amour.Models.Story
    }))();


    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-container')
    });


    Backbone.on('next-page', function(){
        $(".loading").css("visibility", "visible");
 
        if(stories.next ){
            needRender = false;
            isFetching = true;
            stories.fetchNext({
                remove: false, 
                // data: {schema: sceneFilter},
                success: function() {
                    isFetching = false;
                }
            });    
        }

        if(!stories.next){
            $(".loading").css("visibility", "hidden");
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
    // Backbone.on("render", function(){
    //     renderStories.reset(stories.models);
    // })


    var throttle = function() {
        var scrollTop = $(window).scrollTop();
        if(isFetching){
            console.log("delay");
            return ;
        }
        if ($(window).scrollTop() + $(window).height() >= $('body').height() - 150) {
            // console.log("trigger");
            // console.log("isFetching:"+ isFetching);
            Backbone.trigger('next-page');
        }
    };
    var _run = _.repeat(throttle, 200);
    _run();



    // backbone router stuff
    var ROUTER = new (Backbone.Router.extend({

        routes: {':schemaFilter': 'schemaFilter',
                '': 'schemaFilter'},
        schemaFilter: function(filterName){
            var filterName = filterName || "all";
            var $selectedScene = $('.selected-scene');
            // console.log(filterName);
            $('.scene-filter-menu').hide();
            $('.scene-filter-menu a').removeClass('active');
            var $temp = $('.scene-filter-menu [filter-name=' + filterName +"]");
            $temp.addClass("active");
            $selectedScene.find(".text").html($temp.html());
            
            if(filterName == "all"){ // 'all' means we do not need schema-filter
                filterName = null;
            }
            sceneFilter = filterName;
            stories.fetch({
                data:{schema: filterName},
                reset: true,
                success: function(){
                    // Backbone.trigger("render")
                }                
            });

        }
    }))()


    Backbone.history.start()

})





