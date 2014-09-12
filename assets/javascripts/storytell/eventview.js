define(['storytell/app'], function(App) {
    
    var EventView = Amour.View.extend({
        tagName: 'section',
        className: 'view',
        templateHelpers: function() {
            return {
                details: App.story.getData('details'),
                schemaDetails: App.schema.getSection(this.storyEvent.get('name')).getData('details')
            }
        },
        initView: function(options) {
            options = options || {};
            this.storyEvent = new Amour.Models.StoryEvent();
            _.extend(this, _.pick(options, ['storyEvent', 'template']));
            this.initScroll();
            if (this.initEventView) this.initEventView(options);
        },
        initScroll: function() {
            var self = this;
            var scroll = function() {
                var winH = $(window).height();
                var dis = self.$el.offset().top - $(window).scrollTop();
                self.$el.toggleClass('animate', dis > -winH && dis < winH);
            };
            $(window).scroll(scroll);
        },
        serializeData: function() {
            return this.storyEvent && this.storyEvent.has('data') ? this.storyEvent.get('data') : {};
        },
        renderTemplate: function(attrs, template) {
            var template = template || _.result(this, 'template') || '';
            var attrs = this.mixinTemplateHelpers(attrs);
            var background = $(window).height() > $(window).width() ? 
                attrs['background-vertical'] || attrs['background']:
                attrs['background-horizontal'] || attrs['background'];
            background && this.$el.addClass('img').attr('data-bg-src', background);
            this.$el.html(Mustache.render(template, attrs));
            return this;
        },
        renderPage: function() {
            this.renderTemplate(this.serializeData());
            this.render();
            return this;
        }
    });
    
    var EventViewClass = App.EventViewClass;
    
    EventViewClass.hero = EventView.extend({
        render: function() {
            var coverImage = App.story.getData('coverImage');
            if (coverImage) {
                Amour.loadBgImage(this.$('.story-cover'), App.story.getData('coverImage'));
            } else {
                this.$('.story-cover').addClass('hidden');
            }
        }
    });
    
    EventViewClass.couple = EventView.extend({});
    
    EventViewClass.timeline = EventView.extend({
        serializeData: function() {
            var attrs = EventView.prototype.serializeData.call(this);
            if (attrs.timeline) {
                _.forEach(attrs.timeline, function(entry, index) {
                    entry.index = index + 1;
                    entry.even = (index % 2 == 1);
                });
            }
            return attrs;
        }
    });
    
    EventViewClass.bigday = EventView.extend({
        render: function() {}
    });
    
    EventViewClass.map = EventView.extend({
        renderMap: function() {
            var data = this.storyEvent.getData();
            if (data['map']) {
                Amour.loadBgImage(this.$('#map-canvas'), data['map']);
            } else if (data['coordinate']) {
                var params = {
                    center: data['coordinate'],
                    width: Math.min($(window).width(), 1024),
                    height: Math.min($(window).height(), 1024),
                    zoom: 15,
                    scale: devicePixelRatio
                };
                var queryStr = _.chain(params).pairs().map(function(pair) {
                    return pair[0] + '=' + pair[1];
                }).value().join('&');
                Amour.loadBgImage(this.$('#map-canvas'), 'http://api.map.baidu.com/staticimage?' + queryStr);
            }
            return this;
        },
        render: function() {
            this.renderMap();
            return this;
        }
    });
    
    EventViewClass.information = EventView.extend({
        render: function() {}
    });
    
    EventViewClass.gallery = EventView.extend({
        render: function() {}
    });
    
    EventViewClass.registry = EventView.extend({
        render: function() {}
    });
    
    EventViewClass.wish = EventView.extend({
        events: {
            'submit form': 'sendMessage'
        },
        initEventView: function() {
            this.messages = new (Amour.Collection.extend({
                url: Amour.APIHost + '/sites/story/' + App.story.id + '/wishes/',
                model: Amour.Model,
                send: function(content, sender) {
                    sender = sender || {};
                    this.create({
                        story: App.story.id,
                        message: content,
                        name: sender.name,
                        phone: sender.phone,
                        email: sender.email
                    }, {
                        url: Amour.APIHost + '/sites/wish/'
                    });
                }
            }))();
            this.listenTo(this.messages, 'add', this.addMessage);
            this.listenTo(this.messages, 'reset', this.renderMessages);
        },
        renderMessages: function() {
            var $messages = this.$('.messages');
            this.messages.forEach(function(item) {
                var $msg = $('<p></p>').text(item.get('message')).prepend('<i class="fa fa-heart-o"></i>');
                $messages.append($msg);
            });
        },
        addMessage: function(item) {
            var $msg = $('<p></p>').text(item.get('message')).prepend('<i class="fa fa-heart-o"></i>');
            this.$('.messages').prepend($msg);
        },
        sendMessage: function(e) {
            if (e.preventDefault) e.preventDefault();
            var content = this.$('textarea').val();
            if (content) {
                this.messages.send(content);
                this.$('textarea').val('').attr('placeholder', '谢谢你的祝福！');
            }
        },
        render: function() {
            this.messages.fetch({ reset: true });
        }
    });
    
});
