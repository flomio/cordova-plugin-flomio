window.echo = function(str, callback) {
  cordova.exec(callback, function(err) {
      callback('Flomio SDK plugin error occurred: ' + err);
    }, "floPlugin", "webToSdkCommand", []);
};
