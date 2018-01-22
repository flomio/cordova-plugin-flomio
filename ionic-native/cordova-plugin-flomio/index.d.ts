/// <reference types="node" />
import { IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs/Observable';
export interface DeviceInfo {
    deviceId: string;
    batteryLevel: number;
    hardwareRevision: string;
    firmwareRevision: string;
    communicationStatus: number;
}
export interface DeviceConfiguration {
    deviceType: string;
    powerOperation: PowerOperation;
}
export interface Tag {
    uid: string;
    atr: string;
}
export declare enum CommunicationStatus {
    Scanning = 0,
    Connected = 1,
    Disconnected = 2,
}
export declare enum PowerOperation {
    AutoPollingControl = 0,
    BluetoothConnectionControl = 1,
}
export declare enum TagStatus {
    NotPresent = 0,
    Present = 1,
    ReadingData = 2,
}
export interface IRecord {
    tnf: number;
    type: Buffer | string;
    id: Buffer;
    payload: Buffer;
    value?: string;
}
export declare type IMessage = IRecord[];
export declare class FlomioPlugin extends IonicNativePlugin {
    init(): Promise<any>;
    setConfiguration(configuration: DeviceConfiguration): Promise<any>;
    getConfiguration(): Promise<DeviceConfiguration>;
    startReaders(): Promise<any>;
    stopReaders(): Promise<any>;
    sleepReaders(): Promise<any>;
    selectSpecificDeviceId(specificDeviceId: string): Promise<any>;
    sendApdu(deviceId: string, apdu: Buffer | string): Promise<string>;
    getBatteryLevel(): Promise<number>;
    getCommunicationStatus(): Promise<CommunicationStatus>;
    writeNdef(deviceId: string, ndefMessage: IMessage): Promise<string>;
    write(deviceId: string, data: Buffer | string): Promise<string>;
    launchNativeNfc(): Promise<IMessage>;
    readNdef(deviceId: string): Promise<IMessage>;
    addConnectedDevicesListener(): Observable<DeviceInfo>;
    addTagStatusChangeListener(): Observable<TagStatus>;
    addTagDiscoveredListener(): Observable<Tag>;
}
export declare class Ndef extends IonicNativePlugin {
    textRecord(text: any, languageCode?: any, id?: any): IRecord;
    uriRecord(uri: any, id?: any): IRecord;
    record(tnf: number, type: number[] | string, id: number[] | string, payload: number[] | string): IRecord;
    absoluteUriRecord(uri: any, payload: any, id?: any): IRecord;
    mimeMediaRecord(mimeType: any, payload: any, id?: any): IRecord;
    smartPoster(ndefRecords: any, id?: any): IRecord;
    emptyRecord(): IRecord;
    androidApplicationRecord(packageName: string): IRecord;
    encodeMessage(ndefRecords: any): any;
    decodeMessage(bytes: any): any;
    decodeTnf(tnf_byte: any): any;
    encodeTnf(mb: any, me: any, cf: any, sr: any, il: any, tnf: any): any;
    tnfToString(tnf: any): string;
}
