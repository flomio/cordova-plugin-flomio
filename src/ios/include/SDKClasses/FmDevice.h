//
//  FmDevice.h
//  SDK
//
//  Created by Boris  on 3/24/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FmBluetoothDevice.h"
#import "FmAudioJackDevice.h"

@interface FmDevice : NSObject

@property (nonatomic) DeviceType deviceType;
@property (nonatomic, strong) id device;
@property (nonatomic) NSUInteger batteryLevel;
@property (nonatomic, strong) NSString *serialNumber;
@property (nonatomic, strong) NSString *firmwareRevision;
@property (nonatomic, strong) NSString *hardwareRevision;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
@property (nonatomic, strong) NSDictionary *configurationDictionary;

- (void)sendApduCommand:(NSString *)command;
- (void)setDevice:(id)device;
- (void)setConfiguration:(NSDictionary *)configurationDictionary;
- (NSDictionary *)getConfiguration;
- (void)startReader;
- (void)stopReader;
- (void)sleepReader;

@end
