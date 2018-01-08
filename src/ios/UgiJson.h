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

@property (nonatomic, retain, nonnull) NSString *name;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark UgiJsonClassInfo
///////////////////////////////////////////////////////////////////////////////////////

@interface UgiJsonClassInfo : NSObject

@property (nonatomic, retain, nonnull) NSDictionary *properties;
@property (nonatomic, retain, nonnull) NSArray *idFieldNames;

+ (UgiJsonClassInfo * _Nonnull) infoForClass:(nonnull Class)clazz;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark NSObject extensions
///////////////////////////////////////////////////////////////////////////////////////

static const NSString * _Nonnull UGI_CONTEXT_PRETTY = @"pretty";

extern NSDictionary * _Nonnull UGI_SERIALIZATION_CONTEXT_DEFAULT;
extern NSDictionary * _Nonnull UGI_SERIALIZATION_CONTEXT_PRETTY;
extern NSDictionary * _Nonnull UGI_DESERIALIZATION_CONTEXT_DEFAULT;

static const NSString * _Nonnull UGI_CONTEXT_ALWAYS_SERIALIZE = @"_ugi_alwaysSerialize";
static const NSString * _Nonnull UGI_CONTEXT_ROOT_OBJECT = @"_ugi_rootObject";
static const NSString * _Nonnull UGI_CONTEXT_OBJECT_STACK = @"_ugi_objectStack";
static const NSString * _Nonnull UGI_CONTEXT_PROPERTY_NAME = @"_ugi_propertyName";

@interface NSObject (UgiJson)

//
// Write JSON to a stream
//
- (void) toJsonStream:(NSOutputStream * _Nonnull)stream
              context:(NSDictionary * _Nonnull)context;

//
// Serialize an object to JSON, return NSData
//
- (NSData * _Nonnull) toJson:(NSDictionary * _Nonnull)context;

//
// Serialize an object to JSON, return NSString
//
- (NSString * _Nonnull) toJsonString:(NSDictionary * _Nullable)context;

//
// Parse object from JSON stream
//
- (nullable id) initFromJsonStream:(NSInputStream * _Nonnull)stream
                             error:(NSError * _Nullable * _Nullable)error
                           context:(NSDictionary * _Nonnull)context;

@end

///////////////////////////////////////////////////////////////////////////////////////
#pragma mark UgiJson
///////////////////////////////////////////////////////////////////////////////////////

@interface UgiJson : NSObject

//
// Date conversion
//
+ (NSDate * _Nonnull)dateFromJson:(long long)jsonValue;
+ (long long)dateToJson:(NSDate * _Nonnull)date;

//
// URL encode a string
//
+ (NSString * _Nonnull)urlEncode:(NSString * _Nonnull)s;

//
// Parse object from JSON stream
//
+ (nullable id) fromJsonStream:(NSInputStream * _Nonnull)stream
                         class:(nullable Class)clazz
                       context:(NSDictionary * _Nonnull)context
                         error:(NSError * _Nullable * _Nullable)error;

//
// Parse object from JSON data
//
+ (nullable id) fromJson:(NSData * _Nonnull)data
                   class:(nullable Class)clazz
                 context:(NSDictionary * _Nonnull)context
                   error:(NSError * _Nullable * _Nullable)error;

//
// Parse object from JSON string
//
+ (nullable id) fromJsonString:(NSString * _Nonnull)string
                         class:(nullable Class)clazz
                       context:(NSDictionary * _Nonnull)context
                         error:(NSError * _Nullable * _Nullable)error;

//
// Parse JSON into an object
//
+ (nullable id) parseJsonString:(NSString * _Nonnull)jsonString;


//
// Get the document directory
//
+ (NSString * _Nonnull) getDocumentDirectory;

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
- (BOOL) shouldSerializeObject:(NSMutableDictionary * _Nonnull)context;

@optional
- (BOOL) shouldSerializeField:(NSString * _Nonnull)fieldName
                        value:(nullable id)value
                      context:(NSMutableDictionary * _Nonnull)context;

@optional
- (nullable id) customSerialize:(NSMutableDictionary * _Nonnull)context;

@optional
- (void) customDeserialize:(nullable id)value;

//
// Modify deserialization context for serialization (called on root object only)
//
@optional
- (void) prepareSerializationContext:(NSMutableDictionary * _Nonnull)context;

//
// Modify deserialization context for deserialization (called on root object only)
//
@optional
- (void) prepareDeserializationContext:(NSMutableDictionary * _Nonnull)context;

//
// Handle custom serialization for a field with the "customSerialization" annotation
// Return the object to serialize
//
@optional
- (void) initForDeserialization:(NSMutableDictionary * _Nonnull)context;

//
// Handle custom serialization for a field with the "customSerialization" annotation
// Return the object to serialize
//
@optional
- (nullable id) customSerializeField:(NSString * _Nonnull)fieldName
                               value:(nullable id)value
                             context:(NSMutableDictionary * _Nonnull)context;

//
// Handle custom serialization for a field with the "customSerialization" annotation
// Return the object to serialize
//
@optional
- (nullable id) customDeserializeField:(NSString * _Nonnull)fieldName
                                 value:(nullable id)value
                               context:(NSMutableDictionary * _Nonnull)context;

//
// Handle a field in the JSON but not in the object
//
@optional
- (void) handleUnrecognizedField:(NSString * _Nonnull)key
                           value:(NSObject * _Nullable)value
                         context:(NSMutableDictionary * _Nonnull)context;

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

static const NSString * _Nonnull UGI_CONTEXT_FOR_PERSISENCE = @"forPersistence";

@interface UgiPersistentJsonRoot : UgiJsonModelBase

@property BOOL _debug;

@property (retain, nonatomic, nonnull) NSString *_fileName;

@property (retain, nonatomic, nonnull) NSString *_filePath;

////

//
// Initialize an object associated with a file
//
- (nonnull id) initFromFile:(NSString * _Nonnull)fileName
         initializationData:(NSDictionary * _Nullable)initializationData
                      debug:(BOOL)debug;

//
// Initialize object when no file was present
//
- (void) initForNoFile:(NSDictionary * _Nonnull)initializationData;

//
// Initialize object after a file was loaded (can be used for version/migration checks)
//
- (void) initAfterFileLoaded:(NSDictionary * _Nonnull)initializationData;

//
// Initialize non-persistent parts of the object (after data is loaded)
//
- (void) initNonPersistent:(NSDictionary * _Nonnull)initializationData;

//
// Delete a file (from the proper folder)
//
+ (void) deleteFile:(NSString * _Nonnull)fileName;

//
// Save this object to its file
//
- (void) save;

//
// Save this object to the given file
//
- (void) saveToFile:(NSString * _Nonnull)fileName;

//! @endcond

@end
