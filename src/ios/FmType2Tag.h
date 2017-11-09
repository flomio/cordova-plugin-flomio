//
//  FmType2Tag.h
//  SDK
//
//  Created by Scott Condron on 03/01/2017.
//  Copyright © 2017 Flomio, Inc. All rights reserved.
//

#import "FmTag.h"

@interface FmType2Tag : FmTag

@property (nonatomic) CardType type;

- (instancetype)initWithUuid:(NSString *)uuid andAtr:(NSString *)atr;

@end
