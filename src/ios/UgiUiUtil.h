//
//  UgiUiUtil.h
//  UGrokItApi
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Ugi.h"

///////////////////////////////////////////////////////////////////////////////////////
// Enums must be defined outside the class for Swift, but inside the class for
// Doxygen (the documentation generator)
///////////////////////////////////////////////////////////////////////////////////////

typedef NS_ENUM(NSInteger, UgiShowModalAnimationTypes) {
  UgiModalBottom, UgiModalCenter, UgiModalCenterWithKeyboard
};

///////////////////////////////////////////////////////////////////////////////////////
// End enums
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiMenuItem
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Objects passed to showMenu
 */
@interface UgiMenuItem : NSObject

//! Title for the menu item
@property (retain, nonatomic) NSString *title;

//! Handler for the menu item
@property (strong, nonatomic) VoidBlock handler;

/**
 Create a menu item
 @param title      Title for the menu item
 @param handler    Handler for the menu item
 @return       Menu item
 */
+ (UgiMenuItem *) itemWithTitle:(NSString *)title withHandler:(VoidBlock)handler;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiUiDelegate
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Delegate to return UI settings used in UI created by UgiUiUtil. A delegate can optionally
 * be provided by the application
 */
@protocol UgiUiDelegate

@optional

/**
 Get the view to show UI on (such as alerts)
 @return       UIView to show UI on
 */
- (UIView *) getViewControllerToShowUiOn;

/**
 Show a view controller
 @param viewController    View controller to show
 */
- (void) showViewController:(UIViewController *)viewController;

/**
 Hide a view controller
 @param viewController    View controller to hide
 */
- (void) hideViewController:(UIViewController *)viewController;

//! Get the color to use for buttons and styling
@property (readonly) UIColor *uiThemeColor;

//! Get the color to use when on top of the theme color
@property (readonly) UIColor *uiTextColorOnThemeColor;

//! Get the font name to use for buttons
@property (readonly) NSString *uiFontName;

@end

//////////////////////////////////

/**
 UgiUiUtil is a collection of static UI utilities for showing alerts. It is used by
 UgiDefaultConfigurationUi to show UI for configuration
 */
@interface UgiUiUtil : NSObject

//! @cond
// Xamarin helpers
+ (void) internalShowViewController:(UIViewController *)viewController;
+ (void) internalHideViewController:(UIViewController *)viewController;
//! @endcond

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Delegate
///////////////////////////////////////////////////////////////////////////////////////

/**
 Get the UI Delegate
 @return UgiUiDelegate object, or nil if none
 */
+ (NSObject<UgiUiDelegate> *) uiDelegate;

/**
 Set the UI Delegate
 @param delegate   UgiUiDelegate object to set
 */
+ (void) setUiDelegate:(NSObject<UgiUiDelegate> *)delegate;

/**
 Get the color to use for UI stuff (from the delegate, otherwise the default)
 @return color
 */
+ (UIColor *)uiThemeColor;

/**
 Get the textColorOnThemeColor to use for UI stuff (from the delegate, otherwise the default)
 @return color
 */
+ (UIColor *)uiTextColorOnThemeColor;

/**
 Get the font name to use for UI stuff (from the delegate, otherwise the default)
 @return font name
 */
+ (NSString *)uiFontName;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Top level
///////////////////////////////////////////////////////////////////////////////////////

/**
 Get the screen size, accounting for rotation
 @return       screen size
 */
+ (CGSize) screenSizeConsideringOrientation;

/**
 Show a view controller
 @param viewController       View controller to show
 */
+ (void) showViewController:(UIViewController *)viewController;

/**
 Hide a view controller
 @param viewController       View controller to hide
 */
+ (void) hideViewController:(UIViewController *)viewController;

////////////

/**
 Perform a cancellable block after a delay
 @param seconds    Delay befire executing block
 @param block      Code to run
 @return           id to use to cancel the block
 */
+ (id) performCancellableBlockAfterSeconds:(double)seconds
                                     block:(VoidBlock)block;

/**
 Cancel a block scheduled with performCancellableBlockAfterSeconds:block:
 @param blockId    id returned from performCancellableBlockAfterSeconds:
 */
+ (void) cancelBlock:(id)blockId;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Alerts
///////////////////////////////////////////////////////////////////////////////////////

/**
 * Hide UI shown with any of the showXXX methods
 * @param o   Object returned by the showXXX method
 */
+ (void) hideUI:(NSObject *)o;

/**
 * Update an alert's title
 * @param alert   Object returned by the showXXX method
 * @param title   New title
 */
+ (void) updateAlert:(NSObject *)alert withTitle:(NSString *)title;

/**
 * Update an alert's message
 * @param alert   Object returned by the showXXX method
 * @param message New message
 */
+ (void) updateAlert:(NSObject *)alert withMessage:(NSString *)message;

/**
 Show an alert with a cancel button
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param completion          Block to execute for "ok"
 @return                    Object to pass to hideAlert:
 */
+ (NSObject *)showCancel:(NSString *)title
                 message:(NSString *)message
          withCompletion:(VoidBlock)completion;

/**
 Show an alert with an ok button
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @return                    The alert
 */
+ (NSObject *)showOk:(NSString *)title
             message:(NSString *)message;

/**
 Show an alert with an ok button
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param completion          Block to execute for "ok"
 @return                    The alert
 */
+ (NSObject *)showOk:(NSString *)title
             message:(NSString *)message
      withCompletion:(VoidBlock)completion;

/**
 Show an alert with an ok button
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param okButtonTitle       Text for the "ok" button, or "" for the default, or nil for no ok button
 @param completion          Block to execute for "ok"
 @return                    The alert
 */
+ (NSObject *)showOk:(NSString *)title
             message:(NSString *)message
       okButtonTitle:(NSString *)okButtonTitle
      withCompletion:(VoidBlock)completion;

/**
 Show an alert with ok and cancel buttons
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param completion          Block to execute for "ok"
 @return                    The alert
 */
+ (NSObject *)showOkCancel:(NSString *)title
                   message:(NSString *)message
            withCompletion:(VoidBlock)completion;

/**
 Show an alert with ok and cancel buttons
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param okButtonTitle       Text for the "ok" button, or "" for the default, or nil for no ok button
 @param cancelButtonTitle   Text for the "cancel" button, or "" for the default, or nil for no cancel button
 @param completion          Block to execute for "ok"
 @return                    The alert
 */
+ (NSObject *)showOkCancel:(NSString *)title
                   message:(NSString *)message
             okButtonTitle:(NSString *)okButtonTitle
         cancelButtonTitle:(NSString *)cancelButtonTitle
            withCompletion:(VoidBlock)completion;

/**
 Show an alert with ok and cancel buttons
 
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param okButtonTitle       Text for the "ok" button, or "" for the default, or nil for no ok button
 @param cancelButtonTitle   Text for the "cancel" button, or "" for the default, or nil for no cancel button
 @param completion          Block to execute for "ok"
 @param cancelCompletion    Block to execute for "cancel"
 @return                    The alert
 */
+ (NSObject *)showOkCancel:(NSString *)title
                   message:(NSString *)message
             okButtonTitle:(NSString *)okButtonTitle
         cancelButtonTitle:(NSString *)cancelButtonTitle
            withCompletion:(VoidBlock)completion
      withCancelCompletion:(VoidBlock)cancelCompletion;

///////////////

//! completion for showTextInput, return YES to enable the action button
typedef BOOL (^UgiShowTextInputShouldEnableForTextCompletion)(NSString *text);

//! completion for showTextInput
typedef void (^UgiShowTextInputCompletionWithText)(NSString *text, BOOL switchValue);

/**
 Input a text string from the user
 @param title                 Title for the alert
 @param message               Message for the alert
 @param actionButtonTitle     Text for the "ok" button, or "" for the default, or nil for no ok button
 @param initialText           Initial text
 @param allowAutoCorrection   YES to allow auto correct
 @param keyboardType          Type of keyboard
 @param switchText            Text for an on/off switch (if nil then no switch)
 @param switchInitialValue    Initial value for the switch
 @param completion            Block to execute for "ok"
 @param cancelCompletion      Block to execute for "cancel"
 @param shouldEnableForTextCompletion   Code to determine whether the action button should be enabled
 @return                    The alert
 */
+ (NSObject *)showTextInput:(NSString *)title
                    message:(NSString *)message
          actionButtonTitle:(NSString *)actionButtonTitle
                initialText:(NSString *)initialText
        allowAutoCorrection:(BOOL)allowAutoCorrection
               keyboardType:(UIKeyboardType)keyboardType
                 switchText:(NSString *)switchText
         switchInitialValue:(BOOL)switchInitialValue
             withCompletion:(UgiShowTextInputCompletionWithText)completion
       withCancelCompletion:(VoidBlock)cancelCompletion
withShouldEnableForTextCompletion:(UgiShowTextInputShouldEnableForTextCompletion)shouldEnableForTextCompletion;

///////////////

///////////////

/**
 Show an alert with three buttons
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param button1Title        Text for button 1
 @param button2Title        Text for button 2
 @param cancelButtonTitle   Text for the "cancel" button, or "" for the default, or nil for no cancel button
 @param button1Completion   Block to execute for button 1
 @param button2Completion   Block to execute for button 2
 @param cancelCompletion    Block to execute for "cancel"
 @return                    The alert
 */
+ (NSObject *)show3ButtonAlert:(NSString *)title
                       message:(NSString *)message
                  button1Title:(NSString *)button1Title
                  button2Title:(NSString *)button2Title
             cancelButtonTitle:(NSString *)cancelButtonTitle
             button1Completion:(VoidBlock)button1Completion
             button2Completion:(VoidBlock)button2Completion
          withCancelCompletion:(VoidBlock)cancelCompletion;

///////////////

//! Completion for showManyButtonAlert
typedef void (^UgiAlertCompletionWithIndex)(NSInteger buttonIndex);

/**
 Show an alert with many buttons
 @param title               Title for the alert
 @param message             Text for the body of the alert
 @param buttonTitles        Array of button titles
 @param cancelButtonTitle   Text for the "cancel" button, or "" for the default, or nil for no cancel button
 @param completion          Block to execute for when a button is selected
 @return                    The alert
 */
+ (NSObject *)showManyButtonAlert:(NSString *)title
                          message:(NSString *)message
                     buttonTitles:(NSArray<NSString *> *)buttonTitles
                cancelButtonTitle:(NSString *)cancelButtonTitle
                   withCompletion:(UgiAlertCompletionWithIndex)completion;

///////////////

//! Completion for showChoices:
typedef void (^UgiShowChoicesAlertCompletion)(int index, NSString *name);

//! Completion for showChoices:
typedef void (^UgiShowChoicesAlertConfirmationCompletion)(int index, NSString *name, VoidBlock completion);

/**
 Show UI to choose from a list of choices
 
 @param choices               Choices to choose from
 @param initialSelectedIndex  Choice to select initially
 @param title                 Title for the alert
 @param message               Text for the body of the alert
 @param actionButtonTitle     Text for the "ok" button, or "" for the default, or nil for no ok button
 @param canCancel             true if the user can cancel
 @param completion            Block to execute for "ok"
 @param confirmationCompletion      Block to execute before "ok"
 @param cancelCompletion      Block to execute for "cancel"
 @return                      The alert
 */
+ (NSObject *) showChoices:(NSArray<NSString *> *)choices
  withInitialSelectedIndex:(int)initialSelectedIndex
                 withTitle:(NSString *)title
               withMessage:(NSString *)message
     withActionButtonTitle:(NSString *)actionButtonTitle
             withCanCancel:(BOOL)canCancel
            withCompletion:(UgiShowChoicesAlertCompletion)completion
withConfirmationCompletion:(UgiShowChoicesAlertConfirmationCompletion)confirmationCompletion
      withCancelCompletion:(VoidBlock) cancelCompletion;

//! @cond
+ (NSObject *) showMenuWithTitle:(NSString *)title
            withCancelCompletion:(VoidBlock)cancelCompletion
           withTitlesAndHandlers:(id)firstTitle, ... NS_REQUIRES_NIL_TERMINATION __attribute__((deprecated));
//! @endcond

/**
 Show a menu of possible actions
 @param title   Title for the menu
 @param cancelCompletion      Block to execute for "cancel"
 @param items                 Array of menu items
 @return                      The alert
 */
+ (NSObject *) showMenuWithTitle:(NSString *)title
            withCancelCompletion:(VoidBlock)cancelCompletion
                       withItems:(NSArray<UgiMenuItem*> *)items;

/////////////

//
// Alternative version for Xamarin Wrapper
//
//! @cond
typedef void (^UgiShowMenuLowCompletion)(int choice);
+ (NSObject *) showMenuWithTitle:(NSString *)title
            withCancelCompletion:(VoidBlock)cancelCompletion
                      withTitles:(NSArray<NSString *> *)titles
                     withHandler:(UgiShowMenuLowCompletion)handler;
//! @endcond

///////////////

/**
 Show "waiting" alert, call completion if cancelled
 
 @param message             Text for the body of the alert
 @param completion          Block to execute for "cancel" (or nil if cancel is not an option)
 */
+ (void)showWaiting:(NSString *)message withCancelCompletion:(VoidBlock)completion;

/**
 Show "waiting" alert without cancel
 
 @param message             Text for the body of the alert
 */
+ (void)showWaiting:(NSString *)message;

/**
 Hide "waiting" alert
 */
+ (void)hideWaiting;

/**
 Update the "waiting" alert
 @param message   New message
 */
+ (void) updateWaiting:(NSString *)message;

//! See if the waiting alert is shown
+ (BOOL)isWaitingShown;

/**
 Show a "toast" (a temporary message) for the default time
 @param title               Title for the toast
 @param message             Text for the body of the toast
 */
+ (void)showToast:(NSString *)title
          message:(NSString *)message;

/**
 Show a "toast" (a temporary message)
 @param title               Title for the toast
 @param message             Text for the body of the toast
 @param interval            Duration to display the toast
 */
+ (void)showToast:(NSString *)title
          message:(NSString *)message
  forTimeInterval:(NSTimeInterval)interval;

/**
 Show an alert with version information
 @param title              Title fot the alert (or nil to use the app name and version)
 @param showExtraInfo      YES to display additional (debugging) info
 @return                      The alert
 */
+ (NSObject *)showVersionAlertWithTitle:(NSString *)title
                      withShowExtraInfo:(BOOL)showExtraInfo;

///////////////

/**
 Call stop inventory while displaying a waiting dialog
 @param completion      Code to run after inventory is stopped
 */
+ (void) stopInventoryWithCompletionShowWaiting:(StopInventoryCompletion)completion;

/**
 * Stop running inventory, showing a waiting dialog if the given dialog is dismissed before
 * inventory stops
 * @param alert         Alert being shown
 * @param completion    Completion to run after inventory stops and the alert is dismissed
 */
+ (void) stopInventoryWithShownAlert:(NSObject *)alert
                      withCompletion:(StopInventoryCompletion)completion;

///////////////

/**
 Show an alert if the Grokker is not connected
 
 @param cancelCompletion    Block to execute if the user cancels
 */
+ (void) startDisconnectedAlert:(VoidBlock)cancelCompletion;

/**
 Stop showing the disconnected alert
 */
+ (void) stopDisconnectedAlert;

///////////////

/**
 Get the description of an intentory error
 @param result     The error
 @return           Description
 */
+ (NSString *) inventoryErrorMessageForResult:(UgiInventoryCompletedReturnValues)result;

/**
 Get the description of a tag access error
 @param result     The error
 @return           Description
 */
+ (NSString *) tagAccessErrorMessageForTagAccessReturnValue:(UgiTagAccessReturnValues) result;

/**
 Show an alert with a message about an inventory error
 @param result     The error
 @return           The alert
 */
+ (NSObject *) showInventoryError:(UgiInventoryCompletedReturnValues)result;

/**
 Show an alert with a message about an inventory error
 @param result        The error
 @param completion    Block to execute when the alert is completed
 @return              The alert
 */
+ (NSObject *) showInventoryError:(UgiInventoryCompletedReturnValues)result
                   withCompletion:(VoidBlock)completion;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UIView
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for UIView
@interface UIView (UgiUiUtil)

#if DOXYGEN   // Defined before class for Swift compatibility, documented here for Doxygen compatibility
//! Type passed to showModal for the type of transition and the placement
typedef enum {
  UgiModalBottom,             //! Show at bottom
  UgiModalCenter,             //! Show in center
  UgiModalCenterWithKeyboard  //! Show in center, accounting for a keyboard
} UgiShowModalAnimationTypes;
#endif

/**
 Show this view as a modal dialog
 @param animationType  Type of animation
 @return               id to pass to hideModal:
 */
- (id) showModal:(UgiShowModalAnimationTypes)animationType;

/**
 Show this view after it has been shown with showModal:
 @param idFromShowModal  ID returned by showModal
 */
- (void) hideModal:(id)idFromShowModal;

/**
 Show this view after it has been shown with showModal:
 @param idFromShowModal  ID returned by showModal
 @param completion       Block to run when completed
 */
- (void) hideModal:(id)idFromShowModal withCompletion:(void(^)(void))completion;

/**
 Find the view's first responder
 @return    First responder
 */
- (id)findFirstResponder;

/**
 Find the first superview view of a specific class
 @param viewClass    View class to look for
 @return             The view
 */
- (id) superviewOfClass:(Class)viewClass;

/**
 Find the first subview view of a specific class
 @param viewClass    View class to look for
 @return             The view
 */
- (id) subviewOfClass:(Class)viewClass;

//------------------------------

//! Completion for traverseSubviews:
typedef id (^UgiTraverseSubviewsCompletion)(id subview, int depth);

/**
 Enumerate all subviews
 @param recursive  YES to recurse
 @param completion Block to run for each subview, if the return is not nil, enumeration is aborted and this value is returned
 @return Value returned by completion or nil
 */
- (id) traverseSubviews:(BOOL)recursive
         withCompletion:(UgiTraverseSubviewsCompletion)completion;

/**
 Log the tree of subviews, for debugging
 @param logConstraints  YES log all the constraints
 @param firstArg        List of names of parameters to log for each view
 */
- (void) logViewTree:(BOOL)logConstraints firstArg:(NSString *)firstArg, ...;

/**
 Log the chain of superviews, for debugging
 @param logConstraints  YES log all the constraints
 @param firstArg        List of names of parameters to log for each view
 */
- (void) logViewParents:(BOOL)logConstraints firstArg:(NSString *)firstArg, ...;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UIColor
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for UIColor
@interface UIColor (UgiUiUtil)

/**
 Make a color from a hex string
 @param hexString  The string
 @return           New color
 */
+ (UIColor *) colorFromHexString:(NSString *)hexString;

/**
 Make a color from a hex string, with transparency
 @param hexString  The string
 @param alpha      Transparency
 @return           New color
 */
+ (UIColor *) colorFromHexString:(NSString *)hexString withAlpha:(float)alpha;

/**
 Make a color more transparent
 @param degree  Degree to make the color more transparent
 @return        New color
 */
- (UIColor *) moreTransparent:(float)degree;

/**
 Make a color lighter
 @param degree  Degree to lighten: 0 = white, 1 = no change
 @return        New color
 */
- (UIColor *) lighten:(float)degree;

/**
 Make a color darker
 @param degree  Degree to darken: 0 = black, 1 = no change
 @return        New color
 */
- (UIColor *) darken:(float)degree;

/**
 Get the perceived luminance of a color
 @param dummy   Unused parameter required to defeat a strange iOS/Objective-C bug
 @return        Luminance (between 0 and 1)
 */
- (double) luminance:(float)dummy;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UIImage
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for UIImage
@interface UIImage (UgiUiUtil)

/**
 Fill all the non-transparent parts of an image with a color
 @param color  Color to fill with
 @return       New image
 */
- (UIImage *) colorImageWithColor:(UIColor *)color;

/**
 Scale an image
 @param size   New image size
 @return       New image
 */
- (UIImage *) scaleImageToSize:(CGSize)size;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UITableView
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for UITableView
@interface UITableView (UgiUiUtil)

/**
 Call setNeedsDisplay for all visible cells
 */
- (void) setNeedsDisplayForAllVisibleCells;

/**
 Scroll to the bottom of the table
 */
- (void) scrollToBottom;

/**
 Append a row to the table
 @param scrollToBottom  YES to scroll to the bottom of the list (to display the appended row)
 @return                UITableViewCell appended
 */
- (UITableViewCell *) appendRow:(BOOL)scrollToBottom;

/**
 Delete a row from a table
 @param index    Row to delete
 */
- (void) deleteRowAtIndex:(int)index;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UIViewController
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for UIViewController
@interface UIViewController (UgiUiUtil)

/**
 Find the first parent view controller of a specific class
 @param viewControllerClass    View controller class to look for
 @return                       The view controller
 */
- (id) parentViewControllerOfClass:(Class)viewControllerClass;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UINavigationController
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for UINavigationController
@interface UINavigationController (UgiUiUtil)

/**
 Pop view controllers until a specific class is encountered
 @param viewControllerClass    View controller class to stop at
 @param animated               YES to animate
 @return                       View controllers popped
 */
- (NSArray<UIViewController *> *)popToViewControllerOfClass:(Class)viewControllerClass animated:(BOOL)animated;

/**
 See if there is a view controller of a specific class on the stack
 @param viewControllerClass    View controller class to look for
 @return                       YES if there is a view controller of the specific class
 */
- (BOOL)canPopToViewControllerOfClass:(Class)viewControllerClass;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - NSString
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for NSString
@interface NSString (UgiUiUtil)

/**
 Trim whitespace from the string
 @return   Trimmed string
 */
- (NSString *) trimWhitespace;

/**
 Do a case insensitive compare
 @param s   String to compare to
 @return    YES if equal
 */
- (BOOL) isEqualToStringCaseInsensitive:(NSString *)s;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - NSTimer
///////////////////////////////////////////////////////////////////////////////////////

//! Extension methods for NSTimer
@interface NSTimer (UgiUiUtil)

/**
 Create a timer to run a block repeatedly -- added in iOS 10, so added "Ugi" to the name to not clash
 @param seconds    Internval between runs
 @param repeats    YES to repeat
 @param block      Block to run
 @return           The timer
 */
+ (NSTimer *)scheduledTimerWithTimeIntervalUgi:(NSTimeInterval)seconds
                                       repeats:(BOOL)repeats
                                         block:(void (^)(void))block;

@end
