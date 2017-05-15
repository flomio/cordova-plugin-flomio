//
//  FeitianReader.h
//  SDK
//
//  Created by Boris  on 12/1/15.
//  Copyright © 2015 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReaderInterface.h"
#import "winscard.h"
#import "ft301u.h"

@protocol FeitianReaderDelegate <NSObject>
@optional

- (void)didFeitianReaderSentUUID:(NSString *)uuid fromDevice:(NSString*)serialNumber;
- (void)didFeitianReaderSentAPDUResponse:(NSString *)response fromDevice:(NSString*)sn;
- (void)didUpdateConnectedBR500:(NSArray *)peripherals;

@end

@interface FeitianReader : NSObject <ReaderInterfaceDelegate> {
    
    BOOL cardIsAttached;
    
    SCARDCONTEXT gContxtHandle;
    SCARDHANDLE  gCardHandle;
    
    BOOL isCardConnected;
    
    NSString *serialNumber;
}

@property id<FeitianReaderDelegate> delegate;
@property (nonatomic,strong) ReaderInterface *readInf;

-(void)sendCommand:(NSString *)command;

@end
