# Flomio Cordova Plugin for SDK v2.0

Flomio's plugin for Cordova / Meteor, for use with the v2.0 of the Flomio SDK

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

- Register plugin within `config.xml` of your app in Cordova. Meteor takes care of this for you (so skip this step).

```xml
<feature name="FlomioPlugin">
    <param name="ios-package" value="FlomioPlugin" />
</feature>
```

- Implement a simple code snippet to test your setup.

```
function resultCallback(result)
{
	console.log(result);
}
flomioPlugin.init();
flomioPlugin.selectDeviceType("floble-plus");  // this will automatically start polling for tags
```

- Prepare the app.

```bash
cordova prepare
--
meteor add-platform ios
```

- Open the generated Xcode project located at `platforms/ios` or with Meteor, `.meteor/local/cordova-build/platforms/ios`.

- Drag and drop the Flomio SDK folder into the project (check "Create groups" and "Add to targets").

- Add `-lc++` and `-ObjC` to "Other Linker Flags" under "Build Settings".

- In "Targets -> YourAppTarget -> Build Options", set "Enable Bitcode" to "No"

- In "Targets -> YourAppTarget -> General -> Link Binary with Libraries", add "MediaPlayer.framework"

- Build and run the app on an iOS device.

## API

**Required for operation**

* `init()`

	Initialises the plugin, preparing it for first use in the current session
	
* `selectDeviceType(deviceType)`

	Activates the specified device type for the current session. Choice of FloJack-BZR, FloJack-MSR, FloBLE-EMV or FloBLE-Plus
	
	`String readerType: <"flojack-bzr", "flojack-msr", "floble-emv" or "floble-plus">`
	
**Optional methods**

* `setReaderSettings(readerSettings)`

	Configures settings for the current session. Both values in `readerSettings` are optional
	
	```
	Object readerSettings
	{
		int scanPeriod,  // scan period in ms
		bool scanSound  // toggle scan sound on/off
	}
	```
	
* `getReaderSettings(resultCallback)`

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

* `onDeviceConnectionChange(resultCallback)`

	Assign a callback function to fire when any device connects or disconnects
	
	```
	function resultCallback(deviceIdList)
	Array deviceIdList  // list of connected device IDs
	```
		
* `onTagStatusChange(resultCallback)`

	Assign a callback function to fire when a tag enters or leaves the proximity of any reader
	
	```
	function resultCallback(result)
	Object result
	{
		String deviceId,
		int status  // 0 == out of proximity, 1 == within proximity
	}
	```

* `onTagUidRead(resultCallback)`

	Assign a callback function to fire when the UID of a tag is found by any reader
	
	```
	function resultCallback(result)
	Object result
	{
		String deviceId,
		String tagUid
	}
	```

* `getDataBlocks(resultCallback, deviceId)`

	Retrieve NDEF formatted data from a tag in proximity of a specified target device

	```
	function resultCallback(result)
	Object result
	{
		String deviceId,
		Array ndef  // nested array that contains rows of [NDEF types, NDEF hexadecimal strings]
	}
	```
