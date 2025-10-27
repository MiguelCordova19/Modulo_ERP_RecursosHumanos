# ❓ Preguntas Frecuentes (FAQ)

## 🚀 Instalación y Configuración

### ¿Qué versión de Java necesito?
Java 17 o superior. Puedes verificar tu versión con:
```bash
java -version
```

### ¿Cómo instalo Maven?
Maven generalmente viene incluido con IDEs como IntelliJ IDEA o Eclipse. Si necesitas instalarlo manualmente:
- **Windows:** Descarga desde [maven.apache.org](https://maven.apache.org/download.cgi)
- **Mac:** `brew install maven`
- **Linux:** `sudo apt install maven`

### ¿Dónde descargo PostgreSQL?
Desde [postgresql.org/download](https://www.postgresql.org/download/). Recomendamos la versión 15 o superior.

### ¿Qué puerto usa el backend?
Por defecto el puerto **3000**. Puedes cambiarlo en `application.properties`:
```properties
server.port=8080
```

### ¿Qué puerto usa el frontend?
Depende del servidor que uses:
- Live Server (VS Code): 5500
- http-server: 8080 (o el que especifiques)
- Python: 8000

---

## 🗄️ Base de Datos

### ¿Cómo creo la base de datos?
```sql
CREATE DATABASE root;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE root TO root;
```

### ¿Cómo importo el script SQL?
**Opción 1 - pgAdmin:**
1. Abre pgAdmin
2. Conecta a tu servidor
3. Click derecho en la BD → Query Tool
4. Abre el archivo `bd root 2.0`
5. Ejecuta (F5)

**Opción 2 - Terminal:**
```bash
psql -U root -d root -f "bd root 2.0"
```

### ¿Cómo verifico que las tablas se crearon?
```sql
\dt
-- o
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

### ¿Cómo cambio las credenciales de la base de datos?
Edita `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/root
spring.datasource.username=TU_USUARIO
spring.datasource.password=TU_CONTRASEÑA
```

### ¿El backend modifica la estructura de la base de datos?
No. Está configurado con `spring.jpa.hibernate.ddl-auto=none`, lo que significa que solo lee la estructura existente.

---

## 🔐 Autenticación y Seguridad

### ¿Cuáles son las credenciales por defecto?
- **Usuario:** admin
- **Contraseña:** admin123

### ¿Cómo cambio la contraseña del admin?
```sql
-- Contraseña: nuevapassword
UPDATE rrhh_musuario 
SET tu_password = '$2a$10$HASH_GENERADO_CON_BCRYPT'
WHERE tu_usuario = 'admin';
```

Genera el hash en: https://bcrypt-generator.com/

### ¿Por qué mi login falla?
Verifica:
1. Que el backend esté corriendo (http://localhost:3000)
2. Que la base de datos esté activa
3. Que el usuario exista y esté activo (estado = 1)
4. Que la contraseña sea correcta

### ¿Cómo funciona la encriptación de contraseñas?
Usamos **BCrypt** con Spring Security. Las contraseñas se encriptan automáticamente al crear/actualizar usuarios.

### ¿Hay autenticación JWT?
No por ahora. El sistema usa sesiones en localStorage del navegador. JWT es una mejora futura recomendada.

---

## 🐛 Errores Comunes

### Error: "Connection refused" al hacer login
**Causa:** El backend no está corriendo.
**Solución:**
```bash
cd backend
mvn spring-boot:run
```

### Error: "Cannot connect to database"
**Causa:** PostgreSQL no está corriendo o las credenciales son incorrectas.
**Solución:**
1. Verifica que PostgreSQL esté activo
2. Confirma las credenciales en `application.properties`
3. Verifica que la base de datos `root` exista

### Error: "Port 3000 already in use"
**Causa:** Otro proceso está usando el puerto 3000.
**Solución:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

O cambia el puerto en `application.properties`.

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
**Causa:** El origen del frontend no está permitido.
**Solución:** Agrega el origen en `application.properties`:
```properties
cors.allowed.origins=http://localhost:5500,http://127.0.0.1:5500
```

### Error: "Failed to load ApplicationContext"
**Causa:** Error en la configuración de Spring Boot.
**Solución:** Revisa los logs para ver el error específico. Comúnmente es por:
- Dependencias faltantes
- Configuración incorrecta de base de datos
- Errores de sintaxis en clases Java

### El frontend no carga los estilos
**Causa:** Estás abriendo el HTML directamente (file://).
**Solución:** Usa un servidor web:
- Live Server (VS Code)
- http-server
- Python http.server

### Las contraseñas no coinciden al crear usuario
**Causa:** Estás enviando una contraseña ya encriptada.
**Solución:** Envía la contraseña en texto plano. El backend la encripta automáticamente.

---

## 🔧 Desarrollo

### ¿Cómo agrego un nuevo endpoint?
1. Crea el método en el Controller
2. Implementa la lógica en el Service
3. Agrega queries en el Repository si es necesario

Ejemplo:
```java
// Controller
@GetMapping("/activos")
public ResponseEntity<ApiResponse<List<Usuario>>> findActivos() {
    List<Usuario> usuarios = usuarioService.findByEstado(1);
    return ResponseEntity.ok(ApiResponse.success("Usuarios activos", usuarios));
}

// Service
public List<Usuario> findByEstado(Integer estado) {
    return usuarioRepository.findByEstado(estado);
}

// Repository
List<Usuario> findByEstado(Integer estado);
```

### ¿Cómo agrego una nueva entidad?
1. Crea la clase en `entity/`
2. Anota con `@Entity` y `@Table`
3. Define los campos con `@Column`
4. Crea el Repository
5. Crea el Service
6. Crea el Controller

### ¿Cómo hago hot reload?
Spring Boot DevTools está incluido. Los cambios se recargan automáticamente al guardar.

### ¿Cómo veo las queries SQL?
Están habilitadas en `application.properties`:
```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### ¿Cómo agrego validaciones?
Usa anotaciones de Bean Validation:
```java
@NotNull(message = "El nombre es obligatorio")
@Size(min = 3, max = 50)
private String nombre;
```

Y en el Controller:
```java
@PostMapping
public ResponseEntity<?> create(@Valid @RequestBody Usuario usuario) {
    // ...
}
```

---

## 📊 Rendimiento

### ¿Cómo mejoro el rendimiento?
1. **Índices en la base de datos**
2. **Caché con Redis**
3. **Paginación en listados grandes**
4. **Lazy loading en relaciones JPA**
5. **Connection pooling** (HikariCP ya incluido)

### ¿Cómo implemento paginación?
```java
// Repository
Page<Usuario> findAll(Pageable pageable);

// Service
public Page<Usuario> findAll(int page, int size) {
    return usuarioRepository.findAll(PageRequest.of(page, size));
}

// Controller
@GetMapping
public ResponseEntity<?> findAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Page<Usuario> usuarios = usuarioService.findAll(page, size);
    return ResponseEntity.ok(ApiResponse.success("Usuarios", usuarios));
}
```

---

## 🚀 Despliegue

### ¿Cómo creo un JAR ejecutable?
```bash
cd backend
mvn clean package -DskipTests
```

El JAR estará en `target/erp-backend-1.0.0.jar`

### ¿Cómo ejecuto el JAR?
```bash
java -jar target/erp-backend-1.0.0.jar
```

### ¿Cómo uso variables de entorno?
```bash
# Windows
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/root
java -jar target/erp-backend-1.0.0.jar

# Linux/Mac
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/root
java -jar target/erp-backend-1.0.0.jar
```

### ¿Cómo despliego en producción?
1. Crea el JAR: `mvn clean package`
2. Sube el JAR al servidor
3. Configura variables de entorno
4. Ejecuta: `java -jar erp-backend-1.0.0.jar`

Considera usar:
- **Systemd** (Linux) para ejecutar como servicio
- **Docker** para contenedorización
- **Nginx** como reverse proxy

### ¿Cómo dockerizo la aplicación?
Crea un `Dockerfile` en `backend/`:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/erp-backend-1.0.0.jar app.jar
EXPOSE 3000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Construye y ejecuta:
```bash
docker build -t erp-backend .
docker run -p 3000:3000 erp-backend
```

---

## 🧪 Testing

### ¿Cómo ejecuto los tests?
```bash
mvn test
```

### ¿Cómo creo un test unitario?
```java
@SpringBootTest
class UsuarioServiceTest {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Test
    void testFindById() {
        Optional<Usuario> usuario = usuarioService.findById(2L);
        assertTrue(usuario.isPresent());
        assertEquals("admin", usuario.get().getUsuario());
    }
}
```

### ¿Cómo pruebo los endpoints?
Usa el archivo `backend/test-api.http` con la extensión REST Client de VS Code, o usa Postman.

---

## 📚 Recursos

### ¿Dónde aprendo más sobre Spring Boot?
- [Documentación oficial](https://spring.io/projects/spring-boot)
- [Spring Guides](https://spring.io/guides)
- [Baeldung](https://www.baeldung.com/spring-boot)

### ¿Dónde aprendo más sobre JPA?
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Hibernate Documentation](https://hibernate.org/orm/documentation/)

### ¿Dónde aprendo más sobre PostgreSQL?
- [Documentación oficial](https://www.postgresql.org/docs/)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)

---

## 🤝 Contribución

### ¿Cómo contribuyo al proyecto?
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz tus cambios
4. Commit: `git commit -m "Agrega nueva funcionalidad"`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Crea un Pull Request

### ¿Qué convenciones de código debo seguir?
- **Java:** Google Java Style Guide
- **Nomenclatura:** camelCase para métodos, PascalCase para clases
- **Commits:** Mensajes descriptivos en español
- **Branches:** feature/, bugfix/, hotfix/

---

## 💡 Mejoras Futuras

### ¿Qué funcionalidades se pueden agregar?
1. **JWT Authentication** - Tokens de acceso
2. **Roles y Permisos** - Control de acceso granular
3. **Auditoría** - Registro de cambios
4. **Reportes** - Generación de PDFs/Excel
5. **Notificaciones** - Email/SMS
6. **API Documentation** - Swagger/OpenAPI
7. **Logs centralizados** - ELK Stack
8. **Monitoreo** - Prometheus + Grafana
9. **Tests automatizados** - JUnit + Mockito
10. **CI/CD** - GitHub Actions

### ¿Cómo implemento JWT?
1. Agrega dependencia:
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

2. Crea JwtUtil para generar/validar tokens
3. Implementa JwtAuthenticationFilter
4. Configura Spring Security
5. Retorna token en el login

---

## 📞 Soporte

### ¿Dónde reporto bugs?
Crea un issue en el repositorio con:
- Descripción del problema
- Pasos para reproducir
- Logs de error
- Versión de Java, PostgreSQL, etc.

### ¿Dónde pido ayuda?
- Issues del repositorio
- Stack Overflow con tag `spring-boot`
- Comunidad de Spring en Discord

---

## 📝 Notas Finales

### ¿Es necesario conocer Spring Boot?
Sí, al menos los conceptos básicos:
- Dependency Injection
- Anotaciones (@Controller, @Service, etc.)
- JPA/Hibernate
- REST APIs

### ¿Puedo usar otro IDE?
Sí, puedes usar:
- IntelliJ IDEA (recomendado)
- Eclipse
- VS Code con extensiones Java
- NetBeans

### ¿Puedo usar otra base de datos?
Sí, solo cambia:
1. El driver en `pom.xml`
2. La URL en `application.properties`
3. El dialecto de Hibernate

Ejemplo para MySQL:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### ¿Necesito conocer Maven?
Los comandos básicos son suficientes:
- `mvn clean` - Limpiar
- `mvn compile` - Compilar
- `mvn package` - Empaquetar
- `mvn spring-boot:run` - Ejecutar

Maven maneja las dependencias automáticamente.
