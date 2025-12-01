# 📋 IMPLEMENTACIÓN: Tabla de Puestos (RRHH_MPUESTOS)

## 🗄️ Estructura de la Tabla

```
RRHH_MPUESTOS
├── impuesto_id (PK, Int, Autoincremental)
├── ip_mgrupo_id (FK → rrhh_mgrupos, Int, NOT NULL)
├── tp_nombre (VARCHAR(20), NOT NULL)
├── tp_descripcion (VARCHAR(100), NOT NULL)
├── ip_estado (Int, DEFAULT 1)
├── ip_empresa (Int, NOT NULL)
├── ip_usuarioregistro (BigInt)
├── fp_fecharegistro (Timestamp)
├── ip_usuarioedito (BigInt)
├── fp_fechaedito (Timestamp)
├── ip_usuarioelimino (BigInt)
└── fp_fechaelimino (Timestamp)
```

## 🔗 Relación con Grupos

- **Foreign Key:** `ip_mgrupo_id` → `rrhh_mgrupos(imgrupo_id)`
- **Tipo:** Muchos a Uno (Muchos puestos pertenecen a un grupo)
- **Obligatorio:** Sí (NOT NULL)

## ✅ Archivos Creados/Actualizados

### 1. **SQL**
- `sql/crear_tabla_puestos.sql` - Script de creación de tabla

### 2. **Backend (Java/Spring Boot)**
- `backend/src/main/java/com/meridian/erp/entity/Puesto.java` - Entidad JPA (actualizada)
- `backend/src/main/java/com/meridian/erp/repository/PuestoRepository.java` - Repositorio (actualizado)
- `backend/src/main/java/com/meridian/erp/service/PuestoService.java` - Lógica de negocio (actualizada)
- `backend/src/main/java/com/meridian/erp/controller/PuestoController.java` - API REST (nuevo)

## 🎯 Características

### ✅ Validaciones
- **Nombre único por empresa:** No permite nombres duplicados en la misma empresa
- **Grupo obligatorio:** Debe pertenecer a un grupo existente
- **Longitud de campos:**
  - Nombre: máximo 20 caracteres
  - Descripción: máximo 100 caracteres
- **Soft delete:** No se eliminan físicamente los registros
- **Auditoría completa:** Registra quién y cuándo crea/edita/elimina

### ✅ Índices
- Índice en `ip_empresa` para búsquedas rápidas
- Índice en `ip_estado` para filtrado
- Índice en `ip_mgrupo_id` para relación con grupos
- Índice en `tp_nombre` para búsquedas
- Índice único compuesto: `tp_nombre + ip_empresa` (solo activos)

## 📡 API Endpoints

### GET `/api/puestos?empresaId=1`
Listar puestos de una empresa (con información del grupo)

**Response:**
```json
{
  "success": true,
  "message": "Puestos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "grupoId": 1,
      "nombre": "GERENTE",
      "descripcion": "Gerente General",
      "estado": 1,
      "empresaId": 1,
      "grupoNombre": "ADMIN",
      "grupoDescripcion": "Grupo Administrativo"
    }
  ]
}
```

### GET `/api/puestos/grupo/{grupoId}`
Listar puestos de un grupo específico

**Response:**
```json
{
  "success": true,
  "message": "Puestos del grupo obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "grupoId": 1,
      "nombre": "GERENTE",
      "descripcion": "Gerente General",
      "estado": 1,
      "empresaId": 1
    }
  ]
}
```

### GET `/api/puestos/{id}`
Obtener puesto por ID

**Response:**
```json
{
  "success": true,
  "message": "Puesto obtenido exitosamente",
  "data": {
    "id": 1,
    "grupoId": 1,
    "nombre": "GERENTE",
    "descripcion": "Gerente General",
    "estado": 1,
    "empresaId": 1
  }
}
```

### POST `/api/puestos?usuarioId=1`
Crear nuevo puesto

**Request:**
```json
{
  "grupoId": 1,
  "nombre": "GERENTE",
  "descripcion": "Gerente General",
  "empresaId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Puesto creado exitosamente",
  "data": { ... }
}
```

### PUT `/api/puestos/{id}?usuarioId=1`
Actualizar puesto

**Request:**
```json
{
  "grupoId": 1,
  "nombre": "GERENTE",
  "descripcion": "Gerente General Actualizado"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Puesto actualizado exitosamente",
  "data": { ... }
}
```

### DELETE `/api/puestos/{id}?usuarioId=1`
Eliminar puesto (soft delete)

**Response:**
```json
{
  "success": true,
  "message": "Puesto eliminado exitosamente",
  "data": null
}
```

## 🔒 Seguridad

- ✅ **Aislamiento por empresa:** Cada empresa solo ve sus puestos
- ✅ **Validación de duplicados:** No permite nombres repetidos en la misma empresa
- ✅ **Validación de FK:** Verifica que el grupo exista
- ✅ **Auditoría completa:** Registra quién y cuándo crea/edita/elimina
- ✅ **Soft delete:** No se eliminan físicamente los registros

## 📝 Pasos para Implementar

### 1. **Ejecutar Scripts SQL en orden**
```bash
# Primero crear la tabla de grupos (si no existe)
psql -U usuario -d bd_rrhh -f sql/crear_tabla_grupos.sql

# Luego crear la tabla de puestos
psql -U usuario -d bd_rrhh -f sql/crear_tabla_puestos.sql
```

### 2. **Reiniciar Backend**
```bash
cd backend
./mvnw spring-boot:run
# o usar el archivo .bat
```

### 3. **Probar los Endpoints**

```bash
# Listar puestos
curl http://localhost:8080/api/puestos?empresaId=1

# Listar puestos de un grupo
curl http://localhost:8080/api/puestos/grupo/1

# Crear puesto
curl -X POST http://localhost:8080/api/puestos?usuarioId=1 \
  -H "Content-Type: application/json" \
  -d '{"grupoId":1,"nombre":"GERENTE","descripcion":"Gerente General","empresaId":1}'

# Obtener puesto por ID
curl http://localhost:8080/api/puestos/1

# Actualizar puesto
curl -X PUT http://localhost:8080/api/puestos/1?usuarioId=1 \
  -H "Content-Type: application/json" \
  -d '{"grupoId":1,"nombre":"GERENTE","descripcion":"Gerente General Actualizado"}'

# Eliminar puesto
curl -X DELETE http://localhost:8080/api/puestos/1?usuarioId=1
```

## 🧪 Casos de Prueba

### ✅ Crear Puesto
1. Primero crear un grupo
2. Enviar POST con grupoId, nombre y descripción
3. Verificar que se crea correctamente
4. Verificar que aparece en la lista con información del grupo

### ✅ Validar Duplicados
1. Intentar crear otro puesto con el mismo nombre
2. Debe mostrar error: "Ya existe un puesto con el nombre 'GERENTE' en esta empresa"

### ✅ Validar FK
1. Intentar crear puesto con grupoId inexistente
2. Debe fallar por violación de FK

### ✅ Editar Puesto
1. Enviar PUT con nuevos datos
2. Verificar que se actualiza correctamente
3. Puede cambiar de grupo

### ✅ Eliminar Puesto
1. Enviar DELETE
2. Verificar que cambia estado a 0
3. Verificar que no aparece en la lista

### ✅ Listar por Grupo
1. Crear varios puestos en diferentes grupos
2. Listar puestos de un grupo específico
3. Verificar que solo muestra los del grupo solicitado

## 📊 Ejemplo de Datos

```sql
-- Primero insertar grupos
INSERT INTO rrhh_mgrupos (tg_nombre, tg_descripcion, ig_empresa, ig_usuarioregistro) VALUES
('ADMIN', 'Grupo Administrativo', 1, 1),
('VENTAS', 'Grupo de Ventas', 1, 1),
('PRODUCCION', 'Grupo de Producción', 1, 1);

-- Luego insertar puestos
INSERT INTO rrhh_mpuestos (ip_mgrupo_id, tp_nombre, tp_descripcion, ip_empresa, ip_usuarioregistro) VALUES
(1, 'GERENTE', 'Gerente General', 1, 1),
(1, 'ASISTENTE', 'Asistente Administrativo', 1, 1),
(1, 'CONTADOR', 'Contador General', 1, 1),
(2, 'VENDEDOR', 'Vendedor de Campo', 1, 1),
(2, 'SUPERVISOR', 'Supervisor de Ventas', 1, 1),
(3, 'OPERARIO', 'Operario de Producción', 1, 1),
(3, 'JEFE', 'Jefe de Producción', 1, 1);
```

## 🔗 Relación con Grupos

### Consulta con JOIN
```sql
SELECT 
    p.impuesto_id,
    p.tp_nombre as puesto_nombre,
    p.tp_descripcion as puesto_descripcion,
    g.tg_nombre as grupo_nombre,
    g.tg_descripcion as grupo_descripcion
FROM rrhh_mpuestos p
INNER JOIN rrhh_mgrupos g ON p.ip_mgrupo_id = g.imgrupo_id
WHERE p.ip_empresa = 1 AND p.ip_estado = 1;
```

## ✅ Backend Completo y Listo

El backend está completamente implementado con:
- ✅ Entidad JPA mapeada con relación a Grupos
- ✅ Repositorio con métodos de búsqueda
- ✅ Servicio con lógica de negocio y JOINs
- ✅ Controlador REST con todos los endpoints
- ✅ Validaciones de negocio y FK
- ✅ Manejo de errores
- ✅ Auditoría completa
- ✅ Endpoint adicional para listar por grupo

**¡Listo para usar!** Solo ejecuta los scripts SQL en orden y reinicia el backend. 🚀
