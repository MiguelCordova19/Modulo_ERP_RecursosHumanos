# Implementación de Tabla Turno

## 📋 Resumen
Se ha implementado la tabla maestra de turnos (RRHH_MTURNO) con su backend completo y integración en el formulario de trabajadores.

## 🗄️ Base de Datos

### Tabla: rrhh_mturno
```sql
CREATE TABLE rrhh_mturno (
    imturno_id VARCHAR(2) PRIMARY KEY,
    tt_descripcion VARCHAR(50) NOT NULL,
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1
);
```

### Datos Iniciales
| ID | Descripción |
|----|-------------|
| 01 | Mañana      |
| 02 | Tarde       |
| 03 | Noche       |

## 🔧 Backend (Java Spring Boot)

### Archivos Creados

1. **Entity**: `backend/src/main/java/com/meridian/erp/entity/Turno.java`
   - Mapeo JPA de la tabla rrhh_mturno
   - Campos: id, descripcion, estado, auditoría

2. **Repository**: `backend/src/main/java/com/meridian/erp/repository/TurnoRepository.java`
   - `findByEstadoOrderByIdAsc()` - Listar turnos activos ordenados

3. **Service**: `backend/src/main/java/com/meridian/erp/service/TurnoService.java`
   - `listarTodos()` - Todos los turnos
   - `listarActivos()` - Solo turnos activos
   - `obtenerPorId()` - Turno específico

4. **Controller**: `backend/src/main/java/com/meridian/erp/controller/TurnoController.java`
   - Endpoints REST para consumir desde frontend

### Archivos Modificados

5. **Trabajador Entity**: Cambio de tipo de dato
   ```java
   // Antes
   private Integer turnoId;
   
   // Después
   private String turnoId; // VARCHAR(2)
   ```

6. **TrabajadorDTO**: Cambio de tipo de dato
   ```java
   private String turnoId;
   ```

## 📡 Endpoints Disponibles

### Listar todos los turnos
```
GET /api/turnos
Response: {
  "success": true,
  "data": [
    {"id": "01", "descripcion": "Mañana", "estado": 1},
    {"id": "02", "descripcion": "Tarde", "estado": 1},
    {"id": "03", "descripcion": "Noche", "estado": 1}
  ]
}
```

### Listar turnos activos
```
GET /api/turnos/activos
Response: {
  "success": true,
  "data": [...]
}
```

### Obtener turno por ID
```
GET /api/turnos/{id}
Response: {
  "success": true,
  "data": {"id": "01", "descripcion": "Mañana", "estado": 1}
}
```

## 🎨 Frontend

### HTML Modificado
**Archivo**: `frontend/modules/trabajador.html`

Cambio de input text a select:
```html
<!-- Antes -->
<input type="text" class="form-control" id="turno" readonly>

<!-- Después -->
<select class="form-select" id="turno" disabled>
    <option value="">Seleccione...</option>
</select>
```

### JavaScript Modificado
**Archivo**: `frontend/js/modules/trabajador.js`

1. **Nueva función `cargarTurnos()`**:
```javascript
cargarTurnos: async function() {
    const response = await fetch('/api/turnos/activos');
    const result = await response.json();
    
    if (result.success && result.data) {
        const select = $('#turno');
        select.find('option:not(:first)').remove();
        
        result.data.forEach(turno => {
            const option = `<option value="${turno.id}">${turno.descripcion}</option>`;
            select.append(option);
        });
    }
}
```

2. **Integración en `nuevo()`**:
   - Se llama `this.cargarTurnos()` al abrir el modal

3. **Integración en `editar()`**:
   - Se incluye en el `Promise.all()` para carga paralela
   - Se establece el valor: `$('#turno').val(trabajador.turnoId)`

4. **Ajuste en `ajustarFormularioPorTipo()`**:
   - RRHH: `$('#turno').prop('disabled', false)` - Habilitado
   - PLANILLA: `$('#turno').prop('disabled', true)` - Bloqueado

5. **Envío de datos en `guardar()`**:
   ```javascript
   turnoId: $('#turno').val() || null
   ```

## 🎯 Comportamiento

### Modo PLANILLA
- Campo Turno: **Bloqueado** (disabled)
- Se llenará dinámicamente desde el sistema
- No editable por el usuario

### Modo RRHH
- Campo Turno: **Habilitado** (enabled)
- Usuario puede seleccionar: Mañana, Tarde o Noche
- Valor se guarda directamente

## 🚀 Pasos para Implementar

### 1. Ejecutar Script SQL
```bash
# En PostgreSQL
psql -U usuario -d nombre_bd -f sql/crear_tabla_turno.sql
```

O ejecutar manualmente:
```sql
\i sql/crear_tabla_turno.sql
```

### 2. Reiniciar Backend
```bash
cd backend
mvn spring-boot:run
```

### 3. Verificar Endpoints
Abrir en el navegador:
```
http://localhost:8080/api/turnos/activos
```

Debe devolver:
```json
{
  "success": true,
  "data": [
    {"id": "01", "descripcion": "Mañana", "estado": 1},
    {"id": "02", "descripcion": "Tarde", "estado": 1},
    {"id": "03", "descripcion": "Noche", "estado": 1}
  ]
}
```

### 4. Probar en Frontend
1. Recargar página: `Ctrl + F5`
2. Ir a módulo Trabajadores
3. Hacer clic en "Nuevo"
4. Seleccionar RRHH
5. Ir a pestaña "Datos Laborales"
6. Verificar que el campo Turno sea un select con opciones

## ✅ Validaciones

- ✅ Campo Turno es opcional (no required)
- ✅ Se guarda como VARCHAR(2) en base de datos
- ✅ Solo se habilita en modo RRHH
- ✅ Se carga dinámicamente desde API
- ✅ Se puede editar y actualizar

## 📊 Estructura de Datos

### Tabla Turno
```
imturno_id (PK) | tt_descripcion | it_estado
----------------|----------------|----------
01              | Mañana         | 1
02              | Tarde          | 1
03              | Noche          | 1
```

### Relación con Trabajador
```
rrhh_trabajador.it_turno (FK) -> rrhh_mturno.imturno_id
```

## 🔄 Flujo de Datos

1. **Carga inicial**: Frontend llama `/api/turnos/activos`
2. **Selección**: Usuario elige turno del dropdown
3. **Guardado**: Se envía `turnoId: "01"` (por ejemplo)
4. **Backend**: Valida y guarda en `rrhh_trabajador.it_turno`
5. **Edición**: Se carga el turno y se selecciona en el dropdown

## 🎨 Interfaz de Usuario

### Select de Turno
- **Placeholder**: "Seleccione..."
- **Opciones**: Mañana, Tarde, Noche
- **Estado PLANILLA**: Deshabilitado (gris)
- **Estado RRHH**: Habilitado (blanco)

## 📝 Notas Importantes

1. **Tipo de Dato**: El turnoId es VARCHAR(2), no Integer
2. **Valores**: "01", "02", "03" (con ceros a la izquierda)
3. **Nullable**: El campo puede ser NULL si no se asigna turno
4. **Extensible**: Se pueden agregar más turnos en la base de datos

## 🔜 Próximos Pasos

- [ ] Crear tabla de Horarios (similar a Turnos)
- [ ] Implementar CRUD completo de Turnos (crear, editar, eliminar)
- [ ] Agregar validaciones de negocio
- [ ] Implementar relación con horarios específicos
- [ ] Agregar filtros por turno en reportes

## 🐛 Troubleshooting

### Error: "Turno no se carga"
- Verificar que el endpoint `/api/turnos/activos` responda correctamente
- Revisar consola del navegador para errores de CORS
- Verificar que el backend esté corriendo

### Error: "Cannot convert String to Integer"
- Asegurarse de que turnoId sea String en Entity y DTO
- Verificar que en JavaScript no se use `parseInt()` para turnoId

### Select vacío
- Verificar que la tabla rrhh_mturno tenga datos
- Revisar que el estado de los turnos sea 1 (ACTIVO)
- Verificar que la función `cargarTurnos()` se esté llamando
