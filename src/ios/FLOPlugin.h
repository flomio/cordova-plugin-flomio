/*
FLOPlugin.h
Uses Flomio SDK version 1.8 (with Feitian support)
*/

#import <Cordova/CDV.h>

///////////////////////////
// FloJack / FloBLE
#import "ReaderManager.h"
#import "Reader.h"
#import "NDEFMessage.h"
#import "ReaderManager.h"
#import "Reader.h"
#import "NSData+FJStringDisplay.h"
#import "ToastView.h"
///////////////////////////

///////////////////////////
// Feitian
#import <Foundation/Foundation.h>
#import "ReaderInterface.h"
#import "winscard.h"
#import "ft301u.h"
///////////////////////////

@protocol FeitianReaderDelegate <NSObject>
@optional

- (void)didFeitianReaderSendUUID:(NSString*)uuid fromDevide:(NSString *)sn;

@end

@interface FLOPlugin : CDVPlugin <ReaderManagerDelegate, ReaderDelegate, ReaderInterfaceDelegate> {
	BOOL feitianConnected;
	BOOL floConnected;

	///////////////////////////
	// Feitian
	BOOL cardIsAttached;
    
    SCARDCONTEXT gContxtHandle;
    SCARDHANDLE  gCardHandle;
    
    BOOL isCardConnected;
    
    NSString *serialNumber;
    //NSString *asyncCallbackId;
    ///////////////////////////

    ///////////////////////////
    // FloJack / FloBLE
    NSString *asyncCallbackId;
	NSData *lastScan;
	NSString *lastFloBleScan;
	///////////////////////////
}

///////////////////////////
// FloJack / FloBLE
- (void)startPolling:(CDVInvokedUrlCommand*)command;
- (void)stopPolling:(CDVInvokedUrlCommand*)command;
- (void)acknowledgeScan:(CDVInvokedUrlCommand*)command;
- (void)active;
- (void)inactive;
- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView;
- (void)didFindATag:(Tag *)tag withOperationState:(ReaderStateType)operationState withError:(NSError *)error;
- (void)setDeviceStatus:(BOOL)enabled;

@property (nonatomic, strong) ReaderManager *readerManager;
@property (strong, nonatomic) NSArray *tagTypeStrings;
///////////////////////////

///////////////////////////
// Feitian
@property id<FeitianReaderDelegate> delegate;
@property (nonatomic,strong) ReaderInterface *readInf;
///////////////////////////

@end
