# 🏗️ Arquitectura del Sistema ERP

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (HTML + CSS + JavaScript)                     │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  index.html  │  │  login.html  │  │dashboard.html│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  usuarios.js │  │    rol.js    │  │dashboard.js  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│                    Puerto: 5500 (Live Server)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (fetch)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                         BACKEND                                  │
│                      (Spring Boot 3.2)                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Controllers                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │AuthController│  │UsuarioControl│  │ RolController│  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │  ┌──────────────┐                                       │   │
│  │  │MenuController│                                       │   │
│  │  └──────────────┘                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │                      Services                          │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│     │
│  │  │ AuthService  │  │UsuarioService│  │  RolService  ││     │
│  │  └──────────────┘  └──────────────┘  └──────────────┘│     │
│  │  ┌──────────────┐                                     │     │
│  │  │ MenuService  │                                     │     │
│  │  └──────────────┘                                     │     │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │                    Repositories                        │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│     │
│  │  │UsuarioRepo   │  │   RolRepo    │  │  MenuRepo    ││     │
│  │  └──────────────┘  └──────────────┘  └──────────────┘│     │
│  │  ┌──────────────┐                                     │     │
│  │  │ EmpresaRepo  │                                     │     │
│  │  └──────────────┘                                     │     │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │                      Entities                          │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│     │
│  │  │   Usuario    │  │     Rol      │  │    Menu      ││     │
│  │  └──────────────┘  └──────────────┘  └──────────────┘│     │
│  │  ┌──────────────┐                                     │     │
│  │  │   Empresa    │                                     │     │
│  │  └──────────────┘                                     │     │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  Configuration                          │   │
│  │  ┌──────────────┐  ┌──────────────┐                    │   │
│  │  │ CorsConfig   │  │SecurityConfig│                    │   │
│  │  └──────────────┘  └──────────────┘                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│                    Puerto: 3000 (Tomcat)                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ JDBC
                            │ (JPA/Hibernate)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       BASE DE DATOS                              │
│                      PostgreSQL 15                               │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │rrhh_musuario │  │  rrhh_mrol   │  │ rrhh_mmenu   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │rrhh_mempresa │  │rrhh_mtipodoc │                             │
│  └──────────────┘  └──────────────┘                             │
│                                                                   │
│                    Puerto: 5432                                  │
│                    Database: root                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos: Login

```
┌──────────┐                                                    ┌──────────┐
│ Usuario  │                                                    │ Frontend │
└────┬─────┘                                                    └────┬─────┘
     │                                                               │
     │ 1. Ingresa usuario y contraseña                              │
     │──────────────────────────────────────────────────────────────▶
     │                                                               │
     │                                                               │
     │                                                          ┌────▼─────┐
     │                                                          │login.html│
     │                                                          └────┬─────┘
     │                                                               │
     │                                                               │ 2. fetch('/api/auth/login')
     │                                                               │
     │                                                          ┌────▼─────────┐
     │                                                          │   Backend    │
     │                                                          │AuthController│
     │                                                          └────┬─────────┘
     │                                                               │
     │                                                               │ 3. Validar credenciales
     │                                                               │
     │                                                          ┌────▼─────────┐
     │                                                          │ AuthService  │
     │                                                          └────┬─────────┘
     │                                                               │
     │                                                               │ 4. Buscar usuario
     │                                                               │
     │                                                          ┌────▼──────────┐
     │                                                          │UsuarioRepo    │
     │                                                          └────┬──────────┘
     │                                                               │
     │                                                               │ 5. Query SQL
     │                                                               │
     │                                                          ┌────▼──────────┐
     │                                                          │  PostgreSQL   │
     │                                                          └────┬──────────┘
     │                                                               │
     │                                                               │ 6. Usuario encontrado
     │                                                               │
     │                                                          ┌────▼─────────┐
     │                                                          │ AuthService  │
     │                                                          │ - Verifica   │
     │                                                          │   password   │
     │                                                          │   (BCrypt)   │
     │                                                          └────┬─────────┘
     │                                                               │
     │                                                               │ 7. Login exitoso
     │                                                               │
     │                                                          ┌────▼─────────┐
     │                                                          │AuthController│
     │                                                          │ - Retorna    │
     │                                                          │   ApiResponse│
     │                                                          └────┬─────────┘
     │                                                               │
     │                                                               │ 8. JSON Response
     │                                                               │
     │                                                          ┌────▼─────┐
     │                                                          │ Frontend │
     │                                                          │ - Guarda │
     │                                                          │   en      │
     │                                                          │   localStorage
     │                                                          └────┬─────┘
     │                                                               │
     │ 9. Redirige a dashboard                                      │
     │◀──────────────────────────────────────────────────────────────
     │                                                               │
┌────▼─────┐                                                    ┌────▼─────┐
│ Usuario  │                                                    │dashboard │
│en sistema│                                                    │  .html   │
└──────────┘                                                    └──────────┘
```

---

## 🗂️ Estructura de Capas

### 1. Capa de Presentación (Frontend)
**Responsabilidad:** Interfaz de usuario y experiencia
- HTML5 para estructura
- CSS3 para estilos
- JavaScript vanilla para lógica
- Bootstrap 5 para componentes UI
- DataTables para tablas interactivas

### 2. Capa de API (Controllers)
**Responsabilidad:** Exponer endpoints REST
- Recibe peticiones HTTP
- Valida datos de entrada
- Delega lógica a servicios
- Retorna respuestas JSON estandarizadas

### 3. Capa de Negocio (Services)
**Responsabilidad:** Lógica de negocio
- Validaciones complejas
- Transformación de datos
- Encriptación de contraseñas
- Orquestación de operaciones

### 4. Capa de Acceso a Datos (Repositories)
**Responsabilidad:** Interacción con la base de datos
- Operaciones CRUD
- Queries personalizadas
- Abstracción de JPA/Hibernate

### 5. Capa de Persistencia (Entities)
**Responsabilidad:** Mapeo objeto-relacional
- Representación de tablas como clases
- Relaciones entre entidades
- Validaciones de datos

### 6. Base de Datos (PostgreSQL)
**Responsabilidad:** Almacenamiento persistente
- Tablas relacionales
- Constraints e índices
- Stored procedures

---

## 🔐 Flujo de Seguridad

```
┌─────────────────────────────────────────────────────────────┐
│                    Petición HTTP                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   CORS Filter                                │
│  - Verifica origen permitido                                │
│  - Agrega headers CORS                                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Security Filter                          │
│  - CSRF deshabilitado (API REST)                            │
│  - Permite todas las peticiones (sin JWT por ahora)         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Controller                                 │
│  - Recibe petición                                          │
│  - Valida datos (@Valid)                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service                                   │
│  - Lógica de negocio                                        │
│  - Encriptación BCrypt (contraseñas)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Repository                                 │
│  - Acceso a base de datos                                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL                                  │
│  - Datos encriptados (contraseñas)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Modelo de Datos

```
┌─────────────────────┐
│   rrhh_mempresa     │
├─────────────────────┤
│ imempresa_id (PK)   │◀──────────┐
│ te_descripcion      │           │
│ ie_estado           │           │
└─────────────────────┘           │
                                  │
                                  │ FK
                                  │
┌─────────────────────┐           │
│   rrhh_musuario     │           │
├─────────────────────┤           │
│ imusuario_id (PK)   │           │
│ tu_apellidopaterno  │           │
│ tu_apellidomaterno  │           │
│ tu_nombres          │           │
│ iu_empresa (FK)     │───────────┘
│ iu_sede             │
│ iu_tipodocumento    │───────────┐
│ tu_nrodocumento     │           │
│ fu_fechanacimiento  │           │
│ iu_rol (FK)         │───────┐   │
│ iu_puesto           │       │   │
│ tu_nrocelular       │       │   │
│ tu_correo           │       │   │
│ iu_estado           │       │   │
│ tu_usuario (UNIQUE) │       │   │
│ tu_password         │       │   │
└─────────────────────┘       │   │
                              │   │
                              │   │ FK
                              │   │
┌─────────────────────┐       │   │
│     rrhh_mrol       │       │   │
├─────────────────────┤       │   │
│ imrol_id (PK)       │◀──────┘   │
│ tr_descripcion      │           │
│ ir_estado           │           │
│ ir_empresa          │           │
└─────────────────────┘           │
                                  │
                                  │ FK
                                  │
┌─────────────────────┐           │
│rrhh_mtipodocumento  │           │
├─────────────────────┤           │
│ imtipodoc_id (PK)   │◀──────────┘
│ ttd_codsunat        │
│ ttd_descripcion     │
│ ttd_abreviatura     │
└─────────────────────┘

┌─────────────────────┐
│    rrhh_mmenu       │
├─────────────────────┤
│ menu_id (PK)        │
│ menu_ruta           │
│ menu_icon           │
│ menu_nombre         │
│ menu_estado         │
│ menu_padre          │
│ menu_nivel          │
│ menu_posicion       │
└─────────────────────┘
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript ES6+** - Lógica
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.4** - Iconos
- **DataTables** - Tablas interactivas
- **jQuery** - Manipulación DOM

### Backend
- **Java 17** - Lenguaje
- **Spring Boot 3.2** - Framework
- **Spring Data JPA** - ORM
- **Spring Security** - Seguridad
- **Hibernate** - Implementación JPA
- **Maven** - Gestión de dependencias
- **Lombok** - Reducir boilerplate
- **BCrypt** - Encriptación de contraseñas

### Base de Datos
- **PostgreSQL 15** - RDBMS
- **pgAdmin** - Cliente GUI

### Herramientas de Desarrollo
- **VS Code** - Editor
- **IntelliJ IDEA** - IDE Java
- **Postman** - Testing API
- **Git** - Control de versiones

---

## 📈 Escalabilidad Futura

### Mejoras Sugeridas

1. **Autenticación JWT**
   - Tokens de acceso y refresh
   - Sesiones sin estado
   - Mayor seguridad

2. **Caché**
   - Redis para sesiones
   - Caché de menús y roles
   - Mejor rendimiento

3. **Microservicios**
   - Separar módulos (RRHH, Inventario, etc.)
   - API Gateway
   - Service Discovery

4. **Mensajería**
   - RabbitMQ o Kafka
   - Procesamiento asíncrono
   - Notificaciones en tiempo real

5. **Contenedorización**
   - Docker para backend
   - Docker Compose para stack completo
   - Kubernetes para orquestación

6. **Monitoreo**
   - Spring Boot Actuator
   - Prometheus + Grafana
   - ELK Stack para logs

7. **Testing**
   - JUnit 5 para tests unitarios
   - Mockito para mocks
   - TestContainers para tests de integración

8. **CI/CD**
   - GitHub Actions
   - Jenkins
   - Despliegue automático

---

## 🎯 Patrones de Diseño Utilizados

### 1. MVC (Model-View-Controller)
- **Model:** Entities
- **View:** Frontend HTML
- **Controller:** Spring Controllers

### 2. Repository Pattern
- Abstracción de acceso a datos
- Interfaces JpaRepository

### 3. Service Layer Pattern
- Lógica de negocio separada
- Reutilización de código

### 4. DTO Pattern
- Transferencia de datos
- Separación de entidades y respuestas

### 5. Dependency Injection
- Spring IoC Container
- @Autowired / Constructor Injection

### 6. Builder Pattern
- Lombok @Builder
- Construcción de objetos complejos

---

## 📝 Convenciones de Código

### Nomenclatura
- **Clases:** PascalCase (UsuarioService)
- **Métodos:** camelCase (findById)
- **Constantes:** UPPER_SNAKE_CASE (MAX_ATTEMPTS)
- **Paquetes:** lowercase (com.meridian.erp)

### Estructura de Paquetes
```
com.meridian.erp
├── config      # Configuraciones
├── controller  # Endpoints REST
├── dto         # Data Transfer Objects
├── entity      # Entidades JPA
├── repository  # Repositorios
├── service     # Lógica de negocio
└── util        # Utilidades
```

### Respuestas API
```json
{
  "success": true/false,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```
