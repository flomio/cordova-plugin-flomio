const exec = require('cordova/exec')
import * as ndef from 'ndef-lib'

export function init (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'init', [])
}

export function setConfiguration (configuration, success, failure) {
  exec(success, failure, 'FlomioPlugin', 'setConfiguration', [configuration])
}

export function getConfiguration (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'getConfiguration', [])
}

export function stopReaders (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'stopReaders', [])
}

export function sleepReaders (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'sleepReaders', [])
}

export function startReaders (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'startReaders', [])
}

// Configure to only connect to a device with a specific device ID
export function selectSpecificDeviceId (specificDeviceId: string, success, failure) {
  exec(success, failure, 'FlomioPlugin', 'selectSpecificDeviceId', [specificDeviceId])
}

export function sendApdu (deviceId: string, apdu: string | Buffer, success, failure) {
  if (deviceId == null) {
    throw new ReferenceError('`deviceId` parameter is `null`')
  }
  if (apdu == null) {
    throw new ReferenceError('`apdu` parameter is `null`')
  }
  let apduString: string
  if (Buffer.isBuffer(apdu)) {
    apduString = apdu.toString('hex')
  }
  if (typeof apdu === 'string') {
    apduString = apdu
  } else {
    throw new ReferenceError('`apdu` parameter needs to be a `Buffer` or a `string`')
  }
  exec(success, failure, 'FlomioPlugin', 'sendApdu', [deviceId, apduString])
}

export function getBatteryLevel (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'getBatteryLevel', [])
}

export function getCommunicationStatus (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'getCommunicationStatus', [])
}

export function writeNdef (deviceId: string, ndefMessage: ndef.IMessage, success, failure) {
  const encoded = ndef.encodeMessage(ndefMessage)
  let tlvEncoded = ndef.tlvEncodeNdef(encoded)
  this.write(deviceId, tlvEncoded, success, failure)
}

export async function write (deviceId: string, data: string | Buffer, success, failure) {
  let encoded: Buffer
  if (typeof data === 'string') {
    encoded = Buffer.from(this.removeSpaces(data), 'hex')
  }
  if (Buffer.isBuffer(data)) {
    encoded = data
  }
  if (!(encoded instanceof Buffer)) {
    throw new ReferenceError('`data` parameter needs to be a `Buffer` or a `string`')
  }
  const apduArray = ndef.createWriteApdus('mifareUltralight', encoded)
  await Promise.all(apduArray.map(async (apdu) => {
    await this.sendApduWithPromise(deviceId, apdu.toString('hex'))
  })).then(() => {
    success('Tag written successfully')
  }).catch(() => {
    failure(new Error('Tag not written successfully'))
  })
}

export function launchNativeNfc (success, failure) {
  function hexToBytes (hex) {
    let bytes = []
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16))
    }
    return bytes
  }

  function formatRecord (record) {
    const formatted = ndef.record(record.tnf,
        hexToBytes(record.type),
        hexToBytes(record.id),
        hexToBytes(record.payload)
    )
    return formatted
  }

  exec(
      (ndefMessage) => {
        success(ndefMessage.map(formatRecord))
      },
      failure,
      'FlomioPlugin', 'launchNativeNfc', [])
}

export async function readNdef (deviceId: string, success, failure) {
  let capabilityContainer = await this.readCapabilityContainer(deviceId)
  capabilityContainer = util.removeSpaces(capabilityContainer)
  let numberOfPages: number
  if (capabilityContainer.substring(0, 2) === 'E1') {
    const length = parseInt(capabilityContainer.substring(4,6), 16)
    const numberOfBytes = length * 8
    numberOfPages = numberOfBytes / 4
    // E1 00 byteSize (divided by 8) 00... eg E1 10 06 00 = 48 bytes
    // length * 8 = number of bytes
    // number of bytes / 4 = number of pages
  } else if (capabilityContainer.substr(capabilityContainer.length - 4) !== '9000') {
    failure(new Error('Tag Removed'))
    return
  } else {
    failure(new Error('Capability Container not formatted correctly'))
    return
  }
  const parser = new ndef.PushParser()
  let messages: ndef.IMessage = []
  parser.on('record', (record) => {
    messages.push(record)
  })
  parser.once('messageEnd', () => {
    success(messages)
  })
  parser.once('skipping', () => {
    failure(new Error('Tag is not NDEF formatted'))
  })

  for (let page = 4; page <= numberOfPages; page += 4) {
    if (parser.finishedMessage()) {
      break
    }
    let n = ''
    page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16)
    const apdu = 'FFB000' + n + '10'
    let response: string = await this.sendApduWithPromise(deviceId, apdu)
    const buffer = util.responseToBuffer(response)
    parser.push(buffer)
  }
}

// Delegate/Event Listeners

export function addConnectedDevicesListener (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'setConnectedDevicesUpdateCallback', [])
}

export function addTagStatusChangeListener (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'setTagStatusChangeCallback', [])
}

export function addTagDiscoveredListener (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'setTagDiscoveredCallback', [])
}

// Private Methods

export async function readPage (deviceId: string, page: number) {
  let n = ''
  page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16)
  const apdu: string = 'FFB000' + n + '10'
  return this.sendApduWithPromise(deviceId, apdu)
}

export async function readCapabilityContainer (deviceId) {
  return this.readPage(deviceId, 3)
}

async function checkIfTagFormatted (): Promise<boolean> {
  const capabilityContainer = await this.readCapabilityContainer()
  if (capabilityContainer.slice(0,2) === 'E1') {
    // capability container already formatted, leave it be
    const currentTagSizeString = capabilityContainer.slice(4,6)
    // console.log('currentTagSize: ' + currentTagSizeString + ' * 8')
    return true
  } else {
    return false
  }
}

export function sendApduWithPromise (deviceId: string, apdu: string) {
  return new Promise((resolve, reject) => {
    sendApdu(
        deviceId,
        apdu,
        (response) => {
          if (response.substr(response.length - 5) !== '90 00') {
            reject('Tag was removed or there was an attempt to read/write to an unavailable page')
            return
          }
          resolve(response)
        }, () => {
          reject('Tag was removed or there was an attempt to read/write to an unavailable page')
        })
  })
}

const util = {
  responseToBuffer: function (response: string): Buffer {
    response = util.removeSpaces(response)
    response = response.slice(0, -4)
    return Buffer.from(response, 'hex')
  },

  removeSpaces: function (stringWithSpaces: string): string {
    return stringWithSpaces.replace(/\s/g, '')
  }
}

export enum CommunicationStatus {
  Scanning,
  Connected,
  Disconnected
}

export enum PowerOperation {
  AutoPollingControl,
  BluetoothConnectionControl
}

export enum TagStatus {
  NotPresent,
  Present,
  ReadingData
}

module.exports.ndef = ndef
module.exports.util = ndef.util
