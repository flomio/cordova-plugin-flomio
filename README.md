# Flomio Cordova Plugin

***WORK IN PROGRESS: NOT YET SUITABLE FOR REGULAR USE***

Flomio's Proximity ID plugin for Cordova. 

## Installation

- Make sure that you have [Node](http://nodejs.org/) and [Cordova CLI](http://cordova.apache.org/docs/en/4.0.0/guide_cli_index.md.html) installed on your machine.

- Create your Cordova example app.

```bash
cordova create my-plugin-example-app && cd $_
```

- Add the plugin to it.

```bash
cordova plugin add https://github.com/flomio/flomio_cordova_plugin.git
```

- Register plugin within `config.xml` of your app.

```xml
<feature name="FLOPlugin">
    <param name="ios-package" value="FLOPlugin" />
</feature>
```

- Create a tag scan callback and include the command to start polling.

```
var callback = function(result) {
	console.log(result);
}
floPlugin.startPolling(callback);
```

- Prepare the app.

```bash
cordova prepare
```

- Open the generated Xcode project located at `platforms/ios`.

- Drag and drop the Flomio SDK folder into the project (check "Create groups" and "Add to targets").

- Add `-lc++` to "Other Linker Flags" under "Build Settings".

- Build and run the app on an iOS device.
