//
//  ReaderManager.h
//  SDK
//
//  Created by Richard Grundy on 11/16/14.
//  Copyright (c) 2014 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>

#import "FmBluetoothSessionManager.h"
#import "FmAudioJackSessionManager.h"
#import "FmDevice.h"

@protocol FmSessionManagerDelegate<NSObject>

@optional

- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;

- (void)didFindATagUuid:(NSString *)UUID fromDevice:(NSString *)serialNumber withATR:(NSString *)detectedATR withError:(NSError *)error;
- (void)didFindADataBlockWithNdef:(NdefMessage *)ndef fromDevice:(NSString *)serialNumber withError:(NSError *)error;
- (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)serialNumber withError:(NSError *)error;
- (void)didUpdateConnectedDevices:(NSArray *)devices;
- (void)didReceiveReaderError:(NSError *)error;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;

// Bluetooth Methods
- (void)didMasterKeyUpdate:(BOOL)success withError:(NSError *)error;

@end

@interface FmSessionManager : NSObject <AVAudioPlayerDelegate, FmBluetoothSessionManagerDelegate, FmAudioJackSessionManagerDelegate> {
    
    // Reader Variables
    AVAudioPlayer *_audioPlayer;
    BOOL isAppLaunching;
    
    //2.0
    NSMutableArray *connectedDevices;
}

+ (id)sharedManager;

- (id)init;
- (void)createReaders;
- (void)startReaders;
- (void)stopReaders;
- (void)sleepReaders;
- (void)startReader:(NSString *)deviceSerialNumber;
- (void)stopReader:(NSString *)deviceSerialNumber;
- (void)sleepReader:(NSString *)deviceSerialNumber;
- (void)setConfiguration:(NSDictionary *)configurationDictionary; //initialize all devices configuration with this
- (void)setConfiguration:(NSDictionary *)configurationDictionary ofDevice:(NSString *)deviceSerialNumber;
- (NSDictionary *)getConfigurationOfDevice:(NSString *)deviceSerialNumber;
- (void)sendApdu:(NSString *)apdu toDevice:(NSString *)deviceSerialNumber;

@property (nonatomic, strong) id<FmSessionManagerDelegate> delegate;
@property (nonatomic) DeviceType selectedDeviceType;

#pragma mark - Flojack Properties
@property (nonatomic, strong) NSNumber *scanPeriod; // in milliseconds
@property (nonatomic, strong) NSNumber *scanSound;

#pragma  mark - FloBLE Plus and EMV Properties
@property (nonatomic, strong) FmBluetoothSessionManager *btManager;
@property (nonatomic, strong) FmAudioJackSessionManager *ajManager;
@property (nonatomic) PowerOperation powerOperation;
@property (nonatomic) ReaderStateType readerState;
@property (nonatomic) TransmitPower transmitPower;
@property (nonatomic, strong) NSNumber *allowMultiConnect;
@property (nonatomic, strong) NSString *specificDeviceId;

- (void)resetMasterKey:(NSString *)nmk withOldMasterKey:(NSString *)omk andReader:(FmBluetoothDevice *)btdevice;

@end

