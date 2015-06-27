#import "FLOPlugin.h"
#import <Cordova/CDV.h>

@implementation FLOPlugin

- (void)webToSdkCommand:(CDVInvokedUrlCommand*)command
{
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin :)"];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void)start:(CDVInvokedUrlCommand*)command
{
    
    asyncCallbackId = command.callbackId;
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin :)"];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:asyncCallbackId];
}


//Starts Timer
- (void)webToSdkCommandAsync:(CDVInvokedUrlCommand*)command
{
    [NSTimer scheduledTimerWithTimeInterval:1.0
                                     target:self
                                   selector:@selector(start:)
                                   userInfo:nil
                                    repeats:YES];
}

@end