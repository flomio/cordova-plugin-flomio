#import <Cordova/CDV.h>
#import "ReaderManager.h"
#import "Reader.h"
#import "NDEFMessage.h"

@interface FLOPlugin : CDVPlugin <ReaderManagerDelegate, ReaderDelegate> {
    
    NSString *asyncCallbackId;
}

- (void)webToSdkCommand:(CDVInvokedUrlCommand*)command;
- (void)webToSdkCommandAsync:(CDVInvokedUrlCommand*)command;

@property (nonatomic, strong) ReaderManager *readerManager;

@end