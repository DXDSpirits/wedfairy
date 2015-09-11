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

    // var url = null;
    
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
            },
            failUpload: function(errorTip) {
                this.$el.text(errorTip);
            },
            completeUpload: function() {
                this.render;
            },
            hide: function() {
                this.$el.animate({
                    opacity: 0
                }, 800, function() {
                    $(this).remove();
                })
            },
            deleteImg: function() {
                var self = this;
                self.model.destroy();
            },
            photoShow: function() {
                $('#photo-modal').modal('show');
                var currentUrl = this.model.get('url');
                showPhoto(currentUrl);
                var currentIndex = photoCollection.models.indexOf(this.model);
                var modelsLenght = photoCollection.models.length;
                var fatherHeight = $('#photo-modal').height();
                $('.icon-angle-left').off('click').click(function() {

                    if(currentIndex == 0) {
                        currentIndex = modelsLenght - 1 - currentIndex;
                    }else {
                        currentIndex -= 1
                    };
                    $('.img-showing').addClass('animated bounceOutRight');
                    _.delay(showPhotoLeft, 500, photoCollection.models[currentIndex].get('url'))
                });

                $('.icon-angle-right').off('click').click(function() {

                    if(currentIndex == (modelsLenght - 1)) {
                        currentIndex = 0;
                    }else {
                        currentIndex += 1
                    };
                    $('.img-showing').addClass('animated bounceOutLeft');
                    _.delay(showPhotoRight, 500, photoCollection.models[currentIndex].get('url'))
                });
            },

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

    var showPhoto = function(url) {
        $('.photoShow').html('<div class="img img-showing"></div>');
        var imgContainWidth = $('#photo-modal').width() * 0.9 * 0.9;
        var imgContainHeight = $('#photo-modal').height() * 0.9;
        imgLoad(url, function(w,h){
            if(w < imgContainWidth && h < imgContainHeight) {
                $('.img-showing').addClass('img-auto');
            }else{
                $('.img-showing').addClass('img-contain');
            }
            
        });
        Amour.loadBgImage($('.img-showing'), url)
    };

    var showPhotoLeft = function(url) {
        $('.photoShow').html('<div class="img img-showing animated bounceInLeft"></div>');
        var imgContainWidthLeft = $('#photo-modal').width() * 0.9 * 0.9;
        var imgContainHeightLeft = $('#photo-modal').height() * 0.9;
        imgLoad(url, function(w,h){
            if(w < imgContainWidthLeft && h < imgContainHeightLeft) {
                $('.img-showing').addClass('img-auto');
            }else{
                $('.img-showing').addClass('img-contain');
            }
        });
        Amour.loadBgImage($('.img-showing'), url)
    };
    var showPhotoRight = function(url) {
        // $('#photo-modal').modal('show');

        $('.photoShow').html('<div class="img img-showing animated bounceInRight"></div>');
        var imgContainWidthRight = $('#photo-modal').width() * 0.9 * 0.9;
        var imgContainHeightRight = $('#photo-modal').height() * 0.9;
        console.log(imgContainHeightRight);
        imgLoad(url, function(w,h){
            if(w < imgContainWidthRight && h < imgContainHeightRight) {
                $('.img-showing').addClass('img-auto');
            }else{
                $('.img-showing').addClass('img-contain');
            }
        });
        Amour.loadBgImage($('.img-showing'), url)
    };

    var imgLoad = function(url, callback) {
        var img = new Image();
        img.src = url;
        // 如果图片被缓存，则直接返回缓存数据
        if(img.complete){
            callback(img.width, img.height);
        }else {
            // 完全加载完毕的事件
            img.onload = function(){
                img.onload = null;
                callback(img.width, img.height);
            }
        }
    };
    
    var galleryView = new GalleryView({
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
    
})();