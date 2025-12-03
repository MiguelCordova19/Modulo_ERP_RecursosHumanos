# Cómo Iniciar el Backend

## Requisitos Previos
- Java 17 o superior instalado
- Maven instalado
- PostgreSQL corriendo con la base de datos configurada

## Pasos para Iniciar

### 1. Abrir una terminal en la carpeta del proyecto

### 2. Navegar a la carpeta backend
```bash
cd backend
```

### 3. Compilar el proyecto (primera vez o después de cambios)
```bash
mvn clean install -DskipTests
```

Este comando:
- `clean` - Limpia compilaciones anteriores
- `install` - Compila y empaqueta el proyecto
- `-DskipTests` - Omite las pruebas para compilar más rápido

### 4. Ejecutar el backend
```bash
mvn spring-boot:run
```

### 5. Verificar que esté corriendo

Deberías ver en la consola algo como:
```
Started Application in X.XXX seconds
```

El backend estará disponible en: **http://localhost:8080**

## Verificar Endpoints

### Probar endpoint de trabajadores activos:
```
GET http://localhost:8080/api/contratos/trabajadores-activos?empresaId=3&sedeId=1&turnoId=MA&fecha=2025-12-03
```

### Probar endpoint de asistencias:
```
GET http://localhost:8080/api/asistencias?empresaId=3&fechaDesde=2025-12-01&fechaHasta=2025-12-31&pagina=1&registros=10
```

## Detener el Backend

Presiona `Ctrl + C` en la terminal donde está corriendo

## Problemas Comunes

### Error: "Java not found"
- Instalar Java 17: https://adoptium.net/

### Error: "Maven not found"
- Instalar Maven: https://maven.apache.org/download.cgi

### Error de conexión a base de datos
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `backend/src/main/resources/application.properties`

### Puerto 8080 ya en uso
- Detener el proceso que usa el puerto 8080
- O cambiar el puerto en `application.properties`:
  ```properties
  server.port=8081
  ```

## Archivos Modificados en Esta Sesión

1. **ContratoTrabajadorController.java** - Agregado endpoint `/trabajadores-activos`
2. **ContratoTrabajadorService.java** - Agregado método para consultar trabajadores por sede y turno
3. **AsistenciaController.java** - Creado controlador básico para asistencias

## Nota Importante

Después de compilar con `mvn clean install`, los cambios estarán disponibles. Si haces más cambios en el código Java, necesitarás:
1. Detener el backend (Ctrl + C)
2. Volver a compilar: `mvn clean install -DskipTests`
3. Volver a ejecutar: `mvn spring-boot:run`
