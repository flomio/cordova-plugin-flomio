//
//  Tag.h
//  SDK
//
//  Created by Richard Grundy on 11/16/14.
//  Copyright (c) 2014 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FmCustomTypes.h"
#import "NdefMessage.h"

@interface FmTag : NSObject

@property (nonatomic, strong) NSString *atr;
@property (nonatomic, strong) NSString *uuid;
@property (nonatomic, strong) NSString *payload;
@property (nonatomic, strong) NdefMessage *ndef;

- (instancetype)initWithUuid:(NSString *)uuid andAtr:(NSString *)atr;
- (NSString *)getCommandApduAfter:(NSString *)previousCommand;

//Command Apdus
+ (NSString *)readBinaryCommandwithOffset:(NSString *)offset andLength:(NSString *)length;
+ (NSString *)getUuid;

@end
