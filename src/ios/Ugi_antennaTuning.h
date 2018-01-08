//
//  Ugi_antennaTuning.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#define __UGI_ANTENNA_UPDATE_H

#import <Foundation/Foundation.h>

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Antenna Tuning
///////////////////////////////////////////////////////////////////////////////////////

/**
 Antenna tuning portion of Ugi interface
 */
@interface Ugi ()

/**
 Function definition for oneFrequencyTunedCompletion for tuneAntennaWithOneFrequencyTunedCompletion:withCompletion:
 */
typedef BOOL (^TuneAntennaOneFrequencyTunedCompletion)(int frequency,
                                                       int reflectedPower,
                                                       int numTuned,
                                                       int numTotal);
/**
 Function definition for completion for tuneAntennaWithOneFrequencyTunedCompletion:withCompletion:
 */
typedef void (^TuneAntennaCompletion)(BOOL success);

/**
 Tune the antenna

 @param oneFrequencyTunedCompletion  Code to run for each frequency tuned
 @param completion                   Code to run then tuning is completed
 */
- (void) tuneAntennaWithOneFrequencyTunedCompletion:(nullable TuneAntennaOneFrequencyTunedCompletion)oneFrequencyTunedCompletion
                                     withCompletion:(nonnull TuneAntennaCompletion)completion;

/**
 Get antenna tuning information

 @param staticAverage   Average tuning value from last saved tuning
 @param dynamicAverage  Average tuning value currently
 @return        YES if successful
 */
- (BOOL) getAntennaTuning:(int * _Nonnull)staticAverage dynamicAverage:(int * _Nonnull)dynamicAverage;

@end
