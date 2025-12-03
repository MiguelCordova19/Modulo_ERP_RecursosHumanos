# 🔄 Flujo de Guardado Automático de Conceptos

## 🎯 Nuevo Comportamiento

Cuando un usuario crea un nuevo contrato, el sistema:

1. ✅ **Guarda el contrato** en `rrhh_mcontratotrabajador`
2. ✅ **Guarda automáticamente los conceptos** en `rrhh_mconceptostrabajador`
3. ✅ **Abre el modal** mostrando los conceptos ya guardados
4. ✅ **Permite editar** y hacer clic en "Guardar" para actualizar

## 📊 Diagrama de Flujo

```
Usuario crea contrato
        ↓
Guardar contrato en BD
        ↓
Obtener conceptos del régimen laboral
        ↓
Aplicar valores por defecto inteligentes
        ↓
Guardar conceptos automáticamente en BD ✨
        ↓
Abrir modal con conceptos guardados
        ↓
Usuario puede editar
        ↓
Usuario hace clic en "Guardar"
        ↓
Actualizar conceptos en BD
```

## 🔧 Implementación Técnica

### 1. Función: `guardarConceptosAutomaticamente()`

**Ubicación:** `frontend/js/modules/contrato.js`

**Propósito:** Guarda automáticamente los conceptos al crear un contrato

**Flujo:**
```javascript
async guardarConceptosAutomaticamente(contratoId, regimenLaboralCodigo, sueldoTotal) {
    // 1. Obtener conceptos del régimen laboral
    const conceptos = await fetch(`/api/conceptos-regimen-laboral/${regimenLaboralCodigo}/conceptos`);
    
    // 2. Aplicar valores por defecto
    const conceptosConValores = conceptos.map(concepto => {
        // Lógica inteligente para determinar tipo, tipoValor y valor
        return {
            conceptoId: concepto.id,
            tipo: 'FIJO',
            tipoValor: 'MONTO',
            valor: sueldoTotal
        };
    });
    
    // 3. Guardar en BD
    await fetch('/api/conceptos-trabajador', {
        method: 'POST',
        body: JSON.stringify({
            contratoId: contratoId,
            empresaId: empresaId,
            conceptos: conceptosConValores
        })
    });
}
```

### 2. Función: `abrirModalConceptosParaEditar()`

**Ubicación:** `frontend/js/modules/contrato.js`

**Propósito:** Abre el modal mostrando los conceptos ya guardados

**Flujo:**
```javascript
async abrirModalConceptosParaEditar(contratoId, nroDocumento, nombreCompleto) {
    // 1. Configurar modal
    $('#modalConceptosTrabajadorTitle').html('Conceptos Del Trabajador <small>(Editar)</small>');
    
    // 2. Cargar conceptos guardados de la BD
    await cargarConceptosTrabajador(contratoId);
    
    // 3. Mostrar modal
    $('#modalConceptosTrabajador').modal('show');
}
```

### 3. Flujo en `guardar()`

**Antes:**
```javascript
if (!esEdicion) {
    // Abrir modal y cargar conceptos del régimen
    abrirModalConceptosAutomatico(contratoId, ..., regimenLaboralCodigo, sueldoTotal);
}
```

**Ahora:**
```javascript
if (!esEdicion) {
    // 1. Guardar conceptos automáticamente
    await guardarConceptosAutomaticamente(contratoId, regimenLaboralCodigo, sueldoTotal);
    
    // 2. Abrir modal con conceptos guardados
    abrirModalConceptosParaEditar(contratoId, nroDocumento, nombreCompleto);
}
```

## 💾 Valores por Defecto Inteligentes

| Concepto | Tipo | Tipo Valor | Valor |
|----------|------|------------|-------|
| REMUNERACIÓN BÁSICA | FIJO | MONTO | Sueldo total del contrato |
| REMUNERACIÓN VACACIONAL | FIJO | MONTO | Sueldo total del contrato |
| ESSALUD | FIJO | PORCENTAJE | 9.00 |
| BONIFICACIÓN 9% | FIJO | PORCENTAJE | 9.00 |
| AFP | FIJO | PORCENTAJE | 0.00 |
| ONP | FIJO | PORCENTAJE | 0.00 |
| GRATIFICACIÓN | FIJO | MONTO | 0.00 |
| CTS | FIJO | MONTO | 0.00 |
| Otros | VARIABLE | MONTO | 0.00 |

**Código:**
```javascript
if (descripcionUpper.includes('REMUNERACIÓN') && descripcionUpper.includes('BÁSICA')) {
    tipo = 'FIJO';
    tipoValor = 'MONTO';
    valor = parseFloat(sueldoTotal) || 0;
} else if (descripcionUpper.includes('ESSALUD')) {
    tipo = 'FIJO';
    tipoValor = 'PORCENTAJE';
    valor = 9.00;
}
// ... más lógica
```

## 🎨 Interfaz de Usuario

### Mensaje de Éxito
```
✅ Conceptos Guardados: Los conceptos se han guardado automáticamente 
   según el régimen laboral. Puedes ajustar los valores, agregar o 
   eliminar conceptos y hacer clic en "Guardar" para actualizar.
```

### Título del Modal
```
Conceptos Del Trabajador (Editar)
```

### Tabla de Conceptos
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Conceptos Guardados: Los conceptos se han guardado...    │
├─────────────────────────────────────────────────────────────┤
│ DNI: 12345678          Trabajador: JUAN PEREZ LOPEZ        │
├─────────────────────────────────────────────────────────────┤
│ # │ Cod  │ Concepto        │ Tipo │ Tipo Valor │ Valor    │
├───┼──────┼─────────────────┼──────┼────────────┼──────────┤
│ 1 │ 0121 │ REMUNERACIÓN... │ FIJO │ MONTO      │ 1500.00  │
│ 2 │ 0804 │ ESSALUD         │ FIJO │ PORCENTAJE │ 9.00     │
│ 3 │ 0118 │ REMUNERACIÓN... │ FIJO │ MONTO      │ 1500.00  │
└───┴──────┴─────────────────┴──────┴────────────┴──────────┘
                    [Cancelar]  [Guardar]
```

## ✅ Ventajas del Nuevo Flujo

### 1. Garantía de Datos
- ✅ Siempre hay conceptos guardados al crear un contrato
- ✅ No depende de que el usuario haga clic en "Guardar"
- ✅ Datos consistentes desde el inicio

### 2. Mejor Experiencia
- ✅ Usuario ve conceptos ya guardados
- ✅ Puede editar si necesita ajustar
- ✅ Puede cerrar el modal sin perder datos

### 3. Auditoría Completa
- ✅ Se registra quién creó los conceptos iniciales
- ✅ Se registra quién los modificó después
- ✅ Historial completo de cambios

### 4. Flexibilidad
- ✅ Usuario puede editar después desde "Modificar conceptos"
- ✅ Valores por defecto inteligentes ahorran tiempo
- ✅ Puede agregar/eliminar conceptos

## 🔄 Comparación: Antes vs Ahora

### Antes
```
Crear contrato
    ↓
Abrir modal (conceptos NO guardados)
    ↓
Usuario edita
    ↓
Usuario hace clic en "Guardar"
    ↓
Guardar conceptos en BD
```

**Problema:** Si el usuario cierra el modal sin guardar, no hay conceptos.

### Ahora
```
Crear contrato
    ↓
Guardar conceptos automáticamente ✨
    ↓
Abrir modal (conceptos YA guardados)
    ↓
Usuario edita (opcional)
    ↓
Usuario hace clic en "Guardar"
    ↓
Actualizar conceptos en BD
```

**Ventaja:** Siempre hay conceptos guardados, incluso si el usuario cierra el modal.

## 📝 Casos de Uso

### Caso 1: Usuario Crea Contrato y Acepta Valores por Defecto
```
1. Usuario crea contrato con sueldo S/. 1,500
2. Sistema guarda conceptos automáticamente:
   - REMUNERACIÓN BÁSICA: S/. 1,500
   - ESSALUD: 9%
   - etc.
3. Modal se abre mostrando conceptos guardados
4. Usuario revisa y cierra modal (sin hacer cambios)
5. ✅ Conceptos quedan guardados con valores por defecto
```

### Caso 2: Usuario Crea Contrato y Ajusta Valores
```
1. Usuario crea contrato con sueldo S/. 1,500
2. Sistema guarda conceptos automáticamente
3. Modal se abre mostrando conceptos guardados
4. Usuario cambia ESSALUD de 9% a 10%
5. Usuario hace clic en "Guardar"
6. ✅ Conceptos se actualizan con nuevos valores
```

### Caso 3: Usuario Crea Contrato y Agrega Conceptos
```
1. Usuario crea contrato
2. Sistema guarda conceptos automáticamente
3. Modal se abre mostrando conceptos guardados
4. Usuario agrega "BONIFICACIÓN ESPECIAL"
5. Usuario hace clic en "Guardar"
6. ✅ Se actualizan conceptos (incluye el nuevo)
```

## 🔧 Mantenimiento

### Agregar Nuevo Concepto con Valor por Defecto

**Ubicación:** `guardarConceptosAutomaticamente()` en `contrato.js`

```javascript
// Agregar nueva condición
else if (descripcionUpper.includes('NUEVO_CONCEPTO')) {
    tipo = 'FIJO';
    tipoValor = 'PORCENTAJE';
    valor = 5.00;
}
```

### Cambiar Valor por Defecto

```javascript
// Cambiar de 9% a 10%
else if (descripcionUpper.includes('ESSALUD')) {
    tipo = 'FIJO';
    tipoValor = 'PORCENTAJE';
    valor = 10.00; // Antes: 9.00
}
```

## 🐛 Troubleshooting

### Problema: No se guardan conceptos automáticamente

**Causa:** Error en la API o régimen laboral sin conceptos

**Solución:**
1. Revisar consola del navegador
2. Verificar que el régimen laboral tenga conceptos en `rrhh_conceptos_regimen_detalle`
3. Verificar logs del backend

### Problema: Modal se abre vacío

**Causa:** Error al cargar conceptos guardados

**Solución:**
1. Verificar que los conceptos se guardaron en BD
2. Revisar query en `sp_obtener_conceptos_trabajador()`
3. Verificar que `empresaId` sea correcto

### Problema: Al guardar se duplican conceptos

**Causa:** El procedimiento almacenado no está eliminando los anteriores

**Solución:**
1. Verificar `sp_guardar_conceptos_trabajador()`
2. Asegurar que hace soft delete antes de insertar

## 📊 Impacto en Base de Datos

### Antes
```
Crear contrato → 1 INSERT en rrhh_mcontratotrabajador
```

### Ahora
```
Crear contrato → 1 INSERT en rrhh_mcontratotrabajador
                → N INSERTS en rrhh_mconceptostrabajador (automático)
```

**Impacto:** Mínimo, los INSERTs son rápidos y se hacen en una transacción.

## 🎯 Conclusión

El nuevo flujo garantiza que:
- ✅ Siempre hay conceptos guardados al crear un contrato
- ✅ Usuario puede editar si necesita
- ✅ Datos consistentes y auditables
- ✅ Mejor experiencia de usuario

---

**Fecha**: 2025-12-02
**Versión**: 2.0 (Guardado Automático)
