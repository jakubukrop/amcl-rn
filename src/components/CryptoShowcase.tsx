import React, {useState} from 'react'
import {Text, TextInput, View, Button, NativeModules} from 'react-native'
import {useForm, Controller} from 'react-hook-form'

import styles from './Form.style'

type FormData = {
  msg: string
}

export default function App() {
  const [error, setError] = useState('')
  const [seed] = useState('1234')

  const [pk, setPk] = useState('')
  const [sk, setSk] = useState('')

  const [msg, setMsg] = useState('To be or not to be.')
  const [sig, setSig] = useState('')
  const [verified, setVerified] = useState('')

  const {control, handleSubmit} = useForm<FormData>()

  const onGenerateKeys = handleSubmit(async () => {
    try {
      const keys = await NativeModules.Bls.keyPairGenerate(seed)
      setPk(keys.pk || '')
      setSk(keys.sk || '')
      setVerified('')
    } catch (err) {
      setError(`KeyPairGenerate error: ${err}`)
    }
  })

  const onSign = handleSubmit(async ({msg}) => {
    setMsg(msg)
    try {
      const sig = await NativeModules.Bls.sign(msg, sk)
      setSig(sig)
      setVerified('')
    } catch (err) {
      setError(`Sign error: ${err}`)
    }
  })

  const onVerify = handleSubmit(async ({msg}) => {
    setMsg(msg)
    try {
      const verified = await NativeModules.Bls.verify(sig, msg, pk)
      setVerified(verified ? 'Succeded' : 'Failed')
    } catch (err) {
      setError(`Verify error: ${err}`)
    }
  })

  return (
    <View>
      <Text>AMCL BLS showcase</Text>

      <Button title="Generate keys" onPress={onGenerateKeys} />
      <Text>Public Key (base64)</Text>
      <Text style={styles.output}>{pk}</Text>
      <Text>Secret Key (base64)</Text>
      <Text style={styles.output}>{sk}</Text>

      <Text>Message</Text>
      <Controller
        as={TextInput}
        control={control}
        name="msg"
        onChange={(args) => args[0].nativeEvent.text}
        defaultValue={msg}
        style={styles.textInput}
      />

      <Button title="Sign message" onPress={onSign} disabled={!sk.length} />
      <Text>Signature (base64)</Text>
      <Text style={styles.output}>{sig}</Text>

      <Button
        title="Verify signature"
        onPress={onVerify}
        disabled={!pk.length || !sig.length}
      />
      <Text>Verified</Text>
      <Text style={styles.output}>{verified}</Text>
      {!error.length ? null : <Text>Error: {error}</Text>}
    </View>
  )
}
