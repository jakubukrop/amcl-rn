import React, {useState} from 'react'
import {Text, View, Button, NativeModules} from 'react-native'

export default function App() {
  const [error, setError] = useState('')
  const [pk, setPk] = useState('')
  const [sk, setSk] = useState('')
  const [sig, setSig] = useState('')
  const [verified, setVerified] = useState('')

  const msg = 'To be or not to be.'

  const onGenerateKeys = async () => {
    try {
      // TODO use seed
      const keys = await NativeModules.Bls.keyPairGenerate('')
      setPk(keys.pk || '')
      setSk(keys.sk || '')
      setSig('')
      setVerified('')
    } catch (err) {
      setError(`KeyPairGenerate error: ${err}`)
    }
  }

  const onSign = async () => {
    try {
      const sig = await NativeModules.Bls.sign(msg, sk)
      setSig(sig)
      setVerified('')
    } catch (err) {
      setError(`Sign error: ${err}`)
    }
  }

  const onVerify = async () => {
    try {
      const verified = await NativeModules.Bls.verify(sig, msg, pk)
      setVerified(verified ? 'Succeded' : 'Failed')
    } catch (err) {
      setError(`Verify error: ${err}`)
    }
  }

  return (
    <View>
      <Text>AMCL showcase</Text>

      <Button title="Generate keys" onPress={onGenerateKeys} />
      <Text>PK: {pk}</Text>
      <Text>SK: {sk}</Text>

      <Button title="Sign message" onPress={onSign} disabled={!sk.length} />
      <Text>Msg: "{msg}"</Text>
      <Text>Sig: {sig}</Text>

      <Button
        title="Verify signature"
        onPress={onVerify}
        disabled={!pk.length || !sig.length}
      />
      <Text>Verified: {verified}</Text>
      {!error.length ? null : <Text>Error: {error}</Text>}
    </View>
  )
}
