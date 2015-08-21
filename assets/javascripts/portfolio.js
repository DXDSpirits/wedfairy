(function() {

    var router;

    var StoryModel = Amour.Models.Story.extend({
        urlRoot: Amour.APIRoot + 'staff/story/',
        saveTags: function(tags) {
            this.save(tags, {
                url: this.url() + 'tags/',
                patch: true,
            });
        }
    });

    var themes = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/theme/'
    }))();

    var tags = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/universaltag/'
    }))();

    var tagsFilterView = new(Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            tagName: 'span',
            template: '<a class="btn btn-link" href="#tag/{{name}}">{{title}}</a>'
        })
    }))({
        collection: tags,
        el: $('.menu .tag-list')
    });

    var tagsModalView = new (Amour.View.extend({
        events: {
            'click .modal-footer button': 'confirm'
        },
        initView: function() {
            this.tags = new Amour.Collection();
            this.tagsSelectView = new(Amour.CollectionView.extend({
                ModelView: Amour.ModelView.extend({
                    events: { 'click': 'onClick' },
                    tagName: 'span',
                    template: '<span class="btn {{#if selected}}btn-success{{else}}btn-link{{/if}}">{{title}}</span>',
                    onClick: function() {
                        this.model.set('selected', !this.model.get('selected'));
                    }
                })
            }))({
                collection: this.tags,
                el: this.$('.tag-list')
            });
        },
        confirm: function() {
            var selectedTags = _.chain(this.tags.toJSON())
                                .where({ selected: true })
                                .pluck('name').value();
            this.story.saveTags({
                tags: selectedTags
            });
            this.$el.modal('hide');
        },
        setStory: function(story) {
            this.story = story;
            var tagsToRender = tags.toJSON();
            _.each(this.story.get('tags'), function(tag) {
                _.findWhere(tagsToRender, {name: tag.name}).selected = true;
            });
            this.tags.reset(tagsToRender);
        }
    }))({
        el: $('#tags-modal')
    });

    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .cover': 'onClick',
                'change select': 'modifyFeatured',
                'click .tags': 'selectTags'
            },
            className: 'story-item text-center col-xs-6 col-sm-3 col-md-2',
            template: $('#template-story-item').html(),
            serializeThemeData: function(data) {
                var themeName = data.theme || '', themeOptionName = '';
                var match = themeName.match(/^(.*)\[(.+)\]$/);
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
                this.serializeThemeData(data);
                return data;
            },
            onClick: function() {
                window.open('http://story.wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio', '_blank');
            },
            selectTags: function() {
                $('#tags-modal').modal('show');
                tagsModalView.setStory(this.model);
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
        model: StoryModel
    }))();
    
    var storyGalleryView = new StoryGalleryView({
        collection: stories,
        el: $('.story-list')
    });
    
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
        $('#login-modal').modal('show');
    });
    
    $('#login-button').on('click', function(e) {
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
            'tag/:tag': 'filterTag',
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
        fetchStories: function(data) {
            $('.story-list').addClass('animated fadeOut');
            stories.fetch({
                reset: true,
                data: data,
                success: function() {
                    $('.story-list').removeClass('animated fadeOut');
                }
            });
        },
        filterAll: function() {
            this.fetchStories();
        },
        filterFeatured: function() {
            this.fetchStories({ featured: 2 });
        },
        filterComplete: function() {
            this.fetchStories({ featured: 1 });
        },
        filterOwner: function(owner) {
            this.fetchStories({ owner__username: owner });
        },
        filterTag: function(tag) {
            this.fetchStories({ tag: tag });
        }
    }))();

    (function start() {
        themes.fetch();
        tags.fetch({
            traditional: true,
            data: { category: ['staff', 'story'] }
        });
        Backbone.history.start();
    })();

})();
