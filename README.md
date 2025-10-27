# 🏢 Sistema ERP - Módulo de Recursos Humanos

Sistema de gestión empresarial (ERP) enfocado en el módulo de Recursos Humanos, desarrollado con **Spring Boot** y **PostgreSQL**.

## 🚀 Migración Completada: Express.js → Spring Boot

Este proyecto ha sido migrado exitosamente de Express.js/Docker a **Spring Boot 3.2** con arquitectura REST API.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Documentación](#-documentación)
- [Contribución](#-contribución)

---

## ✨ Características

- ✅ **Autenticación de usuarios** con BCrypt
- ✅ **Gestión de usuarios** (CRUD completo)
- ✅ **Gestión de roles** (CRUD completo)
- ✅ **Menús dinámicos** jerárquicos
- ✅ **Dashboard interactivo** con DataTables
- ✅ **Gestión de empresas y sedes**
- ✅ **API REST** con respuestas estandarizadas
- ✅ **CORS configurado** para desarrollo
- ✅ **Base de datos PostgreSQL** con relaciones

---

## 🛠️ Tecnologías

### Backend
- **Java 17**
- **Spring Boot 3.2**
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL 15**
- **Maven**
- **Lombok**
- **BCrypt**

### Frontend
- **HTML5 + CSS3**
- **JavaScript ES6+**
- **Bootstrap 5.3**
- **Font Awesome 6.4**
- **DataTables**
- **jQuery**

---

## 📦 Requisitos

- **Java 17** o superior
- **Maven 3.6+**
- **PostgreSQL 15+**
- **Navegador web moderno**
- **Servidor web** (Live Server, http-server, etc.)

---

## � Inicio Rápido

**¿Primera vez usando el sistema?** Lee la guía: **[INICIO-RAPIDO.md](INICIO-RAPIDO.md)**

**¿Problemas con rutas o estilos?** Lee: **[SOLUCION-RUTAS.md](SOLUCION-RUTAS.md)**

### Inicio Automático (Windows)
Ejecuta: **`INICIAR-TODO.bat`**

---

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/Modulo_ERP_RecursosHumanos.git
cd Modulo_ERP_RecursosHumanos
```

### 2. Configurar PostgreSQL
```sql
CREATE DATABASE root;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE root TO root;
```

### 3. Importar el script de base de datos
```bash
psql -U root -d root -f "bd root 2.0"
```

### 4. Configurar el backend
Edita `backend/src/main/resources/application.properties` si es necesario:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/root
spring.datasource.username=root
spring.datasource.password=root
```

### 5. Compilar y ejecutar el backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en: **http://localhost:3000**

### 6. Ejecutar el frontend

**⚡ Opción Recomendada - Servidor Node.js incluido:**
```bash
cd frontend
node server.js
```

**O ejecuta el archivo batch (Windows):**
```bash
INICIAR-FRONTEND.bat
```

**Otras opciones:**
```bash
# Con http-server (desde la carpeta frontend)
cd frontend
npm install -g http-server
http-server -p 5500

# Con Python (desde la carpeta frontend)
cd frontend
python -m http.server 5500
```

⚠️ **IMPORTANTE:** Siempre ejecuta el servidor desde la carpeta `frontend`, no desde la raíz del proyecto.

El frontend estará disponible en: **http://localhost:5500**

### 🚀 Inicio Rápido (Windows)
Ejecuta **`INICIAR-TODO.bat`** para iniciar backend y frontend automáticamente.

---

## 🎯 Uso

### Acceder al sistema
1. Abre tu navegador en: **http://localhost:5500/login.html**
2. Ingresa las credenciales:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`
3. Serás redirigido al dashboard

### Módulos disponibles
- **Gestión de Seguridad**
  - Usuarios
  - Roles
  - Asignar Rol
- **Gestión de Planilla**
  - Maestros (Motivo Préstamo, Feriados, etc.)
  - Procesos (Trabajador, Contrato, Asistencia, etc.)

---

## 📁 Estructura del Proyecto

```
Modulo_ERP_RecursosHumanos/
├── backend/                          # Backend Spring Boot
│   ├── src/main/java/com/meridian/erp/
│   │   ├── config/                   # Configuraciones
│   │   ├── controller/               # Controladores REST
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── entity/                   # Entidades JPA
│   │   ├── repository/               # Repositorios
│   │   ├── service/                  # Servicios de negocio
│   │   └── ErpApplication.java       # Clase principal
│   ├── src/main/resources/
│   │   └── application.properties    # Configuración
│   ├── pom.xml                       # Dependencias Maven
│   └── README.md
├── frontend/                         # Frontend HTML/CSS/JS
│   ├── css/                          # Estilos
│   ├── js/                           # Scripts
│   ├── modules/                      # Módulos HTML
│   ├── images/                       # Imágenes
│   ├── index.html                    # Página principal
│   ├── login.html                    # Login
│   └── dashboard.html                # Dashboard
├── bd root 2.0                       # Script SQL
├── INSTRUCCIONES.md                  # Guía de instalación
├── RESUMEN-MIGRACION.md              # Detalles de la migración
├── ARQUITECTURA.md                   # Arquitectura del sistema
├── COMANDOS-UTILES.md                # Comandos útiles
├── FAQ.md                            # Preguntas frecuentes
└── README.md                         # Este archivo
```

---

## 🌐 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login de usuario |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |
| PUT | `/api/usuarios/{id}` | Actualizar usuario |
| DELETE | `/api/usuarios/{id}` | Eliminar usuario |

### Roles
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/roles` | Listar todos los roles |
| GET | `/api/roles/{id}` | Obtener rol por ID |
| POST | `/api/roles` | Crear nuevo rol |
| PUT | `/api/roles/{id}` | Actualizar rol |
| DELETE | `/api/roles/{id}` | Eliminar rol |

### Menús
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/menus` | Listar todos los menús |
| GET | `/api/menus/active` | Listar menús activos |

### Ejemplo de respuesta
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 2,
    "usuario": "admin",
    "nombreCompleto": "Usuario Administrador Chidoris",
    "correo": "admin@empresa.com",
    "empresa": "EMPRESA TEST",
    "estado": 1
  }
}
```

---

## 📚 Documentación

- **[INSTRUCCIONES.md](INSTRUCCIONES.md)** - Guía paso a paso de instalación
- **[SOLUCION-PROXY.md](SOLUCION-PROXY.md)** - ⚠️ **IMPORTANTE:** Solución proxy Frontend ↔ Backend
- **[SOLUCION-RUTAS.md](SOLUCION-RUTAS.md)** - Solución a problemas de rutas y estilos
- **[RESUMEN-MIGRACION.md](RESUMEN-MIGRACION.md)** - Detalles de la migración Express → Spring Boot
- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Arquitectura y diagramas del sistema
- **[COMANDOS-UTILES.md](COMANDOS-UTILES.md)** - Comandos útiles para desarrollo
- **[FAQ.md](FAQ.md)** - Preguntas frecuentes
- **[backend/README.md](backend/README.md)** - Documentación específica del backend
- **[backend/test-api.http](backend/test-api.http)** - Ejemplos de peticiones API

### 🚀 Archivos de Inicio Rápido (Windows)
- **[INICIAR-TODO.bat](INICIAR-TODO.bat)** - Inicia backend y frontend automáticamente
- **[INICIAR-BACKEND.bat](INICIAR-BACKEND.bat)** - Solo backend
- **[INICIAR-FRONTEND.bat](INICIAR-FRONTEND.bat)** - Solo frontend

---

## 🧪 Testing

### Probar la API
Usa el archivo `backend/test-api.http` con la extensión REST Client de VS Code:

```http
### Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

O usa Postman/Insomnia con los ejemplos del archivo.

---

## 🐛 Solución de Problemas

### ❌ Dashboard no carga después del login
**Causa:** Rutas sin extensión `.html` o caché del navegador.

**Solución:** 
1. Reinicia el frontend: `cd frontend && node server.js`
2. Limpia caché: Ctrl+Shift+R o usa modo incógnito
3. Todas las rutas ahora incluyen `.html`

Ver guía completa: [SOLUCION-RUTAS-DASHBOARD.md](SOLUCION-RUTAS-DASHBOARD.md)

### ❌ Error: Frontend no se conecta al Backend
**Causa:** El frontend (puerto 5500) no puede comunicarse con el backend (puerto 3000).

**Solución:** Usa el servidor Node.js con proxy incluido:
```bash
cd frontend
node server.js
```
El proxy redirige automáticamente `/api/*` al backend.

Ver guía completa: [SOLUCION-PROXY.md](SOLUCION-PROXY.md)

### ❌ Error 405: Method Not Allowed en login
**Causa:** El navegador está haciendo GET en lugar de POST, o hay problemas de CORS.

**Solución:** 
1. Reinicia el backend después de los cambios
2. Limpia la caché del navegador (Ctrl+Shift+R)
3. Verifica: http://localhost:3000/api/auth/status

Ver guía completa: [PRUEBA-LOGIN.md](PRUEBA-LOGIN.md)

### ❌ Los estilos CSS no cargan
**Causa:** El servidor no está sirviendo desde la carpeta correcta.

**Solución:** Ejecuta el servidor desde la carpeta `frontend`:
```bash
cd frontend
node server.js
```
Ver guía completa: [SOLUCION-RUTAS.md](SOLUCION-RUTAS.md)

### Error: "Connection refused"
- Verifica que el backend esté corriendo en http://localhost:3000
- Revisa los logs del backend

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en `application.properties`

### Error: "CORS policy"
- Asegúrate de que el puerto del frontend esté en `cors.allowed.origins`
- Reinicia el backend

### Error: "404 Not Found" en archivos CSS/JS
- Asegúrate de ejecutar el servidor desde la carpeta `frontend`
- Usa el servidor Node.js incluido: `node server.js`

Ver más en [FAQ.md](FAQ.md) y [SOLUCION-RUTAS.md](SOLUCION-RUTAS.md)

---

## 🚀 Despliegue

### Crear JAR ejecutable
```bash
cd backend
mvn clean package -DskipTests
```

### Ejecutar en producción
```bash
java -jar target/erp-backend-1.0.0.jar
```

### Docker (Opcional)
```bash
docker build -t erp-backend .
docker run -p 3000:3000 erp-backend
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "Agrega nueva funcionalidad"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado y está bajo desarrollo.

---

## 👥 Autores

- **Equipo de Desarrollo** - Meridian ERP

---

## 📞 Contacto

- **Email:** contacto@meridianerp.com
- **Teléfono:** +51 948 555 123

---

## 🎯 Roadmap

- [ ] Implementar JWT Authentication
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar paginación en listados
- [ ] Agregar Swagger/OpenAPI documentation
- [ ] Implementar auditoría de cambios
- [ ] Agregar generación de reportes (PDF/Excel)
- [ ] Implementar notificaciones por email
- [ ] Dockerizar la aplicación completa
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Implementar caché con Redis

---

## 📊 Estado del Proyecto

🟢 **Activo** - En desarrollo activo

**Última actualización:** Octubre 2024

---

## ⭐ Agradecimientos

- Spring Boot Team
- PostgreSQL Community
- Bootstrap Team
- Font Awesome

---

**¡Gracias por usar Meridian ERP!** 🚀
