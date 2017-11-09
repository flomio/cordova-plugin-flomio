//
//  Ugi_regions.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#define __UGI_REGIONS_H

#import <Foundation/Foundation.h>

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Region support
///////////////////////////////////////////////////////////////////////////////////////

/**
 Region set portion of Ugi interface
 */
@interface Ugi ()

/**
 Function definition for completion for getRegionNames:
 */
typedef void (^GetRegionNamesCompletion)(NSArray *regionNames, int selectedIndex, NSError *error);

/**
 Get the regions available. This accessed the U Grok It server to get the list of regions
 that the Grokker is approved to operate in. This must be called before "setRegion" is called.
 
 @param completion   Called with regions once they are loaded.
 */
- (void) getRegionNames:(GetRegionNamesCompletion)completion;

/**
 Function definition for completion for setRegion:withCompletion:
 */
typedef void (^SetRegionCompletion)(BOOL success);

/**
 Set the region
 
 @param regionName    Region to set
 @param completion   Called after region is set with success/failure result
 */
- (void) setRegion:(NSString *)regionName withCompletion:(SetRegionCompletion)completion;

/**
 Unset the region by clearing the "region has been set" flag. This is useful for development
 for returning a Grokker to the out-of-the-box "region not set" state.
 @return        YES if successful
 */
- (BOOL) debug_unsetRegionConfiguredFlag;

/**
 Invoke the "set region" sequence
 */
- (void) invokeSetRegion;

/**
 Invoke the "set region" sequence, with the possibility of including regions that are
 not yet approved but only available for testing.
 This should be used for testing purposes only.
 @param includeTestingRegions    YES to include testing regions
 */
- (void) invokeSetRegionWithIncludeTestingRegions:(BOOL)includeTestingRegions;

@end
