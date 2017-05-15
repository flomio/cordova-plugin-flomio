//
//  UgiViewController.h
//  GrokkerTest
//
//  Created by Tony Requist on 11/11/13.
//  Copyright (c) 2013 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Ugi.h"
#import "UgiUiUtil.h"
#import "UgiTitleView.h"

/**
 UgiViewController adds some convenient functionality to UIViewController
 */
@interface UgiViewController : UIViewController<UgiUiDelegate>

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Properties
///////////////////////////////////////////////////////////////////////////////////////

//! Hide the back button
@property BOOL hidesBackButton;

//! Hide the title bar
@property BOOL hidesTitleBar;

//! Display disconnected dialog if Grokker is not connected, if inventory is running
@property (nonatomic) BOOL displayDialogIfDisconnected;

//! Display disconnected dialog if Grokker is not connected, regardless of whether inventory is running
@property (nonatomic) BOOL displayDialogIfDisconnectedEvenIfNotRunningInventory;

//! Allow screen to rotate if this is a tablet
@property (nonatomic) BOOL allowRotationIfTablet;

//! Non-nil to use this as the UI Color. If so, this is
@property (retain, nonatomic) UIColor *themeColor;

//! Non-nil to use this as the ext color to use when the background is the theme color
@property (retain, nonatomic) UIColor *textColorOnThemeColor;

//! Non-nil to use this as the UI Font
@property (retain, nonatomic) NSString *themeFontName;

//! Title view
@property (retain, nonatomic, readonly) UgiTitleView *titleView;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Methods
///////////////////////////////////////////////////////////////////////////////////////

/**
 Notification that the Grokker connection state changed
 */
- (void) connectionStateChanged;

/**
 Notification that the Grokker inventory state changed
 */
- (void) inventoryStateChanged;

/**
 Notification that the user has pressed "cancel" in the disconnected dialog.
 The default action is to pop this view controller
 */
- (void) disconnectedDialogCancelled;

/**
 Notification that the back buton was pressed.
 The default action is to pop this view controller
 */
- (void) backButtonPressed;

/**
 Go back a screen
*/
- (void) goBack;

/**
 Go back a screen
 @param completion  Code to run after animation is complete
 */
- (void) goBackWithCompletion:(VoidBlock)completion;

/**
 Notification that the app has become active
 */
- (void) appDidBecomeActive;

/**
 Notification that the app has become not active
 */
- (void) appWillResignActive;

@end
