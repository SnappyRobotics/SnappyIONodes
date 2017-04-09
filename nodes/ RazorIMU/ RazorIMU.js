const debug = require('debug')('snappy:io:RazorIMU');

var SerialPort = require('serialport');


// function connectingStatus(n) {
//   n.status({
//     fill: "red",
//     shape: "ring",
//     text: "connecting ... "
//   });
// }

// function networkReadyStatus(n) {
//   n.status({
//     fill: "yellow",
//     shape: "ring",
//     text: "connecting..."
//   });
// }

// function disconnectedErrorStatus(n) {
//   n.status({
//     fill: "red",
//     shape: "dot",
//     text: "disconnected"
//   });
// }

// function ioErrorStatus(n) {
//   n.status({
//     fill: "red",
//     shape: "dot",
//     text: "cannot connect to the serial port"
//   });
// }

// function notConfiguredStatus(n) {
//   n.status({
//     fill: "red",
//     shape: "dot",
//     text: "serial port not configured"
//   });
// }
//
// function connectedStatus(n) {
//   n.status({
//     fill: "green",
//     shape: "dot",
//     text: "connected !!!! "
//   });
// }


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
          var d = data.substring(data.indexOf("=") + 1)
          var arr = d.split(",");

          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseFloat(arr[i].trim())
          }

          var o = {
            yaw: arr[0],
            pitch: arr[1],
            roll: arr[2]
          }

          node.send({
            topic: "",
            payload: o
          });
        });
        // connectedStatus(node);
      })

      port.on('disconnect', function() {
        disconnectedErrorStatus(node)
      })
      // open errors will be emitted as an error event
      port.on('error', function(err) {
        console.log('Error: ', err.message);
        // ioErrorStatus(node)
      })

    } else {
      node.error("Serial Port not configured");

      // notConfiguredStatus(node);
    }

    // if (node.io && node.io.on) {
    //   node.io.on('error', function(err) {
    //     node.error(err);
    //   });
    // }

  }
  RED.nodes.registerType("Razor IMU", RazorIMUNode);
}
module.exports = init;
