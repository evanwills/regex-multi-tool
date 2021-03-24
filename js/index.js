import { repeatable } from './repeatable/repeatable-init.mjs'
import { repeatActions, dispatchRegisterAction } from './state/repeatable/repeatable.state.actions.mjs'
import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'
import { userSettingsSubscriber } from './subscribers/user-settings.subscriber.mjs'
import { historySubscriber } from './subscribers/history.subscriber.mjs'
import { isNonEmptyStr } from './utility-functions.mjs'

const mainView = getMainAppView(document.body, store)

dispatchRegisterAction(
  store.dispatch,
  repeatable.getActionsList(),
  repeatable.setFirstAction()
)

const tmpState = store.getState()

if (isNonEmptyStr(tmpState.url.searchParams.action)) {
  store.dispatch({
    type: repeatActions.SET_ACTION,
    payload: tmpState.url.searchParams.action
  })
}

mainView()

const unsubscribers = {
  ui: store.subscribe(mainView),
  userSettings: store.subscribe(userSettingsSubscriber(store)),
  history: store.subscribe(historySubscriber(store))
}
