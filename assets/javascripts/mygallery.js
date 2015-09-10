(function() {
    $("#global-footer-float-group").addClass('hidden');
    var token = Amour.TokenAuth.get();
    Amour.ajax.on('unauthorized forbidden', function() {
        $('#view-albums').hide();
        $('#loginModal').modal('show');
    });
    if(token == null) {
        $('#view-albums').hide();
        $('#loginModal').modal('show');
    };
    
    var PhotoModel = Amour.Model.extend({
        urlRoot: Amour.APIRoot + 'sites/photo/'
    });
    
    var PhotoCollection = Amour.Collection.extend({
        model: PhotoModel,
        url: Amour.APIRoot + 'sites/photo/',
        parse: function(response) {
            response = Amour.Collection.prototype.parse.call(this, response);
            return response;
        }
    });
    
    var GalleryView = Amour.CollectionView.extend({
        addUpload: function(item) {
            this.$el.prepend(this.renderItem(item));
        },
        ModelView: Amour.ModelView.extend({
            events: {
                'click .sureTodelete': 'deleteImg',
                'click .delete-mask': 'photoShow'
            },
            className: 'photo-item img img-cover col-lg-2 col-md-3 col-sm-4 col-xs-6',
            template: $("#template-gallery-item").html(),
            initModelView: function() {
                this.stopListening(this.model, 'change');
                this.listenTo(this.model, 'change:url', this.render);
                this.listenTo(this.model, 'completeUpload', this.completeUpload);
                this.listenTo(this.model, 'startUpload', this.startUpload);
                this.listenTo(this.model, 'progressUpload', this.progressUpload);
                this.listenTo(this.model, 'failUpload', this.failUpload);
            },
            startUpload: function() {
                this.$el.html('<div class="progress">' +
                              
                              '<div class="progress-bar" style="width: 0;"></div>' +
                              '<div class="tip text-center">上传中</div>' +
                              '</div>');
                var progressWidth = $(".progress").width($(".photo-item").width());
            },
            progressUpload: function(percentage) {
                this.$('.progress-bar').css('width', percentage + '%');
                // this.$('.progress .tip').html(percentage + '%');
            },
            failUpload: function(errorTip) {
                this.$el.text(errorTip);
            },
            completeUpload: function() {
                this.render;
            },
            deleteImg: function() {

                var self = this;
                // _.defer(function() {
                    // if (confirm('确认删除照片?')) {
                        self.model.destroy();
                    // }
                    // });
            },
            photoShow: function() {
                // var url = this.model.get("url");
                console.log(this.model.get("url"));
                $('.photoShow').html('<img src="' + this.model.get("url") + '" />');
            }
        })
    });
    
    var uploader;
    var photoCollection = new PhotoCollection();
    var initUploader = _.once(function() {
        var uploadQueue = {};
        var uploadDomain = 'http://up.img.8yinhe.cn/';
        var uptoken_url = '/gallery/uptoken';

        uploader = Qiniu.uploader({
            runtimes: 'html5,html4',
            uptoken_url: uptoken_url,
            domain: uploadDomain,
            container: 'view-albums',
            browse_button: 'gallery-pickfiles',
            multi_selection: true,
            max_file_size: '10mb',
            dragdrop: true,
            drop_element: 'mygallery-upload-area',
            chunk_size: 0,
            multipart: true,
            unique_names: true,
            auto_start: true,
            filters: {
                mime_types : [
                    { title : "Image files", extensions : "jpg,jpeg,gif,png" },
                ]
            },
            resize: {
                width: 1280,
                height: 1280,
                quality: 85,
                preserve_headers: false
            },
            init: {
                FilesAdded: function(up, files) {

                },
                BeforeUpload: function(up, file) {
                    var photo = new PhotoModel();
                    uploadQueue[file.id] = photo;
                    photoCollection.add(photo, {at:0, silent:true});
                    galleryView.addUpload(photo);
                    photo.trigger('startUpload');
                },
                UploadProgress: function(up, file) {
                    var photo = uploadQueue[file.id];
                    photo.trigger('progressUpload', file.percent);

                },
                UploadComplete: function() {},
                FileUploaded: function(up, file, info) {
                    var photo = uploadQueue[file.id];
                    var url = uploadDomain + JSON.parse(info).key;
                    photo.save({url: url});
                    uploadQueue[file.id] = null;
                    photo.trigger('completeUpload');
                },
                Error: function(up, err, errTip) {
                    var photo = uploadQueue[err.file.id];
                    if (photo) {
                        photo.trigger('failUpload', errTip);
                        uploadQueue[err.file.id] = null;
                    } else {
                        alert(errTip);
                    }
                }
            }
        });
    });

    $("#mygallery-upload-area").on({
        dragenter: function(e){
            $(this).css('border-color', 'red'); 
        },
        dragover: function(e){
            $(this).css('border-color', 'red'); 
        },
        drop: function(e){
            $(this).css("border-color", ""); 
        },
        dragleave: function(e){
            $(this).css("border-color", ""); 
        },
        dragend: function(e){
            $(this).css("border-color", ""); 
        }
    });

    
    var galleryView = new GalleryView({
                    // reverse: false,
                    collection: photoCollection,
                    el: this.$('.gallery-wrapper')
                })

    photoCollection.fetch({
        reset: true,
        success: function() {
            initUploader();
        }
    });

    var isFetching = false;
    Backbone.on('next-page', function() {
        if (isFetching) return;
        if (photoCollection.next) {
            isFetching = true;
            $(".loading").removeClass("hidden");
            _.delay(function() {
                photoCollection.fetchNext({
                    remove: false, 
                    // reverse: true,
                    success: function() {
                        isFetching = false;
                        $(".loading").addClass("hidden");
                    },
                    error: function() {
                        isFetching = false;
                        $(".loading").addClass("hidden");
                    }
                });
            }, 200);
        }
    });


    var throttle = _.throttle(function() {
        if ($(window).scrollTop() + $(window).height() >= $('body').height() - 350) {
            Backbone.trigger('next-page');
        }
    }, 200);
    $(window).scroll(throttle);

    Backbone.history.start();

    // var myalbums = new (Amour.CollectionView.extend({
    //     events: {
    //         'click #gallery-pickfiles': 'pickWxImage',
    //         'click input[type=file]': 'onClickFileInput',
    //         'click .btn-readytodelete': 'readyToDelete',
    //         'click .btn-readytodelete-end': 'readyToDeleteEnd'
    //     },
    //     initPage: function() {
    //         this.views = {
    //             galleryView: new GalleryView({
    //                 reverse: true,
    //                 collection: photoCollection,
    //                 el: this.$('.gallery-wrapper')
    //             })
    //         };
    //     },
    //     uploadPickedFile: function(e) {
    //         uploader.addFile(e.currentTarget);
    //     },
    //     uploadWxImage: function(serverId) {
    //         $.get('/gallery/fetchwximg/' + serverId, function(data) {
    //             var photo = photoCollection.create({
    //                 url: data.url
    //             });
    //             photo.trigger('completeUpload');
    //         });
    //     },
    //     pickWxImage: function() {
    //         var self = this;
    //         var syncUpload = function(localIds) {
    //             if (localIds.length == 0) return;
    //             var localId = localIds.pop();
    //             wx.uploadImage({
    //                 localId: localId,
    //                 isShowProgressTips: 1,
    //                 success: function (res) {
    //                     var serverId = res.serverId;
    //                     self.uploadWxImage(serverId);
    //                     syncUpload(localIds);
    //                 }
    //             });
    //         };
    //         if (Amour.isWeixin) {
    //             wx.chooseImage({
    //                 success: function (res) {
    //                     syncUpload(res.localIds);
    //                 }
    //             });
    //         }
    //     },
    //     scrollToTop: function() {
    //         this.$('.wrapper').animate({
    //             scrollTop: 0
    //         });
    //     },
    //     resetPhotos: _.once(function() {
    //         if (Amour.isWeixin) {
    //             $('#pickfile-container').css('z-index', 0);
    //         } else {
    //             initUploader();
    //         }
    //         photoCollection.fetch();
    //     }),
    //     readyToDelete: function(forceReset) {
    //         this.$('.gallery-wrapper').addClass('ready-to-delete');
    //         this.$('.btn-readytodelete').addClass('hidden');
    //         this.$('.btn-readytodelete-end').removeClass('hidden');
    //     },
    //     readyToDeleteEnd: function() {
    //         this.$('.gallery-wrapper').removeClass('ready-to-delete');
    //         this.$('.btn-readytodelete').removeClass('hidden');
    //         this.$('.btn-readytodelete-end').addClass('hidden');
    //     },
    //     leave: function() {
    //         this.readyToDeleteEnd();
    //     },
    //     render: function() {
    //         this.resetPhotos();
    //         var quota = this.options.quota || 1;
    //         this.$('.title > span').text(quota);
    //     }
    // }))({el: $('#view-albums')});
    
})();