# 🔧 Solución: Problemas con Rutas y Estilos

## 🚨 Problema

Los estilos CSS no cargan y las rutas no funcionan correctamente.

### Síntomas:
- ❌ La página se ve sin estilos (solo HTML plano)
- ❌ Las imágenes no cargan
- ❌ Los scripts JavaScript no funcionan
- ❌ Error 404 al navegar entre páginas

### Causa:
El proyecto usa **rutas absolutas** (`/css/styles.css`, `/js/script.js`) que requieren un servidor web configurado correctamente. Abrir los archivos HTML directamente (`file://`) o usar algunos servidores simples no funciona.

---

## ✅ Soluciones

### 🎯 Solución 1: Usar el Servidor Node.js Incluido (RECOMENDADO)

He creado un servidor Node.js simple que maneja correctamente las rutas absolutas.

#### Pasos:

1. **Abre una terminal en la carpeta `frontend`:**
   ```bash
   cd frontend
   ```

2. **Inicia el servidor:**
   ```bash
   node server.js
   ```

3. **Abre tu navegador en:**
   ```
   http://localhost:5500/login.html
   ```

#### O usa el archivo batch (Windows):
Simplemente ejecuta: **`INICIAR-FRONTEND.bat`**

---

### 🎯 Solución 2: Configurar Live Server Correctamente

Si usas VS Code con Live Server:

#### Pasos:

1. **Abre VS Code EN LA CARPETA `frontend`** (no en la raíz del proyecto)
   ```bash
   cd frontend
   code .
   ```

2. **Instala la extensión Live Server** si no la tienes

3. **Click derecho en `index.html`** → "Open with Live Server"

4. **Verifica que la URL sea:**
   ```
   http://127.0.0.1:5500/index.html
   ```
   (No debe tener `/frontend/` en la URL)

---

### 🎯 Solución 3: Usar http-server Correctamente

Si usas `http-server` de Node.js:

#### Pasos:

1. **Instala http-server globalmente:**
   ```bash
   npm install -g http-server
   ```

2. **IMPORTANTE: Navega a la carpeta `frontend`:**
   ```bash
   cd frontend
   ```

3. **Inicia el servidor:**
   ```bash
   http-server -p 5500
   ```

4. **Abre tu navegador en:**
   ```
   http://localhost:5500/login.html
   ```

---

### 🎯 Solución 4: Usar Python HTTP Server

Si usas Python:

#### Pasos:

1. **Navega a la carpeta `frontend`:**
   ```bash
   cd frontend
   ```

2. **Inicia el servidor:**
   ```bash
   # Python 3
   python -m http.server 5500
   
   # Python 2
   python -m SimpleHTTPServer 5500
   ```

3. **Abre tu navegador en:**
   ```
   http://localhost:5500/login.html
   ```

---

## 🔍 Verificación

### ✅ Cómo saber si está funcionando correctamente:

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Network"**
3. **Recarga la página** (F5)
4. **Verifica que los archivos CSS/JS se carguen con código 200:**
   - ✅ `styles.css` → 200 OK
   - ✅ `dashboard.css` → 200 OK
   - ✅ `dashboard.js` → 200 OK

### ❌ Si ves errores 404:
```
GET http://localhost:5500/css/styles.css 404 (Not Found)
```

**Significa que el servidor no está sirviendo desde la carpeta correcta.**

---

## 🚀 Inicio Rápido (Windows)

### Para iniciar TODO el sistema:
Ejecuta: **`INICIAR-TODO.bat`**

Este archivo iniciará automáticamente:
- ✅ Backend en http://localhost:3000
- ✅ Frontend en http://localhost:5500

### Para iniciar solo el Frontend:
Ejecuta: **`INICIAR-FRONTEND.bat`**

### Para iniciar solo el Backend:
Ejecuta: **`INICIAR-BACKEND.bat`**

---

## 📝 Estructura de Rutas

El proyecto usa esta estructura de rutas:

```
frontend/
├── index.html              → http://localhost:5500/index.html
├── login.html              → http://localhost:5500/login.html
├── dashboard.html          → http://localhost:5500/dashboard.html
├── css/
│   ├── styles.css          → /css/styles.css
│   ├── dashboard.css       → /css/dashboard.css
│   └── modules/
│       └── module-tables.css → /css/modules/module-tables.css
├── js/
│   ├── dashboard.js        → /js/dashboard.js
│   └── modules/
│       └── usuarios.js     → /js/modules/usuarios.js
├── images/
│   └── bienvenida.png      → /images/bienvenida.png
└── modules/
    └── usuarios.html       → /modules/usuarios.html
```

**IMPORTANTE:** Las rutas empiezan con `/` (barra), lo que significa que son **rutas absolutas desde la raíz del servidor**.

---

## 🐛 Problemas Comunes

### Problema 1: "No se cargan los estilos"
**Causa:** El servidor no está sirviendo desde la carpeta `frontend`

**Solución:**
```bash
# INCORRECTO (desde la raíz del proyecto)
cd Modulo_ERP_RecursosHumanos
http-server -p 5500
# Esto servirá: http://localhost:5500/frontend/index.html ❌

# CORRECTO (desde la carpeta frontend)
cd Modulo_ERP_RecursosHumanos/frontend
http-server -p 5500
# Esto servirá: http://localhost:5500/index.html ✅
```

### Problema 2: "404 Not Found en /css/styles.css"
**Causa:** El servidor no encuentra la carpeta `css`

**Solución:** Verifica que estés ejecutando el servidor desde la carpeta `frontend`:
```bash
pwd  # Linux/Mac
cd   # Windows

# Debe mostrar: .../Modulo_ERP_RecursosHumanos/frontend
```

### Problema 3: "Las rutas funcionan pero no navega entre páginas"
**Causa:** Los enlaces en el dashboard usan rutas relativas incorrectas

**Solución:** Usa el servidor Node.js incluido (`node server.js`) que maneja correctamente todas las rutas.

### Problema 4: "CORS error al hacer login"
**Causa:** El backend no está corriendo o CORS no está configurado

**Solución:**
1. Verifica que el backend esté corriendo: http://localhost:3000
2. Verifica que `application.properties` tenga:
   ```properties
   cors.allowed.origins=http://localhost:5500,http://127.0.0.1:5500
   ```

---

## 🎯 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] ✅ El servidor está corriendo desde la carpeta `frontend`
- [ ] ✅ La URL es `http://localhost:5500/login.html` (sin `/frontend/`)
- [ ] ✅ La consola del navegador (F12) no muestra errores 404
- [ ] ✅ Los archivos CSS se cargan con código 200
- [ ] ✅ El backend está corriendo en http://localhost:3000
- [ ] ✅ PostgreSQL está corriendo y la base de datos existe

---

## 💡 Recomendación Final

**Usa el servidor Node.js incluido** ejecutando:
```bash
cd frontend
node server.js
```

O simplemente ejecuta: **`INICIAR-FRONTEND.bat`**

Este servidor está configurado específicamente para este proyecto y maneja correctamente todas las rutas.

---

## 📞 ¿Aún tienes problemas?

1. **Verifica la consola del navegador** (F12) para ver errores específicos
2. **Verifica la consola del servidor** para ver qué archivos se están solicitando
3. **Toma una captura de pantalla** de los errores y consulta con el equipo

---

## 🔗 Enlaces Útiles

- **Frontend:** http://localhost:5500/login.html
- **Backend API:** http://localhost:3000/api/menus
- **Test Login:** http://localhost:3000/api/auth/login

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`
