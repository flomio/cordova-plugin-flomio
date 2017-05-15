//
//  BleTags.h
//  SDK
//
//  Created by Richard Grundy on 5/3/15.
//  Copyright (c) 2015 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BleTags : NSObject

+ (BleTags *)sharedDefaults;

@property (nonatomic, copy, readonly) NSArray *supportedProximityUUIDs;

@property (nonatomic, copy, readonly) NSUUID *defaultProximityUUID;
@property (nonatomic, copy, readonly) NSNumber *defaultPower;

@end
