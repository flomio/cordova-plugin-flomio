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
	dispatch_async(dispatch_get_main_queue(), ^{
	    sharedManager = [ReaderManager sharedManager];
	    sharedManager.delegate = self;
	    [sharedManager startReaders];
	    
	    // Initialise strings
	    activeReaderType = @"null";
	    didFindATagUUID_callbackId = @"null";
	    readerStatusChange_callbackId = @"null";
	    apduResponse_callbackId = @"null";
	    flobleConnected_callbackId = @"null";
	    readerTable = [NSMutableDictionary dictionary];
	    
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
	});
}

/** Update settings for a particular reader */
- (void)setReaderSettings:(CDVInvokedUrlCommand*)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSString* deviceId = [command.arguments objectAtIndex:0];
	    if (![self validateDeviceId:deviceId])
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a valid reader UID"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	        return;
	    }
	    
	    NSString* scanPeriod = [command.arguments objectAtIndex:1];
	    NSString* scanSound = [command.arguments objectAtIndex:2];
	    NSString* operationState = [command.arguments objectAtIndex:3];
	    NSString* startBlock = [command.arguments objectAtIndex:4];
	    NSString* messageToWrite = [command.arguments objectAtIndex:5];
	    
	    NSString* callbackId = command.callbackId;
	    [self setScanPeriod:[NSString stringWithFormat:@"%@", scanPeriod] :deviceId :callbackId];
	    [self toggleScanSound:scanSound :deviceId :callbackId];
	    [self setOperationState:operationState :deviceId :callbackId];
	    [self setStartBlock:[NSString stringWithFormat:@"%@", startBlock] :deviceId :callbackId];
	    [self setMessageToWrite:messageToWrite :deviceId :callbackId];
	    
	    [sharedManager updateReaderSettings];
	});
}

/** Retrieve settings for a particular reader */
- (void)getReaderSettings:(CDVInvokedUrlCommand *)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSString* deviceId = [command.arguments objectAtIndex:0];
	    if (![self validateDeviceId:deviceId])
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a valid reader UID"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	        return;
	    }
	    
	    NSString* operationState;
	    if (sharedManager.operationState == kReadUUID)
	    {
	        operationState = @"read-uid";
	    }
	    else if (sharedManager.operationState == kReadUUID)
	    {
	        operationState = @"read-data-blocks";
	    }
	    else if (sharedManager.operationState == kReadUUID)
	    {
	        operationState = @"write-data-blocks";
	    }
	    
	    NSArray* settings = @[sharedManager.scanPeriod, sharedManager.scanSound, operationState, sharedManager.startBlock, sharedManager.messageToWrite];
	    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:settings];
	    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	});
}

/** Stops active readers of the current type then activates readers of the new type */
- (void)selectReaderType:(CDVInvokedUrlCommand*)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSString* readerType = [command.arguments objectAtIndex:0];
	    readerType = [readerType stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
	    [sharedManager.reader suspendScan];  // stop all active readers
	    
	    if ([[readerType lowercaseString] isEqualToString:@"flojack"])
	    {
	        activeReaderType = @"flojack";
	        [sharedManager setDeviceType:kFlojack];
	    }
	    else if ([[readerType lowercaseString] isEqualToString:@"floble-emv"])
	    {
	        activeReaderType = @"floble-emv";
	        [sharedManager setDeviceType:kFloBleEmv];
	    }
	    else if ([[readerType lowercaseString] isEqualToString:@"floble-plus"])
	    {
	        activeReaderType = @"floble-plus";
	        [sharedManager setDeviceType:kFloBlePlus];
	    }
	    else
	    {
	        activeReaderType = @"null";
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter 'FloJack', 'FloBLE-EMV' or 'FloBLE-Plus' only"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	    }
        
        [sharedManager startReaders];
	});
}

/** Starts the reader polling for tags */
- (void)startReader:(CDVInvokedUrlCommand*)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    didFindATagUUID_callbackId = command.callbackId;
	    NSString* deviceId = [command.arguments objectAtIndex:0];
	    
	    if ([activeReaderType isEqualToString:@"null"])
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Select a reader type first"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindATagUUID_callbackId];
	    }
	    else if ([[deviceId lowercaseString] isEqualToString:@"all"])
	    {
	        [sharedManager.reader startScan];  // start all active readers
	    }
	    else
	    {
	        // start a specific reader
	    }
	});
}

/** Stops the reader polling for tags */
- (void)stopReader:(CDVInvokedUrlCommand*)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSString* deviceId = [command.arguments objectAtIndex:0];
	    deviceId = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
	    
	    if ([activeReaderType isEqualToString:@"null"])
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Select a reader type first"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	    }
	    else if ([[deviceId lowercaseString] isEqualToString:@"all"])
	    {
	        [sharedManager.reader suspendScan];  // stop all active readers
	    }
	    else
	    {
	        // stop a specific reader
	    }
	});
}

/** Send an APDU to a specific reader */
- (void)sendApdu:(CDVInvokedUrlCommand *)command
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSString* deviceId = [command.arguments objectAtIndex:0];
	    if (![self validateDeviceId:deviceId])
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a valid reader UID"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	        return;
	    }
	    
	    apduResponse_callbackId = command.callbackId;
	    
	    // TODO: send APDU to reader
	});
}

/** Set callback for ALL reader status change events */
- (void)setReaderStatusChangeCallback:(CDVInvokedUrlCommand *)command
{
    readerStatusChange_callbackId = command.callbackId;
}

- (void)setFlobleConnectCallback:(CDVInvokedUrlCommand*)command
{
	flobleConnected_callbackId = command.callbackId;
}

////////////////////// INTERNAL FUNCTIONS /////////////////////////

/** Validates device UIDs */
- (BOOL)validateDeviceId:(NSString *)deviceId
{
    deviceId = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
    // TODO: input validation
    return TRUE;
}

/** Set the scan period (in ms) */
- (void)setScanPeriod:(NSString*)periodString :(NSString*)deviceId :(NSString*)callbackId;
{
    periodString = [periodString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
	dispatch_async(dispatch_get_main_queue(), ^{
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
	});
}

/** Toggle on/off scan sound */
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)deviceId :(NSString*)callbackId;
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    NSString* toggle = [toggleString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
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
	});
}

/** Sets the default message for ALL devices to write */
- (void)setMessageToWrite:(NSString *)message :(NSString*)deviceId :(NSString *)callbackId
{
	dispatch_async(dispatch_get_main_queue(), ^{
	    if ([[message lowercaseString] isEqualToString:@"unchanged"])
	    {
	        return;
	    }
	    
	    if (![message isEqualToString:@""])
	    {
	        sharedManager.messageToWrite = message;
	    }
	    else
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a non-empty message"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
	    }
	});
}

/** Sets the block to start reading data from on ALL devices */
- (void)setStartBlock:(NSString *)blockString :(NSString*)deviceId :(NSString *)callbackId
{
    blockString = [blockString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
	dispatch_async(dispatch_get_main_queue(), ^{
	    if ([[blockString lowercaseString] isEqualToString:@"unchanged"])
	    {
	        return;
	    }
	    
	    // TODO: start block input validation
	    
	    NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
	    formatter.numberStyle = NSNumberFormatterDecimalStyle;
	    NSNumber *startBlock = [formatter numberFromString:blockString];
	    
	    if (startBlock != nil)
	    {
	        sharedManager.startBlock = startBlock;
	    }
	    else
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a non-empty start block"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
	    }
	});
}

/** Set the operation state for a specific reader */
- (void)setOperationState:(NSString *)state :(NSString*)deviceId :(NSString *)callbackId
{
    state = [state stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    
	dispatch_async(dispatch_get_main_queue(), ^{
	    if ([[state lowercaseString] isEqualToString:@"unchanged"])
	    {
	        return;
	    }
	    
	    if ([state isEqualToString:@"read-uid"])
	    {
	        sharedManager.operationState = kReadUUID;
	        
	    }
	    else if ([state isEqualToString:@"read-data-blocks"])
	    {
	        sharedManager.operationState = kReadDataBlocks;
	    }
	    else if ([state isEqualToString:@"write-data-blocks"])
	    {
	        sharedManager.operationState = kWriteDataBlocks;
	    }
	    else
	    {
	        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Enter a valid operation state"];
	        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
	    }
	});
}

////////////////////// INTERNAL FLO-READER FUNCTIONS /////////////////////////

/** Called when the app becomes active */
- (void)active
{	
	dispatch_async(dispatch_get_main_queue(), ^{
    	NSLog(@"App Activated");
    	[sharedManager getAvailableReader];
    });
}

/** Called when the app becomes inactive */
- (void)inactive
{
	dispatch_async(dispatch_get_main_queue(), ^{
    	[sharedManager.reader sleep];  // sleep all active readers
    });
}

/** Sets the connected/disconnected image */
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView
{
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
	dispatch_async(dispatch_get_main_queue(), ^{
        NSString* deviceId = peripherals[0];
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:deviceId];
		[pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    	[self.commandDelegate sendPluginResult:pluginResult callbackId:flobleConnected_callbackId];
    });
}

/** Receives the UUID of a scanned tag */
- (void)didFindATagUUID:(NSString *)UUID fromDevice:(NSString *)deviceId
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Found tag UUID: %@ from device:%@",UUID,deviceId);
        
        // send tag read update to Cordova
        if (![didFindATagUUID_callbackId isEqualToString:@"null"])
        {
            NSArray* result = @[deviceId, UUID];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindATagUUID_callbackId];
        }
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
        NSString* deviceId = @"deviceId";  // TODO: remove placeholder value
        
        // required if this callback is called before isConnected
        if (![[readerTable allKeys] containsObject:deviceId])
        {
            NSMutableDictionary* newDevice = [NSMutableDictionary
                                              dictionaryWithDictionary:@{
                                                                         @"connected": [NSNumber numberWithBool:TRUE],
                                                                         @"batteryLevel": [NSNumber numberWithInt:-1]
                                                                         }];
            [readerTable setObject:newDevice forKey:deviceId];
        }
        
        if ([NSNumber numberWithInt:level] != readerTable[deviceId][@"batteryLevel"])  // if battery level has changed
        {
            // update battery level in the reader table
            NSMutableDictionary* device = [readerTable objectForKey:deviceId];
            [device setObject:[NSNumber numberWithInt:level] forKey:@"batteryLevel"];
            [readerTable setObject:device forKey:deviceId];
            
            // send status update to Cordova
            if (![readerStatusChange_callbackId isEqualToString:@"null"])
            {
                NSArray* result = @[deviceId, readerTable[deviceId][@"connected"], readerTable[deviceId][@"batteryLevel"]];
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
                [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:readerStatusChange_callbackId];
            }
        }
    });
}

/** Receives the active device connect/disconnect */
- (void)ReaderManager:(Reader *)reader isConnected:(BOOL)connected
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSString* deviceId = @"deviceId";  // TODO: remove placeholder value
        BOOL firstConnect = FALSE;
        
        // required if this callback is called before didSendBatteryLevel
        if (![[readerTable allKeys] containsObject:deviceId])
        {
            firstConnect = TRUE;
            NSMutableDictionary* newDevice = [NSMutableDictionary
                                              dictionaryWithDictionary:@{
                                                                         @"connected": [NSNumber numberWithBool:connected],
                                                                         @"batteryLevel": [NSNumber numberWithInt:-1]
                                                                         }];
            [readerTable setObject:newDevice forKey:deviceId];
        }
        
        if (([NSNumber numberWithBool:connected] != readerTable[deviceId][@"connected"]) || firstConnect)  // if status has changed or first connection event
        {
            // update connection status in the reader table
            NSMutableDictionary* device = [readerTable objectForKey:deviceId];
            [device setObject:[NSNumber numberWithBool:connected] forKey:@"connected"];
            [readerTable setObject:device forKey:deviceId];
            
            // send status update to Cordova
            if (![readerStatusChange_callbackId isEqualToString:@"null"])
            {
                NSArray* result = @[deviceId, readerTable[deviceId][@"connected"], readerTable[deviceId][@"batteryLevel"]];
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
                [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:readerStatusChange_callbackId];
            }
        }
    });
}

@end
