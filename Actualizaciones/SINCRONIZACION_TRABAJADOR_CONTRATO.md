# 🔄 Sincronización Automática: Trabajador ↔ Contrato

## Descripción

Cuando se guarda o actualiza un contrato, los datos relevantes se copian automáticamente a la tabla `rrhh_trabajador` para mantener la información sincronizada.

---

## Campos que se Sincronizan

| Campo en Contrato | Campo en Trabajador | Descripción |
|-------------------|---------------------|-------------|
| `ict_sede` | `it_sede` | Sede del trabajador |
| `ict_puesto` | `it_puesto` | Puesto del trabajador |
| `ict_turno` | `it_turno` | Turno de trabajo |
| `ict_horario` | `it_horario` | Horario de trabajo |
| `ict_diadescanso` | `it_diadescanso` | Día de descanso |
| `hct_horaentrada` | `tt_horaentrada` | Hora de entrada |
| `hct_horasalida` | `tt_horasalida` | Hora de salida |
| `ict_regimenpensionario` | `it_regimenpensionario` | Régimen pensionario (código) |
| `tct_cuspp` | `tt_cuspp` | Código CUSPP (AFP) |

---

## Flujo de Sincronización

```
┌─────────────────────────────────────────────────────────────┐
│  1. Usuario guarda contrato en el frontend                 │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  2. Backend llama a sp_guardar_contrato_trabajador()       │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  3. Se inserta el registro en rrhh_mcontratotrabajador     │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  4. Se obtiene el código del régimen pensionario           │
│     (convierte ID a código SUNAT)                           │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  5. Se llama a sp_actualizar_trabajador_desde_contrato()   │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  6. Se actualizan los campos en rrhh_trabajador            │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  7. Se retorna el ID del contrato creado                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Procedimientos Almacenados

### 1. sp_actualizar_trabajador_desde_contrato

**Propósito**: Actualizar los campos del trabajador con datos del contrato

**Parámetros**:
```sql
p_trabajador_id BIGINT,
p_sede_id INTEGER,
p_puesto_id INTEGER,
p_turno_id VARCHAR(2),
p_horario_id VARCHAR(2),
p_dia_descanso_id VARCHAR(2),
p_hora_entrada TIME,
p_hora_salida TIME,
p_regimen_pensionario_id VARCHAR(2),  -- Código SUNAT
p_cuspp VARCHAR(20)
```

**Retorna**: `BOOLEAN` (true si se actualizó correctamente)

**Query**:
```sql
UPDATE rrhh_trabajador
SET 
    it_sede = p_sede_id,
    it_puesto = p_puesto_id,
    it_turno = p_turno_id,
    it_horario = p_horario_id,
    it_diadescanso = p_dia_descanso_id,
    tt_horaentrada = p_hora_entrada,
    tt_horasalida = p_hora_salida,
    it_regimenpensionario = p_regimen_pensionario_id,
    tt_cuspp = p_cuspp,
    it_usuarioedito = 1,
    ft_fechaedito = CURRENT_TIMESTAMP
WHERE itrabajador_id = p_trabajador_id;
```

---

### 2. sp_guardar_contrato_trabajador (Actualizado)

**Cambios**:
1. Inserta el contrato en `rrhh_mcontratotrabajador`
2. Obtiene el código SUNAT del régimen pensionario
3. Llama a `sp_actualizar_trabajador_desde_contrato()`
4. Retorna el ID del contrato creado

**Código adicional**:
```sql
-- Obtener el código del régimen pensionario
SELECT trp_codsunat INTO v_regimen_codigo
FROM rrhh_mregimenpensionario
WHERE imregimenpensionario_id = p_regimen_pensionario_id;

-- Actualizar el trabajador
v_actualizado := sp_actualizar_trabajador_desde_contrato(
    p_trabajador_id,
    p_sede_id::INTEGER,
    p_puesto_id,
    p_turno_id,
    p_horario_id,
    p_dia_descanso_id,
    p_hora_entrada,
    p_hora_salida,
    v_regimen_codigo,
    p_cuspp
);
```

---

### 3. sp_actualizar_contrato_trabajador (Actualizado)

**Cambios**:
1. Actualiza el contrato en `rrhh_mcontratotrabajador`
2. Obtiene el código SUNAT del régimen pensionario
3. Llama a `sp_actualizar_trabajador_desde_contrato()`
4. Retorna `TRUE` si se actualizó correctamente

---

## Conversión de Régimen Pensionario

### ¿Por qué convertir ID a Código?

La tabla `rrhh_mcontratotrabajador` usa **ID** (INTEGER):
```sql
ict_regimenpensionario INTEGER  -- Ejemplo: 1, 2, 3
```

La tabla `rrhh_trabajador` usa **Código SUNAT** (VARCHAR):
```sql
it_regimenpensionario VARCHAR(2)  -- Ejemplo: '02', '21', '22'
```

### Tabla de Conversión

| ID | Código SUNAT | Descripción |
|----|--------------|-------------|
| 1  | '02'         | ONP |
| 2  | '21'         | INTEGRA |
| 3  | '22'         | PROFUTURO |
| 4  | '23'         | PRIMA |
| 5  | '24'         | HABITAT |

### Query de Conversión

```sql
SELECT trp_codsunat 
FROM rrhh_mregimenpensionario
WHERE imregimenpensionario_id = ?;
```

---

## Ejemplo Completo

### Datos del Contrato
```sql
Trabajador ID: 1
Sede ID: 1
Puesto ID: 1
Turno ID: '01'
Horario ID: '01'
Día Descanso ID: '07'
Hora Entrada: '08:00:00'
Hora Salida: '17:00:00'
Régimen Pensionario ID: 2  -- INTEGRA
CUSPP: '1234567890'
```

### Paso 1: Guardar Contrato
```sql
INSERT INTO rrhh_mcontratotrabajador (
    ict_trabajador,
    ict_sede,
    ict_puesto,
    ict_turno,
    ict_horario,
    ict_diadescanso,
    hct_horaentrada,
    hct_horasalida,
    ict_regimenpensionario,  -- 2
    tct_cuspp
) VALUES (
    1, 1, 1, '01', '01', '07',
    '08:00:00', '17:00:00', 2, '1234567890'
);
```

### Paso 2: Obtener Código del Régimen
```sql
SELECT trp_codsunat FROM rrhh_mregimenpensionario WHERE imregimenpensionario_id = 2;
-- Resultado: '21'
```

### Paso 3: Actualizar Trabajador
```sql
UPDATE rrhh_trabajador
SET 
    it_sede = 1,
    it_puesto = 1,
    it_turno = '01',
    it_horario = '01',
    it_diadescanso = '07',
    tt_horaentrada = '08:00:00',
    tt_horasalida = '17:00:00',
    it_regimenpensionario = '21',  -- Código convertido
    tt_cuspp = '1234567890'
WHERE itrabajador_id = 1;
```

---

## Ventajas de esta Implementación

1. ✅ **Sincronización Automática**: No requiere código adicional en el frontend
2. ✅ **Consistencia de Datos**: Trabajador y contrato siempre tienen la misma información
3. ✅ **Transparente**: El usuario no nota la sincronización
4. ✅ **Auditoría**: Se registra quién y cuándo se actualizó
5. ✅ **Mantenibilidad**: Toda la lógica está en la base de datos

---

## Casos de Uso

### Caso 1: Nuevo Contrato
```
1. Usuario crea contrato para trabajador Juan Pérez
2. Se guarda el contrato con sede Lima, puesto Analista
3. Automáticamente se actualiza Juan Pérez con sede Lima, puesto Analista
4. Juan Pérez ahora tiene la información actualizada
```

### Caso 2: Actualizar Contrato
```
1. Usuario edita contrato de Juan Pérez
2. Cambia sede de Lima a Arequipa
3. Se actualiza el contrato
4. Automáticamente se actualiza Juan Pérez con sede Arequipa
```

### Caso 3: Cambio de Régimen Pensionario
```
1. Usuario cambia régimen de ONP a INTEGRA
2. Se guarda el contrato con régimen ID = 2
3. Se convierte ID 2 a código '21'
4. Se actualiza trabajador con código '21' y CUSPP
```

---

## Verificación

### Verificar que se actualizó el trabajador

```sql
-- Después de guardar un contrato
SELECT 
    t.itrabajador_id,
    t.tt_nombres,
    t.it_sede,
    t.it_puesto,
    t.it_turno,
    t.it_horario,
    t.it_diadescanso,
    t.tt_horaentrada,
    t.tt_horasalida,
    t.it_regimenpensionario,
    t.tt_cuspp
FROM rrhh_trabajador t
WHERE t.itrabajador_id = ?;
```

### Comparar contrato vs trabajador

```sql
SELECT 
    'Contrato' as origen,
    c.ict_sede as sede,
    c.ict_puesto as puesto,
    c.ict_turno as turno,
    c.hct_horaentrada as hora_entrada,
    rp.trp_codsunat as regimen_codigo,
    c.tct_cuspp as cuspp
FROM rrhh_mcontratotrabajador c
LEFT JOIN rrhh_mregimenpensionario rp ON c.ict_regimenpensionario = rp.imregimenpensionario_id
WHERE c.ict_trabajador = ?

UNION ALL

SELECT 
    'Trabajador' as origen,
    t.it_sede::BIGINT as sede,
    t.it_puesto as puesto,
    t.it_turno as turno,
    t.tt_horaentrada as hora_entrada,
    t.it_regimenpensionario as regimen_codigo,
    t.tt_cuspp as cuspp
FROM rrhh_trabajador t
WHERE t.itrabajador_id = ?;

-- Los valores deben ser idénticos
```

---

## Ejecución del Script

```bash
# Ejecutar el script SQL
psql -U postgres -d tu_base_de_datos -f sql/actualizar_trabajador_desde_contrato.sql
```

**Resultado esperado:**
```
DROP FUNCTION
CREATE FUNCTION
DROP FUNCTION
CREATE FUNCTION
DROP FUNCTION
CREATE FUNCTION
NOTICE:  ✅ Procedimiento sp_actualizar_trabajador_desde_contrato creado
NOTICE:  ✅ Procedimiento sp_guardar_contrato_trabajador actualizado
NOTICE:  ✅ Procedimiento sp_actualizar_contrato_trabajador actualizado
NOTICE:  ✅ Ahora al guardar/actualizar un contrato, se actualizará automáticamente el trabajador
```

---

## Notas Importantes

1. **No requiere cambios en el backend Java**: Los procedimientos almacenados manejan todo
2. **No requiere cambios en el frontend**: La sincronización es transparente
3. **Conversión automática de ID a Código**: Se hace en el procedimiento almacenado
4. **Manejo de errores**: Si no se puede actualizar el trabajador, se registra un NOTICE pero no falla la transacción

---

## Próximos Pasos

1. ✅ Ejecutar `sql/actualizar_trabajador_desde_contrato.sql`
2. ✅ Reiniciar el backend (opcional, no hay cambios en Java)
3. ✅ Probar creando un contrato
4. ✅ Verificar que el trabajador se actualizó correctamente

TODO LISTO! 🎉
