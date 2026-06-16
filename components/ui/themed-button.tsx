import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

type Props = React.ComponentProps<typeof TouchableOpacity> & {
  title: string
}

export function ThemedButton({ title, style, ...rest }: Props) {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light

  return (
    <TouchableOpacity style={[styles.btn, { backgroundColor: active.primary }, style]} {...rest}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '800' }
})
