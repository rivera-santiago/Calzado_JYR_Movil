# Desarrollo local - Calzado J&R móvil

Instrucciones rápidas para ejecutar el proyecto localmente:

Requisitos:
- Node.js 18+ y pnpm
- Expo CLI (opcional) - `pnpm install -g expo-cli` (no obligatorio)

Instalación:

```powershell
pnpm install --registry=https://registry.npmjs.org/
```

Arrancar en modo túnel (sin instalar extra):

```powershell
pnpm start -- --tunnel
```

Arrancar en LAN:

```powershell
pnpm start -- --host lan
```

Notas:
- Si quieres exponer una URL pública controlada con Cloudflare Tunnel o ngrok, instala el binario correspondiente en tu máquina.
- Para pruebas unitarias (no incluidas): agregaremos `vitest` o `jest` y ejemplos en `__tests__`.

Contacto: mantén el repo en `main` y haz PRs para cambios grandes.
