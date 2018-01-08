//
//  UgiTag.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#define __UGI_TAG_H

#import <Foundation/Foundation.h>

#import "UgiEpc.h"

@class UgiTagReadState;   // forward reference
@class UgiInventory;   // forward reference

///////////////////////////////////////////////////////////////////////////////////////
// Enums must be defined outside the class for Swift, but inside the class for
// Doxygen (the documentation generator)
///////////////////////////////////////////////////////////////////////////////////////

typedef NS_ENUM(int, UgiHfTagTypes) {
  UGI_HF_TAG_ISO_15693 = 1,
  UGI_HF_TAG_ISO_14443A = 2
};

typedef NS_ENUM(int, UgiHfIso14443ATagTypes) {
  UGI_HF_ISO_14443A_TAG_UNKNOWN = 0,
  UGI_HF_ISO_14443A_TAG_MIFARE_ULTRALIGHT = 1
};

///////////////////////////////////////////////////////////////////////////////////////
// End enums
///////////////////////////////////////////////////////////////////////////////////////

/**
 A tag found by the reader: an EPC and additional data. This object will change if the
 tag's EPC is changed or its memory is written
 */
@interface UgiTag : NSObject

#if DOXYGEN   // Defined before class for Swift compatibility, documented here for Doxygen compatibility

/**
 HF tag types
 */
typedef enum {
  UGI_HF_TAG_ISO_15693 = 1,   //! ISO 15693 tag
  UGI_HF_TAG_ISO_14443A = 2   //! ISO 14443A tag
} UgiHfTagTypes;

/**
 HF ISO14443A tag types (tag type within UGI_HF_TAG_ISO_14443A)
 */
typedef enum {
  UGI_HF_ISO_14443A_TAG_UNKNOWN = 0,   //! Unknown type
  UGI_HF_ISO_14443A_TAG_MIFARE_ULTRALIGHT = 1   //! Mifare Ultralight (NXP)
} UgiHfIso14443ATagTypes;

#endif
///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties
///////////////////////////////////////////////////////////////////////////////////////

//! Tag's EPC
@property (readonly, nonatomic, nonnull) UgiEpc *epc;

//! When this tag was first read
@property (readonly, nonatomic, nonnull) NSDate *firstRead;

//! TID memory
@property (readonly, nonatomic, nullable) NSData *tidMemory;

//! USER memory
@property (readonly, nonatomic, nullable) NSData *userMemory;

//! RESERVED memory
@property (readonly, nonatomic, nullable) NSData *reservedMemory;


//! Read state for this tag at this moment in time
@property (readonly, nonatomic, nonnull) UgiTagReadState *readState;

//! YES if the tag is visible (as defined in UgiTagReadState). This is a convenience equivalent to getReadState.isVisible)
@property (readonly, nonatomic) BOOL isVisible;

//! Inventory this tag is associated with
@property (readonly, nonatomic, nonnull) UgiInventory *inventory;

@end
