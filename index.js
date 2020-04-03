import React from 'react'
import {AppRegistry} from 'react-native'
import {Provider} from 'react-redux'

import App from './src/App'
import getConfiguredStore from './src/redux/configureStore'
import {name as appName} from './src/app.json'

const store = getConfiguredStore()

const AppWithStore = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => AppWithStore)
