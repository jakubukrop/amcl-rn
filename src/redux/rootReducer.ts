import {forwardReducerTo} from './utils'
import {getInitialState, State} from './state'
import {GenericAction} from './types'

const rootReducer = (
  state: State = getInitialState(),
  action: GenericAction<any, any>,
): State => {
  const {reducer, path, payload} = action
  // fallback for 3rd-party actions
  if (!reducer) return state

  return forwardReducerTo(reducer, path)(state, payload)
}

export default rootReducer
