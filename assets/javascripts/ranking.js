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
    
    var stories = new (Amour.Collection.extend({
        url: Amour.APIHost + '/sites/storylist/',
        model: Amour.Models.Story
    }))();
    
    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-list')
    });
    
    stories.fetch();
    
    var fetchMore = function() {
        console.log('fetching...');
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
    
})();
