//
//  AcsBtReader.h
//  SDK
//
//  Created by Boris  on 1/20/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "ABTBluetoothReader.h"
#import "ABTBluetoothReaderManager.h"
#import "ABTAcr1255uj1Reader.h"
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CommonCrypto/CommonCrypto.h>
#import "FmBluetoothDevice.h"
#import "NdefMessage.h"


@protocol AcsBtReaderDelegate<NSObject>

@optional

- (void)didReceiveReaderError:(NSError *)error;
- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)updateConnectedDevicesWithDevice:(FmBluetoothDevice *)device;
- (void)didChangeBatteryLevel:(NSInteger)batteryLevel fromDevice:(NSString *)device;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didMasterKeyUpdate:(BOOL)success withError:(NSError *)error;

@end

@interface AcsBtReader : NSObject <ABTBluetoothReaderManagerDelegate, ABTBluetoothReaderDelegate> {

    NSString *deviceId;
    NSArray *connectedPeripherals;    
    BOOL isRequestingUuid;
    
    // NDEF
    BOOL isRequestingData;
    NSMutableData *dataBlock;
    int currentPosition;
    CardType cardType;

    NSString *newMasterKey;
    NSString *oldMasterKey;
    
    //semaphores
    dispatch_semaphore_t sem;
}

- (void)startReaderWithPeripheral:(CBPeripheral *)peripheral;
- (void)stopReader;
- (void)startReader;
- (void)startReaderWithDelay;
- (void)sleepReader;
- (void)getUuid;
- (void)getData;
- (void)transmitCommandApdu:(NSData *)apdu;
- (void)resetMasterKey:(NSString *)nmk withOldMasterKey:(NSString *)omk;
- (void)updateTransmitPower:(TransmitPower)transmitPower;

@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic) NSUInteger batteryLevel;
@property (nonatomic, strong) id<AcsBtReaderDelegate> delegate;
@property (nonatomic, strong) NSString *serialNumber;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) FmBluetoothDevice *device;
@property (nonatomic, strong) NSMutableArray *acceptedSerialNumbers;
@property (nonatomic, assign) ReaderStateType readerState;
@property (nonatomic, assign) TransmitPower transmitPower;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
@property (nonatomic, assign) PowerOperation powerOperation;

@end
