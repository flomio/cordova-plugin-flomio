//
//  FmErrorManager.h
//  SDK
//
//  Created by Scott Condron on 26/04/2016.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface FmErrorManager : NSObject

+ (BOOL)checkForSuccess:(NSString *)response;
+ (NSError *)handleError:(NSString *)response;
+ (NSError *)tagNotSupported;

@end
