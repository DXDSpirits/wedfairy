(function () {
    var user = new Amour.Models.User();
    var token = Amour.TokenAuth.get();
    var prototypeName;
    var themeName = null;
    user.fetch({
        success: function() {
        }
    });

    if(!token) {
        unLoginRedirect();
    }

    Amour.ajax.on('unauthorized', function() {
        unLoginRedirect();
    });

    function unLoginRedirect() {
        location.href="/my";
    };

    var newStoryURL = 'http://story.wedfairy.com/dashboard/#new-story-compose/';
    location.href = 'http://story.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(newStoryURL);

    // var completePrototypes = new Amour.Collection();

    // var LabelsView = Amour.CollectionView.extend({
    //     ModelView: Amour.ModelView.extend({
    //         className: 'label-item text-center',
    //         template: '<div class="btn btn-label">{{name}}</div>',
    //         events: {
    //             'click': 'select'
    //         },
    //         initModelView: function() {
    //             this.listenTo(this.model, 'select', this.select);
    //         },
    //         select: function() {
    //             this.$el.addClass('selected')
    //                 .siblings().removeClass('selected');
    //             completePrototypes.trigger('filter', this.model.get('name'));
    //         }
    //     })
    // });

    // var StoryModelClone = Amour.Models.Story.extend({
    //     urlRoot: Amour.APIRoot + 'sites/storyname/',
    //     idAttribute: 'name',
    //     clone: function(options) {
    //         options = options || {};
    //         options.url = this.url() + 'clone/';
    //         this.save({}, options);
    //     }
    // });

    // var PrototypeListView = Amour.CollectionView.extend({
    //     ModelView: Amour.ModelView.extend({
    //         events: {

    //         },
    //         className: 'prototype-item animated fadeIn col-md-4 col-sm-4 col-xs-4',
    //         template: $('#template-prototype-item').html(),
    //         serializeData: function() {
    //             var data = Amour.ModelView.prototype.serializeData.call(this);
    //             data.imageBlur = data.image + '?imageMogr2/thumbnail/640x/blur/10x6/';
    //             return data;
    //         },
    //         render: function() {
    //             Amour.ModelView.prototype.render.call(this);
    //             this.$el.attr('data-clone', this.model.get('name'));
    //             return this;
    //         }
    //     })
    // });

    // var newStory = new (Amour.View.extend({
    //     events: {
    //         'click .prototype-item': 'selectPrototype'
    //     },
    //     initialize: function() {
    //         this.prototypes = new Amour.Collection();
    //         this.labels = new Amour.Collection();
    //         this.initLabels();
    //         this.render();
    //         this.views = {
    //             prototypeListView: new PrototypeListView({
    //                 collection: this.prototypes,
    //                 el: this.$('.prototypes')
    //             }),
    //             labelsView: new LabelsView({
    //                 collection: this.labels,
    //                 el: this.$('.labels')
    //             })
    //         };
    //         this.listenTo(completePrototypes, 'filter', this.filterLabel);
    //         var self = this;

    //         $('.btn-ensure').click(function() {
    //             self.saveClone();
    //         })
    //     },
    //     selectPrototype: function(e) {
    //         // var curThemesCollection;
    //         var curPage = 1;
    //         var totalPage = 1;
    //         var newStoryName;
    //         var $frame = $("#story-frame");
    //         prototypeName = $(e.currentTarget).closest('.prototype-item').data('clone');
    //         // window.prototypeName = prototypeName;
    //         $frame[0].src = "http://story.wedfairy.com/story/" + prototypeName;
    //         ga('send', 'event', 'prototypes', 'select', prototypeName);
    //         if (prototypeName != 'disable') {

    //             //select theme
    //             var ThemesView = Amour.CollectionView.extend({
    //                 ModelView: Amour.ModelView.extend({
    //                     events: {
    //                         'click .avatar': 'selectTheme'
    //                     },
    //                     className: 'theme animated fadeIn col-md-3 col-sm-3 col-xs-3',
    //                     template: $('#template-theme-item').html(),
    //                     initialize: function() {
    //                         themeName = null;
    //                     },
    //                     serializeData: function() {

    //                         var data = Amour.ModelView.prototype.serializeData.call(this);
    //                         data.options = data.options || [];
    //                         if (!_.findWhere(data.options, {name:''})) {
    //                             data.options.unshift({ name: '', image: data.image });
    //                         }
    //                         return data;
    //                     },
    //                     selectTheme: function(e) {
    //                         var theme = this.model.get('name');
    //                         $(e.currentTarget).closest('.theme').addClass('selected').siblings().removeClass('selected');
    //                         // $('.btn-ensure').removeAttr('disabled').addClass('enable');
    //                         ga('send', 'event', 'themes', 'select', theme);
    //                         $("#story-frame")[0].src = "http://story.wedfairy.com/story/" + prototypeName + "?theme=" + theme;
    //                         themeName = theme;
    //                     }
    //                 })
    //             });

    //             var newSelectThemes = new (Amour.View.extend({
    //                 initialize: function() {
    //                     var self = this;
    //                     this.themes = new (Amour.Collection.extend({
    //                         url: Amour.APIRoot + 'sites/theme/',
    //                     }))();
    //                     self.render();
    //                 },
    //                 render: function() {
    //                     // var tempCollection = new (Amour.Collection.extend({
    //                     //     url: Amour.APIRoot + 'sites/theme/',
    //                     // }))();
    //                     $('.themes-cube').html('')
    //                     var tempCollection = new Amour.Collection;

    //                     this.themes.fetch({
    //                         url: Amour.APIRoot + "sites/storyname/" + prototypeName + "/themes/",
    //                         reset: true,
    //                         success: function(collection) {
    //                             totalPage = ((collection.length-1)/8 | 0)+ 1;
    //                             // self.render();
    //                             var sliceCollection = collection.slice(curPage*8-8, curPage*8);
    //                             _.each(sliceCollection, function(model){
    //                                 tempCollection.push(model);
    //                             });
    //                             $(".paging-left, .paging-right").show();
    //                             if(curPage == 1) {
    //                                 $(".paging-left").hide();
    //                             };
    //                             if(curPage == totalPage) {
    //                                 $(".paging-right").hide();
    //                             };
    //                         }
    //                     });
    //                     this.views = {
    //                         themes: new ThemesView({
    //                             collection: tempCollection,
    //                             el: this.$('.themes-cube')
    //                         })
    //                     };
    //                     tempCollection.reset();
    //                 }
    //             }))({el: $('#view-themes')});

    //             $("#preview-modal").on('hide.bs.modal', function() {
    //                 $frame[0].src = '';
    //                 // $(".btn-ensure").attr('disabled', true).removeClass('enable');
    //                 // newSelectThemes.reset();
    //             });
    //         };
    //         $(".paging-left").off('click').click(function() {
    //             curPage--;
    //             newSelectThemes.render();
    //         });
    //         $(".paging-right").off('click').click(function() {
    //             curPage++;
    //             newSelectThemes.render();
    //         });
    //     },
    //     saveClone: function() {
    //         var prototypeStory = new StoryModelClone({ name: prototypeName });
    //         var self = this;
    //         prototypeStory.clone({
    //             success: function(model) {
    //                 newStoryName = model.get('name');
    //                 self.saveTheme(model.toJSON(), themeName);
    //             }
    //         });
    //     },
    //     saveTheme: function(storyData, storyTheme) {
    //         var story = new Amour.Models.Story(storyData);
    //         if (!storyTheme) {
    //             $("#story-frame")[0].src = '';
    //             var editURL = "http://compose.wedfairy.com/storyguide/" + newStoryName + "/";
    //             var mobileEditURL = 'http://compose.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(editURL);
    //             window.location.href = mobileEditURL;
    //         } else {
    //             story.save({ theme: storyTheme }, {
    //                 url: story.url() + 'theme/',
    //                 success: function() {
    //                     // 防止从跳转页面回退到create页面的时候会有背景音乐
    //                     $("#story-frame")[0].src = '';
    //                     var editURL = "http://compose.wedfairy.com/storyguide/" + newStoryName + "/";
    //                     var mobileEditURL = 'http://compose.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(editURL);
    //                     window.location.href = mobileEditURL;
    //                 }
    //             });
    //         }
    //     },
    //     filterLabel: function(label) {
    //         var prototypes = completePrototypes.filter(function(prototype) {
    //             return _.contains(prototype.get('labels'), label);
    //         });
    //         this.prototypes.reset(_.sortBy(prototypes, function(prototype) {
    //             return prototype.get('labels').length;
    //         }));
    //     },
    //     initLabels: function() {
    //         var labels = _.chain(completePrototypes.toJSON())
    //                       .pluck('labels').flatten().compact().uniq().value();
    //         if (labels.length == 0) {
    //             this.prototypes.reset(completePrototypes.toJSON());
    //         } else {
    //             this.labels.reset(_.map(labels, function(label) {
    //                 return {name: label};
    //             }));
    //             this.labels.findWhere({name: '热门'}).trigger('select');
    //         }
    //     },
    //     fetchPrototypesOnce: _.once(function() {
    //         var self = this;
    //         user.fetch({
    //             success: function() {
    //                 var referral = user.get('referral');
    //                 var data = {};
    //                 if (referral) data.vendor = referral;
    //                 completePrototypes.fetch({
    //                     url: Amour.APIRoot + 'clients/prototypes/',
    //                     data: data,
    //                     success: function(collection) {
    //                         self.initLabels();
    //                     }
    //                 });
    //             }
    //         });
    //     }),
    //     render: function() {
    //         this.$('.prototypes').removeClass('invisible');
    //         this.fetchPrototypesOnce();
    //     }
    // }))({el: $('#view-create')});

})();
