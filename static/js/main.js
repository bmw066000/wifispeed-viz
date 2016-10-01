$(document).ready(function() {
    ajaxd();
    setInterval("ajaxd()", 60000);
});

var pingPlot = document.getElementById('pingPlot');
var pingGauge = new Gauge(document.getElementById('pingGauge')).setOptions({
    lines: 12,
    angle: 0.15,
    lineWidth: 0.44,
    pointer: {
        length: 0.9,
        strokeWidth: 0.035,
        color: '#000'
    },
    limitMax: 'false',
    percentColors: [
        [0.0, "#a9d70b"],
        [0.50, "#f9c802"],
        [1.0, "#ff0000"]
    ],
    strokeColor: '#e0e0e0',
    generateGradient: true
});
pingGauge.setTextField(document.getElementById('ping-textfield'));
pingGauge.maxValue = 30;

var downloadPlot = document.getElementById('downloadPlot');
var uploadPlot = document.getElementById('uploadPlot');

var graph_time = [];
var graph_ping = [];
var graph_download = [];
var graph_upload = [];

function ajaxd() {
    var msg = $.ajax({type: "GET", url: "/get_data", async: false}).responseText;
    console.log(msg);
    var sData = JSON.parse(msg);
    if (sData.length === 4) {
        // save data to plot
        graph_time.push(sData[0]);
        pingGauge.set(sData[1]);
        graph_ping.push(sData[1]);
        graph_download.push(sData[2]);
        graph_upload.push(sData[3]);
        if (graph_time.length > 100) {
            graph_time.shift();
            graph_ping.shift();
            graph_download.shift();
            graph_upload.shift();
        }
        graph_update();
    }
}

function graph_update() {
    Plotly.newPlot(pingPlot, [ { x: graph_time, y: graph_ping, fill: 'tonexty', type: 'scatter', marker: {color: "#00ae33"} } ], { height: 120, margin: { l: 30, r: 30, b: 30, t: 0, pad: 0 }, xaxis: {title: 'time (s)'}, yaxis: {title: 'ms'} } );
    Plotly.newPlot(downloadPlot, [ { x: graph_time, y: graph_download, fill: 'tonexty', type: 'scatter', marker: {color: "#3333ff"} } ], { height: 120, margin: { l: 30, r: 30, b: 30, t: 30, pad: 0 }, xaxis: {title: 'time (s)'}, yaxis: {title: 'Mbit/s'} } );
    Plotly.newPlot(uploadPlot, [ { x: graph_time, y: graph_upload, fill: 'tonexty', type: 'scatter', marker: {color: "#f2dede"} } ], { height: 120, margin: { l: 30, r: 30, b: 30, t: 30, pad: 0 }, xaxis: {title: 'time (s)'}, yxis: {title: 'Mbit/s'} } );
}
