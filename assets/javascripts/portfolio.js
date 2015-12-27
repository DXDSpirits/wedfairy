(function() {

    var router;
    var storiesFilter = "storiesAll";
    var mobileNum, storyNameFilter, dateFilter, filterResult;
    var tagsFilter = "tagsAll";
    var filterArray = [];
    var StoryModel = Amour.Models.Story.extend({
        urlRoot: Amour.APIRoot + 'staff/story/',
        saveTags: function(tags) {
            this.save(tags, {
                url: this.url() + 'tags/',
                patch: true,
            });
        }
    });
    var tagFetchStatus = false;

    var themes = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'sites/theme/'
    }))();

    var tags = new (Amour.Collection.extend({
        url: Amour.APIRoot + 'search/universaltag/'
    }))();

    var tagsFilterView = new(Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            tagName: 'label',
            className: "radio-inline",
            template: '<input type="radio" name="tags-radio" value="{{name}}"> {{title}}'
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
            className: 'story-item text-center col-xs-6 col-sm-4 col-md-3 col-lg-2',
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
                // window.open('http://story.wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio', '_blank');
                $("#story-frame")[0].src = 'http://story.wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio';
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

    $(".menu #ensure-btn .btn").off("click").on('click', function(e) {
        e.preventDefault && e.preventDefault();
        filterArray = [];
        mobileNum = $('input[name=mobile]').val();
        storyNameFilter = $('input[name=storyName]').val();
        storiesFilter = $("#storyFilter input:checked").val();
        tagsFilter = $("#tagsFilter input:checked").val();
        var filterFrom = $("#filter-from").val();
        var filterTo = $("#filter-to").val();
        if(mobileNum != '') {
            filterArray.push('owner__username=' + mobileNum);
        }
        if(storyNameFilter != '') {
            filterArray.push('name=' + storyNameFilter);
        }
        if(tagsFilter != 'tagsAll') {
            filterArray.push('tag=' + tagsFilter);
        }
        if(storiesFilter != 'storiesAll') {
            if(storiesFilter == "storiesComplete") {
                filterArray.push('featured=1');
            }else if(storiesFilter == "storiesFeatured") {
                filterArray.push('featured=2');
            }
        }
        if (filterFrom && filterTo) {
            filterTo = moment(filterTo).add(1, 'days').format("YYYY-MM-DD");
            dateFilter = "time_created_from=" + filterFrom + "&time_created_to=" + filterTo;
            filterArray.push(dateFilter);
        }else{
            // alert("请输入完整时间区段");
        }
        if(filterArray) {
            filterResult = filterArray.join("&");
        }

        router.navigate('filter/' + filterResult);

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

    $('.input-daterange input').each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
            endDate: "0d",
            todayBtn: 'linked',
        });
    });

    var user = new Amour.Models.User();

    Amour.ajax.on('unauthorized forbidden', function() {
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

    function fillFilters() {
        var url = location.href;
        if(!_.contains(url, "#filter/")) {
            return;
        }

        filtersList = url.split("#filter/")[1].split("&");
        var filterDict = {};
        _.each(filtersList, function(item) {
            filterDict[item.split("=")[0]] = item.split("=")[1];
        });
        if(filterDict["featured"]) {
            if(filterDict["featured"] == 1) {
                $("#storyFilter input[value='storiesComplete']").attr('checked','checked');
                $("#storyFilter input[value='storiesComplete']").siblings().removeAttr('checked');
            }else if(filterDict["featured"] == 2) {
                $("#storyFilter input[value='storiesFeatured']").attr('checked','checked');
                $("#storyFilter input[value='storiesFeatured']").siblings().removeAttr('checked');
            }else {
                $("#storyFilter input").removeAttr('checked');
            }
        }
        if(filterDict["owner__username"]) {
            $(".searchbox-wrapper .form-search input[name='mobile']").val(filterDict["owner__username"]);
        }
        if(filterDict["name"]) {
            $(".searchbox-wrapper .story-search input[name='storyName']").val(filterDict["name"]);
        }
        if(filterDict["time_created_from"] && filterDict["time_created_to"]) {
            $(".searchbox-wrapper .form-date #filter-from").val(filterDict["time_created_from"]);
            $(".searchbox-wrapper .form-date #filter-to").val(moment(filterDict["time_created_to"]).subtract(1, "days").format("YYYY-MM-DD"));
        }
        if(tagFetchStatus) {
            if(filterDict["tag"]) {
                var tag = filterDict["tag"];
                $("#tagsFilter").find('input[value=' + tag + ']').attr('checked', 'checked');
                $("#tagsFilter").find('input[value=' + tag + ']').siblings().removeAttr('checked');
            }
        }
    }

    var router = new (Backbone.Router.extend({
        routes : {
            'all': 'filterAll',
            'featured': 'filterFeatured',
            'complete': 'filterComplete',
            'owner/:owner': 'filterOwner',
            'tag/:tag': 'filterTag',
            'name/:name': 'filterName',
            'date/:from/:to': 'filterDate',
            'filter/:filterItems' : 'filter',
            '*path': 'index'
        },
        initialize: function() {},
        navigate: function(fragment, options) {
            options = options || {};
            options.trigger = !(options.trigger === false);
            Backbone.Router.prototype.navigate.call(this, fragment, options);
        },
        filter: function(filterItems) {
            this.fetchStories(filterItems);
            fillFilters();
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
        },
        filterName: function(name) {
            this.fetchStories({ name: name });
        },
        filterDate: function(from, to) {
            this.fetchStories({
                time_created_from: from,
                time_created_to  : to
            });
        }
    }))();

    (function start() {
        themes.fetch();
        tags.fetch({
            traditional: true,
            data: { category: ['staff', 'story'] },
            success: function() {
                tagFetchStatus = true;
                fillFilters();
            }
        });
        $("#story-frame")[0].src = '';
        Backbone.history.start();
    })();

})();
