import { useQuery } from '@tanstack/react-query';
import { Info, MessageCircle, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchCategoriesAPI, fetchProductsAPI } from '@/services/api';
import { Product } from '@/services/publicCatalogService';

export default function CatalogScreen() {
  const colorScheme = useColorScheme();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // TanStack Query to fetch products and categories
  const { 
    data: products = [], 
    isLoading: isLoadingProducts, 
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts,
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProductsAPI(selectedCategory || undefined),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoriesAPI,
  });

  const handleRefresh = useCallback(() => {
    refetchProducts();
  }, [refetchProducts]);

  // Filter products locally by search query
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.color && product.color.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleWhatsAppInquiry = (product: Product) => {
    const message = `Hola Calzado J&R, estoy interesado en el producto: ${product.name} (Color: ${product.color || 'No especificado'}). ¿Tienen disponibilidad?`;
    const phoneNumber = '+51999999999'; // Simulated company WhatsApp phone number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('No se pudo abrir WhatsApp en este dispositivo');
    });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={[styles.productCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' }} style={styles.productImage} />
          </View>
        )}
        {item.color && (
          <View style={[styles.colorBadge, { backgroundColor: activeColors.primary }]}>
            <Text style={styles.colorBadgeText}>{item.color}</Text>
          </View>
        )}
      </View>

      {/* Product Body */}
      <View style={styles.productBody}>
        <Text style={[styles.productName, { color: activeColors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productDesc} numberOfLines={2}>
          {item.description || 'Sin descripción disponible.'}
        </Text>

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.whatsappButton, { backgroundColor: '#25D366' }]}
            onPress={() => handleWhatsAppInquiry(item)}
          >
            <MessageCircle size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.whatsappButtonText}>Cotizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.detailsButton, { borderColor: activeColors.border }]}
            onPress={() => alert(`${item.name}\n\n${item.description || 'Detalles del calzado premium'}`)}
          >
            <Info size={16} color={activeColors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: activeColors.text }]}>Catálogo J&R</Text>
        <Text style={styles.headerSubtitle}>Explora nuestras colecciones exclusivas</Text>
      </View>

      {/* Search Input Container */}
      <View style={[styles.searchWrapper, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
        <Search size={20} color={activeColors.icon} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: activeColors.text }]}
          placeholder="Buscar zapatos por nombre, color..."
          placeholderTextColor={activeColors.icon}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={{ color: activeColors.icon, fontWeight: '700', paddingHorizontal: 8 }}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills Slider */}
      <View style={styles.categoriesSlider}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          <TouchableOpacity
            style={[
              styles.categoryPill,
              {
                backgroundColor: selectedCategory === null ? activeColors.primary : activeColors.card,
                borderColor: selectedCategory === null ? activeColors.primary : activeColors.border,
              },
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, { color: selectedCategory === null ? '#ffffff' : activeColors.text }]}>
              Todos
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                {
                  backgroundColor: selectedCategory === cat.id ? activeColors.primary : activeColors.card,
                  borderColor: selectedCategory === cat.id ? activeColors.primary : activeColors.border,
                },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.categoryText, { color: selectedCategory === cat.id ? '#ffffff' : activeColors.text }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products FlatList */}
      {isLoadingProducts ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={activeColors.primary} />
          <Text style={[styles.loaderText, { color: activeColors.icon }]}>Cargando catálogo...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SlidersHorizontal size={48} color={activeColors.icon} style={{ marginBottom: 12, opacity: 0.5 }} />
          <Text style={[styles.emptyTitle, { color: activeColors.text }]}>Sin Resultados</Text>
          <Text style={styles.emptySubtitle}>No encontramos calzados que coincidan con tu búsqueda.</Text>
          <TouchableOpacity style={[styles.resetBtn, { backgroundColor: activeColors.primary }]} onPress={() => { setSearchQuery(''); setSelectedCategory(null); }}>
            <Text style={styles.resetBtnText}>Reestablecer filtros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingProducts}
              onRefresh={handleRefresh}
              colors={[activeColors.primary]}
              tintColor={activeColors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesSlider: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  colorBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  productBody: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    lineHeight: 15,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsappButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  detailsButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  fontWeight: '500',
    marginBottom: 20,
  },
  resetBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  resetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
});
