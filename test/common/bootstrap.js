process.env.IS_TEST_MODE = true;

// Built-in Dependencies
global.cp = require("child_process");
global.Emitter = require("events").EventEmitter;
global.fs = require("fs");
global.path = require("path");

global.five = require("johnny-five");

//global.assert = require("should");
global.expect = require("expect.js");
global.sinon = require("sinon");
global.mocks = require("mock-firmata");
global.Boards = five.Boards;
global.Board = five.Board;

global.MockFirmata = mocks.Firmata;
global.MockSerialPort = mocks.SerialPort;

function newBoard(pins) {

  if (pins) {
    pins.forEach(function(pin) {
      Object.assign(pin, {
        mode: 1,
        value: 0,
        report: 1,
        analogChannel: 127
      });
    });
  }

  var io = new MockFirmata({
    pins: pins
  });

  io.SERIAL_PORT_IDs.DEFAULT = 0x08;

  var board = new Board({
    io: io,
    debug: false,
    repl: false
  });

  io.emit("connect");
  io.emit("ready");

  return board;
}

global.newBoard = newBoard;
