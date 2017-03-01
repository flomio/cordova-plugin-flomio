/*
 FlomioPlugin.h
 Uses Flomio SDK version 2.0
 */

#import "FmSessionManager.h"
#import <Cordova/CDV.h>

@interface FlomioPlugin : CDVPlugin <FmSessionManagerDelegate>
{
    
    // Cordova attributes
    NSString* selectedDeviceTypeCallbackId;
    NSString* didChangeCardStatusCallbackId;
    NSMutableDictionary* didUpdateConnectedDevicesCallbacks;
    NSMutableDictionary* didFindTagWithUuidCallbacks;
    NSMutableDictionary* didFindTagWithDataCallbacks;
    
    // Flomio reader attributes
    FmSessionManager* sharedManager;
    NSMutableArray* connectedDevicesList;
}

@property (nonatomic) DeviceType selectedDeviceType;

// Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)selectDeviceType:(CDVInvokedUrlCommand*)command;

// - (void)setReaderSettings:(CDVInvokedUrlCommand*)command;
// - (void)getReaderSettings:(CDVInvokedUrlCommand*)command;
// - (void)setTagUidReadCallback:(CDVInvokedUrlCommand*)command;
// - (void)stopReaders:(CDVInvokedUrlCommand*)command;
// - (void)sendApdu:(CDVInvokedUrlCommand*)command;
// - (void)setDeviceConnectionChangeCallback:(CDVInvokedUrlCommand*)command;
// - (void)setBr500ConnectionChangeCallback:(CDVInvokedUrlCommand*)command;
// - (void)setCardStatusChangeCallback:(CDVInvokedUrlCommand*)command;
// - (void)getDataBlocks:(CDVInvokedUrlCommand*)command;

// Internal functions (that also perform input validation)
- (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId;
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId;

// Internal Flomio reader functions
- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)serialNumber withError:(NSError *)error;
- (void)didUpdateConnectedDevices:(NSArray *)devices;
- (void)didReceiveReaderError:(NSError *)error;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;

@end
