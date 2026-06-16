import { ThemedView } from '@/components/themed-view'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { useToast } from '@/components/ui/toast'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useCartStore } from '@/store/cartStore'
import { formatMoney } from '@/utils/format'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function CheckoutScreen() {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light
  const itemsMap = useCartStore((s) => s.items)
  const items = React.useMemo(() => Object.values(itemsMap), [itemsMap])
  const clear = useCartStore((s) => s.clear)
  const toast = useToast()
  const router = useRouter()

  const [loading, setLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const [address, setAddress] = React.useState('')

  const subtotal = items.reduce((acc, it) => acc + ((it.price ?? 0) * it.qty), 0)
  const shipping = items.length > 0 ? 5.99 : 0
  const total = subtotal + shipping

  const handlePlaceOrder = React.useCallback(async () => {
    if (items.length === 0) {
      toast.show('El carrito está vacío')
      return
    }
    setLoading(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900))
    await clear()
    setLoading(false)
    toast.show('Pedido enviado correctamente')
    // navigate back to catalog
    router.push('/(tabs)/catalog')
  }, [items, clear, toast, router])

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.row, { backgroundColor: active.card, borderColor: active.border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, { color: active.text }]} numberOfLines={1}>{item.name} {item.size ? `(${item.size})` : ''}</Text>
        <Text style={styles.meta}>{formatMoney(item.price)} × {item.qty}</Text>
      </View>
      <Text style={[styles.lineTotal, { color: active.text }]}>{formatMoney((item.price ?? 0) * item.qty)}</Text>
    </View>
  )

  return (
    <ThemedView style={[styles.container, { backgroundColor: active.background }]}>
      <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
        <HamburgerButton />
        <Text style={[styles.appBarTitle, { color: active.text }]}>Finalizar compra</Text>
      </View>
      <FlatList data={items} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />

      <View style={[styles.form, { backgroundColor: active.card, borderColor: active.border }]}>
        <TextInput placeholder="Nombre" placeholderTextColor="#9ca3af" value={name} onChangeText={setName} style={[styles.input, { color: active.text }]} />
        <TextInput placeholder="Dirección de envío" placeholderTextColor="#9ca3af" value={address} onChangeText={setAddress} style={[styles.input, { color: active.text }]} />
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: active.text }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: active.text }]}>{formatMoney(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: active.text }]}>Envío</Text>
          <Text style={[styles.summaryValue, { color: active.text }]}>{formatMoney(shipping)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: active.text, fontWeight: '900' }]}>Total</Text>
          <Text style={[styles.summaryValue, { color: active.text, fontWeight: '900' }]}>{formatMoney(total)}</Text>
        </View>

        <TouchableOpacity onPress={handlePlaceOrder} style={[styles.placeBtn, { backgroundColor: active.secondary }]} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '800' }}>Pagar y enviar pedido</Text>}
        </TouchableOpacity>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginLeft: 8,
  },
  form: { padding: 12, borderTopWidth: 1 },
  input: { padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  summaryLabel: { color: '#374151' },
  summaryValue: { color: '#374151' },
  placeBtn: { padding: 14, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  row: { flexDirection: 'row', padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 8, alignItems: 'center' },
  name: { fontWeight: '800' },
  meta: { color: '#6b7280' },
  lineTotal: { marginLeft: 12, fontWeight: '900' }
})
