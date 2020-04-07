import React from 'react'
import {ScrollView, View} from 'react-native'

import CryptoShowcase from './CryptoShowcase'
import styles from './Root.style'

const Root = () => {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.scrollView}>
      <View style={styles.body}>
        <CryptoShowcase />
      </View>
    </ScrollView>
  )
}

export default Root
