$(document).ready(function(){
    $(".sidebar").affix({
        offset: {
            top: 140,
            bottom: $(".footer").outerHeight(true) + 50
     	}
    });

});