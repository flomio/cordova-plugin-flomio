//
//  UgiEpc.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#define __UGI_EPC_H

#import <Foundation/Foundation.h>
#import "UgiJson.h"

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Constants and Types
///////////////////////////////////////////////////////////////////////////////////////

#define UGI_MAX_EPC_LENGTH 27

#define UGI_STANDARD_EPC_LENGTH 12

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - interface
///////////////////////////////////////////////////////////////////////////////////////

/**
 UgiEpc encapsulates an EPC code
 */
@interface UgiEpc : NSObject<NSCopying,UgiJsonModel>

//! EPCs data (the bytes)
@property (nonatomic, retain) NSData *data;

// These are here so that automatic documentation generation catches them
#if 0
//! Maximum length of an EPC code, in bytes @public
static const int UGI_MAX_EPC_LENGTH = 27;
#endif

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Lifecycle
///////////////////////////////////////////////////////////////////////////////////////

/**
 Create a UgiEpc object from a NSData object
 
 @param data     Raw bytes to create object from
 @return         New UgiEpc object
 */
+ (UgiEpc *) epcFromBytes:(NSData *)data;

/**
 Create a UgiEpc object from a string of hex digits (uppercase or lowercase)
 
 @param s        String to create object from
 @return         New UgiEpc object
 */
+ (UgiEpc *) epcFromString:(NSString *)s;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Methods
///////////////////////////////////////////////////////////////////////////////////////

/**
 Get a pointer to the EPC's bytes (convenience method for data.bytes)
 */
- (const uint8_t *)bytes;

/**
 Get the length of the EPC (convenience method for data.length)
 */
- (int) length;

/**
 Convert to a string of hex digits (uppercase)
 
 @return String of hex digits representing the EPC code
 */
- (NSString *) toString;

/**
 Convert to a tag URI string (as defined by the EPC spec)
 
 @return Tag URI string
 */
- (NSString *) toTagURI;

/**
 Get the manufacturer name if a EPC is unprogrammed.
 
 This is a hueristic function, based on a variety of tags tested
 
 @return   Manufacturer name
 */
- (NSString *) getManufacturerNameIfUnprogrammed;

/**
 Is this EPC unprogrammed?
 
 @return   YES if unprogrammed
 */
- (BOOL) isUnprogrammedEpc;

/**
 Create a new EPC for use with a U Grok It tag
 
 @return Created EPC
 */
+ (UgiEpc *) epcFromUGrokItEpc;

@end

