//
//  ReaderManager.h
//  SDK
//
//  Created by Richard Grundy on 11/16/14.
//  Copyright (c) 2014 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

#pragma mark - Flojack Imports

#import <AudioToolbox/AudioToolbox.h>
#import "Reader.h"

#pragma mark - FloBLE Imports

#import "NFCMessage.h"
#import "FLOTag.h"
#import "Logging.h"

#pragma mark - bR500 Imports

#import "FeitianReader.h"

#pragma mark - ACSBTReader Imports

#import "ACSBTReader.h"

typedef NS_ENUM(NSInteger, DeviceType) {
    kFlojack,
    kFloBleEmv,
    kFloBlePlus,
    kFloBleMini,
};


@protocol ReaderManagerDelegate;

@interface ReaderManager : NSObject <AVAudioPlayerDelegate, FeitianReaderDelegate, ReaderDelegate, ACSBTReaderDelegate> {
    
    // Reader Variables
    NSMutableData *_lastMessageSent;
    AVAudioPlayer *_audioPlayer;
    NSInteger  nDiscoveredChars;
    NSMutableArray *connectedFloBLEs;
    BOOL isAppLaunching;
    NSMutableArray *generatedUUIDsArray;
    NSMutableArray *activePeripherals;
    NSMutableArray *activeACSReaders;
    NSArray *connectedPeripherals;
    DeviceType selectedDeviceType;
    NSTimer *timer;
}

+ (id)sharedManager;

- (id)init;
- (void)startReaders;
- (void)stopReaders;
- (void)setDeviceType:(int)type;
- (int)getDeviceType;
- (void)communicationUpdate;
- (void)updateReaderSettings;

#pragma mark - Flojack Methods

- (Reader*)getAvailableReader;
- (void)handleRouteChange:(NSNotification*)notification;
- (NSNumber *)isReaderConnected;

#pragma mark - Flojack Properties

@property (nonatomic, strong) id<ReaderManagerDelegate> delegate;
@property (nonatomic, strong) Reader *reader;
@property (nonatomic, strong) NSNumber *deviceEnabled;
@property (nonatomic, strong) NSNumber *scanPeriod; // in milliseconds
@property (nonatomic, assign) NSNumber *scanSound;
@property (nonatomic, assign) ReaderStateType operationState;
@property (nonatomic, strong) NSNumber *startBlock;
@property (nonatomic, strong) NSString *messageToWrite;
@property (nonatomic, strong) NSNumber *isFloBLEConnected;

#pragma  mark - FloBLE Plus and EMV Properties

@property (nonatomic, strong) ACSBTReader *acsbtReader;
@property (nonatomic, strong) FeitianReader *br500;

#pragma mark - FloBLE Mini Properties

@property (nonatomic) BOOL pollFor14443aTags;
@property (nonatomic) BOOL pollFor15693Tags;
@property (nonatomic) BOOL pollForFelicaTags;
@property (nonatomic) BOOL standaloneMode;

// Set the tag polling rate in milliseconds. Value must be in range [0, 6375] and an increment of 25.
@property (nonatomic) NSInteger pollPeriod;

- (void)sendAPDUtoDevice:(NSString *)apdu;

@end

@protocol ReaderManagerDelegate<NSObject>

@required

//Flojack Methods
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView;
- (void)ReaderManager:(Reader *)reader isConnected:(BOOL)connected;
- (void)ReaderManager:(Reader *)reader didSendBatteryLevel:(int)level;

@optional

//FloBLE Methods
- (void)floReaderManager:(ReaderManager *)floReaderManager didScanTag:(FJNFCTag *)theNfcTag fromDevice:(NSString *)deviceId;
- (void)floReaderManager:(ReaderManager *)floReaderManager didWriteTagAndStatusWas:(NSInteger)statusCode;
- (void)floReaderManager:(ReaderManager *)floReaderManager didHaveStatus:(NSInteger)statusCode;
- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveFirmwareVersion:(NSString *)theVersionNumber;
- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveHardwareVersion:(NSString *)theVersionNumber;
- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveSnifferThresh:(NSString *)theSnifferValue;
- (void)floReaderManager:(ReaderManager *)floReaderManager didReceiveSnifferCalib:(NSString *)theCalibValues;
- (void)didReceiveServiceFirmwareVersion:(NSString *)theVersionNumber;
- (void)didReceivedImageBlockTransferCharacteristic:(NSData*)imageBlockCharacteristic;
- (void)didReceivedImageIdentifyCharacteristic:(NSData*)imageBlockCharacteristic;
- (void)didUpdateConnectedPeripherals:(NSArray *)peripherals;

//ACSBTReader
- (void)didFindATagUUID:(NSString *)UUID fromDevice:(NSString *)deviceId;
- (void)didFindDataBlocks:(NSData *)data fromDevice:(NSString *)deviceId;
- (void)didRespondToAPDUCommand:(NSString *)UUID fromDevice:(NSString *)deviceId;

//BR500 Reader
- (void)didUpdateConnectedBR500:(NSArray *)peripherals;

@end