import { ThemedView } from '@/components/themed-view'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useCartStore } from '@/store/cartStore'
import { formatMoney } from '@/utils/format'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function CartScreen() {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light
  const itemsMap = useCartStore((s) => s.items)
  const remove = useCartStore((s) => s.remove)
  const updateQty = useCartStore((s) => s.updateQty)
  const toast = useToast()
  const router = useRouter()

  const items = React.useMemo(() => Object.values(itemsMap), [itemsMap])
  const total = React.useMemo(() => items.reduce((acc, it) => acc + ((it.price ?? 0) * it.qty), 0), [items])

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.row, { backgroundColor: active.card, borderColor: active.border }]}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: active.text }]} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta}>{formatMoney(item.price)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => updateQty(item.id, Math.max(1, item.qty - 1))} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
        <Text style={styles.qtyText}>{item.qty}</Text>
        <TouchableOpacity onPress={() => updateQty(item.id, item.qty + 1)} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => { remove(item.id); toast.show('Eliminado'); }} style={styles.removeBtn}><Text>Eliminar</Text></TouchableOpacity>
      </View>
    </View>
  )

  return (
    <ThemedView style={[styles.container, { backgroundColor: active.background }]}>
      <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
        <HamburgerButton />
        <Text style={[styles.appBarTitle, { color: active.text }]}>Carrito</Text>
      </View>
      <View style={{ flex: 1 }}>
        {items.length === 0 ? (
          <EmptyState title="Carrito vacío" subtitle="No tienes productos en el carrito" />
        ) : (
          <FlatList data={items} keyExtractor={(i) => i.id} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />
        )}
      </View>

      {items.length > 0 && (
        <View style={[styles.footer, { backgroundColor: active.card, borderColor: active.border }]}>
          <Text style={[styles.total, { color: active.text }]}>Total: {formatMoney(total)}</Text>
          <View style={styles.footerBtns}>
            <TouchableOpacity onPress={() => { router.push('/(tabs)/checkout') }} style={[styles.checkoutBtn, { backgroundColor: active.secondary }]}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>Finalizar compra</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', padding: 12, borderRadius: 8, borderWidth: 1, marginBottom: 12, alignItems: 'center' },
  info: { flex: 1 },
  name: { fontWeight: '800' },
  meta: { color: '#64748b' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  qtyText: { fontWeight: '800' },
  removeBtn: { marginLeft: 8 },
  footer: { padding: 12, borderTopWidth: 1 },
  total: { fontSize: 18, fontWeight: '900' },
  footerBtns: { marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },
  checkoutBtn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 }
})
