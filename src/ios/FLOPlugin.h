#import <Cordova/CDV.h>
#import "ReaderManager.h"
#import "Reader.h"
#import "NDEFMessage.h"
#import "ReaderManager.h"
#import "Reader.h"
#import "NSData+FJStringDisplay.h"

@interface FLOPlugin : CDVPlugin <ReaderManagerDelegate, ReaderDelegate> {
    NSString *asyncCallbackId;
}

- (void)webToSdkCommand:(CDVInvokedUrlCommand*)command;
- (void)webToSdkCommandAsync:(CDVInvokedUrlCommand*)command;

@property (nonatomic, strong) ReaderManager *readerManager;
@property (strong, nonatomic) NSArray *tagTypeStrings;

@end