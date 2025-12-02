# Implementación de Tipo Trabajador en Módulo de Contrato

## Resumen de Cambios

Se ha implementado la carga dinámica de tipos de trabajador en el módulo de contrato, obteniendo los datos de la tabla `RRHH_MTIPOTRABAJADOR` según la empresa seleccionada.

## Cambios Realizados

### 1. Frontend - HTML (contrato.html)
- ✅ Agregado spinner de carga animado en el campo de búsqueda de trabajadores
- El spinner aparece mientras se busca un trabajador por DNI o nombre

### 2. Frontend - JavaScript (contrato.js)

#### Función `cargarTiposTrabajador()`
```javascript
- Endpoint: GET /api/tipo-trabajador?empresaId={empresaId}
- Carga tipos de trabajador filtrados por empresa
- Muestra: {codigoInterno} - {descripcion}
- Guarda en data attributes:
  * data-tipo-id: ID del tipo SUNAT
  * data-tipo-codigo: Código SUNAT del tipo
  * data-regimen-id: ID del régimen pensionario
  * data-regimen-codigo: Código SUNAT del régimen
```

#### Evento onChange del select
```javascript
- Detecta cuando se selecciona un tipo de trabajador
- Extrae y muestra en consola:
  * ID del tipo trabajador
  * ID y código del tipo SUNAT
  * ID y código del régimen pensionario
- Disponible para uso futuro en validaciones o lógica de negocio
```

#### Spinner de búsqueda
```javascript
- Se muestra al buscar trabajadores (después de 2 caracteres)
- Se oculta automáticamente al completar la búsqueda
- Se oculta al seleccionar un trabajador
- Se oculta si hay error en la búsqueda
```

## Estructura de Datos

### Tabla: RRHH_MTIPOTRABAJADOR
```
- imtipotrabajador_id: ID único
- ttt_codigointerno: Código de 3 dígitos
- itt_tipo: FK a rrhh_mtipo (Tipo SUNAT)
- itt_regimenpensionario: FK a rrhh_mregimenpensionario
- ttt_descripcion: Descripción del tipo
- itt_estado: Estado (1=activo, 0=inactivo)
- empresa_id: ID de la empresa
```

### Respuesta del API
```json
{
  "success": true,
  "message": "Tipos de trabajador obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "codigoInterno": "001",
      "descripcion": "EMPLEADO",
      "estado": 1,
      "empresaId": 1,
      "tipo": {
        "id": 1,
        "codSunat": "01",
        "descripcion": "TRABAJADOR"
      },
      "regimenPensionario": {
        "id": 1,
        "codSunat": "01",
        "abreviatura": "SNP"
      }
    }
  ]
}
```

## Uso en el Formulario

1. Al abrir el modal de "Nuevo Contrato", se cargan automáticamente los tipos de trabajador
2. El combobox muestra: "001 - EMPLEADO"
3. Al seleccionar un tipo, se puede acceder a:
   - ID del tipo trabajador (para guardar en BD)
   - ID del tipo SUNAT (para validaciones)
   - ID del régimen pensionario (para cálculos)

## Ejemplo de Acceso a Datos

```javascript
// Obtener el tipo de trabajador seleccionado
const tipoTrabajadorId = $('#tipoTrabajador').val();

// Obtener datos adicionales
const selectedOption = $('#tipoTrabajador').find('option:selected');
const tipoId = selectedOption.attr('data-tipo-id');
const regimenId = selectedOption.attr('data-regimen-id');

console.log('Tipo Trabajador:', tipoTrabajadorId);
console.log('Tipo SUNAT:', tipoId);
console.log('Régimen Pensionario:', regimenId);
```

## Régimen Pensionario

### Endpoint
```
GET /api/regimenes
```

### Tabla: RRHH_MREGIMENPENSIONARIO
```
- imregimenpensionario_id: ID único
- trp_codsunat: Código SUNAT (ej: "02", "21")
- trp_descripcion: Descripción completa
- trp_abreviatura: Abreviatura (ej: "ONP", "INTEGRA")
```

### Función `cargarRegimenesPensionarios()`
```javascript
- Endpoint: GET /api/regimenes
- Muestra: {codSunat} - {abreviatura}
- Ejemplo: "02 - ONP"
- Guarda en data attributes:
  * data-codigo: Código SUNAT
  * data-descripcion: Descripción completa
  * data-abreviatura: Abreviatura
```

### Evento onChange
```javascript
$('#regimenPensionario').on('change', function() {
    const selectedOption = $(this).find('option:selected');
    const codigo = selectedOption.attr('data-codigo');
    const descripcion = selectedOption.attr('data-descripcion');
    const abreviatura = selectedOption.attr('data-abreviatura');
});
```

### Selección Automática desde Tipo Trabajador
Cuando se selecciona un Tipo de Trabajador, el Régimen Pensionario se selecciona y bloquea automáticamente:

```javascript
$('#tipoTrabajador').on('change', function() {
    const regimenId = $(this).find('option:selected').attr('data-regimen-id');
    
    if (regimenId) {
        // Seleccionar automáticamente
        $('#regimenPensionario').val(regimenId);
        // Bloquear el campo
        $('#regimenPensionario').prop('disabled', true);
        $('#regimenPensionario').css('background-color', '#e9ecef');
    }
});
```

**Comportamiento:**
- ✅ Al seleccionar Tipo Trabajador → Régimen Pensionario se selecciona automáticamente
- ✅ El campo Régimen Pensionario se bloquea (disabled)
- ✅ Se aplica estilo visual de campo bloqueado (fondo gris)
- ✅ Al abrir nuevo modal → Campo se desbloquea
- ✅ Al cerrar modal → Campo se desbloquea

### Datos de Ejemplo
```
02 - ONP (DECRETO LEY 1990 - SISTEMA NACIONAL DE PENSIONES - ONP)
21 - INTEGRA (SPP INTEGRA)
```

## Próximos Pasos

- Implementar la función `guardar()` del contrato
- Usar los IDs de tipo y régimen para validaciones
- Implementar lógica de cálculo según el régimen pensionario
- Agregar validaciones de campos requeridos

## Notas Técnicas

- El endpoint ya existía en el backend (`TipoTrabajadorController`)
- Se usa el mismo endpoint que el módulo de tipo-trabajador
- Los datos se filtran por empresa automáticamente
- El spinner usa clases de Bootstrap 5
- Los data attributes permiten acceso rápido a información relacionada
