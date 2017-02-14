var helper = require('../helper.js');
const bootstrap = require('../common/bootstrap')

const debug = require('debug')('SnappyIONodes:dc_motor_spec');

debug(__dirname)

var nodebotNode = require('../../data/nodebotNode.js')

describe('load Config node-bot', function () {
  before(function (done) {
    helper.startServer(done);
  });

  afterEach(function () {
    helper.unload();
  });

  it('can be loaded without credentials', function (done) {
    helper.load(nodebotNode, [{
      id: "n1",
      type: "nodebot"
    }], function () {
      var n1 = helper.getNode("n1");
      //n1.should.have.property('id', 'n1');
      //(typeof n1.AWS).should.be.equal("undefined");
      done();
    });
  });

  // it('can be loaded with credentials', function(done) {
  //   helper.load(nodebotNode, [{
  //     id: "n1",
  //     type: "nodebot"
  //   }], {
  //     "n1": {
  //       "boardType" = "firmata",
  //       "serialportName" = "dev/ttyUSB0",
  //       "connectionType" = "local"
  //     }
  //   }, function() {
  //     var n1 = helper.getNode("n1");
  //     n1.should.have.property('id', 'n1');
  //     (typeof n1.AWS).should.not.be.equal("undefined");
  //     done();
  //   });
  // });

  it('can be loaded with credentials', function (done) {
    helper.load(nodebotNode, [{
      id: "n1",
      type: "nodebot"
    }], {
      // "n1": {
      //       "boardType" = "firmata",
      //        "serialportName" = "dev/ttyUSB0",
      //        "connectionType" = "local"
      //     }

    }, function () {
      var n1 = helper.getNode("n1");
      //n1.should.have.property('id', 'n1');
      //(typeof n1.AWS).should.not.be.equal("undefined");
      done();
    });
  });

});
