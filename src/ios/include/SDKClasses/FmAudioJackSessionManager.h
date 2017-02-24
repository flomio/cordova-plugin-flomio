//
//  FmAudioJackDeviceManager.h
//  SDK
//
//  Created by Boris  on 3/24/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

#import <AudioToolbox/AudioToolbox.h>
#import "AcsAjReader.h"
#import "FeitianAjReader.h"
#import "NdefMessage.h"
#import "FmCustomTypes.h"
#import "FmAudioJackDevice.h"

@protocol FmAudioJackSessionManagerDelegate<NSObject>

@optional

- (void)didReceiveReaderError:(NSError *)error;
- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;

- (void)updateConnectedDevicesWithDevice:(FmAudioJackDevice *)device ifIsConnected:(BOOL)connected;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;
- (void)didChangeBatteryLevel:(NSInteger)batteryLevel fromDevice:(NSString *)device;


@end


@interface FmAudioJackSessionManager : NSObject <AcsAjReaderDelegate, FeitianAjReaderDelegate> {
    
    NSTimer *timer;
    
}

@property (nonatomic, strong) AcsAjReader *acr35;
@property (nonatomic, strong) FeitianAjReader *ar530;


@property (nonatomic, strong) id<FmAudioJackSessionManagerDelegate> delegate;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic, strong) NSNumber *scanPeriod; // in milliseconds
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic) ReaderStateType readerState;
@property (nonatomic) DeviceType selectedDeviceType;

- (void)setDevice:(DeviceType)device;
- (void)handleRouteChange:(NSNotification*)notification;
- (id)getAvailableReader;

@end
