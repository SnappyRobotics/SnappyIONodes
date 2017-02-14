var spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const debug = require('debug')('SnappyLogicNodes:run');

const red = require('nodered_container');

red.check(__dirname, function(err) {
  if (err) {
    throw err
  }
  var settings_path = path.join(__dirname, "data", 'settings.js')
  try {
    var settings = require(settings_path)
    // throw ("")  //Uncomment this to create custom settings file forcibly
    debug("Custom settings file found")
  } catch (e) {
    debug("Custom Settings file not found")

    var default_settings = path.join(__dirname, "..", "node-red", 'settings.js')
    try {
      var settings = require(default_settings)
    } catch (er) {
      debug(er)
    }
    settings.nodesDir = __dirname
    settings.debugUseColors = true

    var o = 'module.exports=' + JSON.stringify(settings)
    fs.writeFileSync(settings_path, o)
    debug("Written to file")
  }
  try {
    var red = spawn("node", [
      path.join(__dirname, "..", "node-red", 'red.js'),
      "--settings",
      settings_path
    ], {
      stdio: "inherit"
    })

    red.on('exit', function(code) {
      debug('child process exited with code ' + code.toString());
    });
  } catch (e) {
    debug(e)
  }
})
