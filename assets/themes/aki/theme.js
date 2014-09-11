(function() {
    
    var countdown = {};
    countdown.init = function(datetime) {
        var $countdown = $('#view-hero .countdown');
        $countdown.removeClass('hidden');
        var anni = moment(datetime);
        var timer = function() {
            var now = moment(), duration;
            if (anni.isAfter(now)) {
                duration = moment.duration(anni.diff(now));
            } else {
                duration = moment.duration(now.diff(anni));
            }
            $countdown.find('.days').text(parseInt(duration.asDays()));
            $countdown.find('.hours').text(duration.hours());
            $countdown.find('.minutes').text(duration.minutes());
            $countdown.find('.seconds').text(duration.seconds());
            _.delay(timer, 1000);
        }
        _.defer(timer);
    };
    
    function start() {
        var details = App.story.getData('details');
        if (details.datetime) {
            countdown.init(details.datetime)
        }
    }
    
    Amour.on('StorytellAppReady', start);
    
})();
