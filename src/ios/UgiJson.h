//
//  UgiJson.h
//
//  Copyright (c) 2012 U Grok It. All rights reserved.
//

#import <Foundation/Foundation.h>

//! @cond

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark UgiJsonPropertyInfo
///////////////////////////////////////////////////////////////////////////////////////

@interface UgiJsonPropertyInfo : NSObject

@property (nonatomic, retain) NSString *name;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark UgiJsonClassInfo
///////////////////////////////////////////////////////////////////////////////////////

@interface UgiJsonClassInfo : NSObject

@property (nonatomic, retain) NSDictionary *properties;
@property (nonatomic, retain) NSArray *idFieldNames;

+ (UgiJsonClassInfo *) infoForClass:(Class)clazz;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark NSObject extensions
///////////////////////////////////////////////////////////////////////////////////////

static const NSString *UGI_CONTEXT_PRETTY = @"pretty";

extern NSDictionary *UGI_SERIALIZATION_CONTEXT_DEFAULT;
extern NSDictionary *UGI_SERIALIZATION_CONTEXT_PRETTY;
extern NSDictionary *UGI_DESERIALIZATION_CONTEXT_DEFAULT;

static const NSString *UGI_CONTEXT_ALWAYS_SERIALIZE = @"_ugi_alwaysSerialize";
static const NSString *UGI_CONTEXT_ROOT_OBJECT = @"_ugi_rootObject";
static const NSString *UGI_CONTEXT_OBJECT_STACK = @"_ugi_objectStack";
static const NSString *UGI_CONTEXT_PROPERTY_NAME = @"_ugi_propertyName";

@interface NSObject (UgiJson)

//
// Write JSON to a stream
//
- (void) toJsonStream:(NSOutputStream *)stream
              context:(NSDictionary *)context;

//
// Serialize an object to JSON, return NSData
//
- (NSData *) toJson:(NSDictionary *)context;

//
// Serialize an object to JSON, return NSString
//
- (NSString *) toJsonString:(NSDictionary *)context;

//
// Parse object from JSON stream
//
- (id) initFromJsonStream:(NSInputStream *)stream
                    error:(NSError **)error
                  context:(NSDictionary *)context;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark UgiJson
///////////////////////////////////////////////////////////////////////////////////////

@interface UgiJson : NSObject

//
// Date conversion
//
+ (NSDate *)dateFromJson:(long long)jsonValue;
+ (long long)dateToJson:(NSDate *)date;

//
// URL encode a string
//
+ (NSString *)urlEncode:(NSString *)s;

//
// Parse object from JSON stream
//
+ (id) fromJsonStream:(NSInputStream *)stream
                class:(Class)clazz
              context:(NSDictionary *)context
                error:(NSError **)error;

//
// Parse object from JSON data
//
+ (id) fromJson:(NSData *)data
          class:(Class)clazz
        context:(NSDictionary *)context
          error:(NSError **)error;

//
// Parse object from JSON string
//
+ (id) fromJsonString:(NSString *)string
                class:(Class)clazz
              context:(NSDictionary *)context
                error:(NSError **)error;

//
// Get the document directory
//
+ (NSString *) getDocumentDirectory;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark JsonModeler
///////////////////////////////////////////////////////////////////////////////////////

//
// This is the protocol implemented by model objects
//
@protocol UgiJsonModel <NSObject>

//
// 
//
@optional
- (BOOL) shouldSerializeObject:(NSMutableDictionary *)context;

@optional
- (BOOL) shouldSerializeField:(NSString *)fieldName value:(id)value context:(NSMutableDictionary *)context;

@optional
- (id) customSerialize:(NSMutableDictionary *)context;

@optional
- (void) customDeserialize:(id)value;

//
// Modify deserialization context for serialization (called on root object only)
//
@optional
- (void) prepareSerializationContext:(NSMutableDictionary *)context;

//
// Modify deserialization context for deserialization (called on root object only)
//
@optional
- (void) prepareDeserializationContext:(NSMutableDictionary *)context;

//
// Handle custom serialization for a field with the "customSerialization" annotation
// Return the object to serialize
//
@optional
- (void) initForDeserialization:(NSMutableDictionary *)context;

//
// Handle custom serialization for a field with the "customSerialization" annotation
// Return the object to serialize
//
@optional
- (id) customSerializeField:(NSString *)fieldName
                      value:(id)value
                    context:(NSMutableDictionary *)context;

//
// Handle custom serialization for a field with the "customSerialization" annotation
// Return the object to serialize
//
@optional
- (id) customDeserializeField:(NSString *)fieldName
                        value:(id)value
                      context:(NSMutableDictionary *)context;

//
// Handle a field in the JSON but not in the object
//
@optional
- (void) handleUnrecognizedField:(NSString *)key
                           value:(NSObject *)value
                         context:(NSMutableDictionary *)context;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark UgiJsonModelBase
///////////////////////////////////////////////////////////////////////////////////////

@interface UgiJsonModelBase : NSObject<UgiJsonModel>

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark Annotations
///////////////////////////////////////////////////////////////////////////////////////

//
// This class is wrapped, meaning that it is serialized by serializing a field inside, normally
// and array or dictionary
//
#define UGI_CLASS_WRAPPED(field) \
    @property BOOL _UgiJson_annotation_classžwrappedž##field

//
// Specify the type (class) of objects in this field
//
#define UGI_FIELD_IGNORE(field) \
@property BOOL _UgiJson_annotation_fieldž##field##žignore

//
// This field is a wrapped class, this specifies the type of the objects in the wrapped field
//
#define UGI_FIELD_WRAPPED_TYPE(field, type) \
    @property BOOL _UgiJson_annotation_fieldž##field##žwrappedtypež##type

//
// This field has custom serialization, call the customSerializeField:value:context: method
//
#define UGI_FIELD_CUSTOM_SERIALIZATION(field) \
    @property BOOL _UgiJson_annotation_fieldž##field##žcustomSerialization

//
// This field has custom deserialization, call the customDeserializeField:value:context: method
//
#define UGI_FIELD_CUSTOM_DESERIALIZATION(field) \
    @property BOOL _UgiJson_annotation_fieldž##field##žcustomDeserialization

//
// Specify the type (class) of objects in this field
//
#define UGI_FIELD_TYPE(field, type) \
    @property BOOL _UgiJson_annotation_fieldž##field##žtypež##type

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark PersistentJsonRoot
///////////////////////////////////////////////////////////////////////////////////////

static const NSString *UGI_CONTEXT_FOR_PERSISENCE = @"forPersistence";

@interface UgiPersistentJsonRoot : UgiJsonModelBase

@property BOOL _debug;

@property (retain, nonatomic) NSString *_fileName;

@property (retain, nonatomic) NSString *_filePath;

////

//
// Initialize an object associated with a file
//
- (id) initFromFile:(NSString *)fileName
 initializationData:(NSDictionary *)initializationData
              debug:(BOOL)debug;

//
// Initialize object when no file was present
//
- (void) initForNoFile:(NSDictionary *)initializationData;

//
// Initialize object after a file was loaded (can be used for version/migration checks)
//
- (void) initAfterFileLoaded:(NSDictionary *)initializationData;

//
// Initialize non-persistent parts of the object (after data is loaded)
//
- (void) initNonPersistent:(NSDictionary *)initializationData;

//
// Delete a file (from the proper folder)
//
+ (void) deleteFile:(NSString *)fileName;

//
// Save this object to its file
//
- (void) save;

//
// Save this object to the given file
//
- (void) saveToFile:(NSString *)fileName;

//! @endcond

@end
