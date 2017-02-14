const bootstrap = require('../common/bootstrap')
var helper = require('../helper.js');
var dc_motor = require("../../nodes/dc_motor/dc_motor.js");

const debug = require('debug')('SnappyIONodes:dc_motor_spec');

describe('Testing DC Motor', function () {
  before(function (done) {
    this.sandbox = sinon.sandbox.create()
    this.board = newBoard()

    this.clock = this.sandbox.useFakeTimers()
    this.pinMode = this.sandbox.spy(MockFirmata.prototype, "pinMode")
    this.digitalWrite = this.sandbox.spy(MockFirmata.prototype, "digitalWrite")

    helper.startServer(done);
  });

  afterEach(function () {
    helper.unload();
  });

  it('should be loaded', function (done) {
    var flow = [
      {
        id: "n1",
        type: "Dc Motor",
        name: ""
    }];
    helper.load(dc_motor, flow, function () {
      var n1 = helper.getNode("n1");
      done();
    });
  });

  it('DcMotor with input 1, expected output is 0,1', function (done) {
    var flow = [
      {
        id: "n1",
        type: "Dc Motor",
        name: "",
        pinA: 11
    }];
    done()

    expect(this.digitalWrite.callCount).to.be.equal(1)
    expect(this.digitalWrite.firstCall.calledWith(10, 1)).to.be.ok()

    helper.load(dc_motor, flow, function () {
      var n1 = helper.getNode("n1");
      try {
        n1.receive({
          payload: "1",
          topic: ""
        });
      } catch(err) {
        debug("Hardware Device Not Connected");
      }
    });
  });
});
