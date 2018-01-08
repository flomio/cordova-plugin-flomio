//
//  UgiConfigurationDelegate.h
//
//  Copyright (c) 2012 U Grok it. All rights reserved.
//

#import <Foundation/Foundation.h>

@class UgiFirmwareUpdateInfo;

/**
 A UgiConfigurationDelegate object is set in the Ugi singleton object
 to handle configuration events including firmware update and region setting. By default,
 a UgiDefaultConfigurationUi object is used for this. To customize configuration functionality,
 an application will generally subclass UgiDefaultConfigurationUi.
 */
@protocol UgiConfigurationDelegate <NSObject>

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Application startup checks
///////////////////////////////////////////////////////////////////////////////////////

/**
 The application does not have permission to use the microphone. Tell this user that
 this permission is required.
 */
- (void) requestMicrophonePermission;

/**
 YES to allow Grokker serial numbers to be sent to the U Grok It server (default = YES)
 */
@property BOOL sendGrokkerSerialNumber;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Firmware update
///////////////////////////////////////////////////////////////////////////////////////

/**
 YES to run the automatic firmware update checks (default = YES)
 */
@property BOOL doAutomaticFirmwareUpdate;

/**
 A firmware update is available. Prompt the user for whether to update. If the app does not
 want to update now, return NO call the Ugi method
 repromptForAutomaticFirmwareUpdateIfAvailable at some point.
 
 @param info                Information about the firmware update that is available
 @param updateCompletion    Block to execute to do the update
 @param cancelCompletion    Block to execute if the user cancels
 @param postponeCompletion  Block to to postpone until later
 */
- (void) promptForFirmwareUpdate:(UgiFirmwareUpdateInfo * _Nonnull)info
            withUpdateCompletion:(nonnull void(^)(void))updateCompletion
            withCancelCompletion:(nonnull void(^)(void))cancelCompletion
          withPostponeCompletion:(nonnull void(^)(void))postponeCompletion;

/**
 Notify the user that there was an error loading the firmware update.
 @param completion    Block to execute after notification
 */
- (void) notifyFirmwareUpdateErrorLoadingUpdateWithCompletion:(nonnull void(^)(void))completion;

/**
 Notify the user that there was an error starting the firmware update.
 @param completion    Block to execute after notification
 */
- (void) notifyFirmwareUpdateErrorStartingUpdateWithCompletion:(nonnull void(^)(void))completion;

/**
 Display progress notification about the firmware update
 
 @param cancelCompletion    Block to execute if the user cancels
 */
- (void) displayFirmwareUpdateProgressWithCancelCompletion:(nonnull void(^)(void))cancelCompletion;

/**
 Update the progress notification about the firmware update
 
 @param amountDone          Ammount of the firmware update that is done
 @param amountTotal         Ammount of the firmware update total
 @param canCancel           YES if the user can cancel at this point
 */
- (void) updateFirmwareUpdateProgress:(int)amountDone
                      withAmountTotal:(int)amountTotal
                            canCancel:(BOOL)canCancel;

/**
 Notify the user the firmware update completed successfully
 
 @param seconds             Number of seconds that the update took
 @param completion    Block to execute after notification
 */
- (void) notifyFirmwareUpdateSuccess:(int)seconds
                      withCompletion:(nonnull void(^)(void))completion;

/**
 Notify the user that the firmware update failed

 @param mustRetry           YES of the user must retry (do not present a Cancel option)
 @param error               Error value (UgiFirmwareUpdateReturnValues)
 @param retryCompletion     Block to execute to retry the update (nil if the update cannot be retried)
 @param cancelCompletion    Block to execute if the user cancels
 */
- (void) notifyFirmwareUpdateFailure:(BOOL)mustRetry
                    withError:(NSUInteger)error
                 withRetryCompletion:(nonnull void(^)(void))retryCompletion
                withCancelCompletion:(nonnull void(^)(void))cancelCompletion;

/**
 Abort firmware update (Grokker has been disconnected)
 */
- (void) abortFirmwareUpdateInteraction;

/**
 Firmware update sequence has finished
 */
- (void) afterFirmwareUpdate:(BOOL)updated;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Waiting notification
///////////////////////////////////////////////////////////////////////////////////////

/**
 Type passed to startBackgroundAction:
 */
typedef enum {
  UgiConfigurationDelegateWaitingCause_Generic,                //!< Generic
  UgiConfigurationDelegateWaitingCause_LoadingFirmwareUpdate,	 //!< loading a firmware update
  UgiConfigurationDelegateWaitingCause_LoadingRegions,	       //!< loading regions
  UgiConfigurationDelegateWaitingCause_SettingRegion	         //!< setting the region
} UgiConfigurationDelegateWaitingCauses;

/**
 Notification that a background action is starting. Display a "waiting" alert
 
 @param cause               Action that is about to start
 */
- (void) startBackgroundAction:(UgiConfigurationDelegateWaitingCauses)cause;

/**
 Notification that a background action finished
 */
- (void) finishBackgroundAction;

@end
