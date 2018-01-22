#!/bin/bash

cd ../ionic-native
rm -rf src/@ionic-native/plugins/.DS_Store
npm run build
cp -r ./dist/@ionic-native/cordova-plugin-flomio ../cordova-plugin-flomio/ionic-native
cp -r  ./src/@ionic-native/plugins/cordova-plugin-flomio/index.ts ../cordova-plugin-flomio/ionic-native
