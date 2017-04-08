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

function disconnectedErrorStatus(n) {
  n.status({
    fill: "red",
    shape: "dot",
    text: "disconnected"
  });
}

function ioErrorStatus(n) {
  n.status({
    fill: "red",
    shape: "dot",
    text: "cannot connect to the serial port"
  });
}

function notConfiguredStatus(n) {
  n.status({
    fill: "red",
    shape: "dot",
    text: "serial port not configured"
  });
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
    var node = this;

    if (n.serialportName) {
      this.port = n.serialportName;
      var port = new SerialPort(this.port, {
        baudRate: 57600,
        parser: SerialPort.parsers.readline('\n')
      });

      port.on('open', function() {
        port.on('data', function(data) {
          console.log('Data: ' + data);
        });
        connectedStatus(node);
      })

      port.on('disconnect', function() {
        disconnectedErrorStatus(node)
      })
      // open errors will be emitted as an error event
      port.on('error', function(err) {
        console.log('Error: ', err.message);
        ioErrorStatus(node)
      })

    } else {
      node.error("Serial Port not configured");

      notConfiguredStatus(node);
    }

    // node.board.on('error', node.error.bind(node));

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

    if (node.io && node.io.on) {
      node.io.on('error', function(err) {
        node.error(err);
      });
    }

  }
  RED.nodes.registerType("Razor IMU", RazorIMUNode);
}
module.exports = init;
