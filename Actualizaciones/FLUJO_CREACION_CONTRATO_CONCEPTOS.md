# 📋 Flujo de Creación de Contrato con Conceptos

## 🎯 Descripción del Flujo

Cuando un usuario crea un nuevo contrato, el sistema automáticamente:

1. **Guarda el contrato** en la base de datos
2. **Abre el modal de conceptos** automáticamente
3. **Pre-carga los conceptos** del régimen laboral seleccionado
4. **Permite editar** los valores antes de guardar
5. **Guarda los conceptos** en la tabla `rrhh_mconceptostrabajador`

## 🔄 Flujo Paso a Paso

### 1. Usuario Crea Contrato

```
Usuario llena formulario de contrato
  ↓
Selecciona régimen laboral (ej: "01 - Régimen General")
  ↓
Hace clic en "Guardar"
```

**Código:**
```javascript
// frontend/js/modules/contrato.js - función guardar()
const datos = {
    trabajadorId: ...,
    regimenLaboralId: ..., // ID para guardar en BD
    ...
};

// Enviar al backend
const response = await fetch('/api/contratos', {
    method: 'POST',
    body: JSON.stringify(datos)
});
```

### 2. Sistema Guarda Contrato

```
Backend recibe datos
  ↓
Ejecuta sp_guardar_contrato_trabajador()
  ↓
Retorna ID del contrato creado
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 123
  }
}
```

### 3. Sistema Abre Modal de Conceptos

```
Frontend recibe respuesta exitosa
  ↓
Detecta que es un nuevo contrato (!esEdicion)
  ↓
Llama a abrirModalConceptosAutomatico()
```

**Código:**
```javascript
if (!esEdicion) {
    const contratoId = result.data.id;
    const regimenLaboralCodigo = $('#regimenLaboral').val(); // Código para buscar conceptos
    
    setTimeout(() => {
        this.abrirModalConceptosAutomatico(
            contratoId, 
            nroDocumento, 
            nombreCompleto, 
            regimenLaboralCodigo, 
            sueldoTotal
        );
    }, 500);
}
```

### 4. Sistema Carga Conceptos del Régimen

```
Modal se abre
  ↓
Llama a cargarConceptosDesdeRegimen()
  ↓
Consulta /api/conceptos-regimen-laboral/{codigo}/conceptos
  ↓
Obtiene conceptos del régimen laboral
```

**Endpoint:**
```
GET /api/conceptos-regimen-laboral/01/conceptos
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "concepto_id": 45,
      "tributo_codigo_sunat": "0121",
      "descripcion": "REMUNERACION BASICA",
      ...
    },
    {
      "concepto_id": 46,
      "tributo_codigo_sunat": "0804",
      "descripcion": "ESSALUD",
      ...
    }
  ]
}
```

### 5. Sistema Pre-llena Valores Inteligentes

```
Por cada concepto:
  ↓
Analiza la descripción
  ↓
Determina tipo, tipo valor y valor sugerido
  ↓
Crea fila en la tabla
```

**Lógica de Pre-llenado:**

| Concepto | Tipo | Tipo Valor | Valor |
|----------|------|------------|-------|
| REMUNERACIÓN BÁSICA | FIJO | MONTO | Sueldo total del contrato |
| ESSALUD | FIJO | PORCENTAJE | 9.00 |
| BONIFICACIÓN 9% | FIJO | PORCENTAJE | 9.00 |
| AFP/ONP | FIJO | PORCENTAJE | 0.00 (usuario debe completar) |
| GRATIFICACIÓN/CTS | FIJO | MONTO | 0.00 |
| Otros | VARIABLE | - | 0.00 |

**Código:**
```javascript
if (descripcionUpper.includes('REMUNERACIÓN') && descripcionUpper.includes('BÁSICA')) {
    tipo = 'FIJO';
    tipoValor = 'MONTO';
    valorInput = sueldoTotal || '0.00';
} else if (descripcionUpper.includes('ESSALUD')) {
    tipo = 'FIJO';
    tipoValor = 'PORCENTAJE';
    valorInput = '9.00';
}
// ... más lógica
```

### 6. Usuario Revisa y Edita

```
Usuario ve tabla con conceptos pre-cargados
  ↓
Puede:
  - Cambiar tipo (VARIABLE/FIJO)
  - Cambiar tipo valor (MONTO/PORCENTAJE)
  - Modificar valor
  - Agregar conceptos manualmente
  - Eliminar conceptos
```

**Interfaz:**
```
┌─────────────────────────────────────────────────────┐
│ Conceptos Del Trabajador (Nuevo Contrato)          │
├─────────────────────────────────────────────────────┤
│ ℹ️ Los conceptos se han cargado automáticamente    │
│    Puedes ajustar los valores antes de guardar     │
├─────────────────────────────────────────────────────┤
│ # │ Cod  │ Concepto        │ Tipo │ Tipo Valor │ Valor │
├───┼──────┼─────────────────┼──────┼────────────┼───────┤
│ 1 │ 0121 │ REMUNERACIÓN... │ FIJO │ MONTO      │ 1500  │
│ 2 │ 0804 │ ESSALUD         │ FIJO │ PORCENTAJE │ 9.00  │
│ 3 │ 0118 │ REMUNERACIÓN... │ FIJO │ MONTO      │ 0.00  │
└───┴──────┴─────────────────┴──────┴────────────┴───────┘
```

### 7. Usuario Guarda Conceptos

```
Usuario hace clic en "Guardar"
  ↓
Sistema valida datos
  ↓
Envía a /api/conceptos-trabajador
  ↓
Backend guarda en rrhh_mconceptostrabajador
```

**Validaciones:**
- ✅ Tipo Valor debe estar seleccionado
- ✅ Valor debe ser numérico y >= 0
- ✅ Al menos un concepto debe existir

**Request:**
```json
{
  "contratoId": 123,
  "empresaId": 1,
  "conceptos": [
    {
      "conceptoId": 45,
      "tipo": "FIJO",
      "tipoValor": "MONTO",
      "valor": 1500.00
    },
    {
      "conceptoId": 46,
      "tipo": "FIJO",
      "tipoValor": "PORCENTAJE",
      "valor": 9.00
    }
  ]
}
```

### 8. Sistema Guarda en Base de Datos

```
Backend recibe request
  ↓
Ejecuta sp_guardar_conceptos_trabajador()
  ↓
Elimina conceptos anteriores (soft delete)
  ↓
Inserta nuevos conceptos
  ↓
Retorna éxito
```

**Procedimiento:**
```sql
SELECT public.sp_guardar_conceptos_trabajador(
    123,                    -- contrato_id
    '[{...}]'::TEXT,       -- conceptos_json
    1,                      -- empresa_id
    1                       -- usuario_id
);
```

**Resultado en BD:**
```
rrhh_mconceptostrabajador
┌────┬──────────┬────────────┬──────┬────────────┬────────┬─────────┐
│ id │ contrato │ concepto   │ tipo │ tipo_valor │ valor  │ empresa │
├────┼──────────┼────────────┼──────┼────────────┼────────┼─────────┤
│ 1  │ 123      │ 45         │ 2    │ 1          │ 1500.00│ 1       │
│ 2  │ 123      │ 46         │ 2    │ 2          │ 9.00   │ 1       │
└────┴──────────┴────────────┴──────┴────────────┴────────┴─────────┘
```

### 9. Sistema Confirma y Cierra

```
Frontend recibe respuesta exitosa
  ↓
Muestra notificación "Conceptos guardados exitosamente"
  ↓
Cierra modal
  ↓
Usuario ve tabla de contratos actualizada
```

## 🎨 Elementos de UI

### Título del Modal
- **Nuevo contrato**: "Conceptos Del Trabajador (Nuevo Contrato)"
- **Editar conceptos**: "Conceptos Del Trabajador"

### Mensaje de Ayuda
Solo visible al crear nuevo contrato:
```
ℹ️ Nuevo Contrato: Los conceptos se han cargado automáticamente según 
   el régimen laboral. Puedes ajustar los valores, agregar o eliminar 
   conceptos antes de guardar.
```

### Botones
- **Cancelar**: Cierra modal sin guardar
- **Guardar**: Valida y guarda conceptos en BD

## 🔄 Flujo Alternativo: Editar Conceptos

Si el usuario quiere editar conceptos de un contrato existente:

```
Usuario hace clic en "Modificar conceptos"
  ↓
Sistema abre modal
  ↓
Carga conceptos guardados de rrhh_mconceptostrabajador
  ↓
Usuario edita
  ↓
Usuario guarda
  ↓
Sistema actualiza BD (elimina anteriores, inserta nuevos)
```

## 📊 Diagrama de Flujo

```
┌─────────────────┐
│ Crear Contrato  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Guardar en BD   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Abrir Modal Conceptos   │
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Cargar Conceptos Régimen │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────┐
│ Pre-llenar Valores   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Usuario Revisa/Edita │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Usuario Guarda       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Guardar en BD        │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Confirmar y Cerrar   │
└──────────────────────┘
```

## 🎯 Ventajas de Este Flujo

1. **Automatización**: Los conceptos se cargan automáticamente
2. **Flexibilidad**: El usuario puede ajustar valores antes de guardar
3. **Validación**: Se validan los datos antes de guardar en BD
4. **Experiencia**: Flujo continuo sin interrupciones
5. **Eficiencia**: Pre-llenado inteligente ahorra tiempo

## 🔧 Archivos Involucrados

### Frontend
- `frontend/modules/contrato.html` - Modal de conceptos
- `frontend/js/modules/contrato.js` - Lógica del flujo

### Backend
- `ConceptoTrabajadorController.java` - Endpoints REST
- `ConceptoTrabajadorService.java` - Lógica de negocio
- `ConceptoTrabajador.java` - Entidad

### Base de Datos
- `rrhh_mconceptostrabajador` - Tabla de conceptos
- `sp_guardar_conceptos_trabajador()` - Procedimiento almacenado
- `sp_obtener_conceptos_trabajador()` - Procedimiento almacenado

## 📝 Notas Importantes

1. **No se guarda automáticamente**: El usuario debe hacer clic en "Guardar"
2. **Puede cancelar**: Si cierra el modal sin guardar, no se guardan conceptos
3. **Puede editar después**: Puede usar "Modificar conceptos" más tarde
4. **Pre-llenado inteligente**: Los valores son sugerencias, no obligatorios
5. **Validaciones**: El sistema valida antes de guardar

---

**Fecha**: 2025-12-02
**Versión**: 1.0
