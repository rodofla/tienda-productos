# tienda-productos — README

Proyecto **único** que integra lo solicitado en **Ejercicio 1, 2 y 3** usando **React (Vite)**, **Firebase Auth + Firestore**, **Cloudinary** para imágenes, **Bootstrap** para estilos y **Cordova + Android Studio** para generar el APK.

---

## 🧭 Objetivo del proyecto

- **Público (no logueado):** ver catálogo, **agregar al carrito** y **realizar compra simulada**.
- **Logueado:** **crear/editar/eliminar** productos.
- **Registro de compras:** toda compra queda guardada en **Firestore** para que el usuario **logueado** la vea en **Mis compras**.

> **Nota sobre imágenes:** Se usa **Cloudinary** en lugar de Firebase Storage **porque la creación del bucket estaba bloqueada** (región/plan **Spark** requiere facturación o no permitía crear el bucket). Además, Cloudinary no requiere backend propio y entrega un **`secure_url`** inmediato que guardamos en Firestore.

---

## 🧱 Tecnologías clave

- **Frontend:** React + Vite
- **Estilos:** Bootstrap + CSS ligero (`src/styles.css`)
- **Autenticación:** Firebase Authentication (Email/Password)
- **Base de datos:** Firebase Firestore
- **Imágenes de productos:** Cloudinary (Upload Preset **unsigned**) → guardar `imageUrl` en Firestore
- **Móvil:** Cordova + Android Studio (APK Release firmado)

---

## 📁 Estructura de carpetas (resumen)

```
tienda-productos/
├─ index.html
├─ package.json
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  ├─ styles.css
│  ├─ firebase/index.js
│  ├─ context/AuthContext.jsx
│  ├─ routes/Router.jsx
│  ├─ lib/cloudinary.js           # subida a Cloudinary
│  ├─ components/
│  │  ├─ NavBar.jsx
│  │  ├─ ProductCard.jsx          # [EJ1]
│  │  └─ CartClass.jsx            # [EJ1]
│  └─ pages/
│     ├─ Home.jsx                 # [EJ2 + compra simulada]
│     ├─ AdminProducts.jsx        # [EJ2 + CRUD restringido]
│     ├─ ProductDetail.jsx        # [EJ2: ruta con :id]
│     ├─ Auth.jsx                 # Login/Registro
│     └─ MyOrders.jsx             # [EJ3]
└─ cordova/                       # proyecto Cordova para Android
```

---

## 🧩 Mapeo a Ejercicios (con comentarios en el código)

En el **código** están marcadas secciones con comentarios `// [EJERCICIO X]` para ubicar rápidamente qué cumple cada punto.

- **\[EJERCICIO 1]:**

  - `components/ProductCard.jsx` (componente con **props** y evento `onAddToCart`).
  - `components/CartClass.jsx` (**componente de clase** para el carrito, manejo de estado y total).

- **\[EJERCICIO 2]:**

  - `routes/Router.jsx` (ruteo con `react-router-dom`).
  - `pages/ProductDetail.jsx` (**ruta con parámetro** `:id` y lectura puntual desde Firestore).
  - `pages/AdminProducts.jsx` (**formulario** para crear productos; restricción por auth).

- **\[EJERCICIO 3]:**

  - `pages/MyOrders.jsx` (**listado de compras** del usuario logueado; consulta por `userUid`).

---

## ⚙️ Requisitos previos (claros y explícitos)

1. **Node 18+** y **npm** instalados.
2. **Cuenta Firebase** con **proyecto creado**.

   - Activar **Authentication → Email/Password**.
   - Crear **Firestore** en modo production y **publicar reglas** (abajo).

3. **Cuenta Cloudinary** con **Upload Preset unsigned** (opcionalmente carpeta `products/`).
4. (Opcional para Android) **Android Studio** con SDK **API 35** + **Build-Tools 35.0.0**.

---

## 🔐 Variables de entorno (.env)

> Crear un archivo **`.env`** en la raíz (mismo nivel de `package.json`). No subir a Git.

```env
# Firebase
VITE_FB_API_KEY=TU_API_KEY
VITE_FB_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FB_PROJECT_ID=tu-proyecto
VITE_FB_APP_ID=1:XXXX:web:YYYY

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UNSIGNED_PRESET=tu_upload_preset
```

---

## 🔒 Reglas de Firestore (copiar y Publicar)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Productos: lectura pública; escritura solo usuarios autenticados
    match /products/{id} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }

    // Órdenes: crea solo logueado; leer solo el dueño
    match /orders/{id} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.userUid;
    }
  }
}
```

> **Imágenes:** se suben a **Cloudinary** → guardamos solo `imageUrl` en Firestore. **No** se usa Firebase Storage para evitar cobros/bloqueos del bucket.

---

## 🚀 Puesta en marcha (Web)

1. Instalar dependencias y levantar dev server:

```bash
npm i
npm run dev
```

2. Abrir la URL que imprimirá Vite (normalmente `http://localhost:5173`).

3. **Build de producción** (para empaquetar o copiar a Cordova):

```bash
npm run build
```

---

## 🖼️ Imágenes con Cloudinary — ¿Qué se hizo y cómo?

- Se creó un **Upload Preset unsigned** en Cloudinary.
- En `src/lib/cloudinary.js` se implementó `uploadImageToCloudinary(file)` que:

  1. Hace `POST` a `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload` con `FormData`.
  2. Devuelve `data.secure_url`.

- En el formulario de producto (`ProductForm.jsx`) se sube la imagen a Cloudinary y **se guarda solo `imageUrl`** en la colección `products` de Firestore.

**Motivo del cambio:** Firebase Storage pedía bucket en región no disponible con plan Spark (o activar facturación). Esto bloqueaba la creación del bucket y generaba errores CORS. Cloudinary es gratuito para este caso y simplifica el flujo.

---

## 🧑‍💻 Flujo funcional (qué ve el profesor en la demo)

1. **Home:** lista de productos (pública), tarjetas con imagen/nombre/precio, botón **Agregar**.
2. **Carrito (derecha):** totales y botón **Comprar**.
3. **Auth:** login/registro con Email/Password.
4. **Admin:** crear producto (con imagen → Cloudinary) **solo logueado**.
5. **Compra simulada:** crea documento en `orders` con `items`, `total`, `userUid`, `createdAt`.
6. **Mis compras:** listado ordenado por fecha, totales `es-CL`, badges y placeholders.

---

## 🎨 Estilos (Bootstrap + CSS ligero)

- **Navbar** oscuro con colapso móvil.
- **Cards** con `shadow-sm` y `:hover`.
- **Imágenes** con `object-fit` y alturas consistentes.
- **Carrito** sticky en desktop.
- **Form Auth** centrado y limpio.

> No se agregaron features extra; **solo estilos** para una apariencia más profesional.

---

## 📦 Android (Cordova + Android Studio)

> **Dos caminos**, elige **uno**. Ambos parten copiando el build web a `cordova/www`.

### 1) Preparar `cordova/www`

```bash
npm run build
rm -rf cordova/www/* && cp -R dist/* cordova/www/
```

### 2) Crear/añadir plataforma Android (si falta)

```bash
cd cordova
npx cordova platform add android@14
```

### Camino A — Android Studio (GUI recomendado)

1. Abrir **Android Studio → Open** `cordova/platforms/android`.
2. Verificar **Gradle JDK = 17** y **SDK** (API 35 + Build-Tools 35.0.0).
3. **Build → Generate Signed Bundle / APK… → APK → Next**.
4. Crear/seleccionar **Keystore**, alias y contraseñas. Marcar **V1+V2**.
5. **Finish** → se genera **APK firmado** (por ejemplo `app/release/app-release.apk`).
6. **Instalar en dispositivo** (Device Manager → Install APK) o por consola `adb install -r`.

### Camino B — CLI (zipalign + apksigner)

```bash
# unsigned APK
npx cordova build android --release

# firmar
cd platforms/android/app/build/outputs/apk/release
# (una vez) keystore
keytool -genkeypair -v -keystore ~/keys/tienda.keystore -alias tienda -keyalg RSA -keysize 2048 -validity 10000
# zipalign
$ANDROID_HOME/build-tools/35.0.0/zipalign -v -p 4 app-release-unsigned.apk app-release-aligned.apk
# apksigner
$ANDROID_HOME/build-tools/35.0.0/apksigner sign --ks ~/keys/tienda.keystore --out app-release.apk app-release-aligned.apk
# verificar
$ANDROID_HOME/build-tools/35.0.0/apksigner verify --print-certs app-release.apk
# instalar
$ANDROID_HOME/platform-tools/adb install -r app-release.apk
```

---

## 🧪 Checklist para evaluación

- [ ] **Auth** habilitado (Email/Password) y login/registro funcionando.
- [ ] **Reglas Firestore** publicadas como arriba.
- [ ] **Home** lista productos (público) y permite carrito.
- [ ] **Compra** (simulada) crea documentos en `orders`.
- [ ] **Mis compras** muestra historial del usuario logueado.
- [ ] **Admin** crea/edita/elimina productos (restringido a logueados).
- [ ] **Imágenes** suben a **Cloudinary** y se guarda `imageUrl`.
- [ ] **Estilos** (Bootstrap + CSS) aplicados en Navbar, Cards, Carrito, Auth.
- [ ] **APK** generado **y firmado**; instalación verificada en dispositivo.

---

## 🆘 Troubleshooting breve

- **Firestore `permission-denied`:** vuelve a publicar reglas; confirma que el **Project ID** en `.env` coincide y **reinicia** Vite si cambiaste variables.
- **No sube imagen:** revisa `VITE_CLOUDINARY_CLOUD_NAME` y `VITE_CLOUDINARY_UNSIGNED_PRESET`.
- **APK no aparece:** asegúrate de abrir **`platforms/android`** en Android Studio y compilar **Release**; o usa CLI como en “Camino B”.
- **No instala en el teléfono:** activa **Depuración USB**, ejecuta `adb devices`, desinstala la app previa si cambia el `packageId`.

---

## 📌 Notas finales

- **Cloudinary** se eligió porque **Firebase Storage** en el plan **Spark** y la región usada **no permitían crear el bucket** sin facturación, lo que generaba errores CORS/permiso. Con Cloudinary se obtiene un **`secure_url`** inmediato, sin costos para este alcance.
- El proyecto fue diseñado para ser **claro** y **metódico**: cada paso y cada parte del código están identificados, sin añadir funcionalidades fuera de lo pedido (solo se mejoró el **estilo visual**).
