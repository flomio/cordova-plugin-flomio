//
//  UgiTitleView.h
//  UGrokIt
//
//  Created by Tony Requist on 9/30/13.
//  Copyright (c) 2013 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UgiUiUtil.h"

/**
 * Title bar object including the a title and a UgiStatusImageView
 */
@interface UgiTitleView : UIView

//! Color to use for footer, if nil then use [UgiUiUtil uiThemeColor]
@property (nonatomic, retain) UIColor *themeColor;

//! Text color to use when the background is the theme color
@property (retain, nonatomic) UIColor *textColorOnThemeColor;

//! Background to display in header, should be 160x88 (a 2x image, will be used as 80x44)
@property (nonatomic, retain) UIImage *backgroundImage;

//! Code to execute for Back, or nil for no back button
@property (strong, nonatomic) VoidBlock backButtonCompletion;

//! YES to use a background
@property (nonatomic) BOOL useBackgroundBasedOnUiColor;

//! Display wave animation while scanning
@property (nonatomic) BOOL displayWaveAnimationWhileScanning;

//! Do not display the battery status indicator
@property (nonatomic) BOOL hideBatteryStatusIndicator;

/**
 Set the right button image and handler
 * @param image             Button image
 * @param color             Color for the right button (or nil to not alter the image)
 * @param highlightedImage  Button image when highlighted
 * @param highlightedColor  Color for the right button when highlighted (or nil to not alter the image)
 * @param completion        Click handler
 */
- (void) setRightButtonImage:(UIImage *)image
                   withColor:(UIColor *)color
        withHighlightedImage:(UIImage *)highlightedImage
        withHighlightedColor:(UIColor *)highlightedColor
              withCompletion:(VoidBlock)completion;

//! Image to display in header, should be 180x80 (a 2x image, will be used as 90x40)
@property (nonatomic, retain) UIImage *titleImage;

//! Title. If nil the use the ViewController's title, if nil then use app name
@property (retain, nonatomic) NSString *title;

@end
