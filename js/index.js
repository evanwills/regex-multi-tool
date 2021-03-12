import { store } from './state/regexMulti-state.mjs'
import { getMainAppView } from './view/templates.mjs'

const mainView = getMainAppView(document.body, store)

mainView()

const unsubscribe = store.subscribe(mainView)
