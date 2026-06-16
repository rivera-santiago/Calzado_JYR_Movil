import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = { value: number; onChange: (v: number) => void; min?: number; max?: number }

export function QuantityPicker({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={() => onChange(Math.max(min, value - 1))} style={styles.btn}><Text style={{ fontSize: 18 }}>−</Text></TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity onPress={() => onChange(Math.min(max, value + 1))} style={styles.btn}><Text style={{ fontSize: 18 }}>+</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center' }, btn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }, value: { marginHorizontal: 8, fontWeight: '800' } })
