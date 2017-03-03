/*
 FlomioPlugin.m
 Uses Flomio SDK version 2.2
 */

#import "FlomioPlugin.h"

@implementation FlomioPlugin

/** Initialise the plugin */
- (void)init:(CDVInvokedUrlCommand*)command {
    apduResponseDictionary = [NSMutableDictionary new];
    
    if (!sharedManager) {        
        // Initialise flomioSDK
        sharedManager = [FmSessionManager sharedManager];
        sharedManager.selectedDeviceType = self.selectedDeviceType; // For FloBLE Plus
        //kFlojackMsr, kFlojackBzr for audiojack readers
        sharedManager.delegate = self;
        sharedManager.specificDeviceId = nil;
        //@"RR330-000120" use device id from back of device to only connect to specific device
        // only for use when "Allow Multiconnect" = @0
        if(!configurationDictionary){
           configurationDictionary = @{
                                                  @"Scan Sound" : @1,
                                                  @"Scan Period" : @1000,
                                                  @"Reader State" : [NSNumber numberWithInt:kReadUuid], //kReadData for NDEF
                                                  @"Power Operation" : [NSNumber numberWithInt:kAutoPollingControl], //kBluetoothConnectionControl low power usage
                                                  @"Transmit Power" : [NSNumber numberWithInt: kHighPower],
                                                  @"Allow Multiconnect" : @0, //control whether multiple FloBLE devices can connect
                                                  };
        }
        [sharedManager setConfiguration: configurationDictionary];
        [sharedManager createReaders];
        // Stop reader scan when the app becomes inactive
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(inactive) name:UIApplicationDidEnterBackgroundNotification object:nil];
        // Start reader scan when the app becomes active
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(active) name:UIApplicationDidBecomeActiveNotification object:nil];
    }
}

/** Stops active readers of the current type then starts readers of the new type */
- (void)selectDeviceType:(CDVInvokedUrlCommand*)command {
    NSString* deviceType = [command.arguments objectAtIndex:0];
    deviceType = [deviceType stringByReplacingOccurrencesOfString:@" " withString:@""];
    if ([[deviceType lowercaseString] isEqualToString:@"flojack-bzr"]) {
        self.selectedDeviceType = kFlojackBzr;
    } else if ([[deviceType lowercaseString] isEqualToString:@"flojack-msr"]){
        self.selectedDeviceType = kFlojackMsr;
    } else if ([[deviceType lowercaseString] isEqualToString:@"floble-emv"]){
        self.selectedDeviceType = kFloBleEmv;
    } else if ([[deviceType lowercaseString] isEqualToString:@"floble-plus"]) {
        self.selectedDeviceType = kFloBlePlus;
    } else {
        self.selectedDeviceType = kFloBlePlus; //default to FloBle Plus
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'FloJack-BZR', 'FloJack-MSR', 'FloBLE-EMV' or 'FloBLE-Plus' only"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (void)getConfiguration:(CDVInvokedUrlCommand *)command {
	dispatch_async(dispatch_get_main_queue(), ^{
        NSArray* settings = @[sharedManager.scanPeriod, sharedManager.scanSound];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:settings];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	});
 }

 - (void)setConfiguration:(CDVInvokedUrlCommand*)command {
    NSString* scanPeriod = [command.arguments objectAtIndex:0];
    NSString* scanSound = [command.arguments objectAtIndex:1];
    
    NSString* readerStateString = [command.arguments objectAtIndex:2];
    NSNumber* readerState;
    if ([[readerStateString lowercaseString] isEqualToString:@"read-data"]){
        readerState = [NSNumber numberWithInt:kReadData];
    } else  { //default to @"read-uuid"
        readerState = [NSNumber numberWithInt:kReadUuid];
    }

    NSString* powerOperationString = [command.arguments objectAtIndex:3];
    NSNumber* powerOperation;
    if ([[powerOperationString lowercaseString] isEqualToString:@"bluetooth-connection-control"]){
        powerOperation = [NSNumber numberWithInt:kBluetoothConnectionControl];
    } else { // default to @"auto-polling-control"
        powerOperation = [NSNumber numberWithInt:kAutoPollingControl];
    }
    configurationDictionary = @{
                                @"Scan Period" : [NSNumber numberWithInt:[scanPeriod intValue]],
                                @"Scan Sound" : [NSNumber numberWithBool:scanSound],
                                @"Reader State" : readerState, //kReadData for NDEF
                                @"Power Operation" : powerOperation, //kBluetoothConnectionControl low power usage
                                @"Transmit Power" : [NSNumber numberWithInt: kHighPower],
                                @"Allow Multiconnect" : @0, //control whether multiple FloBLE devices can connect
                                };
    NSString* callbackId = command.callbackId;
    [sharedManager setConfiguration:configurationDictionary];
 }

/** Send an APDU to a specific reader */
 - (void)sendApdu:(CDVInvokedUrlCommand *)command {
    NSString* deviceId = [command.arguments objectAtIndex:0];
    NSString* apdu = [command.arguments objectAtIndex:1];
    
    deviceId = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    apdu = [apdu stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    apduResponseDictionary[deviceId] = command.callbackId;
    
    for (FmDevice *device in connectedDevicesList) {
        if ([[device serialNumber] isEqualToString:[deviceId uppercaseString]]) {
            [device sendApduCommand:apdu];
        }
    }
 }

#pragma mark - Flomio Delegates

/** Called when the list of connected devices is updated */
- (void)didUpdateConnectedDevices:(NSArray *)connectedDevices {
    connectedDevicesList = [connectedDevices mutableCopy];
    NSMutableArray* deviceIdList = [NSMutableArray array];
    for (FmDevice *device in connectedDevices)
    {
        [deviceIdList addObject: device.serialNumber];
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        if (didUpdateConnectedDevicesCallbackId)
        {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:deviceIdList];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didUpdateConnectedDevicesCallbackId];
        }
    });
}

- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Found tag UUID: %@ from device:%@", Uuid, deviceId);
        // send tag read update to Cordova
        if (didFindTagWithUuidCallbackId) {
            NSArray* result = @[deviceId, Uuid];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindTagWithUuidCallbackId];
        }
    });
}

- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error{
    dispatch_async(dispatch_get_main_queue(), ^{
        if (didFindTagWithDataCallbackId) {
            NSArray* result = @[deviceId, payload];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindTagWithDataCallbackId];
        }
    });
}

- (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)deviceId withError:(NSError *)error{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Received APDU: %@ from device:%@", response, deviceId); //APDU Response
        // send response to Cordova
        if (apduResponseDictionary[deviceId]) {
            NSArray* result = @[deviceId, response];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:apduResponseDictionary[deviceId]];
        }
    });
}

- (void)didReceiveReaderError:(NSError *)error{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"%@", error); // reader error
        
        if (didFindTagWithUuidCallbackId) {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindTagWithUuidCallbackId];
        }
    });
}

- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)deviceId{
    dispatch_async(dispatch_get_main_queue(), ^{
        // send card status change to Cordova
        if (didChangeCardStatusCallbackId){
            NSArray* result = @[deviceId, [NSNumber numberWithInt:status]];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didChangeCardStatusCallbackId];
        }
    });
}


#pragma mark - CallbackId setters

 - (void)setConnectedDevicesUpdateCallback:(CDVInvokedUrlCommand*)command
 {
	didUpdateConnectedDevicesCallbackId = command.callbackId;
 }
 
 - (void)setCardStatusChangeCallback:(CDVInvokedUrlCommand*)command
 {
    didChangeCardStatusCallbackId = command.callbackId;
 }
 
 - (void)setTagDiscoveredCallback:(CDVInvokedUrlCommand*)command
 {
    didFindTagWithUuidCallbackId = command.callbackId;
 }

 #pragma mark - Internal Methods

 /** NOT USED Set the scan period (in ms) */
 - (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId {
    periodString = [periodString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    if ([[periodString lowercaseString] isEqualToString:@"unchanged"]){
        return;
    }
    int period = [periodString intValue];
    if (period > 0) {
        sharedManager.scanPeriod = [NSNumber numberWithInteger:period];
    } else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Scan period must be > 0"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
 }

/** NOT USED Toggle on/off scan sound */
 - (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId {
    NSString* toggle = [toggleString stringByReplacingOccurrencesOfString:@" " withString:@""]; // remove whitespace
    if ([[toggle lowercaseString] isEqualToString:@"unchanged"]) {
        return;
    }
    
    if ([[toggle lowercaseString] isEqualToString:@"true"]){
        sharedManager.scanSound = [NSNumber numberWithBool:YES];
    } else if ([[toggle lowercaseString] isEqualToString:@"false"]) {
        sharedManager.scanSound = [NSNumber numberWithBool:NO];
    } else {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'true' or 'false' only"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
 }

@end 
