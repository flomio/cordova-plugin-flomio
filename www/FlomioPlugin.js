var exec = require('cordova/exec');
/**
 * Constructor
 */
function FlomioPlugin() {}

FlomioPlugin.prototype.init = function()
{
  exec(
    function()  // result handler, response from native method call
    {
      // no result returned
    },
    function(error)  // error handler
    {
      console.log("ERROR: FlomioPlugin.init: " + error);
    },
    "FlomioPlugin",
    "init",
    []
  );
}

FlomioPlugin.prototype.selectReaderType = function(readerType)
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.selectReaderType: " + error);
    },
    "FlomioPlugin",
    "selectReaderType",
    [readerType]  // readerType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or "FloBLE-Plus" (case insensitive)
  );
}

FlomioPlugin.prototype.setReaderSettings = function(readerSettings, readerUid)  // readerUid is optional
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

  readerSettingsArray.unshift(readerUid);

  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.setReaderSettings: " + error);
    },
    "FlomioPlugin",
    "setReaderSettings",
    readerSettingsArray
  );
}

FlomioPlugin.prototype.getReaderSettings = function(resultCallback, readerUid)  // readerUid is optional
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
      console.log("ERROR: FlomioPlugin.getReaderSettings: " + error);
    },
    "FlomioPlugin",
    "getReaderSettings",
    [readerUid]
  );
}

FlomioPlugin.prototype.onReaderStatusChange = function(resultCallback)
{
  exec(
    function(readerUid, connected, batteryLevel)
    {
      resultCallback({readerUid: readerUid, connected: connected, batteryLevel: batteryLevel});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onReaderStatusChange: " + error);
    },
    "FlomioPlugin",
    "setReaderStatusChangeCallback",
    []
  );
}

FlomioPlugin.prototype.startReader = function(resultCallback, readerUid)  // readerUid is optional
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
      console.log("ERROR: FlomioPlugin.startReader: " + error);
    }, 
    "FlomioPlugin", 
    "startReader",
    [readerUid]
  );
}

FlomioPlugin.prototype.stopReader = function(readerUid)  // readerUid is optional
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
      console.log("ERROR: FlomioPlugin.stopReader: " + error);
    }, 
    "FlomioPlugin", 
    "stopReader",  
    [readerUid]
  );
}

FlomioPlugin.prototype.sendApdu = function(resultCallback, readerUid, apdu)
{
  exec(
    function(responseApdu)
    {
      resultCallback({responseApdu: responseApdu});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.sendApdu: " + error);
    },
    "FlomioPlugin",
    "sendApdu",
    [readerUid, apdu]
  );
}

FlomioPlugin.prototype.onFlobleConnect = function(resultCallback)
{
  exec(
    function(readerUid)
    {
      resultCallback({readerUid: readerUid});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onFlobleConnect: " + error);
    },
    "FlomioPlugin",
    "setFlobleConnectCallback",
    []
  );
}

var flomioPlugin = new FlomioPlugin();
module.exports = flomioPlugin;
