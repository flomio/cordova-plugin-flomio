"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var exec = require('cordova/exec');
var ndef = require("ndef-lib");
function init(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'init', []);
}
exports.init = init;
function setConfiguration(configuration, success, failure) {
    exec(success, failure, 'FlomioPlugin', 'setConfiguration', [configuration]);
}
exports.setConfiguration = setConfiguration;
function getConfiguration(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'getConfiguration', []);
}
exports.getConfiguration = getConfiguration;
function stopReaders(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'stopReaders', []);
}
exports.stopReaders = stopReaders;
function sleepReaders(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'sleepReaders', []);
}
exports.sleepReaders = sleepReaders;
function startReaders(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'startReaders', []);
}
exports.startReaders = startReaders;
// Configure to only connect to a device with a specific device ID
function selectSpecificDeviceId(specificDeviceId, success, failure) {
    exec(success, failure, 'FlomioPlugin', 'selectSpecificDeviceId', [specificDeviceId]);
}
exports.selectSpecificDeviceId = selectSpecificDeviceId;
function sendApdu(deviceId, apdu, success, failure) {
    if (deviceId == null) {
        throw new ReferenceError('`deviceId` parameter is `null`');
    }
    if (apdu == null) {
        throw new ReferenceError('`apdu` parameter is `null`');
    }
    var apduString;
    if (Buffer.isBuffer(apdu)) {
        apduString = apdu.toString('hex');
    }
    if (typeof apdu === 'string') {
        apduString = apdu;
    }
    else {
        throw new ReferenceError('`apdu` parameter needs to be a `Buffer` or a `string`');
    }
    exec(success, failure, 'FlomioPlugin', 'sendApdu', [deviceId, apduString]);
}
exports.sendApdu = sendApdu;
function getBatteryLevel(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'getBatteryLevel', []);
}
exports.getBatteryLevel = getBatteryLevel;
function getCommunicationStatus(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'getCommunicationStatus', []);
}
exports.getCommunicationStatus = getCommunicationStatus;
function writeNdef(deviceId, ndefMessage, success, failure) {
    var encoded = ndef.encodeMessage(ndefMessage);
    var tlvEncoded = ndef.tlvEncodeNdef(encoded);
    this.write(deviceId, tlvEncoded, success, failure);
}
exports.writeNdef = writeNdef;
function write(deviceId, data, success, failure) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var encoded, apduArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof data === 'string') {
                        encoded = Buffer.from(this.removeSpaces(data), 'hex');
                    }
                    if (Buffer.isBuffer(data)) {
                        encoded = data;
                    }
                    if (!(encoded instanceof Buffer)) {
                        throw new ReferenceError('`data` parameter needs to be a `Buffer` or a `string`');
                    }
                    apduArray = ndef.createWriteApdus('mifareUltralight', encoded);
                    return [4 /*yield*/, Promise.all(apduArray.map(function (apdu) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.sendApduWithPromise(deviceId, apdu.toString('hex'))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })).then(function () {
                            success('Tag written successfully');
                        }).catch(function () {
                            failure(new Error('Tag not written successfully'));
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.write = write;
function launchNativeNfc(success, failure) {
    function hexToBytes(hex) {
        var bytes = [];
        for (var c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;
    }
    function formatRecord(record) {
        var formatted = ndef.record(record.tnf, hexToBytes(record.type), hexToBytes(record.id), hexToBytes(record.payload));
        return formatted;
    }
    exec(function (ndefMessage) {
        success(ndefMessage.map(formatRecord));
    }, failure, 'FlomioPlugin', 'launchNativeNfc', []);
}
exports.launchNativeNfc = launchNativeNfc;
function readNdef(deviceId, success, failure) {
    return __awaiter(this, void 0, void 0, function () {
        var capabilityContainer, numberOfPages, length_1, numberOfBytes, parser, messages, page, n, apdu, response, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.readCapabilityContainer(deviceId)];
                case 1:
                    capabilityContainer = _a.sent();
                    capabilityContainer = util.removeSpaces(capabilityContainer);
                    if (capabilityContainer.substring(0, 2) === 'E1') {
                        length_1 = parseInt(capabilityContainer.substring(4, 6), 16);
                        numberOfBytes = length_1 * 8;
                        numberOfPages = numberOfBytes / 4;
                        // E1 00 byteSize (divided by 8) 00... eg E1 10 06 00 = 48 bytes
                        // length * 8 = number of bytes
                        // number of bytes / 4 = number of pages
                    }
                    else if (capabilityContainer.substr(capabilityContainer.length - 4) !== '9000') {
                        failure(new Error('Tag Removed'));
                        return [2 /*return*/];
                    }
                    else {
                        failure(new Error('Capability Container not formatted correctly'));
                        return [2 /*return*/];
                    }
                    parser = new ndef.PushParser();
                    messages = [];
                    parser.on('record', function (record) {
                        messages.push(record);
                    });
                    parser.once('messageEnd', function () {
                        success(messages);
                    });
                    parser.once('skipping', function () {
                        failure(new Error('Tag is not NDEF formatted'));
                    });
                    page = 4;
                    _a.label = 2;
                case 2:
                    if (!(page <= numberOfPages)) return [3 /*break*/, 5];
                    if (parser.finishedMessage()) {
                        return [3 /*break*/, 5];
                    }
                    n = '';
                    page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16);
                    apdu = 'FFB000' + n + '10';
                    return [4 /*yield*/, this.sendApduWithPromise(deviceId, apdu)];
                case 3:
                    response = _a.sent();
                    buffer = util.responseToBuffer(response);
                    parser.push(buffer);
                    _a.label = 4;
                case 4:
                    page += 4;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.readNdef = readNdef;
// Delegate/Event Listeners
function addConnectedDevicesListener(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'setConnectedDevicesUpdateCallback', []);
}
exports.addConnectedDevicesListener = addConnectedDevicesListener;
function addTagStatusChangeListener(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'setTagStatusChangeCallback', []);
}
exports.addTagStatusChangeListener = addTagStatusChangeListener;
function addTagDiscoveredListener(success, failure) {
    exec(success, failure, 'FlomioPlugin', 'setTagDiscoveredCallback', []);
}
exports.addTagDiscoveredListener = addTagDiscoveredListener;
// Private Methods
function readPage(deviceId, page) {
    return __awaiter(this, void 0, void 0, function () {
        var n, apdu;
        return __generator(this, function (_a) {
            n = '';
            page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16);
            apdu = 'FFB000' + n + '10';
            return [2 /*return*/, this.sendApduWithPromise(deviceId, apdu)];
        });
    });
}
exports.readPage = readPage;
function readCapabilityContainer(deviceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.readPage(deviceId, 3)];
        });
    });
}
exports.readCapabilityContainer = readCapabilityContainer;
function checkIfTagFormatted() {
    return __awaiter(this, void 0, void 0, function () {
        var capabilityContainer, currentTagSizeString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.readCapabilityContainer()];
                case 1:
                    capabilityContainer = _a.sent();
                    if (capabilityContainer.slice(0, 2) === 'E1') {
                        currentTagSizeString = capabilityContainer.slice(4, 6);
                        // console.log('currentTagSize: ' + currentTagSizeString + ' * 8')
                        return [2 /*return*/, true];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function sendApduWithPromise(deviceId, apdu) {
    return new Promise(function (resolve, reject) {
        sendApdu(deviceId, apdu, function (response) {
            if (response.substr(response.length - 5) !== '90 00') {
                reject('Tag was removed or there was an attempt to read/write to an unavailable page');
                return;
            }
            resolve(response);
        }, function () {
            reject('Tag was removed or there was an attempt to read/write to an unavailable page');
        });
    });
}
exports.sendApduWithPromise = sendApduWithPromise;
var util = {
    responseToBuffer: function (response) {
        response = util.removeSpaces(response);
        response = response.slice(0, -4);
        return Buffer.from(response, 'hex');
    },
    removeSpaces: function (stringWithSpaces) {
        return stringWithSpaces.replace(/\s/g, '');
    }
};
var CommunicationStatus;
(function (CommunicationStatus) {
    CommunicationStatus[CommunicationStatus["Scanning"] = 0] = "Scanning";
    CommunicationStatus[CommunicationStatus["Connected"] = 1] = "Connected";
    CommunicationStatus[CommunicationStatus["Disconnected"] = 2] = "Disconnected";
})(CommunicationStatus = exports.CommunicationStatus || (exports.CommunicationStatus = {}));
var PowerOperation;
(function (PowerOperation) {
    PowerOperation[PowerOperation["AutoPollingControl"] = 0] = "AutoPollingControl";
    PowerOperation[PowerOperation["BluetoothConnectionControl"] = 1] = "BluetoothConnectionControl";
})(PowerOperation = exports.PowerOperation || (exports.PowerOperation = {}));
var TagStatus;
(function (TagStatus) {
    TagStatus[TagStatus["NotPresent"] = 0] = "NotPresent";
    TagStatus[TagStatus["Present"] = 1] = "Present";
    TagStatus[TagStatus["ReadingData"] = 2] = "ReadingData";
})(TagStatus = exports.TagStatus || (exports.TagStatus = {}));
module.exports.ndef = ndef;
module.exports.util = ndef.util;
