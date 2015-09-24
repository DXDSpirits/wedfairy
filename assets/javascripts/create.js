(function () {
    var user = new Amour.Models.User();
    user.fetch({
        success: function() {
            // console.log(user.get('username'))
        }
    });
    var curThemes;
    var completePrototypes = new Amour.Collection();

    var LabelsView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            className: 'label-item text-center col-md-4 col-sm-4',
            template: '<div class="btn btn-label">{{name}}</div>',
            events: {
                'click': 'select'
            },
            initModelView: function() {
                this.listenTo(this.model, 'select', this.select);
            },
            select: function() {
                this.$el.addClass('selected')
                    .siblings().removeClass('selected');
                completePrototypes.trigger('filter', this.model.get('name'));
            }
        })
    });

    var StoryModelClone = Amour.Models.Story.extend({
        urlRoot: Amour.APIRoot + 'sites/storyname/',
        idAttribute: 'name',
        clone: function(options) {
            options = options || {};
            options.url = this.url() + 'clone/';
            this.save({}, options);
        }
    });

    var PrototypeListView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {

            },
            className: 'prototype-item animated fadeIn col-md-4 col-sm-4',
            template: $('#template-prototype-item').html(),
            serializeData: function() {
                var data = Amour.ModelView.prototype.serializeData.call(this);
                data.imageBlur = data.image + '?imageMogr2/thumbnail/640x/blur/10x6/';
                return data;
            },
            render: function() {
                Amour.ModelView.prototype.render.call(this);
                this.$el.attr('data-clone', this.model.get('name'));
                return this;
            }
        })
    });
    
    var newStory = new (Amour.View.extend({
        events: {
            // 'click .prototype-item': 'readyToCompose',
            'click .prototype-item': 'selectPrototype'
            // 'click .btn-ensure': 'saveClone'
            // 'click .compose-button': 'quickClone'
        },
        initialize: function() {
            this.prototypes = new Amour.Collection();
            this.labels = new Amour.Collection();
            this.initLabels();
            this.render();
            this.views = {
                prototypeListView: new PrototypeListView({
                    collection: this.prototypes,
                    el: this.$('.prototypes')
                }),
                labelsView: new LabelsView({
                    collection: this.labels,
                    el: this.$('.labels')
                })
            };
            this.listenTo(completePrototypes, 'filter', this.filterLabel);
            var self = this;

            $('.btn-ensure').click(function() {
                self.saveClone();
            })
        },
        selectPrototype: function(e) {
            var $frame = $("#story-frame");
            var prototypeName = $(e.currentTarget).closest('.prototype-item').data('clone');
            ga('send', 'event', 'prototypes', 'select', prototypeName);
            if (prototypeName != 'disable') {
                // $frame[0].src = "http://story.wedfairy.com/story/" + prototypeName;
                
                //select theme
                var ThemesView = Amour.CollectionView.extend({
                    ModelView: Amour.ModelView.extend({
                        events: {
                            // 'click .option': 'selectOption',
                            'click .avatar': 'selectTheme',
                            // 'click .btn.btn-ensure': 'saveClone'
                        },
                        className: 'theme animated fadeIn col-md-3 col-sm-3 col-xs-3',
                        template: $('#template-theme-item').html(),
                        serializeData: function() {
                            var data = Amour.ModelView.prototype.serializeData.call(this);
                            data.options = data.options || [];
                            if (!_.findWhere(data.options, {name:''})) {
                                data.options.unshift({ name: '', image: data.image });
                            }
                            return data;
                        },
                        selectTheme: function(e) {
                            var theme = this.model.get('name');
                            $(e.currentTarget).closest('.theme').addClass('selected').siblings().removeClass('selected');
                            $('.btn-ensure').removeAttr('disabled');
                            ga('send', 'event', 'themes', 'select', theme);
                            $("#story-frame")[0].src = "http://story.wedfairy.com/story/" + prototypeName + "?theme=" + theme;
                            window.themeName = theme;
                            window.prototypeName = prototypeName;
                        }
                    })
                });

                var newSelectThemes = new (Amour.View.extend({
                    initialize: function() {
                        this.themes = new (Amour.Collection.extend({
                            url: Amour.APIRoot + 'sites/theme/',
                        }))();
                        this.views = {
                            themes: new ThemesView({
                                collection: this.themes,
                                el: this.$('.themes-cube')
                            })
                        };
                        this.render();
                    },
                    render: function() {
                        this.themes.fetch({
                            url: Amour.APIRoot + "sites/storyname/" + prototypeName + "/themes/",
                            reset: true
                        });
                    }
                }))({el: $('#view-themes')});

                $("#preview-modal").on('hide.bs.modal', function() {
                    $frame[0].src = '';
                    $(".btn-ensure").attr('disabled', true);
                });

            };
        },
        saveClone: function() {
            var prototypeStory = new StoryModelClone({ name: window.prototypeName });
            var self = this;
            prototypeStory.clone({
                success: function(model) {
                    self.saveTheme(model.toJSON(), window.themeName);
                }
            });
        },
        // readyToCompose: function(e) {
        //     var prototypeName = $(e.currentTarget).closest('.prototype-item').data('clone');
        //     if (prototypeName != 'disable') {
        //         this.readyToCompose(prototypeName);
        //     }
        // },
        // quickClone: function(e) {
        //     e.stopPropagation && e.stopPropagation();
        //     var prototypeName = $(e.currentTarget).closest('.prototype-item').data('clone');
        //     if (prototypeName != 'disable') {
        //         this.cloneStory(prototypeName);
        //     }
        // },
        saveTheme: function(storyData, storyTheme) {
            var story = new Amour.Models.Story(storyData);
            if (!storyTheme) {
                window.location.href = "http://www.wefairy.com/my";
            } else {
                story.save({ theme: storyTheme }, {
                    url: story.url() + 'theme/',
                    success: function() {
                        // $('#preview-modal').modal("hide");
                        window.location.href = "http://www.wedfairy.com/my";
                    }
                });
            }
        },
        // cloneStory: function(storyName, storyTheme) {
        //     // console.log("cloneStory");
        //     var prototypeStory = new StoryModelClone({ name: storyName });
        //     var self = this;
        //     prototypeStory.clone({
        //         success: function(model) {
        //             self.saveTheme(model.toJSON(), storyTheme);
        //         }
        //     });
        // },
        filterLabel: function(label) {
            var prototypes = completePrototypes.filter(function(prototype) {
                return _.contains(prototype.get('labels'), label);
            });
            this.prototypes.reset(_.sortBy(prototypes, function(prototype) {
                return prototype.get('labels').length;
            }));
        },
        initLabels: function() {
            var labels = _.chain(completePrototypes.toJSON())
                          .pluck('labels').flatten().compact().uniq().value();
            if (labels.length == 0) {
                this.prototypes.reset(completePrototypes.toJSON());
            } else {
                this.labels.reset(_.map(labels, function(label) {
                    return {name: label};
                }));
                this.labels.findWhere({name: '热门'}).trigger('select');
            }
        },
        fetchPrototypesOnce: _.once(function() {
            var self = this;
            user.fetch({
                success: function() {
                    var referral = user.get('referral');
                    var data = {};
                    if (referral) data.vendor = referral;
                    completePrototypes.fetch({
                        url: Amour.APIRoot + 'clients/prototypes/',
                        data: data,
                        success: function(collection) {
                            // self.prototypes.reset(collection);
                            self.initLabels();
                        }
                    });
                }
            });
        }),
        render: function() {
            this.$('.prototypes').removeClass('invisible');
            this.fetchPrototypesOnce();
        }
    }))({el: $('#view-create')});
    
})();
