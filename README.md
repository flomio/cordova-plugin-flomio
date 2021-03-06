# Cordova-Plugin-Flomio

Flomio's plugin for Cordova, for use with v2.3 of the Flomio iOS SDK.
This plugin is only supported for the FloBLE Plus or FloBLE Micro

## Contents

* [Installation](#installation)
* [Example](#example)
* [API](#api)
  - [init](#init)
  - [setConfiguration](#setconfiguration)
  - [getConfiguration](#getConfiguration)
  - [startReaders](#startreaders)
  - [stopReaders](#stopreaders)
  - [sleepReaders](#sleepreaders)
  - [selectSpecificDeviceId](#selectspecificdeviceid)
  - [sendApdu](#sendapdu)
  - [getBatteryLevel](#getbatterylevel)
  - [getCommunicationStatus](#getcommunicationstatus)
  - [writeNdef](#writendef)
  - [write](#write)
  - [launchNativeNfc](#launchnativenfc)
  - [readNdef](#readndef)
  - [addConnectedDevicesListener](#addconnecteddeviceslistener)
  - [addTagDiscoveredListener](#addtagdiscoveredlistener)
  - [addTagStatusChangeListener](#addtagstatuschangelistener)

* [Tag](#tag)
* [TagStatus](#tagstatus)
* [DeviceInfo](#deviceinfo)
* [DeviceConfiguration](#deviceconfiguration)
* [PowerOperation](#poweroperation)
* [CommunicationStatus](#communicationstatus)

- [NDEF](#ndef)
    - [IRecord](#irecord)
    - [IMessage](#imessage)
    
* [Add Pro SDK for Offline usage](#add-pro-sdk-for-offline-usage)
* [Use with Ionic](#use-with-ionic)

# Installation

Download and install [Node](https://nodejs.org/en/download/) plus the Cordova CLI
```bash
$ sudo npm install -g cordova
```

Create your Cordova example app:

```bash
$ cordova create hello com.example.hello HelloWorld 
```

Add the plugin to it:

```bash
$ cordova plugin add https://github.com/flomio/cordova-plugin-flomio#<latest-commit-code>
```

# Example

```javascript
const deviceConfiguration = {
    powerOperation: flomioPlugin.PowerOperation.AutoPollingControl, 
    deviceType: 'floble-plus'
}
flomioPlugin.setConfiguration(deviceConfiguration)
flomioPlugin.init()
flomioPlugin.addConnectedDevicesListener(this.flomioConnectedDevicesListener.bind(this))
flomioPlugin.addTagDiscoveredListener(this.flomioTagDiscovered.bind(this))
```

Prepare the app:
```bash
$ cordova platform add ios
$ cordova prepare
```

Open the generated Xcode project:
```bash
$ open platforms/ios/*.xcodeproj
```

Add your provisioning profile and signing identity and then build and run the app on an iOS device.

# API

## init
Initializes the plugin and begins a session. 
To configure the session, use [setConfiguration](##set-configuration) before initialization.

```javascript
    flomioPlugin.init([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that is called if init was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## setConfiguration
Configures the current session. Changes the device type and power operation.

```javascript
const deviceConfiguration = {
    powerOperation: flomioPlugin.PowerOperation.AutoPollingControl, 
    deviceType: 'floble-plus'
}
flomioPlugin.setConfiguration(deviceConfiguration)
```
### Parameters
- __deviceConfiguration__:  [DeviceConfiguration](#deviceconfiguration)	

## getConfiguration
Returns the current configuration of the session.

```javascript
    flomioPlugin.getConfiguration([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that returns the [DeviceConfiguration](#deviceconfiguration)	object.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## startReaders
Starts the readers after they has been stopped with [StopReaders](#stopreaders) or [SleepReaders](#sleepreaders).

```javascript 
   flomioPlugin.startReaders([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that is called if startReaders was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## stopReaders
Stops the readers.
Depending on the [PowerOperation](#poweroperation) configuration the readers either stop scanning or disconnect from bluetooth.

```javascript
    flomioPlugin.stopReaders([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that is called if stopReaders was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## sleepReaders
Stops the reader from polling and will set the reader to sleep after 60 seconds during future use.

```javascript
    flomioPlugin.sleepReaders([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that is called if sleepReaders was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## selectSpecificDeviceId
Use this before initialization to only connect to a certain device with a known deviceId.

```javascript
    flomioPlugin.selectSpecificDeviceId(deviceId, [onSuccess], [onFailure]);
```

### Parameters
- __deviceId__:  The unique ID code of the target reader.
- __onSuccess__:(Optional)  The callback that is called if selectSpecificDeviceId was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## sendApdu
Sends an APDU command to a target device

```javascript
    flomioPlugin.sendApdu(deviceId, apdu, [onSuccess], [onFailure]);
````

### Parameters
- __deviceId__:  The unique ID code of the target reader.
- __apdu__:  The APDU command in hexadecimal format (`string`|`Buffer`).
- __onSuccess__:(Optional)  The callback that is called if sendApdu was successful, it returns a hexadecimal response APDU as a string.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## getBatteryLevel
Gets the battery level of the currently connected device.

```javascript
    flomioPlugin.getBatteryLevel([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that returns a number which represents the battery level between 0 - 100%
- __onFailure__:(Optional)  The callback that is called if there was an error.

## getCommunicationStatus
Gets the latest [communication status](#communicationstatus) of the device

```javascript
      flomioPlugin.getCommunicationStatus([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that returns the latest [communication status](#communicationstatus) of the device
- __onFailure__:(Optional)  The callback that is called if there was an error.

## writeNdef
Write NDEF formatted data to a tag in proximity of a specified target device.

```javascript
    const url = 'http://www.flomio.com'
    const ndefMessage = [
        flomioPlugin.ndef.uriRecord(url)
    ]
    flomioPlugin.writeNdef(deviceId, ndefMessage, [onSuccess], [onFailure]);
```

### Parameters
- __deviceId__:  The unique ID code of the target reader.
- __ndefMessage__:  The NDEF formatted data to be written to the tag.
- __onSuccess__:(Optional)  The callback that is called if writeNdef was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error. This will occur if a tag is removed while writing.

## write
Write unformatted data to a tag in proximity of a specified target device.

```javascript
    const data = '00000000'
    flomioPlugin.write(deviceId, data, [onSuccess], [onFailure]);
```

### Parameters
- __deviceId__:  The unique ID code of the target reader.
- __data__: The unformatted data (`string`|`Buffer`) to be written to the tag.
- __onSuccess__:(Optional)  The callback that is called if write was successful.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## launchNativeNfc
Starts iOS 11 CoreNfc Reader session with compatible devices. 

```javascript
    flomioPlugin.launchNativeNfc([onSuccess], [onFailure]);
```

### Parameters
- __onSuccess__:(Optional)  The callback that returns the NDEF object if a tag is tapped on the iPhone.
- __onFailure__:(Optional)  The callback that is called if there was an error with reading or if the session was invalidated.

## readNdef
Retrieve NDEF formatted data from a tag in proximity of a specified target device.
When a tag is found, in your addTagDiscoveredListener success callback, call readNdef.

```javascript
    flomioPlugin.readNdef(deviceId, [onSuccess], [onFailure]);
```

Example
```javascript
 function flomioTagDiscovered(result) {
    flomioPlugin.readNdef(result.deviceId, this.onNdefFound.bind(this), this.onReadNdefFail.bind(this),)
 }
  
 function onNdefFound(response) {
     console.log(JSON.stringify(response.ndefMessage));
 }
 function onReadNdefFail(error) {
     console.log(error.message)
 }
```

### Parameters
- __deviceId__:  The unique ID code of the target reader.
- __onSuccess__:(Optional)  The callback that returns the NDEF object if a tag NDEF data is successfully read from a tag.
- __onFailure__:(Optional)  The callback that is called if there was an error with reading.

## addConnectedDevicesListener
Registers for device discovery events. When a devices is connected, the onSuccess callback returns a [DeviceInfo](#deviceinfo) object.

```javascript
    flomioPlugin.addConnectedDevicesListener([onSuccess], [onFailure]);
```
### Parameters
- __onSuccess__:(Optional)  The callback that returns a [DeviceInfo](#deviceinfo) object when a devices is connected or has updates to report.
- __onFailure__:(Optional)  The callback that is called if there was an error.

## addTagDiscoveredListener
Registers for tag discovery events. When a tag is tapped, the onSuccess callback returns a [Tag](#tag) object.

```javascript
      flomioPlugin.addTagDiscoveredListener([onSuccess], [onFailure]);
```
### Parameters
- __onSuccess__:(Optional)  The callback that returns a [Tag](#tag) object when a tag is tapped.
- __onFailure__:(Optional)  The callback that is called if there was an error.


## addTagStatusChangeListener
Registers for status change events. When a tag is added/removed from field, the onSuccess callback returns a [TagStatus](#tagstatus) object.

```javascript
      flomioPlugin.addTagStatusChangeListener([onSuccess], [onFailure]);
```
### Parameters
- __onSuccess__:(Optional)  The callback that returns a [TagStatus](#tagstatus) object when a tag is added/removed from the reader field.
- __onFailure__:(Optional)  The callback that is called if there was an error.

# Tag 
`Object`

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| uid | `string` |  | The unique ID of the tag. |
| atr | `string` |  | The Answer To Reset (ATR) of the tag. This can be used to determine the tag's manufacturer or issuer and other details. |

# DeviceInfo 
`Object`

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| deviceId | `string` |  | The unique ID / serial number of the connected reader. |
| batteryLevel | `number` |  |  a number which represents the battery level between 0 - 100%. |
| hardwareRevision | `string` |  | The devices hardware revision string. |
| firmwareRevision | `string` |  | The devices firmware revision string. |
| communicationStatus | `CommunicationStatus` |  | See [CommunicationStation](#communicationstatus) for details. |

# DeviceConfiguration
`Object`

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| deviceType | `string` | `'floble-plus'` | The device type for the current session. Only `floble-plus` and `floble-micro` are supported at the moment. |
| powerOperation | `PowerOperation` | `0` | Describes how startReaders and stopReaders operate. See [PowerOperation](#PowerOperation) for details. |


# PowerOperation
 `enum`

 Name | Type | Default | Description |
| --- | --- | --- | --- |
| AutoPollingControl | `number` | `0` | startReaders and stopReaders turns on/off the reader from polling. |
| BluetoothConnectionControl | `number` | `1` | startReaders and stopReaders turns on/off bluetooth, this can be used when exiting from/returning to your app. |

# CommunicationStatus
 `enum`

 Name | Type | Default | Description |
| --- | --- | --- | --- |
| Scanning | `number` | `0` | The device is connected and scanning for tags. |
| Connected | `number` | `1` | The device is connected to bluetooth but not scanning for tags. |
| Disconnected | `number` | `2` | The device is disconnected from bluetooth and not scanning for tags. |

# TagStatus
 `enum`

 Name | Type | Default | Description |
| --- | --- | --- | --- |
| NotPresent | `number` | `0` | A tag is not in range of the reader |
| Present | `number` | `1` | A tag is in range of the reader. |

# NDEF
 `Object`

> The `ndef` object provides functions for creating IRecords.

## IMessage
 `Array`

Represents an NDEF (NFC Data Exchange Format) data message that contains one or more [IRecords](#IRecord).

## IRecord
 `Object`

Represents a NDEF (NFC Data Exchange Format) record as defined by the NDEF specification.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| tnf | `number` |  | The Type Name Format field of the payload. |
| type | `Buffer or string` | | The type of the payload. |
| id | `Buffer` |  | The identifier of the payload |
| payload | `Buffer` |  | The data of the payload |
| value | `string?` |  | An optional convenience parameter which will return the payload as text for Text and URI records. |

The `flomioPlugin.ndef` object provides functions for creating IRecords

Create a URI record
```javascript
    const record = flomioPlugin.ndef.uriRecord("http://www.flomio.com");
```

Create a plain text record
```javascript
    const record = flomioPlugin.ndef.textRecord("Plain text message");
```

Create an empty record
```javascript
    const record = flomioPlugin.ndef.emptyRecord();
```

# Add Pro SDK for Offline usage

- Add libSDKClassesPro.a to a folder named resources. Add this and the scripts folder from this repo to the root of your project (same directory as package.json). 
  So your project structure looks like this
  
  ```bash
  ├── ProjectName
  │   ├── scripts
  │   │   ├── copyProSDK.js
  │   ├── resources
  │   │   ├── libSDKClassesPro.a
  │   ├── package.json
  │   ├── node_modules
  ```
    
    Add
    ```xml
    <hook src="scripts/copyProSDK.js" type="after_plugin_install" />

    ```
   
    to `config.xml` after  
    ```xml
    <platform name="ios">
    ```
   
   Then when you add the Flomio Cordova Plugin, the ProSDK will be added to your project instead of the Basic SDK.
   
# Use with Ionic

## Installation

- Install: 
 ```bash
 ionic cordova plugin add https://github.com/flomio/cordova-plugin-flomio#<latest-commit-code>
 ```
 
- Copy the directory `ionic-native/cordova-plugin-flomio` in this repo to `node_modules/@ionic-native` in your project.
  So your project structure looks like this 
  
 ```bash
  
    ├── ProjectName
    │   ├── node_modules
    │   │   ├── @ionic-native
    │   │   │   ├── cordova-plugin-flomio
 ```

- [Add Ndef and FlomioPlugin to your app's module.](https://ionicframework.com/docs/native/#Add_Plugins_to_Your_App_Module)

## Usage

 ```typescript
import {
  FlomioPlugin,
  PowerOperation,
  CommunicationStatus,
  DeviceConfiguration,
  DeviceInfo,
  Tag,
  Ndef
} from '@ionic-native/cordova-plugin-flomio'

private deviceId: string
constructor(  private flomio: FlomioPlugin,
              private ndef: Ndef) { }

initReader () {
    this.platform.ready().then(() => {
        const configuration: DeviceConfiguration = {
            powerOperation: PowerOperation.AutoPollingControl,
            deviceType: 'floble-plus'
        }
        
        this.flomio.setConfiguration(configuration)
        this.flomio.init()
        this.addListeners()
    })
  }

addListeners() {
    this.flomio.addConnectedDevicesListener().subscribe((device: DeviceInfo) => {
        console.log(`deviceId: ${device.deviceId}`)
        this.deviceId = device.deviceId
    })

    this.flomio.addTagDiscoveredListener().subscribe(async (tag: Tag) => {
        console.log(`tag uid: ${tag.uid}`)
        const response = await this.flomio.readNdef(this.deviceId)
        console.log(JSON.stringify(response))
    })
  }
 ```
