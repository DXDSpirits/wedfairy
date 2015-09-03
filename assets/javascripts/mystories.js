$(function () {
    $("#global-footer-float-group").addClass('hidden');
    var token = Amour.TokenAuth.get();

    Amour.ajax.on('unauthorized', function() {
        $('#loginModal').modal('show');
    });
    if(token == null) {
        $('#loginModal').modal('show');
    };
    
    var user = new Amour.Models.User();

    user.fetch({
        success: function() {
            var username = user.get('username');
            // console.log(username);
        }
    });
    $(".btn-newstory").click(function() {
        /* Act on the event */
        var newStoryURL = "http://site.wedfairy.com/choose-story-type/";
        location.href = 'http://site.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(newStoryURL);
    });

    var StoryGalleryView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .btn-preview': 'preview',
                'click .btn-edit': 'edit',
                'click .btn-duplicate': 'duplicate',
                'click .btn-comment': 'comment',
                'click .btn-delete': 'archive',
                'click .share-btn': 'share',
            },
            className: 'animated fadeIn col-lg-3 col-md-4 col-sm-6 col-xs-6 story-item',
            template: $("#mystory-template").html(),

            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = moment(data.last_modified).format('YYYY-MM-DD');
                return data;
            },
            initPage: function() {
                var coverImgURL = this.model.getData('coverImage');
                $('.modal-story-cover').attr('style',"background: url(" + coverImgURL + ") no-repeat top;background-size: cover"
                );
            },
            preview: function() {
                window.open('http://story.wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio', '_blank');
            },
            edit: function() {
                var token = Amour.TokenAuth.get();
                var editURL = "http://site.wedfairy.com/compose/" + this.model.get('name');
                location.href = 'http://site.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(editURL);
                // document.location.href = editURL;
            },
            getCoverImg: function() {
                var coverImgURL = this.model.getData('coverImage');
                $('.modal-story-cover').attr('style',"background: url(" + coverImgURL + ");background-size: cover"
                );
            },
            duplicate: function() {
                this.getCoverImg();
            },
            comment: function() {
                window.open(Amour.APIRoot + 'sites/wish/?story=' + this.model.get('id'));
            },
            hide: function() {
                this.$el.animate({
                    opacity: 0
                }, 1000, function() {
                    $(this).remove();
                })
            },
            archive: function() {
                this.getCoverImg();
                $("#delete-modal").modal('show');
                var self = this;
                $(".delete-button").click(function() {
                    _.defer(function() {
                        self.model.destroy();
                        $("#delete-modal").modal('hide');
                    });
                });
                $(".cancel-button").click(function() {
                    $("#delete-modal").modal('hide');
                });
            },
            share: function() {
                $('#story-qrcode').qrcode({
                    size: 180,
                    text: 'http://story.wedfairy.com/story/' + this.model.get('name') + '/?from=desktopqrcode'
                });
                $("")
            },
        })
    });

    var stories = new Amour.Collections.Stories();
    var storyGalleryView = new StoryGalleryView({
            reverse: true,
            collection: stories,
            el: $('.mystory-container')
        })

    stories.fetch({
        reset: true,
        success: function() {
            console.log("success!")
        }
    });

    // var ROUTER = new (Backbone.Router.extend({
    //     routes: {
    //         ':tagFilter': 'tagFilter',
    //         '': 'tagFilter'
    //     },
    //     tagFilter: function(filterName) {
    //         if (EXPLORE_FILTER_NAME === "featured") {
    //             EXPLORE_FILTER_NAME = "staffpicks";
    //         };
    //         var filterName = EXPLORE_FILTER_NAME;
    //         // var filterName = filterName || "all";
    //         // var $selectedScene = $('.selected-scene');
    //         // $('.scene-filter-menu').hide();
    //         // $('.scene-filter-menu a').removeClass('active');
    //         // var $temp = $('.scene-filter-menu [filter-name=' + filterName +"]");
    //         // $temp.addClass("active");
    //         // $selectedScene.find(".text").html($temp.html());
    //         // if (filterName == "all") { // 'all' means we do not need tag-filter
    //         //     filterName = null;
    //         // }
            
    //         stories.fetch({
    //             data: { tag: filterName },
    //             reset: true,
    //             success: function () {
    //                 $("#content-title").removeClass("hidden");
    //             }
    //         });
    //     }
    // }))();


    Backbone.history.start();

});


    // var isFetching = false;
    // Backbone.on('next-page', function() {
    //     if (isFetching) return;
    //     if (stories.next) {
    //         isFetching = true;
    //         $(".loading").removeClass("hidden");
    //         _.delay(function() {
    //             stories.fetchNext({
    //                 remove: false, 
    //                 success: function() {
    //                     isFetching = false;
    //                     $(".loading").addClass("hidden");
    //                 },
    //                 error: function() {
    //                     isFetching = false;
    //                     $(".loading").addClass("hidden");
    //                 }
    //             });
    //         }, 200);
    //     }
    // });

    // $(document).ready(function() {
    //     // var $aStr = EXPLORE_FILTER_NAME;
    //     var dict = {
    //         "all"       : "全部"，
    //         "wedding"   : "婚礼",
    //         "baby"      : "宝贝",
    //         "voyage"    : "旅行",
    //         "lover"     : "爱人",
    //         "idol"      : "偶像",
    //         "friendship": "友情",
    //         "yearbook"  : "新年书",
    //         "personal"  : "个人",
    //         "food"      : "美食",
    //         "family"    : "家人",
    //     };
    //     var $contentTitle = $('#content-title');
    //     if($aStr !== "首页") {
    //         $contentTitle.html("<h4>" + dict[$aStr] + "</h4>");
    //     }
    // });

    // // infinite scroll
    // // var throttle = _.throttle(function() {

    // //     if ($(window).scrollTop() + $(window).height() >= $('body').height() - 260) {
    // //         Backbone.trigger('next-page');
    // //     }
    // // }, 200);
    // // $(window).scroll(throttle);

    // // backbone router stuff
    // var ROUTER = new (Backbone.Router.extend({
    //     routes: {
    //         ':tagFilter': 'tagFilter',
    //         '': 'tagFilter'
    //     },
    //     tagFilter: function(filterName) {
    //         if (EXPLORE_FILTER_NAME === "featured") {
    //             EXPLORE_FILTER_NAME = "staffpicks";
    //         };
    //         var filterName = EXPLORE_FILTER_NAME;            
    //         stories.fetch({
    //             data: { tag: filterName },
    //             reset: true,
    //             success: function () {
    //                 $("#content-title").removeClass("hidden");
    //             }
    //         });
    //     }
    // }))();

    // stories.fetch({
    //     data: { 
    //         // tag: "friendship", 
    //         owner__username: username,
    //         limit : 10
    //     },
    //     reset: true,
    //     success: function () {
    //         $(".title-ranking").removeClass("hidden");
    //     }
    // });






