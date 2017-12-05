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
#import "FmConnectionsManager.h"

@protocol FmAudioJackConnectionsManagerDelegate<FmConnectionsManagerDelegate>

@optional

- (void)didConnectAudioJack;
- (void)didDisconnectAudioJack;
- (void)shouldWakeAcr35;

@end


@interface FmAudioJackConnectionsManager : FmConnectionsManager

- (void)handleRouteChange:(NSNotification*)notification;

@property (nonatomic, assign) id<FmAudioJackConnectionsManagerDelegate> delegate;
@property (nonatomic) BOOL hasConnected;

@end
