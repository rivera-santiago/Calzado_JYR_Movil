import { useRouter } from 'expo-router';
import {
    Award,
    Factory,
    Heart,
    LayoutDashboard,
    LogIn,
    MessageCircle,
    Package,
    Palette,
    Ruler,
    ShieldCheck,
    Star,
} from 'lucide-react-native';
import {
    Animated,
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { HamburgerButton } from '@/components/ui/hamburger-button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';
import React from 'react';

// width not currently used but kept for future responsive tweaks

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuthStore();
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start()
  }, [fadeAnim])

  const categories = [
    {
      id: 'caballero',
      name: 'Caballero',
      desc: 'Zapatos de vestir, Oxford, Botas casuales',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'dama',
      name: 'Dama',
      desc: 'Tacos de gala, sandalias, baletas confortables',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'infantil',
      name: 'Infantil',
      desc: 'Zapatillas interactivas, calzado ergonómico',
      image: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=600&auto=format&fit=crop',
    },
  ];

  const benefits = [
    { icon: Package, title: 'Amplia Variedad', desc: 'Catálogos completos en múltiples colores y estilos.' },
    { icon: Ruler, title: 'Todas las Tallas', desc: 'Hormas perfectas ajustadas a medidas nacionales.' },
    { icon: ShieldCheck, title: 'Calidad J&R', desc: 'Materiales nobles seleccionados de alta gama.' },
    { icon: Star, title: 'Garantía Total', desc: 'Respaldo absoluto contra cualquier defecto.' },
  ];

  const values = [
    { icon: Factory, title: 'Producción Nacional', desc: 'Calzados hechos a mano apoyando la industria peruana.' },
    { icon: Award, title: 'Experiencia y Oficio', desc: 'Más de 15 años perfeccionando el arte del calzado.' },
    { icon: Palette, title: 'Diseños Exclusivos', desc: 'Líneas elegantes que combinan moda contemporánea y confort.' },
    { icon: Heart, title: 'Pasión por el Detalle', desc: 'Cada costura y acabado es revisado minuciosamente.' },
  ];

  const handleWhatsAppContact = () => {
    const message = 'Hola Calzado J&R, vengo desde la aplicación móvil. Me gustaría recibir asesoramiento personalizado.';
    const phoneNumber = '+51999999999';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      alert('No se pudo abrir WhatsApp en este dispositivo');
    });
  };

  const handleCategoryPress = () => {
    router.push('/(tabs)/catalog');
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={[styles.container, { backgroundColor: activeColors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
        {/* Dynamic Top App Bar */}
        <View style={[styles.appBar, { backgroundColor: activeColors.card, borderBottomColor: activeColors.border }]}>
          <HamburgerButton />
          <View style={styles.appBarInner}>
            <Image source={require('@/assets/images/icon.png')} style={styles.logoMini} />
            <Text style={[styles.appBarTitle, { color: activeColors.text }]}>CALZADO J&R</Text>
          </View>
          {isAuthenticated && user ? (
            <TouchableOpacity style={styles.authBadge} onPress={() => router.push('/(tabs)/profile')}>
              <LayoutDashboard size={18} color={activeColors.secondary} style={{ marginRight: 6 }} />
              <Text style={[styles.authBadgeText, { color: activeColors.text }]}>{user.first_name}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginIconButton} onPress={() => router.push('/(auth)/login')}>
              <LogIn size={20} color={activeColors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Section Banner */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroBadgeText}>COLECCIÓN 2026</Text>
            <Text style={styles.heroTitle}>Calidad y Estilo{'\n'}a tu Alcance</Text>
            <Text style={styles.heroDesc}>
              Descubre calzado premium fabricado a mano con cueros seleccionados y diseño ergonómico exclusivo.
            </Text>
            <View style={styles.heroCtaRow}>
              <TouchableOpacity
                style={[styles.heroBtnPrimary, { backgroundColor: activeColors.secondary }]}
                onPress={() => router.push('/(tabs)/catalog')}
              >
                <Text style={styles.heroBtnText}>Explorar Catálogo</Text>
              </TouchableOpacity>
              {!isAuthenticated && (
                <TouchableOpacity
                  style={styles.heroBtnSecondary}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.heroBtnSecondaryText}>Acceder</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>Colecciones Destacadas</Text>
          <Text style={styles.sectionSubtitle}>Zapatos diseñados a la medida de tus expectativas</Text>

          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}
                onPress={handleCategoryPress}
              >
                <Image source={{ uri: cat.image }} style={styles.categoryCardImage} resizeMode="cover" />
                <View style={styles.categoryCardOverlay} />
                <View style={styles.categoryCardBody}>
                  <Text style={styles.categoryCardName}>{cat.name}</Text>
                  <Text style={styles.categoryCardDesc} numberOfLines={1}>{cat.desc}</Text>
                  <View style={styles.categoryCardLink}>
                    <Text style={[styles.categoryCardLinkText, { color: activeColors.secondary }]}>Ver Colección</Text>

                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={[styles.benefitsBanner, { backgroundColor: activeColors.card }]}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={[styles.sectionTitleCentered, { color: activeColors.text }]}>La Experiencia J&R</Text>
            <View style={[styles.accentBar, { backgroundColor: activeColors.secondary }]} />
          </View>

          <View style={styles.benefitsGrid}>
            {benefits.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <View key={idx} style={styles.benefitCard}>
                  <View style={[styles.benefitIconContainer, { backgroundColor: activeColors.primary + '12' }]}>
                    <IconComp size={24} color={activeColors.primary} />
                  </View>
                  <Text style={[styles.benefitTitle, { color: activeColors.text }]}>{item.title}</Text>
                  <Text style={styles.benefitDesc}>{item.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Why Choose Us Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: activeColors.text }]}>¿Por qué elegir Calzado J&R?</Text>
          <Text style={styles.sectionSubtitle}>Compromiso inquebrantable con la industria nacional y el confort</Text>

          <View style={styles.valuesList}>
            {values.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <View key={idx} style={[styles.valueRow, { backgroundColor: activeColors.card, borderColor: activeColors.border }]}>
                  <View style={[styles.valueIconBox, { backgroundColor: activeColors.secondary + '12' }]}>
                    <IconComp size={24} color={activeColors.secondary} />
                  </View>
                  <View style={styles.valueRowContent}>
                    <Text style={[styles.valueRowTitle, { color: activeColors.text }]}>{item.title}</Text>
                    <Text style={styles.valueRowDesc}>{item.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Dynamic CTA Footer Section */}
        {!isAuthenticated && (
          <View style={[styles.footerCtaCard, { backgroundColor: activeColors.primary }]}>
            <View style={styles.ctaPulseBubble} />
            <Text style={styles.footerCtaTitle}>Acceso Personal Autorizado</Text>
            <Text style={styles.footerCtaDesc}>
              Si eres Administrador, Jefe de Planta o Vendedor, accede para administrar pedidos y ver métricas.
            </Text>
            <TouchableOpacity
              style={[styles.footerCtaBtn, { backgroundColor: activeColors.white }]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={[styles.footerCtaBtnText, { color: activeColors.primary }]}>Ingresar al Panel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footerPadding} />
        </Animated.View>
      </ScrollView>

      {/* Floating WhatsApp Action Bubble */}
      <TouchableOpacity
        style={[styles.whatsappFloatingBubble, { backgroundColor: '#25D366' }]}
        onPress={handleWhatsAppContact}
      >
        <MessageCircle size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  logoMini: {
    width: 44,
    height: 44,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  appBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appBarTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    flex: 1,
    marginLeft: 12,
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  authBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  loginIconButton: {
    padding: 8,
    borderRadius: 10,
  },
  heroSection: {
    height: 380,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 58, 138, 0.65)', // deep navy tint overlay
  },
  heroContent: {
    padding: 24,
    paddingBottom: 32,
  },
  heroBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    opacity: 0.9,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  heroDesc: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 20,
  },
  heroCtaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroBtnPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  heroBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  heroBtnSecondary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBtnSecondaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  section: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 20,
  },
  categoriesGrid: {
    gap: 16,
  },
  categoryCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    height: 150,
    position: 'relative',
    justifyContent: 'flex-end',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryCardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  categoryCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  categoryCardBody: {
    padding: 16,
    zIndex: 2,
  },
  categoryCardName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  categoryCardDesc: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  categoryCardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryCardLinkText: {
    fontSize: 12,
  fontWeight: '800',
  },
  benefitsBanner: {
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  sectionHeaderCentered: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitleCentered: {
    fontSize: 20,
    fontWeight: '900',
  },
  accentBar: {
    width: 48,
    height: 3.5,
    borderRadius: 2,
    marginTop: 8,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  benefitCard: {
    width: '47%',
    marginBottom: 8,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  fontWeight: '500',
  },
  valuesList: {
    gap: 14,
  },
  valueRow: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
    elevation: 1,
  },
  valueIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  valueRowContent: {
    flex: 1,
  },
  valueRowTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 3,
  },
  valueRowDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
  fontWeight: '500',
  },
  footerCtaCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  ctaPulseBubble: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  footerCtaTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  footerCtaDesc: {
    color: '#e2e8f0',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '600',
    marginBottom: 20,
  },
  footerCtaBtn: {
    height: 48,
    paddingHorizontal: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  footerCtaBtnText: {
    fontSize: 13,
    fontWeight: '900',
  },
  footerPadding: {
    height: 80,
  },
  whatsappFloatingBubble: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 999,
  },
});
