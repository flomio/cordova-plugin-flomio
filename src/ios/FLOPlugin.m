/*
FLOPlugin.m
Uses Flomio SDK version 1.9
*/

#import "FLOPlugin.h"
#import <Cordova/CDV.h>

@implementation FLOPlugin

/** Initialise the plugin */
- (void)init:(CDVInvokedUrlCommand*)command
{
    sharedManager = [ReaderManager sharedManager];
    sharedManager.delegate = self;
    activeReaderType = @"null";
    
    // Set SDK configuration and update reader settings
    sharedManager.deviceEnabled = [NSNumber numberWithBool:YES]; //enable the reader
    sharedManager.scanPeriod = [NSNumber numberWithInteger:500]; //in ms
    sharedManager.scanSound = [NSNumber numberWithBool:YES]; //play scan sound
    sharedManager.operationState = kReadUUID; //kReadDataBlocks or kWriteDataBlocks
    sharedManager.startBlock = [NSNumber numberWithInteger:8]; //start reading from 4th data block
    sharedManager.messageToWrite = @"http://flomio.com"; // set a default message to write
    [sharedManager updateReaderSettings];
    
    // Stop reader scan when the app becomes inactive
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(inactive) name:UIApplicationDidEnterBackgroundNotification object:nil];
    // Start reader scan when the app becomes active
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(active) name:UIApplicationDidBecomeActiveNotification object:nil];
}

- (void)setReaderSettings:(CDVInvokedUrlCommand*)command
{
    NSString* scanPeriod = [command.arguments objectAtIndex:0];
    NSString* scanSound = [command.arguments objectAtIndex:1];
    NSString* operationState = [command.arguments objectAtIndex:2];
    NSString* startBlock = [command.arguments objectAtIndex:3];
    NSString* messageToWrite = [command.arguments objectAtIndex:4];
    
    NSString* callbackId = command.callbackId;
    [self setScanPeriod:scanPeriod :callbackId];
    [self toggleScanSound:scanSound :callbackId];
    [self setOperationState:operationState :callbackId];
    [self setStartBlock:startBlock :callbackId];
    [self setMessageToWrite:messageToWrite :callbackId];
}

/** Stops the active reader then selects the new active reader */
- (void)selectReaderType:(CDVInvokedUrlCommand*)command
{
    NSString* readerType = [command.arguments objectAtIndex:0];
    NSString* trimmedString = [readerType stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    [sharedManager.reader suspendScan];  // stop all active readers
    
    if ([[trimmedString lowercaseString] isEqualToString:@"flojack"])
    {
        activeReaderType = @"flojack";
        [sharedManager setDeviceType:kFlojack];
        [sharedManager startReaders];
    }
    else if ([[trimmedString lowercaseString] isEqualToString:@"floble-emv"])
    {
        activeReaderType = @"floble-emv";
        [sharedManager setDeviceType:kFloBleEmv];
        [sharedManager startReaders];
    }
    else if ([[trimmedString lowercaseString] isEqualToString:@"floble-plus"])
    {
        activeReaderType = @"floble-plus";
        [sharedManager setDeviceType:kFloBlePlus];
        [sharedManager startReaders];
    }
    else
    {
        activeReaderType = @"null";
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'FloJack', 'FloBLE-EMV' or 'FloBLE-Plus' only"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

/** Starts the reader polling for tags */
- (void)startReader:(CDVInvokedUrlCommand*)command
{
    didFindATagUUID_callbackId = command.callbackId;
    NSString* readerUid = [command.arguments objectAtIndex:0];
    readerUid = [readerUid stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    if ([activeReaderType isEqualToString:@"null"])
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Select a reader type first"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    else if ([[readerUid lowercaseString] isEqualToString:@"all"])
    {
        [sharedManager.reader startScan];  // start all active readers
    }
    else
    {
        // start a specific reader
    }
}

/** Stops the reader polling for tags */
- (void)stopReader:(CDVInvokedUrlCommand*)command
{
    NSString* readerUid = [command.arguments objectAtIndex:0];
    readerUid = [readerUid stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    if ([activeReaderType isEqualToString:@"null"])
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Select a reader type first"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
    else if ([[readerUid lowercaseString] isEqualToString:@"all"])
    {
        [sharedManager.reader suspendScan];  // stop all active readers
    }
    else
    {
        // stop a specific reader
    }
}

- (void)sendApdu:(CDVInvokedUrlCommand *)command
{
    
}

- (void)setReaderStatusChangeCallback:(CDVInvokedUrlCommand *)command
{
    readerStatusChange_callbackId = command.callbackId;
}

- (void)setReaderConnectCallback:(CDVInvokedUrlCommand*)command
{
    readerConnected_callbackId = command.callbackId;
}

////////////////////// INTERNAL FUNCTIONS /////////////////////////

/** Set the scan period (in ms) */
- (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId;
{
    NSString* trimmedString = [periodString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    int scanPeriod = [trimmedString intValue];
    //    int scanPeriod = [command.arguments objectAtIndex:0];
    
    if (scanPeriod > 0)
    {
        sharedManager.scanPeriod = [NSNumber numberWithInteger:scanPeriod];
        [sharedManager updateReaderSettings];
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
    NSString* toggle = [toggleString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    if ([[toggle lowercaseString] isEqualToString:@"true"])
    {
        sharedManager.scanSound = [NSNumber numberWithBool:YES];
        [sharedManager updateReaderSettings];
    }
    else if ([[toggle lowercaseString] isEqualToString:@"false"])
    {
        sharedManager.scanSound = [NSNumber numberWithBool:NO];
        [sharedManager updateReaderSettings];
    }
    else
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'true' or 'false' only"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

- (void)setMessageToWrite:(NSString *)message :(NSString *)callbackId
{
    if (![message isEqualToString:@""])
    {
        sharedManager.messageToWrite = message;
        [sharedManager updateReaderSettings];
    }
    else
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a non-empty message"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

- (void)setStartBlock:(NSString *)blockString :(NSString *)callbackId
{
    // TODO: input validation
    
    NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
    formatter.numberStyle = NSNumberFormatterDecimalStyle;
    NSNumber *startBlock = [formatter numberFromString:blockString];
    
    if (!startBlock == nil)
    {
        sharedManager.startBlock = startBlock;
        [sharedManager updateReaderSettings];
    }
    else
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a non-empty start block"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

- (void)setOperationState:(NSString *)state :(NSString *)callbackId
{
    if ([state isEqualToString:@"read-uid"])
    {
        sharedManager.operationState = kReadUUID;
        [sharedManager updateReaderSettings];
    }
    else if ([state isEqualToString:@"read-data-blocks"])
    {
        sharedManager.operationState = kReadDataBlocks;
        [sharedManager updateReaderSettings];
    }
    else if ([state isEqualToString:@"write-data-blocks"])
    {
        sharedManager.operationState = kWriteDataBlocks;
        [sharedManager updateReaderSettings];
    }
    else
    {
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a valid operation state"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

////////////////////// INTERNAL FLO-READER FUNCTIONS /////////////////////////

/** Called when the app becomes active */
- (void)active
{
    NSLog(@"App Activated");
    [sharedManager getAvailableReader];
}

/** Called when the app becomes inactive */
- (void)inactive
{
    [sharedManager.reader sleep];  // sleep all active readers
}

/** Sets the connected/disconnected image */
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView
{
    if (!reader.delegate)
    {
        reader.delegate = self; // Set reader delagate once it's clear reader's connected
    }
    
    imageView.hidden = NO;
    imageView.alpha = 1.0f;
    
    // Then fades away after 2 seconds (the cross-fade animation will take 0.5s)
    [UIView animateWithDuration:0.5 delay:2.0 options:0 animations:^{
        // Animate the alpha value of your imageView from 1.0 to 0.0 here
        imageView.alpha = 0.0f;
    } completion:^(BOOL finished) {
        // Once the animation is completed and the alpha has gone to 0.0, hide the view for good
        imageView.hidden = YES;
    }];
    
    imageView.center = [self.viewController.view convertPoint:self.viewController.view.center fromView:self.viewController.view.superview];
    [self.viewController.view addSubview:imageView];
}

/** Receives the list of connected peripherals */
- (void)didUpdateConnectedPeripherals:(NSArray *)peripherals
{
    connectedPeripherals = peripherals;
}

/** Receives the UUID of a scanned tag */
- (void)didFindATagUUID:(NSString *)UUID fromDevice:(NSString *)deviceId
{
    dispatch_async(dispatch_get_main_queue(), ^{
        //Use the main queue if the UI must be updated with the tag UUID or the deviceId
        NSLog(@"Found tag UUID: %@ from device:%@",UUID,deviceId);
        
        NSArray* result = [NSArray arrayWithObjects:UUID, deviceId, nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
        [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindATagUUID_callbackId];
    });
}

/** Receives data blocks from the active device */
- (void)didFindDataBlocks:(NSData *)data fromDevice:(NSString *)deviceId
{
    dispatch_async(dispatch_get_main_queue(), ^{
        //Use the main queue if the UI must be updated with the data or the deviceId
        NSLog(@"Found data blocks: %@ from device:%@",data,deviceId);
    });
}

/** Receives the battery level of the active device */
- (void)ReaderManager:(Reader *)reader didSendBatteryLevel:(int)level
{
    dispatch_async(dispatch_get_main_queue(), ^{
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:level];
        [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:readerStatusChange_callbackId];
    });
}

/** Receives the active device connect/disconnect */
- (void)ReaderManager:(Reader *)reader isConnected:(BOOL)connected
{
    dispatch_async(dispatch_get_main_queue(), ^{
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:connected];
        [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:readerConnected_callbackId];
    });
}

@end
