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
    NSMutableArray* connectedPeripherals;
    
    // Cordova attributes
    NSString* activeReaderType;
    NSMutableDictionary* readerTable;
    NSString* didFindATagUUID_callbackId;
    NSString* readerStatusChange_callbackId;
    NSString* apduResponse_callbackId;
    NSString* flobleConnected_callbackId;
}

// Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)setReaderSettings:(CDVInvokedUrlCommand*)command;
- (void)getReaderSettings:(CDVInvokedUrlCommand*)command;
- (void)selectReaderType:(CDVInvokedUrlCommand*)command;
- (void)startReader:(CDVInvokedUrlCommand*)command;
- (void)stopReader:(CDVInvokedUrlCommand*)command;
- (void)setReaderStatusChangeCallback:(CDVInvokedUrlCommand*)command;
- (void)sendApdu:(CDVInvokedUrlCommand*)command;
- (void)setFlobleConnectedCallback:(CDVInvokedUrlCommand*)command;

// Internal functions (these perform input validation)
- (BOOL)validateDeviceId:(NSString*)deviceId;
- (void)setScanPeriod:(NSString*)periodString :(NSString*)deviceId :(NSString*)callbackId;
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)deviceId :(NSString*)callbackId;
- (void)setOperationState:(NSString*)state :(NSString*)deviceId :(NSString*)callbackId;
- (void)setStartBlock:(NSString*)blockString :(NSString*)deviceId :(NSString*)callbackId;
- (void)setMessageToWrite:(NSString*)message :(NSString*)deviceId :(NSString*)callbackId;

// Internal Flo-reader functions
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView;
- (void)didUpdateConnectedPeripherals:(NSArray *)peripherals;
- (void)didFindATagUUID:(NSString *)UUID fromDevice:(NSString *)deviceId;
- (void)didFindDataBlocks:(NSData *)data fromDevice:(NSString *)deviceId;
- (void)ReaderManager:(Reader *)reader didSendBatteryLevel:(int)level;
- (void)ReaderManager:(Reader *)reader isConnected:(BOOL)connected;

@property (nonatomic, strong) ReaderManager *readerManager;

@end
