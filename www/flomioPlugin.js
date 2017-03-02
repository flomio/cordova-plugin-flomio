var exec = require('cordova/exec');
/**
 * Constructor
 */
module.exports = {
    init: (success, failure) => {
        exec(success, failure, 'FlomioPlugin', 'init', []);
    },

    selectDeviceType: (deviceType, success, failure) => {
        exec(success, failure, 'FlomioPlugin', 'selectDeviceType', [deviceType]);
        // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or "FloBLE-Plus" (case insensitive)
    },

    setConfiguration: (configurationDictionary, success, failure) => {
        var configurationArray = new Array();
        var keyArray = new Array("scanPeriod", "scanSound", "readerState", "powerOperation");
        // convert dictionary to array
        for (index in keyArray) {
            if (typeof configurationDictionary[keyArray[index]] === 'undefined') {
                configurationArray.push("unchanged");
            } else {
                configurationArray.push(configurationDictionary[keyArray[index]]);
            }
        }
        exec(success, failure, "FlomioPlugin", "setConfiguration", configurationArray);
    },

    getConfiguration: (resultCallback, configurationDictionary, success, failure) => {
        exec(
            (scanPeriod, scanSound) => { resultCallback({ scanPeriod: scanPeriod, scanSound: scanSound }) },
            (failure) => { console.log("ERROR: FlomioPlugin.getConfiguration: " + failure) },
            "FlomioPlugin", "getConfiguration", []);
    },

    stopReaders: (resultCallback, success, failure) => {
        exec(
            (scanPeriod, scanSound) => { resultCallback({ deviceId: deviceId, responseApdu: responseApdu }) },
            (failure) => { console.log("ERROR: FlomioPlugin.stopReaders: " + failure) },
            "FlomioPlugin", "stopReaders", []);
    },

    sendApdu: (resultCallback, deviceId, apdu, success, failure) => {
        exec(
            (deviceId, responseApdu) => { resultCallback({ deviceId: deviceId, responseApdu: responseApdu }) },
            (failure) => { console.log("ERROR: FlomioPlugin.sendApdu: " + failure) },
            "FlomioPlugin", "sendApdu", [deviceId, apdu]);
    },

    // Delegate/Event Listeners
    addConnectedDevicesListener: (resultCallback, success, failure) => {
        exec(
            (deviceIdList) => { resultCallback(deviceIdList) },
            (failure) => { console.log("ERROR: FlomioPlugin.addConnectedDevicesListener: " + failure) },
            "FlomioPlugin", "setConnectedDevicesUpdateCallback", []);
    },

    addTagStatusChangeListener: (resultCallback, success, failure) => {
        exec(
            (deviceId, status) => { resultCallback({ deviceId: deviceId, status: status }) },
            (failure) => { console.log("ERROR: FlomioPlugin.addTagStatusChangeListener: " + failure) },
            "FlomioPlugin", "setCardStatusChangeCallback", []);
    },

    addTagDiscoveredListener: (resultCallback, success, failure) => {
        exec(
            (deviceId, tagUid) => { resultCallback({ tagUid: tagUid, deviceId: deviceId }) },
            (failure) => { console.log("ERROR: FlomioPlugin.addTagDiscoveredListener: " + failure) },
            "FlomioPlugin", "setTagDiscoveredCallback", []);
    },

    addNdefListener: (resultCallback, success, failure) => {
        exec(
            (deviceId, tagUid) => { resultCallback({ tagUid: tagUid, deviceId: deviceId }) },
            (failure) => { console.log("ERROR: FlomioPlugin.addNdefListener: " + failure) },
            "FlomioPlugin", "addNdefListener", []);
    },
}