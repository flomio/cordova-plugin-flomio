//////
//////  FeitianBtReader.h
//////  SDK
//////
//////  Created by Scott Condron on 08/10/2016.
//////  Copyright © 2016 Flomio, Inc. All rights reserved.
//////

#import <CoreBluetooth/CoreBluetooth.h>
#import <AVFoundation/AVFoundation.h>
#import <CommonCrypto/CommonCrypto.h>
#import "FmBluetoothDevice.h"

#import "winscard.h"
#import "ReaderInterface.h"
#import "wintypes.h"
#import "ft301u.h"

@protocol FeitianBtReaderDelegate <NSObject>

@optional

- (void)didFindTagWithUuid:(NSString *)Uuid fromDevice:(NSString *)deviceId withAtr:(NSString *)Atr withError:(NSError *)error;
- (void)updateConnectedDevicesWithDevice:(FmBluetoothDevice *)device;
- (void)didChangeCardStatus:(CardStatus)status fromDevice:(NSString *)device;

@end

@interface FeitianBtReader : NSObject <ReaderInterfaceDelegate, AVAudioPlayerDelegate>

@property (nonatomic, strong) id<FeitianBtReaderDelegate> delegate;
@property (nonatomic, strong) CBPeripheral *peripheral;
@property (nonatomic, strong) FmBluetoothDevice *device;
@property (nonatomic, strong) NSString *serialNumber;
@property (nonatomic, assign) BOOL isProLicensed;
@property (nonatomic,strong) NSMutableArray *connectedDevices;
@property (nonatomic,strong) NSString *selectReaderName;
@property (nonatomic, assign) ReaderStateType readerState;
@property (nonatomic, assign) CommunicationStatus communicationStatus;
@property (nonatomic, strong) NSNumber *scanSound;
@property (nonatomic,strong) NSString *atr;
@property (nonatomic,strong) NSString *log;
@property (nonatomic,strong) NSString *apduTextField;
@property (nonatomic,strong) NSString *cardStatus;
@property (nonatomic,strong) NSString *commandListView;
@property (nonatomic,strong) NSString *softVersion;
@property (nonatomic,strong) NSString *SDKVersion;
@property (nonatomic,strong) NSString *firmVersion;
@property (nonatomic,strong) NSString *currentReaderName;

- (void)transmitCommandApdu:(NSData *)apdu;
- (void)getCardStatus;
- (void)isDeviceLicensed:(NSString *)serialNumber;

@end

