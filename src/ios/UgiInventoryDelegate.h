//
//  UgiInventoryDelegate.h
//
//  Copyright (c) 2012 U Grok it. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "UgiTag.h"

@class UgiDetailedPerReadData;

///////////////////////////////////////////////////////////////////////////////////////
// Enums must be defined outside the class for Swift, but inside the class for
// Doxygen (the documentation generator)
///////////////////////////////////////////////////////////////////////////////////////

typedef NS_ENUM(int, UgiInventoryCompletedReturnValues) {
  UGI_INVENTORY_COMPLETED_OK=0,
  UGI_INVENTORY_COMPLETED_ERROR_SENDING=98,
  UGI_INVENTORY_COMPLETED_LOST_CONNECTION=99,
  UGI_INVENTORY_COMPLETED_SPI_NOT_WORKING=1,
  UGI_INVENTORY_COMPLETED_ENABLE_PIN_NOT_WORKING=2,
  UGI_INVENTORY_COMPLETED_INTERRUPT_PIN_NOT_WORKING=3,
  UGI_INVENTORY_COMPLETED_HF_NOT_SUPPORTED=4,
  UGI_INVENTORY_COMPLETED_CRYSTAL_NOT_STABLE=5,
  UGI_INVENTORY_COMPLETED_PLL_NOT_LOCKED=6,
  UGI_INVENTORY_COMPLETED_BATTERY_TOO_LOW=7,
  UGI_INVENTORY_COMPLETED_TEMPERATURE_TOO_HIGH=8,
  UGI_INVENTORY_COMPLETED_NOT_PROVISIONED=9,
  UGI_INVENTORY_COMPLETED_REGION_NOT_SET=10
};

///////////////////////////////////////////////////////////////////////////////////////
// End enums
///////////////////////////////////////////////////////////////////////////////////////

/**
 A UgiInventoryDelegate object is passed to the startInventory method
 of the Ugi singleton. This object receives notification when inventory events
 happen.

 All of the protocol methods are optional, the delegate only implements the
 methods it needs.
 */
@protocol UgiInventoryDelegate <NSObject>

@optional

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Lifecycle
///////////////////////////////////////////////////////////////////////////////////////

///@name Lifecycle

/**
 The reader has started doing inventory. This can happen multiple times during a single
 startInventory call, since the reader can be connected and disconnected from the host.
 */
- (void) inventoryDidStart;

#if DOXYGEN   // Defined before class for Swift compatibility, documented here for Doxygen compatibility
/**
 Values passed to inventoryDidStopWithResult
 */
typedef enum {
  UGI_INVENTORY_COMPLETED_OK=0,                        //!< Inventory completed normally
  UGI_INVENTORY_COMPLETED_ERROR_SENDING=98,            //!< Error sending inventory command to reader
  UGI_INVENTORY_COMPLETED_LOST_CONNECTION=99,          //!< Lost connection to the reader
  UGI_INVENTORY_COMPLETED_SPI_NOT_WORKING=1,           //!< Reader error
  UGI_INVENTORY_COMPLETED_ENABLE_PIN_NOT_WORKING=2,    //!< Reader error
  UGI_INVENTORY_COMPLETED_INTERRUPT_PIN_NOT_WORKING=3, //!< Reader error
  UGI_INVENTORY_COMPLETED_HF_NOT_SUPPORTED=4,          //!< Reader error
  UGI_INVENTORY_COMPLETED_CRYSTAL_NOT_STABLE=5,        //!< Reader error
  UGI_INVENTORY_COMPLETED_PLL_NOT_LOCKED=6,            //!< Reader error
  UGI_INVENTORY_COMPLETED_BATTERY_TOO_LOW=7,           //!< Reader error
  UGI_INVENTORY_COMPLETED_TEMPERATURE_TOO_HIGH=8,      //!< Reader error
  UGI_INVENTORY_COMPLETED_NOT_PROVISIONED=9,           //!< Reader error
  UGI_INVENTORY_COMPLETED_REGION_NOT_SET=10            //!< Reader error
} UgiInventoryCompletedReturnValues;
#endif

/**
 The reader has stopped doing inventory. If result is UGI_INVENTORY_COMPLETED_LOST_CONNECTION
 then this is a temporary stop and the inventory will continue when connection is
 reestablished.

 @param result      Result of inventory
 */
- (void) inventoryDidStopWithResult:(UgiInventoryCompletedReturnValues)result;

///@}

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Tag state changes
///////////////////////////////////////////////////////////////////////////////////////

///@name Filtering

/**
 Determine whether a newly found tag should be filtered out (not sent to inventoryTagFound
 or inventoryTagChanged, not put into the tags array).

 @param epc    The EPC
 @return       YES to filter out the tag (the defualt is to not filter out any tags)
 */
- (BOOL) inventoryFilter:(UgiEpc * _Nonnull)epc;

/**
 Filter out a tag at the raw EPC level -- this is called on an arbitrary thread and must
 work very quickly

 @param epc    The EPC
 @return       YES to filter out the EPC (the defualt is to not filter out any EPCs)
 */
- (BOOL) inventoryFilterLowLevel:(UgiEpc * _Nonnull)epc;

///@}

///@name Tag state changes

//
// The methods below are overlapping; they report the same information in different
// ways. Normally only a subset of these will be implemented in the delegate depending
// on what the delegate is trying to accomplish.
//
// If none of (inventoryTagChanged, inventoryTagSubsequentFinds,inventoryHistoryInterval)
// are used, (inventoryTagFound only) then internal optimization is done to not track subsequent finds.
//

/**
 The visibility of a tag has changed.

 - A tag has been found for the first time
 - A tag has not been seen for the history period (interval * depth)
 - A tag that had not been seen for the history period has reappeared

 @param tag        The tag that has changed
 @param firstFind  YES if this is the first time this tag has been found
 */
- (void) inventoryTagChanged:(UgiTag * _Nullable)tag
                 isFirstFind:(BOOL)firstFind;

/**
 A new tag has been found

 @param tag        The tag that has been found
 @param detailedPerReadData  Array of UgiDetailedPerReadData obejcts, if detailed per-read data was requested
 */
- (void) inventoryTagFound:(UgiTag * _Nonnull)tag
   withDetailedPerReadData:(NSArray<UgiDetailedPerReadData *> * _Nullable)detailedPerReadData;

/**
 A previously found tag has been found again

 @param tag        The tag
 @param num        The number of finds since inventoryTagSubsequentFinds was last called
 @param detailedPerReadData  Array of UgiDetailedPerReadData obejcts, if detailed per-read data was requested
 */
- (void) inventoryTagSubsequentFinds:(UgiTag * _Nonnull)tag
                            numFinds:(int)num
             withDetailedPerReadData:(NSArray<UgiDetailedPerReadData *> * _Nullable)detailedPerReadData;

///@}

///@name Other

/**
 A history interval has passed.

 This method is called at the end of each history interval IF one or more
 tags are currently visible
 */
- (void) inventoryHistoryInterval;

///@}

@end
