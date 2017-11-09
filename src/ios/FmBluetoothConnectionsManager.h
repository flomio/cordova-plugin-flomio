//
//  BluetoothManager.h
//  SDK
//
//  Created by Boris  on 3/8/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "FmConfiguration.h"
#import "FmConnectionsManager.h"

//BR500 imports
#import "winscard.h"
#import "ReaderInterface.h"
#import "wintypes.h"
#import "ft301u.h"
#import "FmCustomTypes.h"

@protocol FmBluetoothConnectionsManagerDelegate<FmConnectionsManagerDelegate>

@optional

- (void)didConnectPeripheral:(CBPeripheral *)peripheral;
- (void)didReconnectPeripheral:(CBPeripheral *)peripheral;
- (void)didDisconnectPeripheral:(CBPeripheral *)peripheral;

@end

@interface FmBluetoothConnectionsManager : FmConnectionsManager <CBCentralManagerDelegate, CBPeripheralDelegate, ReaderInterfaceDelegate> {
    CBPeripheral *activePeripheral;
}

@property (nonatomic, strong) CBCentralManager *centralManager;
@property (nonatomic, strong) ReaderInterface  *br500Manager;
@property (nonatomic, assign) id<FmBluetoothConnectionsManagerDelegate> delegate;
@property (nonatomic, strong) FmConfiguration *configuration;
@property (nonatomic, strong) NSString *connectedPeripheralDeviceUuid;

@property (strong,nonatomic) NSMutableArray *peripherals; //this is needed as a strong reference to the peripherals so ARC doesn't remove old peripherals
@property (strong,nonatomic) NSMutableArray *uniquePeripheralIds; //store each peripheral Id to determine reconnections

- (id)initWithConfiguration:(FmConfiguration *)configuration;
- (void)reconnectPeripheral:(CBPeripheral *)peripheral;
- (void)cancelPeripheralConnection:(CBPeripheral *)peripheral;
- (void)startScanning;
- (void)stopScanning;
@end
