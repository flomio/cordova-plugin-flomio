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

- (void)didFindTag:(FmTag *)tag fromDevice:(NSString *)deviceId;
- (void)didReceiveReaderError:(NSError *)error;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didChangeStatus:(NSString *)readerSerialNumber withConfiguration:(FmConfiguration *)configuration andBatteryLevel:(NSNumber *)batteryLevel andCommunicationStatus:(CommunicationStatus)communicationStatus withFirmwareRevision:(NSString *)firmwareRev withHardwareRevision:(NSString *)hardwareRev;
- (void)didGetLicenseInfo:(NSString *)serialNumber withStatus:(BOOL)isRegistered;

// Bluetooth Methods
- (void)didMasterKeyUpdate:(BOOL)success withError:(NSError *)error;

@end

@interface FmSessionManager : NSObject <FmSessionDelegate, FmAudioJackConnectionsManagerDelegate, FmBluetoothConnectionsManagerDelegate> {
    
    // Reader Variables
    AVAudioPlayer *_audioPlayer;
    BOOL isAppLaunching;
    
    //2.0
    NSMutableArray *sessions;
}

+ (id)flomioMW; //flomioMW singleton

- (id)initWithConfiguration:(FmConfiguration *)configuration;
- (void)startReaders;
- (void)stopReaders;
- (void)sleepReaders;
- (void)startReader:(NSString *)deviceId;
- (void)stopReader:(NSString *)deviceId;
- (void)sleepReader:(NSString *)deviceId;

- (void)setConfiguration:(FmConfiguration *)configuration; //initialize all devices configuration with this
- (void)setConfiguration:(FmConfiguration *)configuration ofDevice:(NSString *)deviceId;
- (FmConfiguration *)getConfiguration:(NSString *)deviceId;
- (void)sendApdu:(NSString *)apdu toDevice:(NSString *)deviceId success:(void (^)(NSString *))completionBlock;

@property (nonatomic, strong) id<FmSessionManagerDelegate> delegate;
@property (nonatomic, strong) FmConnectionsManager *connectionsManager;
@property (nonatomic, strong) FmConfiguration *configuration;

@end

