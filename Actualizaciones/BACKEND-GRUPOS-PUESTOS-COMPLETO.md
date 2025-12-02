# ✅ BACKEND COMPLETO: Sistema de Grupos y Puestos

## 📦 Archivos Creados

### Entidades
- ✅ `GrupoPuestoDetalle.java` - Entidad para la tabla intermedia

### Repositories
- ✅ `GrupoPuestoDetalleRepository.java` - Repositorio con métodos de búsqueda

### DTOs
- ✅ `GrupoConPuestosRequest.java` - DTO para crear/actualizar grupos con puestos

### Services
- ✅ `GrupoPuestoDetalleService.java` - Lógica para asignar/desasignar puestos
- ✅ `GrupoService.java` - Actualizado con métodos para manejar puestos

### Controllers
- ✅ `GrupoController.java` - Actualizado con endpoints para puestos

## 📡 API Endpoints Disponibles

### Grupos Básicos
```
GET    /api/grupos?empresaId=1              - Listar grupos
GET    /api/grupos/{id}                     - Obtener grupo por ID
POST   /api/grupos?usuarioId=1              - Crear grupo simple
PUT    /api/grupos/{id}?usuarioId=1         - Actualizar grupo simple
DELETE /api/grupos/{id}?usuarioId=1         - Eliminar grupo
```

### Grupos con Puestos
```
POST   /api/grupos/con-puestos?usuarioId=1     - Crear grupo con puestos
PUT    /api/grupos/{id}/con-puestos?usuarioId=1 - Actualizar grupo con puestos
GET    /api/grupos/{id}/puestos                 - Obtener puestos del grupo
```

### Puestos
```
GET    /api/puestos?empresaId=1            - Listar puestos (con grupo si tiene)
GET    /api/puestos/{id}                   - Obtener puesto por ID
POST   /api/puestos?usuarioId=1            - Crear puesto
PUT    /api/puestos/{id}?usuarioId=1       - Actualizar puesto
DELETE /api/puestos/{id}?usuarioId=1       - Eliminar puesto
GET    /api/puestos/grupo/{grupoId}        - Listar puestos de un grupo
```

## 📝 Ejemplos de Uso

### 1. Crear Puesto (sin grupo)
```bash
POST /api/puestos?usuarioId=1
Content-Type: application/json

{
  "nombre": "GERENTE",
  "descripcion": "Gerente General",
  "empresaId": 1
}
```

### 2. Crear Grupo con Puestos y Evaluaciones
```bash
POST /api/grupos/con-puestos?usuarioId=1
Content-Type: application/json

{
  "nombre": "ADMIN",
  "descripcion": "Grupo Administrativo",
  "empresaId": 1,
  "puestos": [
    {
      "puestoId": 1,
      "evaluacion": {
        "formacion": "A",
        "pasado_profesional": "B",
        "motivo_solicitud": "C",
        "comportamiento": "A",
        "potencial": "B",
        "condiciones_personales": "C",
        "situacion_familiar": "D",
        "proceso_seleccion": "A"
      }
    },
    {
      "puestoId": 2,
      "evaluacion": {
        "formacion": "B",
        "pasado_profesional": "C",
        "motivo_solicitud": "D",
        "comportamiento": "B",
        "potencial": "C",
        "condiciones_personales": "D",
        "situacion_familiar": "A",
        "proceso_seleccion": "B"
      }
    }
  ]
}
```

### 3. Obtener Puestos de un Grupo
```bash
GET /api/grupos/1/puestos

Response:
{
  "success": true,
  "message": "Puestos del grupo obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "grupoId": 1,
      "puestoId": 1,
      "puestoNombre": "GERENTE",
      "puestoDescripcion": "Gerente General",
      "grupoNombre": "ADMIN",
      "evaluacion": {
        "formacion": "A",
        "pasado_profesional": "B",
        ...
      },
      "estado": 1
    }
  ]
}
```

### 4. Actualizar Grupo con Nuevos Puestos
```bash
PUT /api/grupos/1/con-puestos?usuarioId=1
Content-Type: application/json

{
  "nombre": "ADMIN",
  "descripcion": "Grupo Administrativo Actualizado",
  "empresaId": 1,
  "puestos": [
    {
      "puestoId": 1,
      "evaluacion": { ... }
    },
    {
      "puestoId": 3,
      "evaluacion": { ... }
    }
  ]
}
```

## 🔄 Flujo de Datos

### Crear Grupo con Puestos
1. Frontend envía: nombre, descripción, lista de puestos con evaluaciones
2. Backend crea el grupo en `rrhh_mgrupos`
3. Backend crea registros en `rrhh_grupo_puesto_detalle` para cada puesto
4. Cada registro incluye el JSON de evaluaciones

### Editar Grupo
1. Frontend carga el grupo y sus puestos asignados
2. Usuario modifica puestos y/o evaluaciones
3. Backend desactiva asignaciones anteriores (soft delete)
4. Backend crea nuevas asignaciones con los datos actualizados

### Listar Puestos
1. Backend hace LEFT JOIN con `rrhh_grupo_puesto_detalle`
2. Si el puesto tiene grupo asignado, muestra el nombre del grupo
3. Si no tiene grupo, muestra "Sin asignar"

## 🔒 Validaciones Implementadas

### En Puestos
- ✅ Nombre único por empresa
- ✅ Campos requeridos: nombre, descripción, empresaId

### En Grupos
- ✅ Nombre único por empresa
- ✅ Campos requeridos: nombre, descripción, empresaId

### En Asignaciones
- ✅ Un puesto solo puede estar en UN grupo activo a la vez
- ✅ Al eliminar un grupo, se desactivan sus asignaciones
- ✅ Al actualizar un grupo, se reemplazan las asignaciones

## 📊 Estructura JSON de Evaluaciones

```json
{
  "formacion": "A",
  "pasado_profesional": "B",
  "motivo_solicitud": "C",
  "comportamiento": "A",
  "potencial": "B",
  "condiciones_personales": "C",
  "situacion_familiar": "D",
  "proceso_seleccion": "A"
}
```

Cada key corresponde a un item de evaluación y el value es el grado seleccionado (A, B, C o D).

## 🧪 Pasos para Probar

### 1. Ejecutar Scripts SQL
```bash
psql -U usuario -d bd_rrhh -f sql/crear_tabla_grupos.sql
psql -U usuario -d bd_rrhh -f sql/crear_tabla_puestos.sql
psql -U usuario -d bd_rrhh -f sql/crear_tabla_grupo_puesto_detalle.sql
```

### 2. Reiniciar Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Probar Endpoints
```bash
# 1. Crear puestos
curl -X POST http://localhost:8080/api/puestos?usuarioId=1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"GERENTE","descripcion":"Gerente General","empresaId":1}'

# 2. Listar puestos (sin grupo)
curl http://localhost:8080/api/puestos?empresaId=1

# 3. Crear grupo con puestos
curl -X POST http://localhost:8080/api/grupos/con-puestos?usuarioId=1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"ADMIN","descripcion":"Grupo Administrativo","empresaId":1,"puestos":[{"puestoId":1,"evaluacion":{"formacion":"A"}}]}'

# 4. Listar puestos (ahora con grupo)
curl http://localhost:8080/api/puestos?empresaId=1

# 5. Obtener puestos del grupo
curl http://localhost:8080/api/grupos/1/puestos
```

## ✅ Características Implementadas

1. ✅ **Puestos independientes** - Se crean sin grupo
2. ✅ **Asignación flexible** - Un puesto puede asignarse a un grupo después
3. ✅ **Evaluaciones por puesto** - Cada asignación tiene sus propias evaluaciones
4. ✅ **Constraint único** - Un puesto solo en un grupo activo
5. ✅ **Soft delete** - No se pierden datos históricos
6. ✅ **Auditoría completa** - Quién y cuándo en todas las operaciones
7. ✅ **JOINs automáticos** - Los listados traen información relacionada
8. ✅ **Transaccional** - Operaciones atómicas (todo o nada)

## 🎯 Próximo Paso: Frontend

Ahora necesitas implementar en el frontend:

1. **Modal de Grupo** con:
   - Campo: Nombre del Grupo
   - Botón: "Agregar Puesto"
   - Lista de puestos agregados
   - Tabla de evaluación con checkboxes (A, B, C, D)

2. **Lógica JavaScript** para:
   - Cargar puestos disponibles (sin grupo o del grupo actual)
   - Agregar/quitar puestos de la lista
   - Marcar/desmarcar evaluaciones
   - Enviar datos al backend en el formato correcto

¿Quieres que implemente el frontend ahora? 🚀
