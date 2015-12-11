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
            console.log(xhr.status);
        }
    });

    Amour.ajax.on('unauthorized', function() {
        unLoginRedirect();
    });

    function unLoginRedirect() {
        // location.href="/";
        $(".wedfairy-dashboard").addClass('hidden');
        $('#loginModal').modal('show');
    }

    Amour.ajax.on('unauthorized forbidden', function() {
        $(".wedfairy-dashboard").addClass('hidden');
        $('#loginModal').modal('show');
    });

    if(token == null) {
        $(".wedfairy-dashboard").addClass('hidden');
        $('#loginModal').modal('show');
    }

    // var APIHOST =  "http://192.168.0.192:3333/api/";
    var APIHOST = 'http://testpayapi.wedfairy.com/api/';

    var storyCtx = $("#storyDataChart").get(0).getContext("2d");
    var userCtx = $("#userDataChart").get(0).getContext("2d");
    var viewChart, storyChart;
    var timeXaxis = [];
    var viewChartStartTime, viewChartEndTime, storyChartStartTime, storyChartEndTime;
    var viewFilterList = [];
    var storyFilterList = [];
    var defaultEndDate, defaultStartDate;
    var sendViewDataStart, sendViewDataEnd, sendStoryDataStart, sendStoryDataEnd;

    var viewChartData = [];
    var storyChartData = [];

    var viewChartX;

    var storyTagSet = {
        // "staffpicks"  : "推荐故事",
        // "hot"       : "热门故事",
        "wedding"   : "婚礼",
        "baby"      : "宝贝",
        "voyage"    : "旅行",
        "lover"     : "爱人",
        "idol"      : "偶像",
        "friendship": "友情",
        "yearbook"  : "新年书",
        "personal"  : "个人",
        "food"      : "美食",
        "family"    : "家人",
        // "boutique"  : "好货",
        "universal" : "通用"
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
        'PV'         : 'PV',
        'UV'         : 'UV',
        'newstories' : '制作量',
        'completed'  : '已完成',
        'shared'     : '已分享',
        'newusers'   : '新用户',
        'wishes'     : '评论'
    };

    var colorsets = ["#1ABC9C", "#F39C12", "#C0392B", "#8E44AD", "#3498DB", "#34495E", "#27AE60", "#BDC3C7", "#E67E22",  "#7F8C8D"];

    function initialize() {
        viewChartX = $("#view-chart-wrapper .radio-wrapper input:checked").val();
        defaultEndDate = GetDateStr(0);
        defaultStartDate = GetDateStr(-7);

        viewChartData = [];
        storyChartData = [];

        viewChartStartTime = storyChartStartTime = defaultStartDate;
        viewChartEndTime = storyChartEndTime = defaultEndDate;

        sendViewDataStart = Date2Unix(viewChartStartTime);
        sendViewDataEnd = Date2Unix(viewChartEndTime);

        sendStoryDataStart = Date2Unix(storyChartStartTime);
        sendStoryDataEnd = Date2Unix(storyChartEndTime);

        // viewFilterList = ['PV', 'UV'];
        viewFilterList = ['newstories', 'completed', 'newusers', 'wishes'];
        storyFilterList = ['newstories', 'completed'];

        $("#view-Chart-Start-Time").val(defaultStartDate);
        $("#story-Chart-Start-Time").val(defaultStartDate);
        $("#view-Chart-End-Time").val(defaultEndDate);
        $("#story-Chart-End-Time").val(defaultEndDate);
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

    //charts show functions
    function showBar(data, myChart) {
        var mylegend;
        var data_copy_bar = $.extend(true, {}, data);

        for (var i = data_copy_bar.datasets.length - 1; i >= 0; i--) {
            data_copy_bar.datasets[i].strokeColor = "transparent";
            data_copy_bar.datasets[i].fillColor = colorsets[i];
            data_copy_bar.datasets[i].pointColor = colorsets[i];
            data_copy_bar.datasets[i].pointStrokeColor = "#fff";
            data_copy_bar.datasets[i].pointHighlightFill = "#fff";
            data_copy_bar.datasets[i].pointHighlightStroke = colorsets[i];
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
            data_copy.datasets[i].fillColor = "transparent";
            data_copy.datasets[i].strokeColor = colorsets[i];
            data_copy.datasets[i].pointColor = colorsets[i];
            data_copy.datasets[i].pointStrokeColor = "#fff";
            data_copy.datasets[i].pointHighlightFill = "#fff";
            data_copy.datasets[i].pointHighlightStroke = colorsets[i];
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
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
    };

    var viewModelSet = {
        "PV": {
            label: "PV",
            urlRoot: APIHOST + "v1/reports/PV.json"
        },
        "UV": {
            label: "UV",
            urlRoot: APIHOST + "v1/reports/UV.json"
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
        }
    };

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
                    var url = APIHOST + 'v1/reports/new_story_by_schema.json?schema=' + k;
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
                    var url = APIHOST + 'v1/reports/new_story_by_schema.json?schema=' + k;
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

    $("#view-chart-wrapper").on('click', 'button.submit', function(e) {
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

    // initialize();

    // renderView(defaultStartDate, defaultEndDate, viewFilterList);

    // renderStory(defaultStartDate, defaultEndDate, storyFilterList);


})();