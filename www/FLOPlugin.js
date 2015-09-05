var exec = require('cordova/exec');
/**
 * Constructor
 */
function FLOPlugin() {}

FLOPlugin.prototype.startPolling = function(resultCallback) {
  exec(function(tagUid, tagType){
      // result handler, response from native method call
	  resultCallback(tagUid, tagType);
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

FLOPlugin.prototype.acknowledgeScan = function(lastReceivedScan) {
  exec(function(result){
      // TODO
    },
    function(error){
      // error handler
      console.log("Flomio SDK plugin error occurred: " + error);
    }, 
    "FLOPlugin", 
    "acknowledgeScan",  
    [lastReceivedScan]
  );
}

FLOPlugin.prototype.stopPolling = function() {
  exec(function(result){
      // TODO
    },
    function(error){
      // error handler
      console.log("Flomio SDK plugin error occurred: " + error);
    }, 
    "FLOPlugin", 
    "stopPolling",  
    []
  );
}

var floPlugin = new FLOPlugin();
module.exports = floPlugin;
