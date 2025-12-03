# ✅ Sistema Completo de Conceptos Variables

## 📝 Descripción

Sistema completo para gestionar conceptos variables de planilla, permitiendo asignar bonificaciones, horas extras, comisiones y otros conceptos a múltiples trabajadores de forma eficiente.

---

## 🗄️ Base de Datos

### Tabla Cabecera: `rrhh_mconceptosvariables`

```sql
CREATE TABLE rrhh_mconceptosvariables (
    imconceptosvariables_id BIGSERIAL PRIMARY KEY,
    icv_mes INTEGER NOT NULL,                    -- Mes (1-12)
    icv_anio INTEGER NOT NULL,                   -- Año
    icv_tipoplanilla BIGINT NOT NULL,            -- FK a rrhh_mtipoplanilla
    icv_conceptos BIGINT NOT NULL,               -- FK a rrhh_mconceptos
    icv_sede BIGINT,                             -- FK a rrhh_msede (opcional)
    icv_empresa BIGINT NOT NULL,                 -- FK a empresa
    icv_estado INTEGER DEFAULT 1,                -- 1=Activo, 0=Inactivo
    icv_usuarioregistro BIGINT,
    fcv_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    icv_usuarioedito BIGINT,
    fcv_fechaedito TIMESTAMP,
    icv_usuarioelimino BIGINT,
    fcv_fechaelimino TIMESTAMP,
    
    CONSTRAINT uk_conceptosvariables_periodo_planilla_concepto 
        UNIQUE (icv_mes, icv_anio, icv_tipoplanilla, icv_conceptos, icv_empresa)
);
```

### Tabla Detalle: `rrhh_mconceptosvariablesdetalle`

```sql
CREATE TABLE rrhh_mconceptosvariablesdetalle (
    imconceptosvariablesdetalle_id BIGSERIAL PRIMARY KEY,
    icvd_conceptosvariables BIGINT NOT NULL,     -- FK a cabecera
    icvd_trabajador BIGINT NOT NULL,             -- FK a rrhh_trabajador
    fcvd_fecha DATE NOT NULL,                    -- Fecha del concepto
    dcvd_valor DECIMAL(10,2) NOT NULL DEFAULT 0, -- Valor/Monto
    icvd_empresa BIGINT NOT NULL,
    icvd_estado INTEGER DEFAULT 1,
    
    CONSTRAINT uk_conceptosvariablesdetalle_cabecera_trabajador 
        UNIQUE (icvd_conceptosvariables, icvd_trabajador)
);
```

---

## 🔧 Stored Procedures

### 1. `sp_guardar_conceptos_variables_batch`
Guarda conceptos variables en lote (cabecera + múltiples detalles).

**Parámetros:**
- `p_anio` - Año
- `p_mes` - Mes
- `p_planilla_id` - ID tipo de planilla
- `p_concepto_id` - ID concepto
- `p_trabajadores` - JSON array con trabajadores
- `p_empresa_id` - ID empresa
- `p_usuario_id` - ID usuario

**Retorna:** ID de la cabecera creada/actualizada

### 2. `sp_listar_conceptos_variables`
Lista conceptos variables con resumen.

**Parámetros:**
- `p_empresa_id` - ID empresa
- `p_anio` - Año (opcional)
- `p_mes` - Mes (opcional)

**Retorna:** Lista con id, anio, mes, tipo_planilla, concepto, total_trabajadores

### 3. `sp_obtener_detalle_conceptos_variables`
Obtiene detalle de un concepto variable.

**Parámetros:**
- `p_cabecera_id` - ID cabecera

**Retorna:** Lista con detalle_id, trabajador_id, numero_documento, nombre_completo, fecha, valor

### 4. `sp_eliminar_conceptos_variables`
Elimina (soft delete) conceptos variables.

**Parámetros:**
- `p_cabecera_id` - ID cabecera
- `p_usuario_id` - ID usuario

**Retorna:** Boolean (true si se eliminó)

---

## 🔌 Endpoints Backend

### 1. **POST** `/api/conceptos-variables/batch`
Guardar conceptos variables en lote.

**Request Body:**
```json
{
  "anio": 2025,
  "mes": 1,
  "planillaId": 1,
  "conceptoId": 5,
  "trabajadores": [
    {
      "trabajadorId": 123,
      "fecha": "2025-01-15",
      "valor": 500.00
    },
    {
      "trabajadorId": 456,
      "fecha": "2025-01-15",
      "valor": 750.00
    }
  ],
  "empresaId": 1,
  "usuarioId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conceptos variables guardados exitosamente",
  "data": 1
}
```

### 2. **GET** `/api/conceptos-variables?empresaId={id}&anio={anio}&mes={mes}`
Listar conceptos variables.

**Response:**
```json
{
  "success": true,
  "message": "Conceptos variables obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "anio": 2025,
      "mes": 1,
      "tipo_planilla": "PLANILLA DE REMUNERACIONES",
      "concepto": "BONIFICACION ESPECIAL",
      "total_trabajadores": 5
    }
  ]
}
```

### 3. **GET** `/api/conceptos-variables/{id}/detalle`
Obtener detalle de conceptos variables.

**Response:**
```json
{
  "success": true,
  "message": "Detalle obtenido exitosamente",
  "data": [
    {
      "detalle_id": 1,
      "trabajador_id": 123,
      "numero_documento": "12345678",
      "nombre_completo": "PEREZ GOMEZ JUAN",
      "fecha": "2025-01-15",
      "valor": 500.00
    }
  ]
}
```

### 4. **DELETE** `/api/conceptos-variables/{id}?usuarioId={id}`
Eliminar conceptos variables.

**Response:**
```json
{
  "success": true,
  "message": "Conceptos variables eliminados exitosamente",
  "data": true
}
```

---

## 🎨 Frontend - Flujo Completo

### 1. Abrir Modal
```javascript
// Usuario hace clic en "Nuevo"
nuevo: function() {
    this.limpiarModal();
    this.establecerPeriodoActual();  // Enero 2025
    modal.show();
}
```

### 2. Seleccionar Período y Planilla
```javascript
// Período: Enero 2025 (automático, editable)
// Planilla: PLANILLA DE REMUNERACIONES (combobox)
```

### 3. Buscar Concepto
```javascript
// Usuario escribe: "bonificacion"
// Sistema busca en rrhh_mconceptos
// Muestra resultados, usuario selecciona
```

### 4. Agregar Trabajadores
```javascript
// Usuario escribe documento o nombre: "12345678"
// Sistema busca en rrhh_trabajador
// Nombre se llena automáticamente (readonly)
// Click en [+] → Agrega a tabla interna
```

### 5. Configurar Valores
```javascript
// En tabla interna, usuario edita:
// - Fecha: 2025-01-15
// - Valor: 500.00
// Repite para más trabajadores
```

### 6. Guardar
```javascript
guardarConceptosVariables: async function() {
    const datos = {
        anio: 2025,
        mes: 1,
        planillaId: 1,
        conceptoId: 5,
        trabajadores: [
            { trabajadorId: 123, fecha: "2025-01-15", valor: 500.00 },
            { trabajadorId: 456, fecha: "2025-01-15", valor: 750.00 }
        ],
        empresaId: 1,
        usuarioId: 1
    };
    
    const response = await fetch('/api/conceptos-variables/batch', {
        method: 'POST',
        body: JSON.stringify(datos)
    });
    
    // Tabla principal se actualiza automáticamente
}
```

---

## 💡 Casos de Uso Completos

### Caso 1: Bonificación Mensual para Equipo
```
1. Abrir modal → Período: Enero 2025
2. Planilla: PLANILLA DE REMUNERACIONES
3. Buscar concepto: "bonificacion especial"
4. Agregar trabajadores:
   - 12345678 - PEREZ JUAN → Valor: 500.00
   - 87654321 - GOMEZ MARIA → Valor: 750.00
   - 11223344 - LOPEZ CARLOS → Valor: 600.00
5. Guardar → 3 conceptos variables registrados
6. Tabla principal muestra: "BONIFICACION ESPECIAL - 3 trabajadores"
```

### Caso 2: Horas Extras del Mes
```
1. Período: Enero 2025
2. Planilla: PLANILLA DE REMUNERACIONES
3. Concepto: "HORAS EXTRAS"
4. Trabajadores:
   - RAMIREZ LUIS → Valor: 350.00
   - CASTRO SOFIA → Valor: 420.00
5. Guardar → 2 conceptos variables registrados
```

### Caso 3: Comisiones por Ventas
```
1. Período: Enero 2025
2. Planilla: PLANILLA DE REMUNERACIONES
3. Concepto: "COMISION POR VENTAS"
4. Trabajadores (vendedores):
   - FLORES ROSA → Valor: 1200.00
   - VEGA MIGUEL → Valor: 980.00
   - TORRES ANA → Valor: 1500.00
5. Guardar → 3 conceptos variables registrados
```

---

## 📊 Estructura de Datos

### Datos Enviados al Backend
```json
{
  "anio": 2025,
  "mes": 1,
  "planillaId": 1,
  "conceptoId": 5,
  "trabajadores": [
    {
      "trabajadorId": 123,
      "fecha": "2025-01-15",
      "valor": 500.00
    }
  ],
  "empresaId": 1,
  "usuarioId": 1
}
```

### Datos en Base de Datos

**Cabecera:**
```
id | mes | anio | tipo_planilla | concepto | empresa | estado
---+-----+------+---------------+----------+---------+--------
1  | 1   | 2025 | 1             | 5        | 1       | 1
```

**Detalle:**
```
id | cabecera | trabajador | fecha      | valor  | estado
---+----------+------------+------------+--------+--------
1  | 1        | 123        | 2025-01-15 | 500.00 | 1
2  | 1        | 456        | 2025-01-15 | 750.00 | 1
```

---

## 📝 Archivos Creados

### Base de Datos
- ✅ `sql/crear_tablas_conceptos_variables.sql` - Tablas + SPs

### Backend
- ✅ `ConceptosVariablesController.java` - Endpoints REST
- ✅ `ConceptosVariablesService.java` - Lógica de negocio
- ✅ `ConceptoController.java` - Búsqueda de conceptos
- ✅ `ConceptoService.java` - Lógica búsqueda conceptos
- ✅ `TrabajadorController.java` - Búsqueda de trabajadores
- ✅ `TrabajadorService.java` - Lógica búsqueda trabajadores
- ✅ `TipoPlanillaController.java` - Tipos de planilla
- ✅ `TipoPlanillaService.java` - Lógica tipos planilla

### Frontend
- ✅ `frontend/modules/conceptos-variables.html` - Vista completa
- ✅ `frontend/js/modules/conceptos-variables.js` - Lógica completa

---

## 🚀 Para Usar

### 1. Ejecutar Script SQL
```bash
psql -U usuario -d base_datos -f sql/crear_tablas_conceptos_variables.sql
```

### 2. Reiniciar Backend
El backend cargará automáticamente todos los controllers y services.

### 3. Usar el Sistema
1. Navegar a "Conceptos Variables"
2. Click en "Nuevo"
3. Seleccionar período y planilla
4. Buscar concepto
5. Agregar trabajadores con sus valores
6. Guardar

---

## 🎯 Estado: ✅ COMPLETADO

El sistema completo de Conceptos Variables está implementado y listo para usar:
- ✅ Base de datos (cabecera + detalle)
- ✅ Stored procedures
- ✅ Endpoints backend
- ✅ Frontend con modal completo
- ✅ Búsqueda de conceptos
- ✅ Búsqueda de trabajadores
- ✅ Guardado en lote
- ✅ Listado y detalle
- ✅ Eliminación

---

## ✨ Características Destacadas

1. **Guardado en Lote**: Múltiples trabajadores en una sola operación
2. **Búsqueda Inteligente**: Conceptos y trabajadores con autocompletado
3. **Validaciones**: Previene duplicados y datos inválidos
4. **Auditoría**: Registra usuario y fecha de cada operación
5. **Soft Delete**: Los registros no se eliminan físicamente
6. **Tabla Interna**: Previsualización antes de guardar
7. **DataTables**: Paginación, búsqueda y ordenamiento
8. **Responsive**: Se adapta a diferentes tamaños de pantalla
