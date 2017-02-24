//
//  BluetoothManager.h
//  SDK
//
//  Created by Boris  on 3/8/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

#pragma mark - bR500 Imports

#import "FeitianBtReader.h"

#pragma mark - acr1255uj1 Imports

#import "AcsBtReader.h"

@protocol FmBluetoothSessionManagerDelegate<NSObject>

@optional

- (void)didReceiveReaderError:(NSError *)error;
- (void)didFindATagUuid:(NSString *)UUID fromDevice:(NSString *)deviceId withATR:(NSString *)detectedATR withError:(NSError *)error;
- (void)didFindADataBlockWithNdef:(NdefMessage *)ndef fromDevice:(NSString *)device withError:(NSError *)error;
- (void)didReturnResponseApdu:(NSString *)response fromDevice:(NSString *)device withError:(NSError *)error;

- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;

- (void)updateConnectedDevicesWithDevice:(FmBluetoothDevice *)device;
- (void)didDisconnectPeripheral:(CBPeripheral *)peripheral;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didMasterKeyUpdate:(BOOL)success withError:(NSError *)error;
- (void)didChangeBatteryLevel:(NSInteger)batteryLevel fromDevice:(NSString *)device;

@end

@interface FmBluetoothSessionManager : NSObject <CBCentralManagerDelegate, CBPeripheralDelegate, AcsBtReaderDelegate, FeitianBtReaderDelegate, ReaderInterfaceDelegate> {
    
    CBPeripheral *activePeripheral;
    AcsBtReader *acr1255uj1;
    FeitianBtReader *br500;
}

@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, strong) ReaderInterface  *br500Manager;
@property (nonatomic, strong) id<FmBluetoothSessionManagerDelegate> delegate;
@property (nonatomic, strong) NSMutableArray *acceptedSerialNumbers;
@property (nonatomic) ReaderStateType readerState;
@property (nonatomic) PowerOperation powerOperation;
@property (nonatomic) TransmitPower transmitPower;
@property (nonatomic, strong) NSNumber *allowMulticonnect;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic, strong) NSString *connectedPeripheralDeviceId;
@property (nonatomic) DeviceType selectedDeviceType;
@property (nonatomic, strong) NSString *specificDeviceId;
@property (strong,nonatomic) NSMutableArray *peripherals; //this is needed as a strong reference to the peripherals so ARC doesn't remove old peripherals

- (void)resetMasterKey:(NSString *)nmk withOldMasterKey:(NSString *)omk andReader:(AcsBtReader *)acsbt;
- (void)reconnectPeripheral:(CBPeripheral *)peripheral ofReader:(AcsBtReader *)sender;
- (void)createBtManager;

@end
