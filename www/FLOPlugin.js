var exec = require('cordova/exec');
/**
 * Constructor
 */
function FLOPlugin() {}

FLOPlugin.prototype.selectReader = function(readerType, callback)
{
  exec(
    function()  // result handler, response from native method call
    {
      // no result returned
    },
    function(error)  // error handler
    {
      callback(null, error);
    },
    "FLOPlugin",
    "selectReader",
    [readerType]  // readerType is "FloJack", "FloBLE-EMV" or "FloBLE-Plus" (case insensitive)
  );
}

FLOPlugin.prototype.startPolling = function(callback)
{
  exec(
    function(tagUid, tagType)
    {
  	  callback({tagUid: tagUid, tagType: tagType}, null);
    },
    function(error)
    {
      callback(null, error);
    }, 
    "FLOPlugin", 
    "startPolling",
    []
  );
}

FLOPlugin.prototype.stopPolling = function()
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      callback(null, error);
    }, 
    "FLOPlugin", 
    "stopPolling",  
    []
  );
}

var floPlugin = new FLOPlugin();
module.exports = floPlugin;
