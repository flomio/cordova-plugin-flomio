//
//  UgiUtil.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#import <Foundation/Foundation.h>

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - interface
///////////////////////////////////////////////////////////////////////////////////////

/**
 UgiUtil is a collection of useful static methods
 */
@interface UgiUtil : NSObject


///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Methods
///////////////////////////////////////////////////////////////////////////////////////

/**
 Utility to convert NSData to a string of hex digits (uppercase)
 
 @param data    NSData object to convert to a string
 @return        String of hex digits
 */
+ (NSString *)dataToString:(NSData *)data;

/**
 Utility to convert bytes to a string of hex digits (uppercase)
 
 @param ba      Byte array to convert
 @param len     Length of byte array
 @return String of hex digits
 */
+ (NSString *)bytesToString:(const uint8_t *)ba
                     length:(int)len;

/**
 Utility to convert a hex string to NSData
 
 @param s           String to convert
 @return            NSData
 */
+ (NSData *)stringToData:(NSString *)s;

/**
 Utility to convert string to bytes
 
 @param s           String to convert
 @param ba          Buffer to put result in
 @param bufferSize  Size of the buffer in bytes
 @return            Number of bytes
 */
+ (int)stringToBytes:(NSString *)s
            toBuffer:(uint8_t *)ba
          bufferSize:(int)bufferSize;

@end

