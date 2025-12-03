# 🔄 Funcionalidad: Campo "Tipo" Condicional según "Afecto"

## 🎯 Objetivo
El campo "Tipo" (Tipo Totales) solo debe ser obligatorio y estar habilitado cuando el usuario selecciona "Afecto: Sí".

---

## 📋 Comportamiento

### Caso 1: Afecto = "No" (por defecto)
```
Estado inicial del modal:
- Radio "No" seleccionado por defecto
- Campo "Tipo" DESHABILITADO
- Campo "Tipo" NO es obligatorio
- Mensaje: "Este campo se habilitará si selecciona 'Afecto: Sí'"
```

### Caso 2: Usuario selecciona Afecto = "Sí"
```
Al seleccionar "Sí":
- Campo "Tipo" se HABILITA automáticamente
- Campo "Tipo" se vuelve OBLIGATORIO (*)
- Se cargan los tipos de totales (si no están cargados)
- Mensaje: "Seleccione un tipo de total"
```

### Caso 3: Usuario cambia de "Sí" a "No"
```
Al cambiar a "No":
- Campo "Tipo" se DESHABILITA
- Campo "Tipo" se limpia (valor vacío)
- Campo "Tipo" deja de ser obligatorio
- Mensaje: "No requerido cuando Afecto es 'No'"
```

---

## 🔧 Implementación Técnica

### HTML
```html
<div class="mb-3">
    <label for="conceptoTipo" class="form-label">
        Tipo 
        <span class="text-danger" id="tipoRequerido" style="display: none;">*</span>
    </label>
    <select class="form-select" id="conceptoTipo" disabled>
        <option value="">* SELECCIONAR *</option>
    </select>
    <small class="text-muted" id="tipoAyuda">
        Este campo se habilitará si selecciona "Afecto: Sí"
    </small>
</div>
```

### JavaScript - Evento de cambio
```javascript
$('input[name="conceptoAfecto"]').on('change', function() {
    const afecto = $(this).val();
    
    if (afecto === 'SI') {
        // Habilitar campo Tipo
        $('#conceptoTipo').prop('disabled', false);
        $('#tipoRequerido').show();
        $('#tipoAyuda').text('Seleccione un tipo de total');
        
        // Cargar tipos de totales si no están cargados
        if ($('#conceptoTipo option').length <= 1) {
            self.cargarTiposTotales();
        }
    } else {
        // Deshabilitar campo Tipo y limpiar
        $('#conceptoTipo').prop('disabled', true).val('');
        $('#tipoRequerido').hide();
        $('#tipoAyuda').text('No requerido cuando Afecto es "No"');
    }
});
```

### JavaScript - Validación al guardar
```javascript
// Solo validar Tipo si Afecto es "SI"
if (afectoRadio === 'SI' && !tipoTotalesId) {
    showNotification('Por favor seleccione un tipo (requerido cuando es afecto)', 'warning');
    $('#conceptoTipo').focus();
    return;
}
```

### JavaScript - Preparación de datos
```javascript
const datos = {
    tributoId: parseInt(tributoId),
    tipoConceptoId: parseInt(tipoConceptoId),
    afecto: afectoRadio === 'SI' ? 1 : 0,
    tipoTotalesId: tipoTotalesId ? parseInt(tipoTotalesId) : null, // null si no hay valor
    empresaId: parseInt(empresaId)
};
```

---

## 🎨 Estados Visuales

### Estado 1: Deshabilitado (Afecto = No)
```
┌─────────────────────────────────────┐
│ Tipo                                │
│ ┌─────────────────────────────────┐ │
│ │ * SELECCIONAR *          ▼     │ │ (gris, deshabilitado)
│ └─────────────────────────────────┘ │
│ Este campo se habilitará si         │
│ selecciona "Afecto: Sí"             │
└─────────────────────────────────────┘
```

### Estado 2: Habilitado (Afecto = Sí)
```
┌─────────────────────────────────────┐
│ Tipo *                              │
│ ┌─────────────────────────────────┐ │
│ │ * SELECCIONAR *          ▼     │ │ (blanco, habilitado)
│ └─────────────────────────────────┘ │
│ Seleccione un tipo de total         │
└─────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### Prueba 1: Estado inicial
```
1. Abrir modal "Nuevo"
2. Verificar que "Afecto: No" esté seleccionado
3. Verificar que campo "Tipo" esté deshabilitado
4. Verificar mensaje: "Este campo se habilitará si selecciona 'Afecto: Sí'"
✅ PASS
```

### Prueba 2: Habilitar campo Tipo
```
1. Abrir modal "Nuevo"
2. Seleccionar "Afecto: Sí"
3. Verificar que campo "Tipo" se habilite
4. Verificar que aparezca asterisco rojo (*)
5. Verificar que se carguen las opciones
6. Verificar mensaje: "Seleccione un tipo de total"
✅ PASS
```

### Prueba 3: Deshabilitar campo Tipo
```
1. Abrir modal "Nuevo"
2. Seleccionar "Afecto: Sí"
3. Seleccionar un tipo (ej: "Apoyo Bono")
4. Cambiar a "Afecto: No"
5. Verificar que campo "Tipo" se deshabilite
6. Verificar que el valor seleccionado se limpie
7. Verificar que desaparezca el asterisco (*)
8. Verificar mensaje: "No requerido cuando Afecto es 'No'"
✅ PASS
```

### Prueba 4: Validación al guardar (Afecto = Sí, sin Tipo)
```
1. Abrir modal "Nuevo"
2. Llenar todos los campos
3. Seleccionar "Afecto: Sí"
4. NO seleccionar un tipo
5. Click en "Guardar"
6. Verificar mensaje: "Por favor seleccione un tipo (requerido cuando es afecto)"
✅ PASS
```

### Prueba 5: Guardar sin Tipo (Afecto = No)
```
1. Abrir modal "Nuevo"
2. Llenar todos los campos
3. Dejar "Afecto: No" seleccionado
4. Campo "Tipo" deshabilitado (sin valor)
5. Click en "Guardar"
6. Verificar que se guarde exitosamente
7. Verificar en BD que ic_tipototales = NULL
✅ PASS
```

### Prueba 6: Guardar con Tipo (Afecto = Sí)
```
1. Abrir modal "Nuevo"
2. Llenar todos los campos
3. Seleccionar "Afecto: Sí"
4. Seleccionar un tipo (ej: "Apoyo Bono")
5. Click en "Guardar"
6. Verificar que se guarde exitosamente
7. Verificar en BD que ic_tipototales tenga valor
✅ PASS
```

---

## 📊 Flujo de Datos

### Escenario 1: Afecto = No
```
Frontend:
- afecto: "NO"
- tipoTotalesId: null

Backend recibe:
{
  "tributoId": 1,
  "tipoConceptoId": 1,
  "afecto": 0,
  "tipoTotalesId": null,
  "empresaId": 1
}

Base de Datos:
ic_afecto = 0
ic_tipototales = NULL
```

### Escenario 2: Afecto = Sí
```
Frontend:
- afecto: "SI"
- tipoTotalesId: "01"

Backend recibe:
{
  "tributoId": 1,
  "tipoConceptoId": 1,
  "afecto": 1,
  "tipoTotalesId": 1,
  "empresaId": 1
}

Base de Datos:
ic_afecto = 1
ic_tipototales = 1
```

---

## 🎯 Ventajas de esta Implementación

1. **UX mejorada**: El usuario solo ve campos relevantes
2. **Validación inteligente**: Solo valida cuando es necesario
3. **Optimización**: Solo carga tipos de totales cuando se necesitan
4. **Claridad**: Mensajes contextuales según el estado
5. **Prevención de errores**: No permite guardar datos inconsistentes

---

## 🔍 Verificación en Base de Datos

### Consulta para verificar conceptos con/sin tipo:
```sql
-- Conceptos con Afecto = Sí (deben tener tipo)
SELECT 
    imconceptos_id,
    ic_afecto,
    ic_tipototales
FROM rrhh_mconceptos
WHERE ic_afecto = 1 AND ic_estado = 1;
-- Todos deben tener ic_tipototales NOT NULL

-- Conceptos con Afecto = No (pueden no tener tipo)
SELECT 
    imconceptos_id,
    ic_afecto,
    ic_tipototales
FROM rrhh_mconceptos
WHERE ic_afecto = 0 AND ic_estado = 1;
-- Pueden tener ic_tipototales NULL
```

---

## 📝 Notas Adicionales

- El campo "Tipo" se deshabilita visualmente pero sigue en el DOM
- Al cambiar de "Sí" a "No", el valor se limpia automáticamente
- Los tipos de totales se cargan solo una vez (lazy loading)
- La validación es tanto en frontend como en backend
- El asterisco rojo (*) aparece/desaparece dinámicamente

---

**¡Funcionalidad condicional implementada!** ✅

El campo "Tipo" ahora es inteligente y solo se requiere cuando tiene sentido.
