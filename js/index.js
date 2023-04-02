import { repeatable } from './repeatable/repeatable-init.mjs'
import {
  // repeatActions,
  dispatchRegisterAction
} from './state/repeatable/repeatable.state.actions.mjs'
import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'
import {
  userSettingsSubscriber,
  forceUIupdate
} from './subscribers/user-settings.subscriber.mjs'
import { historySubscriber } from './subscribers/history.subscriber.mjs'
import { localStorageSubscriber } from './subscribers/localStorage.subscriber.mjs'
import { isBool, isNonEmptyStr } from './utilities/validation.mjs'
import { getFromLocalStorage } from './utilities/general.mjs'
import { mainAppActions } from './state/main-app/main-app.state.actions.mjs'
import { userSettingsActions } from './state/user-settings/user-settings.state.actions.mjs'
import { url } from './url.mjs'

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register(url.path + 'regexMulti.sw.js')
}

// Bind the store into the main view to enable auto-dispatching
// event handlers in views
const mainView = getMainAppView(document.body, store)

// ------------------------------------------------------------------
// TODO: Move userSettings, history & localStorage subscriber
//       functionality out of subscribers and into middleware.
//       This will give them access to the current action's
//       `type` property and hopefully improve performance

const unsubscribers = { // eslint-disable-line
  ui: store.subscribe(mainView),
  userSettings: store.subscribe(userSettingsSubscriber(store)),
  history: store.subscribe(historySubscriber(store)),
  localStorage: store.subscribe(localStorageSubscriber(store))
}

repeatable.verifyChained()

const localRepeat = getFromLocalStorage('repeatable')
// console.group('index.js')
// console.log('localRepeat:', localRepeat)
// console.log('typeof localRepeat !== "undefined":', typeof localRepeat !== 'undefined')
// console.log('localRepeat !== null:', localRepeat !== null)
// console.groupEnd()

dispatchRegisterAction(
  store.dispatch,
  repeatable.getActionsList(),
  repeatable.setFirstAction(
    url.searchParams,
    (typeof localRepeat !== 'undefined' &&  localRepeat !== null)
      ? localRepeat.extraInputs
      : {}
  )
)

const tmpState = store.getState()
let forceUiUpdate = false

// ========================================================
// START: pre-setting from URL and local storage

if (localRepeat !== null) {
  if (isNonEmptyStr(localRepeat.input)) {
    store.dispatch({
      type: mainAppActions.SET_INPUT,
      payload: localRepeat.input
    })
  }
  if (isBool(localRepeat.debug) && tmpState.debug !== localRepeat.debug) {
    store.dispatch({
      type: mainAppActions.TOGGLE_DEBUG
    })
  }
} else {
  console.info('Nothing in local storage.')
}

const userSettings = getFromLocalStorage('userSettings')

if (userSettings !== null) {
  store.dispatch({
    type: userSettingsActions.RESTORE,
    payload: userSettings
  })
  forceUiUpdate = true
} else {
  console.error('Failed to parse userSettings')
}

if (isNonEmptyStr(url.searchParams.mode)) {
  store.dispatch({
    type: mainAppActions.SET_MODE,
    payload: url.searchParams.mode
  })
}
if (isNonEmptyStr(url.searchParams.groups)) {
  store.dispatch({
    type: mainAppActions.SET_GROUPS,
    payload: url.searchParams.groups
  })
}

//  END:  pre-setting from URL and local storage
// ========================================================

mainView()

if (forceUiUpdate === true) {
  const tmp = store.getState()
  forceUIupdate(tmp.userSettings)
}


// ========================================================
// START: guestimate and set ideal height for input box

const tmpInputHeight = ((window.innerHeight / 16) - 16.5)

const inputHeight = (tmpInputHeight > 28.5)
  ? tmpInputHeight
  : 28.5;

const pageRoot = document.documentElement;
if (typeof pageRoot !== 'undefined') {
  pageRoot.style.setProperty('--input-height', inputHeight + 'rem')
}

//  END:  guestimate and set ideal height for input box
// ========================================================
