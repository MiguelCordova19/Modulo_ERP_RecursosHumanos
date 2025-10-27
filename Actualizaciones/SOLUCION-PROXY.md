# 🔄 Solución: Proxy Frontend ↔ Backend

## 🚨 Problema

El frontend (puerto 5500) no puede comunicarse con el backend (puerto 3000) porque las peticiones a `/api/*` se hacen al mismo servidor del frontend.

### Ejemplo del problema:
```
Frontend en:  http://localhost:5500
Backend en:   http://localhost:3000

Petición:     fetch('/api/auth/login')
Se envía a:   http://localhost:5500/api/auth/login  ❌ (No existe)
Debería ir a: http://localhost:3000/api/auth/login  ✅ (Backend)
```

---

## ✅ Solución Implementada: Proxy en el Servidor Node.js

He actualizado `frontend/server.js` para incluir un **proxy automático** que redirige todas las peticiones `/api/*` al backend.

### Cómo funciona:

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO CON PROXY                           │
└─────────────────────────────────────────────────────────────┘

1. Frontend hace petición:
   fetch('/api/auth/login', { method: 'POST', ... })
   
2. Petición va a:
   http://localhost:5500/api/auth/login
   
3. Servidor Node.js detecta /api/* y hace proxy:
   http://localhost:5500/api/auth/login
   ↓ (proxy)
   http://localhost:3000/api/auth/login
   
4. Backend procesa y responde:
   { "success": true, "data": {...} }
   
5. Proxy devuelve la respuesta al frontend:
   Frontend recibe la respuesta ✅
```

---

## 🚀 Cómo Usar

### Paso 1: Detener el Frontend (si está corriendo)

Presiona **Ctrl+C** en la terminal donde corre el frontend.

### Paso 2: Reiniciar el Frontend

```bash
cd frontend
node server.js
```

**Verás este mensaje:**
```
╔════════════════════════════════════════════════════════════╗
║   🚀 Servidor Frontend Iniciado con Proxy                 ║
║   📍 Frontend: http://localhost:5500                      ║
║   📍 Backend:  http://localhost:3000                      ║
║   🔄 Proxy configurado: /api/* → http://localhost:3000/api/*
╚════════════════════════════════════════════════════════════╝
```

### Paso 3: Verificar que el Backend esté corriendo

**En otra terminal:**
```bash
cd backend
mvn spring-boot:run
```

### Paso 4: Probar el Login

1. Abre: http://localhost:5500/login.html
2. Usuario: `admin`
3. Contraseña: `admin123`
4. ¡Debería funcionar! ✅

---

## 🔍 Verificación

### Ver los logs del proxy

Cuando hagas login, en la terminal del frontend verás:

```
GET /login.html
GET /css/styles.css
GET /js/dashboard.js
🔄 Proxy: POST /api/auth/login -> http://localhost:3000/api/auth/login
```

Esto confirma que el proxy está funcionando.

### Verificar en el navegador

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Haz login
4. Busca la petición a `/api/auth/login`
5. Verifica:
   - ✅ Request URL: `http://localhost:5500/api/auth/login`
   - ✅ Status: 200 OK
   - ✅ Response: JSON con `success: true`

---

## 🐛 Solución de Problemas

### Error: "Error de conexión con el backend"

**Síntoma:**
```json
{
  "success": false,
  "message": "Error de conexión con el backend. Verifica que esté corriendo en http://localhost:3000"
}
```

**Causa:** El backend no está corriendo.

**Solución:**
```bash
cd backend
mvn spring-boot:run
```

### Error: "ECONNREFUSED"

**Síntoma en los logs del frontend:**
```
❌ Error de proxy: connect ECONNREFUSED 127.0.0.1:3000
```

**Causa:** El backend no está corriendo o está en otro puerto.

**Solución:**
1. Verifica que el backend esté corriendo: http://localhost:3000/api/auth/status
2. Si está en otro puerto, edita `frontend/server.js`:
   ```javascript
   const BACKEND_URL = 'http://localhost:OTRO_PUERTO';
   ```

### El proxy no funciona

**Síntoma:** Las peticiones siguen fallando.

**Solución:**
1. Detén el frontend (Ctrl+C)
2. Verifica que guardaste los cambios en `server.js`
3. Reinicia el frontend: `node server.js`
4. Verifica que veas el mensaje "Servidor Frontend Iniciado con Proxy"

---

## 🎯 Alternativa: Cambiar las URLs en el Frontend

Si prefieres no usar proxy, puedes cambiar las URLs en el frontend para que apunten directamente al backend.

### Opción A: Variable de configuración

Crea `frontend/js/config.js`:
```javascript
const API_URL = 'http://localhost:3000';
```

Y úsala en tus peticiones:
```javascript
fetch(`${API_URL}/api/auth/login`, { ... })
```

### Opción B: Cambiar todas las URLs

Busca y reemplaza en todos los archivos JS:
```javascript
// Antes
fetch('/api/auth/login', { ... })

// Después
fetch('http://localhost:3000/api/auth/login', { ... })
```

**⚠️ Desventaja:** Tendrás que cambiar las URLs para producción.

---

## 📊 Comparación de Soluciones

| Solución | Ventajas | Desventajas |
|----------|----------|-------------|
| **Proxy (Implementada)** | ✅ No requiere cambios en el código<br>✅ Fácil de configurar<br>✅ Funciona igual en desarrollo y producción | ❌ Requiere Node.js |
| **URLs Absolutas** | ✅ Simple<br>✅ No requiere proxy | ❌ Requiere cambios en el código<br>❌ Diferentes URLs para dev/prod |
| **Variable de Config** | ✅ Fácil de cambiar<br>✅ Un solo lugar para configurar | ❌ Requiere cambios en el código |

---

## 🔧 Configuración Avanzada

### Cambiar el puerto del backend

Si tu backend está en otro puerto, edita `frontend/server.js`:

```javascript
const BACKEND_URL = 'http://localhost:8080'; // Cambia aquí
```

### Agregar más rutas al proxy

Si necesitas hacer proxy de otras rutas, edita `frontend/server.js`:

```javascript
// Proxy para /api/* y /uploads/*
if (req.url.startsWith('/api/') || req.url.startsWith('/uploads/')) {
    // ... código del proxy
}
```

### Habilitar logs detallados

Para ver más información del proxy, agrega:

```javascript
proxyReq.on('response', (proxyRes) => {
    console.log(`✅ Respuesta del backend: ${proxyRes.statusCode}`);
});
```

---

## 📝 Resumen

### Antes (Sin Proxy)
```
Frontend (5500) → /api/auth/login → Frontend (5500) ❌
                                     (No existe)
```

### Después (Con Proxy)
```
Frontend (5500) → /api/auth/login → Proxy → Backend (3000) ✅
                                             (Existe)
```

---

## ✅ Checklist

Verifica que todo esté configurado:

- [ ] ✅ Backend corriendo en http://localhost:3000
- [ ] ✅ Frontend corriendo con `node server.js`
- [ ] ✅ Mensaje "Servidor Frontend Iniciado con Proxy" visible
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Logs del proxy visibles en la terminal

---

## 🎉 ¡Listo!

El proxy está configurado y funcionando. Ahora el frontend puede comunicarse con el backend sin problemas.

**Para iniciar todo el sistema:**
1. Terminal 1: `cd backend && mvn spring-boot:run`
2. Terminal 2: `cd frontend && node server.js`
3. Navegador: http://localhost:5500/login.html

**O usa el archivo batch:**
```
INICIAR-TODO.bat
```

---

**Sistema ERP Meridian** 🚀
