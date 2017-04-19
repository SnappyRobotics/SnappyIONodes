'use strict';

const debug = require('debug')('snappy:io:dc_motor');


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

module.exports = function(RED) {
  var dcMotorNode = function(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var five = require("johnny-five")

    var processInput = function(msg) {

      debug(msg)
    }

    this.on('input', function(msg) {
      if (msg.payload && msg.payload.speed !== undefined) {
        processInput(msg)
      } else {
        node.status({
          fill: "red",
          shape: "dot",
          text: "wrong input"
        })
        setTimeout(function() {
          node.status({})
        }, 3000)
      }
    })
  }
  RED.nodes.registerType("dc-motor", dcMotorNode);
}
