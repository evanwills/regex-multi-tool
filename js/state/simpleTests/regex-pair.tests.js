import {
  regexPairsReducer,
  regexPairActions
} from '../regex-pairs.state.js'

let state = regexPairsReducer()

console.log('state:', state)
console.log('state[0].id:', state[0].id)

const id = state[0].id
console.log('id:', id)

const action1 = {
  type: regexPairActions.UPDATE_REGEX,
  payload: {
    id: id,
    value: '^R[0-9]{9}$',
    error: ''
  }
}
state = regexPairsReducer(state, action1)

console.group('action 1')
console.log('state:', state)
console.groupEnd()

const action2 = {
  type: regexPairActions.UPDATE_REPLACE,
  payload: {
    id: id,
    value: 'I am a chicken'
  }
}
state = regexPairsReducer(state, action2)

console.group('action 2')
console.log('state:', state)
console.groupEnd()

const action3 = {
  type: regexPairActions.UPDATE_FLAGS,
  payload: {
    id: id,
    value: 'igs',
    error: ''
  }
}
state = regexPairsReducer(state, action3)

console.group('action 3')
console.log('state:', state)
console.groupEnd()

const action4a = {
  type: regexPairActions.UPDATE_DELIMS,
  payload: {
    id: id,
    value: '`',
    isOpen: true,
    error: ''
  }
}
state = regexPairsReducer(state, action4a)

console.group('action 4a')
console.log('state:', state)
console.groupEnd()

const action4b = {
  type: regexPairActions.UPDATE_DELIMS,
  payload: {
    id: id,
    value: '`',
    isOpen: false,
    error: ''
  }
}
state = regexPairsReducer(state, action4b)

console.group('action 4b')
console.log('state:', state)
console.groupEnd()

const action5 = {
  type: regexPairActions.ADD_BEFORE,
  payload: { id: id }
}
state = regexPairsReducer(state, action5)
state = regexPairsReducer(state, action5)
state = regexPairsReducer(state, action5)

console.group('action 5 (x3)')
console.log('state:', state)
console.groupEnd()

const action6 = {
  type: regexPairActions.ADD_AFTER,
  payload: { id: id }
}
state = regexPairsReducer(state, action6)
state = regexPairsReducer(state, action6)
state = regexPairsReducer(state, action6)

console.group('action 6 (x3)')
console.log('state:', state)
console.groupEnd()

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

console.group('action 7 (' + regexPairActions.MOVE_UP + ')')
const id7 = state[1].id
const action7 = {
  type: regexPairActions.MOVE_UP,
  payload: { id: id7 }
}
console.log('state:', state)

state = regexPairsReducer(state, action7)

console.log('id7:', id7)
console.log('state[0].id:', state[0].id)
console.log('state[0].id === id7:', state[0].id === id7)
console.log('state:', state)

console.groupEnd()

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

console.group('action 8 (' + regexPairActions.MOVE_DOWN + ')')
console.log('state:', state)

const id8 = state[4].id
const action8 = {
  type: regexPairActions.MOVE_DOWN,
  payload: { id: id8 }
}
state = regexPairsReducer(state, action8)

console.log('id8:', id8)
console.log('state[5].id:', state[5].id)
console.log('state[5].id === id8:', state[5].id === id8)
console.log('state:', state)

console.groupEnd()

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

console.group('action 9 (' + regexPairActions.MOVE_TO + ')')

console.log('state:', state)

const id9 = state[6].id
console.log('id9:', id9)
console.log('state[0].id:', state[0].id)

const action9 = {
  type: regexPairActions.MOVE_TO,
  payload: { id: id9, value: 0 }
}
state = regexPairsReducer(state, action9)

console.log('state[0].id:', state[0].id)
console.log('state[0].id === id9:', state[0].id === id9)
console.log('state:', state)

console.groupEnd()

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

console.group('action 10 (' + regexPairActions.MOVE_TO + ')')

console.log('state:', state)

const id10 = state[3].id
console.log('id10:', id10)
console.log('state[5].id:', state[5].id)

const action10 = {
  type: regexPairActions.MOVE_TO,
  payload: { id: id10, value: 5 }
}
state = regexPairsReducer(state, action10)

console.log('state[5].id:', state[5].id)
console.log('state[5].id === id10:', state[5].id === id10)
console.log('state:', state)

console.groupEnd()
