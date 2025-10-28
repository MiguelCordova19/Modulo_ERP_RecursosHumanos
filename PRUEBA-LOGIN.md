# 🧪 Prueba de Login - Guía de Solución

## 🚨 Error Reportado

```
"status": 405,
"error": "Method Not Allowed",
"message": "Method 'GET' is not supported."
```

---

## 🔍 Causa del Error

El error **405 Method Not Allowed** ocurre cuando:
1. El navegador intenta hacer un GET a `/api/auth/login` (por ejemplo, al escribir la URL directamente)
2. El endpoint solo acepta POST

---

## ✅ Solución Implementada

He actualizado el backend para:
1. ✅ Agregar un endpoint GET informativo en `/api/auth/login`
2. ✅ Mejorar la configuración CORS
3. ✅ Agregar un endpoint de status en `/api/auth/status`

---

## 🧪 Cómo Probar

### Paso 1: Reiniciar el Backend

**Detén el backend** (Ctrl+C en la terminal) y **reinícialo**:

```bash
cd backend
mvn spring-boot:run
```

**Espera a ver:**
```
Started ErpApplication in X.XXX seconds
```

### Paso 2: Verificar que el Backend Funciona

**Abre en tu navegador:**
```
http://localhost:3000/api/auth/status
```

**Deberías ver:**
```json
{
  "success": true,
  "message": "API de autenticación funcionando correctamente",
  "data": "OK"
}
```

### Paso 3: Probar el Login desde el Frontend

1. **Asegúrate de que el frontend esté corriendo:**
   ```bash
   cd frontend
   node server.js
   ```

2. **Abre en tu navegador:**
   ```
   http://localhost:5500/login.html
   ```

3. **Ingresa las credenciales:**
   - Usuario: `admin`
   - Contraseña: `admin123`

4. **Haz clic en "Iniciar Sesión"**

5. **Deberías ver:**
   - ✅ Mensaje: "¡Bienvenido Usuario Administrador Chidoris!"
   - ✅ Redirección al dashboard

---

## 🐛 Si el Error Persiste

### Verificación 1: Consola del Navegador

1. **Abre la consola del navegador** (F12)
2. **Ve a la pestaña "Network"**
3. **Intenta hacer login**
4. **Busca la petición a `/api/auth/login`**
5. **Verifica:**
   - ✅ Método: POST (no GET)
   - ✅ Status: 200 OK
   - ✅ Response: JSON con success: true

### Verificación 2: Logs del Backend

En la terminal donde corre el backend, deberías ver:

```
Hibernate: select ... from rrhh_musuario ...
```

Si ves esto, significa que el backend está procesando el login correctamente.

### Verificación 3: Probar con cURL

**Abre una terminal y ejecuta:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

**Deberías ver:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 2,
    "usuario": "admin",
    "nombreCompleto": "Usuario Administrador Chidoris",
    ...
  }
}
```

---

## 🔧 Problemas Comunes

### Problema 1: "CORS policy error"

**Síntoma:**
```
Access to fetch at 'http://localhost:3000/api/auth/login' from origin 
'http://localhost:5500' has been blocked by CORS policy
```

**Solución:**
1. Verifica que el backend esté corriendo
2. Reinicia el backend después de los cambios
3. Limpia la caché del navegador (Ctrl+Shift+Delete)

### Problema 2: "Connection refused"

**Síntoma:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Solución:**
- El backend no está corriendo
- Inicia el backend: `cd backend && mvn spring-boot:run`

### Problema 3: "Usuario o contraseña incorrectos"

**Síntoma:**
El login responde pero dice que las credenciales son incorrectas.

**Solución:**
Verifica que el usuario exista en la base de datos:

```sql
SELECT 
    imusuario_id,
    tu_usuario,
    tu_nombres,
    tu_apellidopaterno,
    iu_estado
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';
```

Si no existe, ejecuta el script `bd root 2.0` nuevamente.

### Problema 4: El error 405 sigue apareciendo

**Causa:** El navegador tiene la petición en caché.

**Solución:**
1. **Limpia la caché del navegador:**
   - Chrome: Ctrl+Shift+Delete → Selecciona "Imágenes y archivos en caché" → Borrar datos
   - Firefox: Ctrl+Shift+Delete → Selecciona "Caché" → Limpiar ahora

2. **Recarga la página sin caché:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

3. **Usa modo incógnito:**
   - Ctrl+Shift+N (Chrome)
   - Ctrl+Shift+P (Firefox)

---

## 📊 Flujo Correcto del Login

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario ingresa credenciales en login.html              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. JavaScript hace POST a /api/auth/login                  │
│    - Method: POST                                           │
│    - Headers: Content-Type: application/json               │
│    - Body: {"username":"admin","password":"admin123"}      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Backend recibe la petición                              │
│    - AuthController.login() se ejecuta                     │
│    - AuthService.login() valida credenciales               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Backend consulta la base de datos                       │
│    - Busca usuario por username                            │
│    - Verifica contraseña con BCrypt                        │
│    - Verifica que esté activo (estado = 1)                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Backend responde con JSON                               │
│    {                                                        │
│      "success": true,                                       │
│      "message": "Login exitoso",                           │
│      "data": { ... }                                        │
│    }                                                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Frontend procesa la respuesta                           │
│    - Guarda datos en localStorage                          │
│    - Muestra mensaje de bienvenida                         │
│    - Redirige a dashboard.html                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] ✅ PostgreSQL está corriendo
- [ ] ✅ La base de datos `root` existe y tiene datos
- [ ] ✅ El backend está corriendo en http://localhost:3000
- [ ] ✅ El frontend está corriendo en http://localhost:5500
- [ ] ✅ El endpoint de status funciona: http://localhost:3000/api/auth/status
- [ ] ✅ La consola del navegador no muestra errores CORS
- [ ] ✅ La petición es POST (no GET)
- [ ] ✅ Las credenciales son correctas (admin / admin123)

---

## 🔗 Endpoints de Prueba

### Status de la API
```
GET http://localhost:3000/api/auth/status
```
**Respuesta esperada:** `{"success":true,"message":"API de autenticación funcionando correctamente","data":"OK"}`

### Login (POST)
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```
**Respuesta esperada:** `{"success":true,"message":"Login exitoso","data":{...}}`

### Login (GET) - Solo informativo
```
GET http://localhost:3000/api/auth/login
```
**Respuesta esperada:** `{"success":false,"message":"Método GET no permitido. Use POST para hacer login.","data":null}`

### Menús
```
GET http://localhost:3000/api/menus
```
**Respuesta esperada:** `{"success":true,"message":"Menús obtenidos","data":[...]}`

---

## 📞 Soporte Adicional

Si después de seguir todos estos pasos el problema persiste:

1. **Captura de pantalla** de la consola del navegador (F12)
2. **Copia los logs** del backend (terminal donde corre Spring Boot)
3. **Verifica** que estés usando las URLs correctas:
   - Frontend: http://localhost:5500/login.html
   - Backend: http://localhost:3000

---

## ✅ Cambios Realizados

### AuthController.java
- ✅ Agregado endpoint GET `/api/auth/login` (informativo)
- ✅ Agregado endpoint GET `/api/auth/status` (verificación)
- ✅ Agregado `@CrossOrigin` para CORS

### CorsConfig.java
- ✅ Mejorada configuración CORS
- ✅ Agregado `CorsFilter` bean
- ✅ Permitidos todos los puertos de localhost

---

**¡El sistema debería funcionar correctamente ahora!** 🚀

Reinicia el backend y prueba nuevamente.
