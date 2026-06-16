import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { HamburgerButton } from '@/components/ui/hamburger-button'
import { useToast } from '@/components/ui/toast'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { fetchCategoriesAPI, fetchProductsAPI } from '@/services/api'
import { Category, Product } from '@/services/publicCatalogService'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { formatMoney } from '@/utils/format'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { Heart, MessageCircle, Share2 } from 'lucide-react-native'
import React from 'react'
import { Animated, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ProductDetail() {
  const params = useLocalSearchParams() as { id?: string }
  const id = params.id
  // router not used: navigation handled by parent screens
  const colorScheme = useColorScheme()
  const active = colorScheme === 'dark' ? Colors.dark : Colors.light

  const screenOpacity = React.useRef(new Animated.Value(0)).current
  React.useEffect(() => {
    Animated.timing(screenOpacity, { toValue: 1, duration: 350, useNativeDriver: true }).start()
  }, [screenOpacity])

  const { data: products = [], isLoading } = useQuery<Product[]>({ queryKey: ['products', 'detail', id], queryFn: () => fetchProductsAPI() })
  const product: Product | null = products.find((p) => p.id === id) || null
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ['categories'], queryFn: fetchCategoriesAPI })
  const category: Category | undefined = categories.find((c) => c.id === product?.category_id)

  const handleWhatsApp = React.useCallback(() => {
    if (!product) return
    const phone = '+51999999999'
    const message = `Hola, estoy interesado en ${product.name} (Color: ${product.color || 'No especificado'})`
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    void Linking.openURL(url).catch(() => alert('No se pudo abrir WhatsApp'))
  }, [product])

  const imageOpacity = React.useRef(new Animated.Value(0)).current
  const isFav = useFavoritesStore((s) => s.isFavorite(product?.id ?? ''))
  const toggle = useFavoritesStore((s) => s.toggle)
  const toast = useToast()

  const [selectedSize, setSelectedSize] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState<number>(1)

  const handleShare = React.useCallback(async () => {
    if (!product) return
    try {
      await Share.share({ message: `${product.name} - ${product.description || ''}` })
    } catch (e) {
      console.warn('Share failed', e)
    }
  }, [product])

  const handleToggleFav = React.useCallback(async () => {
    if (!product) return
    await toggle(product.id)
    toast.show(isFav ? 'Eliminado de favoritos' : 'Añadido a favoritos')
  }, [product, toggle, isFav, toast])

  const increaseQty = React.useCallback(() => setQuantity((q) => Math.min(10, q + 1)), [])
  const decreaseQty = React.useCallback(() => setQuantity((q) => Math.max(1, q - 1)), [])

  const handleAddToCart = React.useCallback(() => {
    if (!product) return
    const toAdd = {
      id: product.id,
      name: product.name,
      price: product.price ?? 199.9,
      image_url: product.image_url ?? null,
      qty: quantity,
      size: selectedSize ?? null,
    }
    void useCartStore.getState().add(toAdd)
    toast.show(`Añadido ${quantity} × ${product.name} ${selectedSize ? '(' + selectedSize + ')' : ''}`)
  }, [product, quantity, selectedSize, toast])

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: active.background }]}>
        <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
          <HamburgerButton />
          <Text style={[styles.appBarTitle, { color: active.text }]}>Detalle de Producto</Text>
        </View>
        <ThemedText style={{ padding: 20 }}>Cargando...</ThemedText>
      </ThemedView>
    )
  }

  if (!product) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: active.background }]}>
        <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
          <HamburgerButton />
          <Text style={[styles.appBarTitle, { color: active.text }]}>Detalle de Producto</Text>
        </View>
        <ThemedText style={{ padding: 20 }}>Producto no encontrado</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={[styles.container]}>
      <View style={[styles.appBar, { backgroundColor: active.card, borderBottomColor: active.border }]}>
        <HamburgerButton />
        <Text style={[styles.appBarTitle, { color: active.text }]}>{product.name || 'Detalle'}</Text>
      </View>
      <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={[styles.headerRow, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ThemedText type="defaultSemiBold" style={styles.headerTitle}>{category?.name || 'Catálogo'}</ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginRight: 12 }} onPress={handleToggleFav} accessibilityRole="button" accessibilityLabel={isFav ? 'Quitar favorito' : 'Agregar favorito'}>
                <Heart size={20} color={isFav ? '#ef4444' : active.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} accessibilityRole="button">
                <Share2 size={18} color={active.text} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.cardWrap, { backgroundColor: active.card, borderColor: active.border }]}>
          {product.image_url ? (
            <Animated.Image
              source={{ uri: product.image_url }}
              style={[styles.image, { opacity: imageOpacity }]}
              onLoad={() => Animated.timing(imageOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start()}
            />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: active.card }]} />
          )}

          <View style={styles.body}>
            <ThemedText type="title" style={styles.title}>{product.name}</ThemedText>
            <Text style={styles.price}>{formatMoney(product.price ?? 199.9)}</Text>
            {category && <ThemedText type="defaultSemiBold" style={styles.collection}>Colección: {category.name}</ThemedText>}
            {product.color && <ThemedText style={styles.color}>Color: {product.color}</ThemedText>}
            <ThemedText style={[styles.desc]}>{product.description || 'Sin descripción disponible.'}</ThemedText>

            <View style={styles.sizesRow}>
              {['35','36','37','38','39','40'].map((s) => (
                <TouchableOpacity key={s} accessibilityRole="button" onPress={() => setSelectedSize(s)} style={[styles.sizeChip, selectedSize === s && { borderColor: active.secondary, backgroundColor: active.secondary + '12' }]}>
                  <Text style={[styles.sizeText, { color: active.text }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity onPress={decreaseQty} style={styles.qtyBtn}><Text style={{ fontSize: 18 }}>−</Text></TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQty} style={styles.qtyBtn}><Text style={{ fontSize: 18 }}>+</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.addToCart, { backgroundColor: active.secondary }]} onPress={handleAddToCart}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>Agregar al carrito</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.cta, { backgroundColor: '#25D366', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]} onPress={handleWhatsApp}>
              <MessageCircle size={18} color="#fff" style={{ marginRight: 8 }} />
              <ThemedText style={styles.ctaText}>Cotizar por WhatsApp</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </Animated.View>
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
    flex: 1,
  },
  cardWrap: { margin: 16, borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 },
  backBtn: { padding: 8, borderRadius: 10, marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: '800' },
  image: { width: '100%', height: 320 },
  imagePlaceholder: { width: '100%', height: 320 },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  color: { fontSize: 13, color: '#64748b', marginBottom: 8 },
  collection: { fontSize: 13, color: '#475569', fontWeight: '700', marginBottom: 6 },
  desc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  cta: { padding: 14, borderRadius: 12, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800' }
  ,
  price: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  sizesRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  sizeChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  sizeText: { fontSize: 13, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  qtyBtn: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  qtyText: { fontSize: 16, fontWeight: '800' },
  addToCart: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, marginLeft: 12 }
})

