var chart;

Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

var stillUpdating = false;

function afterSetExtremes(e) {
    console.log(e.trigger);
    if (e.trigger != 'undefined') {
        if (!stillUpdating) {
            var currExMin = (Math.round(e.min / 1000) * 1000);
            var currExMax = (Math.round(e.max / 100) * 100);
            stillUpdating = true;
            chart.showLoading('Loading data from server...');
            var jsonp = `jsonp?start=${currExMin}&end=${currExMax}&callback=?`;
            console.log(jsonp);
            $.getJSON(jsonp,
                function(data) {
                    chart.series[0].setData(data["pressure"]);
                    chart.series[1].setData(data["temperature"]);
                    chart.hideLoading();
                    chart.reflow();
                    stillUpdating = false;
                });
        }
    }
}

function loadGraph(history) {
    var seriesOptions = [];
    seriesOptions[0] = {
        color: Highcharts.getOptions().colors[1],
        data: history["pressure"],
        name: 'Pressure',
        tooltip: {
            valueSuffix: ' hPa'
        },
        yAxis: 0
    };
    seriesOptions[1] = {
        color: Highcharts.getOptions().colors[0],
        data: history["temperature"],
        name: 'Temperature',
        tooltip: {
            valueSuffix: ' ℃'
        },
        yAxis: 1
    };
    // copying default settings
    var chartSettings = JSON.parse(JSON.stringify(defaultChartSettings));
    chartSettings.chart.renderTo = 'container';
    chartSettings.rangeSelector.selected = 3;

    chartSettings.series = seriesOptions;
    chartSettings.xAxis.events.afterSetExtremes = afterSetExtremes;
    chart = new Highcharts.StockChart(chartSettings);
}
