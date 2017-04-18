'use strict';

const debug = require('debug')('snappy:io:dc_motor');

module.exports = function(RED) {
  var dcMotorNode = function(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var processInput = function(msg) {

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
