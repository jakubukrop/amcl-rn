import React from 'react'
import {ScrollView, View} from 'react-native'

import Form from './Form'
import styles from './Root.style'

const Root = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}>
      <View style={styles.body}>
        <Form />
      </View>
    </ScrollView>
  )
}

export default Root
