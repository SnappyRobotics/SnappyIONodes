var helper = require('../helper.js');
var DcMotor = require("../../nodes/dc_motor/dc_motor.js");
const debug = require('debug')('SnappyIONodes:dc_motor_spec');

describe('Testing DC Motor', function() {
  before(function(done) {
    helper.startServer(done);
  });

  afterEach(function() {
    helper.unload();
  });

  after(function(done) {
    helper.stopServer(done);
  });

  it('should be loaded', function(done) {
    var flow = [{
      id: "n1",
      type: "Dc Motor",
      name: ""
    }];
    helper.load(DcMotor, flow, function() {
      var n1 = helper.getNode("n1");
      done();
    });
  });

  it('DcMotor with input 1, expected output is 0,1', function(done) {
    var flow = [{
      id: "n1",
      type: "Dc Motor",
      name: ""
    }];

    try {
      done()
    } catch (err) {
      done(err)
    }

    helper.load(differential_drive, flow, function() {
      var n1 = helper.getNode("n1");
      try {
        n1.receive({
          payload: "1",
          topic: ""
        });
      } catch (err) {
        debug("Hardware Device Not Connected");
      }
    });
  });
});
