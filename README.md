# Flomio Cordova Plugin

Flomio's Proximity ID plugin for Cordova/Meteor.

**Current Flomio SDK version: 1.9**

## Installation

- Make sure that you have [Node](http://nodejs.org/) and [Cordova CLI](http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html) or the [Meteor CLI](https://www.meteor.com/install) installed on your machine.

- Create your Cordova or Meteor example app.

```bash
cordova create my-plugin-example-app && cd $_
--
meteor create my-plugin-example-app && cd $_
```

- Add the plugin to it.

```bash
cordova plugin add https://github.com/flomio/flomio_cordova_plugin.git
--
meteor add cordova:com.flomio.proximityid@https://github.com/flomio/flomio_cordova_plugin/tarball/<latest commit code>
```

- Register plugin within `config.xml` of your app in Cordova. Meteor takes care of this for you (so skip this step).

```xml
<feature name="FLOPlugin">
    <param name="ios-package" value="FLOPlugin" />
</feature>
```

- Create a tag scan callback and include the command to start polling. Also specify whether the current reader is of type "FLO" (FloJack / FloBLE) or "EMV" (Feitian).

```
var callback = function(result) {
	console.log(result);
}
floPlugin.startPolling("FLO", callback);
```

- Prepare the app.

```bash
cordova prepare
--
meteor add-platform ios
```

- Open the generated Xcode project located at `platforms/ios`.

- Drag and drop the Flomio SDK folder into the project (check "Create groups" and "Add to targets").

- Add `-lc++` to "Other Linker Flags" under "Build Settings".

- Disable bitcode. `Build Settings -> Build Options -> Enable Bitcode` to `No`.

- Manually add the SDK folder to library search paths. `Build Settings -> Search Paths -> User Header Search Paths`, double-click and add `"$(SRCROOT)/FlomioSDKv1.<X>/include/SDKClasses"`

- Build and run the app on an iOS device.
