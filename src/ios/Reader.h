//
//  Reader.h
//  SDK
//
//  Created by Richard Grundy on 11/16/14.
//  Copyright (c) 2014 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import "Tag.h" 
#import "AudioJack.h"

typedef NS_ENUM(NSInteger, ReaderStateType) { // new Apple way of doing emums http://nshipster.com/ns_enum-ns_options/
    kReadUUID,
    kReadDataBlocks,
    kWriteDataBlocks
};

typedef NS_ENUM(NSInteger, DispatchTimerCommands) {
    startTimer,
    stopTimer,
    initializeTimer
};

@protocol ReaderDelegate;

@interface Reader : NSObject <ACRAudioJackReaderDelegate, AVAudioPlayerDelegate> {
    
    BOOL registry_mode;
    BOOL is_resetting;
    NSTimer *statusTimer;       //was timer, used to detect conectivity after a status request
}

+ (instancetype)sharedInstanceWithParent:(id)parent;

- (id)initWithParent:(id)parent;
- (void)startScan;
- (void)suspendScan;
- (void)reset;
- (void)sleep;
- (void)wake;
- (void)transmit:(NSData *)commandApdu;
- (BOOL)getNfcData:(int)startBlock asMany:(int)byteCount inChunks:(int)maxBytes withAuthentication:(BOOL)auth;
- (BOOL)putNfcData:(NSData *)data inChunks:(int)maxBytes withAuthentication:(BOOL)auth;
- (void)playNotification;
- (void)registerNewDevice;
- (void)isDeviceLicensed:(NSString*)deviceIDString;
- (void)resetTimerSource;
- (void)controlTimerSource:(int)tCommand;


@property (nonatomic, strong) id<ReaderDelegate> delegate;
@property (readonly) Tag *tag;
@property (nonatomic) BOOL routeInProcess;
@property (readonly, strong) NSString *deviceIdString;
@property (nonatomic, strong) dispatch_source_t timerSource;
@property (nonatomic, assign) BOOL isProLicensed;

//ReaderManager Refactoring

@property (nonatomic, assign) ReaderStateType operationState; // primitives (NSInteger) must be "assigned" since not objects
@property (nonatomic, strong) NSNumber *scanPeriod;
@property (nonatomic, strong) NSNumber *startBlock;
@property (nonatomic, strong) NSString *messageToWrite;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic, strong) NSNumber *communication;
@property (nonatomic, strong) NSNumber *commSuspended;
@property (nonatomic, strong) NSNumber *isPolling;              //initialize to YES, set to NO while in bacground

@end

@protocol ReaderDelegate<NSObject>

@required

- (void)didFindATag:(Tag *)tag withOperationState:(ReaderStateType)operationState fromDevice:(NSString *)deviceId withError:(NSError *)error;
- (void)setDeviceStatus:(BOOL)enabled;
- (void)didGetBatteryLevel:(NSInteger)batteryLevel;

@end