const debug = require('debug')('snappy:io:RazorIMU');
var SerialPort = require('serialport');


function connectingStatus(n) {
  n.status({
    fill: "red",
    shape: "ring",
    text: "connecting ... "
  });
}

function networkReadyStatus(n) {
  n.status({
    fill: "yellow",
    shape: "ring",
    text: "connecting..."
  });
}

function networkErrorStatus(n) {
  n.status({
    fill: "red",
    shape: "dot",
    text: "disconnected"
  });
}

function ioErrorStatus(n, err) {
  n.status({
    fill: "red",
    shape: "dot",
    text: "error"
  });
  n.warn(err);
}

function connectedStatus(n) {
  n.status({
    fill: "green",
    shape: "dot",
    text: "connected !!!! "
  });
}


function init(RED) {
  function RazorIMUNode(n) {
    RED.nodes.createNode(this, n);
    this.port = n.serialportName;
    console.log(n)
    //var five = require("johnny-five")

    /*
    this.nodebot = RED.nodes.getNode(n.board);
    if (typeof this.nodebot === "object") {
      var node = this;
      connectingStatus(node);

      node.nodebot.on('ioready', function() {

        connectedStatus(node);

      });
      node.nodebot.on('networkReady', function() {
        networkReadyStatus(node);
      });
      node.nodebot.on('networkError', function() {
        networkErrorStatus(node);
      });
      node.nodebot.on('ioError', function(err) {
        ioErrorStatus(node, err);
      });
    } else {
      this.warn("nodebot not configured");
    }
    */
  }
  RED.nodes.registerType("Razor IMU", RazorIMUNode);
}
module.exports = init;
