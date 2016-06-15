/*
 FlomioPlugin.h
 Uses Flomio SDK version 2.0
*/

#import <Cordova/CDV.h>
#import "FmSessionManager.h"

@interface FlomioPlugin : CDVPlugin <FmSessionManagerDelegate>
{
    // Flomio reader attributes
    FmSessionManager *readerManager;
    NSArray* connectedDevices;
    NSMutableArray* connectedPeripherals;
    
    // Cordova attributes
    NSString* selectedDeviceType;
    NSMutableDictionary* readerTable;
    NSString* didFindATagUUID_callbackId;
    NSString* readerStatusChange_callbackId;
    NSString* apduResponse_callbackId;
    NSString* deviceConnected_callbackId;
}

// Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)setReaderSettings:(CDVInvokedUrlCommand*)command;
- (void)getReaderSettings:(CDVInvokedUrlCommand*)command;
- (void)selectDeviceType:(CDVInvokedUrlCommand*)command;
- (void)startReader:(CDVInvokedUrlCommand*)command;
- (void)stopReader:(CDVInvokedUrlCommand*)command;
- (void)sendApdu:(CDVInvokedUrlCommand*)command;
- (void)setDeviceConnectCallback:(CDVInvokedUrlCommand*)command;

// Internal functions (that also perform input validation)
- (BOOL)validateDeviceId:(NSString*)deviceId;
- (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId;
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId;

// Internal Flomio reader functions
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView;
- (void)didUpdateConnectedDevices:(NSArray *)connectedDevices;
- (void)didUpdateConnectedBr500:(NSArray *)peripherals;
- (void)didFindATagUuid:(NSString *)UUID fromDevice:(NSString *)deviceId withError:(NSError *)error;
- (void)didChangeCardStatus:(NSNumber *)status fromDevice:(NSString *)device;

@end
