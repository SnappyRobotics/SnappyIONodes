'use strict';

const debug = require('debug')('snappy:io:dc_motor')

module.exports = function(RED) {
  var dcMotorNode = function(config) {
    RED.nodes.createNode(this, config)
    var node = this
    var io = null

    var constrain = function(num) {
      if (num < -255) {
        return -255
      } else if (num > 255) {
        return 255
      } else {
        return num
      }
    }

    var processInput = function(msg) {
      var speed = constrain(Math.round(parseInt(msg.payload.speed) * config.gain))
      if (config.motorType == "typeA") {
        var A = 0
        var B = 0
        var En = 0

        if (msg.payload.brake) { //if brake, apply brake
          A = 1
          B = 1
          En = 0
        } else if (parseInt(speed) === 0) { // if speed is 0 and brake is not applied then just LOW both pins
          A = 0
          B = 0
          En = 0
        } else {
          if (speed > 0) {
            En = speed
            A = 1
            B = 0
          } else {
            En = -speed //make speed positive
            A = 0
            B = 1
          }
        }
        // debug("En : ", En)
        // debug("A : ", A)
        // debug("B : ", B)

        io.analogWrite(config.enablePin_A, Math.round(En))
        io.digitalWrite(config.pinA, (A) ? io.HIGH : io.LOW)
        io.digitalWrite(config.pinB, (B) ? io.HIGH : io.LOW)
      } else if (config.motorType == "typeB") {
        var dir = 0
        var En2 = 0
        if (msg.payload.brake || parseInt(speed) === 0) {
          En2 = 0
        } else {
          if (speed > 0) {
            En2 = speed
            dir = 1
          } else {
            En2 = -speed //make speed positive
            dir = 0
          }
        }

        dir = (dir) ? io.HIGH : io.LOW

        // debug("En : ", En2)
        // debug("dir : ", dir)

        io.analogWrite(config.enablePin_B, En2)
        io.digitalWrite(config.dirPin, dir)
      } else {
        debug("no matching motorType found")
      }
    }

    var registerListener = function() {
      node.on('input', function(msg) {
        if (msg.payload && msg.payload.speed !== undefined) {
          processInput(msg)
        } else {
          node.status({
            fill: "red",
            shape: "dot",
            text: "wrong input"
          })
          setTimeout(function() {
            node.status({
              fill: "green",
              shape: "dot",
              text: "connected"
            })
          }, 3000)
        }
      })
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
          if (config.motorType == "typeA") {

            io.pinMode(config.pinA, io.MODES["OUTPUT"])
            io.pinMode(config.pinB, io.MODES["OUTPUT"])
            io.pinMode(config.enablePin_A, io.MODES["PWM"])

            registerListener()
          } else if (config.motorType == "typeB") {
            io.pinMode(config.dirPin, io.MODES["OUTPUT"])
            io.pinMode(config.enablePin_B, io.MODES["PWM"])

            registerListener()
          } else {
            debug("no matching motorType found")
          }
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
      })

      node.nodebot.on('networkError', function() {
        node.status({
          fill: "red",
          shape: "dot",
          text: "disconnected"
        })
      })

      node.nodebot.on('ioError', function(err) {
        node.warn(err)
        node.status({
          fill: "red",
          shape: "dot",
          text: "error"
        })
      })
    } else {
      this.warn("nodebot not configured")
    }
  }
  RED.nodes.registerType("dc-motor", dcMotorNode)
}
