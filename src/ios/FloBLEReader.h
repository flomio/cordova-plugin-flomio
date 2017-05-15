//
//  FloBLEReader.h
//  Badanamu
//
//  Created by Chuck Carter on 10/13/14.
//  Copyright (c) 2014 Flomio. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FLOReader.h"
#import "FloNotifications.h"
#import "FloProtocolsCommon.h"

extern NSString * const floReaderConnectionStatusChangeNotification;

@protocol FloBLEReaderDelegate <NSObject,FLOReaderDelegate>
//- (void) didReceiveData:(NSString *) string;
@optional
- (void)handleReceivedByte:(UInt8)byte withParity:(BOOL)parityGood atTimestamp:(double)timestamp;
- (void)updateLog:(NSString*)logText;
- (void)didReceiveServiceFirmwareVersion:(NSString *)theVersionNumber;
//- (void)didReadHardwareRevisionString:(NSString *) string;
- (void)didReceivedImageBlockTransferCharacteristic:(NSData*)imageBlockCharacteristic;
- (void)didReceivedImageIdentifyCharacteristic:(NSData*)imageBlockCharacteristic;

@end

@interface FloBLEReader : FLOReader
{
    NSMutableArray * rfUid;
    deviceState_t deviceState;
}

@property (assign) deviceState_t deviceState;
@property (assign) BOOL isConnected;


@property (copy, nonatomic) NSMutableArray * rfUid;
@property id<FloBLEReaderDelegate> delegate;

@property (nonatomic, strong) NSString *DeviceUUID;

- (id)init;
- (id)initWithDelegate:(id<FloBLEReaderDelegate>)floBleDelegate;
- (void)writePeriperalWithOutResponse:(UInt8*)dataToWrite;
- (void)writeBlockToPeriperalWithOutResponse:(UInt8*)dataToWrite ofLength:(UInt8)len;


@end
