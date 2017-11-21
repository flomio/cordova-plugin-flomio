/*
 FlomioPlugin.h
 Uses Flomio SDK version 2.3
 */

#import "FmSessionManager.h"
#import <CoreNFC/CoreNFC.h>
#import <AVFoundation/AVFoundation.h>
#import <Cordova/CDV.h>

@interface FlomioPlugin : CDVPlugin <FmSessionManagerDelegate, NFCNDEFReaderSessionDelegate>
{
    
    // Cordova attributes
    NSString* selectedDeviceTypeCallbackId;
    NSString* didChangeCardStatusCallbackId;
    NSString* didUpdateConnectedDevicesCallbackId;
    NSString* didFindTagWithUuidCallbackId;
    NSString* didDetectNDEFsCallbackId;
    
    // Flomio reader attributes
    FmSessionManager* sharedManager;
//    NSMutableArray* connectedDevicesList;
    NSString *deviceUuid;
    NSDictionary* configurationDictionary;
    
}

@property (nonatomic) DeviceType selectedDeviceType;
@property (strong, nonatomic) NSNumber *latestBatteryLevel;
@property (strong, nonatomic) NSString *specificDeviceUuid;
@property (strong, nonatomic) NFCNDEFReaderSession *session;

// Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)selectDeviceType:(CDVInvokedUrlCommand*)command;
- (void)stopReaders:(CDVInvokedUrlCommand*)command;
- (void)sleepReaders;
// - (void)stopReader:(NSString *)deviceSerialNumber;
// - (void)sleepReader:(NSString *)deviceSerialNumber;
- (void)setConfiguration:(CDVInvokedUrlCommand*)command; //initialize all devices configuration with this
// - (void)setConfiguration:(NSDictionary *)configurationDictionary ofDevice:(NSString *)deviceSerialNumber;
// - (NSDictionary *)getConfigurationOfDevice:(NSString *)deviceSerialNumber;
- (void)getConfiguration:(CDVInvokedUrlCommand*)command;
- (void)getBatteryLevel:(CDVInvokedUrlCommand*)command;
- (void)sendApdu:(NSString *)apdu toDevice:(NSString *)deviceSerialNumber;

// Internal functions (that also perform input validation)
- (void)setScanPeriod:(NSString*)periodString :(NSString*)callbackId;
- (void)toggleScanSound:(NSString*)toggleString :(NSString*)callbackId;

// SDK reader delegates
- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didFindTagWithData:(NSDictionary *)payload fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)didRespondToApduCommand:(NSString *)response fromDevice:(NSString *)serialNumber withError:(NSError *)error;
- (void)didUpdateConnectedDevices:(NSArray *)devices;
- (void)didReceiveReaderError:(NSError *)error;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;

@end
