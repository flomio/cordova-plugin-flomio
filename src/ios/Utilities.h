//
//  NSObject+Utilities.h
//  SDK
//
//  Created by Richard Grundy on 4/6/15.
//  Copyright (c) 2015 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Utilities: NSObject

+ (NSData *)byteArrayFromHexString:(NSString *)hexString;
+ (NSString *)toHexString:(const uint8_t *)buffer length:(size_t)length;
+ (NSUInteger)toByteArray:(NSString *)hexString buffer:(uint8_t *)buffer bufferSize:(NSUInteger)bufferSize;
+ (NSString *)convertBytesToData:(NSString *)hexString;

+ (NSString *)hexStringFromByteArray:(const uint8_t *)buffer length:(NSUInteger)length;
+ (NSString *)hexStringFromByteArray:(NSData *)buffer;

@end
