import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Chip = { id: string; name: string; icon?: keyof typeof Ionicons.glyphMap }

type Props = {
  items: Chip[]
  selected?: string[]
  onChange?: (selectedIds: string[]) => void
  allowMulti?: boolean
}

const DEFAULT_ICON: keyof typeof Ionicons.glyphMap = 'pricetag-outline'

export function FilterChips({ items, selected = [], onChange, allowMulti = true }: Props) {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light

  const toggle = (id: string) => {
    const exists = selected.includes(id)
    let next: string[]
    if (allowMulti) {
      next = exists ? selected.filter((s) => s !== id) : [...selected, id]
    } else {
      next = exists ? [] : [id]
    }
    onChange && onChange(next)
  }

  const selectAll = () => {
    onChange && onChange([])
  }

  return (
    <View style={{ paddingHorizontal: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <TouchableOpacity
          style={[styles.chip, { backgroundColor: selected.length === 0 ? active.primary : active.card, borderColor: active.border }]}
          onPress={selectAll}
        >
          <Text style={[styles.chipText, { color: selected.length === 0 ? '#fff' : active.text }]}>Todos</Text>
        </TouchableOpacity>
        {items.map((it) => {
          const isSel = selected.includes(it.id)
          const iconName = it.icon || DEFAULT_ICON
          return (
            <TouchableOpacity key={it.id} style={[styles.chip, { backgroundColor: isSel ? active.primary : active.card, borderColor: active.border }]} onPress={() => toggle(it.id)}>
              <Ionicons name={iconName} size={14} color={isSel ? '#fff' : active.text} style={{ marginRight: 6 }} />
              <Text style={[styles.chipText, { color: isSel ? '#fff' : active.text }]}>{it.name}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { paddingVertical: 8, alignItems: 'center', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1, marginRight: 8 },
  chipText: { fontSize: 13, fontWeight: '700' },
})
