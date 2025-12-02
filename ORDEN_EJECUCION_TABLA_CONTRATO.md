# 📋 Orden de Ejecución - Tabla Contrato Trabajador

## ⚠️ Problema Detectado

Al intentar crear la tabla `RRHH_MCONTRATOTRABAJADOR`, se encontró que algunas tablas referenciadas no existen aún:

- ❌ `rrhh_mtrabajador` - No existe
- ❌ `rrhh_msede` - No existe  
- ❌ `rrhh_mpuestos` - No existe
- ❌ `rrhh_mturno` - No existe
- ❌ `rrhh_mhorario` - No existe
- ❌ `rrhh_mdiasemana` - No existe

## ✅ Solución Implementada

Se ha modificado el script `crear_tabla_contrato_trabajador.sql` para:

1. **Crear la tabla SIN los constraints de tablas faltantes**
2. **Mantener solo los constraints de tablas existentes**:
   - ✅ `rrhh_mtipocontrato`
   - ✅ `rrhh_mtipotrabajador`
   - ✅ `rrhh_mregimenpensionario`
   - ✅ `rrhh_conceptos_regimen_laboral`

3. **Comentar el SP que hace JOIN con tablas faltantes**

---

## 📝 Orden de Ejecución

### Paso 1: Ejecutar Script Principal (AHORA)

```sql
-- Ejecutar este archivo:
sql/crear_tabla_contrato_trabajador.sql
```

**Resultado:**
- ✅ Crea la tabla `rrhh_mcontratotrabajador`
- ✅ Crea índices
- ✅ Crea procedimientos almacenados básicos:
  - `sp_guardar_contrato_trabajador`
  - `sp_actualizar_contrato_trabajador`
  - `sp_eliminar_contrato_trabajador`
  - `sp_obtener_contrato_por_id`

---

### Paso 2: Crear Tablas Faltantes (DESPUÉS)

Necesitas crear estas tablas antes de agregar los constraints:

#### 2.1. Tabla de Trabajadores
```sql
CREATE TABLE public.rrhh_mtrabajador (
    imtrabajador_id BIGSERIAL PRIMARY KEY,
    tt_numerodocumento VARCHAR(20),
    tt_apellidopaterno VARCHAR(100),
    tt_apellidomaterno VARCHAR(100),
    tt_nombres VARCHAR(100),
    -- ... otros campos
);
```

#### 2.2. Tabla de Sedes
```sql
CREATE TABLE public.rrhh_msede (
    imsede_id BIGSERIAL PRIMARY KEY,
    ts_descripcion VARCHAR(200),
    -- ... otros campos
);
```

#### 2.3. Tabla de Puestos
```sql
CREATE TABLE public.rrhh_mpuestos (
    impuestos_id INTEGER PRIMARY KEY,
    tp_descripcion VARCHAR(200),
    -- ... otros campos
);
```

#### 2.4. Tabla de Turnos
```sql
CREATE TABLE public.rrhh_mturno (
    imturno_id INTEGER PRIMARY KEY,
    ttu_descripcion VARCHAR(100),
    -- ... otros campos
);
```

#### 2.5. Tabla de Horarios
```sql
CREATE TABLE public.rrhh_mhorario (
    imhorario_id INTEGER PRIMARY KEY,
    th_descripcion VARCHAR(100),
    -- ... otros campos
);
```

#### 2.6. Tabla de Días de la Semana
```sql
CREATE TABLE public.rrhh_mdiasemana (
    imdiasemana_id INTEGER PRIMARY KEY,
    tds_descripcion VARCHAR(50),
    -- ... otros campos
);
```

---

### Paso 3: Agregar Constraints (DESPUÉS DE CREAR TABLAS)

```sql
-- Ejecutar este archivo:
sql/agregar_constraints_contrato.sql
```

**Descomenta y ejecuta los ALTER TABLE** para agregar los constraints de las tablas que ya existan.

---

## 🔍 Verificar Tablas Existentes

Antes de ejecutar, verifica qué tablas ya existen:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name LIKE 'rrhh_m%'
ORDER BY table_name;
```

---

## 📊 Estado Actual de Constraints

### Constraints Activos (✅)

```sql
-- Tipo Contrato
CONSTRAINT fk_contrato_tipocontrato 
    FOREIGN KEY (ict_tipocontrato) 
    REFERENCES rrhh_mtipocontrato(imtipocontrato_id)

-- Tipo Trabajador
CONSTRAINT fk_contrato_tipotrabajador 
    FOREIGN KEY (ict_tipotrabajador) 
    REFERENCES rrhh_mtipotrabajador(imtipotrabajador_id)

-- Régimen Pensionario
CONSTRAINT fk_contrato_regimenpensionario 
    FOREIGN KEY (ict_regimenpensionario) 
    REFERENCES rrhh_mregimenpensionario(imregimenpensionario_id)

-- Régimen Laboral (Conceptos)
CONSTRAINT fk_contrato_regimenlaboral 
    FOREIGN KEY (ict_regimenlaboral) 
    REFERENCES rrhh_conceptos_regimen_laboral(imconceptosregimen_id)
```

### Constraints Pendientes (⏳)

```sql
-- Trabajador (comentado)
-- CONSTRAINT fk_contrato_trabajador 
--     FOREIGN KEY (ict_trabajador) 
--     REFERENCES rrhh_mtrabajador(imtrabajador_id)

-- Sede (comentado)
-- CONSTRAINT fk_contrato_sede 
--     FOREIGN KEY (ict_sede) 
--     REFERENCES rrhh_msede(imsede_id)

-- Puesto (comentado)
-- CONSTRAINT fk_contrato_puesto 
--     FOREIGN KEY (ict_puesto) 
--     REFERENCES rrhh_mpuestos(impuestos_id)

-- Turno (comentado)
-- CONSTRAINT fk_contrato_turno 
--     FOREIGN KEY (ict_turno) 
--     REFERENCES rrhh_mturno(imturno_id)

-- Horario (comentado)
-- CONSTRAINT fk_contrato_horario 
--     FOREIGN KEY (ict_horario) 
--     REFERENCES rrhh_mhorario(imhorario_id)

-- Día Descanso (comentado)
-- CONSTRAINT fk_contrato_diadescanso 
--     FOREIGN KEY (ict_diadescanso) 
--     REFERENCES rrhh_mdiasemana(imdiasemana_id)
```

---

## ⚠️ Importante

### Mientras no existan las tablas:

1. ✅ **Puedes crear contratos** usando IDs numéricos
2. ⚠️ **NO hay validación de integridad referencial** para:
   - Trabajador
   - Sede
   - Puesto
   - Turno
   - Horario
   - Día Descanso

3. ⚠️ **Debes validar en el backend** que los IDs existan antes de guardar

### Ejemplo de validación en backend:

```java
// Validar que el trabajador existe
if (!trabajadorRepository.existsById(contratoDTO.getTrabajadorId())) {
    throw new EntityNotFoundException("Trabajador no encontrado");
}

// Validar que la sede existe
if (!sedeRepository.existsById(contratoDTO.getSedeId())) {
    throw new EntityNotFoundException("Sede no encontrada");
}

// ... validar otros campos
```

---

## 🎯 Resumen

| Paso | Acción | Estado |
|------|--------|--------|
| 1 | Ejecutar `crear_tabla_contrato_trabajador.sql` | ✅ LISTO |
| 2 | Crear tablas faltantes | ⏳ PENDIENTE |
| 3 | Ejecutar `agregar_constraints_contrato.sql` | ⏳ PENDIENTE |
| 4 | Descomentar SP `sp_listar_contratos_por_sede` | ⏳ PENDIENTE |

---

## 📁 Archivos Creados

```
sql/
├── crear_tabla_contrato_trabajador.sql    ← Ejecutar AHORA
└── agregar_constraints_contrato.sql       ← Ejecutar DESPUÉS

docs/
├── ESTRUCTURA_TABLA_CONTRATO_TRABAJADOR.md
└── ORDEN_EJECUCION_TABLA_CONTRATO.md     ← Este archivo
```

---

## ✅ Próximos Pasos

1. **Ejecuta** `crear_tabla_contrato_trabajador.sql`
2. **Verifica** que la tabla se creó correctamente:
   ```sql
   \d rrhh_mcontratotrabajador
   ```
3. **Crea** las tablas faltantes (trabajador, sede, puesto, etc.)
4. **Ejecuta** `agregar_constraints_contrato.sql` (descomentando los ALTER TABLE)
5. **Implementa** el backend (Entity, Repository, Service, Controller)
6. **Implementa** el frontend (función guardar())
