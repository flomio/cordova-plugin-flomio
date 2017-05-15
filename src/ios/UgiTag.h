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

/**
 A tag found by the reader: an EPC and additional data. This object will change if the
 tag's EPC is changed or its memory is written
 */
@interface UgiTag : NSObject

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties
///////////////////////////////////////////////////////////////////////////////////////

//! Tag's EPC
@property (readonly, nonatomic) UgiEpc *epc;

//! When this tag was first read
@property (readonly, nonatomic) NSDate *firstRead;

//! TID memory
@property (readonly, nonatomic) NSData *tidMemory;

//! USER memory
@property (readonly, nonatomic) NSData *userMemory;

//! RESERVED memory
@property (readonly, nonatomic) NSData *reservedMemory;

//! Read state for this tag at this moment in time
@property (readonly, nonatomic) UgiTagReadState *readState;

//! YES if the tag is visible (as defined in UgiTagReadState). This is a convenience equivalent to getReadState.isVisible)
@property (readonly, nonatomic) BOOL isVisible;

//! Inventory this tag is associated with
@property (readonly, nonatomic) UgiInventory *inventory;

@end
