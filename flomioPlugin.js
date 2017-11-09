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
var ndef = require('ndef');
var ndef_lib_1 = require("ndef-lib");
function noop() {
    // empty
}
var Device = (function () {
    function Device(deviceId, batteryLevel, hardwareRevision, firmwareRevision, communicationStatus) {
        this.deviceId = deviceId;
        this.batteryLevel = batteryLevel;
        this.firmwareRevision = firmwareRevision;
        this.hardwareRevision = hardwareRevision;
        this.communicationStatus = communicationStatus;
    }
    return Device;
}());
exports.Device = Device;
var devices = [];
/**
 * Constructor
 */
module.exports = {
    init: function (success, failure) {
        exec(success, failure, 'FlomioPlugin', 'init', []);
    },
    selectDeviceType: function (deviceType, success, failure) {
        exec(success, failure, 'FlomioPlugin', 'selectDeviceType', [deviceType]);
        // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
        // "FloBLE-Plus" (case insensitive)
    },
    selectSpecificDeviceId: function (specificDeviceId, success, failure) {
        exec(success, failure, 'FlomioPlugin', 'selectSpecificDeviceId', [specificDeviceId]);
        // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
        // "FloBLE-Plus" (case insensitive)
    },
    setConfiguration: function (configurationDictionary, success, failure) {
        var configurationArray = [];
        var keyArray = ['scanPeriod', 'scanSound', 'readerState', 'powerOperation'];
        // convert dictionary to array
        for (var index in keyArray) {
            if (typeof configurationDictionary[keyArray[index]] === 'undefined') {
                configurationArray.push('unchanged');
            }
            else {
                configurationArray.push(configurationDictionary[keyArray[index]]);
            }
        }
        exec(success, failure, 'FlomioPlugin', 'setConfiguration', configurationArray);
    },
    getConfiguration: function (resultCallback, configurationDictionary, success, failure) {
        exec(function (scanPeriod, scanSound) {
            resultCallback({ scanPeriod: scanPeriod, scanSound: scanSound });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.getConfiguration: ' + failure);
        }, 'FlomioPlugin', 'getConfiguration', []);
    },
    stopReaders: function (resultCallback, success, failure) {
        exec(
        // TODO: deviceId
        function (scanPeriod, scanSound) {
            resultCallback({ deviceId: undefined });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.stopReaders: ' + failure);
        }, 'FlomioPlugin', 'stopReaders', []);
    },
    sleepReaders: function (resultCallback, success, failure) {
        exec(noop, function (failure) {
            console.log('ERROR: FlomioPlugin.sleepReaders: ' + failure);
        }, 'FlomioPlugin', 'sleepReaders', []);
    },
    startReaders: function (resultCallback, success, failure) {
        exec(noop, function (failure) {
            console.log('ERROR: FlomioPlugin.startReaders: ' + failure);
        }, 'FlomioPlugin', 'startReaders', []);
    },
    sendApdu: function (resultCallback, deviceId, apdu, success, failure) {
        console.log('in send apdu: ' + apdu + ' device: ' + deviceId);
        return new Promise(function (resolve, reject) {
            exec(function (deviceId, responseApdu) {
                console.log('In response apdu: ' + responseApdu);
                resolve(responseApdu);
                resultCallback({ deviceId: deviceId, responseApdu: responseApdu });
            }, function (failure) {
                console.log('ERROR: FlomioPlugin.sendApdu: ' + failure);
            }, 'FlomioPlugin', 'sendApdu', [deviceId, apdu]);
        });
    },
    // Delegate/Event Listeners
    addConnectedDevicesListener: function (resultCallback, success, failure) {
        exec(function (device) {
            // alert(JSON.stringify(device));
            var deviceId = device['Device ID'];
            var batteryLevel = device['Battery Level'];
            var hardwareRevision = device['Hardware Revision'];
            var firmwareRevision = device['Firmware Revision'];
            var communicationStatus = device['Communication Status'];
            var newDevice = new Device(deviceId, batteryLevel, hardwareRevision, firmwareRevision, communicationStatus);
            devices.push(newDevice);
            resultCallback(device);
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addConnectedDevicesListener: ' + failure);
        }, 'FlomioPlugin', 'setConnectedDevicesUpdateCallback', []);
    },
    addTagStatusChangeListener: function (resultCallback, success, failure) {
        exec(function (deviceId, status) {
            resultCallback({ deviceId: deviceId, status: status });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addTagStatusChangeListener: ' + failure);
        }, 'FlomioPlugin', 'setCardStatusChangeCallback', []);
    },
    addTagDiscoveredListener: function (resultCallback, success, failure) {
        exec(function (deviceId, tagUid, tagAtr) {
            resultCallback({ tagUid: tagUid, tagAtr: tagAtr, deviceId: deviceId });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addTagDiscoveredListener: ' + failure);
        }, 'FlomioPlugin', 'setTagDiscoveredCallback', []);
    },
    addNdefListener: function (resultCallback, success, failure) {
        function hexToBytes(hex) {
            var bytes = [];
            for (var c = 0; c < hex.length; c += 2) {
                bytes.push(parseInt(hex.substr(c, 2), 16));
            }
            return bytes;
        }
        function formatRecord(record) {
            console.log('formatRecorde', record);
            // TODO: update ndef module
            var formatted = ndef.record(record.tnf, hexToBytes(record.type), hexToBytes(record.id), hexToBytes(record.payload));
            return formatted;
        }
        exec(function (ndefMessage) {
            console.log('ndefMessage', ndefMessage);
            resultCallback({ ndefMessage: ndefMessage.map(formatRecord) });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addNdefListener: ' + failure);
        }, 'FlomioPlugin', 'setNdefDiscoveredCallback', []);
    },
    writeNdef: function (resultCallback, deviceId, ndefMessage) {
        console.log('writeNdef');
        console.log(deviceId);
        var bytes = ndef.encodeMessage(ndefMessage);
        console.log('bytes' + bytes);
        var hexString = util.bytesToHexString(bytes);
        console.log('hexString' + hexString);
        this.write(resultCallback, deviceId, hexString);
    },
    write: function (resultCallback, deviceId, dataHexString, success, failure) {
        // var apdus = []
        var hex = ndef.tlvEncodeNdef(dataHexString);
        var apduStrings = ndef.makeWriteApdus(hex, 4);
        var fullResponse = '';
        var apdus = [];
        for (var i in apduStrings) {
            // store each sendApdu promise
            console.log(apduStrings[i]);
            apdus.push(this.sendApdu(noop, deviceId, apduStrings[i]).then(function (responseApdu) {
                console.log('response apdu: ' + responseApdu);
                fullResponse = fullResponse.concat(responseApdu.slice(0, -5));
            }, function (err) {
                console.error(err);
            }));
        }
        // send all apdus and capture result
        Promise.all(apdus).then(function () {
            console.log('fullResponse: ' + fullResponse);
        }, function (reason) {
            console.log(reason);
        });
    },
    launchNativeNfc: function (success, failure) {
        // exec(success, failure, 'FlomioPlugin', 'launchNativeNfc', [])
        return new Promise(function (resolve, reject) {
            exec(success, function (failure) {
                reject();
                console.log('ERROR: FlomioPlugin.launchNativeNfc: ' + failure);
            }, 'FlomioPlugin', 'launchNativeNfc', []);
        });
    },
    readNdef: function (resultCallback, deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var fullResponse, apdus, numberOfPages, capabilityContainer, length_1, numberOfBytes, parser, messages, page, n, apdu, response, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullResponse = '';
                        apdus = [];
                        return [4 /*yield*/, this.readCapabilityContainer(devices[0].deviceId)];
                    case 1:
                        capabilityContainer = _a.sent();
                        capabilityContainer = util.removeSpaces(capabilityContainer);
                        if (capabilityContainer.substring(0, 2) === 'E1') {
                            length_1 = parseInt(capabilityContainer.substring(4, 6), 16);
                            console.log('capabilityContainer: ' + capabilityContainer);
                            console.log('length: ' + length_1);
                            numberOfBytes = length_1 * 8;
                            numberOfPages = numberOfBytes / 4;
                            console.log('number of pages: ' + numberOfPages);
                            // E1 00 byteSize (divided by 8) 00... eg E1 10 06 00 = 48 bytes
                            // length * 8 = number of bytes
                            // number of bytes / 4 = number of pages
                        }
                        else {
                            console.log('capabilityContainer not formatted correctly');
                        }
                        parser = new ndef_lib_1.PushParser();
                        messages = [];
                        parser.on('record', function (record) {
                            messages.push(record);
                        });
                        parser.on('messageEnd', function () {
                            console.log('messageEnd');
                            resultCallback({ ndefMessage: messages });
                        });
                        page = 4;
                        _a.label = 2;
                    case 2:
                        if (!(page <= numberOfPages)) return [3 /*break*/, 5];
                        n = '';
                        page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16);
                        apdu = 'FFB000' + n + '10';
                        return [4 /*yield*/, this.sendApdu(noop, devices[0].deviceId, apdu)];
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
    },
    readPage: function (deviceId, page) {
        return __awaiter(this, void 0, void 0, function () {
            var n, apdu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        n = '';
                        page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16);
                        apdu = 'FFB000' + n + '10';
                        console.log('read page: ' + page + ' command APDU: ' + apdu + ' device id: ' + deviceId);
                        return [4 /*yield*/, this.sendApdu(noop, deviceId, apdu)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    readCapabilityContainer: function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('readCapabilityContainer ' + deviceId);
                        return [4 /*yield*/, this.readPage(deviceId, 3)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    determineMaximumTranceiveLength: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userMemory, page, response, totalMemory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = 4;
                        _a.label = 1;
                    case 1:
                        if (!(page < 256)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.readPage(this.deviceId, page)];
                    case 2:
                        response = _a.sent();
                        console.log('determineTagSize response: ' + response + 'page: ' + page);
                        if ((response === '63 00') || (response.length <= 5)) {
                            console.log('size ==' + page);
                            totalMemory = page * this.BYTES_PER_PAGE;
                            userMemory = totalMemory - (this.BYTES_PER_PAGE * 4);
                            console.log('USER MEMORY: ' + userMemory);
                            return [3 /*break*/, 4];
                        }
                        _a.label = 3;
                    case 3:
                        page += 2;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, userMemory];
                }
            });
        });
    },
    formatCapabilityContainer: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userMemory, valueForCapabilityContainer, n, apdu, response, verify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.determineMaximumTranceiveLength()];
                    case 1:
                        userMemory = _a.sent();
                        if (!userMemory) return [3 /*break*/, 4];
                        valueForCapabilityContainer = userMemory / 8;
                        n = '';
                        valueForCapabilityContainer >= 16 ? n = '' + valueForCapabilityContainer.toString(16) : n = '0' + valueForCapabilityContainer.toString(16);
                        apdu = 'FFD6000304' + 'E110' + n + '00';
                        return [4 /*yield*/, this.sendApdu(this.deviceId, apdu)];
                    case 2:
                        response = _a.sent();
                        console.log('response to apdu: ' + apdu + ' response: ' + response);
                        return [4 /*yield*/, this.checkIfTagFormatted()];
                    case 3:
                        verify = _a.sent();
                        console.log('tag formatted' + verify.valueOf);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    checkIfTagFormatted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var capabilityContainer, currentTagSizeString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readCapabilityContainer()];
                    case 1:
                        capabilityContainer = _a.sent();
                        if (capabilityContainer.slice(0, 2) === 'E1') {
                            currentTagSizeString = capabilityContainer.slice(4, 6);
                            console.log('currentTagSize: ' + currentTagSizeString + ' * 8');
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
};
// export function tlvEncodeNdef (message: Buffer) {
//   // Add the ndef message type
//   const buffers: Buffer[] = [new Buffer([0x03])]
//   const length = message.length
//   if (length <= 0xFE) {
//     buffers.push(new Buffer([length]))
//   } else {
//     const length = Buffer.alloc(3)
//     length.writeUInt8(0xff, 0)
//     length.writeUInt16BE(message.length, 1)
//     buffers.push(length)
//   }
//   buffers.push(message)
//   // Add the terminator
//   buffers.push(new Buffer([0xFE]))
//   return Buffer.concat(buffers)
// }
// export function createWriteApdus (tagType: string, data: Buffer) {
//   assert.equal(tagType, 'mifareUltralight')
//   const slices = makeSlices(data, 4)
//   const userDataPageStarts = 4 //
//   return slices.map((slice, ix) => {
//     if (slice.length < 4) {
//       slice = Buffer.concat([slice, Buffer.alloc(4 - slice.length)])
//     }
//     return Buffer.concat([
//       new Buffer([0xFF, 0xD6, 0x00, userDataPageStarts + ix, 4]),
//       slice
//     ])
//   })
//     .map(b => b.toString('hex'))
// }
/**
 * See
 * https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js
 * Below is from Phonegap-nfc to encode and decode ndef messages
 */
ndef.makeWriteApdus = function (dataHexString) {
    var sliceSize = 8;
    var slices = textHelper.makeSlices(dataHexString, sliceSize);
    var apdusStrings = slices.map(function (slice, i) {
        slice = slice.padEnd(sliceSize, '0'); // pads end of string if not 'sliceSize' chars long
        var page = i + 4;
        var n = page.toString(16);
        n = n.padStart(2, '0');
        var apdu = 'FFD600' + n + '04' + slice;
        return apdu;
    });
    return apdusStrings;
};
ndef.tlvEncodeNdef = function (message) {
    // Add the ndef message type
    console.log('tlvEncodeNdef');
    var ndefType = '03';
    var length = message.length / 2;
    var lengthString = length.toString(16);
    lengthString = lengthString.padStart(2, '0');
    // Add the ndef message terminator
    var terminator = 'FE';
    console.log('ndefType + length + message + terminator' + ndefType + lengthString + message + terminator);
    return ndefType + lengthString + message + terminator;
};
var util = {
    // i must be <= 256
    toHex: function (i) {
        var hex;
        if (i < 0) {
            i += 256;
        }
        hex = i.toString(16);
        // zero padding
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    },
    toPrintable: function (i) {
        if (i >= 0x20 && i <= 0x7F) {
            return String.fromCharCode(i);
        }
        else {
            return '.';
        }
    },
    bytesToString: function (bytes) {
        // based on
        // http://ciaranj.blogspot.fr/2007/11/utf8-characters-encoding-in-javascript.html
        var result = '';
        var i;
        var c;
        var c1;
        var c2;
        var c3;
        i = c = c1 = c2 = c3 = 0;
        // Perform byte-order check.
        if (bytes.length >= 3) {
            if ((bytes[0] & 0xef) === 0xef && (bytes[1] & 0xbb) === 0xbb && (bytes[2] & 0xbf) === 0xbf) {
                // stream has a BOM at the start, skip over
                i = 3;
            }
        }
        while (i < bytes.length) {
            c = bytes[i] & 0xff;
            if (c < 128) {
                result += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                if (i + 1 >= bytes.length) {
                    throw new Error('Un-expected encoding error, UTF-8 stream truncated, or incorrect');
                }
                c2 = bytes[i + 1] & 0xff;
                result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                if (i + 2 >= bytes.length || i + 1 >= bytes.length) {
                    throw new Error('Un-expected encoding error, UTF-8 stream truncated, or incorrect');
                }
                c2 = bytes[i + 1] & 0xff;
                c3 = bytes[i + 2] & 0xff;
                result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return result;
    },
    stringToBytes: function (str) {
        // based on
        // http://ciaranj.blogspot.fr/2007/11/utf8-characters-encoding-in-javascript.html
        var bytes = [];
        for (var n = 0; n < str.length; n++) {
            var c = str.charCodeAt(n);
            if (c < 128) {
                bytes[bytes.length] = c;
            }
            else if ((c > 127) && (c < 2048)) {
                bytes[bytes.length] = (c >> 6) | 192;
                bytes[bytes.length] = (c & 63) | 128;
            }
            else {
                bytes[bytes.length] = (c >> 12) | 224;
                bytes[bytes.length] = ((c >> 6) & 63) | 128;
                bytes[bytes.length] = (c & 63) | 128;
            }
        }
        return bytes;
    },
    hexStringToPrintableText: function (payload) {
        var hex = payload.toString(); // force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },
    bytesToHexString: function (bytes) {
        var dec;
        var hexstring;
        var bytesAsHexString = '';
        for (var i = 0; i < bytes.length; i++) {
            if (bytes[i] >= 0) {
                dec = bytes[i];
            }
            else {
                dec = 256 + bytes[i];
            }
            hexstring = dec.toString(16);
            // zero padding
            if (hexstring.length === 1) {
                hexstring = '0' + hexstring;
            }
            bytesAsHexString += hexstring;
        }
        return bytesAsHexString;
    },
    // This function can be removed if record.type is changed to a String
    /**
     * Returns true if the record's TNF and type matches the supplied TNF and
     * type.
     *
     * @record NDEF record
     * @tnf 3-bit TNF (Type Name Format) - use one of the TNF_* constants
     * @type byte array or String
     */
    isType: function (record, tnf, type) {
        if (record.tnf === tnf) {
            var recordType = void 0;
            if (typeof (type) === 'string') {
                recordType = type;
            }
            else {
                recordType = util.bytesToString(type);
            }
            return (util.bytesToString(record.type) === recordType);
        }
        return false;
    },
    responseToBuffer: function (response) {
        response = util.removeSpaces(response);
        response = response.slice(0, -4);
        return Buffer.from(response, 'hex');
    },
    removeSpaces: function (stringWithSpaces) {
        return stringWithSpaces.replace(/\s/g, '');
    }
};
// this is a module in ndef-js
var textHelper = {
    decodePayload: function (data) {
        var languageCodeLength = (data[0] & 0x3F); // 6 LSBs
        var languageCode = data.slice(1, 1 + languageCodeLength);
        var utf16 = (data[0] & 0x80) !== 0; // assuming UTF-16BE
        // TODO need to deal with UTF in the future
        // console.log("lang " + languageCode + (utf16 ? " utf16" : " utf8"));
        return util.bytesToString(data.slice(languageCodeLength + 1));
    },
    // encode text payload
    // @returns an array of bytes
    encodePayload: function (text, lang, encoding) {
        // ISO/IANA language code, but we're not enforcing
        if (!lang) {
            lang = 'en';
        }
        var encoded = util.stringToBytes(lang + text);
        encoded.unshift(lang.length);
        return encoded;
    },
    makeSlices: function (data, pageSize) {
        var result = [];
        for (var i = 0; i < data.length; i += pageSize) {
            result.push(data.slice(i, i + pageSize));
        }
        return result;
    }
};
var BYTES_PER_PAGE = 4;
var deviceId = ''; // reference to first connected device
// this is a module in ndef-js
var uriHelper = {
    // URI identifier codes from URI Record Type Definition
    // NFCForum-TS-RTD_URI_1.0 2006-07-24 index in array matches code in the spec
    protocols: ['', 'http://www.', 'https://www.', 'http://', 'https://', 'tel:', 'mailto:', 'ftp://anonymous:anonymous@', 'ftp://ftp.', 'ftps://', 'sftp://', 'smb://', 'nfs://', 'ftp://', 'dav://', 'news:', 'telnet://', 'imap:', 'rtsp://', 'urn:', 'pop:', 'sip:', 'sips:', 'tftp:', 'btspp://', 'btl2cap://', 'btgoep://', 'tcpobex://', 'irdaobex://', 'file://', 'urn:epc:id:', 'urn:epc:tag:', 'urn:epc:pat:', 'urn:epc:raw:', 'urn:epc:', 'urn:nfc:'],
    // decode a URI payload bytes
    // @returns a string
    decodePayload: function (data) {
        var prefix = uriHelper.protocols[data[0]];
        if (!prefix) {
            prefix = '';
        }
        return prefix + util.bytesToString(data.slice(1));
    },
    // shorten a URI with standard prefix
    // @returns an array of bytes
    encodePayload: function (uri) {
        var prefix;
        var protocolCode;
        var encoded;
        // check each protocol, unless we've found a match
        // "urn:" is the one exception where we need to keep checking
        // slice so we don't check ""
        uriHelper.protocols.slice(1).forEach(function (protocol) {
            if ((!prefix || prefix === 'urn:') && uri.indexOf(protocol) === 0) {
                prefix = protocol;
            }
        });
        if (!prefix) {
            prefix = '';
        }
        encoded = util.stringToBytes(uri.slice(prefix.length));
        protocolCode = uriHelper.protocols.indexOf(prefix);
        // prepend protocol code
        encoded.unshift(protocolCode);
        return encoded;
    }
};
module.exports.ndef = ndef;
module.exports.util = util;
// textHelper and uriHelper aren't exported, add a property
ndef.uriHelper = uriHelper;
ndef.textHelper = textHelper;
// create aliases
// util.bytesToString = util.bytesToString;
// util.stringToBytes = util.stringToBytes;
// util.bytesToHexString = util.bytesToHexString;
