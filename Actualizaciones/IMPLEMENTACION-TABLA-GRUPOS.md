# 📋 IMPLEMENTACIÓN: Tabla de Grupos (RRHH_MGRUPOS)

## 🗄️ Estructura de la Tabla

```
RRHH_MGRUPOS
├── imgrupo_id (PK, Int, Autoincremental)
├── tg_nombre (VARCHAR(20), NOT NULL)
├── tg_descripcion (VARCHAR(100), NOT NULL)
├── ig_estado (Int, DEFAULT 1)
├── ig_empresa (Int, NOT NULL)
├── ig_usuarioregistro (BigInt)
├── fg_fecharegistro (Timestamp)
├── ig_usuarioedito (BigInt)
├── fg_fechaedito (Timestamp)
├── ig_usuarioelimino (BigInt)
└── fg_fechaelimino (Timestamp)
```

## ✅ Archivos Creados

### 1. **SQL**
- `sql/crear_tabla_grupos.sql` - Script de creación de tabla

### 2. **Backend (Java/Spring Boot)**
- `backend/src/main/java/com/meridian/erp/entity/Grupo.java` - Entidad JPA
- `backend/src/main/java/com/meridian/erp/repository/GrupoRepository.java` - Repositorio
- `backend/src/main/java/com/meridian/erp/service/GrupoService.java` - Lógica de negocio
- `backend/src/main/java/com/meridian/erp/controller/GrupoController.java` - API REST

## 🎯 Características

### ✅ Validaciones
- **Nombre único por empresa:** No permite nombres duplicados en la misma empresa
- **Longitud de campos:**
  - Nombre: máximo 20 caracteres
  - Descripción: máximo 100 caracteres
- **Soft delete:** No se eliminan físicamente los registros
- **Auditoría completa:** Registra quién y cuándo crea/edita/elimina

### ✅ Índices
- Índice en `ig_empresa` para búsquedas rápidas
- Índice en `ig_estado` para filtrado
- Índice en `tg_nombre` para búsquedas
- Índice único compuesto: `tg_nombre + ig_empresa` (solo activos)

## 📡 API Endpoints

### GET `/api/grupos?empresaId=1`
Listar grupos de una empresa

**Response:**
```json
{
  "success": true,
  "message": "Grupos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "ADMIN",
      "descripcion": "Grupo Administrativo",
      "estado": 1,
      "empresaId": 1
    }
  ]
}
```

### GET `/api/grupos/{id}`
Obtener grupo por ID

**Response:**
```json
{
  "success": true,
  "message": "Grupo obtenido exitosamente",
  "data": {
    "id": 1,
    "nombre": "ADMIN",
    "descripcion": "Grupo Administrativo",
    "estado": 1,
    "empresaId": 1
  }
}
```

### POST `/api/grupos?usuarioId=1`
Crear nuevo grupo

**Request:**
```json
{
  "nombre": "ADMIN",
  "descripcion": "Grupo Administrativo",
  "empresaId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Grupo creado exitosamente",
  "data": { ... }
}
```

### PUT `/api/grupos/{id}?usuarioId=1`
Actualizar grupo

**Request:**
```json
{
  "nombre": "ADMIN",
  "descripcion": "Grupo Administrativo Actualizado"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Grupo actualizado exitosamente",
  "data": { ... }
}
```

### DELETE `/api/grupos/{id}?usuarioId=1`
Eliminar grupo (soft delete)

**Response:**
```json
{
  "success": true,
  "message": "Grupo eliminado exitosamente",
  "data": null
}
```

## 🔒 Seguridad

- ✅ **Aislamiento por empresa:** Cada empresa solo ve sus grupos
- ✅ **Validación de duplicados:** No permite nombres repetidos en la misma empresa
- ✅ **Auditoría completa:** Registra quién y cuándo crea/edita/elimina
- ✅ **Soft delete:** No se eliminan físicamente los registros

## 📝 Pasos para Implementar

### 1. **Ejecutar Script SQL**
```bash
# Conectarse a PostgreSQL y ejecutar:
psql -U usuario -d bd_rrhh -f sql/crear_tabla_grupos.sql
```

### 2. **Reiniciar Backend**
```bash
cd backend
./mvnw spring-boot:run
# o usar el archivo .bat
```

### 3. **Probar los Endpoints**
Puedes usar Postman, curl o cualquier cliente HTTP:

```bash
# Listar grupos
curl http://localhost:8080/api/grupos?empresaId=1

# Crear grupo
curl -X POST http://localhost:8080/api/grupos?usuarioId=1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"ADMIN","descripcion":"Grupo Administrativo","empresaId":1}'

# Obtener grupo por ID
curl http://localhost:8080/api/grupos/1

# Actualizar grupo
curl -X PUT http://localhost:8080/api/grupos/1?usuarioId=1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"ADMIN","descripcion":"Grupo Administrativo Actualizado"}'

# Eliminar grupo
curl -X DELETE http://localhost:8080/api/grupos/1?usuarioId=1
```

## 🧪 Casos de Prueba

### ✅ Crear Grupo
1. Enviar POST con nombre y descripción
2. Verificar que se crea correctamente
3. Verificar que aparece en la lista

### ✅ Validar Duplicados
1. Intentar crear otro grupo con el mismo nombre
2. Debe mostrar error: "Ya existe un grupo con el nombre 'ADMIN' en esta empresa"

### ✅ Editar Grupo
1. Enviar PUT con nuevos datos
2. Verificar que se actualiza correctamente

### ✅ Eliminar Grupo
1. Enviar DELETE
2. Verificar que cambia estado a 0
3. Verificar que no aparece en la lista

## 📊 Ejemplo de Datos

```sql
INSERT INTO rrhh_mgrupos (tg_nombre, tg_descripcion, ig_empresa, ig_usuarioregistro) VALUES
('ADMIN', 'Grupo Administrativo', 1, 1),
('VENTAS', 'Grupo de Ventas', 1, 1),
('PRODUCCION', 'Grupo de Producción', 1, 1),
('LOGISTICA', 'Grupo de Logística', 1, 1),
('FINANZAS', 'Grupo de Finanzas', 1, 1);
```

## ✅ Backend Completo y Listo

El backend está completamente implementado con:
- ✅ Entidad JPA mapeada
- ✅ Repositorio con métodos de búsqueda
- ✅ Servicio con lógica de negocio
- ✅ Controlador REST con todos los endpoints
- ✅ Validaciones de negocio
- ✅ Manejo de errores
- ✅ Auditoría completa

**¡Listo para usar!** Solo ejecuta el script SQL y reinicia el backend. 🚀
