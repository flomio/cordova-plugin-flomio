//
//  FmReader.h
//  SDK
//
//  Created by Scott Condron on 23/11/2016.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//
//
//Responsibilities
//control reader
//monitor scanner
//control tag
//monitor reader condition
//notify session of reader condition
//notify session of tag detection

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "FmConfiguration.h"
#import "FmErrorManager.h"
#import "FmApduTransceiver.h"
#import "FmNdefManager.h"

@protocol FmReaderDelegate<NSObject>

@required

- (void)didAddTagToUuidInventory:(NSString *)uuid;
- (void)didFindExistingTag:(NSString *)uuid;
- (void)didGetAtr:(NSString *)atr withCardType:(CardType)cardType;
- (void)didGetBatteryLevel:(NSInteger)batteryLevel;
- (void)didGetCommunicationStatus:(CommunicationStatus)communicationStatus;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didGetDeviceInfoWith:(NSString *)deviceUuid withFirmwareRevision:(NSString *)firmwareRev withHardwareRevision:(NSString *)hardwareRev;
- (void)didReceiveReaderError:(NSError *)error;

@end

@interface FmReader : NSObject

@property (nonatomic, strong) id<FmReaderDelegate> delegate;
@property (nonatomic, assign) DeviceType type;
@property (nonatomic) NSUInteger batteryLevel;
@property (nonatomic, strong) NSString *deviceUuid;
@property (nonatomic, strong) NSString *hardwareRevision;
@property (nonatomic, strong) NSString *firmwareRevision;

@property (nonatomic, strong) NSMutableArray *tagUuidInventory;
@property (nonatomic, strong) NSString *currentAtr;
@property (nonatomic, strong) NSString *currentUuid;
@property (nonatomic, strong) NSString *currentApdu;
@property (nonatomic, strong) NSString *currentResponse;
@property (nonatomic, strong) NSString *apduRequestUuid;
@property (nonatomic, strong) FmApduTransceiver *apduTransceiver;

//These methods which must be overwritten by subclassess

//init used for BT readers
- (instancetype)initWithPeripheral:(CBPeripheral *)peripheral andConfiguration:(FmConfiguration *)configuration;
//init used for AJ readers
+ (instancetype)initSharedInstanceWithParent:(id)parent andConfiguration:(FmConfiguration *)confuration;
- (void)setConfiguration:(FmConfiguration *)configuration;
- (void)getDeviceInfo;
- (void)startReader;
- (void)stopReader;
- (void)sleepReader;
- (void)sendApduCommand:(NSString *)command success:(void (^)(NSString *))completionBlock;

//Other methods used by individual readers

- (void)wakeReader;
- (void)reconnectBluetoothReader;
- (void)updateCeNdef:(NdefMessage *)ndef;

//General Methods exclusive to FmReader superclass
- (BOOL)determineIfNewUuid:(NSString *)uuid;
- (void)addUuidToTagInventory:(NSString *)uuid;
- (NSString *)handleApduResponse:(NSString *)responseString;

@end
