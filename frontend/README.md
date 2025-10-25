# 🌐 Frontend - Sistema ERP

Frontend del sistema ERP desarrollado con HTML5, CSS3, JavaScript y Bootstrap 5.

---

## 🚀 Inicio Rápido

### Opción 1: Servidor Node.js (RECOMENDADO)
```bash
node server.js
```

### Opción 2: Usar archivo batch (Windows)
Ejecuta desde la raíz del proyecto: **`INICIAR-FRONTEND.bat`**

---

## 📋 Requisitos

- **Node.js** (para el servidor incluido)
- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)

---

## 🎯 Acceso

Una vez iniciado el servidor:

- **URL Principal:** http://localhost:5500
- **Login:** http://localhost:5500/login.html
- **Dashboard:** http://localhost:5500/dashboard.html

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 📁 Estructura

```
frontend/
├── server.js              # Servidor Node.js incluido
├── package.json           # Configuración del proyecto
├── index.html             # Página principal
├── login.html             # Página de login
├── dashboard.html         # Dashboard principal
├── css/                   # Estilos CSS
│   ├── styles.css         # Estilos globales
│   ├── dashboard.css      # Estilos del dashboard
│   └── modules/           # Estilos de módulos
│       └── module-tables.css
├── js/                    # Scripts JavaScript
│   ├── index.js           # Script de la página principal
│   ├── dashboard.js       # Script del dashboard
│   ├── script.js          # Scripts globales
│   └── modules/           # Scripts de módulos
│       ├── usuarios.js
│       ├── rol.js
│       └── motivo-prestamo.js
├── images/                # Imágenes
│   └── bienvenida.png
└── modules/               # Módulos HTML
    ├── usuarios.html
    ├── rol.html
    ├── asignar-rol.html
    └── motivo-prestamo.html
```

---

## 🔧 Configuración

### Cambiar el puerto del servidor

Edita `server.js`:
```javascript
const PORT = 5500; // Cambia este valor
```

### Configurar la URL del backend

Los scripts JavaScript hacen peticiones a `/api/*`. Si el backend está en otro puerto, necesitas configurar un proxy o cambiar las URLs en los archivos JS.

Por defecto, el backend debe estar en: **http://localhost:3000**

---

## 🎨 Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript ES6+** - Lógica
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.4** - Iconos
- **DataTables** - Tablas interactivas
- **jQuery** - Manipulación DOM

---

## 📝 Módulos Disponibles

### Gestión de Seguridad
- **Usuarios** (`/modules/usuarios.html`)
  - Listar, crear, editar y eliminar usuarios
  - Gestión de credenciales
  - Estados activo/inactivo

- **Roles** (`/modules/rol.html`)
  - CRUD completo de roles
  - Asignación de permisos

- **Asignar Rol** (`/modules/asignar-rol.html`)
  - Asignar roles a usuarios

### Gestión de Planilla
- **Motivo Préstamo** (`/modules/motivo-prestamo.html`)
  - Gestión de motivos de préstamos
  - Estados y códigos

---

## 🔌 Conexión con el Backend

El frontend se comunica con el backend mediante fetch API:

```javascript
// Ejemplo de login
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

const data = await response.json();
// data = { success: true, message: "...", data: {...} }
```

### Endpoints utilizados:
- `POST /api/auth/login` - Autenticación
- `GET /api/menus` - Obtener menús
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario
- `GET /api/roles` - Listar roles

---

## 🐛 Solución de Problemas

### ❌ Los estilos no cargan

**Problema:** La página se ve sin estilos (solo HTML plano)

**Causa:** El servidor no está sirviendo desde la carpeta correcta

**Solución:**
```bash
# CORRECTO - Ejecutar desde la carpeta frontend
cd frontend
node server.js

# INCORRECTO - No ejecutar desde la raíz
cd Modulo_ERP_RecursosHumanos
node frontend/server.js  # ❌ No funciona
```

### ❌ Error 404 en archivos CSS/JS

**Problema:** La consola muestra errores 404 para archivos CSS/JS

**Solución:** Verifica que estés en la carpeta `frontend` al iniciar el servidor:
```bash
pwd  # Linux/Mac
cd   # Windows
# Debe mostrar: .../frontend
```

### ❌ Error "Connection refused" al hacer login

**Problema:** No se puede conectar al backend

**Solución:**
1. Verifica que el backend esté corriendo: http://localhost:3000
2. Verifica que CORS esté configurado en el backend
3. Revisa la consola del navegador (F12) para ver el error exacto

### ❌ Las rutas no funcionan al navegar

**Problema:** Al hacer clic en un módulo, aparece 404

**Solución:** Usa el servidor Node.js incluido (`node server.js`) que maneja correctamente todas las rutas.

---

## 🧪 Testing

### Verificar que el servidor funciona

1. Inicia el servidor: `node server.js`
2. Abre: http://localhost:5500/login.html
3. Abre la consola del navegador (F12)
4. Ve a la pestaña "Network"
5. Recarga la página (F5)
6. Verifica que todos los archivos se carguen con código 200:
   - ✅ `login.html` → 200 OK
   - ✅ `styles.css` → 200 OK (si aplica)
   - ✅ `dashboard.js` → 200 OK (si aplica)

---

## 📚 Recursos

### Documentación de Tecnologías
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- [Font Awesome](https://fontawesome.com/icons)
- [DataTables](https://datatables.net/)
- [jQuery](https://api.jquery.com/)

### Guías del Proyecto
- [SOLUCION-RUTAS.md](../SOLUCION-RUTAS.md) - Solución a problemas de rutas
- [INSTRUCCIONES.md](../INSTRUCCIONES.md) - Guía de instalación completa
- [FAQ.md](../FAQ.md) - Preguntas frecuentes

---

## 🔐 Seguridad

### Almacenamiento Local
El frontend guarda datos del usuario en `localStorage`:
```javascript
localStorage.setItem('user', JSON.stringify(userData));
```

### Sesión
La sesión se mantiene mientras el usuario no cierre sesión o limpie el localStorage.

### CORS
El backend debe tener configurado CORS para permitir peticiones desde:
- `http://localhost:5500`
- `http://127.0.0.1:5500`

---

## 🎨 Personalización

### Cambiar colores

Edita `css/styles.css`:
```css
:root {
    --primary-coral: #E8A598;
    --secondary-coral: #D4958A;
    --light-coral: #F5E6E3;
    --dark-coral: #C8847A;
}
```

### Agregar un nuevo módulo

1. Crea el archivo HTML en `modules/`
2. Crea el CSS en `css/modules/`
3. Crea el JS en `js/modules/`
4. Agrega el menú en la base de datos (tabla `rrhh_mmenu`)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa [SOLUCION-RUTAS.md](../SOLUCION-RUTAS.md)
2. Revisa [FAQ.md](../FAQ.md)
3. Verifica la consola del navegador (F12)
4. Verifica los logs del servidor

---

**Frontend del Sistema ERP Meridian** 🚀
