(function() {

    var storyCtx = $("#storyDataChart").get(0).getContext("2d");
    var userCtx = $("#userDataChart").get(0).getContext("2d");
    var timeChart, storyChart;
    var timeXaxis = [];
    var viewChartStartTime, viewChartEndTime, storyChartStartTime, storyChartEndTime;
    var viewFilterList = [];
    var storyFilterList = [];

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

    // $("#view-chart-wrapper .view-data-checkbox-wrapper").click(function() {
    //     console.log(222);
    //     $("input").each(function() {
    //         if($(this).attr("checked")=='true') {
    //             console.log(2);
    //         }
    //     });
    // });
    function Unix2Date(anyUTC) {
        return moment.unix(anyUTC).format("YYYY-MM-DD");
    }
    function Date2Unix(anyDateString) {
        return moment(anyDateString).valueOf() / 1000;
    }

    // console.log(Date2Unix('2015-12-3'));
    // console.log(Unix2Date(Date2Unix("2015-12-3")));

    var defaultEndDate = GetDateStr(0);
    var defaultStartDate = GetDateStr(-7);
    // console.log(typeof(endDate));

    viewChartStartTime = storyChartStartTime = defaultStartDate;
    viewChartEndTime = storyChartEndTime = defaultEndDate;

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

    var colorsets = ["#1ABC9C", "#F39C12", "#C0392B", "#8E44AD", "#3498DB", "#27AE60", "#34495E", "#BDC3C7", "#E67E22",  "#7F8C8D"];

    // Chart.defaults.global.responsive = true;
    var options = {
        barShowStroke: false,
        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>kb",
    };

    var timeDataSet = {
        "PV": {
            label: "PV",
            urlRoot: 'xxx/pv'
        },
        "UV": {
            label: "UV",
            urlRoot: "xxx/uv/"
        },
        "completed": {
            label: "completed",
            urlRoot: "xxx/completed/"
        },
        "shared": {
            label: "shared",
            urlRoot: "xxx/shared/"
        },
        "newstoried": {
            label: "newstories",
            urlRoot: "xxx/newstories/"
        }
    };


    _.each(timeDataSet, function(val, k) {
        val.model = new (Backbone.Model.extend({
            urlRoot: val.urlRoot
        }))({
            label: val.label,
            data: [0,0,0,0,0,0,0,0,0,0,0]
        });
    });




    var dataStory = {
        labels : ["推荐故事", "热门故事", "婚礼", "宝贝", "旅行", "爱人", "偶像", "友情", "新年书", "个人", "美食", "家人", "好货", "通用"],
        datasets : [
            {
                label: "PV",
                data : [650, 1001, 300]
            },
            {
                label: "UV",
                data : [280, 583, 67]
            },
            {
                label: "制作量",
                data : [90, 562, 203]
            },
            {
                label: "已完成",
                data: [192, 61, 25]
            },
            {
                label: "已分享",
                data: [382, 172, 21]
            }
        ]
    };

    var renderView = function(start, end, viewFilterList) {
        var initDataView = [];
        // var viewLabels = enumerateDays(start, end) || enumerateDays(defaultStartDate, defaultEndDate);

        var dataView = {
            // labels : viewLabels,
            labels : ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
            datasets : [
                {
                    label: "UV",
                    data : [650,590,90,81,56,55,40]
                },
                {
                    label: "PV",
                    data : [280,480,40,19,96,27,100]
                },
                {
                    label: "newStories",
                    data : [100,37,70,51,119,197,90]
                },
                {
                    label: "newShared",
                    data : [8,18,40,59,69,57,70]
                },
                {
                    label: "newCompleted",
                    data : [100,88,120,129,159,97,101]
                }
            ]
        };
        for (var i = 0; i <= HowManyDays(start, end) - 1; i++) {
            initDataView.push(0);
        }

        for (var k in storyTagSet) {
            initDataStory.push(0);
        }
        // console.log(initDataView);
        // showLine(dataTime, "timeChart");
        // showBar(dataStory, "storyChart");

    };

    var renderStory = function(startDate, endDate, storyFilterList) {
        var initDataStory = [];

        for (var i = 0; i <= HowManyDays(startDate, endDate) - 1; i++) {
            initDataView.push(0);
        }

        for (var k in storyTagSet) {
            initDataStory.push(0);
        }
        console.log(initDataView);
        // showLine(dataTime, "timeChart");
        // showBar(dataStory, "storyChart");

    };

    // renderView(viewChartStartTime, viewChartEndTime);


    var showBar = function(data, myChart) {
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
            timeChart = new Chart(storyCtx).Bar(data_copy_bar,options);
            mylegend = timeChart.generateLegend();
            $("#chart-time-data .show-legend").html(mylegend);
        }else if(myChart == "storyChart") {
            storyChart = new Chart(userCtx).Bar(data_copy_bar,options);
            mylegend = storyChart.generateLegend();
            $("#chart-story-data .show-legend").html(mylegend);
        }
    };

    var showLine = function(data, myChart) {
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
            timeChart = new Chart(storyCtx).Line(data_copy,options);
            mylegend = timeChart.generateLegend();
            $("#chart-time-data .show-legend").html(mylegend);
        }else if(myChart == "storyChart") {
            storyChart = new Chart(userCtx).Line(data_copy,options);
            mylegend = storyChart.generateLegend();
            $("#chart-story-data .show-legend").html(mylegend);
        }
    };
    // var enumerateDaysBetweenDates = function(startDate, endDate) {
    //     // var dates = [];
    //     timeXaxis = [];


    //     var currDate = moment(startDate).clone().startOf('day');
    //     var lastDate = moment(endDate).clone().startOf('day');

    //     while(currDate.add('days', 1).diff(lastDate) <= 0) {
    //         // console.log(currDate.format("YYYY-MM-DD"));
    //         timeXaxis.push(currDate.format("YYYY-MM-DD"));
    //     }
    //     // return dates;
    //     console.log(timeXaxis);
    // };

    var enumerateDays = function(startDate, endDate) {
        var now = moment(startDate), dates = [];
        var dates = [];
        while (now.format('YYYY-MM-DD') <= moment(endDate).format('YYYY-MM-DD')) {
              dates.push(now.format('YYYY-MM-DD'));
              now.add('days', 1);
        }
        return dates;
        // console.log(timeXaxis);
    };


    // $(".wedfairy-charts").on("click", ".types-dropdown a.select-Bar", function() {
    //     var $parent = $(this.closest('.wedfairy-charts'));
    //     if($parent.attr("id") === "chart-time-data") {
    //         timeChart.destroy();
    //         showBar(data, 'timeChart');
    //     }else{
    //         storyChart.destroy();
    //         showBar(data, 'storyChart');
    //     }
    // });

    // $(".wedfairy-charts").on("click", ".types-dropdown a.select-Line", function() {
    //     var $parent = $(this.closest('.wedfairy-charts'));
    //     if($parent.attr("id") === "chart-time-data") {
    //         timeChart.destroy();
    //         showLine(data, 'timeChart');
    //     }else{
    //         storyChart.destroy();
    //         showLine(data, 'storyChart');
    //     }
    // });

    $('#view-chart-wrapper .input-daterange input').each(function() {
        $(this).datepicker({
            language: "cn",
            format: 'yyyy-mm-dd',
            endDate: "0d",
            todayBtn: 'linked',
            autoclose: true
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
        // e.preventDefault();
        var obj = document.getElementsByName("view-checkbox");
        var viewFilterList = [];
        for(var k in obj){
            if(obj[k].checked)
                viewFilterList.push(obj[k].value);
        }
        console.log(viewFilterList);
        console.log(HowManyDays(viewChartStartTime, viewChartEndTime));
        console.log(enumerateDays(viewChartStartTime, viewChartEndTime));
        // render
    });

    $("#story-chart-wrapper").on('click', 'button.submit', function() {
        var obj = document.getElementsByName("story-checkbox");
        var storyFilterList = [];
        for(var k in obj){
            if(obj[k].checked)
                storyFilterList.push(obj[k].value);
        }
        // console.log(storyFilterList);
        // console.log(storyChartStartTime);
        // console.log(storyChartEndTime);
    });

    // showLine(dataView, "timeChart");
    showBar(dataStory, "storyChart");


})();