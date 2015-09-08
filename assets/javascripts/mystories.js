(function () {

    $("#global-footer-float-group").addClass('hidden');
    var token = Amour.TokenAuth.get();

    Amour.ajax.on('unauthorized forbidden', function() {
        $('#loginModal').modal('show');
    });
    if(token == null) {
        $('#loginModal').modal('show');
    };
    
    var user = new Amour.Models.User();

    user.fetch({
        success: function() {
            var username = user.get('username');
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
            preview: function() {
                window.open('http://story.wedfairy.com/story/' + this.model.get('name') + '/?from=portfolio', '_blank');
            },
            edit: function() {
                var token = Amour.TokenAuth.get();

                var editURL = "http://site.wedfairy.com/compose/" + this.model.get('name');
                document.location.href = 'http://site.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(editURL);

                // var editURL = "http://compose.wedfairy.com/storyguide/" + this.model.get('name') + "/";
                // var mobileEditURL = 'http://compose.wedfairy.com/corslogin/' + token + '?url=' + encodeURIComponent(editURL);
                // $('#story-edit-qrcode').empty().qrcode({
                //     size: 150,
                //     text: mobileEditURL
                // });
                // $(".mobile-edit-url").click(function() {
                //     document.location.href = mobileEditURL;
                // })
            },
            getCoverImg: function() {
                var coverImgURL = this.model.getData('coverImage');
                $('.modal-story-cover').attr('style',"background: url(" + coverImgURL + ");background-size: cover");
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
                        var commentLength = comments.models.length;
                        if(commentLength == 0) {
                            $('.comments-hint').removeClass('hidden');
                            $('.comments-container').addClass('hidden');
                        }else {
                            $('.comments-hint').addClass('hidden');
                            $('.comments-container').removeClass('hidden');
                        };
                    }
                });
            },
            hide: function() {
                this.$el.removeClass('animated fadeIn').animate({
                    opacity: 0
                }, 1000, function() {
                    $(this).remove();
                })
            },
            archive: function() {
                this.getCoverImg();
                var self = this;
                $("#delete-modal")
                    .modal('show')
                    .find(".delete-button")
                    .off('click')
                    .one('click', function() {
                        self.model.destroy();
                    });
            },
            share: function() {
                var storyURL = 'http://story.wedfairy.com/story/' + this.model.get('name');
                var storyTitle = this.model.get("title");
                var storyDesc = this.model.get('description');
                var storyPic = this.model.getData('coverImage');
                var shareContent = '【' + storyTitle + '】' + storyDesc;

                $('#story-qrcode').empty().qrcode({
                    size: 150,
                    text: storyURL + '/?from=desktopqrcode'
                });
                $(".sns-douban").off('click').one('click', function() {
                    var urlDoubanShare = storyURL + "?from=doubanshare";
                    var d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',r='http://www.douban.com/recommend/?url='+e(urlDoubanShare)+'&title='+e(shareContent)+'&v=1',w=450,h=330,x=function(){if(!window.open(r,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width='+w+',height='+h+',left='+(screen.width-w)/2+',top='+(screen.height-h)/2))location.href=r+'&r=1'};
                    if(/Firefox/.test(navigator.userAgent)){
                        setTimeout(x,0)
                    }else{x()}
                });
                $(".sns-weibo").off('click').one('click', function() {
                    var urlWeiboShare = storyURL + '?from=weiboshare';
                    var link = getWeiboLink(screen, document, encodeURIComponent,
                                            'http://www.wedfairy.com', 'http://www.wedfairy.com',
                                            storyPic, storyDesc, urlWeiboShare, 'utf-8');
                    window.open(link, '_blank');
                });
                $(".sns-renren").off('click').one('click', function() {
                    var urlRenrenShare = storyURL + "?from=renrenshare";
                    var rrShareParam = {
                        resourceUrl : '',   //分享的资源Url
                        srcUrl : urlRenrenShare,    //分享的资源来源Url,默认为header中的Referer,如果分享失败可以调整此值为resourceUrl试试
                        pic : storyPic,       //分享的主题图片Url
                        title : storyTitle,     //分享的标题
                        description : storyDesc    //分享的详细描述
                    };
                    rrShareOnclick(rrShareParam);
                });
                $(".sns-qzone").off('click').one('click', function() {
                    var qzonep = {
                            url: storyURL + '?from=qzone',
                            showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
                            desc: storyDesc,/*默认分享理由(可选)*/
                            summary:'',/*分享摘要(可选)*/
                            title:storyTitle,/*分享标题(可选)*/
                            site:'八音盒轻故事',/*分享来源 如：腾讯网(可选)*/
                            pics: storyPic, /*分享图片的路径(可选)*/
                            style:'201',
                            width:15,
                            height:15
                        };
                    var qzones = [];
                    for(var i in qzonep){
                        qzones.push(i + '=' + encodeURIComponent(qzonep[i]||''));
                    };
                    qzoneURL = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + qzones.join('&');
                    window.open(qzoneURL);
                });
            }
        })
    });

    var stories = new Amour.Collections.Stories();
    var storyGalleryView = new StoryGalleryView({
        reverse: true,
        collection: stories,
        el: $('.mystory-container')
    });

    stories.fetch({
        reset: true,
        success: function() {}
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
            className: 'animated',
            template: $("#story-comment-item-template").html(),

            serializeData: function() {
                var data = this.model ? this.model.toJSON() : {};
                data.formatted_date = moment(data.time_created).format('YYYY-MM-DD hh:mm');
                data.avatar = data.avatar || "/images/default-avatar.png";
                return data;
            },
            deleteComment: function(e) {
                var r = confirm("你确定要删除这条留言?");
                if (r == true) {
                    comments.remove(this.model);
                    this.model.destroy();
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

})();
