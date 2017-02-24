//
//  FmAudioJackDevice.h
//  SDK
//
//  Created by Boris  on 3/24/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "FmCustomTypes.h"

@class Reader;

@interface FmAudioJackDevice : NSObject

@property (nonatomic, strong) id device;
@property (nonatomic, strong) NSString *serialNumber;
@property (nonatomic, strong) NSString *firmwareRevision;
@property (nonatomic, strong) NSString *hardwareRevision;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
@property (nonatomic, assign) DeviceType deviceType;
@property (nonatomic, assign) NSUInteger batteryLevel;
@property (nonatomic, strong) NSDictionary *configurationDictionary;

- (void)sendApduCommand:(NSString *)command;
- (void)startReader;
- (void)stopReader;
- (void)setDevice:(id)device ofType:(DeviceType)type;
- (void)setConfiguration:(NSDictionary *)configurationDictionary;
- (NSDictionary *)getConfiguration;

@end
