(function() {
    
    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .cover': 'onClick',
                'click .fa-check-circle': 'feature'
            },
            className: 'story-item text-center col-xs-6 col-sm-3 col-md-2',
            template: '<div class="cover img" data-bg-src="{{data.coverImage}}"></div>' +
                      '<p class="small">{{formatted_date}}</p>' +
                      '<p class="name">{{name}}</p>' +
                      '<p class="{{#featured}}text-primary{{/featured}}">{{progress}} <i class="fa fa-lg fa-check-circle"></i></p>' +
                      '<p>{{owner}}</p>' +
                      '<p class="title">{{title}}</p>',
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                return data;
            },
            onClick: function() {
                window.open('http://wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio', '_blank');
            },
            feature: function(e) {
                if (!this.model.get('featured')) {
                    this.model.save({}, {
                        url: this.model.url() + 'feature/'
                    });
                } else {
                    this.model.save({}, {
                        url: this.model.url() + 'unfeature/'
                    });
                }
            }
        })
    });
    
    var stories = new (Amour.Collection.extend({
        url: Amour.APIHost + '/staff/story/',
        model: Amour.Models.Story.extend({
            urlRoot: Amour.APIHost + '/staff/story/'
        })
    }))();
    
    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-list')
    });
    
    stories.fetch();
    
    $('#btn-more').on('click', function () {
        var btn = $(this);
        if (stories.next) {
            btn.button('loading');
            stories.fetchNext({
                remove: false,
                success: function () {
                    btn.button('reset');
                }
            });
        } else {
            btn.addClass('hidden');
        }
    });
    
    $('input[name=featured]').on('change', function() {
        if ($('input[name=featured]:checked').val() == 'on') {
            stories.fetch({
                reset: true,
                data: { featured: 'True' }
            });
        } else {
            stories.fetch({
                reset: true
            });
        }
    });
    
    var user = new Amour.Models.User();
    
    Amour.ajax.on('unauthorized', function() {
        $('#loginModal').modal('show');
    });
    
    $('#loginButton').on('click', function(e) {
        e.preventDefault && e.preventDefault();
        var username = $('#loginForm input[name=username]').val() || null;
        var password = $('#loginForm input[name=password]').val() || null;
        if (username && password) {
            user.login({ username : username, password : password }, {
                success: function(model, response, options) {
                    location.reload();
                },
                error: function(model, response, options) {
                    alert('登录失败');
                }
            });
        }
    });
    
})();
