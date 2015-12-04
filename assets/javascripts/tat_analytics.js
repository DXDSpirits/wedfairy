(function() {
    var APIHOST =  "http://192.168.0.192:3000/api/";

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

    var storyTagSet = {
        "staffpicks"  : "推荐故事",
        "hot"       : "热门故事",
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
        "boutique"  : "好货",
        "universal" : "通用"
    };

    var filterSet = {
        'PV'         : 'PV',
        'UV'         : 'UV',
        'newstories' : '制作量',
        'completed'  : '已完成',
        'shared'     : '已分享',
        'newusers'   : '新用户'
    };

    var colorsets = ["#1ABC9C", "#F39C12", "#C0392B", "#8E44AD", "#3498DB", "#34495E", "#27AE60", "#BDC3C7", "#E67E22",  "#7F8C8D"];

    function initialize() {
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

        viewFilterList = ['PV', 'UV', 'newstories', 'completed', 'shared', 'newusers'];
        storyFilterList = ['PV', 'UV', 'newstories', 'completed', 'shared'];

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

    function HowManyDays(start, end) {
        var aDate, oDate1, oDate2, iDays;
        aDate = start.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]); //转换为12-18-2006格式
        aDate = end.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24 + 1; //把相差的毫秒数转换为天数
        return iDays;
    }

    function Unix2Date(anyUTC) {
        return moment.unix(anyUTC).format("YYYY-MM-DD");
    }

    function Date2Unix(anyDateString) {
        return moment(anyDateString).valueOf() / 1000;
    }

    function enumerateDays(startDate, endDate) {
        var now = moment(startDate), dates = [];
        while (now.format('YYYY-MM-DD') <= moment(endDate).format('YYYY-MM-DD')) {
              dates.push(now.format('YYYY-MM-DD'));
              now.add('days', 1);
        }
        return dates;
    }

    function isInArray(ele, array) {
        for(var i in array) {
            if(ele == array[i]) {
                return true;
            }
        }
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
            // data: {
            //     finish: true
            // }
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
        }
    };


    var renderView = function(start, end, viewFilterList) {
        var initDataView = [];
        var viewLabels = enumerateDays(start, end) || enumerateDays(defaultStartDate, defaultEndDate);
        var timeDuration = HowManyDays(start, end);
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
                    'interval'  : 'day'
                },
                success: function(collection) {
                    for(var i in viewChart.datasets) {
                        for (var j = 0; j < timeDuration; j++) {
                            console.log(viewChart.datasets[i].label);
                            if(viewChart.datasets[i].label == filterSet[collection.attributes.label]) {

                                viewChart.datasets[i].points[j].value = collection.attributes.datasets[0].data[j];
                            }

                        }
                        viewChart.update();
                    }

                }
            })
        }
    };

    var renderStory = function(startDate, endDate, storyFilterList) {
        var initDataStory = [];
        var storyFilterLabels = [];
        var storyChartInitData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for(var i in storyFilterList) {
            storyFilterLabels.push(filterSet[storyFilterList[i]]);
        }

        var dataStory = {
            labels : ["推荐故事", "热门故事", "婚礼", "宝贝", "旅行", "爱人", "偶像", "友情", "新年书", "个人", "美食", "家人", "好货", "通用"],
            datasets : []
        };

        for (var k in storyFilterLabels) {
            dataStory.datasets.push({
                label: storyFilterLabels[k],
                data : storyChartInitData
            });
        }

        showBar(dataStory, "storyChart");

        setTimeout(function() {
            for(var i in storyChart.datasets) {

                for (var j in [1, 1, 1, 1,1 ,1,1,1,1,1,1,1,1,1]) {
                    storyChart.datasets[i].bars[j].value = Math.random() * 100;
                }
                storyChart.update();
            }
        }, 5000);
    };


    $('#view-chart-wrapper .input-daterange input').each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
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

    //
    initialize();

    renderView(defaultStartDate, defaultEndDate, viewFilterList);

    renderStory(defaultStartDate, defaultEndDate, storyFilterList);


})();