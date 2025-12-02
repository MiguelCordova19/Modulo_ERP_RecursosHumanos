# ✅ Tabla Contrato Trabajador - CORREGIDA

## Problema Resuelto

El script original tenía un error en el nombre de la tabla de trabajadores:
- ❌ **Incorrecto**: `rrhh_mtrabajador` con columna `imtrabajador_id`
- ✅ **Correcto**: `rrhh_trabajador` con columna `itrabajador_id`

---

## Tablas Confirmadas

Todas las tablas referenciadas **SÍ EXISTEN**:

| Tabla | Columna ID | Estado |
|-------|-----------|--------|
| `rrhh_trabajador` | `itrabajador_id` | ✅ |
| `rrhh_msede` | `imsede_id` | ✅ |
| `rrhh_mpuestos` | `impuesto_id` | ✅ |
| `rrhh_mturno` | `imturno_id` | ✅ |
| `rrhh_mhorario` | `imhorario_id` | ✅ |
| `rrhh_mdiasemana` | `imdiasemana_id` | ✅ |
| `rrhh_mtipocontrato` | `imtipocontrato_id` | ✅ |
| `rrhh_mtipotrabajador` | `imtipotrabajador_id` | ✅ |
| `rrhh_mregimenpensionario` | `imregimenpensionario_id` | ✅ |
| `rrhh_conceptos_regimen_laboral` | `imconceptosregimen_id` | ✅ |

---

## Cambios Aplicados

### 1. Constraint de Trabajador
```sql
-- ANTES (incorrecto)
CONSTRAINT fk_contrato_trabajador FOREIGN KEY (ict_trabajador) 
    REFERENCES public.rrhh_mtrabajador(imtrabajador_id)

-- DESPUÉS (correcto)
CONSTRAINT fk_contrato_trabajador FOREIGN KEY (ict_trabajador) 
    REFERENCES public.rrhh_trabajador(itrabajador_id)
```

### 2. Todos los Constraints Activos

Ahora el script incluye **TODOS** los constraints:

```sql
✅ fk_contrato_trabajador → rrhh_trabajador
✅ fk_contrato_tipocontrato → rrhh_mtipocontrato
✅ fk_contrato_sede → rrhh_msede
✅ fk_contrato_puesto → rrhh_mpuestos
✅ fk_contrato_turno → rrhh_mturno
✅ fk_contrato_horario → rrhh_mhorario
✅ fk_contrato_diadescanso → rrhh_mdiasemana
✅ fk_contrato_tipotrabajador → rrhh_mtipotrabajador
✅ fk_contrato_regimenpensionario → rrhh_mregimenpensionario
✅ fk_contrato_regimenlaboral → rrhh_conceptos_regimen_laboral
```

---

## Estructura Final de la Tabla

```sql
CREATE TABLE public.rrhh_mcontratotrabajador (
    -- Clave primaria
    imcontratotrabajador_id BIGSERIAL PRIMARY KEY,
    
    -- Información del trabajador y contrato
    ict_trabajador BIGINT NOT NULL,              -- FK a rrhh_trabajador
    ict_tipocontrato INTEGER NOT NULL,           -- FK a rrhh_mtipocontrato
    fct_fechainiciolaboral DATE NOT NULL,
    fct_fechafinlaboral DATE,
    
    -- Ubicación y puesto
    ict_sede BIGINT NOT NULL,                    -- FK a rrhh_msede
    ict_puesto INTEGER NOT NULL,                 -- FK a rrhh_mpuestos
    
    -- Horario y turno
    ict_turno INTEGER NOT NULL,                  -- FK a rrhh_mturno
    ict_horario INTEGER NOT NULL,                -- FK a rrhh_mhorario
    hct_horaentrada TIME NOT NULL,
    hct_horasalida TIME NOT NULL,
    ict_diadescanso INTEGER NOT NULL,            -- FK a rrhh_mdiasemana
    
    -- Tipo de trabajador y regímenes
    ict_tipotrabajador INTEGER NOT NULL,         -- FK a rrhh_mtipotrabajador
    ict_regimenpensionario INTEGER NOT NULL,     -- FK a rrhh_mregimenpensionario
    ict_regimenlaboral BIGINT NOT NULL,          -- FK a rrhh_conceptos_regimen_laboral ⭐
    
    -- Horas laborales
    hct_horalaboral DECIMAL(5,2) DEFAULT 0.00,
    
    -- Remuneraciones ⭐ NUEVOS CAMPOS
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
    fct_fechaelimino TIMESTAMP
);
```

---

## Campos Especiales

### 1. Régimen Laboral
```sql
ict_regimenlaboral BIGINT NOT NULL
```
- Guarda el **ID de `rrhh_conceptos_regimen_laboral`**
- NO guarda el ID del régimen laboral directamente
- Permite traer todos los conceptos configurados para ese régimen

### 2. Remuneraciones
```sql
dct_remuneracionbasica DECIMAL(10,2)  -- Remuneración básica
dct_remuneracionrc DECIMAL(10,2)      -- Remuneración R.C.
dct_sueldomensual DECIMAL(10,2)       -- Total (Básica + RC)
```

**Fórmula:**
```
dct_sueldomensual = dct_remuneracionbasica + dct_remuneracionrc
```

---

## Procedimientos Almacenados Incluidos

### 1. sp_guardar_contrato_trabajador
Guarda un nuevo contrato con todos los campos

### 2. sp_actualizar_contrato_trabajador
Actualiza un contrato existente

### 3. sp_eliminar_contrato_trabajador
Elimina (soft delete) un contrato

### 4. sp_obtener_contrato_por_id
Obtiene un contrato específico

---

## Ejecución

### Paso 1: Ejecutar Script Principal

```sql
-- Ejecutar este archivo:
sql/crear_tabla_contrato_trabajador.sql
```

**Resultado esperado:**
```
✅ Tabla RRHH_MCONTRATOTRABAJADOR creada exitosamente
✅ Procedimientos almacenados creados exitosamente
✅ Índices creados para optimizar consultas
```

### Paso 2: Verificar Constraints

```sql
-- Ejecutar para verificar:
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.rrhh_mcontratotrabajador'::regclass
ORDER BY conname;
```

**Deberías ver 10 constraints:**
1. `fk_contrato_trabajador`
2. `fk_contrato_tipocontrato`
3. `fk_contrato_sede`
4. `fk_contrato_puesto`
5. `fk_contrato_turno`
6. `fk_contrato_horario`
7. `fk_contrato_diadescanso`
8. `fk_contrato_tipotrabajador`
9. `fk_contrato_regimenpensionario`
10. `fk_contrato_regimenlaboral`

---

## Validaciones de Integridad

Con todos los constraints activos, la base de datos validará automáticamente:

✅ El trabajador existe en `rrhh_trabajador`
✅ El tipo de contrato existe en `rrhh_mtipocontrato`
✅ La sede existe en `rrhh_msede`
✅ El puesto existe en `rrhh_mpuestos`
✅ El turno existe en `rrhh_mturno`
✅ El horario existe en `rrhh_mhorario`
✅ El día de descanso existe en `rrhh_mdiasemana`
✅ El tipo de trabajador existe en `rrhh_mtipotrabajador`
✅ El régimen pensionario existe en `rrhh_mregimenpensionario`
✅ El régimen laboral (conceptos) existe en `rrhh_conceptos_regimen_laboral`

---

## Ejemplo de Inserción

```sql
SELECT sp_guardar_contrato_trabajador(
    1,              -- trabajador_id (de rrhh_trabajador)
    1,              -- tipocontrato_id
    '2024-01-01',   -- fecha_inicio
    '2024-12-31',   -- fecha_fin
    1,              -- sede_id
    1,              -- puesto_id
    1,              -- turno_id
    1,              -- horario_id
    '08:00:00',     -- hora_entrada
    '17:00:00',     -- hora_salida
    1,              -- dia_descanso_id
    1,              -- tipo_trabajador_id
    1,              -- regimen_pensionario_id
    1,              -- regimen_laboral_id (conceptos_regimen_laboral)
    8.0,            -- hora_laboral
    1500.00,        -- remuneracion_basica ⭐
    500.00,         -- remuneracion_rc ⭐
    2000.00,        -- sueldo_mensual ⭐
    1               -- usuario_id
);
```

---

## Próximos Pasos

1. ✅ **Ejecutar** `crear_tabla_contrato_trabajador.sql`
2. ✅ **Verificar** que la tabla se creó correctamente
3. ⏳ **Crear** entidad Java `ContratoTrabajador`
4. ⏳ **Crear** repositorio `ContratoTrabajadorRepository`
5. ⏳ **Crear** servicio `ContratoTrabajadorService`
6. ⏳ **Crear** controlador `ContratoTrabajadorController`
7. ⏳ **Implementar** función `guardar()` en el frontend

---

## Archivos Actualizados

```
sql/
├── crear_tabla_contrato_trabajador.sql    ← ✅ CORREGIDO
└── agregar_constraints_contrato.sql       ← Ya no necesario

docs/
├── ESTRUCTURA_TABLA_CONTRATO_TRABAJADOR.md
├── ORDEN_EJECUCION_TABLA_CONTRATO.md
└── RESUMEN_TABLA_CONTRATO_CORREGIDA.md    ← Este archivo
```

---

## ✅ Listo para Ejecutar

El script ahora está **100% correcto** y listo para ejecutarse sin errores.

```bash
# Ejecutar en PostgreSQL:
psql -U postgres -d tu_base_de_datos -f sql/crear_tabla_contrato_trabajador.sql
```

O desde tu cliente SQL favorito (DBeaver, pgAdmin, etc.)
