/*
 FlomioPlugin.m
 Uses Flomio SDK version 2.0
*/

#import "FlomioPlugin.h"

@implementation FlomioPlugin

/** Initialise the plugin */
- (void)init:(CDVInvokedUrlCommand*)command
{
    readerManager = [FmSessionManager sharedManager];
    readerManager.delegate = self;
    
    // Initialise callback ID strings
    self->selectedDeviceType = @"null";
    self->didFindATagUuid_callbackId = @"null";
    self->apduResponse_callbackId = @"null";
    self->deviceConnectionChange_callbackId = @"null";
    self->cardStatusChange_callbackId = @"null";
    
    // Set SDK configuration and update reader settings
    readerManager.scanPeriod = [NSNumber numberWithInteger:500]; // in ms
    readerManager.scanSound = [NSNumber numberWithBool:YES]; // play scan sound
    
    // Stop reader scan when the app becomes inactive
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(inactive) name:UIApplicationDidEnterBackgroundNotification object:nil];
    // Start reader scan when the app becomes active
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(active) name:UIApplicationDidBecomeActiveNotification object:nil];
}

/** Update reader settings */
- (void)setReaderSettings:(CDVInvokedUrlCommand*)command
{
    NSString* scanPeriod = [command.arguments objectAtIndex:0];
    NSString* scanSound = [command.arguments objectAtIndex:1];
    
    NSString* callbackId = command.callbackId;
    [self setScanPeriod:[NSString stringWithFormat:@"%@", scanPeriod] :callbackId];
    [self toggleScanSound:scanSound :callbackId];
}

/** Retrieve reader settings */
- (void)getReaderSettings:(CDVInvokedUrlCommand *)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSArray* settings = @[readerManager.scanPeriod, readerManager.scanSound];
	    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:settings];
	    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	});
}

/** Stops active readers of the current type then starts readers of the new type */
- (void)selectDeviceType:(CDVInvokedUrlCommand*)command
{
    [readerManager stopReaders];
    NSString* deviceType = [command.arguments objectAtIndex:0];
    deviceType = [deviceType stringByReplacingOccurrencesOfString:@" " withString:@""]; // remove whitespace
    
    if ([[deviceType lowercaseString] isEqualToString:@"flojack-bzr"])
    {
        self->selectedDeviceType = @"flojack-bzr";
        readerManager.selectedDeviceType = kFlojackBzr;
    }
    else if ([[deviceType lowercaseString] isEqualToString:@"flojack-msr"])
    {
        self->selectedDeviceType = @"flojack-msr";
        readerManager.selectedDeviceType = kFlojackMsr;
    }
    else if ([[deviceType lowercaseString] isEqualToString:@"floble-emv"])
    {
        self->selectedDeviceType = @"floble-emv";
        readerManager.selectedDeviceType = kFloBleEmv;
    }
    else if ([[deviceType lowercaseString] isEqualToString:@"floble-plus"])
    {
        self->selectedDeviceType = @"floble-plus";
        readerManager.selectedDeviceType = kFloBlePlus;
    }
    else
    {
        self->selectedDeviceType = @"null";
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'FloJack-BZR', 'FloJack-MSR', 'FloBLE-EMV' or 'FloBLE-Plus' only"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    
    [readerManager startReaders];
}

/** Stops readers polling for tags */
- (void)stopReaders:(CDVInvokedUrlCommand*)command
{
    if ([self->selectedDeviceType isEqualToString:@"null"])
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Select a device type first"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    else
    {
        [readerManager stopReaders]; // stop all active readers
    }
}

/** Send an APDU to a specific reader */
- (void)sendApdu:(CDVInvokedUrlCommand *)command
{
    NSString* deviceId = [command.arguments objectAtIndex:0];
    NSString* apdu = [command.arguments objectAtIndex:1];
    
    deviceId = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    apdu = [apdu stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    self->apduResponse_callbackId = command.callbackId;
    
    for (FmDevice *device in self->connectedDevicesList)
    {
        if ([device serialNumber] == [deviceId uppercaseString])
        {
            [device sendApduCommand:apdu];
            return;
        }
    }
    
    // no matching reader found
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Device ID does not match any active reader"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self->apduResponse_callbackId];
}

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

/** Sets callback for tag UID read events */
- (void)setTagUidReadCallback:(CDVInvokedUrlCommand*)command
{
    self->didFindATagUuid_callbackId = command.callbackId;
}

////////////////////// INTERNAL FUNCTIONS /////////////////////////

/** Set the scan period (in ms) */
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
        readerManager.scanPeriod = [NSNumber numberWithInteger:period];
    }
    else
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Scan period must be > 0"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

/** Toggle on/off scan sound */
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId;
{
    NSString* toggle = [toggleString stringByReplacingOccurrencesOfString:@" " withString:@""]; // remove whitespace
    if ([[toggle lowercaseString] isEqualToString:@"unchanged"])
    {
        return;
    }
    
    if ([[toggle lowercaseString] isEqualToString:@"true"])
    {
        readerManager.scanSound = [NSNumber numberWithBool:YES];
    }
    else if ([[toggle lowercaseString] isEqualToString:@"false"])
    {
        readerManager.scanSound = [NSNumber numberWithBool:NO];
    }
    else
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'true' or 'false' only"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

////////////////////// INTERNAL FLOMIO READER FUNCTIONS /////////////////////////

/** Called when the app becomes active */
- (void)active {
    NSLog(@"App Activated");
}

/** Called when the app becomes inactive */
- (void)inactive {
    NSLog(@"App Inactive");
}

/** Called when the list of connected devices is updated */
- (void)didUpdateConnectedDevices:(NSArray *)connectedDevices {
    self->connectedDevicesList = [connectedDevices mutableCopy];
    
    NSMutableArray* deviceIdList = [NSMutableArray array];
    for (FmDevice *device in connectedDevices)
    {
        [deviceIdList addObject:[device serialNumber]];
    }
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:deviceIdList];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self->deviceConnectionChange_callbackId];
}

/** Called when the list of connected BR500 devices is updated */
- (void)didUpdateConnectedBr500:(NSArray *)peripherals {
    NSMutableArray* deviceIdList = [NSMutableArray array];
    for (FmDevice *device in peripherals)
    {
        [deviceIdList addObject:[device serialNumber]];
    }
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:deviceIdList];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self->br500ConnectionChange_callbackId];
}

/** Receives the UUID of a scanned tag */
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

/** A tag has entered or left the scan range of the reader */
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

/** Receives APDU responses from connected devices */
- (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)deviceId withError:(NSError *)error{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Received APDU: %@ from device:%@", response, deviceId); //APDU Response
        
        // send response to Cordova
        if (![self->apduResponse_callbackId isEqualToString:@"null"])
        {
            NSArray* result = @[deviceId, response];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:self->apduResponse_callbackId];
        }
    });
}

/** Receives error messages from connected devices */
- (void)didReceiveReaderError:(NSError *)error {
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"%@", error); // reader error
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
        [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self->didFindATagUuid_callbackId];
    });
}

@end
