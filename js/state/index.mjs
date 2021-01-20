import { createStore } from './redux/redux.mjs'

const initialState = {
  mode: 'simple',
  simple: {
    pairs: []
  },
  stuff: {

  }
}

const appState = createStore()
