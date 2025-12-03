# 🔧 Correcciones de Tipos de Datos - Tabla Contrato

## Errores de Incompatibilidad de Tipos

### Error 3: Turno, Horario y Día Descanso
```
ERROR: foreign key constraint "fk_contrato_turno" cannot be implemented
Key columns "ict_turno" and "imturno_id" are of incompatible types: integer and character varying.
```

**Problema**: Las columnas en las tablas maestras son de tipo `VARCHAR(2)`, no `INTEGER`.

---

## Tipos de Datos Corregidos

### Antes (Incorrecto) ❌
```sql
ict_turno INTEGER NOT NULL,
ict_horario INTEGER NOT NULL,
ict_diadescanso INTEGER NOT NULL,
```

### Después (Correcto) ✅
```sql
ict_turno VARCHAR(2) NOT NULL,
ict_horario VARCHAR(2) NOT NULL,
ict_diadescanso VARCHAR(2) NOT NULL,
```

---

## Tabla Completa de Tipos de Datos

| Campo | Tipo Correcto | Tabla Referenciada | Columna Referenciada |
|-------|---------------|-------------------|---------------------|
| `ict_trabajador` | `BIGINT` | `rrhh_trabajador` | `itrabajador_id` (BIGINT) |
| `ict_tipocontrato` | `INTEGER` | `rrhh_mtipocontrato` | `imtipocontrato_id` (INTEGER) |
| `ict_sede` | `BIGINT` | `rrhh_msede` | `imsede_id` (BIGINT) |
| `ict_puesto` | `INTEGER` | `rrhh_mpuestos` | `impuesto_id` (INTEGER) |
| `ict_turno` | `VARCHAR(2)` ⭐ | `rrhh_mturno` | `imturno_id` (VARCHAR) |
| `ict_horario` | `VARCHAR(2)` ⭐ | `rrhh_mhorario` | `imhorario_id` (VARCHAR) |
| `ict_diadescanso` | `VARCHAR(2)` ⭐ | `rrhh_mdiasemana` | `imdiasemana_id` (VARCHAR) |
| `ict_tipotrabajador` | `INTEGER` | `rrhh_mtipotrabajador` | `imtipotrabajador_id` (INTEGER) |
| `ict_regimenpensionario` | `INTEGER` | `rrhh_mregimenpensionario` | `imregimenpensionario_id` (INTEGER) |
| `ict_regimenlaboral` | `BIGINT` | `rrhh_conceptos_regimen_laboral` | `imconceptosregimen_id` (BIGINT) |

---

## Razón del Cambio

En la entidad `Trabajador.java`, estos campos están definidos como `String`:

```java
@Column(name = "it_turno", length = 2)
private String turnoId;

@Column(name = "it_horario", length = 2)
private String horarioId;

@Column(name = "it_diadescanso", length = 2)
private String diaDescanso;
```

Esto indica que en la base de datos, las tablas maestras usan códigos de 2 caracteres (VARCHAR) en lugar de IDs numéricos (INTEGER).

**Ejemplos de códigos:**
- Turno: `'01'`, `'02'`, `'03'`
- Horario: `'01'`, `'02'`, `'03'`
- Día Semana: `'01'` (Lunes), `'02'` (Martes), etc.

---

## Procedimientos Almacenados Actualizados

### sp_guardar_contrato_trabajador

**Parámetros actualizados:**
```sql
p_turno_id VARCHAR(2),          -- Antes: INTEGER
p_horario_id VARCHAR(2),        -- Antes: INTEGER
p_dia_descanso_id VARCHAR(2),  -- Antes: INTEGER
```

### sp_actualizar_contrato_trabajador

**Parámetros actualizados:**
```sql
p_turno_id VARCHAR(2),          -- Antes: INTEGER
p_horario_id VARCHAR(2),        -- Antes: INTEGER
p_dia_descanso_id VARCHAR(2),  -- Antes: INTEGER
```

### sp_obtener_contrato_por_id

**Retorno actualizado:**
```sql
turno_id VARCHAR,               -- Antes: INTEGER
horario_id VARCHAR,             -- Antes: INTEGER
dia_descanso_id VARCHAR,        -- Antes: INTEGER
```

---

## Ejemplo de Inserción Actualizado

```sql
SELECT sp_guardar_contrato_trabajador(
    1,              -- trabajador_id (BIGINT)
    1,              -- tipocontrato_id (INTEGER)
    '2024-01-01',   -- fecha_inicio
    '2024-12-31',   -- fecha_fin
    1,              -- sede_id (BIGINT)
    1,              -- puesto_id (INTEGER)
    '01',           -- turno_id (VARCHAR) ⭐
    '01',           -- horario_id (VARCHAR) ⭐
    '08:00:00',     -- hora_entrada
    '17:00:00',     -- hora_salida
    '01',           -- dia_descanso_id (VARCHAR) ⭐
    1,              -- tipo_trabajador_id (INTEGER)
    1,              -- regimen_pensionario_id (INTEGER)
    1,              -- regimen_laboral_id (BIGINT)
    8.0,            -- hora_laboral
    1500.00,        -- remuneracion_basica
    500.00,         -- remuneracion_rc
    2000.00,        -- sueldo_mensual
    1               -- usuario_id
);
```

---

## Estructura Final de la Tabla

```sql
CREATE TABLE public.rrhh_mcontratotrabajador (
    imcontratotrabajador_id BIGSERIAL PRIMARY KEY,
    
    -- Información del trabajador y contrato
    ict_trabajador BIGINT NOT NULL,
    ict_tipocontrato INTEGER NOT NULL,
    fct_fechainiciolaboral DATE NOT NULL,
    fct_fechafinlaboral DATE,
    
    -- Ubicación y puesto
    ict_sede BIGINT NOT NULL,
    ict_puesto INTEGER NOT NULL,
    
    -- Horario y turno (VARCHAR, no INTEGER) ⭐
    ict_turno VARCHAR(2) NOT NULL,
    ict_horario VARCHAR(2) NOT NULL,
    hct_horaentrada TIME NOT NULL,
    hct_horasalida TIME NOT NULL,
    ict_diadescanso VARCHAR(2) NOT NULL,
    
    -- Tipo de trabajador y regímenes
    ict_tipotrabajador INTEGER NOT NULL,
    ict_regimenpensionario INTEGER NOT NULL,
    ict_regimenlaboral BIGINT NOT NULL,
    
    -- Horas laborales
    hct_horalaboral DECIMAL(5,2) DEFAULT 0.00,
    
    -- Remuneraciones
    dct_remuneracionbasica DECIMAL(10,2) DEFAULT 0.00,
    dct_remuneracionrc DECIMAL(10,2) DEFAULT 0.00,
    dct_sueldomensual DECIMAL(10,2) DEFAULT 0.00,
    
    -- Estado y auditoría
    ict_estado INTEGER DEFAULT 1,
    ict_usuarioregistro BIGINT,
    fct_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ict_usuarioedito BIGINT,
    fct_fechaedito TIMESTAMP,
    ict_usuarioelimino BIGINT,
    fct_fechaelimino TIMESTAMP,
    
    -- Constraints (todos con tipos compatibles)
    CONSTRAINT fk_contrato_trabajador ...,
    CONSTRAINT fk_contrato_tipocontrato ...,
    CONSTRAINT fk_contrato_sede ...,
    CONSTRAINT fk_contrato_puesto ...,
    CONSTRAINT fk_contrato_turno ...,           -- VARCHAR(2) → VARCHAR
    CONSTRAINT fk_contrato_horario ...,         -- VARCHAR(2) → VARCHAR
    CONSTRAINT fk_contrato_diadescanso ...,     -- VARCHAR(2) → VARCHAR
    CONSTRAINT fk_contrato_tipotrabajador ...,
    CONSTRAINT fk_contrato_regimenpensionario ...,
    CONSTRAINT fk_contrato_regimenlaboral ...
);
```

---

## Impacto en el Frontend

Cuando implementes el frontend, deberás enviar estos valores como **strings**, no como números:

```javascript
// ❌ INCORRECTO
const datos = {
    turnoId: 1,           // Número
    horarioId: 1,         // Número
    diaDescansoId: 1      // Número
};

// ✅ CORRECTO
const datos = {
    turnoId: '01',        // String con padding
    horarioId: '01',      // String con padding
    diaDescansoId: '01'   // String con padding
};
```

### Ejemplo de función guardar() en JavaScript:

```javascript
guardar: function() {
    const datos = {
        trabajadorId: $('#trabajadorId').val(),
        tipoContratoId: $('#tipoContrato').val(),
        fechaInicio: $('#fechaInicio').val(),
        fechaFin: $('#fechaFin').val(),
        sedeId: $('#sede').val(),
        puestoId: $('#puesto').val(),
        turnoId: $('#turno').val(),           // Ya viene como string del select
        horarioId: $('#horario').val(),       // Ya viene como string del select
        diaDescansoId: $('#diaDescanso').val(), // Ya viene como string del select
        // ... resto de campos
    };
    
    // Los valores del select ya vienen como string, no necesitas conversión
}
```

---

## Resumen de Todas las Correcciones

| # | Error | Corrección |
|---|-------|-----------|
| 1 | `rrhh_mtrabajador` no existe | → `rrhh_trabajador(itrabajador_id)` |
| 2 | `impuestos_id` no existe | → `impuesto_id` |
| 3 | Tipos incompatibles turno/horario/dia | → `VARCHAR(2)` en lugar de `INTEGER` |

---

## ✅ Estado Final

El script `sql/crear_tabla_contrato_trabajador.sql` ahora tiene:

- ✅ Nombres correctos de tablas
- ✅ Nombres correctos de columnas
- ✅ Tipos de datos compatibles
- ✅ 10 foreign keys funcionales
- ✅ 4 procedimientos almacenados actualizados
- ✅ 5 índices optimizados

---

## 🚀 Listo para Ejecutar

```bash
# Ejecutar sin errores:
psql -U postgres -d tu_base_de_datos -f sql/crear_tabla_contrato_trabajador.sql
```

**Resultado esperado:**
```
CREATE TABLE
CREATE INDEX (x5)
CREATE FUNCTION (x4)
NOTICE: ✅ Tabla RRHH_MCONTRATOTRABAJADOR creada exitosamente
```

---

## Verificación Post-Ejecución

```sql
-- Verificar tipos de datos
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_mcontratotrabajador'
    AND column_name IN ('ict_turno', 'ict_horario', 'ict_diadescanso')
ORDER BY column_name;

-- Resultado esperado:
-- ict_diadescanso | character varying | 2
-- ict_horario     | character varying | 2
-- ict_turno       | character varying | 2
```

---

## 📋 Archivos Actualizados

```
sql/
└── crear_tabla_contrato_trabajador.sql    ← ✅ CORREGIDO (tipos de datos)

docs/
├── ESTRUCTURA_TABLA_CONTRATO_TRABAJADOR.md ← Actualizado
├── CORRECCIONES_FINALES_TABLA_CONTRATO.md
└── CORRECCIONES_TIPOS_DATOS_CONTRATO.md    ← Este archivo
```

Todo listo para ejecutar! 🎉
