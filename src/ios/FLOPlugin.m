/*
FLOPlugin.m
Uses Flomio SDK version 1.8 (with Feitian support)
*/

#import "FLOPlugin.h"
#import <Cordova/CDV.h>

@implementation FLOPlugin

/** Starts the reader polling for tags */
- (void)startPolling:(CDVInvokedUrlCommand*)command
{
    NSString* readerType = [command.arguments objectAtIndex:0];

    if ([readerType isEqualToString:@"EMV"])  // EMV = Feitian
    {
        isCardConnected = NO;
        _readInf = [[ReaderInterface alloc]init];
        [_readInf setDelegate:self];
        SCardEstablishContext(SCARD_SCOPE_SYSTEM,NULL,NULL,&gContxtHandle);
        
        floConnected = NO;
        feitianConnected = YES;
        asyncCallbackId = command.callbackId;
    }
    else  // FLO = FloJack / FloBLE
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
        
        floConnected = YES;
        feitianConnected = NO;
        asyncCallbackId = command.callbackId;
        [self active];
    }
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
	
    if (floConnected)
    {
        [self inactive];
    }	
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

-(void)readCard
{
    LONG iRet = 0;
    DWORD dwActiveProtocol = -1;
    char mszReaders[128] = "";
    DWORD dwReaders = -1;
    
    iRet = SCardListReaders(gContxtHandle, NULL, mszReaders, &dwReaders);
    if(iRet != SCARD_S_SUCCESS)
    {
        NSLog(@"SCardListReaders error %08x",iRet);
        return;
    }
    
    isCardConnected = YES;
    
    iRet = SCardConnect(gContxtHandle,mszReaders,SCARD_SHARE_SHARED,SCARD_PROTOCOL_T0 | SCARD_PROTOCOL_T1,&gCardHandle,&dwActiveProtocol);
    if (iRet != 0) {
        
        //NSLog(@"SUCCESS!!!");
        NSLog(@"Read Failed.");
        
    }
    else {
        
        unsigned char patr[33];
        DWORD len = sizeof(patr);
        iRet = SCardGetAttrib(gCardHandle,NULL, patr, &len);
        if(iRet != SCARD_S_SUCCESS)
        {
            NSLog(@"SCardGetAttrib error %08x",iRet);
        }
        
        NSMutableData *tmpData = [NSMutableData data];
        [tmpData appendBytes:patr length:len];
        
        NSString* dataString= [NSString stringWithFormat:@"%@",tmpData];
        NSRange begin = [dataString rangeOfString:@"<"];
        NSRange end = [dataString rangeOfString:@">"];
        NSRange range = NSMakeRange(begin.location + begin.length, end.location- begin.location - 1);
        dataString = [dataString substringWithRange:range];
        
        DWORD pcchReaderLen;
        DWORD pdwState;
        DWORD pdwProtocol;
        len = sizeof(patr);
        pcchReaderLen = sizeof(mszReaders);
        
        iRet =  SCardStatus(gCardHandle,mszReaders,&pcchReaderLen,&pdwState,&pdwProtocol,patr,&len);
        if(iRet != SCARD_S_SUCCESS)
        {
            NSLog(@"SCardStatus error %08x",iRet);
            
        } else {
            
            [self sendCommand:@"FFCA000000"];
        }
        
    }
    
}

-(void)changeCardState
{
    
    NSLog(@"READ!!!");
    //[self sendCommand:@"FFCA000000"];
    
}

-(void)disAccDig {
    
    //[NSTimer scheduledTimerWithTimeInterval:7.0 target:self selector:@selector(foo) userInfo:nil repeats:YES];
    
    [self readCard];
}

-(void)sendCommand:(NSString *)command
{
    
    LONG iRet = 0;
    unsigned  int capdulen;
    unsigned char capdu[512];
    unsigned char resp[512];
    unsigned int resplen = sizeof(resp) ;
    
    NSString* tempBuf = [NSString string];
    
    
    if(([command length] == 0 ) )
    {
        
        
        return;
    }
    else
    {
        if([command length] < 5 )
        {
            NSLog(@"Invalid APDU.");
            return;
        }
    }
    
    
    tempBuf = command;
    
    NSString* comand = [tempBuf stringByAppendingString:@"\n"];
    const char *buf = [tempBuf UTF8String];
    NSMutableData *data = [NSMutableData data];
    uint32_t len = strlen(buf);
    
    //to hex
    char singleNumberString[3] = {'\0', '\0', '\0'};
    uint32_t singleNumber = 0;
    for(uint32_t i = 0 ; i < len; i+=2)
    {
        if ( ((i+1) < len) && isxdigit(buf[i]) && (isxdigit(buf[i+1])) )
        {
            singleNumberString[0] = buf[i];
            singleNumberString[1] = buf[i + 1];
            sscanf(singleNumberString, "%x", &singleNumber);
            uint8_t tmp = (uint8_t)(singleNumber & 0x000000FF);
            [data appendBytes:(void *)(&tmp) length:1];
        }
        else
        {
            break;
        }
    }
    for (int kkk=0; kkk<1; kkk++) {
        [data getBytes:capdu];
        resplen = sizeof(resp);
        capdulen = [data length];
        SCARD_IO_REQUEST pioSendPci;
        
        iRet=SCardTransmit(gCardHandle,&pioSendPci, (unsigned char*)capdu, capdulen,NULL,resp, &resplen);
        if (iRet != 0) {
            
            NSLog(@"ERROR SCardTransmit ret %08X.", iRet);
            NSMutableData *tmpData = [NSMutableData data];
            [tmpData appendBytes:resp length:capdulen*2];
            
            /*
             if(powerOn.enabled == NO){
             
             NSString* sending = NSLocalizedString(@"SEND_DATA", nil);
             NSString* sendComand = [NSString stringWithFormat:
             @"%@：%@",sending,comand];
             NSString* disText = disTextView.text;
             disText = [disText stringByAppendingString:sendComand];
             
             NSString* returnData = NSLocalizedString(@"RETURN_DATA", nil);
             NSString* errMSG = [NSString stringWithFormat:
             @"%@：%08X",@"ERROR SCardTransmit ret ",iRet];
             
             returnData = [returnData stringByAppendingString:errMSG];
             returnData = [returnData stringByAppendingString:@"\n"];
             disText = [disText stringByAppendingString:returnData];
             disTextView.text = disText;
             [self moveToDown];
             
             disText = disTextView.text;
             disTextView.text = disText;
             }
             
             sendCommand.enabled = YES;
             
             */
        }
        else {
            
            NSMutableData *tmpData = [NSMutableData data];
            [tmpData appendBytes:capdu length:capdulen*2];
            
            NSString* sending = NSLocalizedString(@"SEND_DATA", nil);
            NSString* sendComand = [NSString stringWithFormat:
                                    @"%@：%@",sending,comand];
            
            
            NSLog(@"sendCommand:%@",sendComand);
            
            /*
             NSString* disText = disTextView.text;
             disText = [disText stringByAppendingString:sendComand];
             disTextView.text = disText;
             */
            
            NSMutableData *RevData = [NSMutableData data];
            [RevData appendBytes:resp length:resplen];
            
            NSString* recData = [NSString stringWithFormat:@"%@", RevData];
            NSRange begin = [recData rangeOfString:@"<"];
            NSRange end = [recData rangeOfString:@">"];
            NSRange start = NSMakeRange(begin.location + begin.length, end.location - begin.location-1);
            recData = [recData substringWithRange:start];
            recData = [recData stringByAppendingString:@"\n"];
            
            NSString* returnData = NSLocalizedString(@"RETURN_DATA", nil);
            
            //recData = [NSString stringWithFormat:@"%@：%@",returnData,recData];
            
            NSString *trimmed = [recData stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
            trimmed = [trimmed stringByReplacingOccurrencesOfString:@" " withString:@""];
            NSString *ack = [trimmed substringFromIndex: [trimmed length] - 4];
            
            NSLog(@"recData:%@, %@",trimmed, ack);
            
            // Send the scan data
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",trimmed]];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
            
            if ([ack intValue] == 9000) {
                [_delegate didFeitianReaderSendUUID:[trimmed substringToIndex:[trimmed length] - 4] fromDevide:serialNumber];
            }
            
            
            /*
             disText = disTextView.text;
             disText = [disText stringByAppendingString:recData];
             disTextView.text = disText;
             [self moveToDown];
             
             sendCommand.enabled = YES;
             
             */
        }
    }
    
}

-(IBAction)getSerialNumber
{
    char buffer[20] = {0};
    unsigned int length = sizeof(buffer);
    LONG iRet = FtGetSerialNum(0,&length, buffer);
    if(iRet != 0 ){
        serialNumber = @"Get serial number ERROR.";
    }else {
        NSData *temp = [NSData dataWithBytes:buffer length:length];
        serialNumber = [NSString stringWithFormat:@"%@\n", temp];
    }
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

#pragma mark ReaderInterfaceDelegate Methods

- (void) cardInterfaceDidDetach:(BOOL)attached
{
    NSLog(@"BOOL:%i",attached);
    cardIsAttached = attached;
    
    if (attached == 1 && !isCardConnected) {
        //
        
        dispatch_async(dispatch_get_main_queue(), ^{
            //[self performSelector:@selector(sendCommand:) withObject:@"FFCA000000" afterDelay:10.0];
            [self sendCommand:@"FFCA000000"];
        });
        
        
        //[self sendCommand:@"FFCA000000"];
    } else if (attached == 0 && isCardConnected) {
        isCardConnected = NO;
    }
    
    //[self performSelectorOnMainThread:@selector(changeCardState) withObject:nil waitUntilDone:YES];
    
}

- (void) readerInterfaceDidChange:(BOOL)attached
{
    NSLog(@"RIDC %@ %d",NSStringFromSelector(_cmd),attached);
    
    if (attached) {
        [self getSerialNumber];
        [self performSelectorOnMainThread:@selector(disAccDig) withObject:nil waitUntilDone:YES];
    }
    else{
        [self performSelectorOnMainThread:@selector(disPowerOff) withObject:nil waitUntilDone:YES];
    }
    
}

@end
