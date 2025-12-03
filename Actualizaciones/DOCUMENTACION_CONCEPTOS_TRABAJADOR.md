# Sistema de Conceptos de Trabajador

## Descripción
Sistema completo para gestionar los conceptos asignados a cada trabajador según su contrato.

## Estructura de la Base de Datos

### Tabla: `rrhh_mconceptostrabajador`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| imconceptostrabajador_id | BIGINT | ID único (PK) |
| ict_contratotrabajador | BIGINT | ID del contrato (FK) |
| ict_conceptos | BIGINT | ID del concepto (FK) |
| ict_tipo | INTEGER | 1=VARIABLE, 2=FIJO |
| ict_tipovalor | INTEGER | 1=MONTO, 2=PORCENTAJE |
| dct_valor | DECIMAL(10,2) | Valor del concepto |
| ict_empresa | INTEGER | ID de la empresa |
| ict_estado | INTEGER | 1=Activo, 0=Inactivo |
| ict_usuarioregistro | BIGINT | Usuario que registró |
| fct_fecharegistro | TIMESTAMP | Fecha de registro |
| ict_usuarioedito | BIGINT | Usuario que editó |
| fct_fechaedito | TIMESTAMP | Fecha de edición |
| ict_usuarioelimino | BIGINT | Usuario que eliminó |
| fct_fechaelimino | TIMESTAMP | Fecha de eliminación |

## Endpoints REST

### 1. Guardar Conceptos de Trabajador

**POST** `/api/conceptos-trabajador?usuarioId={usuarioId}`

**Request Body:**
```json
{
  "contratoId": 123,
  "empresaId": 1,
  "conceptos": [
    {
      "conceptoId": 45,
      "codigo": "0121",
      "descripcion": "REMUNERACION BASICA",
      "tipo": "FIJO",
      "tipoValor": "MONTO",
      "valor": 1500.00
    },
    {
      "conceptoId": 46,
      "codigo": "0804",
      "descripcion": "ESSALUD",
      "tipo": "FIJO",
      "tipoValor": "PORCENTAJE",
      "valor": 9.00
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conceptos guardados exitosamente",
  "data": true
}
```

### 2. Obtener Conceptos de Trabajador

**GET** `/api/conceptos-trabajador/contrato/{contratoId}?empresaId={empresaId}`

**Response:**
```json
{
  "success": true,
  "message": "Conceptos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "contrato_id": 123,
      "concepto_id": 45,
      "concepto_codigo": "0121",
      "concepto_descripcion": "REMUNERACION BASICA",
      "tipo": "FIJO",
      "tipo_valor": "MONTO",
      "valor": 1500.00
    },
    {
      "id": 2,
      "contrato_id": 123,
      "concepto_id": 46,
      "concepto_codigo": "0804",
      "concepto_descripcion": "ESSALUD",
      "tipo": "FIJO",
      "tipo_valor": "PORCENTAJE",
      "valor": 9.00
    }
  ]
}
```

### 3. Eliminar Conceptos de Trabajador

**DELETE** `/api/conceptos-trabajador/contrato/{contratoId}?empresaId={empresaId}&usuarioId={usuarioId}`

**Response:**
```json
{
  "success": true,
  "message": "Conceptos eliminados exitosamente",
  "data": true
}
```

### 4. Obtener Conceptos por Empresa

**GET** `/api/conceptos-trabajador/empresa/{empresaId}`

**Response:**
```json
{
  "success": true,
  "message": "Conceptos eliminados exitosamente",
  "data": true
}
```

## Procedimientos Almacenados

### 1. sp_guardar_conceptos_trabajador
Guarda los conceptos de un trabajador (elimina los anteriores y crea nuevos).

**Parámetros:**
- `p_contrato_id`: ID del contrato
- `p_conceptos_json`: JSON array con los conceptos
- `p_empresa_id`: ID de la empresa
- `p_usuario_id`: ID del usuario

**Ejemplo de uso:**
```sql
SELECT public.sp_guardar_conceptos_trabajador(
    123,
    '[{"conceptoId":45,"tipo":"FIJO","tipoValor":"MONTO","valor":1500.00}]'::TEXT,
    1,
    1
);
```

### 2. sp_obtener_conceptos_trabajador
Obtiene los conceptos de un trabajador por contrato y empresa.

**Parámetros:**
- `p_contrato_id`: ID del contrato
- `p_empresa_id`: ID de la empresa

**Ejemplo de uso:**
```sql
SELECT * FROM public.sp_obtener_conceptos_trabajador(123, 1);
```

### 3. sp_eliminar_conceptos_trabajador
Elimina todos los conceptos de un contrato (soft delete).

**Parámetros:**
- `p_contrato_id`: ID del contrato
- `p_empresa_id`: ID de la empresa
- `p_usuario_id`: ID del usuario

**Ejemplo de uso:**
```sql
SELECT public.sp_eliminar_conceptos_trabajador(123, 1, 1);
```

## Flujo de Trabajo

### 1. Crear Contrato
1. Usuario crea un nuevo contrato
2. Sistema guarda el contrato
3. Automáticamente se abre el modal de conceptos
4. Se cargan los conceptos del régimen laboral seleccionado
5. Usuario puede modificar valores o agregar/eliminar conceptos
6. Usuario guarda los conceptos

### 2. Editar Conceptos
1. Usuario hace clic en "Modificar conceptos" desde el menú de acciones
2. Sistema carga los conceptos guardados del trabajador
3. Usuario modifica los conceptos
4. Usuario guarda los cambios

### 3. Tipos de Conceptos

**Tipo:**
- **VARIABLE**: El valor puede cambiar cada mes
- **FIJO**: El valor es constante

**Tipo Valor:**
- **MONTO**: Valor en dinero (ej: 1500.00)
- **PORCENTAJE**: Valor en porcentaje (ej: 9.00 para 9%)

## Ejemplos de Conceptos Comunes

| Concepto | Tipo | Tipo Valor | Valor Típico |
|----------|------|------------|--------------|
| Remuneración Básica | FIJO | MONTO | Sueldo del trabajador |
| ESSALUD | FIJO | PORCENTAJE | 9.00 |
| Bonificación 9% | FIJO | PORCENTAJE | 9.00 |
| AFP | FIJO | PORCENTAJE | Variable según AFP |
| ONP | FIJO | PORCENTAJE | 13.00 |
| Horas Extras | VARIABLE | MONTO | Variable |
| Bonificación | VARIABLE | MONTO | Variable |
| Descuentos | VARIABLE | MONTO | Variable |

## Instalación

### 1. Ejecutar Script SQL
```bash
psql -U usuario -d nombre_bd -f sql/crear_tabla_conceptos_trabajador.sql
```

### 2. Compilar Backend
Los archivos Java se compilarán automáticamente con el proyecto Spring Boot.

### 3. Frontend
El código JavaScript ya está integrado en `frontend/js/modules/contrato.js`.

## Notas Importantes

1. **Soft Delete**: Los conceptos no se eliminan físicamente, solo se marcan como inactivos (estado = 0)

2. **Reemplazo Completo**: Al guardar conceptos, se eliminan (soft delete) los anteriores y se crean nuevos

3. **Validaciones**: El frontend valida que cada concepto tenga tipo valor y valor antes de guardar

4. **Pre-llenado**: Al crear un contrato, los conceptos se pre-llenan con valores sugeridos según el régimen laboral

5. **Auditoría**: Todos los cambios quedan registrados con usuario y fecha

## Troubleshooting

### Error: "El ID del contrato es requerido"
- Verificar que se esté enviando `contratoId` en el request body

### Error: "El ID de la empresa es requerido"
- Verificar que se esté enviando `empresaId` en el request body
- Verificar que `localStorage.getItem('empresa_id')` tenga un valor válido

### Error: "Debe proporcionar al menos un concepto"
- Verificar que el array `conceptos` no esté vacío

### No se cargan los conceptos
- Verificar que el contrato exista
- Verificar que haya conceptos guardados para ese contrato
- Revisar la consola del navegador para ver errores

### Los valores no se guardan correctamente
- Verificar que los valores sean números válidos
- Verificar que el tipo y tipo valor estén seleccionados
