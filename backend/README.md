# ERP Backend - Spring Boot

Backend del sistema ERP desarrollado con Spring Boot y PostgreSQL.

## Requisitos

- Java 17 o superior
- Maven 3.6+
- PostgreSQL 15+

## Configuración de Base de Datos

1. Crear la base de datos PostgreSQL:
```sql
CREATE DATABASE root;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE root TO root;
```

2. Ejecutar el script de la base de datos ubicado en `bd root 2.0`

3. Configurar las credenciales en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/root
spring.datasource.username=root
spring.datasource.password=root
```

## Ejecutar la aplicación

### Con Maven:
```bash
mvn spring-boot:run
```

### Con Java:
```bash
mvn clean package
java -jar target/erp-backend-1.0.0.jar
```

La aplicación se ejecutará en `http://localhost:3000`

## Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login de usuario

### Usuarios
- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `POST /api/usuarios` - Crear nuevo usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Roles
- `GET /api/roles` - Listar todos los roles
- `GET /api/roles/{id}` - Obtener rol por ID
- `POST /api/roles` - Crear nuevo rol
- `PUT /api/roles/{id}` - Actualizar rol
- `DELETE /api/roles/{id}` - Eliminar rol

### Menús
- `GET /api/menus` - Listar todos los menús
- `GET /api/menus/active` - Listar menús activos

## Usuario de Prueba

- Usuario: `admin`
- Contraseña: `admin123` (ya encriptada en la BD)

## Estructura del Proyecto

```
backend/
├── src/
│   └── main/
│       ├── java/com/meridian/erp/
│       │   ├── config/          # Configuraciones (CORS, Security)
│       │   ├── controller/      # Controladores REST
│       │   ├── dto/             # Data Transfer Objects
│       │   ├── entity/          # Entidades JPA
│       │   ├── repository/      # Repositorios JPA
│       │   ├── service/         # Servicios de negocio
│       │   └── ErpApplication.java
│       └── resources/
│           └── application.properties
└── pom.xml
```
