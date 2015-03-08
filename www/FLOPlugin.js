cordova.define("com.flomio.sdk.FLOPlugin", function(require, exports, module) {
  window.echo = function(str, callback) {
      cordova.exec(callback, function(err) {
          callback('Flomio SDK plugin error occurred: ' + err);
      }, "floPlugin", "webToSdkCommand", []);
  };
});
