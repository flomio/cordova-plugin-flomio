//
//  uGrokitAjReader.h
//  SDK
//
//  Created by Scott Condron on 14/11/2016.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FmReader.h"
#import "UgiInventoryDelegate.h"
#import "Ugi.h"
#import "UgiUtil.h"
#import "UgiRfMicron.h"
#import "UgiInventory.h"
#import "UgiFooterView.h"
#import "UgiTitleView.h"
#import "UgiTagReadHistoryView.h"
#import "UgiTagCell.h"

@import AudioToolbox;
#import <AudioToolbox/AudioToolbox.h>
#import <AVFoundation/AVFoundation.h>

#define SPECIAL_FUNCTION_NONE 0
#define SPECIAL_FUNCTION_READ_USER_MEMORY 1
#define SPECIAL_FUNCTION_READ_TID_MEMORY 2
#define SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_SENSOR_CODE 3
#define SPECIAL_FUNCTION_RF_MICRON_MAGNUS_TYPE UGI_RF_MICRON_MAGNUS_MODEL_402
#define SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_TYPE UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_LESS_THAN_OR_EQUAL
#define SPECIAL_FUNCTION_RF_MICRON_MAGNUS_LIMIT_THRESHOLD 31
#define SPECIAL_FUNCTION_READ_RF_MICRON_MAGNUS_TEMPERATURE 4

@interface uGrokitAjReader : FmReader <UgiInventoryDelegate>

+ (instancetype)initSharedInstanceWithParent:(id)parent andConfiguration:(FmConfiguration *)confuration;
- (void)setConfiguration:(FmConfiguration *)configuration;
- (void)getDeviceInfo;
- (void)startReader;
- (void)stopReader;
- (void)sleepReader;
- (NSString *)sendApduCommand:(NSString *)command;
- (void)writeRfidTag:(NSData *)data withOffset:(int)offset success:(void (^)(NSString *))completionBlock;
- (void)readRfidTag:(int)offset success:(void (^)(NSString *))completionBlock;

@property (retain, nonatomic) IBOutlet UgiFooterView *footer;
@property (nonatomic) UgiInventoryTypes inventoryType;
@property (nonatomic) int specialFunction;
@property (nonatomic, strong) UgiTag *currentTag;

@property (retain, nonatomic) NSMutableArray<UgiTag *> *displayedTags;
@property (retain, nonatomic) NSMutableDictionary<UgiEpc *, NSMutableString *> *epcToDetailString;
@property (retain, nonatomic) id referenceToStopBatteryCallback;
@property (retain, nonatomic) id referenceToStopDeviceInfoCallback;
@property(nonatomic, copy) void (^completionBlock)(NSString *);



@end
