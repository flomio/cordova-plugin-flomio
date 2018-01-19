import { Injectable } from '@angular/core';
import { Plugin, Cordova, IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs/Observable';
declare let window: any;

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

export enum CommunicationStatus {
  Scanning,
  Connected,
  Disconnected
}

export enum PowerOperation {
  AutoPollingControl,
  BluetoothConnectionControl
}

export enum TagStatus {
  NotPresent,
  Present,
  ReadingData
}

export interface IRecord {
  tnf: number;
  type: any | string;
  id: any;
  payload: any;
  value?: string;
}
export declare type IMessage = IRecord[];


@Plugin({
  pluginName: 'FlomioPlugin',
  plugin: 'cordova-plugin-flomio',
  pluginRef: 'flomioPlugin',
  repo: 'https://github.com/flomio/cordova-plugin-flomio',
  platforms: ['iOS']
})

@Injectable()
export class FlomioPlugin extends IonicNativePlugin {

  @Cordova()
  init(): Promise<any> {
    return;
  }

  @Cordova()
  setConfiguration(configuration: DeviceConfiguration): Promise<any> {
    return;
  }

  @Cordova()
  getConfiguration(): Promise<DeviceConfiguration> {
    return;
  }

  @Cordova()
  startReaders(): Promise<any> {
    return;
  }

  @Cordova()
  stopReaders(): Promise<any> {
    return;
  }

  @Cordova()
  sleepReaders(): Promise<any> {
    return;
  }

  @Cordova()
  selectSpecificDeviceId(specificDeviceId: string): Promise<any> {
    return;
  }

  @Cordova()
  sendApdu(deviceId: string, apdu: any): Promise<string> {
    return;
  }

  @Cordova()
  getBatteryLevel(): Promise<number> {
    return;
  }

  @Cordova()
  getCommunicationStatus(): Promise<CommunicationStatus> {
    return;
  }

  @Cordova()
  writeNdef(deviceId: string, ndefMessage: any): Promise<string> {
    return;
  }

  @Cordova()
  write(deviceId: string, data: any): Promise<string> {
    return;
  }

  @Cordova()
  launchNativeNfc(): Promise<any> {
    return;
  }

  @Cordova()
  readNdef(deviceId: string): Promise<any> {
    return;
  }

  @Cordova({
    observable: true
  })
  addConnectedDevicesListener(): Observable<DeviceInfo> {
    return;
  }

  @Cordova({
    observable: true
  })
  addTagStatusChangeListener(): Observable<TagStatus> {
    return;
  }

  @Cordova({
    observable: true
  })
  addTagDiscoveredListener(): Observable<Tag> {
    return;
  }
}

@Plugin({
  pluginName: 'FlomioPlugin',
  plugin: 'flomio_cordova_plugin',
  pluginRef: 'flomioPlugin.ndef'
})
@Injectable()
export class Ndef extends IonicNativePlugin {
  @Cordova({ sync: true })
  textRecord(text: any, languageCode?: any, id?: any): IRecord  { return; }

  @Cordova({ sync: true })
  uriRecord(uri: any, id?: any): IRecord { return; }

  @Cordova({ sync: true })
  record(tnf: number, type: number[] | string, id: number[] | string, payload: number[] | string): IRecord { return; }

  @Cordova({ sync: true })
  absoluteUriRecord(uri: any, payload: any, id?: any): IRecord { return; }

  @Cordova({ sync: true })
  mimeMediaRecord(mimeType: any, payload: any, id?: any): IRecord { return; }

  @Cordova({ sync: true })
  smartPoster(ndefRecords: any, id?: any): IRecord { return; }

  @Cordova({ sync: true })
  emptyRecord(): IRecord { return; }

  @Cordova({ sync: true })
  androidApplicationRecord(packageName: string): IRecord { return; }

  @Cordova({ sync: true })
  encodeMessage(ndefRecords: any): any { return; }

  @Cordova({ sync: true })
  decodeMessage(bytes: any): any { return; }

  @Cordova({ sync: true })
  docodeTnf(tnf_byte: any): any { return; }

  @Cordova({ sync: true })
  encodeTnf(mb: any, me: any, cf: any, sr: any, il: any, tnf: any): any { return; }

  @Cordova({ sync: true })
  tnfToString(tnf: any): string { return; }
}
