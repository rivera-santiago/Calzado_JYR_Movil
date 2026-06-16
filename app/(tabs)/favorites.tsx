import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { EmptyState } from '@/components/ui/empty-state'
import { ProductList } from '@/components/ui/product-list'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/services/publicCatalogService'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useRouter } from 'expo-router'
import React from 'react'
import { Animated, View } from 'react-native'

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

  if (favoriteIds.length === 0 && !isLoading) {
    return (
      <Animated.View style={{ flex: 1, backgroundColor: active.background, opacity: fadeAnim }}>
        <EmptyState title="Sin favoritos" subtitle="Agrega productos a favoritos desde el catálogo" />
      </Animated.View>
    )
  }

  return (
    <Animated.View style={{ flex: 1, backgroundColor: active.background, opacity: fadeAnim }}>
      <View style={{ padding: 12, paddingBottom: 0 }}>
        <ThemedText type="title">Mis Favoritos</ThemedText>
      </View>
      <ProductList
        data={favProducts}
        isLoading={isLoading}
        isError={!!isError}
        isRefreshing={isFetching}
        onRefresh={() => refetch()}
        onPressItem={(id) => router.push({ pathname: '/(tabs)/productDetail', params: { id } })}
      />
    </Animated.View>
  )
}
