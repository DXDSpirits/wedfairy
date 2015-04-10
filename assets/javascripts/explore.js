$(function() {



    var curPage = 1;
    var totoalPage = 1;

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
            }
        })
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
        $('.pagination-controller .btn').css("visibility" ,"visible");
        if(curPage == 1){
            $('.pagination-controller .prev-btn').css("visibility" ,"hidden");
        }

        if(!stories.next && curPage == totoalPage){
            $('.pagination-controller .next-btn').css("visibility" ,"hidden");
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
            stories.fetchNext({
                remove: false, 
                success: function() {
                    Backbone.trigger("render");
                }
            });    
        }

        if(needRender){
            Backbone.trigger("render");
        }

    })




})