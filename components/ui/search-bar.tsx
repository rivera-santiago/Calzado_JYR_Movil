import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Search } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

type Props = {
  placeholder?: string
  initialValue?: string
  onDebouncedChange?: (value: string) => void
  debounceMs?: number
}

export function SearchBar({ placeholder = 'Buscar', initialValue = '', onDebouncedChange, debounceMs = 300 }: Props) {
  const [text, setText] = React.useState(initialValue)
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light

  React.useEffect(() => {
    const t = setTimeout(() => {
      onDebouncedChange && onDebouncedChange(text)
    }, debounceMs)
    return () => clearTimeout(t)
  }, [text, debounceMs, onDebouncedChange])

  return (
    <View style={[styles.container, { backgroundColor: active.card, borderColor: active.border }]}> 
      <Search size={18} color={active.icon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={active.icon}
        value={text}
        onChangeText={setText}
        style={[styles.input, { color: active.text }]}
        accessibilityLabel={placeholder}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 12, margin: 12, borderRadius: 12, borderWidth: 1 },
  input: { marginLeft: 8, flex: 1, fontWeight: '600' }
})
