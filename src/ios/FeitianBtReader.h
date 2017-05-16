//////
//////  FeitianBtReader.h
//////  SDK
//////
//////  Created by Scott Condron on 08/10/2016.
//////  Copyright © 2016 Flomio, Inc. All rights reserved.
//////

#import <CoreBluetooth/CoreBluetooth.h>
#import <AVFoundation/AVFoundation.h>
#import <CommonCrypto/CommonCrypto.h>

#import "winscard.h"
#import "ReaderInterface.h"
#import "wintypes.h"
#import "ft301u.h"
#import "FmCustomTypes.h"

#import "FmReader.h"

@protocol FeitianBtReaderDelegate <FmReaderDelegate>

@end

@interface FeitianBtReader : FmReader <ReaderInterfaceDelegate, AVAudioPlayerDelegate>

- (instancetype)initWithPeripheral:(CBPeripheral *)peripheral andConfiguration:(FmConfiguration *)configuration;
- (void)stopReader;
- (void)startReader;
- (void)sleepReader;
- (void)getDeviceInfo;
- (void)setConfiguration:(FmConfiguration *)configuration;

@property (nonatomic, strong) id<FeitianBtReaderDelegate> delegate;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, assign) TagDiscovery tagDiscovery;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic,strong) NSString *currentReaderName;
@property(nonatomic, copy) void (^completionBlock)(NSString *);

@end

