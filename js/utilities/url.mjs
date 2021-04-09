/* globals localStorage, history */

import { isBool, isBoolTrue, isNumeric, isStr, isNonEmptyStr } from './validation.mjs'
import { parseStrArray } from './sanitise.mjs'

/**
 * polyfil for new URL() call (but with better GET and hash parsing)
 * (see: https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
 *
 * convert a URL string into a URL object
 *
 * @param {string} url url to be parsed (usually from window.location)
 *
 * @returns {URL} url object, identical to new URL() call
 *                (except the hash can be before or after
 *                 the GET string)
 */
export const getURLobject = (url) => {
  let urlParts
  let i = 0
  const output = {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    actionHref: '',
    origin: '',
    password: '',
    path: '',
    pathname: '',
    port: '',
    protocol: '',
    search: '',
    searchParams: {},
    searchParamsRaw: {},
    username: ''
  }
  let key = ''
  let tmp = ''
  let _url = ''

  if (typeof url === 'string') {
    _url = url
  } else if (typeof url.href === 'string') {
    _url = url.href
  }

  if (typeof _url === 'string' && _url[0] !== '#') {
    urlParts = _url.match(/^((https?:|file:\/)?\/\/([^:/#?]+))(:[0-9]+)?((?:\/[^?#/]*)+)?(?:(\?)([^#]*)(?:(#)(.*))?|(#)([^?]*)(?:(\?)(.*))?)?$/i)

    if (urlParts.length >= 3) {
      output.origin = urlParts[1]
      output.protocol = urlParts[2].toLowerCase()
      output.href = _url
      output.hostname = urlParts[3]
      output.host = urlParts[3]
      if (typeof urlParts[4] !== 'undefined') {
        output.port = urlParts[4]
      }
      if (typeof urlParts[5] !== 'undefined') {
        output.pathname = urlParts[5]
        output.path = urlParts[5].replace(/\/[^/]+$/i, '/')
      }

      if (typeof urlParts[6] !== 'undefined') {
        output.search = urlParts[7]
      } else if (typeof urlParts[12] !== 'undefined') {
        output.search = urlParts[13]
      }

      if (typeof urlParts[8] !== 'undefined') {
        output.hash = '#' + urlParts[9]
      } else if (typeof urlParts[10] !== 'undefined') {
        output.hash = '#' + urlParts[11]
      }

      if (output.search !== '') {
        tmp = output.search.split('&')

        for (i = 0; i < tmp.length; i += 1) {
          tmp[i] = tmp[i].trim()
          if (tmp[i] !== '') {
            tmp[i] = tmp[i].split('=')
            key = tmp[i][0]
            output.searchParams[key] = cleanGET(isStr(tmp[i][1]) ? tmp[i][1] : 'true')
            output.searchParamsRaw[key] = tmp[i][1]
          }
        }

        output.search = '?' + output.search
      }

      if (output.protocol === '' && typeof window !== 'undefined' && typeof window.location !== 'undefined' && typeof window.location.protocol !== 'undefined') {
        output.protocol = window.location.protocol
      }
    }
  }

  output.actionHref = stripGETaction(output.href)

  return output
}
/**
 * Enhance URL object with values pulled from local storage
 *
 * @param {string} url url to be parsed (usually from window.location)
 *
 * @returns {URL} url object, identical to new URL() call
 *                (except the hash can be before or after
 *                 the GET string)
 */
export const localStoreageEnhanceUrl = (url) => {
  const _url = getURLobject(url)

  const _sMode = _url.searchParams.mode
  if (isNonEmptyStr(_sMode)) {
    localStorage.setItem('mode', _sMode)
  } else {
    const _lMode = localStorage.getItem('mode')
    if (isNonEmptyStr(_lMode)) {
      _url.searchParams.mode = _lMode
    }
  }

  const _sGroup = isNonEmptyStr(_url.searchParams.groups)
    ? _url.searchParams.groups
    : isNonEmptyStr(_url.searchParams.group)
      ? _url.searchParams.group
      : ''

  if (_sGroup !== '') {
    localStorage.setItem('groups', _sGroup)
  } else {
    const _lGroups = localStorage.getItem('groups')
    if (isNonEmptyStr(_lGroups)) {
      _url.searchParams.groups = _lGroups
    }
  }

  const _sAction = _url.searchParams.action
  if (!isNonEmptyStr(_sAction)) {
    const _repeat = localStorage.getItem('repeatable')
    if (isNonEmptyStr(_repeat)) {
      const _rep = JSON.parse(_repeat)
      if (!isNonEmptyStr(_url.searchParams.action) && isNonEmptyStr(_rep.activeAction.id)) {
        _url.searchParams.action = _rep.activeAction.id
      }
      if (!isBoolTrue(_url.searchParams.debug) && isBoolTrue(_rep.debug)) {
        _url.searchParams.debug = true
      }
    }
  }

  const newSearch = makeSearchStr(_url)

  if (_url.search !== newSearch) {
    _url.search = newSearch
    _url.href = _url.protocol + '//' + _url.host + _url.port + _url.pathname + _url.search + _url.hash
    history.replaceState({}, '', _url.href)
  }
  return _url
}

/**
 * Convert string values to appropriate javascript data types
 *
 * @param {string} input Value to be converted
 *
 * @returns {string, boolean, number, array}
 */
export const cleanGET = (input) => {
  const _output = decodeURI(input.trim())

  if (_output.toLowerCase() === 'true') {
    return true
  } else if (_output.toLowerCase() === 'false') {
    return false
  } else if (isNumeric(_output)) {
    return (_output * 1)
  } else {
    const tmp = parseStrArray(_output)
    if (tmp !== false) {
      return tmp
    }
  }

  return _output
}

/**
 * Rebuild the URL search/GET string using values from the URL
 * object stored in state
 *
 * @param {object} url Object generated by getURLobject()
 *
 * @returns {string}
 */
export const makeSearchStr = (url) => {
  let output = ''
  let sep = '?'

  for (const key in url.searchParams) {
    let value = url.searchParams[key]
    if (isBool(value)) {
      value = (value) ? 'true' : 'false'
    }
    output += sep + key + '=' + value
    // output += sep + key + '=' + encodeURIComponent(value)
    sep = '&'
  }
  return output
}

/**
 * Rebuild URL string from URL object
 *
 * Intended for updating the browser history
 *
 * @param {object} url Object generated by getURLobject()
 *
 * @returns {string}
 */
export const makeURLstr = (url) => {
  return url.pathname +
         makeSearchStr(url) +
         url.hash
}

export const stripGETaction = (href) => href.replace(/[?&]action=[^&#]+(?=[&#]|^)?/gi, '')
