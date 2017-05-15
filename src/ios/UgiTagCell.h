//
//  UgiTagCell.h
//  UGrokItApi
//
//  Created by Tony Requist on 3/9/16.
//  Copyright (c) 2013 U Grok It. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "UgiTag.h"

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - UgiTagCell
///////////////////////////////////////////////////////////////////////////////////////

/**
 UITableViewCell for displaying the state of a UgiTag, displays a visual representation of the
 read history on the right side of the cell (using UgiTagReadHistoryView)
 */
@interface UgiTagCell : UITableViewCell

//! UgiTag to display the read history for
@property (retain, nonatomic) UgiTag *displayTag;

//! Color to use for visual display of read history
@property (retain, nonatomic) UIColor *themeColor;

//! Title text
@property (retain, nonatomic) NSString *title;

//! Detail text (optional)
@property (retain, nonatomic) NSString *detail;

//! Force the history view to update
- (void) updateHistoryView;

@end
