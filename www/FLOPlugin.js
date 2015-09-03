var exec = require('cordova/exec');
/**
 * Constructor
 */
function FLOPlugin() {}

FLOPlugin.prototype.startPolling = function(resultCallback) {
  exec(function(result){
      // result handler, response from native method call
	  resultCallback(result);
    },
    function(error){
      // error handler
      console.log("Flomio SDK plugin error occurred: " + error);
    }, 
    "FLOPlugin", 
    "startPolling",  
    []
  );
}

var floPlugin = new FLOPlugin();
module.exports = floPlugin;
