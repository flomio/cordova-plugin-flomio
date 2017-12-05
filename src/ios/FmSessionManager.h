//
//  ReaderManager.h
//  SDK
//
//  Created by Richard Grundy on 11/16/14.
//  Copyright (c) 2014 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import "FmBluetoothConnectionsManager.h"
#import "FmAudioJackConnectionsManager.h"

#import "FmSession.h"
#import "FmConfiguration.h"

@protocol FmSessionManagerDelegate<NSObject>

@optional

- (void)didFindTag:(FmTag *)tag fromDevice:(NSString *)deviceUuid;
- (void)didReceiveReaderError:(NSError *)error;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didChangeStatus:(NSString *)deviceUuid withConfiguration:(FmConfiguration *)configuration andBatteryLevel:(NSNumber *)batteryLevel andCommunicationStatus:(CommunicationStatus)communicationStatus withFirmwareRevision:(NSString *)firmwareRev withHardwareRevision:(NSString *)hardwareRev;
- (void)didGetLicenseInfo:(NSString *)deviceUuid withStatus:(BOOL)isRegistered;

// Bluetooth Methods
- (void)didMasterKeyUpdate:(BOOL)success withError:(NSError *)error;

@end

@interface FmSessionManager : NSObject <FmSessionDelegate, FmAudioJackConnectionsManagerDelegate, FmBluetoothConnectionsManagerDelegate> {
    
    // Reader Variables
    AVAudioPlayer *_audioPlayer;
    BOOL isAppLaunching;
    
    //2.0
}

+ (id)flomioMW; //flomioMW singleton

- (id)initWithConfiguration:(FmConfiguration *)configuration;
- (void)startReaders;
- (void)stopReaders;
- (void)sleepReaders;
- (void)startReader:(NSString *)deviceUuid;
- (void)stopReader:(NSString *)deviceUuid;
- (void)sleepReader:(NSString *)deviceUuid;
- (void)updateCeNdef:(NdefMessage *)ndef withDeviceUuid:(NSString *)deviceUuid;
- (void)writeRfidTag:(NSData *)data withOffset:(int)offset success:(void (^)(NSString *))completionBlock;
- (void)readRfidTag:(int)offset success:(void (^)(NSString *))completionBlock;

- (void)setConfiguration:(FmConfiguration *)configuration; //initialize all devices configuration with this
- (void)setConfiguration:(FmConfiguration *)configuration ofDevice:(NSString *)deviceUuid;
- (FmConfiguration *)getConfiguration:(NSString *)deviceUuid;
- (void)sendApdu:(NSString *)apdu toDevice:(NSString *)deviceUuid success:(void (^)(NSString *))completionBlock;

@property (nonatomic, strong) id<FmSessionManagerDelegate> delegate;
@property (nonatomic, strong) FmConnectionsManager *connectionsManager;
@property (nonatomic, strong) FmConfiguration *configuration;
@property (nonatomic, strong) NSMutableArray<FmSession *> *sessions;
@end

