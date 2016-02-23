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

FLOPlugin.prototype.setReaderSettings = function(readerSettings, readerUid)  // readerUid is optional
{
  if(typeof readerUid === 'undefined')
  {
    readerUid = "all";
  }

  var readerSettingsArray = new Array();
  var keyArray = new Array("scanPeriod", "scanSound", "operationState", "startBlock", "messageToWrite");

  // convert dictionary to array
  for(index in keyArray)
  {
    if(typeof readerSettings[keyArray[index]] === 'undefined')
    {
      readerSettingsArray.push("unchanged");
    }
    else
    {
      readerSettingsArray.push(readerSettings[keyArray[index]]);
    }
  }

  console.log(readerSettingsArray.unshift(readerUid));

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
    readerSettingsArray.unshift(readerUid)
  );
}

FLOPlugin.prototype.getReaderSettings = function(resultCallback, readerUid)  // readerUid is optional
{
  if(typeof readerUid === 'undefined')
  {
    readerUid = "all";
  }

  exec(
    function(scanPeriod, scanSound, operationState, startBlock, messageToWrite)
    {
      resultCallback({scanPeriod: scanPeriod, scanSound: scanSound, operationState: operationState, startBlock: startBlock, messageToWrite: messageToWrite});
    },
    function(error)
    {
      console.log("ERROR: FloPlugin.getReaderSettings: " + error);
    },
    "FLOPlugin",
    "getReaderSettings",
    [readerUid]
  );
}

FLOPlugin.prototype.onReaderStatusChange = function(resultCallback)
{
  exec(
    function(readerUid, connected, batteryLevel)
    {
      resultCallback({readerUid: readerUid, connected: connected, batteryLevel: batteryLevel});
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

FLOPlugin.prototype.startReader = function(resultCallback, readerUid)  // readerUid is optional
{
  if(typeof readerUid === 'undefined')
  {
    readerUid = "all";
  }

  exec(
    function(readerUid, tagUid)
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

var floPlugin = new FLOPlugin();
module.exports = floPlugin;
