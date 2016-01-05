(function() {
    $("#global-footer-float-group").addClass('hidden');
    var token = Amour.TokenAuth.get();
    Amour.ajax.on('unauthorized forbidden', function() {
        $('#mygallery-upload-area').hide();
        $('#loginModal').modal('show');
    });
    if(token === null) {
        $('#mygallery-upload-area').hide();
        $('#loginModal').modal('show');
    }

    // var url = null;

    var musicModel = Amour.Model.extend({
        urlRoot: Amour.APIRoot + 'sites/music/'
    });

    var musicCollection = Amour.Collection.extend({
        model: musicModel,
        url: Amour.APIRoot + 'sites/music/',
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
                'click .music-save': "saveMusic",
                'click div.music-title-text': "editMusic",
            },
            className: 'music-item',
            template: $("#template-music-item").html(),
            initModelView: function() {
                this.stopListening(this.model, 'change');
                this.listenTo(this.model, 'change:title', this.render);
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
                var progressWidth = $(".progress").width($(".music-item").width());
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
                });
            },
            editMusic: function(e) {
                e.preventDefault && e.preventDefault();
                var $musicTitleText = this.$el.find(".music-title .music-title-text");
                var $musicTitleInput = this.$el.find(".music-title input[name='edit-music-title']");
                var currentTitle = $musicTitleText.html();

                $musicTitleText.addClass('hidden');
                $musicTitleInput.removeClass("hidden").val(currentTitle);
            },
            saveMusic: function() {
                var $musicTitleText = this.$el.find(".music-title .music-title-text");
                var $musicTitleInput = this.$el.find(".music-title input[name='edit-music-title']");

                var deleteStatus = this.$el.find("input[name='delete-music']")[0].checked;
                if(!deleteStatus) {
                    var newTitle = this.$el.find(".music-title input[name='edit-music-title']").val();
                    this.model.save({
                        title: newTitle,
                    }, {
                        success: function() {
                            // alert("保存成功！");
                            $musicTitleText.removeClass('hidden');
                            $musicTitleInput.addClass('hidden');
                        }
                    });
                }else {
                    this.deleteMusic();
                }
            },
            deleteMusic: function() {
                var self = this;
                self.model.destroy();
            },
        })
    });

    var uploader;
    var musicCollection = new musicCollection();
    var initUploader = _.once(function() {
        var uploadQueue = {};
        var uploadDomain = 'http://mm.8yinhe.cn/';
        var uptoken_url = '/music/uptoken';

        var uploader = Qiniu.uploader({
            runtimes: 'html5,html4',
            uptoken_url: uptoken_url,
            domain: uploadDomain,
            container: 'view-albums',
            browse_button: 'mymusic-pickfiles',
            multi_selection: true,
            max_file_size: '3mb',
            dragdrop: true,
            drop_element: 'mymusic-upload-area',
            chunk_size: 0,
            multipart: true,
            unique_names: true,
            auto_start: true,
            filters: {
                mime_types : [
                    { title : "Audio files", extensions : "mp3" },
                ]
            },
            init: {
                FilesAdded: function(up, files) {

                },
                BeforeUpload: function(up, file) {
                    var music = new musicModel();
                    uploadQueue[file.id] = music;
                    musicCollection.add(music, {at:0, silent:true});
                    galleryView.addUpload(music);
                    music.trigger('startUpload');
                },
                UploadProgress: function(up, file) {
                    var music = uploadQueue[file.id];
                    music.trigger('progressUpload', file.percent);

                },
                UploadComplete: function() {},
                FileUploaded: function(up, file, info) {
                    var music = uploadQueue[file.id];
                    var url = uploadDomain + JSON.parse(info).key;
                    var title = file.name.split(".mp3")[0];
                    music.save({
                        url: url,
                        title: title,
                    });
                    uploadQueue[file.id] = null;
                    music.trigger('completeUpload');
                },
                Error: function(up, err, errTip) {
                    var music = uploadQueue[err.file.id];
                    if (music) {
                        music.trigger('failUpload', errTip);
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
        collection: musicCollection,
        el: this.$('.music-wrapper')
    });

    musicCollection.fetch({
        reset: true,
        success: function() {
            initUploader();
        }
    });

    var isFetching = false;
    Backbone.on('next-page', function() {
        if (isFetching) return;
        if (musicCollection.next) {
            isFetching = true;
            $(".loading").removeClass("hidden");
            _.delay(function() {
                musicCollection.fetchNext({
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