# Flomio Plugin

Flomio's Proximity ID plugin for Cordova. 

## Installation

- Make sure that you have [Node](http://nodejs.org/) and [Cordova CLI](https://github.com/mwbrooks/phonegap-cli) installed on your machine.

- Create your Cordova example app

```bash
cordova create my-plugin-example-app && cd $_
```

- Add the plugin to it

```bash
cordova plugin add https://github.com/flomio/flomio_phonegap_plugin.git
```

- Open `index.html` and add a button

```html
<button onclick="floPlugin.webToSdkCommand();">Say hello to your plugin!</button>
```

- Register plugin within `config.xml` of your app

```xml
<feature name="FLOPlugin">
    <param name="ios-package" value="FLOPlugin" />
</feature>
```

- Build and run app

```bash
cordova run ios
```
