//
//  FmSession.h
//  SDK
//
//  Created by Scott Condron on 22/11/2016.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//
//Responsibilities
//find readers
//create readers
//initialize and monitor connection
//check battery
//notify status change
//verify license
//initialize tag inventory
//manage tag inventory
//respond to sessionManager commands
//generate sessionManager notifications
//create tags
//record logs
//issue tag scan commands to reader

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "FmCustomTypes.h"
#import "FmConfiguration.h"
//readers
#import "AcsBtReader.h"
#import "FeitianBtReader.h"
#import "AcsAjReader.h"
#import "FeitianAjReader.h"
#import "uGrokitAjReader.h"

#import "FmTagInventory.h"

@protocol FmSessionDelegate<NSObject>

@optional

- (void)didGetDeviceInfoWith:(NSString *)deviceUuid withFirmwareRevision:(NSString *)firmwareRev withHardwareRevision:(NSString *)hardwareRev;
- (void)didGetLicenseInfo:(NSString *)deviceUuid withStatus:(BOOL)isRegistered;
- (void)didReceiveReaderError:(NSError *)error;
- (void)didGetResponseApdu:(NSString *)responseApdu;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didChangeStatus:(NSString *)device andBatteryLevel:(NSUInteger)batteryLevel andCommunicationStatus:(CommunicationStatus)communicationStatus;
- (void)didFindTag:(FmTag *)tag fromDevice:(NSString *)deviceUuid;

@end

@interface FmSession : NSObject <FmReaderDelegate, FmTagInventoryDelegate>

//Properties
//-license
//-connectionType
//-connectionMode
//-pollingType
//-tagInventory
//-currentTag
//-sessionState

@property (nonatomic, strong) id<FmSessionDelegate> delegate;
@property (nonatomic, strong) FmConfiguration *configuration;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
@property (nonatomic) NSUInteger batteryLevel;
@property (nonatomic, strong) FmReader *reader;
@property (nonatomic, strong) NSString *deviceUuid;
@property (nonatomic, strong) NSString *firmwareRevision;
@property (nonatomic, strong) NSString *hardwareRevision;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) FmTagInventory *tagInventory;
@property (nonatomic, strong) NSString *currentAtr;
@property (nonatomic) CardType currentCardType;

//tagUuid createTag
//foundNewTag:tag
//addTagToInventory:tag
//removeTagFromInventory:tag
//getTagInventory:tags

- (instancetype)initWithPeripheral:(CBPeripheral *)peripheral andConfiguration:(FmConfiguration *)configuration;
- (void)setConfiguration:(FmConfiguration *)configuration;
- (void)wakeReader;
- (void)sendApduCommand:(NSString *)command success:(void (^)(NSString *))completionBlock;
- (void)startReader;
- (void)stopReader;
- (void)sleepReader;
- (void)reconnectBluetoothReader;

@end
