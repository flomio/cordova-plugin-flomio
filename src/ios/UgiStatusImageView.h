//
//  UgiStatusImageView.h
//  UGrokItApi
//
//  Created by Tony Requist on 3/9/16.
//  Copyright (c) 2013 U Grok It. All rights reserved.
//


#import <UIKit/UIKit.h>
#import "UgiUiUtil.h"

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiStatusImageView
///////////////////////////////////////////////////////////////////////////////////////

//! Image view that shows the status of the Grokker (connection state and battery status)
@interface UgiStatusImageView : UIImageView

//! nil if on a light background, or a color if on a dark background
@property (retain, nonatomic, nullable) UIColor *color;

//! show version information alert when touched
@property (nonatomic) BOOL displayVersionInfoOnTouch;

@end
