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
        NSString* didChangeTagStatusCallbackId;
        NSString* didUpdateConnectedDevicesCallbackId;
        NSString* didFindTagWithUuidCallbackId;
        NSString* didDetectNDEFsCallbackId;
        
        // Flomio reader attributes
        FmSessionManager* sharedManager;
        NSString *deviceUuid;
    }
    @property (strong, nonatomic) FmConfiguration *deviceConfiguration;
    @property (nonatomic) DeviceType selectedDeviceType;
    @property (nonatomic) PowerOperation powerOperation;
    @property (strong, nonatomic) NSNumber *latestBatteryLevel;
    @property (strong, nonatomic) NSNumber *latestCommunicationStatus;
    @property (strong, nonatomic) NSString *specificDeviceUuid;
    @property (strong, nonatomic) NFCNDEFReaderSession *session API_AVAILABLE(ios(11.0));
    
    // Cordova functions
- (void)init:(CDVInvokedUrlCommand*)command;
- (void)launchNativeNfc:(CDVInvokedUrlCommand*)command;
- (void)selectSpecificDeviceId:(CDVInvokedUrlCommand*)command;
- (void)startReaders:(CDVInvokedUrlCommand*)command;
- (void)stopReaders:(CDVInvokedUrlCommand*)command;
- (void)sleepReaders:(CDVInvokedUrlCommand*)command;
- (void)setConfiguration:(CDVInvokedUrlCommand*)command; 
- (void)getConfiguration:(CDVInvokedUrlCommand*)command;
- (void)getBatteryLevel:(CDVInvokedUrlCommand*)command;
- (void)sendApdu:(CDVInvokedUrlCommand*)command;
    
    @end

