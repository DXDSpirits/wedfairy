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
                //data.formatted_date = (new Date(data.time_created + '+0800')).toLocaleString();
                data.formatted_date = moment(data.time_created).format('YYYY-MM-DD HH:mm');
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
        url: Amour.APIRoot + 'staff/story/',
        model: Amour.Models.Story.extend({
            urlRoot: Amour.APIRoot + 'staff/story/'
        }),
        parse: function(response) {
            var collection = Amour.Collection.prototype.parse.call(this, response);
            var nonzero = _.filter(collection, function(item) {
                return item.progress != '0.0%';
            });
            if (nonzero.length == 0) {
                this.fetchNext({
                    remove: false
                });
            }
            return nonzero;
        }
    }))();
    
    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-list')
    });
    
    stories.fetch();
    stories.on('reset add', function() {
        $('#btn-more').toggleClass('hidden', stories.next == null);
    });
    
    $('#btn-more').on('click', function () {
        var btn = $(this);
        btn.button('loading');
        stories.fetchNext({
            remove: false,
            success: function () {
                btn.button('reset');
            }
        });
    });
    
    $('input[name=featured]').on('change', function() {
        var $checked = $('input[name=featured]:checked');
        if ($checked.length == 0) return;
        if ($checked.val() == 'on') {
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

    $('.form-search').on('submit', function(e) {
        e.preventDefault();
        var $input = $(this).find('input[name=mobile]');
        var mobile = $input.val();
        $input.val('');
        if (mobile) {
            $('input[name=featured]').parent().removeClass('active');
            stories.fetch({
                reset: true,
                data: { owner__username: mobile }
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
