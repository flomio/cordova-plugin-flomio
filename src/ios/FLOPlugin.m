#import "FLOPlugin.h"
#import <Cordova/CDV.h>

@implementation FLOPlugin

- (void)webToSdkCommand:(CDVInvokedUrlCommand*)command
{
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin :)"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void)start
{
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin :)"];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
}


//Starts Timer
- (void)webToSdkCommandAsync:(CDVInvokedUrlCommand*)command
{
    
    NSLog(@"LOCO");
    _readerManager = [[ReaderManager alloc] init];
    _readerManager.delegate = self;
    
    // Stop reader scan when the app becomes inactive
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(inactive) name:UIApplicationDidEnterBackgroundNotification object:nil];
    // Start reader scan when the app becomes active
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(active) name:UIApplicationDidBecomeActiveNotification object:nil];
    
    
    asyncCallbackId = command.callbackId;
    
    [self active];
}

- (void)active {
    NSLog(@"App Activated");
    [_readerManager getAvailableReader];
    _readerManager.deviceEnabled = [NSNumber numberWithBool:YES]; //enable the reader
    _readerManager.scanPeriod = [NSNumber numberWithInteger:500]; //in ms
    _readerManager.scanSound = [NSNumber numberWithBool:YES]; //play scan sound
    _readerManager.operationState = kReadUUID; //kReadDataBlocks or kWriteDataBlocks
    _readerManager.startBlock = [NSNumber numberWithInteger:8]; //start reading from 4th data block
    _readerManager.messageToWrite = @"http://flomio.com"; // set a default message to write
}

- (void)inactive {
    [_readerManager.reader sleep];
}

#pragma mark - ReaderManagerDelegate

- (void)ReaderManager:(Reader *)reader readerAlert:(UIImageView *)imageView {
    
    if (!reader.delegate)
        reader.delegate = self; // Set reader delagate once it's clear reader's connected
    
    
}

#pragma mark - ReaderDelegate

- (void)didFindATag:(Tag *)tag withOperationState:(ReaderStateType)operationState withError:(NSError *)error {
    dispatch_async(dispatch_get_main_queue(), ^{ // Second dispatch message to log tag and restore screen
        
        if (!error) {
            
            switch (operationState) {
                case kReadUUID: {
                    
                    NSLog(@"tag.data:%@",tag.data); // Log the UUID
                    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",tag.data]];
                    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
                    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
                    break;
                }
                case kReadDataBlocks: {
                    NSLog(@"%@",tag.data); // Log the Data
                    NDEFMessage *newMessage = [[NDEFMessage alloc] initWithByteBuffer:tag.data];
                    NSLog(@"%@",newMessage); // Log the NDEF
                    break;
                }
                case kWriteDataBlocks: {
                    break;
                }
                default:
                    break;
            }
        } else {
            NSLog(@"SSSS%@",error.userInfo); // Log the error
        }
    });
}

@end