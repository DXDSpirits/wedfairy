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

    var getWeiboLink = function(s, d, e, r, l, p, t, z, c) {
        var f = 'http://service.weibo.com/share/share.php?appkey=', u = z || d.location,
        p = ['&url=', e(u), '&title=', e(t || d.title), '&source=', e(r), '&sourceUrl=', e(l), 
            '&content=', c || 'gb2312', '&pic=', e(p || ''), '&ralateUid=', '5224024448'].join('');
        return [f, p].join('');
    }

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
                var storyId = this.model.get('id');
                comments.fetch({
                    data:{
                        story: storyId, // story id
                    },
                    reset: true,
                    success: function(){
                        console.log("Get comments successfully!");
                    }
                });
                console.log(comments);
                // console.log("数目:" + comments.length);
                // $('.comments-container').html('');
                // if(comments.models.length == 0){
                //     // console.log("0");
                //     // $('.comments-container').html('<div class="wish-hint">暂时没有任何祝福</div>');
                //     $('.wish-hint').removeClass('hidden');
                // }else {
                //     $('.wish-hint').addClass('hidden');
                // }
                // var count = 0;
                // _.each(comments.models, function(model){
                //     var commentView = new CommentItemView({"model": model});
                //     commentView.render();
                //     count += 1
                // });
                // console.log("count: " + count);
                var commentLength = comments.models.length;
                if(commentLength == 0) {
                    console.log("yo " + commentLength);
                    // $('.comments-container').html('');
                    // $('.comments-container').html('<div class="wish-hint">暂时没有任何留言</div>');
                    // $('.wish-hint').removeClass('hidden');
                }else {
                    // $('.wish-hint').addClass('hidden');
                    _.each(comments.models, function(model){
                        var commentView = new CommentItemView({"model": model});
                        commentView.render();
                    });
                };
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
                var storyURL = 'http://story.wedfairy.com/story/' + this.model.get('name');
                var storyTitle = this.model.get("title");
                var storyDesc = this.model.get('description');
                var storyPic = this.model.getData('coverImage');
                var shareContent = '【' + storyTitle + '】' + storyDesc;
                if($("#story-qrcode").html() == "") {
                        $('#story-qrcode').qrcode({
                        size: 180,
                        text: storyURL + '/?from=desktopqrcode'
                    });
                };
                $(".sns-douban").click(function() {
                    var urlDoubanShare = storyURL + "?from=doubanshare";
                    var d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',r='http://www.douban.com/recommend/?url='+e(urlDoubanShare)+'&title='+e(shareContent)+'&v=1',w=450,h=330,x=function(){if(!window.open(r,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width='+w+',height='+h+',left='+(screen.width-w)/2+',top='+(screen.height-h)/2))location.href=r+'&r=1'};
                    if(/Firefox/.test(navigator.userAgent)){
                        setTimeout(x,0)
                    }else{x()}
                });
                $(".sns-weibo").click(function() {
                    var urlWeiboShare = storyURL + '?from=weiboshare';
                    var link = getWeiboLink(screen, document, encodeURIComponent,
                                            'http://www.wedfairy.com', 'http://www.wedfairy.com',
                                            storyPic, storyDesc, urlWeiboShare, 'utf-8');
                    window.open(link, '_blank');
                });
                $(".sns-renren").click(function() {
                    var urlRenrenShare = storyURL + "?from=renrenshare";
                    var rrShareParam = {
                        resourceUrl : urlRenrenShare,   //分享的资源Url
                        srcUrl : '',    //分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
                        pic : storyPic,       //分享的主题图片Url
                        title : storyTitle,     //分享的标题
                        description : storyDesc    //分享的详细描述
                    };
                    rrShareOnclick(rrShareParam);
                });
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
            // console.log("success!")
        }
    });

    // comment
    var Comment = Backbone.Model.extend({
        url: function(){
            return Amour.APIRoot + 'sites/wish/' + this.get('id') + "/";
        }
    })

    var comments = new (Backbone.Collection.extend({
                        model: Comment,
                        url: Amour.APIRoot + 'sites/wish/',
                      }))();


    var CommentItemView = Amour.CollectionView.extend({
        ModelView: Amour.ModelView.extend({
            events: {
                'click .comment-delete-btn': 'deleteComment',
            },
            className: 'animated fadeIn',
            template: $("#story-comment-item-template").html(),

            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = moment(data.time_created).format('YYYY-MM-DD hh:mm');
                return data;
            },
            deleteComment: function(e) {
                // window.open(Amour.APIRoot + 'sites/wish/?story=' + this.model.get('id'));
                e.stopPropagation();
                $('html').off('click');

                var r = confirm("你确定要删除这条留言?");
                if (r == true) {
                    comments.remove(this.model);
                    this.model.destroy();
                    console.log("删除成功");
                };

            },
            
        })
    });

    var commentListView = new CommentItemView({
        collection: comments,
        el: $('.comments-container')
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






