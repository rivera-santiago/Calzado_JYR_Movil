import { StyleSheet, View } from 'react-native'

export function SkeletonLoader({ rows = 4 }: { rows?: number }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.row} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  row: { height: 14, backgroundColor: '#eee', marginBottom: 10, borderRadius: 6 }
})
