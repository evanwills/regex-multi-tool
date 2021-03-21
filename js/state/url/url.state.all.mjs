import { isNonEmptyStr, isNumeric, isBool, makeURLstr } from '../../utility-functions.mjs'

/**
 * This file handles updating URL parts middleware has intercepted
 * user interactions
 *
 * NOTE: These two actions should only ever be triggered by middleware
 *       They should never be triggered directly by user interactions
 */

export const urlActions = {
  UPDATE_GET: 'URL_UPDATE_GET',
  UPDATE_HASH: 'URL_UPDATE_HASH',
  UPDATE_HREF: 'URL_UPDATE_HREF'
}

export const initialState = {
  hash: '',
  host: '',
  hostname: '',
  href: '',
  origin: '',
  password: '',
  pathname: '',
  port: '',
  protocol: '',
  search: '',
  searchParams: {},
  searchParamsRaw: {},
  username: ''
}

const updateHref = (url) => {
  const href = makeURLstr(url)
  if (href !== url.href) {
    return {
      ...url,
      href: href
    }
  }
  return url
}

export const urlReducer = (state = initialState, action) => {
  switch (action.type) {
    case urlActions.UPDATE_HASH:
      if (state.hash.substr(1) !== action.payload) {
        return updateHref({
          ...state,
          hash: '#' + action.payload
        })
      }
      break

    case urlActions.UPDATE_GET:
      console.log('action:', action)
      if (isNonEmptyStr(action.payload.key)) {
        if (isNonEmptyStr(action.payload.value) || isNumeric(action.payload.value) || isBool(action.payload.value)) {
          if (state.searchParams[action.payload.key] !== action.payload.value) {
            state.searchParams = {
              ...state.searchParams
            }
            state.searchParams[action.payload.key] = action.payload.value
            return updateHref(state)
          }
        }
      }
      break
  }
  return state
}
