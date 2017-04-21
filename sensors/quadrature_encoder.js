'use strict';

const debug = require('debug')('snappy:io:quadrature_encoder');

module.exports = function(RED) {
  var quad_EncoderNode = function(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var io = null;

    let waveform = '';
    let waveformTimeout;
    var count = 0;

    function onPress() {
      console.log('press')
      debug('press')
    }

    function handleWaveform() {
      /*  if (waveform.length < 2) {
          waveformTimeout = setTimeout(() => {
            waveform = '';
          }, 8);
          return;
        }

        if (waveformTimeout) {
          clearTimeout(waveformTimeout);
        }*/

      if (waveform === '01') {
        count++;
      } else if (waveform === '10') {
        count--;
      }
      debug(count)
      node.send([{
        payload: count
      }]);
      waveform = '';
    }

    this.nodebot = RED.nodes.getNode(config.board);

    if (typeof this.nodebot === "object") {
      node.status({
        fill: "red",
        shape: "ring",
        text: "connecting ... "
      })

      node.nodebot.on('ioready', function() {
        node.status({
          fill: "green",
          shape: "dot",
          text: "connected"
        })

        try {
          io = node.nodebot.io;
          io.pinMode(config.pinA, io.MODES["INPUT"])
          io.pinMode(config.pinB, io.MODES["INPUT"])
          io.pinMode(config.pressButton, io.MODES["INPUT"])
          io.digitalRead(config.pinA, () => {
            debug('pin a')
            waveform += '1';
            handleWaveform();
          })
          io.digitalRead(config.pinB, () => {
            debug('pin b')
            waveform += '0';
            handleWaveform();
          })
          io.digitalRead(config.pressButton, () => {
            onPress();
          })
        } catch (e) {
          debug("erRr:", e)
          node.error(e)
          node.status({
            fill: "red",
            shape: "dot",
            text: "Error : " + e
          })
        }
      })

      node.nodebot.on('networkReady', function() {
        node.status({
          fill: "yellow",
          shape: "ring",
          text: "connecting..."
        })
      });
      node.nodebot.on('networkError', function() {
        node.status({
          fill: "red",
          shape: "dot",
          text: "disconnected"
        })
      });
      node.nodebot.on('ioError', function(err) {
        node.warn(err)
        node.status({
          fill: "red",
          shape: "dot",
          text: "error"
        })
      });
    } else {
      this.warn("nodebot not configured");
    }
  }
  RED.nodes.registerType("quadrature-encoder", quad_EncoderNode);
}
