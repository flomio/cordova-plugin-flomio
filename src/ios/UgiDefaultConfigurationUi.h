//
//  UgiDefaultConfigurationUi.h
//  UGrokItApi
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "UgiConfigurationDelegate.h"

/**
 Default implementation of UgiConfigurationDelegate. May be subclassed by applications.
 */
@interface UgiDefaultConfigurationUi : NSObject<UgiConfigurationDelegate>

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Alerts
///////////////////////////////////////////////////////////////////////////////////////

/**
 Show an alert with ok and cancel buttons
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param okButtonTitle       Text for the "ok" button, or "" for the defualt, or nil for no ok button
 @param cancelButtonTitle   Text for the "cancel" button, or "" for the defualt, or nil for no cancel button
 @param completion          Block to execute for "ok"
 @param cancelCompletion    Block to execute for "cancel"
 
 @return                    The alert
 */
- (UIView *)showOkCancel:(NSString *)title
                 message:(NSString *)message
           okButtonTitle:(NSString *)okButtonTitle
       cancelButtonTitle:(NSString *)cancelButtonTitle
          withCompletion:(void(^)(void))completion
    withCancelCompletion:(void(^)(void))cancelCompletion;

/**
 Show an alert with an ok button
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param okButtonTitle       Text for the "ok" button, or "" for the defualt, or nil for no ok button
 @param completion          Block to execute for "ok"
 
 @return                    The alert
 */
- (UIView *)showOk:(NSString *)title
           message:(NSString *)message
     okButtonTitle:(NSString *)okButtonTitle
    withCompletion:(void(^)(void))completion;

/**
 Hide an alert
 @param alert               The alert to hide
 */
- (void) hideAlert:(NSObject *)alert;

/**
 Update the message in an alert
 
 @param alert               The alert to update
 @param message             Text for the body of the alert
 */
- (void) updateAlert:(UIView *)alert
         withMessage:(NSString *)message;

/**
 Show "waiting" alert, call completion if cancelled
 
 @param message             Text for the body of the alert
 @param cancelCompletion    Block to execute for "cancel" (or nil if cancel is not an option)
 */
- (void)showWaiting:(NSString *)message withCancelCompletion:(void(^)(void))cancelCompletion;

/**
 Show "waiting" alert without cancel
 
 @param message             Text for the body of the alert
 */
- (void)showWaiting:(NSString *)message;

/**
 Hide "waiting" alert
 */
- (void)hideWaiting;

/**
 Show a view controller
 
 @param viewController      View controller to show
 */
- (void) showViewController:(UIViewController *)viewController;

/**
 Hide a view controller
 
 @param viewController      View controller to hide
 */
- (void) hideViewController:(UIViewController *)viewController;

/**
 Get supported orientations (used for set-region view controller)
 
 @return Supported orientations
 */
- (UIInterfaceOrientationMask)supportedInterfaceOrientations;

@end
