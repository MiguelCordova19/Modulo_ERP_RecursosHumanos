# Implementación de Diferenciación PLANILLA vs RRHH

## 📋 Resumen
Se ha implementado la funcionalidad para diferenciar entre trabajadores de PLANILLA y RRHH, con diferentes campos y validaciones según el tipo seleccionado.

## 🎯 Comportamiento Implementado

### PLANILLA (Tipo 01)
Cuando se selecciona **PLANILLA**, el formulario muestra:
- ✅ Pestaña: Datos Personales (obligatorio)
- ✅ Pestaña: Datos Laborales (campos bloqueados, se llenarán dinámicamente)
- ✅ Pestaña: Datos de Pensión (opcional)
- ✅ Pestaña: Remuneración (obligatorio)
- ✅ Pestaña: CTS (obligatorio)
- ✅ Pestaña: Adjuntos (opcional)

**Campos bloqueados en Datos Laborales:**
- Fecha de Ingreso
- Turno
- Horario
- Día de Descanso
- Hora de Entrada
- Hora de Salida

**Campos habilitados en Datos Laborales:**
- Sede
- Puesto

### RRHH (Tipo 02)
Cuando se selecciona **RRHH**, el formulario muestra:
- ✅ Pestaña: Datos Personales (obligatorio)
- ✅ Pestaña: Datos Laborales (campos habilitados para edición)
- ✅ Pestaña: Adjuntos (opcional)
- ❌ Pestaña: Datos de Pensión (OCULTA)
- ❌ Pestaña: Remuneración (OCULTA)
- ❌ Pestaña: CTS (OCULTA)

**Campos habilitados en Datos Laborales:**
- Fecha de Ingreso
- Turno
- Horario
- Día de Descanso
- Hora de Entrada
- Hora de Salida

**Campos bloqueados en Datos Laborales:**
- Sede
- Puesto

## 🔧 Cambios Realizados

### Frontend (JavaScript)

#### 1. Nueva función `ajustarFormularioPorTipo()`
```javascript
ajustarFormularioPorTipo: function(tipoTrabajador) {
    if (tipoTrabajador === '02') { // RRHH
        // Ocultar pestañas
        $('#nav-pension-tab').parent().hide();
        $('#nav-remuneracion-tab').parent().hide();
        $('#nav-cts-tab').parent().hide();
        
        // Habilitar campos específicos
        $('#fechaIngreso, #turno, #horario, #diaDescanso, #horaEntrada, #horaSalida')
            .prop('disabled', false);
        
        // Deshabilitar campos no usados
        $('#sede, #puesto').prop('disabled', true);
    } else { // PLANILLA
        // Mostrar todas las pestañas
        $('#nav-pension-tab, #nav-remuneracion-tab, #nav-cts-tab').parent().show();
        
        // Configuración inversa de campos
    }
}
```

#### 2. Evento de cambio de tipo
```javascript
$(document).on('change', 'input[name="radioTipoTrabajador"]', function() {
    const tipoTrabajador = $(this).val();
    self.ajustarFormularioPorTipo(tipoTrabajador);
});
```

#### 3. Validación condicional en `guardar()`
```javascript
// Solo validar Remuneración y CTS si es PLANILLA
if (tipoTrabajador === '01') {
    // Validar formularios de remuneración y CTS
}
```

#### 4. Datos condicionales
```javascript
// Remuneración (solo para PLANILLA)
tipoPago: tipoTrabajador === '01' ? $('#tipoPago').val() : null,
bancoRemuneracion: tipoTrabajador === '01' ? $('#banco').val() : null,
// ... etc
```

### Frontend (HTML)

#### Botones de selección
```html
<div class="btn-group w-100" role="group">
    <input type="radio" class="btn-check" name="radioTipoTrabajador" 
           id="radioPlanilla" value="01" checked>
    <label class="btn btn-outline-primary" for="radioPlanilla">
        <i class="fas fa-briefcase me-1"></i>PLANILLA
    </label>
    
    <input type="radio" class="btn-check" name="radioTipoTrabajador" 
           id="radioRRHH" value="02">
    <label class="btn btn-outline-primary" for="radioRRHH">
        <i class="fas fa-users me-1"></i>RRHH
    </label>
</div>
```

### Backend (Java)

#### Validaciones condicionales en `TrabajadorService.java`
```java
// Remuneración obligatoria solo para PLANILLA (01)
if ("01".equals(dto.getTipoTrabajador())) {
    if (dto.getTipoPago() == null || dto.getTipoPago().trim().isEmpty()) {
        throw new RuntimeException("El tipo de pago es obligatorio");
    }
    // ... más validaciones de remuneración y CTS
    
    // Validaciones de formato
    validarFormatoCuenta(dto.getNumeroCuentaRemuneracion(), "remuneración");
    validarFormatoCuenta(dto.getNumeroCuentaCts(), "CTS");
}
```

## 📝 Archivos Modificados

### Frontend
1. **frontend/modules/trabajador.html**
   - Agregados botones de selección PLANILLA/RRHH
   - Agregado evento de sincronización

2. **frontend/js/modules/trabajador.js**
   - Nueva función `ajustarFormularioPorTipo()`
   - Actualizada función `nuevo()` para aplicar ajuste inicial
   - Actualizada función `editar()` para aplicar ajuste según tipo
   - Actualizada función `guardar()` con validaciones condicionales
   - Datos enviados condicionalmente según tipo

### Backend
3. **backend/src/main/java/com/meridian/erp/service/TrabajadorService.java**
   - Validaciones condicionales según tipo de trabajador
   - Validaciones de formato solo para PLANILLA

## 🧪 Cómo Probar

### Caso 1: Crear trabajador PLANILLA
1. Hacer clic en "Nuevo"
2. Verificar que PLANILLA esté seleccionado por defecto
3. Verificar que se muestren todas las pestañas
4. Verificar que campos de Datos Laborales estén bloqueados
5. Llenar Datos Personales, Remuneración y CTS
6. Guardar y verificar que se cree correctamente

### Caso 2: Crear trabajador RRHH
1. Hacer clic en "Nuevo"
2. Seleccionar RRHH
3. Verificar que se oculten pestañas de Pensión, Remuneración y CTS
4. Verificar que campos de Datos Laborales estén habilitados
5. Llenar Datos Personales y Datos Laborales
6. Guardar y verificar que se cree correctamente (sin validar remuneración/CTS)

### Caso 3: Editar trabajador
1. Editar un trabajador existente
2. Verificar que se muestre el tipo correcto (PLANILLA/RRHH)
3. Verificar que las pestañas y campos se ajusten automáticamente
4. Cambiar el tipo y verificar que el formulario se ajuste
5. Guardar cambios

### Caso 4: Cambiar tipo durante creación
1. Hacer clic en "Nuevo"
2. Llenar algunos campos
3. Cambiar de PLANILLA a RRHH
4. Verificar que las pestañas se oculten/muestren correctamente
5. Verificar que los campos se habiliten/deshabiliten

## ✅ Validaciones Implementadas

### Para PLANILLA (01)
- ✅ Datos Personales completos
- ✅ Tipo de Pago obligatorio
- ✅ Banco de Remuneración obligatorio
- ✅ Número de Cuenta de Remuneración obligatorio (10-20 dígitos)
- ✅ Tipo de Cuenta obligatorio
- ✅ Banco CTS obligatorio
- ✅ Número de Cuenta CTS obligatorio (10-20 dígitos)

### Para RRHH (02)
- ✅ Datos Personales completos
- ❌ NO valida Remuneración
- ❌ NO valida CTS
- ✅ Permite editar campos de Datos Laborales

## 🎨 Interfaz de Usuario

### Botones de Selección
- Diseño: Bootstrap `btn-group` con radio buttons
- Estilo: `btn-outline-primary`
- Iconos: 
  - PLANILLA: `fa-briefcase`
  - RRHH: `fa-users`
- Comportamiento: Al hacer clic, cambia inmediatamente el formulario

### Pestañas Dinámicas
- Las pestañas se ocultan/muestran con animación
- Los campos se habilitan/deshabilitan automáticamente
- Los campos requeridos se ajustan según el tipo

## 🔄 Flujo de Datos

1. **Usuario selecciona tipo** → Evento `change` en radio button
2. **JavaScript ejecuta** → `ajustarFormularioPorTipo()`
3. **Formulario se ajusta** → Pestañas y campos cambian
4. **Usuario llena datos** → Solo campos visibles y habilitados
5. **Usuario guarda** → Validación condicional
6. **Backend valida** → Solo campos obligatorios según tipo
7. **Datos se guardan** → Con valores null para campos no aplicables

## 📊 Campos por Tipo

| Campo | PLANILLA | RRHH |
|-------|----------|------|
| Datos Personales | ✅ Obligatorio | ✅ Obligatorio |
| Sede | ✅ Habilitado | ❌ Bloqueado |
| Puesto | ✅ Habilitado | ❌ Bloqueado |
| Fecha Ingreso | ❌ Bloqueado | ✅ Habilitado |
| Turno | ❌ Bloqueado | ✅ Habilitado |
| Horario | ❌ Bloqueado | ✅ Habilitado |
| Día Descanso | ❌ Bloqueado | ✅ Habilitado |
| Hora Entrada | ❌ Bloqueado | ✅ Habilitado |
| Hora Salida | ❌ Bloqueado | ✅ Habilitado |
| Datos Pensión | ✅ Visible | ❌ Oculto |
| Remuneración | ✅ Obligatorio | ❌ Oculto |
| CTS | ✅ Obligatorio | ❌ Oculto |
| Adjuntos | ✅ Visible | ✅ Visible |

## 🚀 Próximos Pasos

- [ ] Implementar carga dinámica de Sedes y Puestos para PLANILLA
- [ ] Implementar carga dinámica de Turnos y Horarios para RRHH
- [ ] Agregar validaciones adicionales según reglas de negocio
- [ ] Implementar reportes diferenciados por tipo
- [ ] Agregar filtros en la tabla por tipo de trabajador
