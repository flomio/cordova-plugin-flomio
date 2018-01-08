//
//  UgiRfMicron.h
//  UGrokItApi
//
//  Copyright (c) 2016 U Grok It. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "UgiRfidConfiguration.h"
#import "UgiInventory.h"

///////////////////////////////////////////////////////////////////////////////////////
// Enums must be defined outside the class for Swift, but inside the class for
// Doxygen (the documentation generator)
///////////////////////////////////////////////////////////////////////////////////////

typedef NS_ENUM(int, UgiRfMicronMagnusModels) {
  UGI_RF_MICRON_MAGNUS_MODEL_401,
  UGI_RF_MICRON_MAGNUS_MODEL_402,
  UGI_RF_MICRON_MAGNUS_MODEL_403
};

/**
 RF Micron Magnus on-chip RSSI limit types
 */
typedef NS_ENUM(int, UgiRfMicronMagnusRssiLimitTypes) {
  UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_NONE,
  UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_LESS_THAN_OR_EQUAL,
  UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_GREATER_THAN_OR_EQUAL
};

///////////////////////////////////////////////////////////////////////////////////////
// End enums
///////////////////////////////////////////////////////////////////////////////////////

/**
 Support for reading RF Micron tags
 */
@interface UgiRfMicron : NSObject

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Types
///////////////////////////////////////////////////////////////////////////////////////

#if DOXYGEN   // Defined before class for Swift compatibility, documented here for Doxygen compatibility
/**
 RF Micron Magnus models
 */
typedef enum {
  UGI_RF_MICRON_MAGNUS_MODEL_401,   //! Model 401
  UGI_RF_MICRON_MAGNUS_MODEL_402,   //! Model 402
  UGI_RF_MICRON_MAGNUS_MODEL_403   //! Model 403
} UgiRfMicronMagnusModels;

/**
 RF Micron Magnus on-chip RSSI limit types
 */
typedef enum {
  UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_NONE,                    //! No limit
  UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_LESS_THAN_OR_EQUAL,      //! Limit to RSSI less than or equal the threshold
  UGI_RF_MICRON_MAGNUS_LIMIT_TYPE_GREATER_THAN_OR_EQUAL    //! Limit to RSSI greater than or equal the threshold
} UgiRfMicronMagnusRssiLimitTypes;
#endif

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Methods
///////////////////////////////////////////////////////////////////////////////////////

/**
 Modify a UgiRfidConfiguration to read the sensor value from a RF Micron Magnus tag.

 @param inventoryType       One of UgiInventoryTypes
 @param tagModel            RF Micron Magnus tag model: RF_MAGNUS_MODEL_xxx
 @param rssiLimitType       Type of RSSI limit: RF_MAGNUS_LIMIT_RSSI_TYPE_xxx
 @param limitRssiThreshold  Threshold for rssiLimitType
 @return                    Configuration structure
 */
+ (UgiRfidConfiguration * _Nonnull) configToReadMagnusSensorValue:(UgiInventoryTypes)inventoryType
                                                     withTagModel:(UgiRfMicronMagnusModels)tagModel
                                                withRssiLimitType:(UgiRfMicronMagnusRssiLimitTypes)rssiLimitType
                                           withLimitRssiThreshold:(int)limitRssiThreshold;
/**
 Get the sensor value from a RF Micron tag

 @param perReadData  UgiDetailedPerReadData structure passed to inventoryTagFound or inventoryTagSubsequentFinds
 @return             Sensor code
 */
+ (int) getMagnusSensorCode:(UgiDetailedPerReadData * _Nonnull)perReadData;

/**
 Get the on-chip RSSI value from a RF Micron tag

 @param perReadData  UgiDetailedPerReadData structure passed to inventoryTagFound or inventoryTagSubsequentFinds
 @return             On-chip RSSI
 */
+ (int) getMagnusOnChipRssi:(UgiDetailedPerReadData * _Nonnull)perReadData;

/////

/**
 Modify a UgiRfidConfiguration to read the temperature from a RF Micron Magnus tag.

 @param inventoryType       One of UgiInventoryTypes
 @return                    Configuration structure
 */
+ (UgiRfidConfiguration * _Nonnull) configToReadMagnusTemperature:(UgiInventoryTypes)inventoryType;

/**
 Get the temperature RSSI value from a RF Micron tag

 @param tag          The tag
 @param perReadData  UgiDetailedPerReadData structure passed to inventoryTagFound or inventoryTagSubsequentFinds
 @return             Temperature (degrees C), or -999 if invalid
 */
+ (double) getMagnusTemperature:(UgiTag * _Nonnull)tag
                    perReadData:(UgiDetailedPerReadData * _Nonnull)perReadData;

@end
