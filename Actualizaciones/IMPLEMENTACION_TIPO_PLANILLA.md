# ✅ Implementación Tipo de Planilla

## 📝 Descripción

Se ha implementado el módulo completo de **Tipo de Planilla** para gestionar los diferentes tipos de planillas (Remuneraciones, Gratificaciones, CTS, etc.) que se utilizarán en el sistema de conceptos variables.

---

## 🗄️ Base de Datos

### Tabla: `rrhh_mtipoplanilla`

```sql
CREATE TABLE public.rrhh_mtipoplanilla (
    imtipoplanilla_id BIGSERIAL PRIMARY KEY,
    ttp_descripcion VARCHAR(100) NOT NULL,
    ttp_codigo VARCHAR(20),
    itp_empresa BIGINT NOT NULL,
    itp_estado INTEGER DEFAULT 1,
    itp_usuarioregistro BIGINT,
    ftp_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    itp_usuarioedito BIGINT,
    ftp_fechaedito TIMESTAMP,
    itp_usuarioelimino BIGINT,
    ftp_fechaelimino TIMESTAMP,
    
    CONSTRAINT uk_tipoplanilla_descripcion_empresa UNIQUE (ttp_descripcion, itp_empresa)
);
```

### Campos Principales:
- `imtipoplanilla_id` - ID único (PK)
- `ttp_descripcion` - Descripción del tipo de planilla
- `ttp_codigo` - Código corto (REM, GRAT, CTS, etc.)
- `itp_empresa` - ID de la empresa
- `itp_estado` - Estado (1=Activo, 0=Inactivo)

### Datos Iniciales:
```sql
INSERT INTO rrhh_mtipoplanilla (ttp_descripcion, ttp_codigo, itp_empresa)
VALUES 
    ('PLANILLA DE REMUNERACIONES', 'REM', 1),
    ('PLANILLA DE GRATIFICACIONES', 'GRAT', 1),
    ('PLANILLA DE CTS', 'CTS', 1),
    ('PLANILLA DE UTILIDADES', 'UTIL', 1),
    ('PLANILLA DE VACACIONES', 'VAC', 1),
    ('PLANILLA DE LIQUIDACIONES', 'LIQ', 1);
```

---

## 🔧 Stored Procedures

### 1. `sp_listar_tipos_planilla`
Lista tipos de planilla activos de una empresa.

```sql
SELECT * FROM sp_listar_tipos_planilla(1);
```

**Retorna:**
```
id | descripcion                    | codigo
---+--------------------------------+--------
1  | PLANILLA DE REMUNERACIONES     | REM
2  | PLANILLA DE GRATIFICACIONES    | GRAT
3  | PLANILLA DE CTS                | CTS
```

### 2. `sp_insertar_tipo_planilla`
Inserta un nuevo tipo de planilla.

```sql
SELECT sp_insertar_tipo_planilla(
    'PLANILLA DE BONIFICACIONES',  -- descripcion
    'BON',                          -- codigo
    1,                              -- empresa_id
    1                               -- usuario_id
);
```

### 3. `sp_actualizar_tipo_planilla`
Actualiza un tipo de planilla existente.

```sql
SELECT sp_actualizar_tipo_planilla(
    1,                              -- id
    'PLANILLA MENSUAL',             -- descripcion
    'MEN',                          -- codigo
    1                               -- usuario_id
);
```

### 4. `sp_eliminar_tipo_planilla`
Elimina (soft delete) un tipo de planilla.

```sql
SELECT sp_eliminar_tipo_planilla(1, 1);
```

---

## 🔌 Endpoints Backend

### 1. **GET** `/api/tipo-planilla?empresaId={id}`
Lista tipos de planilla de una empresa.

**Response:**
```json
{
  "success": true,
  "message": "Tipos de planilla obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "descripcion": "PLANILLA DE REMUNERACIONES",
      "codigo": "REM"
    },
    {
      "id": 2,
      "descripcion": "PLANILLA DE GRATIFICACIONES",
      "codigo": "GRAT"
    }
  ]
}
```

### 2. **GET** `/api/tipo-planilla/{id}`
Obtiene un tipo de planilla por ID.

**Response:**
```json
{
  "success": true,
  "message": "Tipo de planilla obtenido exitosamente",
  "data": {
    "id": 1,
    "descripcion": "PLANILLA DE REMUNERACIONES",
    "codigo": "REM",
    "empresa_id": 1
  }
}
```

### 3. **POST** `/api/tipo-planilla`
Crea un nuevo tipo de planilla.

**Request Body:**
```json
{
  "descripcion": "PLANILLA DE BONIFICACIONES",
  "codigo": "BON",
  "empresaId": 1,
  "usuarioId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tipo de planilla creado exitosamente",
  "data": 7
}
```

### 4. **PUT** `/api/tipo-planilla/{id}`
Actualiza un tipo de planilla.

**Request Body:**
```json
{
  "descripcion": "PLANILLA MENSUAL",
  "codigo": "MEN",
  "usuarioId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tipo de planilla actualizado exitosamente",
  "data": true
}
```

### 5. **DELETE** `/api/tipo-planilla/{id}?usuarioId={id}`
Elimina (soft delete) un tipo de planilla.

**Response:**
```json
{
  "success": true,
  "message": "Tipo de planilla eliminado exitosamente",
  "data": true
}
```

---

## 🎨 Integración con Modal de Conceptos Variables

### Cargar ComboBox en el Modal

El JavaScript ya está configurado para cargar automáticamente los tipos de planilla:

```javascript
// En conceptos-variables.js
cargarTiposPlanilla: async function() {
    const response = await fetch(
        `http://localhost:3000/api/tipo-planilla?empresaId=${this.empresaId}`
    );
    const result = await response.json();
    
    if (result.success && result.data) {
        const $select = $('#modalPlanilla');
        $select.empty().append('<option value="">* SELECCIONE *</option>');
        
        result.data.forEach(tipo => {
            $select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
        });
    }
}
```

### ComboBox en el Modal

```html
<select class="form-select" id="modalPlanilla" required>
    <option value="">* SELECCIONE *</option>
    <option value="1">PLANILLA DE REMUNERACIONES</option>
    <option value="2">PLANILLA DE GRATIFICACIONES</option>
    <option value="3">PLANILLA DE CTS</option>
    <option value="4">PLANILLA DE UTILIDADES</option>
    <option value="5">PLANILLA DE VACACIONES</option>
    <option value="6">PLANILLA DE LIQUIDACIONES</option>
</select>
```

---

## 🚀 Cómo Usar

### 1. Ejecutar Script SQL
```bash
psql -U usuario -d base_datos -f sql/crear_tabla_tipo_planilla.sql
```

### 2. Reiniciar Backend
El backend cargará automáticamente el nuevo Controller y Service.

### 3. Verificar Datos
```sql
SELECT * FROM rrhh_mtipoplanilla WHERE itp_empresa = 1;
```

### 4. Probar Endpoint
```bash
curl http://localhost:3000/api/tipo-planilla?empresaId=1
```

### 5. Usar en Modal
Al abrir el modal de Conceptos Variables, el combobox "Planilla" se llenará automáticamente con los tipos de planilla disponibles.

---

## 📊 Estructura de Archivos

### Backend
```
backend/src/main/java/com/meridian/erp/
├── controller/
│   └── TipoPlanillaController.java    ✅ CRUD completo
└── service/
    └── TipoPlanillaService.java       ✅ Lógica de negocio
```

### Base de Datos
```
sql/
└── crear_tabla_tipo_planilla.sql      ✅ Tabla + SPs + Datos iniciales
```

### Frontend
```
frontend/
├── modules/
│   └── conceptos-variables.html       ✅ Modal con combobox
└── js/modules/
    └── conceptos-variables.js         ✅ Carga automática de tipos
```

---

## ✨ Características

1. **CRUD Completo**: Crear, Leer, Actualizar, Eliminar
2. **Soft Delete**: Los registros no se eliminan físicamente
3. **Auditoría**: Registra usuario y fecha de cada operación
4. **Validación**: Constraint único por descripción y empresa
5. **Stored Procedures**: Lógica encapsulada en la BD
6. **API REST**: Endpoints estándar y documentados
7. **Integración Automática**: Se carga automáticamente en el modal

---

## 🎯 Estado: ✅ COMPLETADO

El módulo de Tipo de Planilla está completamente implementado y listo para usar. El combobox en el modal de Conceptos Variables se llenará automáticamente con los tipos de planilla disponibles.

---

## 📝 Próximos Pasos

1. ✅ Ejecutar script SQL
2. ✅ Reiniciar backend
3. ✅ Verificar que el combobox se llene automáticamente
4. 🔄 Implementar endpoints para buscar concepto y trabajador
5. 🔄 Implementar endpoint para guardar conceptos variables en lote
