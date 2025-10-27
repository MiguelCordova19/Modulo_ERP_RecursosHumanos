# Instrucciones para Ejecutar el Sistema ERP

## 📋 Requisitos Previos

### Backend (Spring Boot)
- **Java 17** o superior ([Descargar aquí](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.6+** (incluido con la mayoría de IDEs)
- **PostgreSQL 15+** ([Descargar aquí](https://www.postgresql.org/download/))

### Frontend
- Cualquier servidor web estático (Live Server, http-server, etc.)

---

## 🗄️ Paso 1: Configurar la Base de Datos

### 1.1 Instalar PostgreSQL
Descarga e instala PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/)

### 1.2 Crear la Base de Datos
Abre **pgAdmin** o la terminal de PostgreSQL y ejecuta:

```sql
CREATE DATABASE root;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE root TO root;
```

### 1.3 Importar el Script
Ejecuta el archivo `bd root 2.0` en la base de datos:

**Opción A - Con pgAdmin:**
1. Abre pgAdmin
2. Conecta a tu servidor PostgreSQL
3. Click derecho en la base de datos `root` → Query Tool
4. Abre el archivo `bd root 2.0`
5. Ejecuta el script (F5)

**Opción B - Con terminal:**
```bash
psql -U root -d root -f "bd root 2.0"
```

---

## 🚀 Paso 2: Ejecutar el Backend (Spring Boot)

### 2.1 Navegar a la carpeta backend
```bash
cd backend
```

### 2.2 Compilar y ejecutar con Maven
```bash
mvn clean install
mvn spring-boot:run
```

**O si prefieres ejecutar el JAR:**
```bash
mvn clean package
java -jar target/erp-backend-1.0.0.jar
```

### 2.3 Verificar que el backend está corriendo
El backend debería estar corriendo en: **http://localhost:3000**

Puedes verificar accediendo a: http://localhost:3000/api/menus/active

---

## 🌐 Paso 3: Ejecutar el Frontend

### ⚡ Opción A - Servidor Node.js Incluido (RECOMENDADO)
```bash
cd frontend
node server.js
```

O simplemente ejecuta el archivo: **`INICIAR-FRONTEND.bat`**

### Opción B - Con Live Server (VS Code)
⚠️ **IMPORTANTE:** Configura Live Server para servir desde la carpeta `frontend`:
1. Instala la extensión **Live Server** en VS Code
2. Abre VS Code en la carpeta `frontend` (no en la raíz)
3. Click derecho en `index.html` → "Open with Live Server"

### Opción C - Con http-server (Node.js)
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar DESDE LA CARPETA FRONTEND
cd frontend
http-server -p 5500
```

### Opción D - Con Python
```bash
# Python 3
cd frontend
python -m http.server 5500
```

El frontend debería estar corriendo en: **http://localhost:5500**

### 🚀 Inicio Rápido (Windows)
Ejecuta el archivo **`INICIAR-TODO.bat`** para iniciar backend y frontend automáticamente.

---

## 🔐 Paso 4: Iniciar Sesión

Accede a: **http://localhost:5500/login.html**

**Credenciales de prueba:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 📁 Estructura del Proyecto

```
Modulo_ERP_RecursosHumanos/
├── backend/                    # Backend Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/meridian/erp/
│   │       │       ├── config/      # Configuraciones
│   │       │       ├── controller/  # Controladores REST
│   │       │       ├── dto/         # DTOs
│   │       │       ├── entity/      # Entidades JPA
│   │       │       ├── repository/  # Repositorios
│   │       │       ├── service/     # Servicios
│   │       │       └── ErpApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
├── frontend/                   # Frontend HTML/CSS/JS
│   ├── css/
│   ├── js/
│   ├── modules/
│   ├── login.html
│   ├── dashboard.html
│   └── index.html
└── bd root 2.0                # Script de base de datos
```

---

## 🔧 Configuración Adicional

### Cambiar Puerto del Backend
Edita `backend/src/main/resources/application.properties`:
```properties
server.port=3000
```

### Cambiar Credenciales de Base de Datos
Edita `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/root
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
```

### Configurar CORS
Si el frontend corre en un puerto diferente, edita `application.properties`:
```properties
cors.allowed.origins=http://localhost:5500,http://127.0.0.1:5500
```

---

## 🐛 Solución de Problemas

### Error: "Connection refused" al hacer login
- Verifica que el backend esté corriendo en http://localhost:3000
- Revisa los logs del backend para ver errores

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en `application.properties`
- Verifica que la base de datos `root` exista

### Error: "CORS policy"
- Asegúrate de que el puerto del frontend esté en `cors.allowed.origins`
- Reinicia el backend después de cambiar la configuración

### El frontend no carga
- Verifica que estés usando un servidor web (no abras el HTML directamente)
- Revisa la consola del navegador para ver errores

---

## 📚 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Login de usuario

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Roles
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `PUT /api/roles/{id}` - Actualizar rol
- `DELETE /api/roles/{id}` - Eliminar rol

### Menús
- `GET /api/menus` - Listar todos los menús
- `GET /api/menus/active` - Listar menús activos

---

## ✅ Verificación Final

1. ✅ PostgreSQL corriendo
2. ✅ Base de datos `root` creada e importada
3. ✅ Backend corriendo en http://localhost:3000
4. ✅ Frontend corriendo en http://localhost:5500
5. ✅ Login exitoso con usuario `admin`

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs del backend en la consola
2. La consola del navegador (F12)
3. Que todos los servicios estén corriendo en los puertos correctos
