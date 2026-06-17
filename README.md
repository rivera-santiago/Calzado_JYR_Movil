# Calzado J&R — App Móvil

Aplicación móvil para la gestión y venta de calzado artesanal de la empresa **Calzado J&R**. Desarrollada con React Native (Expo) y TypeScript.

## Funcionalidades

- Catálogo de productos con búsqueda y filtros por categoría (Caballero, Dama, Infantil)
- Carrito de compras con persistencia local
- Favoritos (guardar productos)
- Gestión de tareas (pendientes)
- Autenticación de usuarios (login, registro, recuperación)
- Sincronización offline con Supabase
- Menú tipo hamburguesa con navegación rápida
- Modo oscuro/claro

## Stack tecnológico

| Tecnología | Versión |
|------------|---------|
| Expo SDK | ~54.0.33 |
| React | 19.1.0 |
| React Native | 0.81.5 |
| Expo Router | ~6.0.24 |
| Zustand | 5.0.13 |
| TanStack React Query | 5.100.10 |
| Supabase | 2.34.0 |
| SQLite | ~16.0.10 |
| TypeScript | ~5.9.2 |

## Requisitos

- Node.js 18+
- pnpm

## Quick Start

```powershell
git clone <REPO_URL> calzado-jyr-mobile
cd calzado-jyr-mobile
pnpm install
pnpm start
```

Escanea el QR con Expo Go en tu teléfono, o usa:

```powershell
pnpm run android    # Android (requiere SDK + adb)
pnpm run ios        # iOS (requiere Xcode en macOS)
pnpm run web        # versión web
```

### Usuario de prueba

```
Email: ronald.jefe@gmail.com
Contraseña: Test123456!
```

## Estructura del proyecto

```
app/          → Pantallas y navegación (file-based routing)
components/   → Componentes reutilizables
services/     → API, Supabase, sincronización
store/        → Estado global (Zustand)
hooks/        → Hooks personalizados
constants/    → Tema y colores
lib/          → Utilidades (DB, SecureStore)
types/        → Tipos de TypeScript
utils/        → Formatos (precios, etc.)
```

## Comandos útiles

- `pnpm start` — inicia Expo Dev Tools (Metro)
- `pnpm run android` — abre en Android
- `pnpm run ios` — abre en iOS
- `pnpm run web` — abre versión web
- `pnpm run lint` — ejecuta ESLint
- `pnpm exec tsc --noEmit` — verifica tipos

## Verificaciones pre-commit

```powershell
pnpm run lint
pnpm exec tsc --noEmit
```

## Desarrollo offline

El cliente usa `services/api.ts` con fallbacks mock cuando no hay backend disponible, permitiendo probar login y pantallas clave sin servidor.

## Contacto

Desarrollado para **Calzado J&R** — Calidad y estilo a tu alcance.
