//
//  Ugi_firmwareUpdate.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#import "Ugi.h"

#define __UGI_FIRMWARE_UPDATE_H

#import <Foundation/Foundation.h>

///////////////////////////////////////////////////////////////////////////////////////
// Enums must be defined outside the class for Swift, but inside the class for
// Doxygen (the documentation generator)
///////////////////////////////////////////////////////////////////////////////////////

typedef NS_ENUM(NSInteger, UgiFirmwareUpdateCompatibilityValues) {
  FIRMWARE_COMPATIBILITY_INVALID = 0,
  FIRMWARE_COMPATIBILITY_INCOMPATIBLE = 1,
  FIRMWARE_COMPATIBILITY_DOWNGRADE = 2,
  FIRMWARE_COMPATIBILITY_SAME_VERSION = 3,
  FIRMWARE_COMPATIBILITY_UPGRADE = 4
};

typedef NS_ENUM(NSUInteger, UgiFirmwareUpdateReturnValues) {
  UGI_FIRMWARE_UPDATE_SUCCESS = 0,
  UGI_FIRMWARE_UPDATE_NO_FILE = 100,
  UGI_FIRMWARE_UPDATE_BAD_FILE = 101,
  UGI_FIRMWARE_UPDATE_INCOMPATIBLE_HARDWARE = 102,
  UGI_FIRMWARE_UPDATE_INCOMPATIBLE_VERSION = 103,
  UGI_FIRMWARE_UPDATE_CRC_MISMATCH = 3,
  UGI_FIRMWARE_UPDATE_PROTOCOL_FAILURE = 104,
  UGI_FIRMWARE_UPDATE_CANT_RECONNECT = 105,
  UGI_FIRMWARE_UPDATE_CANCELLED = 106,
  UGI_FIRMWARE_UPDATE_BATTERY_TOO_LOW = 107
};

///////////////////////////////////////////////////////////////////////////////////////
// End enums
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiFirmwareUpdateInfo
///////////////////////////////////////////////////////////////////////////////////////

/**
 A UgiFirmwareUpdateInfo object contains information about a single firmware update
 available via an update channel.
 */
@interface UgiFirmwareUpdateInfo : NSObject

#if DOXYGEN   // Defined before class for Swift compatibility, documented here for Doxygen compatibility
//! Values returned from firmwareCheckCompatibility
typedef enum {
  FIRMWARE_COMPATIBILITY_INVALID = 0,        //!< File is invalid
  FIRMWARE_COMPATIBILITY_INCOMPATIBLE = 1,   //!< File is incompatible with this Grokker
  FIRMWARE_COMPATIBILITY_DOWNGRADE = 2,      //!< File is older than the firmware on this Grokker
  FIRMWARE_COMPATIBILITY_SAME_VERSION = 3,   //!< File is the same as the firmware on this Grokker
  FIRMWARE_COMPATIBILITY_UPGRADE = 4         //!< File is newer than the firmware on this Grokker
} UgiFirmwareUpdateCompatibilityValues;
#endif

@property (readonly, retain, nonatomic) NSString *name;            //!< Name of update file
@property (readonly) int protocol;                                 //!< Reader protocol
@property (readonly, retain, nonatomic) NSString *notes;           //!< Notes

@property (readonly, nonatomic) UgiFirmwareUpdateCompatibilityValues compatibilityValue;   //!< Compatibility
@property (readonly, nonatomic) int softwareVersionMajor;        //!< Version major
@property (readonly, nonatomic) int softwareVersionMinor;        //!< Version minor
@property (readonly, nonatomic) int softwareVersionBuild;        //!< Version build
@property (readonly, retain, nonatomic) NSDate *sofwareVersionDate;    //!< Date the firmware ware built

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiFirmwareUpdateDelegate
///////////////////////////////////////////////////////////////////////////////////////

/**
 A UgiFirmwareUpdateDelegate object is passed to the firmwareUpdate method
 of the Ugi singleton.
 
 All of the protocol methods are optional, the delegate only implements the
 methods it needs.
 */
@protocol UgiFirmwareUpdateDelegate <NSObject>

@optional

/**
 Firmware update progress
 @param amountDone     amount of the update completed
 @param amountTotal    amount in the complete update
 @param canCancel      YES if the update can be cancelled at this point
 */
- (void) firmwareUpdateProgress:(int)amountDone
                withAmountTotal:(int)amountTotal
                      canCancel:(BOOL)canCancel;

#if DOXYGEN   // Defined before class for Swift compatibility, documented here for Doxygen compatibility
/**
 Values returned from firmwareUpdate and sent with firmwareUpdateCompleted
 */
typedef enum {
  UGI_FIRMWARE_UPDATE_SUCCESS = 0,                    //!< Update successful
  UGI_FIRMWARE_UPDATE_NO_FILE = 100,                  //!< No update file loaded
  UGI_FIRMWARE_UPDATE_BAD_FILE = 101,                 //!< The update file is corrupted
  UGI_FIRMWARE_UPDATE_INCOMPATIBLE_HARDWARE = 102,    //!< The update is not compatible with the reader
  UGI_FIRMWARE_UPDATE_INCOMPATIBLE_VERSION = 103,     //!< The update is incompatible with the existing firmware
  UGI_FIRMWARE_UPDATE_CRC_MISMATCH = 3,               //!< CRC mismatch in the file
  UGI_FIRMWARE_UPDATE_PROTOCOL_FAILURE = 104,         //!< Failure communicating with the Grokker
  UGI_FIRMWARE_UPDATE_CANT_RECONNECT = 105,           //!< Can't reconnect to the Grokker
  UGI_FIRMWARE_UPDATE_CANCELLED = 106,                //!< Update was cancelled
  UGI_FIRMWARE_UPDATE_BATTERY_TOO_LOW = 107           //!< Battery is too low to update the firmware
} UgiFirmwareUpdateReturnValues;
#endif

/**
 Firmware update complete
 @param result  Result of the update
 @param seconds Time the update took in seconds
 */
- (void) firmwareUpdateCompleted:(UgiFirmwareUpdateReturnValues)result
                      updateTime:(int)seconds;

@end

////////////////////////////////////////

/**
 Firmware update portion of Ugi interface
 */
@interface Ugi ()

/**
 * Name of release channel
 */
@property (readonly, nonatomic) NSString *FIRMWARE_CHANNEL_RELEASE;

/**
 * Name of development channel
 */
@property (readonly, nonatomic) NSString *FIRMWARE_CHANNEL_DEVELOPMENT;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Automatic update
///////////////////////////////////////////////////////////////////////////////////////

/**
 If an automatic firmware update is available, reprompt for it (via the configuration delegate)
 */
- (void) repromptForAutomaticFirmwareUpdateIfAvailable;

/**
 Completion type for checkForUpdateOnConnect
 @param info         Info for update that is ready (or nil if update cannot be loaded)
 @param required     YES if update is required
 */
typedef void (^AutomaticCheckForFirmwareUpdateCompletion)(UgiFirmwareUpdateInfo *info, BOOL required);

/**
 Check for firmware update automatically.
 The channel data is reloaded:
 - when forceFirmwareChannelReload: is called
 - on UIApplicationDidBecomeActiveNotification
 - once a day
 The Grokker is checked for needing to be updated:
 - each time a Grokker is connected
 - whenever new channel data is loaded (and a Grokker is connected and not running inventory)
 - when forceFirmwareGrokkerCheck: is called
 It is possible that a firmware update is available at a time that is inconveient for an update.
 
 @param channel   Channel to connect on, normally FIRMWARE_CHANNEL_RELEASE
 @param completion  Completion code when an update is ready
 */
- (void) automaticCheckForFirmwareUpdate:(NSString *)channel
                          withCompletion:(AutomaticCheckForFirmwareUpdateCompletion)completion;

/**
 Update the firmware update status (reload the control file).
 @param onlyIfSomeTimeHasPassed     YES to only force the check if time has passed since the last check
 */
- (void) forceFirmwareChannelReload:(BOOL)onlyIfSomeTimeHasPassed;

/**
 Check the grokker for firmware update
 @return YES if a firmware update was initiated
 */
- (BOOL) forceFirmwareGrokkerCheck;

/**
 Load an update. The update is loaded into a file in the _UGrokItSDK directory
 Calback is called with YES if the update loaded successfully
 @param name Update to load
 @param completion  Completion called after the update has been loaded
 */
- (void)loadUpdateWithName:(NSString *)name
            withCompletion:(void(^)(NSError *error))completion;

/**
 Update firmware that has been previously loaded with loadUpdateWithName:
 
 @param delegate    Object to send notifications to
 @return Result of starting the firmware update
 */
- (UgiFirmwareUpdateReturnValues) firmwareUpdate:(id<UgiFirmwareUpdateDelegate>)delegate;

/**
 Cancel an update in progress
 */
- (void) cancelFirmwareUpdate;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Advanced options
///////////////////////////////////////////////////////////////////////////////////////

/**
 Load updates (metadata)
 @param channel   Channel to load from, normally FIRMWARE_CHANNEL_RELEASE
 @param completion  Completion code when updates are loaded
 */
- (void) loadUpdatesFromChannel:(NSString *)channel
                 withCompletion:(void(^)(NSMutableArray *updates))completion;

/**
 After firmware has been updated, update an array of UgiFirmwareUpdateInfo objects
 @param updates   Updates to update
 */
- (void) updateFirmwareInfoCompatibility:(NSMutableArray *)updates;

/**
 Check compatibility of a given update file
 
 @param filePath    File name (or path) to check
 @param compatibility Version of firmware filePath is compatible with
 @return   Compatibility
 */
- (UgiFirmwareUpdateCompatibilityValues) firmwareCheckCompatibility:(NSString *)filePath
                                                  withCompatibility:(NSString *)compatibility;

/**
 See if an update is in progress
 @return    YES if an update is in progress
 */
- (BOOL)isUpdateInProgress;

/**
 See if an update is required
 @return    YES if an update is required
 */
- (BOOL)isUpdateRequired;

/**
 Set that this app requires a minimum firmware version on the Grokker
 @param firmwareVersion    The minimum firmware version
 */
- (void)requiresFirmwareVersion:(NSString *)firmwareVersion;

/**
 Update firmware that has been previously loaded with loadUpdateWithName:
 
 @param delegate    Object to send notifications to
 @param downgrade   YES to allow downgrading
 @param sameVersion YES to allow sending the same version the reader has now
 @return Result of starting the firmware update
 */
- (UgiFirmwareUpdateReturnValues) firmwareUpdate:(id<UgiFirmwareUpdateDelegate>)delegate
                                  allowDowngrade:(BOOL)downgrade
                                allowSameVersion:(BOOL)sameVersion;

//! DEBUGGING - cause the firmware update code to update to the previous version
// of the formware. This enables repoeated testing of the firmware update code, which
// is useful for applications that override some of the default firmware update functionality.
@property (nonatomic) BOOL debug_forceFirmwareUpdateToPreviousVersion;

@end
