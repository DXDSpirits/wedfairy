$(function() {
    var router = new(Backbone.Router.extend({
        routes: {
            "": "chooseScene", // 
            ":scene": "chooseScene", //
        },
        chooseScene: function(scene) {
            var scene = scene || "wedding";
            $('iframe')[0].src += ("prototype_" + scene);
            THEMES.schemaName = scene;
            THEMES.fetch({
                reset: true,
                success: function(collection){
                    totalPage = ((collection.length-1)/9 | 0) + 1;
                    showPagination();
                }

            });
            console.log(scene);
        },
    }));



    var THEMES = new (Backbone.Collection.extend({
        schemaName: null,
        url: function(){
            return Amour.APIRoot + 'sites/schema/' + this.schemaName + "/";
        },
        parse: function(response) {
            return response.data.themes;
        }
    }));
    var curPage = 1;
    var totalPage = 1;

    function showPagination(){
        $('.prev-page-btn, .next-page-btn').show();

        if(curPage == 1){
            $('.prev-page-btn').hide();
        }

        if(curPage >= totalPage){
            $('.next-page-btn').hide();
        }
    }

    function renderThemes(){
        var template = $("#theme-template").html();
        var $themeContainer = $('.theme-container').html('');
        var sliceThemes = THEMES.slice(curPage*9 - 9, curPage*9);

        if($('.container').outerWidth() < 960){
            sliceThemes = THEMES.slice();
        }

        _.each(sliceThemes, function(theme){
            var rendered = Mustache.render(template, theme.attributes);
            $themeContainer.append(rendered);
        })
    }

    THEMES.on('reset', function(){
        renderThemes();
    })

    $(document).on('click', '.prev-page-btn', function(){
        curPage --;
        showPagination();
        renderThemes();
    })

    $(document).on('click', '.next-page-btn', function(){
        curPage ++;
        showPagination();
        renderThemes();

    })


    showPagination();
    Backbone.history.start();
});








