var exec = require('cordova/exec');
/**
 * Constructor
 */
function FLOPlugin() {}

FLOPlugin.prototype.webToSdkCommand = function() {
  exec(function(result){
      // result handler, response from native method call
      console.log(result);
    },
    function(error){
      // error handler
      console.log("Flomio SDK plugin error occurred: " + error);
    }, 
    "FLOPlugin", 
    "webToSdkCommand",  
    []
  );
}

FLOPlugin.prototype.webToSdkCommandAsync = function() {
  exec(function(result){
      // result handler, response from native method call
      // console.log(result);
	  alert(result);
    },
    function(error){
      // error handler
      console.log("Flomio SDK plugin error occurred: " + error);
    }, 
    "FLOPlugin", 
    "webToSdkCommandAsync",  
    []
  );
}

var floPlugin = new FLOPlugin();
module.exports = floPlugin
