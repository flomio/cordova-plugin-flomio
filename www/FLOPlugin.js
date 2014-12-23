cordova.define("com.flomio.sdk.FLOPlugin", function(require, exports, module) {
  window.echo = function(str, callback) {
      cordova.exec(callback, function(err) {
          callback('Flomio SDK plugin error occurred: ' + err);
      }, "floPlugin", "webToSdkCommand", []);
  };
});

// var exec = require('cordova/exec');
// /**
//  * Constructor
//  */
// function FLOPlugin() {}
//
// FLOPlugin.prototype.sayHello = function() {
//   exec(function(result){
//       // result handler
//       alert(result);
//     },
//     function(error){
//       // error handler
//       alert("Error" + error);
//     },
//     "FLOPlugin",
//     "onScan",
//     []
//   );
// }
//
// var myPlugin = new MyPlugin();
// module.exports = myPlugin