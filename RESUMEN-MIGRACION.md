# 📋 Resumen de Migración: Express.js → Spring Boot

## ✅ Cambios Realizados

### 1. Backend Eliminado
- ❌ Carpeta `backend/` con Docker y Express.js eliminada

### 2. Nuevo Backend Spring Boot Creado

#### Estructura del Proyecto
```
backend/
├── src/main/java/com/meridian/erp/
│   ├── ErpApplication.java          # Clase principal
│   ├── config/
│   │   ├── CorsConfig.java          # Configuración CORS
│   │   └── SecurityConfig.java      # Configuración de seguridad
│   ├── controller/
│   │   ├── AuthController.java      # Login
│   │   ├── UsuarioController.java   # CRUD Usuarios
│   │   ├── RolController.java       # CRUD Roles
│   │   └── MenuController.java      # Menús
│   ├── dto/
│   │   ├── ApiResponse.java         # Respuesta estándar API
│   │   ├── LoginRequest.java        # Request de login
│   │   └── LoginResponse.java       # Response de login
│   ├── entity/
│   │   ├── Usuario.java             # Entidad Usuario
│   │   ├── Rol.java                 # Entidad Rol
│   │   ├── Empresa.java             # Entidad Empresa
│   │   └── Menu.java                # Entidad Menu
│   ├── repository/
│   │   ├── UsuarioRepository.java
│   │   ├── RolRepository.java
│   │   ├── EmpresaRepository.java
│   │   └── MenuRepository.java
│   └── service/
│       ├── AuthService.java         # Lógica de autenticación
│       ├── UsuarioService.java      # Lógica de usuarios
│       ├── RolService.java          # Lógica de roles
│       └── MenuService.java         # Lógica de menús
└── src/main/resources/
    └── application.properties       # Configuración
```

---

## 🔌 Conexiones Frontend ↔ Backend

### Endpoints Implementados

| Endpoint | Método | Descripción | Usado en Frontend |
|----------|--------|-------------|-------------------|
| `/api/auth/login` | POST | Login de usuario | ✅ `login.html` |
| `/api/menus` | GET | Obtener todos los menús | ✅ `dashboard.js` |
| `/api/menus/active` | GET | Obtener menús activos | ⚠️ Disponible |
| `/api/usuarios` | GET | Listar usuarios | ⚠️ Disponible |
| `/api/usuarios` | POST | Crear usuario | ⚠️ Disponible |
| `/api/usuarios/{id}` | PUT | Actualizar usuario | ⚠️ Disponible |
| `/api/usuarios/{id}` | DELETE | Eliminar usuario | ⚠️ Disponible |
| `/api/roles` | GET | Listar roles | ⚠️ Disponible |
| `/api/roles` | POST | Crear rol | ⚠️ Disponible |
| `/api/roles/{id}` | PUT | Actualizar rol | ⚠️ Disponible |
| `/api/roles/{id}` | DELETE | Eliminar rol | ⚠️ Disponible |

---

## 🔄 Flujo de Autenticación

### Frontend (login.html)
```javascript
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

const data = await response.json();
// data = { success: true, message: "...", data: {...} }
```

### Backend (AuthController.java)
```java
@PostMapping("/api/auth/login")
public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
    // 1. Buscar usuario por username
    // 2. Verificar contraseña con BCrypt
    // 3. Verificar estado activo
    // 4. Retornar datos del usuario
}
```

### Respuesta Exitosa
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

## 🗄️ Base de Datos PostgreSQL

### Tablas Principales
- `rrhh_musuario` - Usuarios del sistema
- `rrhh_mrol` - Roles
- `rrhh_mempresa` - Empresas
- `rrhh_mmenu` - Menús del sistema
- `rrhh_mtipodocumento` - Tipos de documento

### Usuario de Prueba
```sql
Usuario: admin
Contraseña: admin123 (encriptada con BCrypt)
Estado: Activo (1)
```

---

## 🔐 Seguridad

### Encriptación de Contraseñas
- **Algoritmo:** BCrypt
- **Implementación:** Spring Security Crypto
- Las contraseñas se encriptan automáticamente al crear/actualizar usuarios

### CORS
- Configurado para permitir peticiones desde:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://localhost:5500`
  - `http://127.0.0.1:5500`

### Spring Security
- Configurado para permitir todas las peticiones (sin autenticación JWT por ahora)
- CSRF deshabilitado para APIs REST

---

## 📦 Dependencias Maven

```xml
- spring-boot-starter-web       # REST API
- spring-boot-starter-data-jpa  # JPA/Hibernate
- postgresql                     # Driver PostgreSQL
- spring-boot-starter-security  # Seguridad
- spring-security-crypto        # BCrypt
- lombok                        # Reducir boilerplate
- spring-boot-starter-validation # Validaciones
- spring-boot-devtools          # Hot reload
```

---

## 🚀 Cómo Ejecutar

### 1. Base de Datos
```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE root;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE root TO root;

# Importar script
psql -U root -d root -f "bd root 2.0"
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
**Puerto:** http://localhost:3000

### 3. Frontend
```bash
# Con Live Server (VS Code) o
http-server -p 5500
```
**Puerto:** http://localhost:5500

---

## ✨ Características Implementadas

### ✅ Autenticación
- Login con usuario y contraseña
- Verificación de contraseña con BCrypt
- Validación de estado activo
- Respuesta con datos del usuario

### ✅ Gestión de Usuarios
- Listar todos los usuarios
- Crear nuevo usuario (con encriptación automática)
- Actualizar usuario
- Eliminar usuario
- Validación de usuario único

### ✅ Gestión de Roles
- CRUD completo de roles
- Relación con usuarios

### ✅ Menús Dinámicos
- Obtener todos los menús
- Filtrar menús activos
- Ordenados por posición

### ✅ CORS Configurado
- Permite peticiones desde el frontend
- Métodos: GET, POST, PUT, DELETE, OPTIONS

---

## 🔧 Configuración

### application.properties
```properties
# Puerto del servidor
server.port=3000

# Base de datos
spring.datasource.url=jdbc:postgresql://localhost:5432/root
spring.datasource.username=root
spring.datasource.password=root

# JPA
spring.jpa.hibernate.ddl-auto=none  # No modifica la BD
spring.jpa.show-sql=true            # Muestra queries SQL

# CORS
cors.allowed.origins=http://localhost:5500,...
```

---

## 📝 Notas Importantes

1. **Sin JWT:** Por ahora no hay autenticación con tokens JWT. El frontend maneja la sesión con localStorage.

2. **Contraseñas:** Al crear usuarios, las contraseñas se encriptan automáticamente. No envíes contraseñas ya encriptadas.

3. **CORS:** Si cambias el puerto del frontend, actualiza `cors.allowed.origins` en `application.properties`.

4. **Base de Datos:** El backend NO modifica la estructura de la BD (`ddl-auto=none`). Usa el script SQL para crear las tablas.

5. **Hot Reload:** Con `spring-boot-devtools`, los cambios en el código se recargan automáticamente.

---

## 🎯 Próximos Pasos Sugeridos

1. **Implementar JWT** para autenticación basada en tokens
2. **Agregar validaciones** en los DTOs con `@Valid`
3. **Implementar paginación** en los listados
4. **Agregar logs** con SLF4J
5. **Crear tests unitarios** con JUnit
6. **Dockerizar** la aplicación
7. **Agregar Swagger** para documentación de API

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en `application.properties`

### Error: "Port 3000 already in use"
- Cambia el puerto en `application.properties`
- O detén el proceso que usa el puerto 3000

### Error: "CORS policy"
- Agrega el origen del frontend en `cors.allowed.origins`
- Reinicia el backend

### Login falla
- Verifica que el usuario exista en la BD
- Ejecuta `verificar-usuario.sql` para ver el usuario admin
- La contraseña debe ser "admin123" (sin encriptar al enviar)

---

## 📚 Recursos

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [BCrypt](https://en.wikipedia.org/wiki/Bcrypt)
