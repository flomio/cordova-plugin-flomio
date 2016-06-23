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

FlomioPlugin.prototype.setReaderSettings = function(readerSettings)
{
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

FlomioPlugin.prototype.getReaderSettings = function(resultCallback)
{
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
    []
  );
}

FlomioPlugin.prototype.stopReaders = function()
{
  exec(
    function()
    {
      // no result returned
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.stopReaders: " + error);
    }, 
    "FlomioPlugin", 
    "stopReaders",  
    []
  );
}

FlomioPlugin.prototype.sendApdu = function(resultCallback, deviceId, apdu)
{
  exec(
    function(deviceId, responseApdu)
    {
      resultCallback({deviceId: deviceId, responseApdu: responseApdu});
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

FlomioPlugin.prototype.onDeviceConnectionChange = function(resultCallback)
{
  exec(
    function(deviceIdList)
    {
      resultCallback(deviceIdList);
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onDeviceConnectionChange: " + error);
    },
    "FlomioPlugin",
    "setDeviceConnectionChangeCallback",
    []
  );
}

FlomioPlugin.prototype.onBr500ConnectionChange = function(resultCallback)
{
  exec(
    function(deviceIdList)
    {
      resultCallback(deviceIdList);
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onBr500ConnectionChange: " + error);
    },
    "FlomioPlugin",
    "setBr500ConnectionChangeCallback",
    []
  );
}

FlomioPlugin.prototype.onTagStatusChange = function(resultCallback)
{
  exec(
    function(deviceId, status)
    {
      resultCallback({deviceId: deviceId, status: status});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onTagStatusChange: " + error);
    },
    "FlomioPlugin",
    "setCardStatusChangeCallback",
    []
  );
}

FlomioPlugin.prototype.onTagUidRead = function(resultCallback)
{
  exec(
    function(deviceId, tagUid)
    {
      resultCallback({tagUid: tagUid, deviceId: deviceId});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onTagUidRead: " + error);
    }, 
    "FlomioPlugin", 
    "setTagUidReadCallback",
    []
  );
}

FlomioPlugin.prototype.getDataBlocks = function(resultCallback, deviceId)
{
  exec(
    function(deviceId, ndef)
    {
      resultCallback({ndef: ndef, deviceId: deviceId});
    },
    function(error)
    {
      console.log("ERROR: FlomioPlugin.onNdefDiscovery: " + error);
    }, 
    "FlomioPlugin", 
    "setNdefDataBlockDiscoveryCallback",
    [deviceId]
  );
}

var flomioPlugin = new FlomioPlugin();
module.exports = flomioPlugin;
