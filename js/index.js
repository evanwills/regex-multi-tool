/* globals localStorage */

import { repeatable } from './repeatable/repeatable-init.mjs'
import { repeatActions, dispatchRegisterAction } from './state/repeatable/repeatable.state.actions.mjs'
import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'
import { userSettingsSubscriber, forceUIupdate } from './subscribers/user-settings.subscriber.mjs'
import { historySubscriber } from './subscribers/history.subscriber.mjs'
import { localStorageSubscriber } from './subscribers/localStorage.subscriber.mjs'
import { isNonEmptyStr } from './utility-functions.mjs'
import { mainAppActions } from './state/main-app/main-app.state.actions.mjs'
import { userSettingsActions } from './state/user-settings/user-settings.state.actions.mjs'
import { url } from './url.mjs'

const mainView = getMainAppView(document.body, store)
repeatable.verifyChained()

dispatchRegisterAction(
  store.dispatch,
  repeatable.getActionsList(),
  repeatable.setFirstAction()
)

const tmpState = store.getState()
let forceUiUpdate = false

// ========================================================
// START: pre-setting from URL and local storage

// if (isNonEmptyStr(tmpState.url.searchParams.action)) {
//   store.dispatch({
//     type: repeatActions.SET_ACTION,
//     payload: tmpState.url.searchParams.action
//   })
// }
const _repeatable = localStorage.getItem('repeatable')
if (isNonEmptyStr(_repeatable)) {
  try {
    const _tmp = JSON.parse(_repeatable)
    if (isNonEmptyStr(_tmp.activeAction.id)) {
      store.dispatch({
        type: repeatActions.UPDATE_FIELD,
        payload: {
          id: 'input',
          key: '',
          value: _tmp.fields.inputPrimary
        }
      })

      for (const key in _tmp.fields.extraInputs) {
        store.dispatch({
          type: repeatActions.UPDATE_FIELD,
          payload: {
            id: 'extraInputs',
            key: key,
            value: _tmp.fields.extraInputs[key]
          }
        })
      }

      if (tmpState.repeatable.debug !== _tmp.debug) {
        store.dispatch({
          type: repeatActions.TOGGLE_DEBUG
        })
      }
    }
  } catch (e) {
    // console.log('contents of localStorage.repeatable: ' + _repeatable)
    console.error('Failed to parse "repeatable" state: ' + e)
  }
}
const userSettings = localStorage.getItem('userSettings')

if (isNonEmptyStr(userSettings)) {
  try {
    const _userSettings = JSON.parse(userSettings)
    // console.log('_userSettings:', _userSettings)
    store.dispatch({
      type: userSettingsActions.RESTORE,
      payload: _userSettings
    })
    forceUiUpdate = true
  } catch (e) {
    console.error('Failed to parse userSettings: ' + e)
  }
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

const userSettingsSub = userSettingsSubscriber(store)

const unsubscribers = { // eslint-disable-line
  ui: store.subscribe(mainView),
  userSettings: store.subscribe(userSettingsSub),
  history: store.subscribe(historySubscriber(store)),
  localStorage: store.subscribe(localStorageSubscriber(store))
}

if (forceUiUpdate === true) {
  const tmp = store.getState()
  forceUIupdate(tmp.userSettings)
}
