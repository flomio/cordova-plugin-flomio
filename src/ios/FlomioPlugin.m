/*
 FlomioPlugin.m
 Uses Flomio SDK version 2.0
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
        NSDictionary *configurationDictionary = @{
                                                  @"Scan Sound" : @1,
                                                  @"Scan Period" : @1000,
                                                  @"Reader State" : [NSNumber numberWithInt:kReadUuid], //kReadData for NDEF
                                                  @"Power Operation" : [NSNumber numberWithInt:kAutoPollingControl], //kBluetoothConnectionControl low power usage
                                                  @"Transmit Power" : [NSNumber numberWithInt: kHighPower],
                                                  @"Allow Multiconnect" : @0, //control whether multiple FloBLE devices can connect
                                                  };
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
    NSString* callbackId = command.callbackId;
    [self setScanPeriod:[NSString stringWithFormat:@"%@", scanPeriod] :callbackId];
    [self toggleScanSound:scanSound :callbackId];
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

}

- (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)serialNumber withError:(NSError *)error{

}

- (void)didReceiveReaderError:(NSError *)error{
    
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

 /** Set the scan period (in ms) */
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

/** Toggle on/off scan sound */
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

/** Update reader settings
 - (void)setReaderSettings:(CDVInvokedUrlCommand*)command
 {
 NSString* scanPeriod = [command.arguments objectAtIndex:0];
 NSString* scanSound = [command.arguments objectAtIndex:1];
 
 NSString* callbackId = command.callbackId;
 [self setScanPeriod:[NSString stringWithFormat:@"%@", scanPeriod] :callbackId];
 [self toggleScanSound:scanSound :callbackId];
 }
 */

/** Retrieve reader settings
 - (void)getReaderSettings:(CDVInvokedUrlCommand *)command
 {
	dispatch_async(dispatch_get_main_queue(), ^{
 NSArray* settings = @[sharedManager.scanPeriod, sharedManager.scanSound];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:settings];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	});
 }
 */

/** Stops readers polling for tags
 - (void)stopReaders:(CDVInvokedUrlCommand*)command
 {
 if ([self->selectedDeviceType isEqualToString:@"null"])
 {
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Select a device type first"];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
 }
 else
 {
 [sharedManager stopReaders]; // stop all active readers
 }
 }
 */

/** Send an APDU to a specific reader
 - (void)sendApdu:(CDVInvokedUrlCommand *)command
 {
 NSString* deviceId = [command.arguments objectAtIndex:0];
 NSString* apdu = [command.arguments objectAtIndex:1];
 
 deviceId = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
 apdu = [apdu stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
 
 self->apduResponse_callbackIdDict[deviceId] = command.callbackId;
 
 for (FmDevice *device in self->connectedDevicesList)
 {
 if ([[device serialNumber] isEqualToString:[deviceId uppercaseString]])
 {
 [device sendApduCommand:apdu];
 return;
 }
 }
 
 // no matching reader found
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Device ID does not match any active reader"];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->apduResponse_callbackIdDict[deviceId]];
 }
 */

/*
 - (void)setDeviceConnectionChangeCallback:(CDVInvokedUrlCommand*)command
 {
	self->deviceConnectionChange_callbackId = command.callbackId;
 }
 
 - (void)setBr500ConnectionChangeCallback:(CDVInvokedUrlCommand*)command
 {
 self->br500ConnectionChange_callbackId = command.callbackId;
 }
 
 - (void)setCardStatusChangeCallback:(CDVInvokedUrlCommand*)command
 {
 self->cardStatusChange_callbackId = command.callbackId;
 }
 */

/** Sets callback for tag UID read events
 - (void)setTagUidReadCallback:(CDVInvokedUrlCommand*)command
 {
 self->didFindATagUuid_callbackId = command.callbackId;
 }
 
 - (void)getDataBlocks:(CDVInvokedUrlCommand*)command
 {
 if ([self->selectedDeviceType isEqualToString:@"floble-plus"])
 {
 NSString* deviceId = [command.arguments objectAtIndex:0];
 self->ndefDataBlockDiscovery_callbackIdDict[deviceId] = command.callbackId;
 
 for (FmDevice *device in self->connectedDevicesList)
 {
 if ([[device serialNumber] isEqualToString:[deviceId uppercaseString]])
 {
 [device getDataBlocks];
 return;
 }
 }
 
 // no matching reader found
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Device ID does not match any active reader"];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->ndefDataBlockDiscovery_callbackIdDict[deviceId]];
 }
 else
 {
 // function currently only supported by FloBLE Plus
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"getDataBlocks is currently supported only by the FloBLE Plus"];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
 }
 }
 */

////////////////////// INTERNAL FUNCTIONS /////////////////////////

/** Set the scan period (in ms)
 - (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId;
 {
 periodString = [periodString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
 
 if ([[periodString lowercaseString] isEqualToString:@"unchanged"])
 {
 return;
 }
 
 int period = [periodString intValue];
 if (period > 0)
 {
 sharedManager.scanPeriod = [NSNumber numberWithInteger:period];
 }
 else
 {
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Scan period must be > 0"];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
 }
 }
 */

/** Toggle on/off scan sound
 - (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId;
 {
 NSString* toggle = [toggleString stringByReplacingOccurrencesOfString:@" " withString:@""]; // remove whitespace
 if ([[toggle lowercaseString] isEqualToString:@"unchanged"])
 {
 return;
 }
 
 if ([[toggle lowercaseString] isEqualToString:@"true"])
 {
 sharedManager.scanSound = [NSNumber numberWithBool:YES];
 }
 else if ([[toggle lowercaseString] isEqualToString:@"false"])
 {
 sharedManager.scanSound = [NSNumber numberWithBool:NO];
 }
 else
 {
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'true' or 'false' only"];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
 }
 }
 */

////////////////////// INTERNAL FLOMIO READER FUNCTIONS /////////////////////////

/** Called when the app becomes active
 - (void)active {
 NSLog(@"App Activated");
 }
 */

/** Called when the app becomes inactive
 - (void)inactive {
 NSLog(@"App Inactive");
 }
 */

/** Called when the list of connected devices is updated
 - (void)didUpdateConnectedDevices:(NSArray *)connectedDevices {
 
 }
 */

/** Receives the UUID of a scanned tag
 - (void)didFindATagUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withError:(NSError *)error
 {
 dispatch_async(dispatch_get_main_queue(), ^{
 NSLog(@"Found tag UUID: %@ from device:%@", Uuid, deviceId);
 
 // send tag read update to Cordova
 if (![self->didFindATagUuid_callbackId isEqualToString:@"null"])
 {
 NSArray* result = @[deviceId, Uuid];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
 [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->didFindATagUuid_callbackId];
 }
 });
 }
 */

/** A tag has entered or left the scan range of the reader
 - (void)didChangeCardStatus:(NSNumber *)status fromDevice:(NSString *)deviceId
 {
 dispatch_async(dispatch_get_main_queue(), ^{
 // send card status change to Cordova
 if (![self->cardStatusChange_callbackId isEqualToString:@"null"])
 {
 NSArray* result = @[deviceId, status];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
 [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->cardStatusChange_callbackId];
 }
 });
 }
 */

/** Receives APDU responses from connected devices
 - (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)deviceId withError:(NSError *)error{
 dispatch_async(dispatch_get_main_queue(), ^{
 NSLog(@"Received APDU: %@ from device:%@", response, deviceId); //APDU Response
 
 // send response to Cordova
 if (self->apduResponse_callbackIdDict[deviceId])
 {
 NSArray* result = @[deviceId, response];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
 [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->apduResponse_callbackIdDict[deviceId]];
 }
 });
 }
 */

/** Receives error messages from connected devices
 - (void)didReceiveReaderError:(NSError *)error {
 dispatch_async(dispatch_get_main_queue(), ^{
 NSLog(@"%@", error); // reader error
 
 if (![self->didFindATagUuid_callbackId isEqualToString:@"null"])
 {
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
 [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->didFindATagUuid_callbackId];
 }
 });
 }
 */

/** Receives an NDEF data block from a nearby tag
 - (void)didFindADataBlockWithNdef:(NdefMessage *)ndef fromDevice:(NSString *)device withError:(NSError *)error
 {
 NSMutableArray* recordsArray = [NSMutableArray array];
 
 for (NdefRecord* record in ndef.ndefRecords)
 {
 NSMutableArray* row = [NSMutableArray array];
 [row addObject:[record typeString]];
 [row addObject:[record payloadString]];
 
 [recordsArray addObject:row];
 }
 
 dispatch_async(dispatch_get_main_queue(), ^{
 if (self->ndefDataBlockDiscovery_callbackIdDict[device])
 {
 NSArray* result = @[device, recordsArray];
 CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
 [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
 [self.commandDelegate sendPluginResult:pluginResult callbackId:self->ndefDataBlockDiscovery_callbackIdDict[device]];
 }
 });
 }
 */
