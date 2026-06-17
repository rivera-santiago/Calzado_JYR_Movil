# Calzado J&R — App Móvil

Aplicación móvil multiplataforma para la gestión y venta de calzado artesanal de la empresa **Calzado J&R**. Desarrollada con React Native (Expo), TypeScript y una arquitectura moderna con sincronización offline.

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Framework | Expo SDK 54 + React Native 0.81 | UI multiplataforma (Android, iOS, Web) |
| Navegación | Expo Router 6 (file-based) | Rutas basadas en sistema de archivos |
| Estado global | Zustand 5 | Auth, carrito, favoritos |
| Server state | TanStack React Query 5 | Catálogo, caché y refetch |
| Base de datos local | expo-sqlite 16 | Tareas offline (SQLite WASM en web) |
| Backend cloud | Supabase | Sincronización offline |
| Forms | react-hook-form + Zod 4 | Validación de formularios |
| Persistencia | expo-secure-store | Tokens, carrito y favoritos |
| Bundle | pnpm + Metro | Package manager y bundler |

## Funcionalidades

| Módulo | Pantallas | Persistencia | Offline |
|--------|-----------|-------------|---------|
| Catálogo | Home, Catalog, ProductDetail, Cart, Checkout, Favorites | TanStack Query cache | Mock data fallback |
| Autenticación | Login, Register, ForgotPassword | SecureStore + Zustand | Mock login offline |
| Tareas | Tasks | SQLite local + Supabase sync | Sí (sync queue) |
| Perfil | Profile | SecureStore | Sí |

## Arquitectura

```
app/              → Pantallas (Expo Router file-based)
  (auth)/         →   Login, Register, ForgotPassword
  (tabs)/         →   Home, Catalog, Cart, Checkout, Favorites, Tasks, Profile
components/ui/    → Componentes reutilizables (ProductCard, SearchBar, etc.)
services/         → Lógica de negocio
  api.ts          →   API REST + fallback mock
  supabaseClient  →   Cliente Supabase
  syncManager     →   Sincronización offline
  taskService     →   CRUD tareas SQLite
store/            → Estado global (Zustand)
  authStore       →   Auth + persistencia SecureStore
  cartStore       →   Carrito + persistencia debounced
  favoritesStore  →   Favoritos + persistencia debounced
hooks/            → Custom hooks
  useProducts     →   React Query + staleTime 5min
lib/              → Utilidades
  database.ts     →   expo-sqlite v16 async API
  secureStore.ts  →   SecureStore + localStorage fallback
```

## Flujo de datos

```
Usuario → Pantalla → React Query / Zustand → API / SQLite / SecureStore
                          ↓
                   Caché (5-10 min staleTime)
                          ↓
                   Mock fallback si no hay backend
```

## Optimizaciones aplicadas

- **Caché React Query**: `staleTime` de 5-10 min para evitar refetch innecesarios
- **Persistencia debounced**: Carrito y favoritos escriben a SecureStore cada 300ms (no en cada click)
- **Import caching**: `expo-secure-store` se importa una sola vez, no en cada llamada
- **Startup paralelo**: DB, auth y favoritos se inicializan con `Promise.all`
- **QueryKey compartido**: Catálogo y detalle de producto comparten la misma caché
- **Bundle limpio**: Sin dependencias muertas (react-native-reanimated, mmkv, worklets)

## Quick Start

```powershell
git clone <URL> calzado-jyr-mobile
cd calzado-jyr-mobile
pnpm install
pnpm start
```

### Usuario de prueba

```
Email: ronald.jefe@gmail.com
Contraseña: Test123456!
```

### Comandos

| Comando | Descripción |
|---------|------------|
| `pnpm start` | Inicia Expo Dev Tools |
| `pnpm run android` | Abre en Android |
| `pnpm run ios` | Abre en iOS (macOS + Xcode) |
| `pnpm run web` | Abre en navegador |
| `pnpm run lint` | ESLint |
| `pnpm exec tsc --noEmit` | TypeScript check |

## Convenciones de commits

```
feat:     Nueva funcionalidad
fix:      Corrección de bug
perf:     Optimización de rendimiento
chore:    Tareas de mantenimiento
docs:     Documentación
refactor: Refactorización sin cambios funcionales
```

## Contacto

**Calzado J&R** — Calidad y estilo a tu alcance.
