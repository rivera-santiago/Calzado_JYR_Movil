import { Ionicons } from '@expo/vector-icons'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { EmptyState } from '@/components/ui/empty-state'
import { ProductList } from '@/components/ui/product-list'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/services/publicCatalogService'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useRouter } from 'expo-router'
import React from 'react'
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function FavoritesScreen() {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light
  const router = useRouter()

  const fadeAnim = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start()
  }, [fadeAnim])

  const favorites = useFavoritesStore((s) => s.favorites)
  const favoriteIds = React.useMemo(() => Object.keys(favorites).filter((k) => favorites[k]), [favorites])

  const { data: products = [], isLoading, isError, refetch, isFetching } = useProducts({})

  const favProducts = React.useMemo(() => products.filter((p: Product) => favoriteIds.includes(p.id)), [products, favoriteIds])

  return (
    <Animated.View style={{ flex: 1, backgroundColor: active.background, opacity: fadeAnim }}>
      <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={active.text} />
        </TouchableOpacity>
        <Text style={[styles.appBarTitle, { color: active.text }]}>Mis Favoritos</Text>
        <HamburgerButton />
      </View>
      {favoriteIds.length === 0 && !isLoading ? (
        <EmptyState title="Sin favoritos" subtitle="Agrega productos a favoritos desde el catálogo" />
      ) : (
        <ProductList
          data={favProducts}
          isLoading={isLoading}
          isError={!!isError}
          isRefreshing={isFetching}
          onRefresh={() => refetch()}
          onPressItem={(id) => router.push({ pathname: '/(tabs)/productDetail', params: { id } })}
        />
      )}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
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
})
