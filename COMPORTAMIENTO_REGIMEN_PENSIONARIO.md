# 🔒 Comportamiento Automático - Régimen Pensionario

## Descripción

Cuando el usuario selecciona un **Tipo de Trabajador**, el sistema automáticamente:
1. ✅ Selecciona el **Régimen Pensionario** asociado
2. 🔒 Bloquea el campo para evitar edición manual
3. 🎨 Aplica estilo visual de campo bloqueado

---

## Flujo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  MODAL: Nuevo Contrato                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tipo Trabajador: [Seleccione...]          ⬅️ PASO 1      │
│                                                             │
│  Régimen Pensionario: [Seleccione...]      ⬅️ Desbloqueado │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                        ⬇️ Usuario selecciona

┌─────────────────────────────────────────────────────────────┐
│  MODAL: Nuevo Contrato                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tipo Trabajador: [001 - EMPLEADO]         ⬅️ PASO 2      │
│                                                             │
│  Régimen Pensionario: [02 - ONP]           ⬅️ AUTO-SELECT  │
│                       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   ⬅️ BLOQUEADO   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Razón del Comportamiento

Cada **Tipo de Trabajador** en la base de datos tiene asociado un **Régimen Pensionario** específico:

```sql
-- Tabla: RRHH_MTIPOTRABAJADOR
CREATE TABLE rrhh_mtipotrabajador (
    imtipotrabajador_id INTEGER,
    ttt_codigointerno VARCHAR(20),
    itt_tipo INTEGER,                      -- FK a tipo SUNAT
    itt_regimenpensionario INTEGER,        -- ⬅️ FK a régimen pensionario
    ttt_descripcion VARCHAR(200),
    empresa_id INTEGER
);
```

**Ejemplo de datos:**
| ID | Código | Descripción | Tipo SUNAT | Régimen Pensionario |
|----|--------|-------------|------------|---------------------|
| 1  | 001    | EMPLEADO    | 01         | 1 (ONP)            |
| 2  | 002    | OBRERO      | 01         | 2 (INTEGRA)        |

---

## Implementación Técnica

### 1. Carga de Tipo Trabajador con Régimen

```javascript
cargarTiposTrabajador: async function() {
    const response = await fetch(`/api/tipo-trabajador?empresaId=${empresaId}`);
    const result = await response.json();
    
    result.data.forEach(tipo => {
        const option = $('<option></option>')
            .val(tipo.id)
            .text(`${tipo.codigoInterno} - ${tipo.descripcion}`)
            .attr('data-regimen-id', tipo.regimenPensionario?.id || '');  // ⬅️ Guarda ID
        
        select.append(option);
    });
}
```

### 2. Evento onChange - Selección Automática

```javascript
$('#tipoTrabajador').on('change', function() {
    const selectedOption = $(this).find('option:selected');
    const regimenId = selectedOption.attr('data-regimen-id');
    
    if (regimenId) {
        // Seleccionar automáticamente
        $('#regimenPensionario').val(regimenId);
        
        // Bloquear el campo
        $('#regimenPensionario').prop('disabled', true);
        
        // Estilo visual
        $('#regimenPensionario').css('background-color', '#e9ecef');
        
        console.log('✅ Régimen bloqueado:', regimenId);
    } else {
        // Si no hay régimen, desbloquear
        $('#regimenPensionario').prop('disabled', false);
        $('#regimenPensionario').css('background-color', '');
    }
});
```

### 3. Desbloqueo al Abrir Nuevo Modal

```javascript
nuevo: function() {
    $('#formContrato')[0].reset();
    
    // Desbloquear régimen pensionario
    $('#regimenPensionario')
        .prop('disabled', false)
        .css('background-color', '')
        .val('');
}
```

### 4. Desbloqueo al Cerrar Modal

```javascript
$('#modalContrato').on('hidden.bs.modal', function() {
    $('#formContrato')[0].reset();
    
    // Desbloquear régimen pensionario
    $('#regimenPensionario')
        .prop('disabled', false)
        .css('background-color', '');
});
```

---

## Estados del Campo Régimen Pensionario

### Estado 1: Desbloqueado (Inicial)
```html
<select id="regimenPensionario" class="form-select">
    <option value="">Seleccione...</option>
    <option value="1">02 - ONP</option>
    <option value="2">21 - INTEGRA</option>
</select>
```
- ✅ Usuario puede seleccionar
- ✅ Fondo blanco
- ✅ Cursor normal

### Estado 2: Bloqueado (Después de seleccionar Tipo)
```html
<select id="regimenPensionario" class="form-select" 
        disabled 
        style="background-color: #e9ecef;">
    <option value="">Seleccione...</option>
    <option value="1" selected>02 - ONP</option>
    <option value="2">21 - INTEGRA</option>
</select>
```
- 🔒 Usuario NO puede cambiar
- 🎨 Fondo gris (#e9ecef)
- 🚫 Cursor no permitido

---

## Casos de Uso

### Caso 1: Selección Normal
```
1. Usuario abre modal "Nuevo Contrato"
2. Selecciona "001 - EMPLEADO" en Tipo Trabajador
3. Sistema selecciona automáticamente "02 - ONP"
4. Campo Régimen Pensionario se bloquea
5. Usuario completa otros campos
6. Usuario guarda el contrato
```

### Caso 2: Cambio de Tipo Trabajador
```
1. Usuario selecciona "001 - EMPLEADO" (ONP)
2. Régimen se bloquea en "02 - ONP"
3. Usuario cambia a "002 - OBRERO" (INTEGRA)
4. Régimen cambia automáticamente a "21 - INTEGRA"
5. Campo permanece bloqueado
```

### Caso 3: Cancelar y Reabrir
```
1. Usuario selecciona "001 - EMPLEADO"
2. Régimen se bloquea en "02 - ONP"
3. Usuario cierra el modal (Cancelar)
4. Usuario reabre el modal
5. Campo Régimen Pensionario está desbloqueado
```

---

## Validación en el Backend

Cuando se guarde el contrato, el backend debe validar que:

```javascript
// Frontend - Al guardar
const datos = {
    tipoTrabajadorId: $('#tipoTrabajador').val(),
    regimenPensionarioId: $('#regimenPensionario').val()
};

// Backend - Validación
// Verificar que el régimen corresponda al tipo trabajador
SELECT itt_regimenpensionario 
FROM rrhh_mtipotrabajador 
WHERE imtipotrabajador_id = ?;

// Si no coincide, rechazar
if (regimenBD !== regimenRecibido) {
    return error("El régimen no corresponde al tipo de trabajador");
}
```

---

## Beneficios

1. ✅ **Consistencia de Datos**: Evita que se guarden combinaciones inválidas
2. ✅ **Experiencia de Usuario**: Reduce pasos manuales
3. ✅ **Prevención de Errores**: Bloqueo evita selecciones incorrectas
4. ✅ **Cumplimiento Normativo**: Asegura que cada tipo tenga su régimen correcto
5. ✅ **Auditoría**: Trazabilidad de la relación tipo-régimen

---

## Consideraciones

### ¿Qué pasa si el Tipo Trabajador no tiene Régimen?

```javascript
if (regimenId) {
    // Bloquear y seleccionar
} else {
    // Desbloquear para selección manual
    $('#regimenPensionario').prop('disabled', false);
    $('#regimenPensionario').css('background-color', '');
}
```

### ¿Se puede editar manualmente?

**NO**. Una vez seleccionado el Tipo Trabajador, el Régimen Pensionario queda bloqueado. Para cambiar:
1. Cambiar el Tipo Trabajador (cambiará automáticamente el régimen)
2. O cerrar y reabrir el modal

---

## Testing

### Test 1: Selección Automática
```
✅ Seleccionar Tipo Trabajador
✅ Verificar que Régimen se seleccione automáticamente
✅ Verificar que campo esté disabled
✅ Verificar que fondo sea gris
```

### Test 2: Cambio de Tipo
```
✅ Seleccionar Tipo A (Régimen X)
✅ Cambiar a Tipo B (Régimen Y)
✅ Verificar que Régimen cambie a Y
✅ Verificar que campo permanezca bloqueado
```

### Test 3: Desbloqueo
```
✅ Seleccionar Tipo Trabajador
✅ Cerrar modal
✅ Reabrir modal
✅ Verificar que Régimen esté desbloqueado
```

---

## Logs en Consola

```javascript
// Al seleccionar Tipo Trabajador
Tipo Trabajador seleccionado: {
    id: 1,
    tipoId: 1,
    tipoCodigo: "01",
    regimenId: 1,
    regimenCodigo: "02"
}
✅ Régimen Pensionario seleccionado automáticamente: 1

// Al cambiar Tipo Trabajador
Tipo Trabajador seleccionado: {
    id: 2,
    tipoId: 1,
    tipoCodigo: "01",
    regimenId: 2,
    regimenCodigo: "21"
}
✅ Régimen Pensionario seleccionado automáticamente: 2
```
