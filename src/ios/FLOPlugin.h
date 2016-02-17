/*
FLOPlugin.h
Uses Flomio SDK version 1.9
*/

#import <Cordova/CDV.h>
#import "ReaderManager.h"

@interface FLOPlugin : CDVPlugin <ReaderManagerDelegate>
{
    // Flo-reader attributes
    ReaderManager *sharedManager;
    
    // Cordova attributes
    NSString *didFindATagUUID_callbackId;
}

// Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)setScanPeriod:(CDVInvokedUrlCommand*)command;
- (void)setScanSound:(CDVInvokedUrlCommand*)command;
- (void)selectReader:(CDVInvokedUrlCommand*)command;
- (void)startPolling:(CDVInvokedUrlCommand*)command;
- (void)stopPolling:(CDVInvokedUrlCommand*)command;

// Internal Flo-reader functions
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView;
- (void)didUpdateConnectedPeripherals:(NSArray *)peripherals;
- (void)didFindATagUUID:(NSString *)UUID fromDevice:(NSString *)deviceId;
- (void)didFindDataBlocks:(NSData *)data fromDevice:(NSString *)deviceId;
- (void)ReaderManager:(Reader *)reader didSendBatteryLevel:(int)level;
- (void)ReaderManager:(Reader *)reader isConnected:(BOOL)connected;

@property (nonatomic, strong) ReaderManager *readerManager;

@end
