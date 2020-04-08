import React from 'react'
import {Text, View, TextInput, Button} from 'react-native'
import {useForm, Controller} from 'react-hook-form'
import {useSelector, useDispatch} from 'react-redux'

import {firstNameSelector, lastNameSelector} from '../selectors/base'
import {updateValue} from '../redux/utils'

import styles from './Form.style'

type FormData = {
  firstName: string
  lastName: string
}

export default function App() {
  const dispatch = useDispatch()
  const firstName = useSelector(firstNameSelector)
  const lastName = useSelector(lastNameSelector)

  const {control, handleSubmit, errors} = useForm<FormData>()

  const onSubmit = handleSubmit(({firstName, lastName}) => {
    dispatch(updateValue(['firstName'], firstName))
    dispatch(updateValue(['lastName'], lastName))
  })

  return (
    <View>
      <Text>First name</Text>
      <Controller
        as={TextInput}
        control={control}
        name="firstName"
        onChange={(args) => args[0].nativeEvent.text}
        rules={{required: true}}
        defaultValue={firstName}
        style={styles.textInput}
      />
      {errors.firstName && <Text>This is required.</Text>}

      <Text>Last name</Text>
      <Controller
        as={TextInput}
        control={control}
        name="lastName"
        onChange={(args) => args[0].nativeEvent.text}
        defaultValue={lastName}
        style={styles.textInput}
      />

      <Button title="Submit" onPress={onSubmit} />
    </View>
  )
}
