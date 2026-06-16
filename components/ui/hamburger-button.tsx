import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'

import { useDrawer } from '@/components/ui/hamburger-menu'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export function HamburgerButton() {
  const colorScheme = useColorScheme()
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light
  const { open } = useDrawer()

  return (
    <TouchableOpacity onPress={open} style={styles.button} activeOpacity={0.7}>
      <Ionicons name="menu" size={24} color={activeColors.text} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 10,
  },
})
