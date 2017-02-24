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
#include "utils.h"
#import "Tag.h"
#import "FmAudioJackDevice.h"
#import <CommonCrypto/CommonCrypto.h>

#import "FmBluetoothDevice.h"
#import "NdefMessage.h"

typedef NS_ENUM(NSInteger, bzrDispatchTimerCommands) {
    bzrStartTimer,
    bzrStopTimer,
    bzrInitializeTimer
};

@protocol FeitianAjReaderDelegate<NSObject>;

@required

@optional

- (void)didReceiveReaderError:(NSError *)error;
- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)continueWithInitialization:(BOOL)isBzr;

@end


@interface FeitianAjReader : NSObject <FTaR530Delegate, AVAudioPlayerDelegate> {

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
    
    //semaphores
    dispatch_semaphore_t sem;

}

+ (instancetype)sharedInstanceWithParent:(id)parent;

- (id)initWithParent:(id)parent;
- (void)transmitCommandApdu:(NSString *)sendApdu;
- (void)getUuid;
- (void)getData;
- (void)stopReader;
- (void)reset;
- (void)sleep;
- (void)startScan;
- (void)determineIfConnected;

@property (nonatomic, strong) id<FeitianAjReaderDelegate> delegate;

@property (readonly) Tag *tag;
@property (readonly, strong) NSString *serialNumber;

@property (nonatomic) BOOL routeInProcess;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, assign) ReaderStateType readerState;

@property (nonatomic, strong) dispatch_source_t timerSource;
@property (nonatomic, strong) FmAudioJackDevice *device;

@property (nonatomic, strong) NSString *firmwareRevision;
@property (nonatomic, strong) NSString *hardwareRevision;

@property (nonatomic, strong) NSNumber *scanPeriod;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic, strong) NSNumber *commSuspended;
@property (nonatomic, strong) NSNumber *communication;
@property (nonatomic, strong) NSString *scannedCardType;

@end


