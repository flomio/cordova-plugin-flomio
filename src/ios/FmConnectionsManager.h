//
//  FmConnectionsManager.h
//  SDK
//
//  Created by Scott Condron on 22/11/2016.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FmConfiguration.h"

@protocol FmConnectionsManagerDelegate<NSObject>

@optional

@end

@interface FmConnectionsManager : NSObject

@property (nonatomic, strong) FmConfiguration *configuration;
@property (nonatomic, assign) id<FmConnectionsManagerDelegate> delegate;
/*
// Bluetooth properties
@property (nonatomic, strong) FmBluetoothConnections *bluetoothConnections;
@property (nonatomic, strong) NSArray *peripherals;

// Audio jack properties
@property (nonatomic, strong) FmAudioJackConnections *audioJackConnections;

// Bluetooth methods
- (void)createBluetoothConnection;
- (void)reconnectPeripheral:(CBPeripheral *)peripheral;

// Audio jack methods
- (void)createAudioJackConnection;
*/

@end
