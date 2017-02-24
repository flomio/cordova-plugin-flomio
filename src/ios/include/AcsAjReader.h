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
#import "Tag.h" 
#import "AudioJack.h"
#import "FmAudioJackDevice.h"
#import "NdefMessage.h"

typedef NS_ENUM(NSInteger, DispatchTimerCommands) {
    startTimer,
    stopTimer,
    initializeTimer
};

@protocol AcsAjReaderDelegate<NSObject>

@required

- (void)didReceiveReaderError:(NSError *)error;
- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didChangeBatteryLevel:(NSInteger)batteryLevel fromDevice:(NSString *)device;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;

@end

@interface AcsAjReader : NSObject <ACRAudioJackReaderDelegate, AVAudioPlayerDelegate> {
        
    BOOL registry_mode;
    BOOL is_resetting;
    
    // NDEF
    BOOL isRequestingDataBlocks;
    NSMutableData *dataBlock;
    int currentPosition;
    NdefState state;
    CardType cardType;
    CardStatus cardStatus;
    CardStatus previousCardStatus;
    
    //semaphores
    dispatch_semaphore_t sem;
}

+ (instancetype)sharedInstanceWithParent:(id)parent;

- (id)initWithParent:(id)parent;
- (void)startScan;
- (void)suspendScan;
- (void)reset;
- (void)sleep;
- (void)wake;
- (void)transmitCommandApdu:(NSData *)apdu;
- (void)getData;
- (void)playNotification;
- (void)registerNewDevice;
- (void)isDeviceLicensed:(NSString*)deviceIDString;
- (void)resetTimerSource;
- (void)controlTimerSource:(int)tCommand;

@property (nonatomic, strong) id <AcsAjReaderDelegate> delegate;

@property (readonly) Tag *tag;
@property (nonatomic) NSUInteger batteryLevel;
@property (nonatomic) int previousBatteryLevel;
@property (readonly, strong) NSString *serialNumber;
@property (nonatomic, strong) NSString *firmwareRevision;
@property (nonatomic, strong) NSString *hardwareRevision;
@property (nonatomic) BOOL routeInProcess;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, strong) dispatch_source_t timerSource;
@property (nonatomic, strong) NSNumber *scanPeriod;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic, strong) NSNumber *isPolling;              //initialize to YES, set to NO while in bacground
@property (nonatomic, strong) NSNumber *communication;
@property (nonatomic, assign) ReaderStateType readerState;
@property (nonatomic, strong) NSNumber *commSuspended;

@end

