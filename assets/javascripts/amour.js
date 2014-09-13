(function() {
    
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
        var msViewportStyle = document.createElement("style");
        msViewportStyle.appendChild(
            document.createTextNode(
                "@-ms-viewport{width:auto!important}"
            )
        );
        document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
    }
    
    var fastclick = new FastClick(document.body);
    $('body').on('focus', 'textarea', function() {
        if (fastclick != null) {
            fastclick.destroy();
            fastclick = null;
        }
    });
    $('body').on('blur', 'textarea', function() {
        if (fastclick == null) {
            fastclick = new FastClick(document.body);
        }
    });
    
    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    
    /*
     * Amour
     */
    
    var Amour = {
        version: '1.0',
        APIHost: $('meta[name="APIHost"]').attr('content'),
        CDNURL: $('meta[name="CDNURL"]').attr('content')
    };
    
    /*
     * Events and Routers
     */
    
    // Allow the `Amour` object to serve as a global event bus
    _.extend(Amour, Backbone.Events);
    
    var EventAggregator = Amour.EventAggregator = (function() {
        var EA = function() {};
        EA.extend = Backbone.Model.extend;
        _.extend(EA.prototype, Backbone.Events);
        return EA;
    })();
    
    /*
     * Models and Views
     */
    
    var Model = Amour.Model = Backbone.Model.extend({
        initialize: function() {
            if (this.initModel) this.initModel();
        },
        url: function() {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
        }
    });
    
    var Collection = Amour.Collection = Backbone.Collection.extend({
        model: Model,
        initialize: function() {
            if (this.initCollection) this.initCollection();
        },
        parse: function(response) {
            if (response.results != null) {
                this.count = response.count;
                this.previous = response.previous;
                this.next = response.next;
                return response.results;
            } else {
                return response;
            }
        },
        fetchNext: function(options) {
            var options = options || {};
            if (this.next) {
                options.url = this.next;
                this.fetch(options);
            }
        },
        fetchPrev: function(options) {
            var options = options || {};
            if (this.previous) {
                options.url = this.previous;
                this.fetch(options);
            }
        }
    });
    
    var View = Amour.View = Backbone.View.extend({
        initialize: function(options) {
            if (this.initView) this.initView(options || {});
        },
        renderTemplate: function(attrs, template) {
            var template = template || _.result(this, 'template') || '';
            var attrs = this.mixinTemplateHelpers(attrs);
            this.$el.html(Mustache.render(template, attrs));
            this.$el.find('img[data-src]').addBack('img[data-src]').each(function() {
                Amour.loadImage($(this), $(this).data('src'));
            });
            this.$el.find('.img[data-bg-src]').addBack('.img[data-bg-src]').each(function() {
                Amour.loadBgImage($(this), $(this).data('bg-src'));
            });
            return this;
        },
        mixinTemplateHelpers: function(target){
            var target = target || {};
            return _.extend(target, _.result(this, 'templateHelpers'));
        }
    });
    
    var ModelView = Amour.ModelView = View.extend({
        listenToModel: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'hide', this.hide);
        },
        initView: function(options) {
            this.model = this.model || new Model();
            this.listenToModel();
            if (this.initModelView) this.initModelView(options || {});
        },
        setModel: function(model) {
            this.stopListening(this.model);
            this.model = model;
            this.listenToModel();
        },
        hide: function() {
            this.remove();
        },
        serializeData: function() {
            return this.model ? this.model.toJSON() : {};
        },
        render: function() {
            return this.renderTemplate(this.serializeData());
        }
    });
    
    var CollectionView = Amour.CollectionView = View.extend({
        ModelView: ModelView,
        listenToCollection: function() {
            this.listenTo(this.collection, 'reset', this.addAll);
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'remove', this.removeOne);
        },
        initView: function(options) {
            options = options || {};
            this.reverse = (options.reverse === true);
            this.collection = this.collection || new Collection();
            this.listenToCollection();
            if (this.initCollectionView) this.initCollectionView(options);
        },
        setCollection: function(collection) {
            this.stopListening(this.collection);
            this.collection = collection;
            this.listenToCollection();
        },
        renderItem: function(item) {
            var modelView = new this.ModelView({model: item});
            return modelView.render().el;
        },
        removeOne: function(item) {
            item.trigger('hide');
        },
        addOne: function(item) {
            var method = this.reverse ? 'prepend' : 'append';
            this.$el[method](this.renderItem(item));
        },
        addAll: function(_collection, options) {
            if (options && options.previousModels) {
                _.each(options.previousModels, function(model) {
                    model.trigger('hide');
                });
            }
            if (this.collection) {
                var nodelist = this.collection.reduce(function(nodelist, item) {
                    return nodelist.concat(this.renderItem(item));
                }, [], this);
                this.$el.html(this.reverse ? nodelist.reverse() : nodelist);
            }
        },
        render: function() {
            this.addAll();
            return this;
        }
    });
    
    /*
     * Utility Functions
     */
    
    Amour.isWeixin = /MicroMessenger/i.test(navigator.userAgent);
    Amour.isMobile = /iPhone|Android|iPad|Windows Phone/i.test(navigator.userAgent);
    
    Amour.storage = new function() {
        this.set = function(key, val) { localStorage.setItem(key, val); }
        this.get = function(key) { return localStorage.getItem(key); }
        this.del = function(key) { localStorage.removeItem(key); }
        try {
            localStorage.setItem('TEST_LOCALSTORAGE', 1);
        } catch (e) {
            alert('您的浏览器可能开启了“无痕(Private)浏览”，可能需要多次输入用户名和密码以保持登录状态');
            this.vault = {};
            this.set = function(key, val) { this.vault[key] = val; }
            this.get = function(key) { return this.vault[key]; }
            this.del = function(key) { this.vault[key] = null; }
        }
    };
    
    Amour.openWindow = function(link) {
        window.open(link, '_self', 'location=no');
    }
    
    Amour.imageFullpath = function(src) {
        return /^http:\/\//.test(src) ? src : Amour.CDNURL + src;
    };
    
    Amour.loadImage = function(img, src, options) {
        if (!src) return;
        options = options || {};
        var image = new Image(), image_src = Amour.imageFullpath(src);
        image.onload = function() {
            img.attr('src', image_src);
        };
        image.src = image_src;
    };
    
    Amour.loadBgImage = function(el, src, options) {
        if (!src) return;
        options = options || {};
        el.css('background-image', 'url(' + Amour.CDNURL + 'images/loading.gif' + ')');
        var image = new Image(), image_src = Amour.imageFullpath(src);
        image.onload = function() {
            el.removeClass('img-loading');
            el.css('background-image', 'url(' + image_src + ')');
        };
        el.addClass('img-loading');
        image.src = image_src;
    };
    
    /*
     * Models and Collections API
     */
    
    Amour.Models = {};
    Amour.Collections = {};
    
    var dataMixins = {
        getData: function(key) {
            var data = this.get('data');
            if (!_.isObject(data)) data = {};
            return key != null ? data[key] : data;
        },
        setData: function(key, value) {
            if (key == null) return;
            if (!_.isObject(this.attributes.data)) this.attributes.data = {};
            if (_.isObject(key)) {
                _.extend(this.attributes.data, key);
            } else {
                this.attributes.data[key] = value;
            }
        }
    };
    
    Amour.Models.StoryEvent = Amour.Model.extend({
        urlRoot: Amour.APIHost + '/sites/storyevent/'
    }).extend(dataMixins);
    
    Amour.Collections.StoryEvents = Amour.Collection.extend({
        url: Amour.APIHost + '/sites/storyevent/',
        model: Amour.Models.StoryEvent
    });
    
    Amour.Models.Story = Amour.Model.extend({
        urlRoot: Amour.APIHost + '/sites/story/',
        initModel: function() {
            this.storyEvents = new Amour.Collections.StoryEvents(this.get('storyEvents'));
            this.on('change:storyEvents', function() {
                this.storyEvents.set(this.get('storyEvents'));
            }, this);
        },
        getStoryEvent: function(name) {
            return this.storyEvents.findWhere({name: name});
        },
        getStoryEventData: function(name, key) {
            var storyEvent = this.storyEvents.findWhere({name: name});
            return storyEvent.getData(key);
        },
        updateStoryEvent: function(name, updates) {
            var storyEvent = this.storyEvents.findWhere({name: name});
            storyEvent.setData(updates);
            storyEvent.save();
        }
    }).extend(dataMixins);
    
    Amour.Collections.Stories = Amour.Collection.extend({
        url: Amour.APIHost + '/sites/story/',
        model: Amour.Models.Story
    });
    
    Amour.Models.Section = Amour.Model.extend({
        urlRoot: null
    }).extend(dataMixins);
    
    Amour.Collections.Sections = Amour.Collection.extend({
        url: null,
        model: Amour.Models.StoryEvent
    });
    
    Amour.Models.Schema = Amour.Model.extend({
        idAttribute: 'name',
        urlRoot: Amour.APIHost + '/sites/schema/',
        initModel: function() {
            this.sections = new Amour.Collections.Sections(this.get('sections'));
            this.on('change:sections', function() {
                this.sections.set(this.get('sections'));
            }, this);
        },
        getSection: function(name) {
            return this.sections.findWhere({name: name});
        }
    }).extend(dataMixins);
    
    Amour.Collections.Schemas = Amour.Collection.extend({
        url: Amour.APIHost + '/sites/schema/',
        model: Amour.Models.Schema
    });
    
    Amour.Models.User = Amour.Model.extend({
        urlRoot: Amour.APIHost + '/users/user/',
        initModel: function() {},
        parse: function(response) {
            return _.isArray(response) ? response[0] : response;
        },
        login: function(auth, options) {
            this.clear().set(auth);
            options = options || {};
            options.url = Amour.APIHost + '/api-token-auth/';
            var success = options.success;
            options.success = function(model, response, options) {
                Amour.TokenAuth.set(response.token);
                if (success) success(model, response, options);
                model.trigger('login');
            };
            this.save({}, options);
        },
        register: function(auth, options) {
            this.clear().set(auth);
            this.save({}, options);
        }
    });
    
    /*
     * Initializations
     */
    
    var initSync = function () {
        var authToken = Amour.storage.get('auth-token');
        var originalSync = Backbone.sync;
        Backbone.sync = function (method, model, options) {
            if (authToken) {
                _.extend((options.headers || (options.headers = {})), { 'Authorization': 'Token ' + authToken });
            }
            return originalSync.call(model, method, model, options);
        };
        Amour.TokenAuth = {
            get: function () {
                return _.clone(authToken);
            },
            set: function (token) {
                authToken = _.clone(token);
                Amour.storage.set('auth-token', authToken);
            },
            clear: function () {
                authToken = null;
                Amour.storage.del('auth-token');
            }
        };
    };
    
    var initAjaxEvents = function () {
        _.extend((Amour.ajax = {}), Backbone.Events);
        $(document).ajaxStart(function () {
            Amour.ajax.trigger('start');
        });
        $(document).ajaxStop(function () {
            Amour.ajax.trigger('stop');
        });
        $(document).ajaxError(function (event, jqxhr, settings, exception) {
            var response = jqxhr.responseJSON || {};
            if (jqxhr.status == 401 || jqxhr.status == 403 || jqxhr.status == 499) {
                Amour.TokenAuth.clear();
                Amour.ajax.trigger('unauthorized');
            } else if (settings.type == 'GET' && jqxhr.statusText != 'abort') {
                Amour.ajax.trigger('error');
            }
        });
    };
    
    var initErrorReporting = function() {
        var ClientError = Amour.Model.extend({
            urlRoot: Amour.APIHost + '/clients/error/' 
        });
        window.onerror = function(message) {
            try {
                var error = new ClientError();
                error.save({
                    message: message,
                    detail: {
                        url: location.href,
                        error: arguments,
                        userAgent: navigator.userAgent
                    }
                }, {global: false});
            } catch (e) {}
        };
    };
    
    /* 
     * Export
     */
    initSync();
    initAjaxEvents();
    initErrorReporting();
    window.Amour = Amour;
    
})();
