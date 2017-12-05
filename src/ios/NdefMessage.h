//
//  NdefMessage.h
//  
//
//  Created by John Bullard on 9/21/12.
//  Copyright (c) 2012 Flomio Inc. All rights reserved.
//
//  NOTE:   This file is a port of Android.nfc.NdefMessage code found in the The Android Open Source Project.
//

#import <Foundation/Foundation.h>
#import "NdefRecord.h"

// Represents an NDEF (NFC Data Exchange Format) data message that contains one or more NdefRecords.
// An NDEF message includes "records" that can contain different sets of data, such as MIME-type media,
// a URI, or one of the supported RTD types (see NdefRecord).
// An NDEF message always contains zero or more NDEF records.
// This is an immutable data class.
//
@class NdefMessage;

@interface NdefMessage : NSObject

@property(nonatomic, readonly)NSArray *ndefRecords;
@property(nonatomic, strong)NSError *error;

// Create an NDEF message from raw bytes.
- (id)initWithByteBuffer:(NSData *)byteBuffer;

// Create an NDEF message from NDEF records
//- (id)initWithNdefRecord:(NdefRecord *)ndefRecord;
// Designated initializer
- (id)initWithNdefRecords:(NSArray *)ndefRecords;

// Returns a byte buffer representation of this entire NDEF message.
- (NSData *)asByteBuffer;

+ (NdefMessage *)createURIWithString:(NSString *)uriString;

@end



