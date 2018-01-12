var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Plugin, Cordova, IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs/Observable';
export var CommunicationStatus;
(function (CommunicationStatus) {
    CommunicationStatus[CommunicationStatus["Scanning"] = 0] = "Scanning";
    CommunicationStatus[CommunicationStatus["Connected"] = 1] = "Connected";
    CommunicationStatus[CommunicationStatus["Disconnected"] = 2] = "Disconnected";
})(CommunicationStatus || (CommunicationStatus = {}));
export var PowerOperation;
(function (PowerOperation) {
    PowerOperation[PowerOperation["AutoPollingControl"] = 0] = "AutoPollingControl";
    PowerOperation[PowerOperation["BluetoothConnectionControl"] = 1] = "BluetoothConnectionControl";
})(PowerOperation || (PowerOperation = {}));
export var TagStatus;
(function (TagStatus) {
    TagStatus[TagStatus["NotPresent"] = 0] = "NotPresent";
    TagStatus[TagStatus["Present"] = 1] = "Present";
    TagStatus[TagStatus["ReadingData"] = 2] = "ReadingData";
})(TagStatus || (TagStatus = {}));
var FlomioPlugin = (function (_super) {
    __extends(FlomioPlugin, _super);
    function FlomioPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlomioPlugin.prototype.init = function () {
        return;
    };
    FlomioPlugin.prototype.setConfiguration = function (configuration) {
        return;
    };
    FlomioPlugin.prototype.getConfiguration = function () {
        return;
    };
    FlomioPlugin.prototype.startReaders = function () {
        return;
    };
    FlomioPlugin.prototype.stopReaders = function () {
        return;
    };
    FlomioPlugin.prototype.sleepReaders = function () {
        return;
    };
    FlomioPlugin.prototype.selectSpecificDeviceId = function (specificDeviceId) {
        return;
    };
    FlomioPlugin.prototype.sendApdu = function (deviceId, apdu) {
        return;
    };
    FlomioPlugin.prototype.getBatteryLevel = function () {
        return;
    };
    FlomioPlugin.prototype.getCommunicationStatus = function () {
        return;
    };
    FlomioPlugin.prototype.writeNdef = function (deviceId, ndefMessage) {
        return;
    };
    FlomioPlugin.prototype.write = function (deviceId, buffer) {
        return;
    };
    FlomioPlugin.prototype.launchNativeNfc = function () {
        return;
    };
    FlomioPlugin.prototype.readNdef = function (deviceId) {
        return;
    };
    FlomioPlugin.prototype.addConnectedDevicesListener = function () {
        return;
    };
    FlomioPlugin.prototype.addTagStatusChangeListener = function () {
        return;
    };
    FlomioPlugin.prototype.addTagDiscoveredListener = function () {
        return;
    };
    FlomioPlugin.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FlomioPlugin.ctorParameters = function () { return []; };
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "init", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "setConfiguration", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "getConfiguration", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "startReaders", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "stopReaders", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "sleepReaders", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "selectSpecificDeviceId", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String]),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "sendApdu", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "getBatteryLevel", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "getCommunicationStatus", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "writeNdef", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "write", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "launchNativeNfc", null);
    __decorate([
        Cordova(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], FlomioPlugin.prototype, "readNdef", null);
    __decorate([
        Cordova({
            observable: true
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Observable)
    ], FlomioPlugin.prototype, "addConnectedDevicesListener", null);
    __decorate([
        Cordova({
            observable: true
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Observable)
    ], FlomioPlugin.prototype, "addTagStatusChangeListener", null);
    __decorate([
        Cordova({
            observable: true
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Observable)
    ], FlomioPlugin.prototype, "addTagDiscoveredListener", null);
    FlomioPlugin = __decorate([
        Plugin({
            pluginName: 'FlomioPlugin',
            plugin: 'flomio_cordova_plugin',
            pluginRef: 'flomioPlugin',
            repo: 'https://github.com/flomio/flomio_cordova_plugin',
            platforms: ['iOS']
        })
    ], FlomioPlugin);
    return FlomioPlugin;
}(IonicNativePlugin));
export { FlomioPlugin };
var Ndef = (function (_super) {
    __extends(Ndef, _super);
    function Ndef() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ndef.prototype.textRecord = function (text, languageCode, id) { return; };
    Ndef.prototype.uriRecord = function (uri, id) { return; };
    Ndef.prototype.record = function (tnf, type, id, payload) { return; };
    Ndef.prototype.absoluteUriRecord = function (uri, payload, id) { return; };
    Ndef.prototype.mimeMediaRecord = function (mimeType, payload, id) { return; };
    Ndef.prototype.smartPoster = function (ndefRecords, id) { return; };
    Ndef.prototype.emptyRecord = function () { return; };
    Ndef.prototype.androidApplicationRecord = function (packageName) { return; };
    Ndef.prototype.encodeMessage = function (ndefRecords) { return; };
    Ndef.prototype.decodeMessage = function (bytes) { return; };
    Ndef.prototype.docodeTnf = function (tnf_byte) { return; };
    Ndef.prototype.encodeTnf = function (mb, me, cf, sr, il, tnf) { return; };
    Ndef.prototype.tnfToString = function (tnf) { return; };
    Ndef.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Ndef.ctorParameters = function () { return []; };
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "textRecord", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "uriRecord", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number, Object, Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "record", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "absoluteUriRecord", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "mimeMediaRecord", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "smartPoster", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "emptyRecord", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "androidApplicationRecord", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "encodeMessage", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "decodeMessage", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "docodeTnf", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object]),
        __metadata("design:returntype", Object)
    ], Ndef.prototype, "encodeTnf", null);
    __decorate([
        Cordova({ sync: true }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", String)
    ], Ndef.prototype, "tnfToString", null);
    Ndef = __decorate([
        Plugin({
            pluginName: 'FlomioPlugin',
            plugin: 'flomio_cordova_plugin',
            pluginRef: 'flomioPlugin.ndef'
        })
    ], Ndef);
    return Ndef;
}(IonicNativePlugin));
export { Ndef };
//# sourceMappingURL=index.js.map