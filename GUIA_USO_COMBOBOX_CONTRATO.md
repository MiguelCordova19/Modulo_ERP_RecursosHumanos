# Guía de Uso - Combobox en Módulo de Contrato

## 📋 Resumen

Se han implementado dos combobox dinámicos en el módulo de contrato:
1. **Tipo Trabajador** - Carga desde `RRHH_MTIPOTRABAJADOR`
2. **Régimen Pensionario** - Carga desde `RRHH_MREGIMENPENSIONARIO`

---

## 1️⃣ Tipo Trabajador

### Endpoint
```
GET /api/tipo-trabajador?empresaId={empresaId}
```

### Formato de Visualización
```
001 - EMPLEADO
002 - OBRERO
```

### Datos Disponibles

```javascript
// Obtener ID del tipo trabajador
const tipoTrabajadorId = $('#tipoTrabajador').val();

// Obtener datos adicionales
const selectedOption = $('#tipoTrabajador').find('option:selected');
const tipoId = selectedOption.attr('data-tipo-id');           // ID del tipo SUNAT
const tipoCodigo = selectedOption.attr('data-tipo-codigo');   // Código SUNAT (ej: "01")
const regimenId = selectedOption.attr('data-regimen-id');     // ID del régimen
const regimenCodigo = selectedOption.attr('data-regimen-codigo'); // Código régimen
```

### Estructura de Datos
```json
{
  "id": 1,
  "codigoInterno": "001",
  "descripcion": "EMPLEADO",
  "tipo": {
    "id": 1,
    "codSunat": "01",
    "descripcion": "TRABAJADOR"
  },
  "regimenPensionario": {
    "id": 1,
    "codSunat": "02",
    "abreviatura": "ONP"
  }
}
```

---

## 2️⃣ Régimen Pensionario

### Endpoint
```
GET /api/regimenes
```

### Formato de Visualización
```
02 - ONP
21 - INTEGRA
```

### Datos Disponibles

```javascript
// Obtener ID del régimen pensionario
const regimenPensionarioId = $('#regimenPensionario').val();

// Obtener datos adicionales
const selectedOption = $('#regimenPensionario').find('option:selected');
const codigo = selectedOption.attr('data-codigo');           // Código SUNAT (ej: "02")
const descripcion = selectedOption.attr('data-descripcion'); // Descripción completa
const abreviatura = selectedOption.attr('data-abreviatura'); // Abreviatura (ej: "ONP")
```

### Estructura de Datos
```json
{
  "id": 1,
  "codSunat": "02",
  "descripcion": "DECRETO LEY 1990 - SISTEMA NACIONAL DE PENSIONES - ONP",
  "abreviatura": "ONP"
}
```

---

## 🔧 Ejemplo de Uso Completo

### Al Guardar un Contrato

```javascript
guardar: function() {
    // Obtener valores básicos
    const tipoTrabajadorId = $('#tipoTrabajador').val();
    const regimenPensionarioId = $('#regimenPensionario').val();
    
    // Obtener información adicional del tipo trabajador
    const tipoTrabajadorOption = $('#tipoTrabajador').find('option:selected');
    const tipoSunatId = tipoTrabajadorOption.attr('data-tipo-id');
    const tipoSunatCodigo = tipoTrabajadorOption.attr('data-tipo-codigo');
    
    // Obtener información adicional del régimen
    const regimenOption = $('#regimenPensionario').find('option:selected');
    const regimenCodigo = regimenOption.attr('data-codigo');
    const regimenAbreviatura = regimenOption.attr('data-abreviatura');
    
    // Preparar datos para enviar
    const datos = {
        trabajadorId: $('#trabajadorId').val(),
        tipoContratoId: $('#tipoContrato').val(),
        fechaIngreso: $('#fechaIngresoLaboral').val(),
        fechaInicio: $('#fechaInicio').val(),
        fechaFin: $('#fechaFin').val(),
        sedeId: $('#sede').val(),
        puestoId: $('#puesto').val(),
        turnoId: $('#turno').val(),
        horarioId: $('#horario').val(),
        horaEntrada: $('#horaEntrada').val(),
        horaSalida: $('#horaSalida').val(),
        horaLaboral: $('#horaLaboral').val(),
        diaDescansoId: $('#diaDescanso').val(),
        tipoTrabajadorId: tipoTrabajadorId,
        regimenPensionarioId: regimenPensionarioId,
        remuneracionBasica: $('#remuneracionBasica').val(),
        remuneracionRC: $('#remuneracionRC').val(),
        sueldoTotal: $('#sueldoTotal').val(),
        // Datos adicionales para validaciones
        tipoSunatCodigo: tipoSunatCodigo,
        regimenCodigo: regimenCodigo
    };
    
    console.log('Datos del contrato:', datos);
    
    // Enviar al backend...
}
```

### Selección Automática de Régimen Pensionario

**⚡ IMPORTANTE**: Cuando se selecciona un Tipo de Trabajador, el Régimen Pensionario se selecciona y bloquea automáticamente.

```javascript
// Al seleccionar Tipo Trabajador
$('#tipoTrabajador').on('change', function() {
    const regimenId = $(this).find('option:selected').attr('data-regimen-id');
    
    if (regimenId) {
        // 1. Selecciona automáticamente el régimen
        $('#regimenPensionario').val(regimenId);
        
        // 2. Bloquea el campo para evitar edición
        $('#regimenPensionario').prop('disabled', true);
        
        // 3. Aplica estilo visual de bloqueado
        $('#regimenPensionario').css('background-color', '#e9ecef');
        
        console.log('✅ Régimen Pensionario bloqueado:', regimenId);
    }
});
```

**Flujo de Usuario:**
```
1. Usuario selecciona "001 - EMPLEADO" en Tipo Trabajador
   ↓
2. Sistema detecta que tiene regimenId = 1 (ONP)
   ↓
3. Sistema selecciona automáticamente "02 - ONP" en Régimen Pensionario
   ↓
4. Campo Régimen Pensionario se bloquea (fondo gris)
   ↓
5. Usuario NO puede cambiar el régimen manualmente
```

### Validaciones Según Régimen

```javascript
// Ejemplo: Validar según el régimen pensionario
$('#regimenPensionario').on('change', function() {
    const selectedOption = $(this).find('option:selected');
    const codigo = selectedOption.attr('data-codigo');
    const abreviatura = selectedOption.attr('data-abreviatura');
    
    // Lógica según el régimen
    if (codigo === '02') {
        // ONP - Sistema Nacional de Pensiones
        console.log('Régimen ONP seleccionado');
        // Aplicar descuento del 13%
    } else if (codigo.startsWith('2')) {
        // SPP - Sistema Privado de Pensiones
        console.log('Régimen AFP seleccionado:', abreviatura);
        // Aplicar descuentos según AFP
    }
});
```

### Validaciones Según Tipo de Trabajador

```javascript
// Ejemplo: Validar según el tipo de trabajador
$('#tipoTrabajador').on('change', function() {
    const selectedOption = $(this).find('option:selected');
    const tipoCodigo = selectedOption.attr('data-tipo-codigo');
    
    // Lógica según el tipo SUNAT
    if (tipoCodigo === '01') {
        // Trabajador
        console.log('Tipo: Trabajador');
        // Aplicar beneficios laborales completos
    } else if (tipoCodigo === '02') {
        // Trabajador de construcción civil
        console.log('Tipo: Construcción Civil');
        // Aplicar beneficios especiales
    }
});
```

---

## 📊 Tablas de Referencia

### Códigos SUNAT - Tipo de Trabajador
| Código | Descripción |
|--------|-------------|
| 01 | Trabajador |
| 02 | Trabajador de construcción civil |
| 03 | Trabajador del hogar |
| 04 | Trabajador pesquero |

### Códigos SUNAT - Régimen Pensionario
| Código | Abreviatura | Descripción |
|--------|-------------|-------------|
| 02 | ONP | Sistema Nacional de Pensiones |
| 21 | INTEGRA | SPP Integra |
| 22 | PROFUTURO | SPP Profuturo |
| 23 | PRIMA | SPP Prima |
| 24 | HABITAT | SPP Habitat |

---

## ✅ Ventajas de esta Implementación

1. **Datos Completos**: Acceso a toda la información relacionada sin hacer consultas adicionales
2. **Validaciones**: Permite validar según códigos SUNAT
3. **Cálculos**: Facilita cálculos de descuentos según régimen
4. **Trazabilidad**: Logs en consola para debugging
5. **Flexibilidad**: Data attributes permiten agregar más información sin cambiar la estructura

---

## 🔍 Debugging

Para ver qué datos están disponibles en los combobox:

```javascript
// Ver todos los tipos de trabajador cargados
$('#tipoTrabajador option').each(function() {
    console.log({
        value: $(this).val(),
        text: $(this).text(),
        tipoId: $(this).attr('data-tipo-id'),
        regimenId: $(this).attr('data-regimen-id')
    });
});

// Ver todos los regímenes cargados
$('#regimenPensionario option').each(function() {
    console.log({
        value: $(this).val(),
        text: $(this).text(),
        codigo: $(this).attr('data-codigo'),
        abreviatura: $(this).attr('data-abreviatura')
    });
});
```
