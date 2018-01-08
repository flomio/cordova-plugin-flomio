//
//  UgiFarsens.h
//  UGrokItApi
//
//  Copyright (c) 2016 U Grok It. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "UgiRfidConfiguration.h"
#import "UgiInventory.h"

/**
 Support for reading Farsens tags
 */
@interface UgiFarsens : NSObject

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Common
///////////////////////////////////////////////////////////////////////////////////////

/**
 Completion for readFenixVortexTemperature
 @param status  Description of current state
 */
typedef void (^UgiFarsensStatusCallback)(NSString * _Nonnull status);

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Fenix Vortex
///////////////////////////////////////////////////////////////////////////////////////

/**
 Completion for readFenixVortexTemperature
 @param result  Result of the operation
 @param temperatureC  Temperature, in degreesC (if successful)
 */
typedef void (^UgiFarsensReadFenixVortexTemperatureCompletion)(UgiTagAccessReturnValues result, float temperatureC);

/**
 Read the temperature from a Fenix-Vortex tag
 @param tag             Tag to read
 @param statusCallback  Callback for each step of the process (intended for use with showWaiting)
 @param completion      Completion when finished
 */
+ (void) readFenixVortexTemperature:(UgiTag * _Nonnull)tag
                 withStatusCallback:(nullable UgiFarsensStatusCallback)statusCallback
                     withCompletion:(nonnull UgiFarsensReadFenixVortexTemperatureCompletion)completion;

/////

/**
 Completion for readFenixVortexTemperature
 @param result  Result of the operation
 @param pressure  Pressure (if successful)
 */
typedef void (^UgiFarsensReadFenixVortexPressureCompletion)(UgiTagAccessReturnValues result, float pressure);

/**
 Read the pressure from a Fenix-Vortex tag
 @param tag             Tag to read
 @param statusCallback  Callback for each step of the process (intended for use with showWaiting)
 @param completion      Completion when finished
 */
+ (void) readFenixVortexPressure:(UgiTag * _Nonnull)tag
              withStatusCallback:(nullable UgiFarsensStatusCallback)statusCallback
                  withCompletion:(nonnull UgiFarsensReadFenixVortexPressureCompletion)completion;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Kineo
///////////////////////////////////////////////////////////////////////////////////////

/**
 Completion for readKineo
 @param result  Result of the operation
 @param x       Oreintation, x
 @param y       Oreintation, y
 @param z       Oreintation, z
 */
typedef void (^UgiFarsensReadKineoCompletion)(UgiTagAccessReturnValues result, float x, float y, float z);

/**
 Read the orientation from a Kineo tag
 @param tag             Tag to read
 @param statusCallback  Callback for each step of the process (intended for use with showWaiting)
 @param completion      Completion when finished
 */
+ (void) readKineo:(UgiTag * _Nonnull)tag
withStatusCallback:(nullable UgiFarsensStatusCallback)statusCallback
    withCompletion:(nonnull UgiFarsensReadKineoCompletion)completion;

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Titan
///////////////////////////////////////////////////////////////////////////////////////

/**
 Completion for readTitan
 @param result  Result of the operation
 @param isValid      YES if the position value is valid
 @param isPosition1  YES if relay is set to position 1
 */
typedef void (^UgiFarsensReadTitanCompletion)(UgiTagAccessReturnValues result,
                                              BOOL isValid, BOOL isPosition1);

/**
 Read the relay setting from a Kineo tag
 @param tag             Tag to read
 @param statusCallback  Callback for each step of the process (intended for use with showWaiting)
 @param completion      Completion when finished
 */
+ (void) readTitan:(UgiTag * _Nonnull)tag
withStatusCallback:(nullable UgiFarsensStatusCallback)statusCallback
    withCompletion:(nonnull UgiFarsensReadTitanCompletion)completion;


/**
 Completion for writeTitan.
 @param result  Result of the operation
 */
typedef void (^UgiFarsensWriteTitanCompletion)(UgiTagAccessReturnValues result);

/**
 Set the relay state of a Kineo tag
 @param setPosition1    YES to set position 1, NO to set position 2
 @param tag             Tag to read
 @param statusCallback  Callback for each step of the process (intended for use with showWaiting)
 @param completion      Completion when finished
 */
+ (void) writeTitan:(UgiTag * _Nonnull)tag
   withSetPosition1:(BOOL)setPosition1
 withStatusCallback:(nullable UgiFarsensStatusCallback)statusCallback
     withCompletion:(nonnull UgiFarsensWriteTitanCompletion)completion;

@end
