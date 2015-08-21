/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */


$(function() {

    var MusicModel = Amour.Model.extend({
        urlRoot: Amour.APIRoot + "staff/music/"
    });

    var uploader = Qiniu.uploader({
        runtimes: 'html5',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        multi_selection: false,
        max_file_size: '3mb',
        flash_swf_url: 'js/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: 0,
        uptoken_url: "/music/uptoken",
        domain: "http://mm.8yinhe.cn/",
        unique_names: true,
        // downtoken_url: '/downtoken',
        // unique_names: true,
        // save_key: true,
        // x_vars: {
        //     'id': '1234',
        //     'time': function(up, file) {
        //         var time = (new Date()).getTime();
        //         // do something with 'time'
        //         return time;
        //     },
        // },
        auto_start: true,
        // var musicItems = [];
        init: {
            'FilesAdded': function(up, files) {
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                // var filesize = file.size
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
                // if file.size > 
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));

                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var return_url = progress.setComplete(up, info);
                var music = new MusicModel();
                // console.log(file.name);
                // console.log("歌曲地址是: " + return_url);
                console.log(music);
                music.save({
                    title: file.name,
                    url: return_url
                }, {
                    success:function() {
                        location.href = "http://api.wedfairy.com/admin/sites/music/" + music.id;
                    }
                });

            },
            'Error': function(up, err, errTip) {
                    $('table').show();
                    var progress = new FileProgress(err.file, 'fsUploadProgress');
                    progress.setError();
                    progress.setStatus(errTip);
                }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    });

    uploader.bind('FileUploaded', function() {
        console.log('hello man,a file is uploaded');
    });

    var user = new Amour.Models.User();
    var token = Amour.TokenAuth.get();
    if (token === null) {
        $('#loginModal').modal('show');
    };
    Amour.ajax.on('unauthorized', function() {
        $('#loginModal').modal('show');
    });
    
    $('#loginButton').on('click', function(e) {
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

    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });



    $('body').on('click', 'table button.btn', function() {
        $(this).parents('tr').next().toggle();
    });


});