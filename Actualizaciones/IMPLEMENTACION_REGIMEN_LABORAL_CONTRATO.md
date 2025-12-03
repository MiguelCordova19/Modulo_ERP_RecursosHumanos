# Implementación de Régimen Laboral en Módulo de Contrato

## Resumen

Se ha implementado la carga dinámica del combobox de **Régimen Laboral** en el módulo de contrato, mostrando **SOLO** los regímenes que tienen conceptos asignados en la tabla `RRHH_CONCEPTOS_REGIMEN_LABORAL`.

---

## Cambios Realizados

### 1. Frontend - JavaScript (contrato.js)

#### Función `cargarRegimenesLaborales()`
```javascript
- Endpoint: GET /api/conceptos-regimen-laboral/regimenes-activos?empresaId={empresaId}
- Filtra por empresa
- Muestra SOLO regímenes con conceptos asignados
- Formato: {codSunat} - {regimenLaboral}
- Ejemplo: "01 - RÉGIMEN GENERAL"
- Guarda en data attributes:
  * data-codigo: Código SUNAT
  * data-nombre: Nombre del régimen
  * data-descripcion: Descripción completa
```

#### Evento onChange
```javascript
- Detecta cuando se selecciona un régimen laboral
- Muestra en consola:
  * ID del régimen
  * Código SUNAT
  * Nombre del régimen
  * Descripción completa
```

---

## Estructura de Datos

### Tablas Involucradas

#### 1. RRHH_CONCEPTOS_REGIMEN_LABORAL (Cabecera)
```sql
CREATE TABLE rrhh_conceptos_regimen_laboral (
    imconceptosregimen_id BIGSERIAL PRIMARY KEY,
    ic_regimenlaboral VARCHAR(2) NOT NULL,      -- FK a rrhh_regimenlaboral
    ic_empresa INTEGER NOT NULL,
    ic_estado INTEGER DEFAULT 1,
    ic_usuarioregistro BIGINT,
    fc_fecharegistro TIMESTAMP,
    ic_usuarioedito BIGINT,
    fc_fechaedito TIMESTAMP
);
```

#### 2. RRHH_CONCEPTOS_REGIMEN_DETALLE (Detalles)
```sql
CREATE TABLE rrhh_conceptos_regimen_detalle (
    imconceptosregimendetalle_id BIGSERIAL PRIMARY KEY,
    ic_conceptosregimen_id BIGINT NOT NULL,     -- FK a cabecera
    ic_concepto_id BIGINT NOT NULL,             -- FK a rrhh_mconceptos
    ic_estado INTEGER DEFAULT 1,
    fc_fecharegistro TIMESTAMP
);
```

#### 3. RRHH_REGIMENLABORAL (Maestro)
```sql
CREATE TABLE rrhh_regimenlaboral (
    imregimenlaboral_id INTEGER PRIMARY KEY,
    trl_codsunat VARCHAR(2),                    -- Código SUNAT
    trl_regimenlaboral VARCHAR(100),            -- Nombre
    trl_descripcion VARCHAR(200),               -- Descripción
    estado INTEGER DEFAULT 1
);
```

---

## Query del Backend

### Método: `listarRegimenesConConceptos()`

```sql
SELECT DISTINCT
    rl.imregimenlaboral_id as id,
    rl.trl_codsunat as codSunat,
    rl.trl_regimenlaboral as regimenLaboral,
    rl.trl_descripcion as descripcion
FROM rrhh_conceptos_regimen_laboral cr
INNER JOIN rrhh_regimenlaboral rl 
    ON cr.ic_regimenlaboral = rl.imregimenlaboral_id
WHERE cr.ic_empresa = ? 
    AND cr.ic_estado = 1 
    AND rl.estado = 1
ORDER BY rl.trl_codsunat
```

**Características:**
- ✅ Solo regímenes con conceptos asignados
- ✅ Filtrado por empresa
- ✅ Solo registros activos (estado = 1)
- ✅ Ordenado por código SUNAT

---

## Respuesta del API

### Endpoint
```
GET /api/conceptos-regimen-laboral/regimenes-activos?empresaId=1
```

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Regímenes laborales con conceptos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "codsunat": "01",
      "regimenlaboral": "RÉGIMEN GENERAL",
      "descripcion": "Régimen General de la Ley N° 728"
    },
    {
      "id": 2,
      "codsunat": "02",
      "regimenlaboral": "RÉGIMEN AGRARIO",
      "descripcion": "Régimen Agrario Ley N° 27360"
    }
  ]
}
```

### Respuesta Sin Datos
```json
{
  "success": true,
  "message": "Regímenes laborales con conceptos obtenidos exitosamente",
  "data": []
}
```

---

## Comportamiento en el Frontend

### Caso 1: Hay Regímenes con Conceptos
```
1. Usuario abre modal "Nuevo Contrato"
2. Sistema carga regímenes laborales
3. Combobox muestra:
   - "01 - RÉGIMEN GENERAL"
   - "02 - RÉGIMEN AGRARIO"
4. Usuario selecciona un régimen
5. Sistema muestra en consola los datos
```

### Caso 2: No Hay Regímenes con Conceptos
```
1. Usuario abre modal "Nuevo Contrato"
2. Sistema intenta cargar regímenes
3. Backend devuelve data: []
4. Combobox muestra:
   - "No hay regímenes configurados"
5. Campo queda deshabilitado
```

---

## Ejemplo de Uso en JavaScript

### Obtener Régimen Laboral Seleccionado

```javascript
// Obtener ID del régimen laboral
const regimenLaboralId = $('#regimenLaboral').val();

// Obtener datos adicionales
const selectedOption = $('#regimenLaboral').find('option:selected');
const codigo = selectedOption.attr('data-codigo');
const nombre = selectedOption.attr('data-nombre');
const descripcion = selectedOption.attr('data-descripcion');

console.log('Régimen Laboral:', {
    id: regimenLaboralId,
    codigo: codigo,
    nombre: nombre,
    descripcion: descripcion
});
```

### Al Guardar Contrato

```javascript
guardar: function() {
    const datos = {
        trabajadorId: $('#trabajadorId').val(),
        tipoContratoId: $('#tipoContrato').val(),
        tipoTrabajadorId: $('#tipoTrabajador').val(),
        regimenPensionarioId: $('#regimenPensionario').val(),
        regimenLaboralId: $('#regimenLaboral').val(),  // ← ID del régimen
        // ... otros campos
    };
    
    // Validar que se haya seleccionado un régimen
    if (!datos.regimenLaboralId) {
        showNotification('Debe seleccionar un régimen laboral', 'warning');
        return;
    }
    
    // Enviar al backend...
}
```

---

## Validaciones

### Frontend
```javascript
// Validar que haya regímenes disponibles
if (result.data && result.data.length > 0) {
    // Cargar regímenes
} else {
    // Mostrar mensaje de advertencia
    console.warn('⚠️ No hay regímenes laborales con conceptos asignados');
}
```

### Backend
```java
// Validar que el régimen tenga conceptos
@GetMapping("/regimenes-activos")
public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listarRegimenesActivos(
        @RequestParam Integer empresaId) {
    try {
        List<Map<String, Object>> regimenes = 
            conceptoRegimenLaboralService.listarRegimenesConConceptos(empresaId);
        
        if (regimenes.isEmpty()) {
            return ResponseEntity.ok(
                ApiResponse.success("No hay regímenes con conceptos configurados", regimenes)
            );
        }
        
        return ResponseEntity.ok(
            ApiResponse.success("Regímenes obtenidos exitosamente", regimenes)
        );
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("Error: " + e.getMessage()));
    }
}
```

---

## Relación con Conceptos

### ¿Por qué solo regímenes con conceptos?

Cada régimen laboral debe tener conceptos (ingresos, descuentos, aportes) configurados para poder calcular la planilla correctamente.

**Ejemplo:**
```
Régimen General (01):
  - Conceptos de Ingreso: Sueldo Básico, Asignación Familiar
  - Conceptos de Descuento: ONP, AFP, Impuesto a la Renta
  - Conceptos de Aporte: EsSalud, SCTR

Régimen Agrario (02):
  - Conceptos de Ingreso: Jornal Diario
  - Conceptos de Descuento: ONP, AFP
  - Conceptos de Aporte: EsSalud Agrario
```

Si un régimen no tiene conceptos configurados, no se puede calcular la planilla, por lo tanto **no debe aparecer** en el combobox.

---

## Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│  1. Administrador configura conceptos por régimen laboral  │
│     (Módulo: Conceptos Régimen Laboral)                    │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  2. Sistema guarda en RRHH_CONCEPTOS_REGIMEN_LABORAL       │
│     - Cabecera: Régimen + Empresa                          │
│     - Detalles: Lista de conceptos                         │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  3. Usuario crea contrato (Módulo: Contrato)              │
│     - Selecciona trabajador                                │
│     - Selecciona tipo trabajador                           │
│     - Selecciona régimen laboral ← SOLO los configurados  │
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│  4. Sistema puede calcular planilla correctamente          │
│     - Usa conceptos del régimen seleccionado               │
│     - Aplica cálculos según configuración                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing

### Test 1: Cargar Regímenes con Conceptos
```bash
1. Configurar conceptos para "Régimen General"
2. Abrir modal "Nuevo Contrato"
3. Verificar que aparezca "01 - RÉGIMEN GENERAL" ✅
```

### Test 2: No Mostrar Regímenes sin Conceptos
```bash
1. Crear régimen "Régimen Especial" sin conceptos
2. Abrir modal "Nuevo Contrato"
3. Verificar que NO aparezca "Régimen Especial" ✅
```

### Test 3: Filtrado por Empresa
```bash
1. Configurar conceptos para Empresa 1
2. Cambiar a Empresa 2
3. Abrir modal "Nuevo Contrato"
4. Verificar que solo aparezcan regímenes de Empresa 2 ✅
```

---

## Logs en Consola

```javascript
// Al cargar regímenes
✅ Regímenes laborales con conceptos cargados: 2

// Al seleccionar régimen
Régimen Laboral seleccionado: {
    id: "1",
    codigo: "01",
    nombre: "RÉGIMEN GENERAL",
    descripcion: "Régimen General de la Ley N° 728"
}

// Si no hay regímenes
⚠️ No hay regímenes laborales con conceptos asignados
```

---

## Ventajas de esta Implementación

1. ✅ **Prevención de Errores**: No permite seleccionar regímenes sin conceptos
2. ✅ **Integridad de Datos**: Garantiza que se pueda calcular la planilla
3. ✅ **Experiencia de Usuario**: Solo muestra opciones válidas
4. ✅ **Filtrado por Empresa**: Cada empresa ve sus propios regímenes
5. ✅ **Mantenibilidad**: Fácil agregar nuevos regímenes con conceptos

---

## Próximos Pasos

- ✅ **Completado**: Cargar Régimen Laboral con conceptos
- ⏳ **Pendiente**: Implementar función `guardar()` del contrato
- ⏳ **Pendiente**: Validar que todos los campos requeridos estén completos
- ⏳ **Pendiente**: Implementar cálculos de planilla según régimen

---

## Notas Técnicas

- El endpoint ya existía en el backend
- Se usa INNER JOIN para filtrar solo regímenes con conceptos
- El filtrado por empresa es automático
- Los data attributes permiten acceso rápido a información relacionada
- Se incluyen logs en consola para debugging
