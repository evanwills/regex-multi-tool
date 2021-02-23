import { repeatActions } from './repeat.state.actions.mjs'
import { repeatable } from '../repeat/repeat-init.mjs'

// export const repeatActions = {
//   REGISTER_ALL_ACTIONS: 'REPEATABLE_REGISTER_ALL_ACTIONS',
//   REGISTER_SINGLE_ACTION: 'REPEATABLE_REGISTER_SINGLE_ACTION',
//   REGISTER_GROUP: 'REPEATABLE_REGISTER_GROUP',
//   SET_ACTION: 'REPEATABLE_SET_ACTON',
//   UPDATE_FIELD: 'REPEATABLE_UPDATE_FIELD',
//   MODIFY_INPUT: 'REPEATABLE_MODIFY_INPUT',
//   RESET_ACTION: 'REPEATABLE_RESET_ACTION', // Only used by middleware
//   TOGGLE_NAV: 'REPEATABLE_TOGGLE_NAV',
//   TOGGLE_DEBUG: 'REPEATABLE_TOGGLE_DEBUG',
//   ERROR: 'REPEATABLE_ERROR',
//   INIT: 'REPEATABLE_INIT'
// }

export const modifyInput = ({ getState, dispatch }) => next => action => {
}

export const repeatableMW = ({ getState, dispatch }) => next => action => {
  switch (action.type) {
    case repeatActions.INIT:
      return next({
        ...action,
        payload: repeatable.getActionsList()
      })

    case repeatActions.SET_ACTION:
      if (repeatable.setAction(action.payload)) {
        return next(action)
      } else {
        return next({
          type: repeatActions.ERROR,
          payload: 'Could not set action "' + action.payload + '"'
        })
      }

    case repeatActions.MODIFY_INPUT:
      if (getState.repeat.activeAction.remote === true) {
        // This needs to be a fetch request to the host server
      } else {
        return next(repeatable.run(
          getState.repeat.fields.value,
          getState.repeat.fields.inputs
        ))
      }
  }
}
