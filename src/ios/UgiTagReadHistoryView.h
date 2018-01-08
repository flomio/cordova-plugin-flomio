//
//  UgiTagReadHistoryView.h
//  UGrokItApi
//
//  Created by Tony Requist on 3/9/16.
//  Copyright (c) 2013 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UgiTag.h"

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiTagReadHistoryView
///////////////////////////////////////////////////////////////////////////////////////

/**
 UgiTagReadHistoryView is UIView that displays a graphical representation of the tag read history
 */
@interface UgiTagReadHistoryView : UIView

//! UgiTag to display the read history for
@property (retain, nonatomic) UgiTag * _Nonnull displayTag;

//! Color to use for visual display of read history
@property (retain, nonatomic) UIColor * _Nullable themeColor;

//! The preferred size for this view
- (CGSize) preferredSize;

@end
