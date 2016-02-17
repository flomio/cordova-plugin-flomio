var exec = require('cordova/exec');
/**
 * Constructor
 */
function FLOPlugin() {}

FLOPlugin.prototype.init = function()
{
  exec(
    function()  // result handler, response from native method call
    {
      // no result returned
    },
    function(error)  // error handler
    {
      console.log("ERROR: FloPlugin.init: " + error);
    },
    "FLOPlugin",
    "init",
    []
  );
}

FLOPlugin.prototype.onReaderConnect = function(resultCallback)
{
  exec(
    function(readerUid)
    {
      resultCallback({readerUid: readerUid});
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.onReaderConnect: " + error);
    },
    "FLOPlugin",
    "setReaderConnectCallback",
    []
  );
}

FLOPlugin.prototype.onReaderStatusChange = function(resultCallback)
{
  exec(
    function(readerUid, commStatus, batteryLevel)
    {
      resultCallback({readerUid: readerUid, commStatus: commStatus, batteryLevel: batteryLevel});
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.onReaderStatusChange: " + error);
    },
    "FLOPlugin",
    "setReaderStatusChangeCallback",
    []
  );
}

FLOPlugin.prototype.sendApdu = function(resultCallback, readerUid, apdu)
{
  exec(
    function(responseApdu)
    {
      resultCallback({responseApdu: responseApdu});
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.sendApdu: " + error);
    },
    "FLOPlugin",
    "sendApdu",
    [readerUid, apdu]
  );
}

FLOPlugin.prototype.selectReaderType = function(readerType)
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.selectReaderType: " + error);
    },
    "FLOPlugin",
    "selectReaderType",
    [readerType]  // readerType is "FloJack", "FloBLE-EMV" or "FloBLE-Plus" (case insensitive)
  );
}

FLOPlugin.prototype.setReaderSettings = function(readerSettings)
{
  // convert dictionary to array
  var readerSettingsArray = new Array();
  for (var key in readerSettings)
  {
    readerSettingsArray.push(readerSettings[key]);
  }

  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.setReaderSettings: " + error);
    },
    "FLOPlugin",
    "setScanPeriod",
    [readerSettingsArray]
  );
}

FLOPlugin.prototype.setScanPeriod = function(period)
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.setScanPeriod: " + error);
    },
    "FLOPlugin",
    "setScanPeriod",
    [period]
  );
}

FLOPlugin.prototype.toggleScanSound = function(trueOrFalse)
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.toggleScanSound: " + error);
    },
    "FLOPlugin",
    "toggleScanSound",
    [trueOrFalse]
  );
}

FLOPlugin.prototype.startReader = function(resultCallback, readerUid)  // readerUid is optional
{
  if(typeof readerUid === 'undefined')
  {
  	readerUid = "all";
  }

  exec(
    function(tagUid, readerUid)
    {
  	  resultCallback({tagUid: tagUid, readerUid: readerUid});
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.startReader: " + error);
    }, 
    "FLOPlugin", 
    "startReader",
    [readerUid]
  );
}

FLOPlugin.prototype.stopReader = function(readerUid)  // readerUid is optional
{
  if(typeof readerUid === 'undefined')
  {
  	readerUid = "all";
  }

  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.stopReader: " + error);
    }, 
    "FLOPlugin", 
    "stopReader",  
    [readerUid]
  );
}

var floPlugin = new FLOPlugin();
module.exports = floPlugin;
