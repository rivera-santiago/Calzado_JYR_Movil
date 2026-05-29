# ⚡️ Requisitos y Primeros Pasos

Si tu proyecto usa pnpm, los pasos son casi iguales pero cambiando npm por pnpm.

## 1. Instalar pnpm

Con Node.js instalado, ejecuta en la terminal:

```powershell
npm install -g pnpm
```

Verifica la instalación:

```powershell
pnpm -v
```

## 2. Abrir el proyecto en VS Code

Abre la carpeta del proyecto y una terminal (Ctrl + ñ).

## 3. Instalar dependencias

```powershell
pnpm install
# o
pnpm i
```

## 4. Ejecutar el proyecto Expo

Busca en `package.json` la dependencia:

```json
"expo": "^..."
```

Entonces ejecuta:

```powershell
pnpm expo start
# o
npx expo start
# o
pnpm start
```

Esto abrirá Expo Dev Tools y podrás correr la app en tu dispositivo o emulador.

---

## 🚩 ¿Problemas con Android SDK o "adb"?

Si ves errores como:

```
Failed to resolve the Android SDK path. Default install location not found: C:\Users\<usuario>\AppData\Local\Android\Sdk
Error: "adb" no se reconoce como un comando interno o externo
```

Tienes dos opciones:

### Opción 1: Probar en tu teléfono con Expo Go (recomendado)

1. Ejecuta:
  ```powershell
  pnpm start
  ```
2. Se abrirá Expo Dev Tools y verás un QR.
3. Instala la app **Expo Go** en tu teléfono (Android/iOS).
4. Escanea el QR con Expo Go. ¡La app se abrirá en tu dispositivo sin SDK ni emulador!

### Opción 2: Instalar Android SDK y configurar adb

1. Instala **Android Studio** desde https://developer.android.com/studio
2. Durante la instalación, selecciona también “Android SDK” y “Android Virtual Device (AVD)”.
3. Cuando termine, abre Android Studio y crea un emulador (AVD).
4. Copia la ruta del SDK, normalmente es:
  ```
  C:\Users\<tu-usuario>\AppData\Local\Android\Sdk
  ```
5. Agrega la variable de entorno (en PowerShell):
  ```powershell
  setx ANDROID_SDK_ROOT "C:\Users\<tu-usuario>\AppData\Local\Android\Sdk"
  ```
6. Agrega la carpeta `platform-tools` al `PATH`:
  - Ve a Panel de control → Sistema → Variables de entorno.
  - Edita la variable `Path` y agrega:
    ```
    C:\Users\<tu-usuario>\AppData\Local\Android\Sdk\platform-tools
    ```
7. Cierra y vuelve a abrir la terminal.
8. Verifica que `adb` funciona:
  ```powershell
  adb --version
  ```
9. Ahora ejecuta:
  ```powershell
  pnpm run android
  ```

---

# 🚀 Cómo Correr el Proyecto CALZADO J&R (Mobile)

**Estado:** ✅ Listo para desarrollo | **Ambiente:** Expo (React Native) | **Versión:** v1.0.0

---

## ⚡ Quick Start (3 pasos)

### 1️⃣ Clonar y Configurar

```powershell
git clone <REPO_URL> calzado-jyr-mobile
cd calzado-jyr-mobile
pnpm install
```

Notas:
- Este repositorio es la aplicación móvil desarrollada con Expo + `expo-router`.
- Usa `pnpm`. Evita `npm` o `yarn` para los comandos de desarrollo.

### 2️⃣ Levantar la app (Expo)

Para desarrollo local (Expo Dev Tools / Metro):

```powershell
pnpm start
```

Para abrir la app en Android / iOS / Web:

```powershell
pnpm run android    # abre Expo en Android (requiere Android SDK + adb)
pnpm run ios        # abre en iOS (requiere Xcode en macOS)
pnpm run web        # abre en navegador
```

Consejo:
- Si no tienes Android SDK o `adb`, usa Expo Go en tu dispositivo físico: `pnpm start` y escanea el QR con Expo Go.

### 3️⃣ Acceder a la App

- Sigue la URL que muestra Expo Dev Tools en el navegador o escanea el QR con Expo Go.
- Si ejecutas `pnpm run android` y tu entorno está configurado correctamente, la app abrirá el emulador.

---

## 👤 Usuarios de Prueba

**Admin / Demo:**

```
Email: ronald.jefe@gmail.com
Contraseña: Test123456!
```

La app incluye un modo de demostración/auto-fill en la pantalla de login para acelerar pruebas.

---

## 🛠 Comandos útiles (extraídos de `package.json`)

- `pnpm start` — inicia Expo Dev Tools (Metro)
- `pnpm run android` — intenta abrir en Android (requiere SDK/adb)
- `pnpm run ios` — intenta abrir en iOS (macOS + Xcode)
- `pnpm run web` — abre la versión web
- `pnpm run lint` — corre `expo lint` (ESLint)
- `pnpm run reset-project` — script auxiliar en `scripts/reset-project.js`

---

## ✅ Verificaciones recomendadas (linter + types)

Antes de commitear o crear PRs, ejecuta:

```powershell
pnpm run lint
pnpm exec tsc --noEmit
```

- `pnpm run lint` ejecuta ESLint configurado via Expo.
- `pnpm exec tsc --noEmit` valida tipos TypeScript sin generar artefactos.

---

## 📱 Desarrollo sin Android SDK (usar Expo Go)

Si no quieres instalar Android SDK localmente:
1. Ejecuta `pnpm start`.
2. Abre Expo Dev Tools en el navegador.
3. Escanea el QR con Expo Go en tu teléfono (Android/iOS).

Esto permite probar la mayor parte de la UI sin emuladores.

---

## ⚠️ Problemas comunes y soluciones rápidas

- Error: `adb` no se reconoce
  - Instala Android SDK / Platform Tools y añade la carpeta `platform-tools` al `PATH` del sistema.
  - Alternativa: usar Expo Go para probar en un dispositivo físico.

- Error: "Failed to resolve the Android SDK path"
  - Setea la variable de entorno `ANDROID_SDK_ROOT` o `ANDROID_HOME` apuntando al SDK:

```powershell
setx ANDROID_SDK_ROOT "C:\Users\<tu-usuario>\AppData\Local\Android\Sdk"
```

Reinicia la terminal después de setear variables.

- Linter / TypeScript
  - Ejecuta `pnpm run lint` y `pnpm exec tsc --noEmit` y corrige los problemas reportados.

---

## 🔎 Notas sobre la API / Desarrollo offline

- El cliente móvil utiliza `services/api.ts`. Para desarrollo sin backend, el archivo tiene fallbacks/mock que permiten probar login y pantallas clave.
- Si cuentas con un backend, modifica la URL / credenciales en el lugar correspondiente del código o en tu configuración local.

---

## 🧰 Stack tecnológico (Mobile)

- Expo + `expo-router`
- React 19 + React Native 0.81.5
- TypeScript
- react-hook-form + zod
- Zustand (auth)
- TanStack Query
- ESLint (config: `eslint-config-expo`)
- pnpm como package manager

---

## 🧪 QA rápido (checklist)

- [ ] `pnpm install` — sin errores
- [ ] `pnpm run lint` — pasar linter
- [ ] `pnpm exec tsc --noEmit` — sin errores de tipos
- [ ] `pnpm start` — Expo Dev Tools visible
- [ ] Probar login con credenciales de demo

---

## ❓ ¿Quieres que lo guarde también como `README.md`?

Puedo copiar este mismo contenido en `README.md` o dejarlo como `como_correr_proyecto.md`. Dime si quieres que lo duplique en `README.md` y lo hago.

---

**¡Listo para ejecutar y probar!**
