#import "FLOPlugin.h"
#import <Cordova/CDV.h>

@implementation FLOPlugin

- (void)webToSdkCommand:(CDVInvokedUrlCommand*)command
{
  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Hello - that's your plugin :)"];
  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end