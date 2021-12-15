/* global document */

import { isInt } from '../utilities/validation.mjs'

const hex2dec = (input) => {
  const hex = ['a', 'b', 'c', 'd', 'e', 'f']
  if (isInt(input)) {
    return input
  } else {
    const tmp = hex.indexOf(input.toLowerCase())
    if (tmp > -1) {
      return tmp + 10
    }
  }
  throw Error('hex2dec() expects only parameter input to be a number between 0 and 9 or a letter between "a" and "f"')
}

const doubleHex2Dec = (a, b) => {
  return ((hex2dec(a) * 16) + (hex2dec(b) * 1))
}

const makeRGBA = (hex) => {
  const _hex = hex.substring(1).split('')
  const _inc = (_hex.length === 6) ? 2 : 1
  let output = ''
  let c = 0
  let sep = ''

  for (let a = 0; a < _hex.length; a += _inc) {
    if (_inc === 1) {
      output += sep + doubleHex2Dec(0, _hex[a])
    } else {
      output += sep + doubleHex2Dec(_hex[a], _hex[a + 1])
    }
    sep = ', '
    c += 1
  }

  if (c === 3) {
    return 'rgba(' + output + ', .85)'
  }
  throw Error('makeRGBA() could not parse ' + hex + ' into decimal RGB values.')
}

export const userSettingsSubscriber = (store) => {
  const tmpState = store.getState()
  const root = document.documentElement

  let currentSettings = tmpState.userSettings

  return () => {
    const previousSettings = currentSettings
    const state = store.getState()

    // console.log('inside userSettingsSubscriber()')

    currentSettings = state.userSettings

    if (previousSettings.customBg !== currentSettings.customBg) {
      root.style.setProperty('--custom-bg', currentSettings.customBg)
    } else if (previousSettings.customTxt !== currentSettings.customTxt) {
      root.style.setProperty('--custom-txt', currentSettings.customTxt)
    } else if (previousSettings.customOver !== currentSettings.customOver) {
      root.style.setProperty(
        '--custom-over-colour',
        makeRGBA(currentSettings.customOver)
      )
    } else if (previousSettings.customRev !== currentSettings.customRev) {
      root.style.setProperty(
        '--custom-over-colour-rev',
        makeRGBA(currentSettings.customRev)
      )
    } else if (previousSettings.fontSize !== currentSettings.fontSize) {
      root.style.setProperty(
        '--font-size',
        currentSettings.fontSize + 'rem'
      )
    }
  }
}

export const forceUIupdate = (state) => {
  const root = document.documentElement
  root.style.setProperty('--custom-bg', state.customBg)
  root.style.setProperty('--custom-txt', state.customTxt)
  root.style.setProperty('--custom-over-colour', makeRGBA(state.customOver))
  root.style.setProperty('--custom-over-colour-rev', makeRGBA(state.customRev))
  root.style.setProperty('--font-size', state.fontSize + 'rem')
}
