# 🚀 Inicio Rápido - Sistema ERP

Guía visual paso a paso para iniciar el sistema en menos de 5 minutos.

---

## 📋 Antes de Empezar

### ✅ Verifica que tengas instalado:

```bash
# Java 17+
java -version

# Node.js
node --version

# PostgreSQL
psql --version
```

Si falta alguno, consulta [INSTRUCCIONES.md](INSTRUCCIONES.md) para instalación.

---

## 🎯 Opción 1: Inicio Automático (Windows)

### Paso 1: Preparar la Base de Datos

**Solo la primera vez:**

1. Abre **pgAdmin** o la terminal de PostgreSQL
2. Ejecuta estos comandos:

```sql
CREATE DATABASE root;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE root TO root;
```

3. Importa el script:
   - En pgAdmin: Query Tool → Abrir archivo → Selecciona `bd root 2.0` → Ejecutar (F5)
   - En terminal: `psql -U root -d root -f "bd root 2.0"`

### Paso 2: Iniciar el Sistema

**Doble clic en:** `INICIAR-TODO.bat`

```
┌─────────────────────────────────────────┐
│  Se abrirán 2 ventanas de terminal:    │
│                                         │
│  1️⃣  ERP Backend (Spring Boot)          │
│     Puerto: 3000                        │
│     Espera: ~30 segundos                │
│                                         │
│  2️⃣  ERP Frontend (Node.js)             │
│     Puerto: 5500                        │
│     Espera: ~2 segundos                 │
└─────────────────────────────────────────┘
```

### Paso 3: Acceder al Sistema

1. **Abre tu navegador**
2. **Ve a:** http://localhost:5500/login.html
3. **Ingresa:**
   - Usuario: `admin`
   - Contraseña: `admin123`
4. **¡Listo!** 🎉

---

## 🎯 Opción 2: Inicio Manual

### Paso 1: Preparar la Base de Datos

**Solo la primera vez (igual que Opción 1)**

### Paso 2: Iniciar el Backend

**Abre una terminal:**

```bash
cd backend
mvn spring-boot:run
```

**Espera a ver este mensaje:**
```
Started ErpApplication in X.XXX seconds
```

**El backend está listo en:** http://localhost:3000

### Paso 3: Iniciar el Frontend

**Abre OTRA terminal:**

```bash
cd frontend
node server.js
```

**Verás este mensaje:**
```
╔════════════════════════════════════════════════════════════╗
║   🚀 Servidor Frontend Iniciado                           ║
║   📍 URL: http://localhost:5500                           ║
╚════════════════════════════════════════════════════════════╝
```

### Paso 4: Acceder al Sistema

**Igual que Opción 1, Paso 3**

---

## 🎯 Opción 3: Inicio Separado (Windows)

Si prefieres iniciar cada servicio por separado:

### Backend
**Doble clic en:** `INICIAR-BACKEND.bat`

### Frontend
**Doble clic en:** `INICIAR-FRONTEND.bat`

### Acceder
**Igual que Opción 1, Paso 3**

---

## ✅ Verificación

### 1. Verificar Backend

**Abre en tu navegador:**
```
http://localhost:3000/api/menus
```

**Deberías ver:** Un JSON con la lista de menús

```json
{
  "success": true,
  "message": "Menús obtenidos",
  "data": [...]
}
```

### 2. Verificar Frontend

**Abre en tu navegador:**
```
http://localhost:5500/login.html
```

**Deberías ver:**
- ✅ Página de login con estilos
- ✅ Logo "Sistema.ERP"
- ✅ Imagen de bienvenida
- ✅ Formulario de login

### 3. Verificar Login

**Ingresa:**
- Usuario: `admin`
- Contraseña: `admin123`

**Deberías:**
- ✅ Ver mensaje "¡Bienvenido Usuario Administrador Chidoris!"
- ✅ Ser redirigido al dashboard
- ✅ Ver el menú lateral con opciones

---

## 🐛 Problemas Comunes

### ❌ Error: "Port 3000 already in use"

**Causa:** El puerto 3000 ya está siendo usado

**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambia el puerto en application.properties
```

### ❌ Error: "Cannot connect to database"

**Causa:** PostgreSQL no está corriendo o la base de datos no existe

**Solución:**
1. Inicia PostgreSQL
2. Verifica que la base de datos `root` exista:
   ```sql
   \l  -- Lista todas las bases de datos
   ```
3. Si no existe, créala (ver Paso 1)

### ❌ Error: "Los estilos no cargan"

**Causa:** El servidor no está corriendo desde la carpeta correcta

**Solución:**
```bash
# CORRECTO
cd frontend
node server.js

# INCORRECTO
cd Modulo_ERP_RecursosHumanos
node frontend/server.js  # ❌
```

### ❌ Error: "Maven not found"

**Causa:** Maven no está instalado o no está en el PATH

**Solución:**
- Usa un IDE como IntelliJ IDEA que incluye Maven
- O instala Maven manualmente

### ❌ Error: "Node not found"

**Causa:** Node.js no está instalado

**Solución:**
- Descarga e instala Node.js desde: https://nodejs.org/

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    INICIO DEL SISTEMA                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │  ¿Base de datos configurada?  │
        └───────────┬───────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
       NO                      SÍ
        │                       │
        ▼                       ▼
┌───────────────┐      ┌────────────────┐
│ Crear BD root │      │ Iniciar Backend│
│ Importar SQL  │      │ (puerto 3000)  │
└───────┬───────┘      └────────┬───────┘
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ Backend corriendo│
          │ ✅ localhost:3000│
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ Iniciar Frontend │
          │ (puerto 5500)    │
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │Frontend corriendo│
          │ ✅ localhost:5500│
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ Abrir navegador  │
          │ /login.html      │
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ Login: admin     │
          │ Pass: admin123   │
          └─────────┬────────┘
                    │
                    ▼
          ┌──────────────────┐
          │   ✅ DASHBOARD   │
          │   Sistema listo  │
          └──────────────────┘
```

---

## 🎓 Comandos Útiles

### Ver logs del backend
```bash
# En la terminal donde corre el backend
# Los logs se muestran automáticamente
```

### Ver logs del frontend
```bash
# En la terminal donde corre el frontend
# Verás cada petición HTTP:
GET /login.html
GET /css/styles.css
GET /js/dashboard.js
```

### Detener los servicios
```bash
# En cada terminal, presiona:
Ctrl + C
```

### Reiniciar el backend
```bash
# Detén con Ctrl+C, luego:
mvn spring-boot:run
```

### Reiniciar el frontend
```bash
# Detén con Ctrl+C, luego:
node server.js
```

---

## 📱 Accesos Rápidos

### URLs del Sistema

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend Principal | http://localhost:5500 | Página de inicio |
| Login | http://localhost:5500/login.html | Página de login |
| Dashboard | http://localhost:5500/dashboard.html | Panel principal |
| Backend API | http://localhost:3000/api | API REST |
| Test Menús | http://localhost:3000/api/menus | Probar API |

### Credenciales

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin123 | Administrador |

---

## 🎯 Checklist de Inicio

Marca cada paso al completarlo:

### Primera Vez
- [ ] Java 17+ instalado
- [ ] Node.js instalado
- [ ] PostgreSQL instalado
- [ ] Base de datos `root` creada
- [ ] Script SQL importado

### Cada Vez que Inicies
- [ ] PostgreSQL corriendo
- [ ] Backend iniciado (puerto 3000)
- [ ] Frontend iniciado (puerto 5500)
- [ ] Navegador abierto en login.html
- [ ] Login exitoso

---

## 💡 Tips

### Tip 1: Usa los archivos .bat
Los archivos `.bat` verifican que todo esté instalado antes de iniciar.

### Tip 2: Mantén las terminales abiertas
No cierres las ventanas de terminal mientras uses el sistema.

### Tip 3: Verifica los puertos
Si cambias los puertos, actualiza:
- `application.properties` (backend)
- `server.js` (frontend)
- `CorsConfig.java` (CORS)

### Tip 4: Usa F12 para debugging
La consola del navegador (F12) muestra errores útiles.

### Tip 5: Revisa los logs
Los logs de backend y frontend muestran qué está pasando.

---

## 📞 ¿Necesitas Ayuda?

1. **Revisa:** [SOLUCION-RUTAS.md](SOLUCION-RUTAS.md)
2. **Revisa:** [FAQ.md](FAQ.md)
3. **Verifica:** Consola del navegador (F12)
4. **Verifica:** Logs del backend y frontend

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, tu sistema ERP debería estar funcionando correctamente.

**Disfruta del sistema!** 🚀

---

**Sistema ERP Meridian**
Versión 1.0.0
