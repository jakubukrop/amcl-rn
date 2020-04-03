import thunk from 'redux-thunk'
import {createStore, applyMiddleware, Store, Middleware} from 'redux'
import {createLogger} from 'redux-logger'

import rootReducer from './rootReducer'
import {getInitialState, State} from './state'
import {GetState, GenericAction} from './types'

export default () => {
  const middlewares: Array<Middleware> = [thunk]

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    const loggerMiddleware = createLogger({
      collapsed: true,
      predicate: (getState: GetState, action: GenericAction<any, any>) =>
        !action.doNotLog,
    })
    // logger middleware must always be last
    middlewares.push(loggerMiddleware)
  }

  const store: Store<State, GenericAction<any, any>> = createStore(
    rootReducer,
    getInitialState(),
    applyMiddleware(...middlewares),
  )
  return store
}
