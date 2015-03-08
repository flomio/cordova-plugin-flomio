var exec = require('cordova/exec');
/**
 * Constructor
 */
function FLOPlugin() {}

FLOPlugin.prototype.webToSdkCommand = function() {
  exec(function(result){
      // result handler
      console.log(result);
    },
    function(error){
      // error handler
      console.log("Flomio SDK plugin error occurred: " + error);
    }, 
    "floPlugin", 
    "webToSdkCommand", 
    []
  );
}

var floPlugin = new FLOPlugin();
module.exports = floPlugin
