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
        FmConfiguration *defaultConfiguration = [[FmConfiguration alloc] init];
        defaultConfiguration.deviceType = kFloBlePlus;
        defaultConfiguration.transmitPower = kHighPower;
        defaultConfiguration.scanSound = @YES;
        defaultConfiguration.scanPeriod = @1000;
        //    defaultConfiguration.tagDiscovery = k
        defaultConfiguration.powerOperation = kAutoPollingControl; //, kBluetoothConnectionControl for low power usage
        defaultConfiguration.allowMultiConnect = @NO;
        defaultConfiguration.specificDeviceUuid = nil; //@"RR330-000120";
        if (self.specificDeviceUuid){
            defaultConfiguration.specificDeviceUuid = self.specificDeviceUuid; //@"RR330-000120";
        }
        sharedManager = [[FmSessionManager flomioMW] initWithConfiguration:defaultConfiguration];
        sharedManager.delegate = self;
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

- (void )launchNativeNfc:(CDVInvokedUrlCommand*)command API_AVAILABLE(ios(11.0)) {
    [self startNfc];
    NSArray* result = @[@"Launch attempted"];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)selectSpecificDeviceId:(CDVInvokedUrlCommand*)command {
    if (command) {
        NSString *deviceId = [command.arguments objectAtIndex:0];
        if (deviceId.length > 6){ //can cause problems if not
            self.specificDeviceUuid = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];
        }
    }
}


- (void)getConfiguration:(CDVInvokedUrlCommand *)command {
    dispatch_async(dispatch_get_main_queue(), ^{
//        FmConfiguration *config = [sharedManager getConfiguration:deviceUuid];

//        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:settings];
//        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    });
}

- (void)getBatteryLevel:(CDVInvokedUrlCommand *)command {
    NSArray* result = @[self.latestBatteryLevel];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)getCommunicationStatus:(CDVInvokedUrlCommand *)command {
    NSArray* result = @[self.latestCommunicationStatus];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setConfiguration:(CDVInvokedUrlCommand*)command {
    NSString* scanPeriod = [command.arguments objectAtIndex:0];
    NSString* scanSound = [command.arguments objectAtIndex:1];

    NSString* powerOperationString = [command.arguments objectAtIndex:3];
    NSNumber* powerOperation;
    if ([[powerOperationString lowercaseString] isEqualToString:@"bluetooth-connection-control"]){
        powerOperation = [NSNumber numberWithInt:kBluetoothConnectionControl];
    } else { // default to @"auto-polling-control"
        powerOperation = [NSNumber numberWithInt:kAutoPollingControl];
    }
    FmConfiguration *configuration = [[FmConfiguration alloc] init];
    configuration.scanSound = [NSNumber numberWithBool:scanSound ];
    configuration.scanPeriod = [NSNumber numberWithInt:[scanPeriod intValue]];
    configuration.powerOperation = kHighPower;
    [sharedManager setConfiguration:configuration];
}

/** Send an APDU to a specific reader */
- (void)sendApdu:(CDVInvokedUrlCommand *)command {
    NSString* deviceUuid = [command.arguments objectAtIndex:0];
    NSString* apdu = [command.arguments objectAtIndex:1];

    deviceUuid = [deviceUuid stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
    apdu = [apdu stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace

    [sharedManager sendApdu:apdu  toDevice:deviceUuid success:^(NSString *response) {
        NSLog(@"command: %@, response: %@", apdu, response);
        if (response.length > 1){
            if ([response isEqualToString: @"63 00"]){
                double delayInSeconds = 0.5; //add delay to get rid of errors sending future commands
                dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
                dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                    NSArray* result = @[deviceUuid, response];
                    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
                    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                });
            } else {
                NSArray* result = @[deviceUuid, response];
                CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
                [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            }
            NSArray* result = @[deviceUuid, @""];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        }
    }];
}

- (void)sleepReaders:(CDVInvokedUrlCommand *)command {
    [sharedManager sleepReaders];
}

- (void)startReaders:(CDVInvokedUrlCommand *)command {
    [sharedManager startReaders];
}

- (void)stopReaders:(CDVInvokedUrlCommand *)command {
    [sharedManager stopReaders];
}



//- (void)write:(CDVInvokedUrlCommand *)command {
//    int currentPage;
//    int positionInEncodedString = 0; //offset between position in encodedDataString and data block in tag
//
//    didWriteNdefCallbackId = command.callbackId;
//   // muteDataCallbacks = YES;
//    NSString* deviceId = [command.arguments objectAtIndex:0];
//    deviceId = [deviceId stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
//
//    NSString* encodedDataString = [command.arguments objectAtIndex:1];
//    encodedDataString = [encodedDataString stringByReplacingOccurrencesOfString:@" " withString:@""];  // remove whitespace
//    NSString *encodedHexStringWithTLVValues = [self addTLVValues:encodedDataString];
//    while (encodedHexStringWithTLVValues.length % 8 != 0){
//        encodedHexStringWithTLVValues = [encodedHexStringWithTLVValues stringByAppendingString:@"0"];
//    }
//    for (FmDevice *device in connectedDevicesList) {
//        BOOL isCorrectDeviceId = [[device serialNumber] isEqualToString:[deviceId uppercaseString]];
//        NSLog(@"isCorrectDeviceId: %@", [NSNumber numberWithBool:isCorrectDeviceId]);
//
//        if ([[device serialNumber] isEqualToString:[deviceId uppercaseString]]) {
//            for (currentPage = 4; currentPage*4 <= encodedHexStringWithTLVValues.length; currentPage+=1){
//                NSUInteger length = encodedHexStringWithTLVValues.length;
//                NSLog(@"currentPage*4: %d", currentPage*4 );
//                NSLog(@"length %lu", (unsigned long)length);
//                NSLog(@"currentPage: %@", [NSString stringWithFormat:@"%02X", currentPage]);
//                NSString *next4BytesToWrite = [encodedHexStringWithTLVValues substringWithRange:NSMakeRange(positionInEncodedString, 8)];
//                NSLog(@"next4BytesToWrite: %@", next4BytesToWrite);
//                NSString *apdu = [NSString stringWithFormat: @"FF D6 00 %02X 04 %@",currentPage, next4BytesToWrite];
//                positionInEncodedString+=8;
//                int64_t delayInSeconds = 0.1;
//                dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
//                dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
//                    [device sendApduCommand:apdu];
//                });
//                if ([next4BytesToWrite containsString:@"fe"]){
//                    return;
//                }
//            }
//        }
//    }
    /*
    NSArray* result = @[deviceId, encodedDataString];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:didWriteNdefCallbackId];
     */
//}
//
//- (NSString *)addTLVValues: (NSString *)hexString {
//    NSLog(@"encodedDataString: %@", hexString);
//    NSString *tagString = @"03"; //null values and tag
//    NSString *length = [NSString stringWithFormat:@"%02lX", hexString.length/2];
//    NSLog(@"lenght: %@", length);
//    NSString *terminator = @"fe";
//    NSString *encodedHexStringWithTLVValues = [NSString stringWithFormat:@"%@%@%@%@",tagString,length,hexString,terminator];
//    NSLog(@"encodedHexStringWithTLVValues: %@", encodedHexStringWithTLVValues);
//    return encodedHexStringWithTLVValues;
//}

#pragma mark - Flomio Delegates

/** Called when any info from any device is updated */
- (void)didChangeStatus:(NSString *)deviceUuid withConfiguration:(FmConfiguration *)configuration andBatteryLevel:(NSNumber *)batteryLevel andCommunicationStatus:(CommunicationStatus)communicationStatus withFirmwareRevision:(NSString *)firmwareRev withHardwareRevision:(NSString *)hardwareRev{


    NSMutableArray* devices = [NSMutableArray array];
    NSMutableDictionary *deviceDictionary = [NSMutableDictionary new];
    deviceDictionary[@"Device ID"] = deviceUuid;
    deviceDictionary[@"Battery Level"] = batteryLevel;
    self.latestBatteryLevel = batteryLevel;
    deviceDictionary[@"Hardware Revision"] = hardwareRev;
    deviceDictionary[@"Firmware Revision"] = firmwareRev;
    deviceDictionary[@"Communication Status"] = [NSNumber numberWithInt: communicationStatus];
    self.latestCommunicationStatus = [NSNumber numberWithInt: communicationStatus];
    [devices addObject: deviceDictionary];
    dispatch_async(dispatch_get_main_queue(), ^{
        if (didUpdateConnectedDevicesCallbackId)
        {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:devices];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didUpdateConnectedDevicesCallbackId];
        }
    });
}

- (void)didFindTag:(FmTag *)tag fromDevice:(NSString *)deviceId{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSLog(@"Found tag UUID: %@ from device:%@", tag.uuid, deviceId);
        // send tag read update to Cordova
        if (didFindTagWithUuidCallbackId) {
            NSArray* result = @[deviceId, tag.uuid, tag.atr];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindTagWithUuidCallbackId];
        }
    });

}

//- (void)didFindTagWithData:(NSDictionary *)thisPayload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error{
//    NSMutableDictionary *mutableDictionary = [NSMutableDictionary new];
//    if (thisPayload[@"Uuid"]){
//        mutableDictionary[@"Uuid"] = thisPayload[@"Uuid"];
//    }
//    if (thisPayload[@"Raw Data"]){
//        mutableDictionary[@"Raw Data"] = thisPayload[@"Raw Data"];
//    }
//    if (thisPayload[@"Ndef"]){
//        NdefMessage *ndef = thisPayload[@"Ndef"];
//        NSMutableArray *ndefRecordsArray = [NSMutableArray array];
//        for (NdefRecord* record in ndef.ndefRecords) {
//            NSMutableDictionary* recordDictionary = [NSMutableDictionary new];
//            if (record.url.absoluteString){
//                recordDictionary[@"Url"] = record.url.absoluteString;
//            }
//            if (record.payloadString){
//                recordDictionary[@"Payload"] = record.payloadString;
//            }
//            if (record.typeString){
//                recordDictionary[@"Type"] = record.typeString;
//            }
//            if (record.theIdString){
//                recordDictionary[@"Id"] = record.theIdString;
//            }
//            [ndefRecordsArray addObject:recordDictionary];
//        }
//        mutableDictionary[@"Ndef"] = ndefRecordsArray;
//    }
//    dispatch_async(dispatch_get_main_queue(), ^{
//        NSDictionary *payload = [NSDictionary dictionaryWithDictionary:mutableDictionary];
//        if (didFindTagWithDataCallbackId) {
//            NSArray* result = @[deviceId, payload];
//            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
//            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
//            [self.commandDelegate sendPluginResult:pluginResult callbackId:didFindTagWithDataCallbackId];
//        }
//    });
//}
//setTagWrittenCallback

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
        if (didChangeCardStatusCallbackId){
            NSArray* result = @[deviceUuid, [NSNumber numberWithInt:status]];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsMultipart:result];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:didChangeCardStatusCallbackId];
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

- (void)setCardStatusChangeCallback:(CDVInvokedUrlCommand*)command
{
    didChangeCardStatusCallbackId = command.callbackId;
}

- (void)setTagDiscoveredCallback:(CDVInvokedUrlCommand*)command
{
    didFindTagWithUuidCallbackId = command.callbackId;
}

- (void)setNdefDiscoveredCallback:(CDVInvokedUrlCommand*)command
{
    didDetectNDEFsCallbackId = command.callbackId;
}


- (void)startNfc API_AVAILABLE(ios(11.0)){
    NSLog(@"In startNFC");
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
    NSLog(@"error: %@", error.description);
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
