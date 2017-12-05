//
//  AcsBtReader.h
//  SDK
//
//  Created by Boris  on 1/20/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

#import <AVFoundation/AVFoundation.h>
#import <CommonCrypto/CommonCrypto.h>

#import "ABTBluetoothReader.h"
#import "ABTBluetoothReaderManager.h"
#import "ABTAcr1255uj1Reader.h"

#import "FmReader.h"

@protocol AcsBtReaderDelegate<FmReaderDelegate>

@optional
- (void)didMasterKeyUpdate:(BOOL)success withError:(NSError *)error;

@end

@interface AcsBtReader : FmReader <ABTBluetoothReaderManagerDelegate, ABTBluetoothReaderDelegate> {

    NSArray *connectedPeripherals;
    BOOL isRequestingUuid;
    
    // NDEF
    BOOL isRequestingData;
    NSMutableData *dataBlock;
    int currentPosition;

    NSString *newMasterKey;
    NSString *oldMasterKey;
    
    dispatch_semaphore_t sem;
}

- (instancetype)initWithPeripheral:(CBPeripheral *)peripheral andConfiguration:(FmConfiguration *)configuration;
- (void)stopReader;
- (void)startReader;
- (void)sleepReader;
- (void)getDeviceInfo;
- (void)setConfiguration:(FmConfiguration *)configuration;

- (void)reconnectBluetoothReader;
- (void)resetMasterKey:(NSString *)nmk withOldMasterKey:(NSString *)omk;

@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, strong) id<AcsBtReaderDelegate> delegate;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) NSMutableArray *accepteddeviceUuids;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
//configuration
@property (nonatomic, assign) TagDiscovery tagDiscovery;
@property (nonatomic, assign) TransmitPower transmitPower;
@property (nonatomic, assign) PowerOperation powerOperation;
@property(nonatomic, copy) void (^completionBlock)(NSString *);
@property (nonatomic, assign) NSNumber *isCeMode;


@end
