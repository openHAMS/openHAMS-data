$(document).ready(function() {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal({
        ready: function(modal, trigger) {
            console.log(modal, trigger);
        },
        complete: function() {
            console.log("closed");
        }
    });
});

var socket = io();
socket.on('connect', function() {
    changeStatus('Connected', 'connect');
});
socket.on('connect_error', function() {
    changeStatus('Disconnected.', 'connect_error');
});
socket.on('reconnect_attempt', function() {
    changeStatus('Reconnecting...', 'reconnect_attempt');
});

function changeStatus(text, style) {
    document.getElementById('conntext').textContent = text;
    document.getElementById('conntext').className = style;
    document.getElementById('connbull').className = style;
}
socket.on('server/history', function(recentData) {
    loadGraph(recentData);
});
socket.on('home/rcr/sensors/bmp180/pressure', function(a) {
    document.getElementById('atm').textContent = parseFloat(a).toFixed(1);
});
socket.on('home/rcr/sensors/bmp180/temperature', function(t) {
    document.getElementById('temp').textContent = parseFloat(t).toFixed(1);
});