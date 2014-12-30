(function() {
    
    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .cover': 'onClick'
            },
            className: 'story-item text-center col-xs-6 col-sm-3 col-md-2',
            template: '<div class="cover img" data-bg-src="{{data.coverImage}}"></div>' +
                      '<p class="small">{{formatted_date}}</p>' + 
                      '<p class="name">{{name}}<br>(<strong>{{progress}}</strong>)</p><p>{{owner}}</p>' +
                      '<p class="title">{{title}}</p>',
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created)).toLocaleString();
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
    
    $('#btn-more').click(function () {
        var btn = $(this);
        btn.button('loading');
        stories.fetchNext({
            remove: false,
            success: function () {
                btn.button('reset');
            }
        });
    });
    
})();
