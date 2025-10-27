# 🛠️ Comandos Útiles

## 📦 Maven

### Compilar el proyecto
```bash
mvn clean compile
```

### Ejecutar tests
```bash
mvn test
```

### Empaquetar (crear JAR)
```bash
mvn clean package
```

### Ejecutar la aplicación
```bash
mvn spring-boot:run
```

### Limpiar y reinstalar dependencias
```bash
mvn clean install
```

### Saltar tests al compilar
```bash
mvn clean package -DskipTests
```

---

## 🗄️ PostgreSQL

### Conectar a PostgreSQL
```bash
psql -U root -d root
```

### Ver todas las tablas
```sql
\dt
```

### Describir una tabla
```sql
\d rrhh_musuario
```

### Ver todos los usuarios
```sql
SELECT * FROM rrhh_musuario;
```

### Ver usuario admin
```sql
SELECT 
    imusuario_id,
    tu_usuario,
    tu_nombres,
    tu_apellidopaterno,
    tu_correo,
    iu_estado
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';
```

### Actualizar contraseña del admin
```sql
-- Contraseña: admin123
UPDATE rrhh_musuario 
SET tu_password = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu'
WHERE tu_usuario = 'admin';
```

### Ver todos los menús activos
```sql
SELECT * FROM rrhh_mmenu 
WHERE menu_estado = 1 
ORDER BY menu_posicion;
```

### Crear un nuevo rol
```sql
INSERT INTO rrhh_mrol (tr_descripcion, ir_estado, ir_empresa)
VALUES ('Administrador', 1, 1);
```

### Backup de la base de datos
```bash
pg_dump -U root -d root > backup_$(date +%Y%m%d).sql
```

### Restaurar backup
```bash
psql -U root -d root < backup_20241024.sql
```

---

## 🌐 Frontend

### Iniciar servidor con Live Server (VS Code)
1. Instalar extensión "Live Server"
2. Click derecho en `frontend/index.html`
3. "Open with Live Server"

### Iniciar con http-server (Node.js)
```bash
# Instalar globalmente
npm install -g http-server

# Ejecutar
http-server -p 5500

# Con CORS habilitado
http-server -p 5500 --cors
```

### Iniciar con Python
```bash
# Python 3
cd frontend
python -m http.server 5500

# Python 2
cd frontend
python -m SimpleHTTPServer 5500
```

---

## 🔍 Debugging

### Ver logs del backend en tiempo real
```bash
mvn spring-boot:run | grep -i error
```

### Ver solo queries SQL
```bash
mvn spring-boot:run | grep -i "Hibernate:"
```

### Verificar puerto 3000
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### Matar proceso en puerto 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 🧪 Probar API con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Obtener menús
```bash
curl http://localhost:3000/api/menus
```

### Obtener usuarios
```bash
curl http://localhost:3000/api/usuarios
```

### Crear usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "apellidoPaterno": "Test",
    "apellidoMaterno": "User",
    "nombres": "Nuevo",
    "empresaId": 1,
    "usuario": "test.user",
    "password": "test123",
    "correo": "test@test.com",
    "estado": 1
  }'
```

---

## 🐳 Docker (Opcional)

### Crear imagen Docker del backend
```bash
# Crear Dockerfile en backend/
cd backend

# Construir imagen
docker build -t erp-backend:1.0 .

# Ejecutar contenedor
docker run -p 3000:3000 erp-backend:1.0
```

### Docker Compose para PostgreSQL
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: root
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Detener
docker-compose down
```

---

## 📊 Monitoreo

### Ver estado de PostgreSQL
```bash
# Windows
sc query postgresql-x64-15

# Linux
sudo systemctl status postgresql
```

### Ver logs de PostgreSQL
```bash
# Windows
# Buscar en: C:\Program Files\PostgreSQL\15\data\log\

# Linux
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

### Ver uso de memoria del backend
```bash
# Windows
tasklist | findstr java

# Linux/Mac
ps aux | grep java
```

---

## 🔧 Configuración Rápida

### Cambiar puerto del backend
```bash
# Editar application.properties
echo "server.port=8080" >> backend/src/main/resources/application.properties
```

### Habilitar modo debug
```bash
# Editar application.properties
echo "logging.level.root=DEBUG" >> backend/src/main/resources/application.properties
```

### Ver todas las propiedades de Spring Boot
```bash
mvn spring-boot:run -Ddebug
```

---

## 📝 Git

### Inicializar repositorio
```bash
git init
git add .
git commit -m "Migración a Spring Boot completada"
```

### Crear .gitignore
```bash
# Ya existe en backend/.gitignore
# Para la raíz del proyecto:
echo "node_modules/" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore
```

---

## 🚀 Despliegue

### Crear JAR ejecutable
```bash
cd backend
mvn clean package -DskipTests
```

### Ejecutar JAR
```bash
java -jar target/erp-backend-1.0.0.jar
```

### Ejecutar con perfil de producción
```bash
java -jar target/erp-backend-1.0.0.jar --spring.profiles.active=prod
```

### Variables de entorno
```bash
# Windows
set SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/root
set SPRING_DATASOURCE_USERNAME=root
set SPRING_DATASOURCE_PASSWORD=root
java -jar target/erp-backend-1.0.0.jar

# Linux/Mac
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/root
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=root
java -jar target/erp-backend-1.0.0.jar
```

---

## 🔐 Seguridad

### Generar hash BCrypt para contraseña
```bash
# Usando htpasswd (Apache)
htpasswd -bnBC 10 "" password123 | tr -d ':\n'

# O usar un generador online:
# https://bcrypt-generator.com/
```

### Verificar hash BCrypt
```sql
-- En PostgreSQL con extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

SELECT crypt('admin123', tu_password) = tu_password AS password_match
FROM rrhh_musuario 
WHERE tu_usuario = 'admin';
```

---

## 📚 Recursos Adicionales

### Documentación
- Spring Boot: https://spring.io/projects/spring-boot
- PostgreSQL: https://www.postgresql.org/docs/
- Maven: https://maven.apache.org/guides/

### Herramientas Útiles
- Postman: https://www.postman.com/
- DBeaver: https://dbeaver.io/ (Cliente PostgreSQL)
- IntelliJ IDEA: https://www.jetbrains.com/idea/
- VS Code: https://code.visualstudio.com/
