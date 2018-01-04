const exec = require('cordova/exec')
import * as ndef from 'ndef-lib'

function noop () {
  // empty
}

export class Device {
  public deviceId: string
  public firmwareRevision?: string
  public hardwareRevision?: string
  public batteryLevel?: string
  public communicationStatus?: number
  constructor (deviceId: string, batteryLevel?: string, hardwareRevision?: string, firmwareRevision?: string, communicationStatus?: number) {
    this.deviceId = deviceId
    this.batteryLevel = batteryLevel
    this.firmwareRevision = firmwareRevision
    this.hardwareRevision = hardwareRevision
    this.communicationStatus = communicationStatus
  }
}

let devices: Device[] = []

export function init (success, failure) {
  exec(success, failure, 'FlomioPlugin', 'init', [])
}

export function selectDeviceType (deviceType, success, failure) {
  exec(success, failure, 'FlomioPlugin', 'selectDeviceType', [deviceType])
  // deviceType is "FloJack-BZR", "FloJack-MSR", "FloBLE-EMV" or
  // "FloBLE-Plus" (case insensitive)
}

export function selectSpecificDeviceId (specificDeviceId, success, failure) {
  exec(success, failure, 'FlomioPlugin', 'selectSpecificDeviceId', [specificDeviceId])
  // Configure to only connect to a device with a specific device ID
}

export function setConfiguration (configurationDictionary, success, failure) {
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
}

export function getConfiguration (success, failure) {
  return execPromise( success, failure, 'FlomioPlugin', 'getConfiguration', [])
}

export function stopReaders (success, failure) {
  return execPromise(success, failure, 'FlomioPlugin', 'stopReaders', [])
}

export function sleepReaders (success, failure) {
  return execPromise(success, failure, 'FlomioPlugin', 'sleepReaders', [])
}

export function startReaders (success, failure) {
  return execPromise(success, failure, 'FlomioPlugin', 'startReaders', [])
}

export function sendApdu (resultCallback, deviceId, apdu) {
  if (deviceId == null) {
    throw new ReferenceError('deviceId parameter is null')
  }
  if (apdu == null) {
    throw new ReferenceError('apdu parameter is null')
  }
  console.log('in send apdu: ' + apdu + ' device: ' + deviceId)
  return new Promise((resolve, reject) => {
    exec(
        (deviceId, responseApdu) => {
          console.log('In response apdu: ' + responseApdu)
          if (responseApdu.substr(responseApdu.length - 5) !== '90 00') {
            reject()
            return
          }
          resolve(responseApdu)
          resultCallback({deviceId: deviceId, responseApdu: responseApdu})
        },
        (failure) => {
          console.log('ERROR: FlomioPlugin.sendApdu: ' + failure)
          reject()
        },
        'FlomioPlugin', 'sendApdu', [deviceId, apdu])
  })
}

export function getBatteryLevel (success, failure) {
  return execPromise(success, failure, 'FlomioPlugin', 'getBatteryLevel', [])
}

export function getCommunicationStatus (success, failure) {
  return execPromise(success, failure, 'FlomioPlugin', 'getCommunicationStatus', [])
}

// Delegate/Event Listeners
export function addConnectedDevicesListener (success, failure) {
  exec(
    (device) => {
      // alert(JSON.stringify(device));
      let deviceId = device['Device ID']
      let batteryLevel = device['Battery Level']
      let hardwareRevision = device['Hardware Revision']
      let firmwareRevision = device['Firmware Revision']
      let communicationStatus = device['Communication Status']
      let newDevice = new Device(deviceId, batteryLevel, hardwareRevision, firmwareRevision, communicationStatus)
      devices.push(newDevice)
      success(device)
    },
    (failure) => {
      console.log('ERROR: FlomioPlugin.addConnectedDevicesListener: ' + failure)
    },
    'FlomioPlugin', 'setConnectedDevicesUpdateCallback', [])
}

export function addTagStatusChangeListener (success, failure) {
  exec(
    (deviceId, status) => {
      success({deviceId: deviceId, status: status})
    },
    (failure) => {
      console.log('ERROR: FlomioPlugin.addTagStatusChangeListener: ' + failure)
    },
    'FlomioPlugin', 'setCardStatusChangeCallback', [])
}

export function addTagDiscoveredListener (resultCallback, failure) {
  exec(
    (deviceId, tagUid, tagAtr) => {
      resultCallback({tagUid: tagUid, tagAtr: tagAtr, deviceId: deviceId})
    },
      failure,
    'FlomioPlugin', 'setTagDiscoveredCallback', [])
}

export function addNdefListener (success, failure) { // ios 11
  function hexToBytes (hex) {
    let bytes = []
    for (let c = 0; c < hex.length; c += 2) {
      bytes.push(parseInt(hex.substr(c, 2), 16))
    }
    return bytes
  }

  function formatRecord (record) {
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
      success({ndefMessage: ndefMessage.map(formatRecord)})
    },
    failure,
    'FlomioPlugin', 'setNdefDiscoveredCallback', [])
}

export function writeNdef (resultCallback, deviceId, ndefMessage) {
  const encoded = ndef.encodeMessage(ndefMessage)
  this.write(resultCallback, deviceId, encoded)
}

export async function write (resultCallback, deviceId, encoded) {
  let hex = ndef.tlvEncodeNdef(encoded)
  const apduArray = ndef.createWriteApdus('mifareUltralight', hex)
  await Promise.all(apduArray.map(async (apdu) => {
    await this.sendApdu(noop, deviceId, apdu.toString('hex'))
  })).then(() => {
    resultCallback('Tag written successfully', null)
  }).catch(() => {
    resultCallback(null, new Error('Tag not written successfully'))
  })
}

export function launchNativeNfc (success, failure) {
  return execPromise( success, failure, 'FlomioPlugin', 'launchNativeNfc', [])
}

export async function readNdef (resultCallback, deviceId: string) {
  let numberOfPages: number
  let capabilityContainer = await this.readCapabilityContainer(deviceId)
  capabilityContainer = util.removeSpaces(capabilityContainer)
  if (capabilityContainer.substring(0, 2) === 'E1') {
    const length = parseInt(capabilityContainer.substring(4,6), 16)
    const numberOfBytes = length * 8
    numberOfPages = numberOfBytes / 4
    // console.log('number of pages: ' + numberOfPages)
    // E1 00 byteSize (divided by 8) 00... eg E1 10 06 00 = 48 bytes
    // length * 8 = number of bytes
    // number of bytes / 4 = number of pages
  } else if (capabilityContainer.substr(capabilityContainer.length - 4) !== '9000') {
    resultCallback(null, new Error('Tag Removed'))
    return
  } else {
    console.log('capabilityContainer not formatted correctly')
    resultCallback(null, new Error('Capability Container not formatted correctly'))
    return
  }
  const parser = new ndef.PushParser()
  let messages = []
  parser.on('record', (record) => {
    messages.push(record)
  })
  parser.on('messageEnd', () => {
    resultCallback({ndefMessage: messages}, null)
  })
  parser.on('skipping', () => {
    resultCallback(null, new Error('Tag is not NDEF formatted'))
  })

  for (let page = 4; page <= numberOfPages; page += 4) {
    if (parser.finishedMessage()) {
      break
    }
    let n = ''
    page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16)
    const apdu = 'FFB000' + n + '10'
    let response: string = await this.sendApdu(noop, deviceId, apdu)
    const buffer = util.responseToBuffer(response)
    parser.push(buffer)
  }
}

export async function readPage (deviceId: string, page: number) {
  let n = ''
  page >= 16 ? n = '' + page.toString(16) : n = '0' + page.toString(16)
  const apdu: string = 'FFB000' + n + '10'
  return await this.sendApdu(noop, deviceId, apdu)
}

export async function readCapabilityContainer (deviceId) {
  return await this.readPage(deviceId, 3)
}

export async function determineMaximumTranceiveLength (deviceId): Promise<number> {
  let userMemory: number
  for (let page = 4; page < 256; page += 2) {
    const response = await this.readPage(deviceId, page )
    console.log('determineTagSize response: ' + response + 'page: ' + page)
    if ((response === '63 00') || (response.length <= 5)) {
      console.log('size ==' + page)
      let totalMemory = page * this.BYTES_PER_PAGE
      userMemory = totalMemory - (this.BYTES_PER_PAGE * 4)
      console.log('USER MEMORY: ' + userMemory)
      break
    }
  }
  return userMemory
}

export async function formatCapabilityContainer (deviceId) {
  const userMemory = await this.determineMaximumTranceiveLength(deviceId)
  if (userMemory) {
    const valueForCapabilityContainer: number = userMemory / 8
    let n = ''
    valueForCapabilityContainer >= 16 ? n = '' + valueForCapabilityContainer.toString(16) : n = '0' + valueForCapabilityContainer.toString(16)
    const apdu = 'FFD6000304' + 'E110' + n + '00'
    const response = await this.sendApdu(deviceId, apdu)
    console.log('response to apdu: ' + apdu + ' response: ' + response)
    const verify: boolean = await this.checkIfTagFormatted()
    console.log('tag formatted' + verify.valueOf)
  }
}

export async function checkIfTagFormatted (): Promise<boolean> {
  const capabilityContainer = await this.readCapabilityContainer()
  if (capabilityContainer.slice(0,2) === 'E1') {
    // capability container already formatted, leave it be
    const currentTagSizeString = capabilityContainer.slice(4,6)
    console.log('currentTagSize: ' + currentTagSizeString + ' * 8')
    return true
  } else {
    return false
  }
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

const BYTES_PER_PAGE: number = 4

module.exports.ndef = ndef
module.exports.util = ndef.util

function execPromise (success, error, pluginName, method, args) {
  return new Promise(function (resolve, reject) {
    exec(function (result) {
      resolve(result)
      if (typeof success === 'function') {
        success(result)
      }
    }, function (reason) {
      reject(reason)
      if (typeof error === 'function') {
        error(reason)
      }
    }, pluginName, method, args)
  })
}
