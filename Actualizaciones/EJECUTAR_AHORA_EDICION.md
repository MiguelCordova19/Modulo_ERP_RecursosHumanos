# 🚨 EJECUTAR AHORA - Actualización para Edición de Conceptos Variables

## ❌ Error Actual
```
Error al obtener detalle: PreparedStatementCallback; 
bad SQL grammar [SELECT * FROM public.sp_obtener_detalle_conceptos_variables(?)]
```

## 🔧 Solución

La función `sp_obtener_detalle_conceptos_variables` existe pero **no devuelve todos los campos necesarios** para la edición.

---

## 📝 Pasos para Corregir

### 1. **Ejecutar el Script SQL**

Abre tu cliente de PostgreSQL (pgAdmin, DBeaver, psql, etc.) y ejecuta el archivo:

```
sql/actualizar_funcion_detalle_conceptos_variables.sql
```

O copia y pega este código directamente:

```sql
-- Eliminar función anterior
DROP FUNCTION IF EXISTS public.sp_obtener_detalle_conceptos_variables(BIGINT);

-- Crear función actualizada
CREATE OR REPLACE FUNCTION public.sp_obtener_detalle_conceptos_variables(
    p_cabecera_id BIGINT
) RETURNS TABLE (
    id BIGINT,
    anio INTEGER,
    mes INTEGER,
    planilla_id BIGINT,
    concepto_id BIGINT,
    concepto VARCHAR,
    trabajador_id BIGINT,
    numero_documento VARCHAR,
    trabajador VARCHAR,
    fecha DATE,
    valor DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cvd.imconceptosvariablesdetalle_id,
        cv.icv_anio,
        cv.icv_mes,
        cv.icv_tipoplanilla,
        cv.icv_conceptos,
        c.tc_descripcion,
        cvd.icvd_trabajador,
        t.tt_nrodoc,
        CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres),
        cvd.fcvd_fecha,
        cvd.dcvd_valor
    FROM public.rrhh_mconceptosvariablesdetalle cvd
    INNER JOIN public.rrhh_mconceptosvariables cv ON cvd.icvd_conceptosvariables = cv.imconceptosvariables_id
    INNER JOIN public.rrhh_trabajador t ON cvd.icvd_trabajador = t.itrabajador_id
    INNER JOIN public.rrhh_mconceptos c ON cv.icv_conceptos = c.imconceptos_id
    WHERE cvd.icvd_conceptosvariables = p_cabecera_id
    AND cvd.icvd_estado = 1
    ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres;
END;
$$ LANGUAGE plpgsql;
```

### 2. **Verificar que se Ejecutó Correctamente**

Ejecuta esta consulta para verificar:

```sql
-- Verificar estructura de la función
SELECT 
    proname as nombre_funcion,
    pg_get_function_result(oid) as tipo_retorno
FROM pg_proc 
WHERE proname = 'sp_obtener_detalle_conceptos_variables';
```

Deberías ver algo como:
```
nombre_funcion: sp_obtener_detalle_conceptos_variables
tipo_retorno: TABLE(id bigint, anio integer, mes integer, planilla_id bigint, concepto_id bigint, concepto character varying, trabajador_id bigint, numero_documento character varying, trabajador character varying, fecha date, valor numeric)
```

### 3. **Reiniciar el Backend**

Después de ejecutar el script SQL:

```bash
cd backend
# Detener el backend (Ctrl+C)
# Reiniciar
mvn spring-boot:run
```

### 4. **Probar la Edición**

1. Abre el módulo de Conceptos Variables
2. Haz clic en el botón **Editar** (amarillo) de cualquier registro
3. El modal debería abrirse con todos los datos cargados

---

## 📊 Diferencia entre Función Anterior y Nueva

### ❌ Función Anterior (Incompleta)
```sql
RETURNS TABLE (
    detalle_id BIGINT,
    trabajador_id BIGINT,
    numero_documento VARCHAR,
    nombre_completo VARCHAR,
    fecha DATE,
    valor DECIMAL
)
```
**Problema**: Solo devuelve datos del detalle, falta información de la cabecera (año, mes, planilla, concepto).

### ✅ Función Nueva (Completa)
```sql
RETURNS TABLE (
    id BIGINT,
    anio INTEGER,              -- ✅ NUEVO
    mes INTEGER,               -- ✅ NUEVO
    planilla_id BIGINT,        -- ✅ NUEVO
    concepto_id BIGINT,        -- ✅ NUEVO
    concepto VARCHAR,          -- ✅ NUEVO
    trabajador_id BIGINT,
    numero_documento VARCHAR,
    trabajador VARCHAR,
    fecha DATE,
    valor DECIMAL
)
```
**Solución**: Devuelve toda la información necesaria para cargar el modal de edición.

---

## 🎯 Qué Hace la Nueva Función

La función actualizada:

1. ✅ Obtiene el detalle de cada trabajador
2. ✅ Hace JOIN con la cabecera para obtener año, mes, planilla
3. ✅ Hace JOIN con conceptos para obtener el nombre del concepto
4. ✅ Hace JOIN con trabajadores para obtener nombre completo
5. ✅ Devuelve TODO lo necesario para editar

---

## 🔍 Ejemplo de Respuesta

Antes de ejecutar el script, la función devolvía:
```json
{
  "detalle_id": 1,
  "trabajador_id": 10,
  "numero_documento": "12345678",
  "nombre_completo": "Juan Pérez",
  "fecha": "2025-01-15",
  "valor": 500.00
}
```

Después de ejecutar el script, devuelve:
```json
{
  "id": 1,
  "anio": 2025,              // ✅ NUEVO
  "mes": 1,                  // ✅ NUEVO
  "planilla_id": 1,          // ✅ NUEVO
  "concepto_id": 5,          // ✅ NUEVO
  "concepto": "Bono",        // ✅ NUEVO
  "trabajador_id": 10,
  "numero_documento": "12345678",
  "trabajador": "Juan Pérez",
  "fecha": "2025-01-15",
  "valor": 500.00
}
```

---

## ✅ Checklist

- [ ] Ejecutar script SQL: `sql/actualizar_funcion_detalle_conceptos_variables.sql`
- [ ] Verificar que la función se creó correctamente
- [ ] Reiniciar el backend
- [ ] Probar hacer clic en "Editar" en un concepto variable
- [ ] Verificar que el modal se abre con todos los datos cargados

---

## 🆘 Si Sigue sin Funcionar

Si después de ejecutar el script sigue dando error:

1. **Verificar que la función existe:**
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'sp_obtener_detalle_conceptos_variables';
   ```

2. **Verificar que el backend la está llamando:**
   - Revisar logs del backend
   - Buscar: "sp_obtener_detalle_conceptos_variables"

3. **Verificar que existe un registro para editar:**
   ```sql
   SELECT * FROM rrhh_mconceptosvariables WHERE icv_estado = 1;
   ```

---

## 📌 Resumen

**Problema**: Función SQL incompleta
**Solución**: Actualizar función para devolver campos de cabecera
**Archivo**: `sql/actualizar_funcion_detalle_conceptos_variables.sql`
**Acción**: Ejecutar script SQL y reiniciar backend

¡Una vez ejecutado el script, la edición funcionará perfectamente! 🎉
