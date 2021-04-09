import { repeatActions } from './repeatable.state.actions.mjs'
import { repeatable } from '../../repeatable/repeatable-init.mjs'
import { mainAppActions } from '../main-app/main-app.state.actions.mjs'
import {
  // isBool,
  // isFunction,
  // isNumber,
  isNumeric
  // isStr,
  // invalidString,
} from '../../utilities/validation.mjs'
// import {
//   // ucFirst
//   // getURLobject
// } from '../../utilities/sanitise.mjs'
import { urlActions } from '../url/url.state.all.mjs'
// import { mainAppActions } from '../main-app/main-app.state.actions.mjs'

let loop = 0

export const modifyInput = ({ getState, dispatch }) => next => action => {
}

// const getActionMeta = (allActions, actionID) => {
//   for (const prop in allActions) {
//     const action = allActions[prop].filter(_action => _action.id === actionID)

//     if (action.length === 1) {
//       return action[0]
//     }
//   }
//   return false
// }

export const repeatableMW = store => next => action => {
  const _state = store.getState()

  // console.log('action:', action)

  switch (action.type) {
    case repeatActions.INIT:
      return next({
        ...action,
        payload: repeatable.getActionsList()
      })

    case repeatActions.SET_ACTION:
      if (loop === 0) {
        loop = 1
        if (repeatable.setAction(action.payload)) {
          store.dispatch({
            ...action,
            payload: {
              ...repeatable.getCurrentActionMeta(),
              get: _state.url.searchParams
            }
          })

          if (_state.repeatable.navOpen) {
            store.dispatch({
              type: repeatActions.TOGGLE_NAV
            })
          }

          loop = 0

          return next({
            type: urlActions.UPDATE_GET,
            payload: {
              key: 'action',
              value: action.payload
            }
          })
        } else {
          loop = 0

          return next({
            type: repeatActions.ERROR,
            payload: 'Could not set action "' + action.payload + '"'
          })
        }
      } else {
        return next(action)
      }

    case repeatActions.UPDATE_FIELD:
      if (action.payload.id !== 'input') {
        // Lets see what type of field this is and ensure that
        // the value going into the store is the correct type.
        const field = _state.repeatable.activeAction.extraInputs.filter(_field => _field.id === action.payload.key)

        if (field[0].type === 'number') {
          if (isNumeric(action.payload.value)) {
            return next({
              ...action,
              payload: {
                ...action.payload,
                value: (action.payload.value * 1)
              }
            })
          }
        }
      }
      return next(action)

    case repeatActions.MODIFY_INPUT:
      if (_state.repeatable.activeAction.remote === true) {
        // This needs to be a fetch request to the host server
        return next(action)
      } else {
        // console.log('about to run action')
        console.log('input:', _state.input)
        console.log('_state.repeatable.extraInputs:', _state.repeatable.extraInputs)
        store.dispatch({
          type: mainAppActions.SET_OUTPUT,
          payload: repeatable.run(
            _state.input,
            _state.repeatable.extraInputs,
            _state.url.searchParams
          )
        })
        break
      }

    default:
      return next(action)
  }
}
