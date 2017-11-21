# Flomio Cordova Plugin for SDK v2.3

Flomio's plugin for Cordova / Meteor, for use with the v2.2 of the Flomio SDK. [Get yours here.]
(http://flomio.com/shop/apps/flomio-sdk-basic-turnkey-oem-support/)
This plugin is only supported for FloBLE Plus

## Installation

- Download and install [Node](http://nodejs.org/) plus the [Cordova CLI](http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html) or [Meteor CLI](https://www.meteor.com/install).

- Create your Cordova or Meteor example app.

```bash
cordova create flomio-plugin-example-app && cd $_
--
meteor create flomio-plugin-example-app && cd $_
```

- Add the plugin to it.

```bash
cordova plugin add https://github.com/flomio/flomio_cordova_plugin#<latest-commit-code>
--
meteor add cordova:com.flomio.sdk@https://github.com/flomio/flomio_cordova_plugin/tarball/<latest-commit-code>
```

- Implement a simple code snippet to test your setup.

```
flomioPlugin.selectDeviceType("floble-plus");
let configuration = {};
configuration = {
    scanPeriod: 1000, // scan period in ms
    scanSound: false, // toggle scan sound on/off
    readerState: 'read-data', //read-data or read-uuid
    powerOperation: 'auto-polling-control' //bluetooth-connection-control or auto-polling-control
}
flomioPlugin.setConfiguration(configuration);
flomioPlugin.init();
flomioPlugin.addConnectedDevicesListener(this.flomioConnectedDevicesListener.bind(this));
flomioPlugin.addTagDiscoveredListener(this.flomioTagDiscovered.bind(this))
```

- Prepare the app.

```bash
cordova prepare
--
meteor add-platform ios
```

- Open the generated Xcode project located at `platforms/ios` or with Meteor, `.meteor/local/cordova-build/platforms/ios`.

- Build and run the app on an iOS device.

## API

**Required for operation**

* `selectDeviceType(deviceType)`

	Activates the specified device type for the current session. Choice of FloJack-BZR, FloJack-MSR, FloBLE-EMV or FloBLE-Plus
	
	`String readerType: <"flojack-bzr", "flojack-msr", "floble-emv" or "floble-plus">`

* `init()`

	Initialises the plugin, preparing it for first use in the current session


* `setConfiguration(configuration)`

	Configures settings for the current session. Both values in `readerSettings` are optional
	
	```
	Object configuration
	{
		int scanPeriod,  // scan period in ms
		bool scanSound  // toggle scan sound on/off
	}

	e.g 
	let configuration = {}
      configuration = {
        scanPeriod: 1000,  // scan period in ms
        scanSound: true,  // toggle scan sound on/off
        readerState: 'read-data', //read-data or read-uuid
        powerOperation: 'auto-polling-control'  //bluetooth-connection-control or auto-polling-control
      }

  flomioPlugin.setConfiguration(configuration);
	```
	
**Optional methods**


* `getConfiguration(resultCallback)`

	Retrieves settings for the current session
	
	```
	function resultCallback(result)
	Object result
	{
		int scanPeriod,  // scan period in ms
		bool scanSound  // toggle scan sound on/off
	}
	```

* `stopReaders()`

	Stops all readers polling in the current session

* `sendApdu(resultCallback, deviceId, apdu)`

	Sends an APDU command to a target device

	```
	function resultCallback(result)
	Object result
	{
		String deviceId,
		String responseApdu  // the APDU message received as a response
	}
	```
	`String deviceId`: unique ID code of the target reader (case insensitive, whitespace insensitive)

	`String apdu`: APDU command in hexadecimal format (case insensitive, whitespace insensitive)

* `addConnectedDevicesListener(resultCallback)`

	Assign a callback function to fire when any device connects or disconnects
	
	```
	function resultCallback(deviceIdList)
	Array deviceIdList  // list of connected device IDs
	```
		
* `addTagStatusChangeListener(resultCallback)`

	Assign a callback function to fire when a tag enters or leaves the proximity of any reader
	
	```
	function resultCallback(result)
	Object result
	{
		String deviceId,
		int status  // 0 == out of proximity, 1 == within proximity
	}
	```

* `addTagDiscoveredListener(resultCallback)`

	Assign a callback function to fire when the UID of a tag is found by any reader
	
	```
	function resultCallback(result)
	Object result
	{
		String deviceId,
		String tagUid
	}
	```

* `readNdef(resultCallback, deviceId)`

	Retrieve NDEF formatted data from a tag in proximity of a specified target device.
	When a tag is found, in your flomioTagDiscovered callback, call 
	```
    flomioTagDiscovered: function(result) {
        flomioPlugin.readNdef(this.flomioNdefListener.bind(this), result.deviceId)
    }	
    ```
	
	and in that callback 
	```
	flomioNdefListener: function(response) {
        console.log(JSON.stringify(response.ndefMessage));
    }
    ```
    Use response.error to indicate to users if a tag was removed too early while reading.
 
 * `getBatteryLevel()`
 
 	Returns a promise containing most recent battery level of device.
 	

**Add Pro SDK for Offline usage**

- Add libSDKClassesPro.a to a folder named resources. Add this and the scripts folder from this repo to the root of your project (same directory as package.json). 
  So your project structure looks like this
  
  ```
  ProjectName
  - scripts
    - copyProSDK.js
  - resources
    - libSDKClassesPro.a
  - package.json
  - node_modules
  ```
    
    Add
    ```
    <hook src="scripts/copyProSDK.js" type="after_plugin_install" />

    ```
    after  
    ```
    <platform name="ios">
    ```
   
   Then when you add the Flomio Cordova Plugin, the ProSDK will be added to your project instead of the Basic SDK.
