//
//  Tag.h
//  SDK
//
//  Created by Richard Grundy on 11/16/14.
//  Copyright (c) 2014 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Tag : NSObject

@property (nonatomic, strong) NSData *data;

- (id)init:(NSData *)data;
+ (NSData *)byteArrayFromHexString:(NSString *)hexString;
+ (NSString *)toHexString:(const uint8_t *)buffer length:(size_t)length;
+ (NSUInteger)toByteArray:(NSString *)hexString buffer:(uint8_t *)buffer bufferSize:(NSUInteger)bufferSize;

@end
