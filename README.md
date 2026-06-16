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

## Tecnologías

- **React Native** + **Expo SDK 54**
- **TypeScript**
- **Expo Router** (navegación por archivos)
- **Zustand** (estado global)
- **TanStack React Query** (datos del servidor)
- **Supabase** (backend)
- **SQLite** (base de datos local)

## Requisitos

- Node.js 18+
- pnpm

## Instalación y ejecución

```bash
pnpm install
pnpm start -- --tunnel
```

Escanea el código QR con Expo Go en tu celular.

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

## Contacto

Desarrollado para Calzado J&R — Calidad y estilo a tu alcance.
