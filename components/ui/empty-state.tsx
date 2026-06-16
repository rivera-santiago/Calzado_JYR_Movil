import { StyleSheet, Text, View } from 'react-native';

export function EmptyState({ title = 'Sin resultados', subtitle }: { title?: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: 24 },
  title: { fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#64748b' }
})
