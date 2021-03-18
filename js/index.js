import { repeatable } from './repeatable/repeatable-init.mjs'

import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'

const mainView = getMainAppView(document.body, store)

const firstState = store.getState()
console.log('firstState:', firstState)
console.log('repeatable:', repeatable)

mainView()

const unsubscribe = store.subscribe(mainView)
