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
    [sharedManager startReaders];
    
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

/** Set the scan period (in ms) */
- (void)setScanPeriod:(CDVInvokedUrlCommand*)command
{
    NSString* scanPeriodString = [command.arguments objectAtIndex:0];
    NSString* trimmedString = [scanPeriodString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    int scanPeriod = [trimmedString intValue];
    
    if (scanPeriod > 0)
    {
        sharedManager.scanPeriod = [NSNumber numberWithInteger:scanPeriod];
        [sharedManager updateReaderSettings];
    }
    else
    {
        // throw error
    }
}

/** Toggle on/off scan sound */
- (void)setScanSound:(CDVInvokedUrlCommand *)command
{
    NSString* scanSound = [command.arguments objectAtIndex:0];
    NSString* trimmedString = [scanSound stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    if ([[trimmedString lowercaseString] isEqualToString:@"true"])
    {
        sharedManager.scanSound = [NSNumber numberWithBool:YES];
        [sharedManager updateReaderSettings];
    }
    else if ([[trimmedString lowercaseString] isEqualToString:@"false"])
    {
        sharedManager.scanSound = [NSNumber numberWithBool:NO];
        [sharedManager updateReaderSettings];
    }
    else
    {
        // throw error
    }
}

/** Select the active reader */
- (void)selectReader:(CDVInvokedUrlCommand*)command
{
    NSString* readerType = [command.arguments objectAtIndex:0];
    NSString* trimmedString = [readerType stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    if ([[trimmedString lowercaseString] isEqualToString:@"flojack"])
    {
        [sharedManager setDeviceType:kFlojack];
    }
    else if ([[trimmedString lowercaseString] isEqualToString:@"floble-emv"])
    {
        [sharedManager setDeviceType:kFloBleEmv];
    }
    else if ([[trimmedString lowercaseString] isEqualToString:@"floble-plus"])
    {
        [sharedManager setDeviceType:kFloBlePlus];
    }
    else
    {
        // throw error
    }
}

/** Starts the reader polling for tags */
- (void)startPolling:(CDVInvokedUrlCommand*)command
{
    [sharedManager.reader startScan];  // start the active reader
    didFindATagUUID_callbackId = command.callbackId;
}

/** Stops the reader polling for tags */
- (void)stopPolling:(CDVInvokedUrlCommand*)command
{
    [sharedManager.reader sleep];  // stop the active reader
}

/** Called when the app becomes active */
- (void)active
{
    NSLog(@"App Activated");
    [sharedManager getAvailableReader];
}

/** Called when the app becomes inactive */
- (void)inactive
{
    [sharedManager.reader sleep];
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
    //Return the list of connected peripherals
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
        //Use the main queue if the UI must be updated with level
    });
}

- (void)ReaderManager:(Reader *)reader isConnected:(BOOL)connected
{
    //TRUE or FALSE 
}

@end
