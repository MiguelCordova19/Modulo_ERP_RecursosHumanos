# ✅ Cálculo Automático de Días - Cronograma de Vacaciones

## 📝 Descripción

Se ha implementado el **cálculo automático de días** de vacaciones basado en las fechas de inicio y fin seleccionadas. El sistema calcula automáticamente la cantidad de días cuando el usuario ingresa ambas fechas.

---

## 🎯 Características Implementadas

### 1. **Cálculo Automático en Tiempo Real**
- Al seleccionar o cambiar la **Fecha Inicio** o **Fecha Fin**, el sistema calcula automáticamente los días
- El cálculo se realiza instantáneamente sin necesidad de hacer clic en ningún botón adicional
- El campo "Días" se actualiza automáticamente

### 2. **Campo Días de Solo Lectura**
- El campo "Días" es **readonly** (no editable manualmente)
- Se muestra con fondo gris claro para indicar que es calculado
- Tiene un estilo visual diferente (texto azul y en negrita)

### 3. **Validaciones Automáticas**
- Valida que la fecha inicio no sea mayor a la fecha fin
- Muestra notificación de error si las fechas son inválidas
- Solo calcula si ambas fechas están presentes

### 4. **Cálculo Inclusivo**
- El cálculo incluye tanto el día de inicio como el día de fin
- Fórmula: `días = (fechaFin - fechaInicio) + 1`
- Ejemplo: Del 01/07/2025 al 15/07/2025 = 15 días

---

## 🔢 Fórmula de Cálculo

```javascript
// Calcular diferencia en días (incluye ambos días)
const inicio = new Date(fechaInicio);
const fin = new Date(fechaFin);
const diferenciaMilisegundos = fin - inicio;
const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;
```

### Ejemplos de Cálculo:

| Fecha Inicio | Fecha Fin    | Días Calculados | Explicación                    |
|--------------|--------------|-----------------|--------------------------------|
| 2025-07-01   | 2025-07-15   | 15 días         | Del 1 al 15 de julio           |
| 2025-08-01   | 2025-08-31   | 31 días         | Todo el mes de agosto          |
| 2025-12-24   | 2025-12-31   | 8 días          | Última semana del año          |
| 2025-01-01   | 2025-01-01   | 1 día           | Un solo día                    |
| 2025-06-15   | 2025-07-14   | 30 días         | 30 días continuos              |

---

## 🎨 Interfaz de Usuario

### Modal de Detalle con Cálculo Automático

```
┌─────────────────────────────────────────────────────────────────────┐
│ Detalle del Cronograma de Vacaciones                          [X]   │
├─────────────────────────────────────────────────────────────────────┤
│ ℹ️ Haga clic en las fechas para editarlas.                         │
│   Los días se calculan automáticamente.                             │
├─────────────────────────────────────────────────────────────────────┤
│ # │ Nombres      │ F.Inicio   │ F.Fin      │ Días │ Acción         │
├───┼──────────────┼────────────┼────────────┼──────┼────────────────┤
│ 1 │ PEREZ JUAN   │ 2025-07-01 │ 2025-07-15 │  15  │ ✓ X            │
│   │              │ [EDITABLE] │ [EDITABLE] │ [AUTO]│                │
└─────────────────────────────────────────────────────────────────────┘
```

### Estados Visuales del Campo "Días"

1. **Sin Datos**: Muestra "-" en gris
2. **Con Datos**: Muestra el número en azul y negrita
3. **En Edición**: Fondo gris claro, readonly, cursor "not-allowed"
4. **Hover**: No cambia de color (no es editable)

---

## 🔄 Flujo de Cálculo Automático

### 1. Usuario Edita Fecha Inicio
```javascript
// Usuario hace clic en "F. Inicio Vac."
// Selecciona: 2025-07-01

// Evento 'change' se dispara
calcularDiasAutomaticamente($row);

// Si también existe fecha fin (ej: 2025-07-15)
// → Calcula: 15 días
// → Actualiza campo "Días" automáticamente
```

### 2. Usuario Edita Fecha Fin
```javascript
// Usuario hace clic en "F. Fin Vac."
// Selecciona: 2025-07-15

// Evento 'change' se dispara
calcularDiasAutomaticamente($row);

// Si también existe fecha inicio (ej: 2025-07-01)
// → Calcula: 15 días
// → Actualiza campo "Días" automáticamente
```

### 3. Validación de Fechas
```javascript
// Si fecha inicio > fecha fin
if (inicio > fin) {
    showNotification('La fecha de inicio no puede ser mayor a la fecha fin', 'warning');
    return; // No calcula
}
```

### 4. Guardar con Días Calculados
```javascript
// Al presionar Enter o botón ✓
// Se recalcula una vez más (por seguridad)
calcularDiasAutomaticamente($row);

// Se envía al backend con los días calculados
PUT /api/cronograma-vacaciones/detalle/{id}
{
    "fechaInicio": "2025-07-01",
    "fechaFin": "2025-07-15",
    "dias": 15  // ← Calculado automáticamente
}
```

---

## 💡 Casos de Uso

### Caso 1: Asignar Vacaciones de 15 Días
```
1. Click en "F. Inicio Vac." → Seleccionar "2025-07-01"
2. Click en "F. Fin Vac." → Seleccionar "2025-07-15"
3. ✨ Campo "Días" se actualiza automáticamente a "15"
4. Presionar Enter o ✓
5. ✅ Guardado: "Vacaciones guardadas: 15 días"
```

### Caso 2: Modificar Fechas Existentes
```
Datos actuales:
- Inicio: 2025-07-01
- Fin: 2025-07-15
- Días: 15

Usuario modifica:
1. Click en "F. Fin Vac." → Cambiar a "2025-07-31"
2. ✨ Campo "Días" se actualiza automáticamente a "31"
3. Guardar cambios
4. ✅ Actualizado: "Vacaciones guardadas: 31 días"
```

### Caso 3: Vacaciones de Un Solo Día
```
1. Click en "F. Inicio Vac." → Seleccionar "2025-12-25"
2. Click en "F. Fin Vac." → Seleccionar "2025-12-25"
3. ✨ Campo "Días" se actualiza automáticamente a "1"
4. Guardar
5. ✅ Guardado: "Vacaciones guardadas: 1 día"
```

### Caso 4: Error de Validación
```
1. Click en "F. Inicio Vac." → Seleccionar "2025-07-15"
2. Click en "F. Fin Vac." → Seleccionar "2025-07-01"
3. ⚠️ Error: "La fecha de inicio no puede ser mayor a la fecha fin"
4. No se calcula días
5. Usuario corrige las fechas
6. ✨ Días se calculan correctamente
```

---

## 🎨 Estilos CSS Aplicados

```css
/* Campo de días calculado automáticamente (readonly) */
#tablaDetalleCronograma [data-field="dias"] {
    background-color: #f8f9fa !important;
    cursor: default !important;
}

#tablaDetalleCronograma [data-field="dias"]:hover {
    background-color: #f8f9fa !important; /* No cambia en hover */
}

#tablaDetalleCronograma [data-field="dias"] .cell-input {
    background-color: #e9ecef !important; /* Gris claro */
    cursor: not-allowed;
    font-weight: 600;
    color: #495057;
}

#tablaDetalleCronograma [data-field="dias"] .cell-display {
    font-weight: 600;
    color: #0d6efd; /* Azul Bootstrap */
}
```

---

## 🔧 Código JavaScript Implementado

### Función de Cálculo Automático

```javascript
// Calcular días automáticamente basado en las fechas
calcularDiasAutomaticamente: function($row) {
    const fechaInicio = $row.find('[data-field="fechaInicio"] .cell-input').val();
    const fechaFin = $row.find('[data-field="fechaFin"] .cell-input').val();
    
    // Solo calcular si ambas fechas están presentes
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        // Validar que fecha inicio no sea mayor a fecha fin
        if (inicio > fin) {
            showNotification('La fecha de inicio no puede ser mayor a la fecha fin', 'warning');
            return;
        }
        
        // Calcular diferencia en días (incluye ambos días)
        const diferenciaMilisegundos = fin - inicio;
        const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1;
        
        // Actualizar el campo de días
        const $inputDias = $row.find('[data-field="dias"] .cell-input');
        $inputDias.val(dias);
        
        console.log(`📅 Días calculados: ${dias} (desde ${fechaInicio} hasta ${fechaFin})`);
    }
}
```

### Evento de Cambio en Fechas

```javascript
// Calcular días automáticamente cuando cambian las fechas
$(document).off('change', '[data-field="fechaInicio"] .cell-input, [data-field="fechaFin"] .cell-input')
    .on('change', '[data-field="fechaInicio"] .cell-input, [data-field="fechaFin"] .cell-input', function() {
    const $row = $(this).closest('tr');
    self.calcularDiasAutomaticamente($row);
});
```

---

## ✨ Ventajas del Cálculo Automático

1. **Elimina Errores Humanos**: No hay riesgo de ingresar días incorrectos
2. **Ahorra Tiempo**: No necesita calcular manualmente
3. **Validación Instantánea**: Detecta fechas inválidas inmediatamente
4. **Interfaz Intuitiva**: El usuario solo se enfoca en las fechas
5. **Consistencia**: Todos los cálculos usan la misma fórmula
6. **Feedback Visual**: El campo de días se actualiza en tiempo real

---

## 📊 Validaciones Implementadas

### 1. Validación de Fechas Requeridas
```javascript
if (!fechaInicio || !fechaFin) {
    showNotification('Debe ingresar ambas fechas (inicio y fin)', 'warning');
    return;
}
```

### 2. Validación de Orden de Fechas
```javascript
if (fechaInicio > fechaFin) {
    showNotification('La fecha de inicio no puede ser mayor a la fecha fin', 'warning');
    return;
}
```

### 3. Recálculo Antes de Guardar
```javascript
// Calcular días una vez más antes de guardar (por seguridad)
this.calcularDiasAutomaticamente($row);
const diasCalculados = $row.find('[data-field="dias"] .cell-input').val();
```

---

## 🚀 Cómo Usar

### Paso a Paso

1. **Abrir Cronograma**
   ```
   Dashboard → Cronograma de Vacaciones → Ver (👁️)
   ```

2. **Editar Fechas**
   ```
   - Click en "F. Inicio Vac." → Seleccionar fecha
   - Click en "F. Fin Vac." → Seleccionar fecha
   - ✨ Los días se calculan automáticamente
   ```

3. **Verificar Cálculo**
   ```
   - El campo "Días" muestra el número calculado
   - Aparece en azul y negrita
   - No es editable (readonly)
   ```

4. **Guardar**
   ```
   - Presionar Enter o click en ✓
   - Notificación: "Vacaciones guardadas: X días"
   ```

---

## 🔮 Mejoras Futuras (Opcional)

1. **Excluir Feriados**: Descontar días feriados del cálculo
2. **Excluir Fines de Semana**: Calcular solo días hábiles
3. **Días Disponibles**: Mostrar cuántos días de vacaciones le quedan al trabajador
4. **Validar Límites**: No permitir más días de los que tiene disponible
5. **Historial**: Mostrar vacaciones anteriores del trabajador
6. **Conflictos**: Detectar si hay solapamiento con otros trabajadores del mismo equipo

---

## 📝 Archivos Modificados

### Frontend
- ✅ `frontend/js/modules/cronograma-vacaciones.js`
  - Función `calcularDiasAutomaticamente()`
  - Evento `change` en inputs de fecha
  - Validación mejorada en `guardarDetalle()`
  - Campo días como readonly

- ✅ `frontend/modules/cronograma-vacaciones.html`
  - Estilos CSS para campo readonly
  - Mensaje informativo actualizado

---

## 🎯 Estado: ✅ COMPLETADO

El cálculo automático de días está completamente implementado y funcional. Los usuarios ahora solo necesitan seleccionar las fechas de inicio y fin, y el sistema calcula automáticamente la cantidad de días de vacaciones.

---

## 📸 Ejemplo Visual

```
Antes de Editar:
┌────────────────────────────────────────┐
│ F. Inicio │ F. Fin    │ Días           │
│ -         │ -         │ -              │
└────────────────────────────────────────┘

Durante Edición:
┌────────────────────────────────────────┐
│ F. Inicio │ F. Fin    │ Días           │
│ 2025-07-01│ 2025-07-15│ 15 (auto)     │
│ [INPUT]   │ [INPUT]   │ [READONLY]     │
└────────────────────────────────────────┘

Después de Guardar:
┌────────────────────────────────────────┐
│ F. Inicio │ F. Fin    │ Días           │
│ 2025-07-01│ 2025-07-15│ 15             │
│           │           │ (azul/negrita) │
└────────────────────────────────────────┘
```

---

## ✅ Beneficios Clave

- ⚡ **Rápido**: Cálculo instantáneo
- 🎯 **Preciso**: Sin errores de cálculo manual
- 🔒 **Seguro**: Campo readonly previene edición accidental
- 👁️ **Visual**: Estilo diferenciado indica que es calculado
- ✨ **Intuitivo**: El usuario solo piensa en fechas, no en días
