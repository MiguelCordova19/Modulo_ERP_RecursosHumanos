# 📋 Estructura de Tabla - RRHH_MCONTRATOTRABAJADOR

## Descripción General

Tabla para almacenar los contratos de trabajadores con toda la información laboral, horarios, remuneraciones y regímenes.

---

## Estructura de la Tabla

### Campos Principales

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `imcontratotrabajador_id` | BIGSERIAL | ID único del contrato (PK) | ✅ |
| `ict_trabajador` | BIGINT | ID del trabajador | ✅ |
| `ict_tipocontrato` | INTEGER | ID del tipo de contrato | ✅ |
| `fct_fechainiciolaboral` | DATE | Fecha de inicio del contrato | ✅ |
| `fct_fechafinlaboral` | DATE | Fecha de fin del contrato | ❌ |

### Ubicación y Puesto

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `ict_sede` | BIGINT | ID de la sede | ✅ |
| `ict_puesto` | INTEGER | ID del puesto | ✅ |

### Horario y Turno

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `ict_turno` | INTEGER | ID del turno | ✅ |
| `ict_horario` | INTEGER | ID del horario | ✅ |
| `hct_horaentrada` | TIME | Hora de entrada | ✅ |
| `hct_horasalida` | TIME | Hora de salida | ✅ |
| `ict_diadescanso` | INTEGER | ID del día de descanso | ✅ |
| `hct_horalaboral` | DECIMAL(5,2) | Horas laborales diarias | ✅ |

### Tipo de Trabajador y Regímenes

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `ict_tipotrabajador` | INTEGER | ID del tipo de trabajador | ✅ |
| `ict_regimenpensionario` | INTEGER | ID del régimen pensionario | ✅ |
| `ict_regimenlaboral` | BIGINT | **ID del concepto régimen laboral** | ✅ |

⚠️ **IMPORTANTE**: `ict_regimenlaboral` guarda el ID de `rrhh_conceptos_regimen_laboral`, NO el ID del régimen laboral directamente.

### Remuneraciones

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `dct_remuneracionbasica` | DECIMAL(10,2) | Remuneración básica mensual | ✅ |
| `dct_remuneracionrc` | DECIMAL(10,2) | Remuneración R.C. | ✅ |
| `dct_sueldomensual` | DECIMAL(10,2) | Sueldo total (Básica + RC) | ✅ |

**Fórmula:**
```
dct_sueldomensual = dct_remuneracionbasica + dct_remuneracionrc
```

### Auditoría

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ict_estado` | INTEGER | Estado (1=activo, 0=inactivo) |
| `ict_usuarioregistro` | BIGINT | Usuario que registró |
| `fct_fecharegistro` | TIMESTAMP | Fecha de registro |
| `ict_usuarioedito` | BIGINT | Usuario que editó |
| `fct_fechaedito` | TIMESTAMP | Fecha de edición |
| `ict_usuarioelimino` | BIGINT | Usuario que eliminó |
| `fct_fechaelimino` | TIMESTAMP | Fecha de eliminación |

---

## Relaciones (Foreign Keys)

```
rrhh_mcontratotrabajador
├── ict_trabajador → rrhh_mtrabajador(imtrabajador_id)
├── ict_tipocontrato → rrhh_mtipocontrato(imtipocontrato_id)
├── ict_sede → rrhh_msede(imsede_id)
├── ict_puesto → rrhh_mpuestos(impuestos_id)
├── ict_turno → rrhh_mturno(imturno_id)
├── ict_horario → rrhh_mhorario(imhorario_id)
├── ict_diadescanso → rrhh_mdiasemana(imdiasemana_id)
├── ict_tipotrabajador → rrhh_mtipotrabajador(imtipotrabajador_id)
├── ict_regimenpensionario → rrhh_mregimenpensionario(imregimenpensionario_id)
└── ict_regimenlaboral → rrhh_conceptos_regimen_laboral(imconceptosregimen_id) ⭐
```

---

## Índices Creados

```sql
-- Índice por trabajador (búsquedas frecuentes)
CREATE INDEX idx_contrato_trabajador ON rrhh_mcontratotrabajador(ict_trabajador);

-- Índice por estado (filtrado activo/inactivo)
CREATE INDEX idx_contrato_estado ON rrhh_mcontratotrabajador(ict_estado);

-- Índice por sede (filtrado por ubicación)
CREATE INDEX idx_contrato_sede ON rrhh_mcontratotrabajador(ict_sede);

-- Índice por fechas (búsquedas por rango de fechas)
CREATE INDEX idx_contrato_fechas ON rrhh_mcontratotrabajador(fct_fechainiciolaboral, fct_fechafinlaboral);

-- Índice por régimen laboral (para traer conceptos)
CREATE INDEX idx_contrato_regimenlaboral ON rrhh_mcontratotrabajador(ict_regimenlaboral);
```

---

## Procedimientos Almacenados

### 1. sp_guardar_contrato_trabajador

**Descripción**: Guarda un nuevo contrato de trabajador

**Parámetros**:
```sql
p_trabajador_id BIGINT,
p_tipocontrato_id INTEGER,
p_fecha_inicio DATE,
p_fecha_fin DATE,
p_sede_id BIGINT,
p_puesto_id INTEGER,
p_turno_id INTEGER,
p_horario_id INTEGER,
p_hora_entrada TIME,
p_hora_salida TIME,
p_dia_descanso_id INTEGER,
p_tipo_trabajador_id INTEGER,
p_regimen_pensionario_id INTEGER,
p_regimen_laboral_id BIGINT,          -- ⭐ ID de conceptos_regimen_laboral
p_hora_laboral DECIMAL(5,2),
p_remuneracion_basica DECIMAL(10,2),  -- ⭐ Nuevo campo
p_remuneracion_rc DECIMAL(10,2),      -- ⭐ Nuevo campo
p_sueldo_mensual DECIMAL(10,2),
p_usuario_id BIGINT
```

**Retorna**: `BIGINT` (ID del contrato creado)

**Ejemplo de uso**:
```sql
SELECT sp_guardar_contrato_trabajador(
    1,              -- trabajador_id
    1,              -- tipocontrato_id
    '2024-01-01',   -- fecha_inicio
    '2024-12-31',   -- fecha_fin
    1,              -- sede_id
    1,              -- puesto_id
    '01',           -- turno_id (VARCHAR)
    '01',           -- horario_id (VARCHAR)
    '08:00:00',     -- hora_entrada
    '17:00:00',     -- hora_salida
    '01',           -- dia_descanso_id (VARCHAR)
    1,              -- tipo_trabajador_id
    1,              -- regimen_pensionario_id
    1,              -- regimen_laboral_id (conceptos_regimen_laboral)
    8.0,            -- hora_laboral
    1500.00,        -- remuneracion_basica
    500.00,         -- remuneracion_rc
    2000.00,        -- sueldo_mensual
    1               -- usuario_id
);
```

---

### 2. sp_actualizar_contrato_trabajador

**Descripción**: Actualiza un contrato existente

**Parámetros**: Igual que `sp_guardar_contrato_trabajador` + `p_contrato_id`

**Retorna**: `BOOLEAN` (true si se actualizó correctamente)

---

### 3. sp_eliminar_contrato_trabajador

**Descripción**: Elimina (soft delete) un contrato

**Parámetros**:
```sql
p_contrato_id BIGINT,
p_usuario_id BIGINT
```

**Retorna**: `BOOLEAN` (true si se eliminó correctamente)

---

### 4. sp_listar_contratos_por_sede

**Descripción**: Lista todos los contratos de una sede con información completa

**Parámetros**:
```sql
p_sede_id BIGINT
```

**Retorna**: Tabla con todos los datos del contrato y relaciones

---

### 5. sp_obtener_contrato_por_id

**Descripción**: Obtiene un contrato específico por su ID

**Parámetros**:
```sql
p_contrato_id BIGINT
```

**Retorna**: Tabla con los datos del contrato

---

## Mapeo con el Modal del Frontend

### Campos del Modal → Campos de la Tabla

| Campo Modal | Campo Tabla | Tipo |
|-------------|-------------|------|
| Buscar Trabajador | `ict_trabajador` | BIGINT |
| Tipo Contrato | `ict_tipocontrato` | INTEGER |
| Fecha Ingreso Laboral | `fct_fechainiciolaboral` | DATE |
| Fecha Inicio | `fct_fechainiciolaboral` | DATE |
| Fecha Fin | `fct_fechafinlaboral` | DATE |
| Sede | `ict_sede` | BIGINT |
| Puesto | `ict_puesto` | INTEGER |
| Turno | `ict_turno` | INTEGER |
| Horario | `ict_horario` | INTEGER |
| H. Entrada | `hct_horaentrada` | TIME |
| H. Salida | `hct_horasalida` | TIME |
| Hora Laboral | `hct_horalaboral` | DECIMAL |
| Día Descanso | `ict_diadescanso` | INTEGER |
| Tipo Trabajador | `ict_tipotrabajador` | INTEGER |
| Régimen Pensionario | `ict_regimenpensionario` | INTEGER |
| Régimen Laboral | `ict_regimenlaboral` | BIGINT |
| **Remuneración Básica** | `dct_remuneracionbasica` | DECIMAL |
| **Remuneración R.C.** | `dct_remuneracionrc` | DECIMAL |
| **Sueldo Total** | `dct_sueldomensual` | DECIMAL |

---

## Ejemplo de Datos

```sql
INSERT INTO rrhh_mcontratotrabajador (
    ict_trabajador,
    ict_tipocontrato,
    fct_fechainiciolaboral,
    fct_fechafinlaboral,
    ict_sede,
    ict_puesto,
    ict_turno,
    ict_horario,
    hct_horaentrada,
    hct_horasalida,
    ict_diadescanso,
    ict_tipotrabajador,
    ict_regimenpensionario,
    ict_regimenlaboral,
    hct_horalaboral,
    dct_remuneracionbasica,
    dct_remuneracionrc,
    dct_sueldomensual,
    ict_estado,
    ict_usuarioregistro
) VALUES (
    1,                  -- Trabajador: Juan Pérez
    1,                  -- Tipo Contrato: Plazo Fijo
    '2024-01-01',       -- Fecha Inicio
    '2024-12-31',       -- Fecha Fin
    1,                  -- Sede: Lima
    1,                  -- Puesto: Analista
    1,                  -- Turno: Mañana
    1,                  -- Horario: 8am-5pm
    '08:00:00',         -- Hora Entrada
    '17:00:00',         -- Hora Salida
    7,                  -- Día Descanso: Domingo
    1,                  -- Tipo Trabajador: Empleado
    1,                  -- Régimen Pensionario: ONP
    1,                  -- Régimen Laboral: ID de conceptos_regimen_laboral
    8.0,                -- Hora Laboral: 8 horas
    1500.00,            -- Remuneración Básica
    500.00,             -- Remuneración RC
    2000.00,            -- Sueldo Total
    1,                  -- Estado: Activo
    1                   -- Usuario Registro
);
```

---

## Validaciones Importantes

### 1. Validar Fechas
```sql
-- La fecha de fin debe ser mayor que la fecha de inicio
CHECK (fct_fechafinlaboral IS NULL OR fct_fechafinlaboral > fct_fechainiciolaboral)
```

### 2. Validar Horas
```sql
-- La hora de salida debe ser mayor que la hora de entrada
CHECK (hct_horasalida > hct_horaentrada)
```

### 3. Validar Sueldo
```sql
-- El sueldo mensual debe ser la suma de básica + RC
CHECK (dct_sueldomensual = dct_remuneracionbasica + dct_remuneracionrc)
```

### 4. Validar Régimen Laboral
```sql
-- El régimen laboral debe existir y tener conceptos
SELECT COUNT(*) FROM rrhh_conceptos_regimen_laboral 
WHERE imconceptosregimen_id = ? AND ic_estado = 1
```

---

## Uso del Campo ict_regimenlaboral

### ¿Por qué guardar el ID de conceptos_regimen_laboral?

```
┌─────────────────────────────────────────────────────────────┐
│  RRHH_CONCEPTOS_REGIMEN_LABORAL                             │
│  (Cabecera de conceptos por régimen)                        │
├─────────────────────────────────────────────────────────────┤
│  ID: 1                                                      │
│  Régimen: 01 (Régimen General)                             │
│  Empresa: 1                                                 │
│  Estado: 1                                                  │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  RRHH_CONCEPTOS_REGIMEN_DETALLE                             │
│  (Detalles de conceptos)                                    │
├─────────────────────────────────────────────────────────────┤
│  - Concepto: Sueldo Básico                                  │
│  - Concepto: Asignación Familiar                            │
│  - Concepto: ONP (13%)                                      │
│  - Concepto: EsSalud (9%)                                   │
└─────────────────────────────────────────────────────────────┘
```

**Ventaja**: Con el ID de `conceptos_regimen_laboral`, puedes traer directamente todos los conceptos configurados para ese régimen en esa empresa.

**Query para traer conceptos**:
```sql
SELECT 
    crd.ic_concepto_id,
    c.tc_descripcion,
    c.dc_porcentaje
FROM rrhh_conceptos_regimen_detalle crd
INNER JOIN rrhh_mconceptos c ON crd.ic_concepto_id = c.imconceptos_id
WHERE crd.ic_conceptosregimen_id = ? -- ID del contrato.ict_regimenlaboral
    AND crd.ic_estado = 1
```

---

## Próximos Pasos

1. ✅ Crear la tabla en la base de datos
2. ✅ Crear los procedimientos almacenados
3. ⏳ Crear entidad en el backend (Java)
4. ⏳ Crear repositorio en el backend
5. ⏳ Crear servicio en el backend
6. ⏳ Crear controlador en el backend
7. ⏳ Implementar función guardar() en el frontend
8. ⏳ Implementar función editar() en el frontend
9. ⏳ Implementar función eliminar() en el frontend

---

## Notas Técnicas

- ✅ Usa BIGSERIAL para IDs de gran volumen
- ✅ Usa DECIMAL para montos monetarios (precisión)
- ✅ Usa TIME para horas (sin fecha)
- ✅ Usa DATE para fechas (sin hora)
- ✅ Usa TIMESTAMP para auditoría (fecha + hora)
- ✅ Todos los campos monetarios con 2 decimales
- ✅ Soft delete (estado = 0) en lugar de DELETE físico
- ✅ Índices en campos de búsqueda frecuente
