import { repeatable } from './repeatable/repeatable-init.mjs'
import { dispatchRegisterAction } from './state/repeatable/repeatable.state.actions.mjs'

import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'

const mainView = getMainAppView(document.body, store)

dispatchRegisterAction(
  store.dispatch,
  repeatable.getActionsList(),
  repeatable.setFirstAction()
)

mainView()

const unsubscribe = store.subscribe(mainView)
