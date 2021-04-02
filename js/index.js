import { repeatable } from './repeatable/repeatable-init.mjs'
import { repeatActions, dispatchRegisterAction } from './state/repeatable/repeatable.state.actions.mjs'
import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'
import { userSettingsSubscriber, forceUIupdate } from './subscribers/user-settings.subscriber.mjs'
import { historySubscriber } from './subscribers/history.subscriber.mjs'
import { localStorageSubscriber } from './subscribers/localStorage.subscriber.mjs'
import { isNonEmptyStr, getFromLocalStorage } from './utility-functions.mjs'
import { mainAppActions } from './state/main-app/main-app.state.actions.mjs'
import { userSettingsActions } from './state/user-settings/user-settings.state.actions.mjs'
import { url } from './url.mjs'

const mainView = getMainAppView(document.body, store)

const userSettingsSub = userSettingsSubscriber(store)

const unsubscribers = { // eslint-disable-line
  ui: store.subscribe(mainView),
  userSettings: store.subscribe(userSettingsSub),
  history: store.subscribe(historySubscriber(store)),
  localStorage: store.subscribe(localStorageSubscriber(store))
}

repeatable.verifyChained()
const localRepeat = getFromLocalStorage('repeatable')

dispatchRegisterAction(
  store.dispatch,
  repeatable.getActionsList(),
  repeatable.setFirstAction(
    url.searchParams,
    localRepeat.fields.inputExtra
  )
)

const tmpState = store.getState()
let forceUiUpdate = false

// ========================================================
// START: pre-setting from URL and local storage

if (localRepeat !== null) {
  if (isNonEmptyStr(localRepeat.activeAction.id)) {
    store.dispatch({
      type: repeatActions.UPDATE_FIELD,
      payload: {
        id: 'input',
        key: '',
        value: localRepeat.fields.inputPrimary
      }
    })

    if (tmpState.repeatable.debug !== localRepeat.debug) {
      store.dispatch({
        type: repeatActions.TOGGLE_DEBUG
      })
    }
  } else {
    console.error('Failed to parse "repeatable" state')
  }
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
