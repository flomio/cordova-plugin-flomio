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
#import <CommonCrypto/CommonCrypto.h>
#import "AudioJack.h"
#import "FmReader.h"

typedef NS_ENUM(NSInteger, DispatchTimerCommands) {
    startTimer,
    stopTimer,
    initializeTimer
};

@protocol AcsAjReaderDelegate <FmReaderDelegate>

@end

@interface AcsAjReader : FmReader <ACRAudioJackReaderDelegate, AVAudioPlayerDelegate> {
        
    BOOL registry_mode;
    BOOL is_resetting;
    
    // NDEF
    BOOL isRequestingDataBlocks;
    NSMutableData *dataBlock;
    int currentPosition;
    CardType cardType;
    CardStatus cardStatus;
    CardStatus previousCardStatus;
}

+ (instancetype)initSharedInstanceWithParent:(id)parent andConfiguration:(FmConfiguration *)confuration;
- (void)startReader;
- (void)stopReader;
- (void)sleepReader;
- (void)wakeReader;
- (void)reset;
- (void)transmitCommandApdu:(NSData *)apdu;
- (void)getData;
- (void)playNotification;
- (void)resetTimerSource;
- (void)controlTimerSource:(int)tCommand;
- (void)getBatteryLevel;
- (void)getDeviceInfo;
- (void)setConfiguration:(FmConfiguration *)configuration;

@property (nonatomic, strong) id <AcsAjReaderDelegate> delegate;

@property (nonatomic) int previousBatteryLevel;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, strong) NSNumber *scanPeriod;
@property (nonatomic, strong) NSNumber *communication;
@property (nonatomic, strong) NSNumber *isPolling;
@property (nonatomic, strong) dispatch_source_t timerSource;
@property (nonatomic, assign) TagDiscovery tagDiscovery;
@property (nonatomic, strong) NSNumber *commSuspended;
@property (nonatomic, strong) NSNumber *scanSound;
@property(nonatomic, copy) void (^completionBlock)(NSString *);


@end

