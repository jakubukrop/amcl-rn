import produce from 'immer'
import _ from 'lodash'

import {State} from './state'
import {Path, Reducer, GenericAction} from './types'

const immutableSet = (
  state: State,
  path: Path | undefined,
  value: any,
): State =>
  path && path.length
    ? produce((obj): void => _.set(obj, path, value))(state)
    : value

/*
 * Forward reducer transform to a particular state path.
 * If the last path element does not exist, reducer will get undefined
 * so that you can use reduce(state=initialState(), payload) => ...
 *
 * Does not create new state if the value did not change
 */
export const forwardReducerTo = <T>(
  reducer: Reducer<T, T>,
  path: Path | undefined,
) => (state: State, payload: T): State => {
  const value = path ? _.get(state, path) : state
  const newValue = reducer(value, payload)
  return !_.isEqual(newValue, value)
    ? immutableSet(state, path, newValue)
    : state
}

export const updateValue = <T>(
  path: Path,
  data: T,
  type = 'Update value',
  doNotLog?: boolean,
): GenericAction<T, T> => ({
  type,
  payload: data,
  path,
  reducer: (state: T, payload: T) => payload,
  doNotLog,
})
