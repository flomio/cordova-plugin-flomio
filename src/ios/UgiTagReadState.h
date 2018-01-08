//
//  UgiTagReadState.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#define __UGI_TAG_READ_STATE_H

#import <Foundation/Foundation.h>

#import "UgiTag.h"

/**
 The moment-in-time read state of a tag. This object is immutable.
 */
@interface UgiTagReadState : NSObject

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties
///////////////////////////////////////////////////////////////////////////////////////

//! Tag this state is associated with
@property (readonly, nonatomic, nonnull) UgiTag *tag;

//! When this state was created
@property (readonly, nonatomic, nonnull) NSDate *timestamp;

//! Is the tag currently visible (has it been seem in the last N seconds, where N is historyIntervalMSec*historyDepth
@property (readonly, nonatomic) BOOL isVisible;

//! Total number of reads (since inventory started)
@property (readonly, nonatomic) int totalReads;

//! When this tag was most recently read
@property (readonly, nonatomic, nonnull) NSDate *mostRecentRead;

//! Most recent RSSI value, I channel
@property (readonly, nonatomic) double mostRecentRssiI;
//! Most recent RSSI value, Q channel
@property (readonly, nonatomic) double mostRecentRssiQ;

/**
 Tag's read history
 Array of number of times the tag was found in each history period
 [0] is the most recent data
 */
@property (readonly, nonatomic, nullable) NSArray *readHistory;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Methods
///////////////////////////////////////////////////////////////////////////////////////

/**
 Get a string representing the read history of the tag, generally for debugging

 @return Read history of the tag
 */
- (NSString * _Nullable)readHistoryString;
/**
 Get a description of the tag state, generally for debugging

 @return Description of the tag
 */
- (NSString * _Nonnull)description;

@end
