# 👟 Calzado JYR Mobile

Aplicación móvil desarrollada con React Native, Expo y TypeScript para la gestión y visualización del catálogo de productos de Calzado JYR.

## 📱 Descripción

Calzado JYR Mobile es una aplicación móvil que permite a los usuarios consultar productos de calzado, acceder a información de su perfil y utilizar funcionalidades de autenticación como inicio de sesión y registro.

El proyecto fue desarrollado siguiendo una arquitectura modular para facilitar el mantenimiento, escalabilidad y reutilización del código.

---

## 🚀 Tecnologías Utilizadas

* React Native
* Expo
* Expo Router
* TypeScript
* Zustand
* JavaScript ES6+
* REST API

---

## 📂 Estructura del Proyecto

```text
app/
├── (auth)/
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
│
├── (tabs)/
│   ├── index.tsx
│   ├── catalog.tsx
│   └── profile.tsx

components/
services/
store/
types/
assets/
```

---

## ✨ Funcionalidades

* Inicio de sesión de usuarios.
* Registro de nuevos usuarios.
* Recuperación de contraseña.
* Visualización de catálogo de productos.
* Gestión de perfil de usuario.
* Consumo de servicios API.
* Navegación mediante pestañas.
* Manejo de estado global con Zustand.

---

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone https://github.com/rivera-santiago/Calzado_JYR_Movil.git
```

Ingresar a la carpeta del proyecto:

```bash
cd Calzado_JYR_Movil
```

Instalar dependencias:

```bash
pnpm install
```

Ejecutar el proyecto:

```bash
npx expo start
```

---

## 📱 Ejecución

La aplicación puede ejecutarse mediante:

* Expo Go
* Emulador Android
* Simulador iOS
* Navegador Web (Expo Web)







