(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(11)
var ieee754 = __webpack_require__(13)
var isArray = __webpack_require__(14)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// ndef-util.js
// Copyright 2013 Don Coleman
//

// This is from phonegap-nfc.js and is a combination of helpers in nfc and util
// https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js

function stringToBytes(string) {
    var bytes = Buffer(string).toJSON();
    if (bytes.hasOwnProperty('data')) {
        // Node 0.12.x
        return bytes.data;
    } else {
        // Node 0.10.x
        return bytes;
    }
}

function bytesToString(bytes) {
    return Buffer(bytes).toString();
}

// useful for readable version of Tag UID
function bytesToHexString(bytes) {
    var dec, hexstring, bytesAsHexString = "";
    for (var i = 0; i < bytes.length; i++) {
       if (bytes[i] >= 0) {
           dec = bytes[i];
       } else {
           dec = 256 + bytes[i];
       }
       hexstring = dec.toString(16);
       // zero padding
       if (hexstring.length == 1) {
           hexstring = "0" + hexstring;
       }
       bytesAsHexString += hexstring;
    }
    return bytesAsHexString;
}

// i must be <= 256
function toHex(i) {
    var hex;

    if (i < 0) {
        i += 256;
    }
    hex = i.toString(16);

    // zero padding
    if (hex.length == 1) {
        hex = "0" + hex;
    }
    return hex;
}

function toPrintable(i) {
    if (i >= 0x20 & i <= 0x7F) {
        return String.fromCharCode(i);
    } else {
        return '.';
    }
}

module.exports = {
    stringToBytes: stringToBytes,
    bytesToString: bytesToString,
    bytesToHexString: bytesToHexString,
    toHex: toHex,
    toPrintable: toPrintable
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TNF_EMPTY = 0x0;
exports.TNF_WELL_KNOWN = 0x01;
exports.TNF_MIME_MEDIA = 0x02;
exports.TNF_ABSOLUTE_URI = 0x03;
exports.TNF_EXTERNAL_TYPE = 0x04;
exports.TNF_UNKNOWN = 0x05;
exports.TNF_UNCHANGED = 0x06;
exports.TNF_RESERVED = 0x07;
exports.RTD_TEXT = 'T'; // [0x54]
exports.RTD_URI = 'U'; // [0x55]
exports.RTD_SMART_POSTER = 'Sp'; // [0x53, 0x70]
exports.RTD_ALTERNATIVE_CARRIER = 'ac'; // [0x61, 0x63]
exports.RTD_HANDOVER_CARRIER = 'Hc'; // [0x48, 0x63]
exports.RTD_HANDOVER_REQUEST = 'Hr'; // [0x48, 0x72]
exports.RTD_HANDOVER_SELECT = 'Hs'; // [0x48, 0x73]
exports.MESSAGE_STOP_BYTE = 0xfe;
exports.MESSAGE_START_TAG = 0x03;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
// ndef-util.js
// Copyright 2013 Don Coleman
//
Object.defineProperty(exports, "__esModule", { value: true });
// This is from phonegap-nfc.js and is a combination of helpers in nfc and util
// https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js
function stringToBytes(string) {
    var bytes = Buffer.from(string).toJSON();
    if (bytes.hasOwnProperty('data')) {
        // Node 0.12.x
        return bytes.data;
    }
    else {
        // Node 0.10.x
        return bytes;
    }
}
exports.stringToBytes = stringToBytes;
function bytesToString(bytes) {
    return Buffer.from(bytes).toString();
}
exports.bytesToString = bytesToString;
// useful for readable version of Tag UID
function bytesToHexString(bytes) {
    var dec;
    var hexstring;
    var bytesAsHexString = '';
    for (var i = 0; i < bytes.length; i++) {
        if (bytes[i] >= 0) {
            dec = bytes[i];
        }
        else {
            dec = 256 + bytes[i];
        }
        hexstring = dec.toString(16);
        // zero padding
        if (hexstring.length == 1) {
            hexstring = '0' + hexstring;
        }
        bytesAsHexString += hexstring;
    }
    return bytesAsHexString;
}
exports.bytesToHexString = bytesToHexString;
// i must be <= 256
function toHex(i) {
    var hex;
    if (i < 0) {
        i += 256;
    }
    hex = i.toString(16);
    // zero padding
    if (hex.length == 1) {
        hex = '0' + hex;
    }
    return hex;
}
exports.toHex = toHex;
function toPrintable(i) {
    if (i >= 0x20 && i <= 0x7F) {
        return String.fromCharCode(i);
    }
    else {
        return '.';
    }
}
exports.toPrintable = toPrintable;
//# sourceMappingURL=ndef-util.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(21);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
// ndef.js
// Copyright 2013 Don Coleman
//
// This code is from phonegap-nfc.js https://github.com/don/phonegap-nfc
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __webpack_require__(5);
var consts = __webpack_require__(4);
var textHelper = __webpack_require__(23);
var uriHelper = __webpack_require__(24);
// import {
//   RTD_SMART_POSTER, RTD_TEXT, RTD_URI, TNF_ABSOLUTE_URI, TNF_EMPTY,
//   TNF_EXTERNAL_TYPE, TNF_MIME_MEDIA, TNF_RESERVED, TNF_UNCHANGED, TNF_UNKNOWN,
//   TNF_WELL_KNOWN
// } from './consts'
/**
 * Creates a JSON representation of a NDEF Record.
 *
 * @tnf 3-bit TNF (Type Name Format) - use one of the TNF_* constants
 * @type byte array, containing zero to 255 bytes, must not be null
 * @id byte array, containing zero to 255 bytes, must not be null
 * @payload byte array, containing zero to (2 ** 32 - 1) bytes, must not be null
 *
 * @returns JSON representation of a NDEF record
 *
 * @see Ndef.textRecord, Ndef.uriRecord and Ndef.mimeMediaRecord for examples
 */
function record(tnf, type, id, payload) {
    // handle null values
    if (!tnf) {
        tnf = consts.TNF_EMPTY;
    }
    if (!type) {
        type = [];
    }
    if (!id) {
        id = [];
    }
    if (!payload) {
        payload = [];
    }
    // store type as String so it's easier to compare
    if (type instanceof Array) {
        type = utils.bytesToString(type);
    }
    // in the future, id could be a String
    if (!(id instanceof Array)) {
        id = utils.stringToBytes(id);
    }
    // Payload must be binary
    if (!(payload instanceof Array)) {
        payload = utils.stringToBytes(payload);
    }
    // TODO: typescript
    var record = {
        tnf: tnf,
        type: type,
        id: id,
        payload: payload
    };
    // Experimental feature
    // Convert payload to text for Text and URI records
    if (tnf === consts.TNF_WELL_KNOWN) {
        // TODO: typescript
        switch (record.type) {
            case consts.RTD_TEXT:
                record.value = exports.text.decodePayload(record.payload);
                break;
            case consts.RTD_URI:
                record.value = exports.uri.decodePayload(record.payload);
                break;
        }
    }
    return record;
}
exports.record = record;
/**
 * Helper that creates an NDEF record containing plain text.
 *
 * @text String of text to encode
 * @languageCode ISO/IANA language code. Examples: “fi”, “en-US”, “fr-CA”,
 *     “jp”. (optional)
 * @id byte[] (optional)
 */
function textRecord(text, languageCode, id) {
    var payload = textHelper.encodePayload(text, languageCode);
    if (!id) {
        id = [];
    }
    return record(consts.TNF_WELL_KNOWN, consts.RTD_TEXT, id, payload);
}
exports.textRecord = textRecord;
/**
 * Helper that creates a NDEF record containing a URI.
 *
 * @uri String
 * @id byte[] (optional)
 */
function uriRecord(uri, id) {
    var payload = uriHelper.encodePayload(uri);
    if (!id) {
        id = [];
    }
    return record(consts.TNF_WELL_KNOWN, consts.RTD_URI, id, payload);
}
exports.uriRecord = uriRecord;
/**
 * Helper that creates a NDEF record containing an absolute URI.
 *
 * An Absolute URI record means the URI describes the payload of the record.
 *
 * For example a SOAP message could use
 * "http://schemas.xmlsoap.org/soap/envelope/" as the type and XML content for
 * the payload.
 *
 * Absolute URI can also be used to write LaunchApp records for Windows.
 *
 * See 2.4.2 Payload Type of the NDEF Specification
 * http://www.nfc-forum.org/specs/spec_list#ndefts
 *
 * Note that by default, Android will open the URI defined in the type
 * field of an Absolute URI record (TNF=3) and ignore the payload.
 * BlackBerry and Windows do not open the browser for TNF=3.
 *
 * To write a URI as the payload use uriRecord(uri)
 *
 * @uri String
 * @payload byte[] or String
 * @id byte[] (optional)
 */
function absoluteUriRecord(uri, payload, id) {
    if (!id) {
        id = [];
    }
    if (!payload) {
        payload = [];
    }
    return record(consts.TNF_ABSOLUTE_URI, uri, id, payload);
}
exports.absoluteUriRecord = absoluteUriRecord;
/**
 * Helper that creates a NDEF record containing an mimeMediaRecord.
 *
 * @mimeType String
 * @payload byte[]
 * @id byte[] (optional)
 */
function mimeMediaRecord(mimeType, payload, id) {
    if (!id) {
        id = [];
    }
    return record(consts.TNF_MIME_MEDIA, mimeType, id, payload);
}
exports.mimeMediaRecord = mimeMediaRecord;
/**
 * Helper that creates an NDEF record containing an Smart Poster.
 *
 * @ndefRecords array of NDEF Records
 * @id byte[] (optional)
 */
function smartPoster(ndefRecords, id) {
    var payload = [];
    if (!id) {
        id = [];
    }
    if (ndefRecords) {
        // make sure we have an array of something like NDEF records before encoding
        if (ndefRecords[0] instanceof Object && ndefRecords[0].hasOwnProperty('tnf')) {
            payload = encodeMessage(ndefRecords);
        }
        else {
            // assume the caller has already encoded the NDEF records into a byte
            // array
            payload = ndefRecords;
        }
    }
    else {
        console.log('WARNING: Expecting an array of NDEF records');
    }
    return record(consts.TNF_WELL_KNOWN, consts.RTD_SMART_POSTER, id, payload);
}
exports.smartPoster = smartPoster;
/**
 * Helper that creates an empty NDEF record.
 *
 */
function emptyRecord() {
    return record(consts.TNF_EMPTY, [], [], []);
}
exports.emptyRecord = emptyRecord;
/**
 * Helper that creates an Android Application Record (AAR).
 * http://developer.android.com/guide/topics/connectivity/nfc/nfc.html#aar
 *
 */
function androidApplicationRecord(packageName) {
    return record(consts.TNF_EXTERNAL_TYPE, 'android.com:pkg', [], packageName);
}
exports.androidApplicationRecord = androidApplicationRecord;
/**
 * Encodes an NDEF Message into bytes that can be written to a NFC tag.
 *
 * @ndefRecords an Array of NDEF Records
 *
 * @returns byte array
 *
 * @see NFC Data Exchange Format (NDEF)
 *     http://www.nfc-forum.org/specs/spec_list/
 */
function encodeMessage(ndefRecords) {
    var encoded = [];
    var tnf_byte;
    var record_type;
    var payload_length;
    var id_length;
    // messageBegin, messageEnd
    var mb;
    var me;
    var cf = false; // chunkFlag TODO implement
    // boolean shortRecord
    var sr;
    // boolean idLengthFieldIsPresent
    var il;
    for (var i = 0; i < ndefRecords.length; i++) {
        mb = (i === 0);
        me = (i === (ndefRecords.length - 1));
        sr = (ndefRecords[i].payload.length < 0xFF);
        il = (ndefRecords[i].id.length > 0);
        tnf_byte = encodeTnf(mb, me, cf, sr, il, ndefRecords[i].tnf);
        encoded.push(tnf_byte);
        // type is stored as String, converting to bytes for storage
        record_type = utils.stringToBytes(ndefRecords[i].type);
        encoded.push(record_type.length);
        if (sr) {
            payload_length = ndefRecords[i].payload.length;
            encoded.push(payload_length);
        }
        else {
            payload_length = ndefRecords[i].payload.length;
            // 4 bytes
            encoded.push((payload_length >> 24));
            encoded.push((payload_length >> 16));
            encoded.push((payload_length >> 8));
            encoded.push((payload_length & 0xFF));
        }
        if (il) {
            id_length = ndefRecords[i].id.length;
            encoded.push(id_length);
        }
        encoded = encoded.concat(record_type);
        if (il) {
            encoded = encoded.concat(ndefRecords[i].id);
        }
        encoded = encoded.concat(ndefRecords[i].payload);
    }
    return encoded;
}
exports.encodeMessage = encodeMessage;
/**
 * Decodes an array bytes into an NDEF Message
 *
 * @bytes an array bytes read from a NFC tag
 *
 * @returns array of NDEF Records
 *
 * @see NFC Data Exchange Format (NDEF)
 *     http://www.nfc-forum.org/specs/spec_list/
 */
function decodeMessage(bytes) {
    bytes = bytes.slice(0);
    var ndef_message = [];
    var tnf_byte;
    var header;
    var type_length = 0;
    var payload_length = 0;
    var id_length = 0;
    var record_type = [];
    var id = [];
    var payload = [];
    while (bytes.length) {
        tnf_byte = bytes.shift();
        header = decodeTnf(tnf_byte);
        type_length = bytes.shift();
        if (header.sr) {
            payload_length = bytes.shift();
        }
        else {
            // next 4 bytes are length
            payload_length = ((0xFF & bytes.shift()) << 24) |
                ((0xFF & bytes.shift()) << 16) |
                ((0xFF & bytes.shift()) << 8) |
                (0xFF & bytes.shift());
        }
        if (header.il) {
            id_length = bytes.shift();
        }
        record_type = bytes.splice(0, type_length);
        id = bytes.splice(0, id_length);
        payload = bytes.splice(0, payload_length);
        ndef_message.push(record(header.tnf, record_type, id, payload));
        if (header.me)
            break; // last message
    }
    return ndef_message;
}
exports.decodeMessage = decodeMessage;
/**
 * Decode the bit flags from a TNF Byte.
 *
 * @returns object with decoded data
 *
 *  See NFC Data Exchange Format (NDEF) Specification Section 3.2 RecordLayout
 */
function decodeTnf(tnf_byte) {
    return {
        mb: (tnf_byte & 0x80) !== 0,
        me: (tnf_byte & 0x40) !== 0,
        cf: (tnf_byte & 0x20) !== 0,
        sr: (tnf_byte & 0x10) !== 0,
        il: (tnf_byte & 0x8) !== 0,
        tnf: (tnf_byte & 0x7)
    };
}
exports.decodeTnf = decodeTnf;
/**
 * Encode NDEF bit flags into a TNF Byte.
 *
 * @returns tnf byte
 *
 *  See NFC Data Exchange Format (NDEF) Specification Section 3.2 RecordLayout
 */
function encodeTnf(mb, me, cf, sr, il, tnf) {
    var value = tnf;
    if (mb) {
        value = value | 0x80;
    }
    if (me) {
        value = value | 0x40;
    }
    // note if cf: me, mb, li must be false and tnf must be 0x6
    if (cf) {
        value = value | 0x20;
    }
    if (sr) {
        value = value | 0x10;
    }
    if (il) {
        value = value | 0x8;
    }
    return value;
}
exports.encodeTnf = encodeTnf;
// TODO test with byte[] and string
function isType(record, tnf, type) {
    if (record.tnf === tnf) {
        return (s(record) === s(type));
    }
    return false;
}
exports.isType = isType;
// }
function tnfToString(tnf) {
    var value = tnf;
    switch (tnf) {
        case consts.TNF_EMPTY:
            value = 'Empty';
            break;
        case consts.TNF_WELL_KNOWN:
            value = 'Well Known';
            break;
        case consts.TNF_MIME_MEDIA:
            value = 'Mime Media';
            break;
        case consts.TNF_ABSOLUTE_URI:
            value = 'Absolute URI';
            break;
        case consts.TNF_EXTERNAL_TYPE:
            value = 'External';
            break;
        case consts.TNF_UNKNOWN:
            value = 'Unknown';
            break;
        case consts.TNF_UNCHANGED:
            value = 'Unchanged';
            break;
        case consts.TNF_RESERVED:
            value = 'Reserved';
            break;
    }
    return value;
}
exports.tnfToString = tnfToString;
// Convert NDEF records and messages to strings
// This works OK for demos, but real code proably needs
// a custom implementation. It would be nice to make
// smarter record objects that can print themselves
var stringifier = {
    stringify: function (data, separator) {
        if (Array.isArray(data)) {
            if (typeof data[0] === 'number') {
                // guessing this message bytes
                data = decodeMessage(data);
            }
            return stringifier.printRecords(data, separator);
        }
        else {
            return stringifier.printRecord(data, separator);
        }
    },
    // @message - NDEF Message (array of NDEF Records)
    // @separator - line separator, optional, defaults to \n
    // @returns string with NDEF Message
    printRecords: function (message, separator) {
        if (!separator) {
            separator = '\n';
        }
        var result = '';
        // Print out the payload for each record
        message.forEach(function (record) {
            result += stringifier.printRecord(record, separator);
            result += separator;
        });
        return result.slice(0, (-1 * separator.length));
    },
    // @record - NDEF Record
    // @separator - line separator, optional, defaults to \n
    // @returns string with NDEF Record
    printRecord: function (record, separator) {
        var result = '';
        if (!separator) {
            separator = '\n';
        }
        switch (record.tnf) {
            case consts.TNF_EMPTY:
                result += 'Empty Record';
                result += separator;
                break;
            case consts.TNF_WELL_KNOWN:
                result += stringifier.printWellKnown(record, separator);
                break;
            case consts.TNF_MIME_MEDIA:
                result += 'MIME Media';
                result += separator;
                result += s(record.type);
                result += separator;
                result += s(record.payload); // might be binary
                break;
            case consts.TNF_ABSOLUTE_URI:
                result += 'Absolute URI';
                result += separator;
                result += s(record.type); // the URI is the type
                result += separator;
                result += s(record.payload); // might be binary
                break;
            case consts.TNF_EXTERNAL_TYPE:
                // AAR contains strings, other types could
                // contain binary data
                result += 'External';
                result += separator;
                result += s(record.type);
                result += separator;
                result += s(record.payload);
                break;
            default:
                result += s("Can't process TNF " + record.tnf);
        }
        result += separator;
        return result;
    },
    printWellKnown: function (record, separator) {
        var result = '';
        if (record.tnf !== consts.TNF_WELL_KNOWN) {
            return 'ERROR expecting TNF Well Known';
        }
        switch (record.type) {
            case consts.RTD_TEXT:
                result += 'Text Record';
                result += separator;
                result += (exports.text.decodePayload(record.payload));
                break;
            case consts.RTD_URI:
                result += 'URI Record';
                result += separator;
                result += (exports.uri.decodePayload(record.payload));
                break;
            case consts.RTD_SMART_POSTER:
                result += 'Smart Poster';
                result += separator;
                // the payload of a smartposter is a NDEF message
                result += stringifier.printRecords(decodeMessage(record.payload));
                break;
            default:
                // attempt to display other types
                result += record.type + ' Record';
                result += separator;
                result += s(record.payload);
        }
        return result;
    }
};
// convert bytes to a String
function s(bytes) {
    return Buffer.from(bytes).toString();
}
exports.text = textHelper;
exports.uri = uriHelper;
// export const util = util
exports.util = utils;
exports.stringify = stringifier.stringify;
// expose helper objects
// util = util
// stringify = stringifier.stringify
// module.exports = ndef
//# sourceMappingURL=ndef.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, Buffer) {var ndef = __webpack_require__(17);
module.exports = ndef;

if (process.version.indexOf('v0.8') === 0) {
    // Monkey Patch Buffer for Node 0.8 support
    Buffer.prototype.toJSON = function() {
        j = [];
        for (var i = 0; i < this.length; i++) {
            j[i] = this[i];
        }    
        return j;
    }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0).Buffer))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, Buffer) {
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
if (process.version.indexOf('v0.8') === 0) {
    // Monkey Patch Buffer for Node 0.8 support
    Buffer.prototype.toJSON = function () {
        var j = [];
        for (var i = 0; i < this.length; i++) {
            j[i] = this[i];
        }
        return j;
    };
}
__export(__webpack_require__(7));
__export(__webpack_require__(4));
__export(__webpack_require__(22));
var push_parser_1 = __webpack_require__(25);
exports.PushParser = push_parser_1.PushParser;
//# sourceMappingURL=index.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(0).Buffer))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("cordova/exec");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return (b64.length * 3 / 4) - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr((len * 3 / 4) - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0; i < l; i += 4) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 13 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 14 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(1);

// decode text bytes from ndef record payload
// @returns a string
function decode(data) {

    var languageCodeLength = (data[0] & 0x3F), // 6 LSBs
        languageCode = data.slice(1, 1 + languageCodeLength),
        utf16 = (data[0] & 0x80) !== 0; // assuming UTF-16BE

    // TODO need to deal with UTF in the future
    // console.log("lang " + languageCode + (utf16 ? " utf16" : " utf8"));

    return util.bytesToString(data.slice(languageCodeLength + 1));
}

// encode text payload
// @returns an array of bytes
function encode(text, lang, encoding) {

    // ISO/IANA language code, but we're not enforcing
    if (!lang) { lang = 'en'; }

    var encoded = util.stringToBytes(lang + text);
    encoded.unshift(lang.length);

    return encoded;
}

module.exports = {
    encodePayload: encode,
    decodePayload: decode
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(1);

// URI identifier codes from URI Record Type Definition NFCForum-TS-RTD_URI_1.0 2006-07-24
// index in array matches code in the spec
var protocols = [ "", "http://www.", "https://www.", "http://", "https://", "tel:", "mailto:", "ftp://anonymous:anonymous@", "ftp://ftp.", "ftps://", "sftp://", "smb://", "nfs://", "ftp://", "dav://", "news:", "telnet://", "imap:", "rtsp://", "urn:", "pop:", "sip:", "sips:", "tftp:", "btspp://", "btl2cap://", "btgoep://", "tcpobex://", "irdaobex://", "file://", "urn:epc:id:", "urn:epc:tag:", "urn:epc:pat:", "urn:epc:raw:", "urn:epc:", "urn:nfc:" ]

// decode a URI payload bytes
// @returns a string
function decode(data) {
    var prefix = protocols[data[0]];
    if (!prefix) { // 36 to 255 should be ""
        prefix = "";
    }    
    return prefix + util.bytesToString(data.slice(1));      
} 

// shorten a URI with standard prefix
// @returns an array of bytes
function encode(uri) {
    
    var prefix,
        protocolCode,
        encoded;

    // check each protocol, unless we've found a match
    // "urn:" is the one exception where we need to keep checking
    // slice so we don't check ""
    protocols.slice(1).forEach(function(protocol) {                        
        if ((!prefix || prefix === "urn:") && uri.indexOf(protocol) === 0) { 
            prefix = protocol;
        }
    });

    if (!prefix) {
        prefix = "";
    }
    
    encoded = util.stringToBytes(uri.slice(prefix.length));
    protocolCode = protocols.indexOf(prefix);    
    // prepend protocol code
    encoded.unshift(protocolCode);
    
    return encoded; 
}

module.exports = {
    encodePayload: encode,
    decodePayload: decode
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {// ndef.js
// Copyright 2013 Don Coleman
//
// This code is from phonegap-nfc.js https://github.com/don/phonegap-nfc

var util = __webpack_require__(1),
    textHelper = __webpack_require__(15),
    uriHelper = __webpack_require__(16);

var ndef = {

    // see android.nfc.NdefRecord for documentation about constants
    // http://developer.android.com/reference/android/nfc/NdefRecord.html
    TNF_EMPTY: 0x0,
    TNF_WELL_KNOWN: 0x01,
    TNF_MIME_MEDIA: 0x02,
    TNF_ABSOLUTE_URI: 0x03,
    TNF_EXTERNAL_TYPE: 0x04,
    TNF_UNKNOWN: 0x05,
    TNF_UNCHANGED: 0x06,
    TNF_RESERVED: 0x07,

    RTD_TEXT: "T", // [0x54]
    RTD_URI: "U", // [0x55]
    RTD_SMART_POSTER: "Sp", // [0x53, 0x70]
    RTD_ALTERNATIVE_CARRIER: "ac", //[0x61, 0x63]
    RTD_HANDOVER_CARRIER: "Hc", // [0x48, 0x63]
    RTD_HANDOVER_REQUEST: "Hr", // [0x48, 0x72]
    RTD_HANDOVER_SELECT: "Hs", // [0x48, 0x73]

    /**
     * Creates a JSON representation of a NDEF Record.
     *
     * @tnf 3-bit TNF (Type Name Format) - use one of the TNF_* constants
     * @type byte array, containing zero to 255 bytes, must not be null
     * @id byte array, containing zero to 255 bytes, must not be null
     * @payload byte array, containing zero to (2 ** 32 - 1) bytes, must not be null
     *
     * @returns JSON representation of a NDEF record
     *
     * @see Ndef.textRecord, Ndef.uriRecord and Ndef.mimeMediaRecord for examples
     */
    record: function (tnf, type, id, payload) {

        // handle null values
        if (!tnf) { tnf = ndef.TNF_EMPTY; }
        if (!type) { type = []; }
        if (!id) { id = []; }
        if (!payload) { payload = []; }

        // store type as String so it's easier to compare
        if(type instanceof Array) {
            type = util.bytesToString(type);
        }

        // in the future, id could be a String
        if (!(id instanceof Array)) {
           id = util.stringToBytes(id);
        }

        // Payload must be binary
        if (!(payload instanceof Array)) {
           payload = util.stringToBytes(payload);
        }

        var record = {
            tnf: tnf,
            type: type,
            id: id,
            payload: payload
        };

        // Experimental feature
        // Convert payload to text for Text and URI records
        if (tnf === ndef.TNF_WELL_KNOWN) {
            switch(record.type) {
                case ndef.RTD_TEXT:
                    record.value = ndef.text.decodePayload(record.payload);
                    break;
                case ndef.RTD_URI:
                    record.value = ndef.uri.decodePayload(record.payload);
                    break;
            }
        }

        return record;
    },

    /**
     * Helper that creates an NDEF record containing plain text.
     *
     * @text String of text to encode
     * @languageCode ISO/IANA language code. Examples: “fi”, “en-US”, “fr-CA”, “jp”. (optional)
     * @id byte[] (optional)
     */
    textRecord: function (text, languageCode, id) {
        var payload = textHelper.encodePayload(text, languageCode);
        if (!id) { id = []; }

        return ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_TEXT, id, payload);
    },

    /**
     * Helper that creates a NDEF record containing a URI.
     *
     * @uri String
     * @id byte[] (optional)
     */
    uriRecord: function (uri, id) {
        var payload = uriHelper.encodePayload(uri);
        if (!id) { id = []; }
        return ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_URI, id, payload);
    },

    /**
     * Helper that creates a NDEF record containing an absolute URI.
     *
     * An Absolute URI record means the URI describes the payload of the record.
     *
     * For example a SOAP message could use "http://schemas.xmlsoap.org/soap/envelope/"
     * as the type and XML content for the payload.
     *
     * Absolute URI can also be used to write LaunchApp records for Windows.
     *
     * See 2.4.2 Payload Type of the NDEF Specification
     * http://www.nfc-forum.org/specs/spec_list#ndefts
     *
     * Note that by default, Android will open the URI defined in the type
     * field of an Absolute URI record (TNF=3) and ignore the payload.
     * BlackBerry and Windows do not open the browser for TNF=3.
     *
     * To write a URI as the payload use ndef.uriRecord(uri)
     *
     * @uri String
     * @payload byte[] or String
     * @id byte[] (optional)
     */
    absoluteUriRecord: function (uri, payload, id) {
        if (!id) { id = []; }
        if (!payload) { payload = []; }
        return ndef.record(ndef.TNF_ABSOLUTE_URI, uri, id, payload);
    },

    /**
     * Helper that creates a NDEF record containing an mimeMediaRecord.
     *
     * @mimeType String
     * @payload byte[]
     * @id byte[] (optional)
     */
    mimeMediaRecord: function (mimeType, payload, id) {
        if (!id) { id = []; }
        return ndef.record(ndef.TNF_MIME_MEDIA, mimeType, id, payload);
    },

    /**
     * Helper that creates an NDEF record containing an Smart Poster.
     *
     * @ndefRecords array of NDEF Records
     * @id byte[] (optional)
     */
    smartPoster: function (ndefRecords, id) {
        var payload = [];

        if (!id) { id = []; }

        if (ndefRecords)
        {
            // make sure we have an array of something like NDEF records before encoding
            if (ndefRecords[0] instanceof Object && ndefRecords[0].hasOwnProperty('tnf')) {
                payload = ndef.encodeMessage(ndefRecords);
            } else {
                // assume the caller has already encoded the NDEF records into a byte array
                payload = ndefRecords;
            }
        } else {
            console.log("WARNING: Expecting an array of NDEF records");
        }

        return ndef.record(ndef.TNF_WELL_KNOWN, ndef.RTD_SMART_POSTER, id, payload);
    },

    /**
     * Helper that creates an empty NDEF record.
     *
     */
    emptyRecord: function() {
        return ndef.record(ndef.TNF_EMPTY, [], [], []);
    },

    /**
    * Helper that creates an Android Application Record (AAR).
    * http://developer.android.com/guide/topics/connectivity/nfc/nfc.html#aar
    *
    */
    androidApplicationRecord: function(packageName) {
        return ndef.record(ndef.TNF_EXTERNAL_TYPE, "android.com:pkg", [], packageName);
    },


    /**
     * Encodes an NDEF Message into bytes that can be written to a NFC tag.
     *
     * @ndefRecords an Array of NDEF Records
     *
     * @returns byte array
     *
     * @see NFC Data Exchange Format (NDEF) http://www.nfc-forum.org/specs/spec_list/
     */
    encodeMessage: function (ndefRecords) {

        var encoded = [],
            tnf_byte,
            record_type,
            payload_length,
            id_length,
            i,
            mb, me, // messageBegin, messageEnd
            cf = false, // chunkFlag TODO implement
            sr, // boolean shortRecord
            il; // boolean idLengthFieldIsPresent

        for(i = 0; i < ndefRecords.length; i++) {

            mb = (i === 0);
            me = (i === (ndefRecords.length - 1));
            sr = (ndefRecords[i].payload.length < 0xFF);
            il = (ndefRecords[i].id.length > 0);
            tnf_byte = ndef.encodeTnf(mb, me, cf, sr, il, ndefRecords[i].tnf);
            encoded.push(tnf_byte);

            // type is stored as String, converting to bytes for storage
            record_type = util.stringToBytes(ndefRecords[i].type);
            encoded.push(record_type.length);

            if (sr) {
                payload_length = ndefRecords[i].payload.length;
                encoded.push(payload_length);
            } else {
                payload_length = ndefRecords[i].payload.length;
                // 4 bytes
                encoded.push((payload_length >> 24));
                encoded.push((payload_length >> 16));
                encoded.push((payload_length >> 8));
                encoded.push((payload_length & 0xFF));
            }

            if (il) {
                id_length = ndefRecords[i].id.length;
                encoded.push(id_length);
            }

            encoded = encoded.concat(record_type);

            if (il) {
                encoded = encoded.concat(ndefRecords[i].id);
            }

            encoded = encoded.concat(ndefRecords[i].payload);
        }

        return encoded;
    },

    /**
     * Decodes an array bytes into an NDEF Message
     *
     * @bytes an array bytes read from a NFC tag
     *
     * @returns array of NDEF Records
     *
     * @see NFC Data Exchange Format (NDEF) http://www.nfc-forum.org/specs/spec_list/
     */
    decodeMessage: function (bytes) {

        var bytes = bytes.slice(0), // clone since parsing is destructive
            ndef_message = [],
            tnf_byte,
            header,
            type_length = 0,
            payload_length = 0,
            id_length = 0,
            record_type = [],
            id = [],
            payload = [];

        while(bytes.length) {

            tnf_byte = bytes.shift();
            header = ndef.decodeTnf(tnf_byte);

            type_length = bytes.shift();

            if (header.sr) {
                payload_length = bytes.shift();
            } else {
                // next 4 bytes are length
                payload_length = ((0xFF & bytes.shift()) << 24) |
                    ((0xFF & bytes.shift()) << 16) |
                    ((0xFF & bytes.shift()) << 8) |
                    (0xFF & bytes.shift());
            }

            if (header.il) {
                id_length = bytes.shift();
            }

            record_type = bytes.splice(0, type_length);
            id = bytes.splice(0, id_length);
            payload = bytes.splice(0, payload_length);

            ndef_message.push(
                ndef.record(header.tnf, record_type, id, payload)
            );

            if (header.me) break; // last message
        }

        return ndef_message;
    },

    /**
     * Decode the bit flags from a TNF Byte.
     *
     * @returns object with decoded data
     *
     *  See NFC Data Exchange Format (NDEF) Specification Section 3.2 RecordLayout
     */
    decodeTnf: function (tnf_byte) {
        return {
            mb: (tnf_byte & 0x80) !== 0,
            me: (tnf_byte & 0x40) !== 0,
            cf: (tnf_byte & 0x20) !== 0,
            sr: (tnf_byte & 0x10) !== 0,
            il: (tnf_byte & 0x8) !== 0,
            tnf: (tnf_byte & 0x7)
        };
    },

    /**
     * Encode NDEF bit flags into a TNF Byte.
     *
     * @returns tnf byte
     *
     *  See NFC Data Exchange Format (NDEF) Specification Section 3.2 RecordLayout
     */
    encodeTnf: function (mb, me, cf, sr, il, tnf) {

        var value = tnf;

        if (mb) {
            value = value | 0x80;
        }

        if (me) {
            value = value | 0x40;
        }

        // note if cf: me, mb, li must be false and tnf must be 0x6
        if (cf) {
            value = value | 0x20;
        }

        if (sr) {
            value = value | 0x10;
        }

        if (il) {
            value = value | 0x8;
        }

        return value;
    },

    // TODO test with byte[] and string
    isType: function(record, tnf, type) {

        if (record.tnf === tnf) {
            return (s(record) === s(type));
        }
        return false;

    }

};

function tnfToString(tnf) {
    var value = tnf;

    switch (tnf) {
        case ndef.TNF_EMPTY:
            value = "Empty";
            break;
        case ndef.TNF_WELL_KNOWN:
            value = "Well Known";
            break;
        case ndef.TNF_MIME_MEDIA:
            value = "Mime Media";
            break;
        case ndef.TNF_ABSOLUTE_URI:
            value = "Absolute URI";
            break;
        case ndef.TNF_EXTERNAL_TYPE:
            value = "External";
            break;
        case ndef.TNF_UNKNOWN:
            value = "Unknown";
            break;
        case ndef.TNF_UNCHANGED:
            value = "Unchanged";
            break;
        case ndef.TNF_RESERVED:
            value = "Reserved";
            break;
    }
    return value;
}

// Convert NDEF records and messages to strings
// This works OK for demos, but real code proably needs
// a custom implementation. It would be nice to make
// smarter record objects that can print themselves
var stringifier = {

    stringify: function (data, separator) {

        if (Array.isArray(data)) {

            if (typeof data[0] === 'number') {
                // guessing this message bytes
                data = ndef.decodeMessage(data);
            }

            return stringifier.printRecords(data, separator);
        } else {
            return stringifier.printRecord(data, separator);
        }
    },

    // @message - NDEF Message (array of NDEF Records)
    // @separator - line separator, optional, defaults to \n
    // @returns string with NDEF Message
    printRecords: function (message, separator) {

        if(!separator) { separator = "\n"; }
        result = "";

        // Print out the payload for each record
        message.forEach(function(record) {
            result += stringifier.printRecord(record, separator);
            result += separator;
        });

        return result.slice(0, (-1 * separator.length));
    },

    // @record - NDEF Record
    // @separator - line separator, optional, defaults to \n
    // @returns string with NDEF Record
    printRecord: function (record, separator) {

        var result = "";

        if(!separator) { separator = "\n"; }

        switch(record.tnf) {
            case ndef.TNF_EMPTY:
                result += "Empty Record";
                result += separator;
                break;
            case ndef.TNF_WELL_KNOWN:
                result += stringifier.printWellKnown(record, separator);
                break;
            case ndef.TNF_MIME_MEDIA:
                result += "MIME Media";
                result += separator;
                result += s(record.type);
                result += separator;
                result += s(record.payload); // might be binary
                break;
            case ndef.TNF_ABSOLUTE_URI:
                result += "Absolute URI";
                result += separator;
                result += s(record.type);    // the URI is the type
                result += separator;
                result += s(record.payload); // might be binary
                break;;
            case ndef.TNF_EXTERNAL_TYPE:
                // AAR contains strings, other types could
                // contain binary data
                result += "External";
                result += separator;
                result += s(record.type);
                result += separator;
                result += s(record.payload);
                break;
            default:
                result += s("Can't process TNF " + record.tnf);
        }

        result += separator;
        return result;
    },

    printWellKnown: function (record, separator) {

        var result = "";

        if (record.tnf !== ndef.TNF_WELL_KNOWN) {
            return "ERROR expecting TNF Well Known";
        }

        switch(record.type) {
            case ndef.RTD_TEXT:
                result += "Text Record";
                result += separator;
                result += (ndef.text.decodePayload(record.payload));
                break;
            case ndef.RTD_URI:
                result += "URI Record";
                result += separator;
                result += (ndef.uri.decodePayload(record.payload));
                break;
            case ndef.RTD_SMART_POSTER:
                result += "Smart Poster";
                result += separator;
                // the payload of a smartposter is a NDEF message
                result += stringifier.printRecords(ndef.decodeMessage(record.payload));
                break;
            default:
                // attempt to display other types
                result += record.type + " Record";
                result += separator;
                result += s(record.payload);
        }

        return result;
    }
};

// convert bytes to a String
function s(bytes) {
    return new Buffer(bytes).toString();
}

// expose helper objects
ndef.text = textHelper;
ndef.uri = uriHelper;
ndef.tnfToString = tnfToString;
ndef.util = util;
ndef.stringify = stringifier.stringify;

module.exports = ndef;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var exec = __webpack_require__(10);
var ndef = __webpack_require__(8);
var ndef_lib_1 = __webpack_require__(9);
function noop() {
    // empty
}
var Device = (function () {
    function Device(deviceId, batteryLevel, hardwareRevision, firmwareRevision, communicationStatus) {
        this.deviceId = deviceId;
        this.batteryLevel = batteryLevel;
        this.firmwareRevision = firmwareRevision;
        this.hardwareRevision = hardwareRevision;
        this.communicationStatus = communicationStatus;
    }
    return Device;
}());
exports.Device = Device;
var devices = [];
/**
 * Constructor
 */
module.exports = {
    init: function (success, failure) {
        exec(success, failure, 'FlomioPlugin', 'init', []);
    },
    selectDeviceType: function (deviceType, success, failure) {
        exec(success, failure, 'FlomioPlugin', 'selectDeviceType', [deviceType]);
        // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
        // "FloBLE-Plus" (case insensitive)
    },
    selectSpecificDeviceId: function (specificDeviceId, success, failure) {
        exec(success, failure, 'FlomioPlugin', 'selectSpecificDeviceId', [specificDeviceId]);
        // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
        // "FloBLE-Plus" (case insensitive)
    },
    setConfiguration: function (configurationDictionary, success, failure) {
        var configurationArray = [];
        var keyArray = ['scanPeriod', 'scanSound', 'readerState', 'powerOperation'];
        // convert dictionary to array
        for (var index in keyArray) {
            if (typeof configurationDictionary[keyArray[index]] === 'undefined') {
                configurationArray.push('unchanged');
            }
            else {
                configurationArray.push(configurationDictionary[keyArray[index]]);
            }
        }
        exec(success, failure, 'FlomioPlugin', 'setConfiguration', configurationArray);
    },
    getConfiguration: function (resultCallback, configurationDictionary, success, failure) {
        exec(function (scanPeriod, scanSound) {
            resultCallback({ scanPeriod: scanPeriod, scanSound: scanSound });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.getConfiguration: ' + failure);
        }, 'FlomioPlugin', 'getConfiguration', []);
    },
    stopReaders: function (resultCallback, success, failure) {
        exec(
        // TODO: deviceId
        function (scanPeriod, scanSound) {
            resultCallback({ deviceId: undefined });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.stopReaders: ' + failure);
        }, 'FlomioPlugin', 'stopReaders', []);
    },
    sleepReaders: function (resultCallback, success, failure) {
        exec(noop, function (failure) {
            console.log('ERROR: FlomioPlugin.sleepReaders: ' + failure);
        }, 'FlomioPlugin', 'sleepReaders', []);
    },
    startReaders: function (resultCallback, success, failure) {
        exec(noop, function (failure) {
            console.log('ERROR: FlomioPlugin.startReaders: ' + failure);
        }, 'FlomioPlugin', 'startReaders', []);
    },
    sendApdu: function (resultCallback, deviceId, apdu, success, failure) {
        console.log('in send apdu: ' + apdu + ' device: ' + deviceId);
        return new Promise(function (resolve, reject) {
            exec(function (deviceId, responseApdu) {
                console.log('In response apdu: ' + responseApdu);
                resolve(responseApdu);
                resultCallback({ deviceId: deviceId, responseApdu: responseApdu });
            }, function (failure) {
                console.log('ERROR: FlomioPlugin.sendApdu: ' + failure);
            }, 'FlomioPlugin', 'sendApdu', [deviceId, apdu]);
        });
    },
    // Delegate/Event Listeners
    addConnectedDevicesListener: function (resultCallback, success, failure) {
        exec(function (device) {
            // alert(JSON.stringify(device));
            var deviceId = device['Device ID'];
            var batteryLevel = device['Battery Level'];
            var hardwareRevision = device['Hardware Revision'];
            var firmwareRevision = device['Firmware Revision'];
            var communicationStatus = device['Communication Status'];
            var newDevice = new Device(deviceId, batteryLevel, hardwareRevision, firmwareRevision, communicationStatus);
            devices.push(newDevice);
            resultCallback(device);
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addConnectedDevicesListener: ' + failure);
        }, 'FlomioPlugin', 'setConnectedDevicesUpdateCallback', []);
    },
    addTagStatusChangeListener: function (resultCallback, success, failure) {
        exec(function (deviceId, status) {
            resultCallback({ deviceId: deviceId, status: status });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addTagStatusChangeListener: ' + failure);
        }, 'FlomioPlugin', 'setCardStatusChangeCallback', []);
    },
    addTagDiscoveredListener: function (resultCallback, success, failure) {
        exec(function (deviceId, tagUid, tagAtr) {
            resultCallback({ tagUid: tagUid, tagAtr: tagAtr, deviceId: deviceId });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addTagDiscoveredListener: ' + failure);
        }, 'FlomioPlugin', 'setTagDiscoveredCallback', []);
    },
    addNdefListener: function (resultCallback, success, failure) {
        function hexToBytes(hex) {
            var bytes = [];
            for (var c = 0; c < hex.length; c += 2) {
                bytes.push(parseInt(hex.substr(c, 2), 16));
            }
            return bytes;
        }
        function formatRecord(record) {
            console.log('formatRecorde', record);
            // TODO: update ndef module
            var formatted = ndef.record(record.tnf, hexToBytes(record.type), hexToBytes(record.id), hexToBytes(record.payload));
            return formatted;
        }
        exec(function (ndefMessage) {
            console.log('ndefMessage', ndefMessage);
            resultCallback({ ndefMessage: ndefMessage.map(formatRecord) });
        }, function (failure) {
            console.log('ERROR: FlomioPlugin.addNdefListener: ' + failure);
        }, 'FlomioPlugin', 'setNdefDiscoveredCallback', []);
    },
    writeNdef: function (resultCallback, deviceId, ndefMessage) {
        console.log('writeNdef');
        console.log(deviceId);
        var bytes = ndef.encodeMessage(ndefMessage);
        console.log('bytes' + bytes);
        var hexString = util.bytesToHexString(bytes);
        console.log('hexString' + hexString);
        this.write(resultCallback, deviceId, hexString);
    },
    write: function (resultCallback, deviceId, dataHexString, success, failure) {
        // var apdus = []
        var hex = ndef.tlvEncodeNdef(dataHexString);
        var apduStrings = ndef.makeWriteApdus(hex, 4);
        var fullResponse = '';
        var apdus = [];
        for (var i in apduStrings) {
            // store each sendApdu promise
            console.log(apduStrings[i]);
            apdus.push(this.sendApdu(noop, deviceId, apduStrings[i]).then(function (responseApdu) {
                console.log('response apdu: ' + responseApdu);
                fullResponse = fullResponse.concat(responseApdu.slice(0, -5));
            }, function (err) {
                console.error(err);
            }));
        }
        // send all apdus and capture result
        Promise.all(apdus).then(function () {
            console.log('fullResponse: ' + fullResponse);
        }, function (reason) {
            console.log(reason);
        });
    },
    launchNativeNfc: function (success, failure) {
        // exec(success, failure, 'FlomioPlugin', 'launchNativeNfc', [])
        return new Promise(function (resolve, reject) {
            exec(success, function (failure) {
                reject();
                console.log('ERROR: FlomioPlugin.launchNativeNfc: ' + failure);
            }, 'FlomioPlugin', 'launchNativeNfc', []);
        });
    },
    readNdef: function (resultCallback, deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var fullResponse, apdus, numberOfPages, capabilityContainer, length_1, numberOfBytes, parser, messages, page, n, apdu, response, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fullResponse = '';
                        apdus = [];
                        return [4 /*yield*/, this.readCapabilityContainer(devices[0].deviceId)];
                    case 1:
                        capabilityContainer = _a.sent();
                        capabilityContainer = util.removeSpaces(capabilityContainer);
                        if (capabilityContainer.substring(0, 2) === 'E1') {
                            length_1 = parseInt(capabilityContainer.substring(4, 6), 16);
                            console.log('capabilityContainer: ' + capabilityContainer);
                            console.log('length: ' + length_1);
                            numberOfBytes = length_1 * 8;
                            numberOfPages = numberOfBytes / 4;
                            console.log('number of pages: ' + numberOfPages);
                            // E1 00 byteSize (divided by 8) 00... eg E1 10 06 00 = 48 bytes
                            // length * 8 = number of bytes
                            // number of bytes / 4 = number of pages
                        }
                        else {
                            console.log('capabilityContainer not formatted correctly');
                        }
                        parser = new ndef_lib_1.PushParser();
                        messages = [];
                        parser.on('record', function (record) {
                            messages.push(record);
                        });
                        parser.on('messageEnd', function () {
                            console.log('messageEnd');
                            resultCallback({ ndefMessage: messages });
                        });
                        page = 4;
                        _a.label = 2;
                    case 2:
                        if (!(page <= numberOfPages)) return [3 /*break*/, 5];
                        n = '';
                        page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16);
                        apdu = 'FFB000' + n + '10';
                        return [4 /*yield*/, this.sendApdu(noop, devices[0].deviceId, apdu)];
                    case 3:
                        response = _a.sent();
                        buffer = util.responseToBuffer(response);
                        parser.push(buffer);
                        _a.label = 4;
                    case 4:
                        page += 4;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    readPage: function (deviceId, page) {
        return __awaiter(this, void 0, void 0, function () {
            var n, apdu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        n = '';
                        page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16);
                        apdu = 'FFB000' + n + '10';
                        console.log('read page: ' + page + ' command APDU: ' + apdu + ' device id: ' + deviceId);
                        return [4 /*yield*/, this.sendApdu(noop, deviceId, apdu)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    readCapabilityContainer: function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('readCapabilityContainer ' + deviceId);
                        return [4 /*yield*/, this.readPage(deviceId, 3)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    determineMaximumTranceiveLength: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userMemory, page, response, totalMemory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = 4;
                        _a.label = 1;
                    case 1:
                        if (!(page < 256)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.readPage(this.deviceId, page)];
                    case 2:
                        response = _a.sent();
                        console.log('determineTagSize response: ' + response + 'page: ' + page);
                        if ((response === '63 00') || (response.length <= 5)) {
                            console.log('size ==' + page);
                            totalMemory = page * this.BYTES_PER_PAGE;
                            userMemory = totalMemory - (this.BYTES_PER_PAGE * 4);
                            console.log('USER MEMORY: ' + userMemory);
                            return [3 /*break*/, 4];
                        }
                        _a.label = 3;
                    case 3:
                        page += 2;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, userMemory];
                }
            });
        });
    },
    formatCapabilityContainer: function () {
        return __awaiter(this, void 0, void 0, function () {
            var userMemory, valueForCapabilityContainer, n, apdu, response, verify;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.determineMaximumTranceiveLength()];
                    case 1:
                        userMemory = _a.sent();
                        if (!userMemory) return [3 /*break*/, 4];
                        valueForCapabilityContainer = userMemory / 8;
                        n = '';
                        valueForCapabilityContainer >= 16 ? n = '' + valueForCapabilityContainer.toString(16) : n = '0' + valueForCapabilityContainer.toString(16);
                        apdu = 'FFD6000304' + 'E110' + n + '00';
                        return [4 /*yield*/, this.sendApdu(this.deviceId, apdu)];
                    case 2:
                        response = _a.sent();
                        console.log('response to apdu: ' + apdu + ' response: ' + response);
                        return [4 /*yield*/, this.checkIfTagFormatted()];
                    case 3:
                        verify = _a.sent();
                        console.log('tag formatted' + verify.valueOf);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    checkIfTagFormatted: function () {
        return __awaiter(this, void 0, void 0, function () {
            var capabilityContainer, currentTagSizeString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.readCapabilityContainer()];
                    case 1:
                        capabilityContainer = _a.sent();
                        if (capabilityContainer.slice(0, 2) === 'E1') {
                            currentTagSizeString = capabilityContainer.slice(4, 6);
                            console.log('currentTagSize: ' + currentTagSizeString + ' * 8');
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
};
// export function tlvEncodeNdef (message: Buffer) {
//   // Add the ndef message type
//   const buffers: Buffer[] = [new Buffer([0x03])]
//   const length = message.length
//   if (length <= 0xFE) {
//     buffers.push(new Buffer([length]))
//   } else {
//     const length = Buffer.alloc(3)
//     length.writeUInt8(0xff, 0)
//     length.writeUInt16BE(message.length, 1)
//     buffers.push(length)
//   }
//   buffers.push(message)
//   // Add the terminator
//   buffers.push(new Buffer([0xFE]))
//   return Buffer.concat(buffers)
// }
// export function createWriteApdus (tagType: string, data: Buffer) {
//   assert.equal(tagType, 'mifareUltralight')
//   const slices = makeSlices(data, 4)
//   const userDataPageStarts = 4 //
//   return slices.map((slice, ix) => {
//     if (slice.length < 4) {
//       slice = Buffer.concat([slice, Buffer.alloc(4 - slice.length)])
//     }
//     return Buffer.concat([
//       new Buffer([0xFF, 0xD6, 0x00, userDataPageStarts + ix, 4]),
//       slice
//     ])
//   })
//     .map(b => b.toString('hex'))
// }
/**
 * See
 * https://github.com/chariotsolutions/phonegap-nfc/blob/master/www/phonegap-nfc.js
 * Below is from Phonegap-nfc to encode and decode ndef messages
 */
ndef.makeWriteApdus = function (dataHexString) {
    var sliceSize = 8;
    var slices = textHelper.makeSlices(dataHexString, sliceSize);
    var apdusStrings = slices.map(function (slice, i) {
        slice = slice.padEnd(sliceSize, '0'); // pads end of string if not 'sliceSize' chars long
        var page = i + 4;
        var n = page.toString(16);
        n = n.padStart(2, '0');
        var apdu = 'FFD600' + n + '04' + slice;
        return apdu;
    });
    return apdusStrings;
};
ndef.tlvEncodeNdef = function (message) {
    // Add the ndef message type
    console.log('tlvEncodeNdef');
    var ndefType = '03';
    var length = message.length / 2;
    var lengthString = length.toString(16);
    lengthString = lengthString.padStart(2, '0');
    // Add the ndef message terminator
    var terminator = 'FE';
    console.log('ndefType + length + message + terminator' + ndefType + lengthString + message + terminator);
    return ndefType + lengthString + message + terminator;
};
var util = {
    // i must be <= 256
    toHex: function (i) {
        var hex;
        if (i < 0) {
            i += 256;
        }
        hex = i.toString(16);
        // zero padding
        if (hex.length === 1) {
            hex = '0' + hex;
        }
        return hex;
    },
    toPrintable: function (i) {
        if (i >= 0x20 && i <= 0x7F) {
            return String.fromCharCode(i);
        }
        else {
            return '.';
        }
    },
    bytesToString: function (bytes) {
        // based on
        // http://ciaranj.blogspot.fr/2007/11/utf8-characters-encoding-in-javascript.html
        var result = '';
        var i;
        var c;
        var c1;
        var c2;
        var c3;
        i = c = c1 = c2 = c3 = 0;
        // Perform byte-order check.
        if (bytes.length >= 3) {
            if ((bytes[0] & 0xef) === 0xef && (bytes[1] & 0xbb) === 0xbb && (bytes[2] & 0xbf) === 0xbf) {
                // stream has a BOM at the start, skip over
                i = 3;
            }
        }
        while (i < bytes.length) {
            c = bytes[i] & 0xff;
            if (c < 128) {
                result += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                if (i + 1 >= bytes.length) {
                    throw new Error('Un-expected encoding error, UTF-8 stream truncated, or incorrect');
                }
                c2 = bytes[i + 1] & 0xff;
                result += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                if (i + 2 >= bytes.length || i + 1 >= bytes.length) {
                    throw new Error('Un-expected encoding error, UTF-8 stream truncated, or incorrect');
                }
                c2 = bytes[i + 1] & 0xff;
                c3 = bytes[i + 2] & 0xff;
                result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return result;
    },
    stringToBytes: function (str) {
        // based on
        // http://ciaranj.blogspot.fr/2007/11/utf8-characters-encoding-in-javascript.html
        var bytes = [];
        for (var n = 0; n < str.length; n++) {
            var c = str.charCodeAt(n);
            if (c < 128) {
                bytes[bytes.length] = c;
            }
            else if ((c > 127) && (c < 2048)) {
                bytes[bytes.length] = (c >> 6) | 192;
                bytes[bytes.length] = (c & 63) | 128;
            }
            else {
                bytes[bytes.length] = (c >> 12) | 224;
                bytes[bytes.length] = ((c >> 6) & 63) | 128;
                bytes[bytes.length] = (c & 63) | 128;
            }
        }
        return bytes;
    },
    hexStringToPrintableText: function (payload) {
        var hex = payload.toString(); // force conversion
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },
    bytesToHexString: function (bytes) {
        var dec;
        var hexstring;
        var bytesAsHexString = '';
        for (var i = 0; i < bytes.length; i++) {
            if (bytes[i] >= 0) {
                dec = bytes[i];
            }
            else {
                dec = 256 + bytes[i];
            }
            hexstring = dec.toString(16);
            // zero padding
            if (hexstring.length === 1) {
                hexstring = '0' + hexstring;
            }
            bytesAsHexString += hexstring;
        }
        return bytesAsHexString;
    },
    // This function can be removed if record.type is changed to a String
    /**
     * Returns true if the record's TNF and type matches the supplied TNF and
     * type.
     *
     * @record NDEF record
     * @tnf 3-bit TNF (Type Name Format) - use one of the TNF_* constants
     * @type byte array or String
     */
    isType: function (record, tnf, type) {
        if (record.tnf === tnf) {
            var recordType = void 0;
            if (typeof (type) === 'string') {
                recordType = type;
            }
            else {
                recordType = util.bytesToString(type);
            }
            return (util.bytesToString(record.type) === recordType);
        }
        return false;
    },
    responseToBuffer: function (response) {
        response = util.removeSpaces(response);
        response = response.slice(0, -4);
        return Buffer.from(response, 'hex');
    },
    removeSpaces: function (stringWithSpaces) {
        return stringWithSpaces.replace(/\s/g, '');
    }
};
// this is a module in ndef-js
var textHelper = {
    decodePayload: function (data) {
        var languageCodeLength = (data[0] & 0x3F); // 6 LSBs
        var languageCode = data.slice(1, 1 + languageCodeLength);
        var utf16 = (data[0] & 0x80) !== 0; // assuming UTF-16BE
        // TODO need to deal with UTF in the future
        // console.log("lang " + languageCode + (utf16 ? " utf16" : " utf8"));
        return util.bytesToString(data.slice(languageCodeLength + 1));
    },
    // encode text payload
    // @returns an array of bytes
    encodePayload: function (text, lang, encoding) {
        // ISO/IANA language code, but we're not enforcing
        if (!lang) {
            lang = 'en';
        }
        var encoded = util.stringToBytes(lang + text);
        encoded.unshift(lang.length);
        return encoded;
    },
    makeSlices: function (data, pageSize) {
        var result = [];
        for (var i = 0; i < data.length; i += pageSize) {
            result.push(data.slice(i, i + pageSize));
        }
        return result;
    }
};
var BYTES_PER_PAGE = 4;
var deviceId = ''; // reference to first connected device
// this is a module in ndef-js
var uriHelper = {
    // URI identifier codes from URI Record Type Definition
    // NFCForum-TS-RTD_URI_1.0 2006-07-24 index in array matches code in the spec
    protocols: ['', 'http://www.', 'https://www.', 'http://', 'https://', 'tel:', 'mailto:', 'ftp://anonymous:anonymous@', 'ftp://ftp.', 'ftps://', 'sftp://', 'smb://', 'nfs://', 'ftp://', 'dav://', 'news:', 'telnet://', 'imap:', 'rtsp://', 'urn:', 'pop:', 'sip:', 'sips:', 'tftp:', 'btspp://', 'btl2cap://', 'btgoep://', 'tcpobex://', 'irdaobex://', 'file://', 'urn:epc:id:', 'urn:epc:tag:', 'urn:epc:pat:', 'urn:epc:raw:', 'urn:epc:', 'urn:nfc:'],
    // decode a URI payload bytes
    // @returns a string
    decodePayload: function (data) {
        var prefix = uriHelper.protocols[data[0]];
        if (!prefix) {
            prefix = '';
        }
        return prefix + util.bytesToString(data.slice(1));
    },
    // shorten a URI with standard prefix
    // @returns an array of bytes
    encodePayload: function (uri) {
        var prefix;
        var protocolCode;
        var encoded;
        // check each protocol, unless we've found a match
        // "urn:" is the one exception where we need to keep checking
        // slice so we don't check ""
        uriHelper.protocols.slice(1).forEach(function (protocol) {
            if ((!prefix || prefix === 'urn:') && uri.indexOf(protocol) === 0) {
                prefix = protocol;
            }
        });
        if (!prefix) {
            prefix = '';
        }
        encoded = util.stringToBytes(uri.slice(prefix.length));
        protocolCode = uriHelper.protocols.indexOf(prefix);
        // prepend protocol code
        encoded.unshift(protocolCode);
        return encoded;
    }
};
module.exports.ndef = ndef;
module.exports.util = util;
// textHelper and uriHelper aren't exported, add a property
ndef.uriHelper = uriHelper;
ndef.textHelper = textHelper;
// create aliases
// util.bytesToString = util.bytesToString;
// util.stringToBytes = util.stringToBytes;
// util.bytesToHexString = util.bytesToHexString;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 19 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(20);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(19);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(2)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __webpack_require__(6);
var consts_1 = __webpack_require__(4);
function makeSlices(data, pageSize) {
    if (pageSize === void 0) { pageSize = 4; }
    var result = [];
    for (var i = 0; i < data.length; i += pageSize) {
        result.push(data.slice(i, i + pageSize));
    }
    return result;
}
exports.makeSlices = makeSlices;
function tlvDecodeNdef(userData) {
    var t = userData.readUInt8(0);
    assert.equal(t, 0x03);
    var length = userData.readUInt8(1);
    var starts = 2;
    if (length === 0xFF) {
        length = userData.readUInt16BE(2);
        starts = 4;
    }
    return userData.slice(starts, starts + length);
}
exports.tlvDecodeNdef = tlvDecodeNdef;
function tlvEncodeNdef(message) {
    // Add the ndef message type
    var buffers = [new Buffer([consts_1.MESSAGE_START_TAG])];
    var length = message.length;
    if (length <= 0xFE) {
        buffers.push(Buffer.from([length]));
    }
    else {
        var length_1 = Buffer.alloc(3);
        length_1.writeUInt8(0xff, 0);
        length_1.writeUInt16BE(message.length, 1);
        buffers.push(length_1);
    }
    buffers.push(message);
    // Add the terminator
    buffers.push(Buffer.from([consts_1.MESSAGE_STOP_BYTE]));
    return Buffer.concat(buffers);
}
exports.tlvEncodeNdef = tlvEncodeNdef;
function createWriteApdus(tagType, data) {
    assert.equal(tagType, 'mifareUltralight');
    var slices = makeSlices(data, 4);
    var userDataPageStarts = 4; //
    return slices.map(function (slice, ix) {
        if (slice.length < 4) {
            slice = Buffer.concat([slice, Buffer.alloc(4 - slice.length)]);
        }
        return Buffer.concat([
            new Buffer([0xFF, 0xD6, 0x00, userDataPageStarts + ix, 4]),
            slice
        ]);
    });
}
exports.createWriteApdus = createWriteApdus;
//# sourceMappingURL=apdu-helpers.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util = __webpack_require__(5);
// decode text bytes from ndef record payload
// @returns a string
function decodePayload(data) {
    var // 6 LSBs
    languageCodeLength = (data[0] & 0x3F); // assuming UTF-16BE
    // TODO need to deal with UTF in the future
    // console.log("lang " + languageCode + (utf16 ? " utf16" : " utf8"));
    var languageCode = data.slice(1, 1 + languageCodeLength);
    var utf16 = (data[0] & 0x80) !== 0;
    return util.bytesToString(data.slice(languageCodeLength + 1));
}
exports.decodePayload = decodePayload;
// encode text payload
// @returns an array of bytes
function encodePayload(text, lang, encoding) {
    // ISO/IANA language code, but we're not enforcing
    if (!lang) {
        lang = 'en';
    }
    var encoded = util.stringToBytes(lang + text);
    encoded.unshift(lang.length);
    return encoded;
}
exports.encodePayload = encodePayload;
//# sourceMappingURL=ndef-text.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var util = __webpack_require__(5);
// URI identifier codes from URI Record Type Definition NFCForum-TS-RTD_URI_1.0 2006-07-24
// index in array matches code in the spec
var protocols = ['', 'http://www.', 'https://www.', 'http://', 'https://', 'tel:', 'mailto:', 'ftp://anonymous:anonymous@', 'ftp://ftp.', 'ftps://', 'sftp://', 'smb://', 'nfs://', 'ftp://', 'dav://', 'news:', 'telnet://', 'imap:', 'rtsp://', 'urn:', 'pop:', 'sip:', 'sips:', 'tftp:', 'btspp://', 'btl2cap://', 'btgoep://', 'tcpobex://', 'irdaobex://', 'file://', 'urn:epc:id:', 'urn:epc:tag:', 'urn:epc:pat:', 'urn:epc:raw:', 'urn:epc:', 'urn:nfc:'];
// decode a URI payload bytes
// @returns a string
function decodePayload(data) {
    var prefix = protocols[data[0]];
    if (!prefix) {
        prefix = '';
    }
    return prefix + util.bytesToString(data.slice(1));
}
exports.decodePayload = decodePayload;
// shorten a URI with standard prefix
// @returns an array of bytes
function encodePayload(uri) {
    var prefix;
    // check each protocol, unless we've found a match
    // "urn:" is the one exception where we need to keep checking
    // slice so we don't check ""
    var protocolCode;
    var encoded;
    protocols.slice(1).forEach(function (protocol) {
        if ((!prefix || prefix === 'urn:') && uri.indexOf(protocol) === 0) {
            prefix = protocol;
        }
    });
    if (!prefix) {
        prefix = '';
    }
    encoded = util.stringToBytes(uri.slice(prefix.length));
    protocolCode = protocols.indexOf(prefix);
    // prepend protocol code
    encoded.unshift(protocolCode);
    return encoded;
}
exports.encodePayload = encodePayload;
//# sourceMappingURL=ndef-uri.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events = __webpack_require__(12);
var assert = __webpack_require__(6);
var ndef_1 = __webpack_require__(7);
var ParseState;
(function (ParseState) {
    ParseState[ParseState["expectingStopByte"] = 0] = "expectingStopByte";
    ParseState[ParseState["expectingPayload"] = 1] = "expectingPayload";
    ParseState[ParseState["expectingId"] = 2] = "expectingId";
    ParseState[ParseState["expectingType"] = 3] = "expectingType";
    ParseState[ParseState["expectingIdLength"] = 4] = "expectingIdLength";
    ParseState[ParseState["expectingPayloadLengthFourByte"] = 5] = "expectingPayloadLengthFourByte";
    ParseState[ParseState["expectingPayloadLengthOneByte"] = 6] = "expectingPayloadLengthOneByte";
    ParseState[ParseState["expectingTypeLength"] = 7] = "expectingTypeLength";
    ParseState[ParseState["expectingTag"] = 8] = "expectingTag";
    ParseState[ParseState["expectingLength"] = 9] = "expectingLength";
    ParseState[ParseState["expectingValue"] = 10] = "expectingValue";
})(ParseState = exports.ParseState || (exports.ParseState = {}));
function decodeTnf(tnf_byte) {
    return {
        mb: (tnf_byte & 0x80) !== 0,
        me: (tnf_byte & 0x40) !== 0,
        cf: (tnf_byte & 0x20) !== 0,
        sr: (tnf_byte & 0x10) !== 0,
        il: (tnf_byte & 0x8) !== 0,
        tnf: (tnf_byte & 0x7)
    };
}
var PushParser = (function (_super) {
    __extends(PushParser, _super);
    function PushParser(initialState) {
        if (initialState === void 0) { initialState = ParseState.expectingTag; }
        var _this = _super.call(this) || this;
        _this.buffers = [];
        _this.cursor = 0;
        _this.currentCursor = 0;
        _this.totalLength = 0;
        _this.currentBuffer = 0;
        _this.state = initialState;
        return _this;
    }
    Object.defineProperty(PushParser.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (v) {
            // console.log('setting state', v, {
            //   payloadLength: this.payloadLength,
            //   typeLength: this.typeLength,
            //   idLength: this.idLength
            // })
            this._state = v;
        },
        enumerable: true,
        configurable: true
    });
    PushParser.prototype.push = function (buffer) {
        this.pushBuffer(buffer);
        this.process();
    };
    PushParser.prototype.getState = function () {
        return this.state;
    };
    PushParser.prototype.process = function () {
        var self = this;
        // noinspection FallThroughInSwitchStatementJS
        if (self.state === ParseState.expectingTag) {
            if (self.canRead(1)) {
                var tag = self.readUint8();
                if (tag === 0x03) {
                    self.state = ParseState.expectingLength;
                    self.emit('foundNdefTag');
                }
                else {
                    self.emit('skipping');
                    // self.process()
                }
            }
        }
        if (self.state === ParseState.expectingLength) {
            if (self.canRead(3)) {
                var length_1 = self.readUint8();
                if (length_1 === 0xFF) {
                    length_1 = self.readUint16BE();
                    self.expectedLength = length_1;
                }
                self.state = ParseState.expectingValue;
            }
            else {
                return;
            }
        }
        if (self.state === ParseState.expectingValue) {
            if (self.canRead(1)) {
                var tnf_byte = self.readUint8();
                var header = decodeTnf(tnf_byte);
                self.header = header;
                self.state = ParseState.expectingTypeLength;
                if (header.mb) {
                    self.emit('messageBegin');
                }
            }
        }
        if (self.state === ParseState.expectingTypeLength) {
            if (self.canRead(1)) {
                self.typeLength = self.readUint8();
                if (self.header.sr) {
                    self.state = ParseState.expectingPayloadLengthOneByte;
                }
                else {
                    self.state = ParseState.expectingPayloadLengthFourByte;
                }
            }
        }
        if (self.state === ParseState.expectingPayloadLengthOneByte) {
            if (self.canRead(1)) {
                self.payloadLength = self.readUint8();
                self.state = ParseState.expectingIdLength;
            }
        }
        if (self.state === ParseState.expectingPayloadLengthFourByte) {
            if (self.canRead(4)) {
                self.payloadLength = self.readUint32BE();
                self.state = ParseState.expectingIdLength;
            }
        }
        if (self.state === ParseState.expectingIdLength) {
            if (self.header.il) {
                if (self.canRead(1)) {
                    self.idLength = self.readUint8();
                    self.state = ParseState.expectingType;
                }
            }
            else {
                self.idLength = 0;
                self.state = ParseState.expectingType;
            }
        }
        if (self.state === ParseState.expectingType) {
            if (self.canRead(self.typeLength)) {
                self.typeBytes = self.read(self.typeLength);
                self.state = ParseState.expectingId;
            }
        }
        if (self.state === ParseState.expectingId) {
            if (self.canRead(self.idLength)) {
                self.idBytes = self.read(self.idLength);
                self.state = ParseState.expectingPayload;
            }
        }
        if (self.state === ParseState.expectingPayload) {
            if (self.canRead(self.payloadLength)) {
                self.payloadBytes = self.read(self.payloadLength);
                self.emit('record', self.getRecord());
                if (!self.header.me) {
                    self.state = ParseState.expectingValue;
                    self.process();
                }
                else {
                    self.emit('messageEnd');
                    self.state = ParseState.expectingStopByte;
                }
            }
        }
        if (self.state == ParseState.expectingStopByte) {
            if (this.canRead(1)) {
            }
            // go to next ...
        }
        // noinspection FallThroughInSwitchStatementJS
    };
    PushParser.prototype.getRecord = function () {
        // TODO: use bytes
        var getBytes = function (buf) { return buf.toJSON().data; };
        return ndef_1.record(this.header.tnf, getBytes(this.typeBytes), getBytes(this.idBytes), getBytes(this.payloadBytes));
    };
    PushParser.prototype.pushBuffer = function (buffer) {
        this.buffers.push(buffer);
        this.totalLength += buffer.length;
    };
    PushParser.prototype.canRead = function (n) {
        return (this.cursor + n) <= this.totalLength;
    };
    PushParser.prototype.read = function (n) {
        // cursor is zero based indexing, so cursor + n should be less than total
        assert(this.canRead(n));
        if (n === 0) {
            return Buffer.alloc(0);
        }
        this.cursor += n;
        var buffers = [];
        while (n > this.availableInTopBuffer()) {
            var current = this.current();
            var buf = this.currentCursor !== 0 ?
                // take what's left of the current buffer
                current.slice(this.currentCursor) :
                // take the whole buffer
                current;
            buffers.push(buf);
            n -= buf.length;
            this.currentBuffer++;
            this.currentCursor = 0;
        }
        if (n) {
            // Take part
            buffers.push(this.current().slice(this.currentCursor, this.currentCursor + n));
            this.currentCursor += n;
        }
        return Buffer.concat(buffers);
    };
    PushParser.prototype.readUint32BE = function () {
        var buf = this.read(4);
        return buf.readUInt32BE(0);
    };
    PushParser.prototype.readUint8 = function () {
        var buf = this.read(1);
        return buf.readUInt8(0);
    };
    PushParser.prototype.availableInTopBuffer = function () {
        return this.current().length - this.currentCursor;
    };
    PushParser.prototype.current = function () {
        return this.buffers[this.currentBuffer];
    };
    PushParser.prototype.readUint16BE = function () {
        var buf = this.read(2);
        return buf.readUInt16BE(0);
    };
    PushParser.prototype.finishedMessage = function () {
        return this.state === ParseState.expectingStopByte;
    };
    return PushParser;
}(events.EventEmitter));
exports.PushParser = PushParser;
//# sourceMappingURL=push-parser.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0).Buffer))

/***/ })
/******/ ])));