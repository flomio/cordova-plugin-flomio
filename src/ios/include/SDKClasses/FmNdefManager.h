//
//  FmNdefManager.h
//  SDK
//
//  Created by Boris Polania on 4/26/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "FmCustomTypes.h"
#import "NdefMessage.h"

@interface FmNdefManager : NSObject

+ (NSString *)selectNdefTagApplication;
+ (NSString *)selectCcFile;
+ (NSString *)readCcFile;
+ (NSString *)getNdefFileId:(NSString *)response;
+ (NSString *)selectNdefFile:(NSString *)fileId;
+ (NSString *)readNlen;
+ (NSString *)readNdefFile:(NSString *)nlen;
//+ (NSString *)readBinaryForMifareUL;
+ (NdefMessage *)handleFinalNdef:(NSData *)apdu;

@end
