//
//  FmApdu.h
//  SDK
//
//  Created by Scott Condron on 10/01/2017.
//  Copyright © 2017 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@protocol FmApduTransceiverDelegate <NSObject>

- (void)shouldTransmitApdu:(NSString *)apdu;
- (void)shouldTransmitEscapeApdu:(NSString *)apdu;

@end

@interface FmApduTransceiver : NSObject {
    //semaphores
    dispatch_semaphore_t sem;
}

@property (nonatomic, strong) NSString *response;
@property (nonatomic, strong) id<FmApduTransceiverDelegate> delegate;

- (NSString *)sendCommandApdu:(NSString *)apdu withTimeout:(NSInteger)timeInMilSecs;
- (void)handleResponse:(NSString *)response;

@end
