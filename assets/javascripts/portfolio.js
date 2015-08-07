(function() {
    
    var router;

    var themes = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/theme/'
    }))();

    var schemas = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/schema/'
    }))();

    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .cover': 'onClick',
                'change select': 'modifyFeatured'
            },
            className: 'story-item text-center col-xs-6 col-sm-3 col-md-2',
            template: $('#template-story-item').html(),
            serializeThemeData: function(data) {
                var themeName = data.theme, themeOptionName = '';
                var match = data.theme.match(/^(.*)\[(.+)\]$/);
                if (match) {
                    themeName = match[1];
                    themeOptionName = match[2];
                }
                var themeModel = themes.findWhere({name: themeName});
                if (themeModel) {
                    data.themeTitle = themeModel.get('title');
                    var themeOption = _.findWhere(themeModel.get('options'), {name: themeOptionName});
                    data.themeImage = themeOption ? themeOption.image : themeModel.get('image');
                } else {
                    data.themeTitle = data.theme;
                }
            },
            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = moment(data.time_created).format('YYYY-MM-DD HH:mm');
                data.likes = data.likes || 0;
                data.isNew = (data.featured == 0);
                data.isFinished = (data.featured == 1);
                data.isFeatured = (data.featured == 2);
                data.isPrototype = (data.featured == 3);
                this.serializeThemeData(data);
                return data;
            },
            onClick: function() {
                window.open('http://wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio', '_blank');
            },
            modifyFeatured: function() {
                var featured = +this.$('select').val();
                if (this.model.get('featured') != featured) {
                    this.model.save({
                        featured: featured
                    }, {
                        url: this.model.url() + 'feature/'
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
                //return item.progress != '0.0%';
                return true;
            });
            if (nonzero.length == 0) {
                this.fetchNext({ remove: false });
            }
            return nonzero;
        }
    }))();
    
    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-list')
    });
    
    stories.on('reset add', function() {
        $('#btn-more').toggleClass('hidden', stories.next == null);
    });
    
    var schemasFilterView = new(Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click': 'onClick'
            },
            tagName: 'span',
            className: 'schema-item',
            template: '{{title}}',
            onClick: function() {
                router.navigate('schema/' + this.model.get('name'));
            }
        })
    }))({
        collection: schemas,
        el: $('.schema-list')
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
        var val = +$checked.val();
        var status = ['all', 'complete', 'featured'];
        router.navigate(status[val]);
    });

    $('.form-search').on('submit', function(e) {
        e.preventDefault();
        var $input = $(this).find('input[name=mobile]');
        var mobile = $input.val();
        $input.val('');
        if (mobile) {
            $('input[name=featured]').parent().removeClass('active');
            router.navigate('owner/' + mobile);
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
    
    var router = new (Backbone.Router.extend({
        routes : {
            'all': 'filterAll',
            'featured': 'filterFeatured',
            'complete': 'filterComplete',
            'owner/:owner': 'filterOwner',
            'schema/:schema': 'filterSchema',
            '*path': 'index'
        },
        initialize: function() {},
        navigate: function(fragment, options) {
            options = options || {};
            options.trigger = !(options.trigger === false);
            Backbone.Router.prototype.navigate.call(this, fragment, options);
        },
        index: function() {
            this.navigate('all');
        },
        filterAll: function() {
            stories.fetch({ reset: true });
        },
        filterFeatured: function() {
            stories.fetch({ reset: true, data: { featured: 2 } });
        },
        filterComplete: function() {
            stories.fetch({ reset: true, data: { featured: 1 } });
        },
        filterOwner: function(owner) {
            stories.fetch({ reset: true, data: { owner__username: owner } });
        },
        filterSchema: function(schema) {
            stories.fetch({ reset: true, data: { schema: schema } });
        }
    }))();

    (function start() {
        // stories.fetch();
        themes.fetch();
        schemas.fetch();
        Backbone.history.start();
    })();

})();
