import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { Product } from '@/services/publicCatalogService'
import { useFavoritesStore } from '@/store/favoritesStore'
import { Heart } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ImageWithPlaceholder } from './image-with-placeholder'
import { useToast } from './toast'

export type ProductItem = Product

type Props = {
  item: ProductItem
  onPress?: (id: string) => void
}

function ProductCardInner({ item, onPress }: Props) {
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light
  const isFav = useFavoritesStore((s) => s.isFavorite(item.id))
  const toggle = useFavoritesStore((s) => s.toggle)
  const toast = useToast()

  const handlePress = React.useCallback(() => { if (onPress) onPress(item.id) }, [onPress, item.id])

  const handleToggle = React.useCallback(async () => {
    await toggle(item.id)
    toast.show(isFav ? 'Eliminado de favoritos' : 'Añadido a favoritos')
  }, [toggle, item.id, isFav, toast])

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Producto ${item.name}`}
      style={[styles.card, { backgroundColor: active.card, borderColor: active.border }]}
      onPress={handlePress}
    >
      <View style={styles.imageWrap}>
        <ImageWithPlaceholder uri={item.image_url ?? null} style={styles.image} />
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={isFav ? 'Quitar favorito' : 'Agregar favorito'} style={styles.favBtn} onPress={handleToggle}>
          <Heart size={18} color={isFav ? '#ef4444' : active.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, { color: active.text }]} numberOfLines={1}>{item.name}</Text>
        {item.color && <Text style={styles.meta}>{item.color}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export const ProductCard = React.memo(ProductCardInner)

const styles = StyleSheet.create({
  card: { flex: 1, margin: 8, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  imageWrap: { width: '100%', height: 140, backgroundColor: '#fafafa' },
  image: { width: '100%', height: '100%' },
  body: { padding: 10 },
  title: { fontWeight: '800', fontSize: 14 },
  meta: { marginTop: 4, color: '#64748b', fontSize: 12 },
  favBtn: { position: 'absolute', top: 8, right: 8, padding: 6, borderRadius: 16 }
})
