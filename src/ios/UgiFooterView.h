//
//  UgiFooterView.h
//  UGrokIt
//
//  Created by Tony Requist on 9/30/13.
//  Copyright (c) 2013 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UgiUiUtil.h"

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiFooterView
///////////////////////////////////////////////////////////////////////////////////////

//! @cond
// Old style
@protocol UgiFooterViewDelegate <NSObject>

@optional

- (void) doFooterLeft;
- (void) doFooterCenter;
- (void) doFooterRight;

@end
//! @endcond

/////////////

/**
 * UI object designed for the bottom of the screen, with three buttons
 */
@interface UgiFooterView : UIView

//! Color to use for footer, if nil then use [UgiUiUtil uiThemeColor]
@property (nonatomic, retain) UIColor *themeColor;

/**
 Set the left button title and handler
 * @param text          Button title
 * @param completion    Click handler
 */
- (void) setLeftText:(NSString *)text withCompletion:(VoidBlock)completion;

/**
 Set the center button title and handler
 * @param text          Button title
 * @param completion    Click handler
 */
- (void) setCenterText:(NSString *)text withCompletion:(VoidBlock)completion;

/**
 Set the center button title, image and handler
 * @param text          Button title
 * @param image         Button image
 * @param completion    Click handler
 */
- (void) setCenterText:(NSString *)text image:(UIImage *)image withCompletion:(VoidBlock)completion;

/**
 Set the right button title and handler
 * @param text          Button title
 * @param completion    Click handler
 */
- (void) setRightText:(NSString *)text withCompletion:(VoidBlock)completion;

/**
 See if any of the buttons are displayed
 * @return    YES if any buttons are displayed
 */
- (BOOL) anyButtonsDisplayed;

//! Button size, default is 1.0
@property (nonatomic) float buttonSize;

//! @cond
// Old style
- (void) setLeftText:(NSString *)text;
- (void) setCenterText:(NSString *)text;
- (void) setCenterText:(NSString *)text image:(UIImage *)image;
- (void) setRightText:(NSString *)text;

@property (assign, nonatomic) NSObject<UgiFooterViewDelegate> *delegate;
//! @endcond

@end
