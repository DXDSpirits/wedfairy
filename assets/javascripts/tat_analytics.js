(function() {

    var user = new Amour.Models.User();
    var token = Amour.TokenAuth.get();

    if(!token) {
        unLoginRedirect();
    }

    user.fetch({
        success: function(model, response, options) {

            if(options.xhr.status == 200) {
                initialize();
                renderView(defaultStartDate, defaultEndDate, viewFilterList);
                renderStory(defaultStartDate, defaultEndDate, storyFilterList);
            }
        },
        error: function(model, xhr, options) {
            // console.log(xhr.status);
        }
    });

    Amour.ajax.on('unauthorized', function() {
        unLoginRedirect();
    });

    function unLoginRedirect() {
        $(".wedfairy-dashboard").addClass('hidden');
        $('#loginModal').modal('show');
    }

    Amour.ajax.on('unauthorized forbidden', function() {
        $(".wedfairy-dashboard").addClass('hidden');
        $('#loginModal').modal('show');
    });

    if(token === null) {
        $(".wedfairy-dashboard").addClass('hidden');
        $('#loginModal').modal('show');
    }

    // var APIHOST =  "http://192.168.0.192:3333/api/";
    var APIHOST = 'http://testpayapi.wedfairy.com/api/';

    var storyCtx = $("#storyDataChart").get(0).getContext("2d");
    var userCtx = $("#userDataChart").get(0).getContext("2d");

    var viewChart, storyChart;
    var timeXaxis = [];
    var viewChartStartTime, viewChartEndTime, storyChartStartTime, storyChartEndTime, topStoryStartTime, topStoryEndTime;
    var viewFilterList = [];
    var storyFilterList = [];
    var defaultEndDate, defaultStartDate;
    var sendViewDataStart, sendViewDataEnd, sendStoryDataStart, sendStoryDataEnd, sendTopStoryDataStart, sendTopStoryDataEnd;
    var eventsDate;
    var viewChartData = [];
    var storyChartData = [];

    var viewChartX;

    var storyTagSet = {
        "staffpicks"  : "推荐故事",
        "hot"       : "热门故事",
        "wedding"   : "婚礼",
        "baby"      : "宝贝",
        "voyage"    : "旅行",
        "lover"     : "爱人",
        "idol"      : "偶像",
        "friendship": "友情",
        // "yearbook"  : "新年书",
        "personal"  : "个人",
        "food"      : "美食",
        "family"    : "家人",
        "boutique"  : "好货",
        // "universal" : "通用"
        "commerce"  : "电商",
        "dating"    : "征婚",
        "anniversary" : "周年",
        "misc"      : "其他"
    };

    var storyTagSetIndex = {};

    function setStoryTag() {
        var count = 0;
        for(var key in storyTagSet) {
            storyTagSetIndex[key] = count;
            count++;
        }
    }
    setStoryTag();

    var filterSet = {

        'PV_all'                : 'PV_all',
        'PV_apps'               : 'PV_apps',
        'PV_blog'               : 'PV_blog',
        'PV_compose'            : 'PV_compose',
        'PV_www'                : 'PV_www',
        'PV_story'              : 'PV_story',
        'UV_all'                : 'UV_all',
        'UV_apps'               : 'UV_apps',
        'UV_blog'               : 'UV_blog',
        'UV_compose'            : 'UV_compose',
        'UV_www'                : 'UV_www',
        'UV_story'              : 'UV_story',
        'Sessions_all'          : 'Sessions_all',
        'Sessions_apps'         : 'Sessions_apps',
        'Sessions_blog'         : 'Sessions_blog',
        'Sessions_compose'      : 'Sessions_compose',
        'Sessions_www'          : 'Sessions_www',
        'Sessions_story'        : 'Sessions_story',
        'Users_all'             : 'Users_all',
        'Users_apps'            : 'Users_apps',
        'Users_blog'            : 'Users_blog',
        'Users_compose'         : 'Users_compose',
        'Users_www'             : 'Users_www',
        'Users_story'           : 'Users_story',
        'newstories'            : '制作量',
        'completed'             : '已完成',
        'shared'                : '已分享',
        'newusers'              : '新用户',
        'wishes'                : '评论',
        "likes"                 : '点赞'
    };

    var colorsets = [
        "#1ABC9C", "#F39C12", "#C0392B", "#8E44AD", "#3498DB", "#34495E",
        "#27AE60", "#BDC3C7", "#E67E22", "#7F8C8D", "#4C12C1", "#80A1FB",
        "#EFC563", "#8DC460", "#8567CD", "#63AC00", "#12072F", "#8FA81",
        "#EF62C1", "#6C0EA1", "#CABE1E", "#D26C80", "#18829B", "#FCEB96"
    ];

    function combineLists(list1, list2) {
        // var length = _.min(_.size(list1), _.size(list2));
        var length = _.size(list1);
        var result = [];
        for (var i = 0; i < length; i++) {
            result.push(list1[i] + list2[0]);
        }
        return result;
    }

    function colorRandom() {
        return '#'+('000000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
    }

    function initialize() {
        viewChartX = $("#view-chart-wrapper .radio-wrapper input:checked").val();
        defaultEndDate = GetDateStr(0);
        defaultStartDate = GetDateStr(-7);

        viewChartData = [];
        storyChartData = [];

        viewChartStartTime = storyChartStartTime = topStoryStartTime = defaultStartDate;
        viewChartEndTime = storyChartEndTime = topStoryEndTime = defaultEndDate;

        sendViewDataStart = Date2Unix(viewChartStartTime);
        sendViewDataEnd = Date2Unix(viewChartEndTime);

        sendStoryDataStart = Date2Unix(storyChartStartTime);
        sendStoryDataEnd = Date2Unix(storyChartEndTime);

        sendTopStoryDataEnd = Date2Unix(topStoryEndTime);
        sendTopStoryDataStart = Date2Unix(topStoryStartTime);

        // viewFilterList = ['PV', 'UV'];
        viewFilterList = ['PV_all', 'UV_all', 'Sessions_all', 'Users_all', 'newstories', 'completed', 'newusers', 'wishes', 'likes'];
        storyFilterList = ['newstories', 'completed'];

        $("#view-Chart-Start-Time").val(defaultStartDate);
        $("#story-Chart-Start-Time").val(defaultStartDate);
        $('#top-story-table-Start-Time').val(defaultStartDate);
        $("#view-Chart-End-Time").val(defaultEndDate);
        $("#story-Chart-End-Time").val(defaultEndDate);
        $('#top-story-table-End-Time').val(defaultEndDate);

        showTopTable();
    }

    //dates functions
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        return y+"-"+m+"-"+d;
    }

    function Unix2Date(anyUTC) {
        return moment.unix(anyUTC).format("YYYY-MM-DD");
    }

    function Date2Unix(anyDateString) {
        return moment(anyDateString).valueOf() / 1000;
    }

    function HowManyDays(start, end) {
        var duration = moment.duration(moment(end).diff(moment(start)));
        return duration.asDays();
    }

    function HowManyWeeks(start, end) {
        var duration_days = HowManyDays(start, end);
        var weekday_start = moment(start).isoWeekday();
        var weekday_end = moment(end).isoWeekday();
        var weeks = (duration_days - (7 - weekday_start + 1) - (weekday_end - 1 + 1) + 1) / 7 + 2;
        return weeks;
    }

    function HowManyMonths(start, end) {
        var startDateArray = start.split('-');
        var endDateArray = end.split('-');
        var endMonth = moment(endDateArray[0] + '-' + endDateArray[1], "YYYY-MM");
        var startMonth = moment(startDateArray[0] + '-' + startDateArray[1], "YYYY-MM");
        var duration = Math.floor(moment.duration(endMonth.diff(startMonth)).asMonths()) + 1;
        return duration;
    }

    function HowManyYears(start, end) {
        return Math.ceil(moment.duration(moment(end).diff(moment(start))).asYears());
    }

    function enumerateDays(startDate, endDate) {
        var eventsFetchResult;
        eventsModel.fetch({
            data: {
                'from_date' : Date2Unix(startDate),
                'to_date'   : Date2Unix(endDate),
            },
            success: function(model) {
                eventsFetchResult = model.toJSON();
            }
        });
        var now = moment(startDate), dates = [];
        while (now.format('YYYY-MM-DD') < moment(endDate).format('YYYY-MM-DD')) {
              dates.push(now.format('YYYY-MM-DD'));
              now.add('days', 1);
        }
        return dates;
    }

    function enumerateWeeks(start, end) {
        var labels = [];
        var weeks_count = HowManyWeeks(start, end);
        var weekday_start = moment(start).isoWeekday();
        for (var i = 1; i <= weeks_count; i++) {
            if(i==1) {
                labels.push(start);
            }else if(i==weeks_count) {
                labels.push(end);
            }else {
                labels.push(moment(start).add(7 - weekday_start + 1, 'days').add(i-2, 'weeks').format('YYYY-MM-DD'));
            }
        }
        return labels;
    }

    function enumerateMonths(start, end) {
        var labels = [];
        var months_count = HowManyMonths(start, end);
        var startDateArray = start.split('-');

        var startMonth = moment(startDateArray[0] + '-' + startDateArray[1], "YYYY-MM");
        for (var i = 0; i < months_count; i++) {
            labels.push(moment(startMonth).add(i, 'months').format("YYYY-MM"));
        }
        return labels;
    }

    function enumerateYears(start, end) {
        var labels = [];
        var start_year = moment(start).get('year');
        var end_year = moment(end).get('year');
        var duration = end_year - start_year + 1;
        for (var i = 0; i < duration; i++) {
            labels.push(start_year + i);
        }
        return labels;
    }

    function isInArray(ele, array) {
        for(var i in array) {
            if(ele == array[i]) {
                return true;
            }
        }
    }

    function sumArray(anyArray) {
        var result = 0;
        for (var i = 0; i < anyArray.length; i++) {
            result += anyArray[i];
        }
        return result;
    }

    var dataTopLike, dataTopWish;
    var storyTopLikeModel = new (Backbone.Model.extend({
        urlRoot: APIHOST + "v1/reports/top_stories.json?sort_by=like"
    }))();

    var storyTopWishModel = new (Backbone.Model.extend({
        urlRoot: APIHOST + "v1/reports/top_stories.json?sort_by=wish"
    }))();

    var storyTopPVModel = new (Backbone.Model.extend({
        urlRoot: APIHOST + "v1/reports/top_stories.json?sort_by=pageviews"
    }))();

    function showTopTable() {
        storyTopLikeModel.fetch({
            data: {
                'from_date' : sendTopStoryDataStart,
                'to_date'   : sendTopStoryDataEnd,
                'interval'  : 'day'
            },
            success: function(collection) {
                var fetchResult = collection.toJSON();
                var $tableLike = $('#top-story-table-wrapper .top-likes tbody');
                $tableLike.html('');
                _.each(fetchResult, function(val, k) {
                    var nameLink = '<a href="http://story.wedfairy.com/story/' + val.name + '" target="_blank">' + val.name+ '</a>';
                    $tableLike.append('<tr><td class="table-story-title">' + val.title + '</td><td>' + nameLink + '</td><td>' + val.count + '</td></tr>');
                });
            }
        });
        storyTopWishModel.fetch({
            data: {
                'from_date' : sendTopStoryDataStart,
                'to_date'   : sendTopStoryDataEnd,
                'interval'  : 'day'
            },
            success: function(collection) {
                var fetchResult = collection.toJSON();
                var $tableWish = $('#top-story-table-wrapper .top-wishes tbody');
                $tableWish.html('');
                _.each(fetchResult, function(val, k) {
                    var nameLink = '<a href="http://story.wedfairy.com/story/' + val.name + '" target="_blank">' + val.name+ '</a>';
                    $tableWish.append('<tr><td class="table-story-title">' + val.title + '</td><td>' + nameLink + '</td><td>' + val.count + '</td></tr>');
                });
            }
        });
        storyTopPVModel.fetch({
            data: {
                'from_date' : sendTopStoryDataStart,
                'to_date'   : sendTopStoryDataEnd,
                'interval'  : 'day'
            },
            success: function(collection) {
                var fetchResult = collection.toJSON();
                var $tablePV = $('#top-story-table-wrapper .top-pageviews tbody');
                $tablePV.html('');
                _.each(fetchResult, function(val, k) {
                    var nameLink = '<a href="http://story.wedfairy.com/story/' + val.name + '" target="_blank">' + val.name+ '</a>';
                    $tablePV.append('<tr><td class="table-story-title">' + val.title + '</td><td>' + nameLink + '</td><td>' + val.count + '</td></tr>');
                });
            }
        });
    }

    //charts show functions
    function showBar(data, myChart) {
        var mylegend;
        var data_copy_bar = $.extend(true, {}, data);

        for (var i = data_copy_bar.datasets.length - 1; i >= 0; i--) {
            var currentColor = randomColor({luminosity: 'light'});
            data_copy_bar.datasets[i].strokeColor = "transparent";
            data_copy_bar.datasets[i].fillColor = currentColor;
            data_copy_bar.datasets[i].pointColor = currentColor;
            data_copy_bar.datasets[i].pointStrokeColor = "#fff";
            data_copy_bar.datasets[i].pointHighlightFill = "#fff";
            data_copy_bar.datasets[i].pointHighlightStroke = currentColor;
        }

        if(myChart == "timeChart") {
            viewChart = new Chart(storyCtx).Bar(data_copy_bar,options);
            mylegend = viewChart.generateLegend();
            $("#chart-time-data .show-legend").html(mylegend);
        }else if(myChart == "storyChart") {
            storyChart = new Chart(userCtx).Bar(data_copy_bar,options);
            mylegend = storyChart.generateLegend();
            $("#chart-story-data .show-legend").html(mylegend);
        }
    }

    function showLine(data, myChart) {
        var mylegend;
        var data_copy = $.extend(true, {}, data);

        for (var i = data_copy.datasets.length - 1; i >= 0; i--) {
            var currentColor = randomColor({luminosity: 'dark'});
            data_copy.datasets[i].fillColor = "transparent";
            data_copy.datasets[i].strokeColor = currentColor;
            data_copy.datasets[i].pointColor = currentColor;
            data_copy.datasets[i].pointStrokeColor = "#fff";
            data_copy.datasets[i].pointHighlightFill = "#fff";
            data_copy.datasets[i].pointHighlightStroke = currentColor;
        }

        if(myChart == "timeChart") {
            viewChart = new Chart(storyCtx).Line(data_copy,options);
            mylegend = viewChart.generateLegend();
            $("#chart-time-data .show-legend").html(mylegend);
        }else if(myChart == "storyChart") {
            storyChart = new Chart(userCtx).Line(data_copy,options);
            mylegend = storyChart.generateLegend();
            $("#chart-story-data .show-legend").html(mylegend);
        }
    }


    Chart.defaults.global.responsive = true;

    var options = {
        barShowStroke: false,
        animation: false,
        // scaleBeginAtZero: false,
        // showScale: false,
        // animationSteps : 1,
        // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= datasetLabel %> - <%= value %>",
        multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
    };

    var viewModelSet = {
        "PV_all": {
            label: "PV_all",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=wedfairy.com&type=pageviews"
        },
        "PV_apps": {
            label: "PV_apps",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=apps.wedfairy.com&type=pageviews"
        },
        "PV_blog": {
            label: "PV_blog",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=blog.wedfairy.com&type=pageviews"
        },
        "PV_compose": {
            label: "PV_compose",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=compose.wedfairy.com&type=pageviews"
        },
        "PV_www": {
            label: "PV_www",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=www.wedfairy.com&type=pageviews"
        },
        "PV_story": {
            label: "PV_story",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=story.wedfairy.com&type=pageviews"
        },
        "UV_all": {
            label: "UV_all",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=wedfairy.com&type=uniquePageviews"
        },
        "UV_apps": {
            label: "UV_apps",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=apps.wedfairy.com&type=uniquePageviews"
        },
        "UV_blog": {
            label: "UV_blog",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=blog.wedfairy.com&type=uniquePageviews"
        },
        "UV_compose": {
            label: "UV_compose",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=compose.wedfairy.com&type=uniquePageviews"
        },
        "UV_www": {
            label: "UV_www",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=www.wedfairy.com&type=uniquePageviews"
        },
        "UV_story": {
            label: "UV_story",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=story.wedfairy.com&type=uniquePageviews"
        },
        "Sessions_all": {
            label: "Sessions_all",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=wedfairy.com&type=sessions"
        },
        "Sessions_apps": {
            label: "Sessions_apps",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=apps.wedfairy.com&type=sessions"
        },
        "Sessions_blog": {
            label: "Sessions_blog",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=blog.wedfairy.com&type=sessions"
        },
        "Sessions_compose": {
            label: "Sessions_compose",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=compose.wedfairy.com&type=sessions"
        },
        "Sessions_www": {
            label: "Sessions_www",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=www.wedfairy.com&type=sessions"
        },
        "Sessions_story": {
            label: "Sessions_story",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=story.wedfairy.com&type=sessions"
        },
        "Users_all": {
            label: "Users_all",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=wedfairy.com&type=users"
        },
        "Users_apps": {
            label: "Users_apps",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=apps.wedfairy.com&type=users"
        },
        "Users_blog": {
            label: "Users_blog",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=blog.wedfairy.com&type=users"
        },
        "Users_compose": {
            label: "Users_compose",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=compose.wedfairy.com&type=users"
        },
        "Users_www": {
            label: "Users_www",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=www.wedfairy.com&type=users"
        },
        "Users_story": {
            label: "Users_story",
            urlRoot: APIHOST + "v1/reports/views_count.json?site=story.wedfairy.com&type=users"
        },
        "completed": {
            label: "completed",
            urlRoot: APIHOST + "v1/reports/new_story.json?finished=true"
        },
        "shared": {
            label: "shared",
            urlRoot: APIHOST + "v1/reports/shared.json"
        },
        "newstories": {
            label: "newstories",
            urlRoot: APIHOST + "v1/reports/new_story.json"
        },
        "newusers": {
            label: "newusers",
            urlRoot: APIHOST + "v1/reports/new_user.json"
        },
        "wishes": {
            label: "wishes",
            urlRoot: APIHOST + "v1/reports/new_comment.json"
        },
        "likes": {
            label: "likes",
            urlRoot: APIHOST + "v1/reports/new_like.json"
        }
    };
    var EventsModel = Backbone.Model.extend({
        urlRoot: APIHOST + "v1/reports/site_events.json?interval=day",
    });
    var eventsModel = new EventsModel();

    var renderView = function(start, end, viewFilterList) {
        var initDataView = [];
        var viewLabels, timeDuration, interval;
        if(viewChartX == 'byDay') {
            interval = 'day';
            viewLabels = enumerateDays(start, end) || enumerateDays(defaultStartDate, defaultEndDate);
            timeDuration = HowManyDays(start, end);
        }else if(viewChartX == "byWeek") {
            interval = 'week';
            viewLabels = enumerateWeeks(start, end) || enumerateWeeks(defaultStartDate, defaultEndDate);
            timeDuration = HowManyWeeks(start, end);
        }else if(viewChartX == "byMonth") {
            interval = 'month';
            viewLabels = enumerateMonths(start, end) || enumerateMonths(defaultStartDate, defaultEndDate);
            timeDuration = HowManyMonths(start, end);
        }else if(viewChartX == "byYear") {
            interval = 'year';
            viewLabels = enumerateYears(start, end) || enumerateYears(defaultStartDate, defaultEndDate);
            timeDuration = HowManyYears(start, end);
        }
        var viewDataSets = [];

        var dataView = {
            labels : viewLabels,
            datasets : []
        };

        for (var i = 0; i <= timeDuration - 1; i++) {
            initDataView.push(0);
        }

        for(var i in viewFilterList) {
            dataView.datasets.push({
                label: filterSet[viewFilterList[i]],
                data : initDataView
            });
        }
        //init chart
        showLine(dataView, "timeChart");

        //get data
        _.each(viewModelSet, function(val, k) {
            val.model = new (Backbone.Model.extend({
                urlRoot: val.urlRoot
            }))({
                label: val.label
            });
        });

        for(var i in viewFilterList) {
            var filterName = viewFilterList[i];

            viewModelSet[filterName].model.fetch({
                data: {
                    'from_date' : sendViewDataStart,
                    'to_date'   : sendViewDataEnd,
                    'interval'  : interval
                },
                success: function(collection) {
                    for(var i in viewChart.datasets) {
                        for (var j = 0; j < timeDuration; j++) {
                            if(viewChart.datasets[i].label == filterSet[collection.attributes.label]) {
                                viewChart.datasets[i].points[j].value = collection.attributes.datasets[0].data[j];
                            }
                        }
                        viewChart.update();
                    }
                }
            });
        }
    };

    var renderStory = function(startDate, endDate, storyFilterList) {
        var initDataStory = [];
        var storyFilterLabels = [];
        var storyChartInitData = [];

        for(var i in storyFilterList) {
            storyFilterLabels.push(filterSet[storyFilterList[i]]);
        }

        var dataStory = {
            labels: [],
            datasets : []
        };

        for(var j in storyTagSet) {
            storyChartInitData.push(0);
            dataStory.labels.push(storyTagSet[j]);
        }

        for (var k in storyFilterLabels) {
            dataStory.datasets.push({
                label: storyFilterLabels[k],
                data : storyChartInitData
            });
        }

        showBar(dataStory, "storyChart");


        var NewStoryResultModel = Backbone.Model.extend({
            defaults: {
                length: 0,
                result: {},
                models: {}
            },
            initialize: function() {
                var self = this;
                var currentDatasetIndex;
                for(var i in storyChart.datasets) {
                    if(storyChart.datasets[i].label == '制作量') {
                        currentDatasetIndex = i;
                    }
                }
                _.each(storyTagSet, function(val, k) {
                    self.defaults.length++;
                    self.defaults.result[k] = 0;
                    var url = APIHOST + 'v1/reports/new_story_by_schema.json?tag=' + k;
                    var model = new (Backbone.Model.extend({
                        urlRoot: url
                    }))({
                        label: k,
                        url: url
                    });
                    model.on('change', function() {
                        var label = this.label;
                        var dataset = _.findWhere(storyChart.datasets, {
                            label: label
                        });
                        self.defaults.result[k] = sumArray(this.toJSON().datasets[0].data);
                        storyChart.datasets[currentDatasetIndex].bars[storyTagSetIndex[label]].value = sumArray(this.toJSON().datasets[0].data);
                        storyChart.update();
                    }, model);

                    model.label = k;

                    self.defaults.models[k] = {
                        label: k,
                        model: model
                    };
                });
            }
        });

        var CompletedResultModel = Backbone.Model.extend({
            defaults: {
                length: 0,
                result: {},
                models: {}
            },
            initialize: function() {
                var self = this;
                var currentDatasetIndex;
                for(var i in storyChart.datasets) {
                    if(storyChart.datasets[i].label == '已完成') {
                        currentDatasetIndex = i;
                    }
                }
                _.each(storyTagSet, function(val, k) {
                    self.defaults.length++;
                    self.defaults.result[k] = 0;
                    var url = APIHOST + 'v1/reports/new_story_by_schema.json?tag=' + k;
                    var model = new (Backbone.Model.extend({
                        urlRoot: url
                    }))({
                        label: k,
                        url: url
                    });
                    model.on('change', function() {
                        var label = this.label;
                        var dataset = _.findWhere(storyChart.datasets, {
                            label: label
                        });
                        self.defaults.result[k] = sumArray(this.toJSON().datasets[0].data);
                        storyChart.datasets[currentDatasetIndex].bars[storyTagSetIndex[label]].value = sumArray(this.toJSON().datasets[0].data);
                        storyChart.update();
                    }, model);

                    model.label = k;

                    self.defaults.models[k] = {
                        label: k,
                        model: model
                    };
                });
            }
        });

        var NewStoryResult = new NewStoryResultModel;
        var CompletedResult = new CompletedResultModel;

        for (var i in storyChart.datasets) {
            var currentLabel = storyChart.datasets[i].label;
            if(storyChart.datasets[i].label == filterSet["newstories"]) {
                    for(var index in storyTagSetIndex) {
                        NewStoryResult.defaults.models[index].model.fetch({
                            data: {
                                'from_date' : sendStoryDataStart,
                                'to_date'   : sendStoryDataEnd,
                                'interval'  : 'day'
                            }
                        });
                    }
            }else if(storyChart.datasets[i].label == filterSet["completed"]) {
                for(var index in storyTagSetIndex) {
                    CompletedResult.defaults.models[index].model.fetch({
                        data: {
                            'from_date' : sendStoryDataStart,
                            'to_date'   : sendStoryDataEnd,
                            'interval'  : 'day',
                            'finished'  : true
                        }
                    });
                }
            }
        }
    };

    //datepickers
    $('#view-chart-wrapper .input-daterange input').each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
            // startDate: "-191d",
            endDate: "0d",
            todayBtn: 'linked',
            autoclose: true,
            pointDotRadius: 1,
            datasetStrokeWidth : 1,
        });
        $(this).on("changeDate", function() {
            viewChartStartTime = $("#view-Chart-Start-Time").val() || defaultStartDate;
            viewChartEndTime = $("#view-Chart-End-Time").val() || defaultEndDate;
        });
    });

    $('#story-chart-wrapper .input-daterange input').each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
            endDate: "0d",
            todayBtn: 'linked',
            autoclose: true
        });
        $(this).on("changeDate", function() {
            storyChartStartTime = $("#story-Chart-Start-Time").val() || defaultStartDate;
            storyChartEndTime = $("#story-Chart-End-Time").val() || defaultEndDate;
        });

    });

    $('#top-story-table-wrapper .input-daterange input').each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
            endDate: "0d",
            todayBtn: 'linked',
            autoclose: true
        });
        $(this).on("changeDate", function() {
            topStoryStartTime = $("#top-story-table-Start-Time").val() || defaultStartDate;
            topStoryEndTime = $("#top-story-table-End-Time").val() || defaultEndDate;
        });
    });

    // add date Event
    var EventModel = Backbone.Model.extend({
        urlRoot: APIHOST + "v1/reports/site_event.json?interval=day",
    });
    $("input#datepicker-events").each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
            endDate: "0d",
            todayBtn: 'linked',
            autoclose: true
        });

        $(this).on("changeDate", function(e) {
            var eventFetchResult;
            var currentDate = Date2Unix($(this).val());
            var eventModel = new EventModel();
            eventsDate = currentDate;
            eventModel.fetch({
                data: {
                    'time': currentDate,
                },
                reset: true,
                success: function(model) {
                    eventFetchResult = model.toJSON().name || '';
                    $("#chart-events #event-name").val(eventFetchResult);
                }
            });
        });
    });

    //submit behviors
    $("#chart-events").on("click", "button.btn-success", function() {
        var eventModel = new EventModel();
        var eventName = $("#event-name").val();
        if(eventName) {
            eventModel.save({
                    time: eventsDate,
                    name: eventName
                },
                {
                    success: function() {
                        alert('Success');
                    }
                }
            );
        }else {
            alert("请输入事件...");
        }
    });

    $("#view-chart-wrapper").on('click', 'button.submit', function() {
        viewChartX = $("#view-chart-wrapper .radio-wrapper input:checked").val();
        var obj = document.getElementsByName("view-checkbox");
        viewFilterList = [];
        for(var k in obj){
            if(obj[k].checked)
                viewFilterList.push(obj[k].value);
        }
        sendViewDataStart = Date2Unix(viewChartStartTime);
        sendViewDataEnd = Date2Unix(viewChartEndTime);

        viewChart.destroy();
        renderView(viewChartStartTime, viewChartEndTime, viewFilterList);
    });

    $("#story-chart-wrapper").on('click', 'button.submit', function() {
        var obj = document.getElementsByName("story-checkbox");
        storyFilterList = [];
        for(var k in obj){
            if(obj[k].checked)
                storyFilterList.push(obj[k].value);
        }
        sendStoryDataStart = Date2Unix(storyChartStartTime);
        sendStoryDataEnd = Date2Unix(storyChartEndTime);

        storyChart.destroy();
        renderStory(storyChartStartTime, storyChartEndTime, storyFilterList);
    });

    $("#top-story-table-wrapper").on('click', 'button.submit', function() {
        var obj = document.getElementsByName("story-checkbox");
        storyFilterList = [];
        for(var k in obj){
            if(obj[k].checked)
                storyFilterList.push(obj[k].value);
        }
        sendTopStoryDataStart = Date2Unix(topStoryStartTime);
        sendTopStoryDataEnd = Date2Unix(topStoryEndTime);
        showTopTable();
    });
})();