import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

const DRAWER_WIDTH = Dimensions.get('window').width * 0.7

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  route: string
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'home-outline', label: 'Inicio', route: '/(tabs)' },
  { icon: 'heart-outline', label: 'Favoritos', route: '/(tabs)/favorites' },
  { icon: 'cart-outline', label: 'Carrito', route: '/(tabs)/cart' },
  { icon: 'checkbox-outline', label: 'Tareas', route: '/(tabs)/tasks' },
  { icon: 'wallet-outline', label: 'Checkout', route: '/(tabs)/checkout' },
  { icon: 'information-circle-outline', label: 'Detalle de Producto', route: '/(tabs)/productDetail' },
]

interface DrawerContextType {
  open: () => void
  close: () => void
  isOpen: boolean
}

const DrawerContext = createContext<DrawerContextType>({
  open: () => {},
  close: () => {},
  isOpen: false,
})

export function useDrawer() {
  return useContext(DrawerContext)
}

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <DrawerContext.Provider value={{ open, close, isOpen }}>
      {children}
      <HamburgerMenu visible={isOpen} onClose={close} />
    </DrawerContext.Provider>
  )
}

function HamburgerMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colorScheme = useColorScheme()
  const activeColors = colorScheme === 'dark' ? Colors.dark : Colors.light
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (visible) {
      setMounted(true)
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false)
      })
    }
  }, [visible, slideAnim, fadeAnim])

  const handleNavigate = useCallback(
    (route: string) => {
      onClose()
      router.push(route as any)
    },
    [onClose, router],
  )

  if (!mounted) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: activeColors.card,
            paddingTop: insets.top + 20,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Ionicons name="apps-outline" size={28} color={activeColors.primary} />
          <Text style={[styles.drawerTitle, { color: activeColors.text }]}>Calzado J&R</Text>
        </View>

        <View style={styles.menuItems}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: activeColors.border }]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={22} color={activeColors.primary} />
              <Text style={[styles.menuItemLabel, { color: activeColors.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    paddingHorizontal: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 24,
    marginBottom: 16,
    gap: 12,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  menuItems: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 14,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
})
