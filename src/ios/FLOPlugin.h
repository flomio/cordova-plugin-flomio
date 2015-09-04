/*
FLOPlugin.h
Uses Flomio SDK version 1.5 
*/

#import <Cordova/CDV.h>
#import "ReaderManager.h"
#import "Reader.h"
#import "NDEFMessage.h"
#import "ReaderManager.h"
#import "Reader.h"
#import "NSData+FJStringDisplay.h"
#import "ToastView.h"

@interface FLOPlugin : CDVPlugin <ReaderManagerDelegate, ReaderDelegate> {
    NSString *asyncCallbackId;
	NSData *lastScan;
}

- (void)startPolling:(CDVInvokedUrlCommand*)command;
- (void)stopPolling:(CDVInvokedUrlCommand*)command;
- (void)acknowledgeScan:(CDVInvokedUrlCommand*)command;
- (void)active;
- (void)inactive;
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView;
- (void)didFindATag:(Tag *)tag withOperationState:(ReaderStateType)operationState withError:(NSError *)error;
- (void)setDeviceStatus:(BOOL)enabled;

@property (nonatomic, strong) ReaderManager *readerManager;
@property (strong, nonatomic) NSArray *tagTypeStrings;

@end