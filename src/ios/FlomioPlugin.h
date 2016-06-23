/*
 FlomioPlugin.h
 Uses Flomio SDK version 2.0
*/

#import <Cordova/CDV.h>
#import "FmSessionManager.h"

@interface FlomioPlugin : CDVPlugin <FmSessionManagerDelegate>
{
    // Cordova attributes
    NSString* selectedDeviceType;
    NSString* didFindATagUuid_callbackId;
    NSString* deviceConnectionChange_callbackId;
    NSString* br500ConnectionChange_callbackId;
    NSString* cardStatusChange_callbackId;
    
    NSMutableDictionary* apduResponse_callbackIdDict;
    NSMutableDictionary* ndefDataBlockDiscovery_callbackIdDict;
    
    // Flomio reader attributes
    FmSessionManager* readerManager;
    NSMutableArray* connectedDevicesList;
}

// Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)setReaderSettings:(CDVInvokedUrlCommand*)command;
- (void)getReaderSettings:(CDVInvokedUrlCommand*)command;
- (void)selectDeviceType:(CDVInvokedUrlCommand*)command;
- (void)setTagUidReadCallback:(CDVInvokedUrlCommand*)command;
- (void)stopReaders:(CDVInvokedUrlCommand*)command;
- (void)sendApdu:(CDVInvokedUrlCommand*)command;
- (void)setDeviceConnectionChangeCallback:(CDVInvokedUrlCommand*)command;
- (void)setBr500ConnectionChangeCallback:(CDVInvokedUrlCommand*)command;
- (void)setCardStatusChangeCallback:(CDVInvokedUrlCommand*)command;
- (void)getDataBlocks:(CDVInvokedUrlCommand*)command;

// Internal functions (that also perform input validation)
- (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId;
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId;

// Internal Flomio reader functions
- (void)didUpdateConnectedDevices:(NSArray *)connectedDevices;
- (void)didUpdateConnectedBr500:(NSArray *)peripherals;
- (void)didFindATagUuid:(NSString *)UUID fromDevice:(NSString *)deviceId withError:(NSError *)error;
- (void)didChangeCardStatus:(NSNumber *)status fromDevice:(NSString *)deviceId;
- (void)didFindADataBlockWithNdef:(NdefMessage *)ndef fromDevice:(NSString *)device withError:(NSError *)error;

@end
