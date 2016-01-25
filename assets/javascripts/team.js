(function() {
    var $wrapper = $(".member-wrapper");
    $wrapper.html(_.shuffle($(".team-member")));
})();
