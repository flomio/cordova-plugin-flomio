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

FlomioPlugin.prototype.selectDeviceType = function(deviceType)
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.selectDeviceType: " + error);
    },
    "FlomioPlugin",
    "selectDeviceType",
    [deviceType]  // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or "FloBLE-Plus" (case insensitive)
  );
}

FlomioPlugin.prototype.setReaderSettings = function(readerSettings, deviceId)  // deviceId is optional
{
  if(typeof deviceId === 'undefined')
  {
    deviceId = "all";
  }

  var readerSettingsArray = new Array();
  var keyArray = new Array("scanPeriod", "scanSound");

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

  readerSettingsArray.unshift(deviceId);

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

FlomioPlugin.prototype.getReaderSettings = function(resultCallback, deviceId)  // deviceId is optional
{
  if(typeof deviceId === 'undefined')
  {
    deviceId = "all";
  }

  exec(
    function(scanPeriod, scanSound)
    {
      resultCallback({scanPeriod: scanPeriod, scanSound: scanSound});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.getReaderSettings: " + error);
    },
    "FlomioPlugin",
    "getReaderSettings",
    [deviceId]
  );
}

FlomioPlugin.prototype.startReader = function(resultCallback, deviceId)  // deviceId is optional
{
  if(typeof deviceId === 'undefined')
  {
    deviceId = "all";
  }

  exec(
    function(deviceId, tagUid)
    {
      resultCallback({tagUid: tagUid, deviceId: deviceId});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.startReader: " + error);
    }, 
    "FlomioPlugin", 
    "startReader",
    [deviceId]
  );
}

FlomioPlugin.prototype.stopReader = function(deviceId)  // deviceId is optional
{
  if(typeof deviceId === 'undefined')
  {
    deviceId = "all";
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
    [deviceId]
  );
}

FlomioPlugin.prototype.sendApdu = function(resultCallback, deviceId, apdu)
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
    [deviceId, apdu]
  );
}

FlomioPlugin.prototype.onDeviceConnect = function(resultCallback)
{
  exec(
    function(deviceId)
    {
      resultCallback({deviceId: deviceId});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onDeviceConnect: " + error);
    },
    "FlomioPlugin",
    "setDeviceConnectCallback",
    []
  );
}

FlomioPlugin.prototype.onCardStatusChange = function(resultCallback)
{
  exec(
    function(deviceId, status)
    {
      resultCallback({deviceId: deviceId, status: status});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onCardStatusChange: " + error);
    },
    "FlomioPlugin",
    "setCardStatusChangeCallback",
    []
  );
}

var flomioPlugin = new FlomioPlugin();
module.exports = flomioPlugin;
