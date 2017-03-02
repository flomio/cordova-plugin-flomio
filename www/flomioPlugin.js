var exec = require('cordova/exec');
/**
 * Constructor
 */
module.exports = {
    init: function(success, failure) {
        exec(success, failure, 'FlomioPlugin', 'init', []);
    },

    selectDeviceType: function(deviceType, success, failure) {
        exec(success, failure, 'FlomioPlugin', 'selectDeviceType', [deviceType]);
        // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or "FloBLE-Plus" (case insensitive)
    },

    setConfiguration: function(configurationDictionary, success, failure) {
        var configurationArray = new Array();
        var keyArray = new Array("scanPeriod", "scanSound");

        // convert dictionary to array
        for (index in keyArray) {
            if (typeof configurationDictionary[keyArray[index]] === 'undefined') {
                configurationArray.push("unchanged");
            } else {
                configurationArray.push(readerSettings[keyArray[index]]);
            }
        }
        exec(success, error, "FlomioPlugin", "setConfiguration", configurationArray);
    },

    addConnectedDevicesListener: function(resultCallback, success, failure) {
        exec(
            (deviceIdList) => {
                resultCallback(deviceIdList);
            },
            failure, "FlomioPlugin", "setConnectedDevicesUpdateCallback", []);
    },

    addCardStatusChangeListener: function(resultCallback, success, failure) {

        exec((deviceId, status) => {
                resultCallback({ deviceId: deviceId, status: status });
            },
            (failure) => {
                console.log("ERROR: FlomioPlugin.addCardStatusChangeListener: " + failure);
            },
            "FlomioPlugin", "setCardStatusChangeCallback", []);
    },

    //   exec(
    //     function(deviceId, status)
    //     {
    //       resultCallback({deviceId: deviceId, status: status});
    //     },
    //     function(error)
    //     {
    //       console.log("ERROR: FlomioPlugin.onTagStatusChange: " + error);
    //     },
    //     "FlomioPlugin",
    //     "setCardStatusChangeCallback",
    //     []
    //   );

    // addTagDiscoveredListener: function(callback, win, fail) {
    //     document.addEventListener("tag", callback, false);
    //     cordova.exec(win, fail, "NfcPlugin", "registerTag", []);
    // },
}

// FlomioPlugin.prototype.getReaderSettings = function(resultCallback)
// {
//   exec(
//     function(scanPeriod, scanSound)
//     {
//       resultCallback({scanPeriod: scanPeriod, scanSound: scanSound});
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.getReaderSettings: " + error);
//     },
//     "FlomioPlugin",
//     "getReaderSettings",
//     []
//   );
// }

// FlomioPlugin.prototype.stopReaders = function()
// {
//   exec(
//     function()
//     {
//       // no result returned
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.stopReaders: " + error);
//     }, 
//     "FlomioPlugin", 
//     "stopReaders",  
//     []
//   );
// }

// FlomioPlugin.prototype.sendApdu = function(resultCallback, deviceId, apdu)
// {
//   exec(
//     function(deviceId, responseApdu)
//     {
//       resultCallback({deviceId: deviceId, responseApdu: responseApdu});
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.sendApdu: " + error);
//     },
//     "FlomioPlugin",
//     "sendApdu",
//     [deviceId, apdu]
//   );
// }

// FlomioPlugin.prototype.onDeviceConnectionChange = function(resultCallback)
// {
//   exec(
//     function(deviceIdList)
//     {
//       resultCallback(deviceIdList);
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.onDeviceConnectionChange: " + error);
//     },
//     "FlomioPlugin",
//     "setDeviceConnectionChangeCallback",
//     []
//   );
// }

// FlomioPlugin.prototype.onTagStatusChange = function(resultCallback)
// {
//   exec(
//     function(deviceId, status)
//     {
//       resultCallback({deviceId: deviceId, status: status});
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.onTagStatusChange: " + error);
//     },
//     "FlomioPlugin",
//     "setCardStatusChangeCallback",
//     []
//   );
// }

// FlomioPlugin.prototype.onTagUidRead = function(resultCallback)
// {
//   exec(
//     function(deviceId, tagUid)
//     {
//       resultCallback({tagUid: tagUid, deviceId: deviceId});
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.onTagUidRead: " + error);
//     }, 
//     "FlomioPlugin", 
//     "setTagUidReadCallback",
//     []
//   );
// }

// FlomioPlugin.prototype.getDataBlocks = function(resultCallback, deviceId)
// {
//   exec(
//     function(deviceId, ndef)
//     {
//       resultCallback({ndef: ndef, deviceId: deviceId});
//     },
//     function(error)
//     {
//       console.log("ERROR: FlomioPlugin.onNdefDiscovery: " + error);
//     }, 
//     "FlomioPlugin", 
//     "getDataBlocks",
//     [deviceId]
//   );
// }

// var flomioPlugin = new FlomioPlugin();
// module.exports = flomioPlugin;