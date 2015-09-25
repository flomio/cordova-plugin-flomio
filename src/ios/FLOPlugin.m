/*
FLOPlugin.m
Uses Flomio SDK version 1.6
*/

#import "FLOPlugin.h"
#import <Cordova/CDV.h>

@implementation FLOPlugin

/** Starts the reader polling for tags */
- (void)startPolling:(CDVInvokedUrlCommand*)command
{
    
    _readerManager = [[ReaderManager alloc] init];
    _readerManager.isFloBLEEnabled = [NSNumber numberWithBool:NO]; // Enable or Disable FloBLE as Needed
    _readerManager.isFlojackEnabled = [NSNumber numberWithBool:YES]; // Enable or Disable Flojack as Needed
    _readerManager.delegate = self;
    [_readerManager startReaders];
    
    //FloBLE Tag Type Strings, instantiate as a global variable in the header.
    _tagTypeStrings = @[@"UNKNOWN_TAG_TYPE", @"NFC_FORUM_TYPE_1", @"NFC_FORUM_TYPE_2", @"NFC_FORUM_TYPE_3", @"NFC_FORUM_TYPE_4", @"MIFARE_CLASSIC", @"TYPE_V"];  // this needs to equal the enum nfc_tag_types_t in floble.
    
    if (_readerManager.isFlojackEnabled == [NSNumber numberWithBool:YES]) {
        // Stop reader scan when the app becomes inactive
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(inactive) name:UIApplicationDidEnterBackgroundNotification object:nil];
        
        // Start reader scan when the app becomes active
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(active) name:UIApplicationDidBecomeActiveNotification object:nil];
    }
	
    asyncCallbackId = command.callbackId;
    [self active];
}

- (void)acknowledgeScan:(CDVInvokedUrlCommand*)command {
    
    NSString* lastReceivedScan = [command.arguments objectAtIndex:0];
	NSString* lastScanCopy;
	
	if(_readerManager.isFlojackEnabled) {
		lastScanCopy = [NSString stringWithFormat:@"%@",lastScan];
	} else {
		lastScanCopy = lastFloBleScan;
	}

	if([lastReceivedScan isEqualToString:lastScanCopy]) {
		NSString* message = [NSString stringWithFormat:@"%@%@%@", @"Last scan with UID ", lastScanCopy ,@" received"];
		[ToastView showToastInParentView:self.viewController.view withText:message withDuration:2.0];
	} else {
		[ToastView showToastInParentView:self.viewController.view withText:@"Last scan not properly received. Re-sending..." withDuration:2.0];
		
		// Send the scan data again
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",lastScan]];
        [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
	}
}

/** Stops the reader polling for tags */
- (void)stopPolling:(CDVInvokedUrlCommand*)command {
	
	[self inactive];
}

/** Initial setup once app is active */
- (void)active {
    NSLog(@"App Activated");
    [_readerManager getAvailableReader];
    _readerManager.deviceEnabled = [NSNumber numberWithBool:YES]; //enable the reader
    _readerManager.scanPeriod = [NSNumber numberWithInteger:500]; //in ms
    _readerManager.scanSound = [NSNumber numberWithBool:YES]; //play scan sound
    _readerManager.operationState = kReadUUID; //kReadDataBlocks or kWriteDataBlocks
    _readerManager.startBlock = [NSNumber numberWithInteger:8]; //start reading from 4th data block
    _readerManager.messageToWrite = @"http://flomio.com"; // set a default message to write
	
	NSString* deviceInfo;
	if(_readerManager.isFlojackEnabled) {
		deviceInfo = [NSString stringWithFormat:@"{\"id\":\"%@\",\"type\":\"%@\"}", _readerManager.reader.deviceId, @"FloJack"];
	} else {
		deviceInfo = [NSString stringWithFormat:@"{\"id\":\"%@\",\"type\":\"%@\"}", _readerManager.reader.deviceId, @"FloBLE"];
	}
    
    NSLog(deviceInfo);
    NSArray* result = [NSArray arrayWithObjects:@"READER_STATUS_ACTIVE", deviceInfo, nil];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
}

/** Send reader to sleep once app becomes inactive */
- (void)inactive {
    
    [_readerManager.reader sleep];
    
	NSString* deviceInfo;
	if(_readerManager.isFlojackEnabled) {
		deviceInfo = [NSString stringWithFormat:@"{\"id\":\"%@\",\"type\":\"%@\"}", _readerManager.reader.deviceId, @"FloJack"];
	} else {
		deviceInfo = [NSString stringWithFormat:@"{\"id\":\"%@\",\"type\":\"%@\"}", _readerManager.reader.deviceId, @"FloBLE"];
	}
	
    NSLog(deviceInfo);
    NSArray* result = [NSArray arrayWithObjects:@"READER_STATUS_INACTIVE", deviceInfo, nil];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
}

#pragma mark - ReaderManagerDelegate

- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView {
    if (!reader.delegate) {
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

#pragma mark - ReaderDelegate

/** Called every time a compatible tag is found */
- (void)didFindATag:(Tag *)tag withOperationState:(ReaderStateType)operationState withError:(NSError *)error {
    dispatch_async(dispatch_get_main_queue(), ^{ // Second dispatch message to log tag and restore screen
        if (!error) {
            switch (operationState) {
                case kReadUUID: {
                    NSLog(@"%@",tag.data); // Log the UUID
					lastScan = tag.data;
					
					NSString* tagUid = [NSString stringWithFormat:@"%@", tag.data];
					// NSString* tagType = [NSString* stringWithFormat:@"%@", tag.data];
                    NSString* tagType = @"TAG_TYPE";
					NSArray* result = [NSArray arrayWithObjects:tagUid, tagType, nil];
					
					CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
                    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
                    break;
                }
                case kReadDataBlocks: {
                    NSLog(@"%@",tag.data); // Log the Data
                    NDEFMessage *newMessage = [[NDEFMessage alloc] initWithByteBuffer:tag.data];
                    NSLog(@"%@",newMessage); // Log the NDEF
                    break;
                }
                case kWriteDataBlocks: {
                    break;
                }
                default:
                    break;
            }
        } else {
            NSLog(@"%@",error.userInfo); // Log the error
        }
    });
}

- (void)setDeviceStatus:(BOOL)enabled {
    _readerManager.deviceEnabled = [NSNumber numberWithBool:enabled];
}

#pragma mark - FLOBLE ReaderManagerDelegate Methods

- (void)floReaderManager:(ReaderManager *)theFloReaderManager didWriteTagAndStatusWas:(NSInteger)statusCode {
	[self floReaderManager:theFloReaderManager didWriteTagAndStatusWas:statusCode];  
}

- (void)floReaderManager:(ReaderManager *)floReaderManager didScanTag:(FJNFCTag *)theNfcTag fromDevice:(NSString *)deviceId {
    NSLog(@"Tag detected: %@ from Device:%@",[theNfcTag.uid fj_asHexString], deviceId);
	
    NSLog(@"%@", [theNfcTag.uid fj_asHexString]); // Log the UUID
	lastFloBleScan = [theNfcTag.uid fj_asHexString];
	
	NSString* tagUid = [NSString stringWithFormat:@"%@", [theNfcTag.uid fj_asHexString]];
	// NSString* tagType = [NSString* stringWithFormat:@"%@", tag.data];
    NSString* tagType = @"TAG_TYPE";
	NSArray* result = [NSArray arrayWithObjects:tagUid, tagType, nil];
	
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
}

- (void)floReaderManager:(ReaderManager *)floReaderManager didHaveStatus:(NSInteger)statusCode {
}

- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveFirmwareVersion:(NSString *)theVersionNumber {
}

- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveHardwareVersion:(NSString *)theVersionNumber; {
}

- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveSnifferThresh:(NSString *)theSnifferValue; {
}

- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveSnifferCalib:(NSString *)theCalibValues; {
}

@end