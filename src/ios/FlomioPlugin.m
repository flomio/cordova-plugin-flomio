/*
 FlomioPlugin.m
 Uses Flomio SDK version 2.3
 */

#import "FlomioPlugin.h"

static inline char itoh(int i) {
    if (i > 9) return 'A' + (i - 10);
    return '0' + i;
}

NSString * NSDataToHex(NSData *data) {
    NSUInteger i, len;
    unsigned char *buf, *bytes;
    
    len = data.length;
    bytes = (unsigned char*)data.bytes;
    buf = malloc(len*2);
    
    for (i=0; i<len; i++) {
        buf[i*2] = itoh((bytes[i] >> 4) & 0xF);
        buf[i*2+1] = itoh(bytes[i] & 0xF);
    }
    
    return [[NSString alloc] initWithBytesNoCopy:buf
                                          length:len*2
                                        encoding:NSASCIIStringEncoding
                                    freeWhenDone:YES];
}

@implementation FlomioPlugin
    
    /** Initialise the plugin */
- (void)init:(CDVInvokedUrlCommand*)command {
    if (!sharedManager) {
        // Initialise flomioSDK
        self.deviceConfiguration = [[FmConfiguration alloc] init];
        self.deviceConfiguration.deviceType = self.selectedDeviceType ? self.selectedDeviceType : kFloBlePlus;
        self.deviceConfiguration.powerOperation = self.powerOperation ? self.powerOperation : kAutoPollingControl;
        self.deviceConfiguration.specificDeviceUuid = self.specificDeviceUuid; //@"RR330-000120";
        self.deviceConfiguration.transmitPower = kHighPower;
        self.deviceConfiguration.scanSound = @YES;
        self.deviceConfiguration.scanPeriod = @1000;
        self.deviceConfiguration.allowMultiConnect = @NO;
        sharedManager = [[FmSessionManager flomioMW] initWithConfiguration:self.deviceConfiguration];
        sharedManager.delegate = self;
        CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    } else {
        CDVPluginResult *pluginResult = [CDVPluginResult
                                         resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:@"Flomio SDK cannot be reinitialized"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}
    
- (void )launchNativeNfc:(CDVInvokedUrlCommand*)command API_AVAILABLE(ios(11.0)) {
    didDetectNDEFsCallbackId = command.callbackId;
    [self startNfc];
}
    
- (void)selectSpecificDeviceId:(CDVInvokedUrlCommand*)command {
    if (command) {
        NSString *deviceId = [command.arguments objectAtIndex:0];
        if (deviceId.length > 6){
            self.specificDeviceUuid = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];
        }
    }
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
- (void)getConfiguration:(CDVInvokedUrlCommand *)command {
    NSString *deviceId = [command.arguments objectAtIndex:0];
    FmConfiguration *config = [sharedManager getConfiguration:deviceId];
    NSString *deviceTypeString = nil;
    switch (self.selectedDeviceType) {
        case kFloBlePlus:
        deviceTypeString = @"floble-plus";
        break;
        default:
        break;
    }
    
    NSDictionary *responseConfiguration = @{
                                            @"deviceType" : deviceTypeString,
                                            @"powerOperation" : [NSNumber numberWithInt: config.powerOperation]
                                            };
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:responseConfiguration];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
- (void)getBatteryLevel:(CDVInvokedUrlCommand *)command {
    CDVPluginResult* pluginResult = [CDVPluginResult
                                     resultWithStatus:CDVCommandStatus_OK
                                     messageAsInt: [self.latestBatteryLevel intValue]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
- (void)getCommunicationStatus:(CDVInvokedUrlCommand *)command {
    CDVPluginResult* pluginResult = [CDVPluginResult
                                     resultWithStatus:CDVCommandStatus_OK
                                     messageAsInt: [self.latestCommunicationStatus intValue]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
- (void)setConfiguration:(CDVInvokedUrlCommand*)command {
    NSDictionary* config = [command.arguments objectAtIndex:0];
    NSString *deviceType = [[config objectForKey:@"deviceType"] stringByReplacingOccurrencesOfString:@" " withString:@""];
    if (([[deviceType lowercaseString] isEqualToString:@"floble-plus"]) ||
        ([[deviceType lowercaseString] isEqualToString:@"floble-plus-micro"]))
    {
        self.selectedDeviceType = kFloBlePlus;
    } else {
        self.selectedDeviceType = kFloBlePlus; //default to FloBle Plus
    }
    self.powerOperation = [[config objectForKey:@"powerOperation"] intValue];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
    /** Send an APDU to a specific reader */
- (void)sendApdu:(CDVInvokedUrlCommand *)command {
    NSString* deviceUuid = [command.arguments objectAtIndex:0];
    NSString* apdu = [command.arguments objectAtIndex:1];
    
    deviceUuid = [deviceUuid stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    apdu = [apdu stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    if (apdu.length == 0){
        CDVPluginResult* pluginResult = [CDVPluginResult
                                         resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsString:@"APDU must have a length greater than 0"];
        [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    [sharedManager sendApdu:apdu  toDevice:deviceUuid success:^(NSString *response) {
        NSLog(@"command: %@, response: %@", apdu, response);
        if (response.length > 1){
            if ([response isEqualToString: @"63 00"]){
                double delayInSeconds = 0.5; //add delay to get rid of errors sending future commands
                dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
                dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:
                                                     @"Tag was removed or there was an attempt to read/write to an unavailable page."];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                });
            } else {
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:response];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }
        } else {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No response"];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}
    
- (void)sleepReaders:(CDVInvokedUrlCommand *)command {
    [sharedManager sleepReaders];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
- (void)startReaders:(CDVInvokedUrlCommand *)command {
    [sharedManager startReaders];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
- (void)stopReaders:(CDVInvokedUrlCommand *)command {
    [sharedManager stopReaders];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
    
#pragma mark - Flomio Delegates
    
    /** Called when any info from any device is updated */
- (void)didChangeStatus:(NSString *)deviceUuid withConfiguration:(FmConfiguration *)configuration andBatteryLevel:(NSNumber *)batteryLevel andCommunicationStatus:(CommunicationStatus)communicationStatus withFirmwareRevision:(NSString *)firmwareRev withHardwareRevision:(NSString *)hardwareRev{
    NSMutableDictionary *deviceDictionary = [NSMutableDictionary new];
    deviceDictionary[@"deviceId"] = deviceUuid;
    deviceDictionary[@"batteryLevel"] = batteryLevel;
    self.latestBatteryLevel = batteryLevel;
    deviceDictionary[@"hardwareRevision"] = hardwareRev;
    deviceDictionary[@"firmwareRevision"] = firmwareRev;
    deviceDictionary[@"communicationStatus"] = [NSNumber numberWithInt: communicationStatus];
    self.latestCommunicationStatus = [NSNumber numberWithInt: communicationStatus];
    dispatch_async(dispatch_get_main_queue(), ^{
        if (didUpdateConnectedDevicesCallbackId)
        {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:deviceDictionary];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didUpdateConnectedDevicesCallbackId];
        }
    });
}
    
- (void)didFindTag:(FmTag *)tag fromDevice:(NSString *)deviceId{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Found tag UUID: %@ from device:%@", tag.uuid, deviceId);
        if (didFindTagWithUuidCallbackId) {
            NSDictionary* result = @{
                                     @"uuid": tag.uuid,
                                     @"atr": tag.atr
                                     };
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindTagWithUuidCallbackId];
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
    
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)deviceUuid {
    dispatch_async(dispatch_get_main_queue(), ^{
        // send card status change to Cordova
        if (didChangeTagStatusCallbackId){
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:status];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didChangeTagStatusCallbackId];
        }
    });
}
    
- (void)didGetLicenseInfo:(NSString *)deviceUuid withStatus:(BOOL)isRegistered {
    
}
    
#pragma mark - CallbackId setters
    
- (void)setConnectedDevicesUpdateCallback:(CDVInvokedUrlCommand*)command
    {
        didUpdateConnectedDevicesCallbackId = command.callbackId;
    }
    
- (void)setTagStatusChangeCallback:(CDVInvokedUrlCommand*)command
    {
        didChangeTagStatusCallbackId = command.callbackId;
    }
    
- (void)setTagDiscoveredCallback:(CDVInvokedUrlCommand*)command
    {
        didFindTagWithUuidCallbackId = command.callbackId;
    }
    
- (void)startNfc API_AVAILABLE(ios(11.0)){
    self.session = [[NFCNDEFReaderSession alloc] initWithDelegate:self queue:nil invalidateAfterFirstRead:YES];
    [self.session beginSession];
}
    
    // NFCNDEFReaderSessionDelegate delegates
    
- (void) readerSession:(nonnull NFCNDEFReaderSession *)session didDetectNDEFs:(nonnull NSArray<NFCNDEFMessage *> *)messages API_AVAILABLE(ios(11.0)){
    dispatch_async(dispatch_get_main_queue(), ^{
        if (messages[0]){
            NSArray *jsonNdef = [self ndefToJson: messages[0]]; //need to change to add multiple messages returned
            if (didDetectNDEFsCallbackId){
                NSLog(@"result : %@", jsonNdef);
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:jsonNdef];
                [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:didDetectNDEFsCallbackId];
            }
        }
    });
}
    
- (void) readerSession:(nonnull NFCNDEFReaderSession *)session didInvalidateWithError:(nonnull NSError *)error API_AVAILABLE(ios(11.0)) {
    CDVPluginResult* pluginResult = [CDVPluginResult
                                     resultWithStatus:CDVCommandStatus_ERROR
                                     messageAsString: [NSString
                                                       stringWithFormat: @"NFCNDEFReaderSession didInvalidateWithError %@", error.description]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:didDetectNDEFsCallbackId];
}
    
- (NSArray *)ndefToJson:(NFCNDEFMessage *)message API_AVAILABLE(ios(11.0)){
    NSMutableArray *ndefMessage = [[NSMutableArray alloc] init];
    
    for (NFCNDEFPayload *record in message.records){
        NSMutableDictionary *recordDict = [[NSMutableDictionary alloc] init];
        
        recordDict[@"id"] =  NSDataToHex(record.identifier);
        recordDict[@"type"] =  NSDataToHex(record.type);
        recordDict[@"payload"] =   NSDataToHex(record.payload);
        recordDict[@"tnf"] = [NSNumber numberWithInt:(int)record.typeNameFormat];
        [ndefMessage addObject:recordDict];
    }
    // Make immutable copy of the mutable array
    NSArray *array = [ndefMessage copy];
    return array;
}
    
- (NSString *)tnfToString:(NFCTypeNameFormat)tnf{
    switch (tnf) {
        case NFCTypeNameFormatAbsoluteURI:
        return @"NFCTypeNameFormatAbsoluteURI";
        break;
        case NFCTypeNameFormatEmpty:
        return @"NFCTypeNameFormatEmpty";
        break;
        case NFCTypeNameFormatMedia:
        return @"NFCTypeNameFormatMedia";
        break;
        case NFCTypeNameFormatNFCExternal:
        return @"NFCTypeNameFormatNFCExternal";
        break;
        case NFCTypeNameFormatNFCWellKnown:
        return @"NFCTypeNameFormatNFCWellKnown";
        break;
        case NFCTypeNameFormatUnchanged:
        return @"NFCTypeNameFormatUnchanged";
        break;
        default:
        return @"NFCTypeNameFormatUnknown";
        break;
    }
}
    @end

