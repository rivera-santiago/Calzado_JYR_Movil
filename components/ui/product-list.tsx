import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import React from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { EmptyState } from './empty-state'
import { ProductCard, ProductItem } from './product-card'
import { SkeletonLoader } from './skeleton-loader'

type Props = {
  data: ProductItem[]
  isLoading?: boolean
  isError?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
  onPressItem?: (id: string) => void
}

const ITEM_HEIGHT = 260 // estimated card height including margins
const NUM_COLUMNS = 2

export function ProductList({ data, isLoading, isError, onRefresh, onPressItem, isRefreshing }: Props) {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light

  const keyExtractor = React.useCallback((p: ProductItem) => p.id, [])

  const renderItem = React.useCallback(
    ({ item }: { item: ProductItem }) => <ProductCard item={item} onPress={onPressItem} />,
    [onPressItem]
  )

  const getItemLayout = React.useCallback(
    (_data: unknown, index: number) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }),
    []
  )

  if (isLoading) return <SkeletonLoader rows={6} />
  if (isError) return <View style={[styles.container, { backgroundColor: active.background }]}><EmptyState title="Error" subtitle="No se pudo cargar el catálogo" /></View>
  if (!data || data.length === 0) return <View style={[styles.container, { backgroundColor: active.background }]}><EmptyState title="Catálogo vacío" subtitle="No hay productos que coincidan" /></View>

  return (
    <FlatList
      data={data}
      initialNumToRender={8}
      windowSize={9}
      removeClippedSubviews
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ padding: 8 }}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      maxToRenderPerBatch={8}
      refreshControl={<RefreshControl refreshing={!!isRefreshing} onRefresh={onRefresh} />}
    />
  )
}

const styles = StyleSheet.create({ container: { flex: 1 } })
