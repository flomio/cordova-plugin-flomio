const exec = require('cordova/exec')
const ndef = require('ndef')

function noop () {
  // empty
}

/**
 * Constructor
 */
module.exports = {
  init: (success, failure) => {
    exec(success, failure, 'FlomioPlugin', 'init', [])
  },

  selectDeviceType: (deviceType, success, failure) => {
    exec(success, failure, 'FlomioPlugin', 'selectDeviceType', [deviceType])
    // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
    // "FloBLE-Plus" (case insensitive)
  },

  selectSpecificDeviceId: (specificDeviceId, success, failure) => {
    exec(success, failure, 'FlomioPlugin', 'selectSpecificDeviceId', [specificDeviceId])
    // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
    // "FloBLE-Plus" (case insensitive)
  },

  setConfiguration: (configurationDictionary, success, failure) => {
    const configurationArray = []
    const keyArray = ['scanPeriod', 'scanSound', 'readerState', 'powerOperation']
    // convert dictionary to array
    for (const index in keyArray) {
      if (typeof configurationDictionary[keyArray[index]] === 'undefined') {
        configurationArray.push('unchanged')
      } else {
        configurationArray.push(configurationDictionary[keyArray[index]])
      }
    }
    exec(success, failure, 'FlomioPlugin', 'setConfiguration', configurationArray)
  },

  getConfiguration: (resultCallback, configurationDictionary, success, failure) => {
    exec(
      (scanPeriod, scanSound) => {
        resultCallback({scanPeriod: scanPeriod, scanSound: scanSound})
      },
      (failure) => {
        console.log('ERROR: FlomioPlugin.getConfiguration: ' + failure)
      },
      'FlomioPlugin', 'getConfiguration', [])
  },

  stopReaders: (resultCallback, success, failure) => {
    exec(
      // TODO: deviceId
      (scanPeriod, scanSound) => {
        resultCallback({deviceId: undefined})
      },
      (failure) => {
        console.log('ERROR: FlomioPlugin.stopReaders: ' + failure)
      },
      'FlomioPlugin', 'stopReaders', [])
  },

  sleepReaders: (resultCallback, success, failure) => {
    exec(
      noop,
      (failure) => {
        console.log('ERROR: FlomioPlugin.sleepReaders: ' + failure)
      },
      'FlomioPlugin', 'sleepReaders', [])
  },

  startReaders: (resultCallback, success, failure) => {
    exec(
      noop,
      (failure) => {
        console.log('ERROR: FlomioPlugin.startReaders: ' + failure)
      },
      'FlomioPlugin', 'startReaders', [])
  },

  sendApdu: (resultCallback, deviceId, apdu, success, failure) => {
    return new Promise((resolve, reject) => {
      exec(
        (deviceId, responseApdu) => {
          resultCallback({deviceId: deviceId, responseApdu: responseApdu})
          resolve(responseApdu)
        },
        (failure) => {
          console.log('ERROR: FlomioPlugin.sendApdu: ' + failure)
        },
        'FlomioPlugin', 'sendApdu', [deviceId, apdu])
    })
  },

  // Delegate/Event Listeners
  addConnectedDevicesListener: (resultCallback, success, failure) => {
    exec(
      (deviceIdList) => {
        resultCallback(deviceIdList)
      },
      (failure) => {
        console.log('ERROR: FlomioPlugin.addConnectedDevicesListener: ' + failure)
      },
      'FlomioPlugin', 'setConnectedDevicesUpdateCallback', [])
  },

  addTagStatusChangeListener: (resultCallback, success, failure) => {
    exec(
      (deviceId, status) => {
        resultCallback({deviceId: deviceId, status: status})
      },
      (failure) => {
        console.log('ERROR: FlomioPlugin.addTagStatusChangeListener: ' + failure)
      },
      'FlomioPlugin', 'setCardStatusChangeCallback', [])
  },

  addTagDiscoveredListener: (resultCallback, success, failure) => {
    exec(
      (deviceId, tagUid, tagAtr) => {
        resultCallback({tagUid: tagUid, tagAtr: tagAtr, deviceId: deviceId})
      },
      (failure) => {
        console.log('ERROR: FlomioPlugin.addTagDiscoveredListener: ' + failure)
      },
      'FlomioPlugin', 'setTagDiscoveredCallback', [])
  },

  addNdefListener: function (resultCallback, success, failure) { // ios 11
    function hexToBytes (hex) {
      let bytes = []
      for (let c = 0; c < hex.length; c += 2) {
        bytes.push(parseInt(hex.substr(c, 2), 16))
      }
      return bytes
    }

    function formatRecord (record) {
      console.log('formatRecorde', record)

      // TODO: update ndef module
      const formatted = ndef.record(record.tnf,
        hexToBytes(record.type),
        hexToBytes(record.id),
        hexToBytes(record.payload)
      )
      return formatted
    }

    exec(
      (ndefMessage) => {
        console.log('ndefMessage', ndefMessage)
        resultCallback({ndefMessage: ndefMessage.map(formatRecord)})
      },
      (failure) => {
        console.log('ERROR: FlomioPlugin.addNdefListener: ' + failure)
      },
      'FlomioPlugin', 'setNdefDiscoveredCallback', [])
  },

  // readPage: (resultCallback, deviceId, page, success, failure) => {
  //   let n = ''
  //   page > 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16)
  //   const apdu = 'FFB000' + n + '10'
  //   return this.sendApdu(noop, deviceId, apdu).then((responseApdu) => {
  //       console.log('response apdu: ' + responseApdu)
  //     }, (err) => {
  //       console.error(err)
  //   })
  // },

  // formatCapibilityContainer: (resultCallback, deviceId, success, failure) => {
  //   const capibilityContainer = this.readPage(noop, deviceId, '03')
  //   console.log('capibilityContainer:' + capibilityContainer);
  // },

  readNdef: function (resultCallback, deviceId) {
    let fullResponse = ''
    const apdus = []
    for (let page = 4; page < 16; page += 4) {
      let n = ''
      page > 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16)
      const apdu = 'FFB000' + n + '10'

      // store each sendApdu promise
      apdus.push(this.sendApdu(noop, deviceId, apdu).then((responseApdu) => {
        console.log('response apdu: ' + responseApdu)
        fullResponse = fullResponse.concat(responseApdu.slice(0, -5))
      }, (err) => {
        console.error(err)
      }))
    }

    // send all apdus and capture result
    Promise.all(apdus).then(function () {
      // console.log('fullResponse: ' + fullResponse)
      resultCallback(fullResponse)
      fullResponse = fullResponse.replace(/\s/g, '') // remove spaces
      if (fullResponse.substring(0, 2) === '03') {
        const i = fullResponse.indexOf('FE')
        // console.log('index fe: ' + i)
        fullResponse = fullResponse.substring(3, i)
        // console.log('fullResponse: ' + fullResponse)
        const data = util.stringToBytes(fullResponse)
        // console.log('data: ' + data)
        // console.log('fullResponse before fe: ' + fullResponse)
        const resp = ndef.decodeMessage(data)
        // console.log('resp: ' + JSON.stringify(resp))
      }
    }, reason => {
      console.log(reason)
    })
  },

  writeNdef: function (resultCallback, deviceId, ndefMessage) {
    console.log('writeNdef')
    console.log(deviceId)
    const bytes = ndef.encodeMessage(ndefMessage)
    console.log('bytes' + bytes)
    const hexString = util.bytesToHexString(bytes)
    console.log('hexString' + hexString)
    this.write(resultCallback, deviceId, hexString)
  },

  write: function (resultCallback, deviceId, dataHexString, success, failure) {
    // var apdus = []
    var hex = ndef.tlvEncodeNdef(dataHexString)
    const apduStrings = ndef.makeWriteApdus(hex, 4)
  
    let fullResponse = ''
    const apdus = []
    for (let i in apduStrings) {
      // store each sendApdu promise
      console.log(apduStrings[i])
      apdus.push(this.sendApdu(noop, deviceId, apduStrings[i]).then((responseApdu) => {
        console.log('response apdu: ' + responseApdu)
        fullResponse = fullResponse.concat(responseApdu.slice(0, -5))
      }, (err) => {
        console.error(err)
      }))
    }

    // send all apdus and capture result
    Promise.all(apdus).then(function () {
      console.log('fullResponse: ' + fullResponse)
    }, reason => {
      console.log(reason)
    })
  },

  launchNativeNfc: (success, failure) => {
    // exec(success, failure, 'FlomioPlugin', 'launchNativeNfc', [])
    return new Promise((resolve, reject) => {
      exec(
        success,
        (failure) => {
          reject()
          console.log('ERROR: FlomioPlugin.launchNativeNfc: ' + failure)
        },
        'FlomioPlugin', 'launchNativeNfc', [])
    })
  }
}

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
  const sliceSize = 8;
  const slices = textHelper.makeSlices(dataHexString, sliceSize)
  const apdusStrings = slices.map((slice, i) => {
    slice = slice.padEnd(sliceSize, '0') // pads end of string if not 'sliceSize' chars long
    let page = i + 4
    let n = page.toString(16)
    n = (n as any).padStart(2, '0')
    let apdu = 'FFD600' + n + '04' + slice
    return apdu
  }) 
  return apdusStrings
}

ndef.tlvEncodeNdef = function (message) {
  // Add the ndef message type
  console.log('tlvEncodeNdef')
  const ndefType = '03'
  const length = message.length / 2
  let lengthString = length.toString(16)
  lengthString = (lengthString as any).padStart(2, '0')
  // Add the ndef message terminator
  const terminator = 'FE'
  console.log('ndefType + length + message + terminator' + ndefType + lengthString + message + terminator)
  return ndefType + lengthString + message + terminator
}

const util = {
  // i must be <= 256
  toHex: function (i) {
    let hex

    if (i < 0) {
      i += 256
    }

    hex = i.toString(16)

    // zero padding
    if (hex.length === 1) {
      hex = '0' + hex
    }

    return hex
  },

  toPrintable: function (i) {
    if (i >= 0x20 && i <= 0x7F) {
      return String.fromCharCode(i)
    } else {
      return '.'
    }
  },

  bytesToString: function (bytes) {
    // based on
    // http://ciaranj.blogspot.fr/2007/11/utf8-characters-encoding-in-javascript.html

    let result = ''
    let i
    let c
    let c1
    let c2
    let c3
    i = c = c1 = c2 = c3 = 0

    // Perform byte-order check.
    if (bytes.length >= 3) {
      if ((bytes[0] & 0xef) === 0xef && (bytes[1] & 0xbb) === 0xbb && (bytes[2] & 0xbf) === 0xbf) {
        // stream has a BOM at the start, skip over
        i = 3
      }
    }

    while (i < bytes.length) {
      c = bytes[i] & 0xff

      if (c < 128) {

        result += String.fromCharCode(c)
        i++

      } else if ((c > 191) && (c < 224)) {

        if (i + 1 >= bytes.length) {
          throw new Error('Un-expected encoding error, UTF-8 stream truncated, or incorrect')
        }
        c2 = bytes[i + 1] & 0xff
        result += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2

      } else {

        if (i + 2 >= bytes.length || i + 1 >= bytes.length) {
          throw new Error('Un-expected encoding error, UTF-8 stream truncated, or incorrect')
        }
        c2 = bytes[i + 1] & 0xff
        c3 = bytes[i + 2] & 0xff
        result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3

      }
    }
    return result
  },

  stringToBytes: function (str) {
    // based on
    // http://ciaranj.blogspot.fr/2007/11/utf8-characters-encoding-in-javascript.html

    const bytes = []

    for (let n = 0; n < str.length; n++) {

      const c = str.charCodeAt(n)

      if (c < 128) {

        bytes[bytes.length] = c

      } else if ((c > 127) && (c < 2048)) {

        bytes[bytes.length] = (c >> 6) | 192
        bytes[bytes.length] = (c & 63) | 128

      } else {

        bytes[bytes.length] = (c >> 12) | 224
        bytes[bytes.length] = ((c >> 6) & 63) | 128
        bytes[bytes.length] = (c & 63) | 128

      }

    }

    return bytes
  },

  hexStringToPrintableText: function (payload) {
   var hex = payload.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str
  },

  bytesToHexString: function (bytes) {
    let dec
    let hexstring
    let bytesAsHexString = ''
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i] >= 0) {
        dec = bytes[i]
      } else {
        dec = 256 + bytes[i]
      }
      hexstring = dec.toString(16)
      // zero padding
      if (hexstring.length === 1) {
        hexstring = '0' + hexstring
      }
      bytesAsHexString += hexstring
    }
    return bytesAsHexString
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
    if (record.tnf === tnf) { // TNF is 3-bit
      let recordType
      if (typeof(type) === 'string') {
        recordType = type
      } else {
        recordType = util.bytesToString(type)
      }
      return (util.bytesToString(record.type) === recordType)
    }
    return false
  }

}

// this is a module in ndef-js
const textHelper = {

  decodePayload: function (data) {

    const languageCodeLength = (data[0] & 0x3F) // 6 LSBs
    const languageCode = data.slice(1, 1 + languageCodeLength)
    const utf16 = (data[0] & 0x80) !== 0 // assuming UTF-16BE

    // TODO need to deal with UTF in the future
    // console.log("lang " + languageCode + (utf16 ? " utf16" : " utf8"));

    return util.bytesToString(data.slice(languageCodeLength + 1))
  },

  // encode text payload
  // @returns an array of bytes
  encodePayload: function (text, lang, encoding) {

    // ISO/IANA language code, but we're not enforcing
    if (!lang) {
      lang = 'en'
    }

    const encoded = util.stringToBytes(lang + text)
    encoded.unshift(lang.length)

    return encoded
  },

  makeSlices: function (data, pageSize) {
    const result = []
    for (let i = 0; i < data.length; i += pageSize) {
      result.push(data.slice(i, i + pageSize))
    }
    return result
  }

}

// this is a module in ndef-js
const uriHelper = {
  // URI identifier codes from URI Record Type Definition
  // NFCForum-TS-RTD_URI_1.0 2006-07-24 index in array matches code in the spec
  protocols: ['', 'http://www.', 'https://www.', 'http://', 'https://', 'tel:', 'mailto:', 'ftp://anonymous:anonymous@', 'ftp://ftp.', 'ftps://', 'sftp://', 'smb://', 'nfs://', 'ftp://', 'dav://', 'news:', 'telnet://', 'imap:', 'rtsp://', 'urn:', 'pop:', 'sip:', 'sips:', 'tftp:', 'btspp://', 'btl2cap://', 'btgoep://', 'tcpobex://', 'irdaobex://', 'file://', 'urn:epc:id:', 'urn:epc:tag:', 'urn:epc:pat:', 'urn:epc:raw:', 'urn:epc:', 'urn:nfc:'],

  // decode a URI payload bytes
  // @returns a string
  decodePayload: function (data) {
    let prefix = uriHelper.protocols[data[0]]
    if (!prefix) { // 36 to 255 should be ""
      prefix = ''
    }
    return prefix + util.bytesToString(data.slice(1))
  },

  // shorten a URI with standard prefix
  // @returns an array of bytes
  encodePayload: function (uri) {

    let prefix
    let protocolCode
    let encoded

    // check each protocol, unless we've found a match
    // "urn:" is the one exception where we need to keep checking
    // slice so we don't check ""
    uriHelper.protocols.slice(1).forEach(function (protocol) {
      if ((!prefix || prefix === 'urn:') && uri.indexOf(protocol) === 0) {
        prefix = protocol
      }
    })

    if (!prefix) {
      prefix = ''
    }

    encoded = util.stringToBytes(uri.slice(prefix.length))
    protocolCode = uriHelper.protocols.indexOf(prefix)
    // prepend protocol code
    encoded.unshift(protocolCode)

    return encoded
  }

}

module.exports.ndef = ndef
module.exports.util = util

// textHelper and uriHelper aren't exported, add a property
ndef.uriHelper = uriHelper
ndef.textHelper = textHelper

// create aliases
// util.bytesToString = util.bytesToString;
// util.stringToBytes = util.stringToBytes;
// util.bytesToHexString = util.bytesToHexString;
