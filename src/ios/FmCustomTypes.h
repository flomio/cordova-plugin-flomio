//
//  FmCustomTypes.h
//  SDK
//
//  Created by Boris  on 3/24/16.
//  Copyright © 2016 Flomio, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, DeviceType) {
    kDeviceTypeDefault,
    kFlojackBzr,
    kFlojackMsr,
    kFloBleEmv,
    kFloBlePlus,
    kuGrokit,
};

typedef NS_ENUM(NSInteger, CommunicationStatus) {
    kScanning,
    kConnected,
    kDisconnected
};

typedef NS_ENUM(NSInteger, NdefState) {
    kTagApplicationSelect,
    kSelectCcFile,
    kReadCcFile,
    kSelectNdefFile,
    kReadNlen,
    kReadNdefFile,
    kComplete,
    kIncomplete
};

typedef NS_ENUM(NSInteger, CardType) {
    kCardTypeDefault,
    kMifareType2,
    kMifareClassic1k,
    kMifareType4,
    kMifareDesfire2kEv1, //read data not supported
    kMifarePlus2kS //read data not supported

};

typedef NS_ENUM(NSInteger, CardStatus) {
    kNotPresent,
    kPresent,
    kReadingData
};

typedef NS_ENUM(NSInteger, TagDiscovery) {
    kReadUuid,
    kReadData,
    kWriteData
};

typedef NS_ENUM(NSInteger, PowerOperation){
    kAutoPollingControl,
    kBluetoothConnectionControl
};

typedef NS_ENUM(NSInteger, TransmitPower){
    kVeryLowPower,
    kLowPower,
    kMediumPower,
    kHighPower
};

@interface FmCustomTypes : NSObject

@end
