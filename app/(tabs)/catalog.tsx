import { Ionicons } from '@expo/vector-icons'
import { FilterChips } from '@/components/ui/filter-chips'
import { ProductList } from '@/components/ui/product-list'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { SearchBar } from '@/components/ui/search-bar'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useProducts } from '@/hooks/useProducts'
import { fetchCategoriesAPI } from '@/services/api'
import { Category } from '@/services/publicCatalogService'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React from 'react'
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

function categoryIcon(name: string): keyof typeof Ionicons.glyphMap {
  const map: Record<string, keyof typeof Ionicons.glyphMap> = {
    caballero: 'man-outline',
    dama: 'woman-outline',
    infantil: 'accessibility-outline',
  }
  return map[name.toLowerCase()] || 'pricetag-outline'
}

export default function CatalogScreen() {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light
  const [query, setQuery] = React.useState('')
  const [categoryIds, setCategoryIds] = React.useState<string[]>([])

  const fadeAnim = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start()
  }, [fadeAnim])

  const { data: cats = [] } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategoriesAPI, staleTime: 1000 * 60 * 10 })
  const router = useRouter()

  const { data: products = [], isLoading, isError, refetch, isFetching } = useProducts({ search: query, categoryIds })

  return (
    <Animated.View style={[styles.container, { backgroundColor: active.background, opacity: fadeAnim }]}>
      <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={active.text} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: active.text }]}>Catálogo</Text>
        <HamburgerButton />
      </View>
      <SearchBar placeholder="Buscar productos, color, etc." initialValue={query} onDebouncedChange={(v) => setQuery(v)} />
      <FilterChips
        items={(cats && cats.length > 0 ? cats : [{ id: 'caballero', name: 'Caballero' }, { id: 'dama', name: 'Dama' }, { id: 'infantil', name: 'Infantil' }]).map((c) => ({ id: c.id, name: c.name, icon: categoryIcon(c.name) }))}
        selected={categoryIds}
        onChange={setCategoryIds}
        allowMulti
      />
      <ProductList
        data={products}
        isLoading={isLoading}
        isError={!!isError}
        isRefreshing={isFetching}
        onRefresh={() => refetch()}
        onPressItem={(id) => router.push({ pathname: '/(tabs)/productDetail', params: { id } })}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
    marginLeft: 12,
  },
  backBtn: {
    padding: 8,
    borderRadius: 10,
  },
  search: { flexDirection: 'row', alignItems: 'center', padding: 12, margin: 12, borderRadius: 12, borderWidth: 1 },
  input: { marginLeft: 8, flex: 1, fontWeight: '600' }
})
