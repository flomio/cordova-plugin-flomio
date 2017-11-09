//
//  FeitianAJ.h
//  SDK
//
//  Created by Scott Condron on 24/02/2016.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import "FTaR530.h"
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import "FmCustomTypes.h"
#include "utils.h"
#import <CommonCrypto/CommonCrypto.h>
#import "FmReader.h"

typedef NS_ENUM(NSInteger, bzrDispatchTimerCommands) {
    bzrStartTimer,
    bzrStopTimer,
    bzrInitializeTimer
};

@protocol FeitianAjReaderDelegate <FmReaderDelegate>;

@end

@interface FeitianAjReader : FmReader <FTaR530Delegate, AVAudioPlayerDelegate> {

    BOOL isRequestingUuid;
    BOOL registry_mode;
    
    // NDEF
    BOOL isRequestingDataBlocks;
    NSMutableData *dataBlock;
    int currentPosition;
    NdefState state;
    CardType cardType;
    CardStatus cardStatus;
    CardStatus previousCardStatus;
    
    NSString *newMasterKey;
    NSString *oldMasterKey;
}

+ (instancetype)initSharedInstanceWithParent:(id)parent andConfiguration:(FmConfiguration *)confuration;
- (void)transmitCommandApdu:(NSString *)sendApdu;
- (void)getDeviceInfo;
- (void)getUuid;
- (void)getData;
- (void)startReader;
- (void)stopReader;
- (void)reset;
- (void)setConfiguration:(FmConfiguration *)configuration;

@property (nonatomic, strong) id<FeitianAjReaderDelegate> delegate;

//@property (readonly) Tag *tag;
@property(nonatomic, copy) void (^completionBlock)(NSString *);
@property (nonatomic) BOOL routeInProcess;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, assign) TagDiscovery tagDiscovery;

@property (nonatomic, strong) dispatch_source_t timerSource;

@property (nonatomic, strong) NSNumber *scanPeriod;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic, strong) NSNumber *commSuspended;
@property (nonatomic, strong) NSNumber *communication;
@property (nonatomic, strong) NSString *scannedCardType;

@end
