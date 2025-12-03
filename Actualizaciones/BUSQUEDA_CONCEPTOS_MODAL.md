# ✅ Búsqueda de Conceptos - Modal Conceptos Variables

## 📝 Descripción

Se ha implementado la funcionalidad de **búsqueda de conceptos** en el modal de Conceptos Variables, permitiendo buscar por código o descripción desde la tabla `RRHH_MCONCEPTOS`.

---

## 🎯 Características Implementadas

### 1. **Búsqueda Flexible**
- Busca por **código** o **descripción**
- Acepta **números** o **letras**
- Búsqueda con **LIKE** (coincidencia parcial)
- **Case insensitive** (no distingue mayúsculas/minúsculas)
- Mínimo **2 caracteres** para buscar

### 2. **Resultados Inteligentes**
- **1 resultado** → Selección automática
- **Múltiples resultados** → Lista desplegable para elegir
- **Sin resultados** → Notificación de error
- Límite de **10 resultados** máximo

### 3. **Interfaz Intuitiva**
- Campo de búsqueda con botón 🔍
- Lista desplegable con resultados
- Hover sobre resultados
- Click para seleccionar
- Feedback visual con notificaciones

---

## 🔌 Endpoint Backend

### **GET** `/api/concepto/buscar?empresaId={id}&busqueda={texto}`

Busca conceptos por código o descripción.

**Parámetros:**
- `empresaId` - ID de la empresa
- `busqueda` - Texto a buscar (código o descripción)

**Response:**
```json
{
  "success": true,
  "message": "Conceptos encontrados",
  "data": [
    {
      "id": 1,
      "codigo": "001",
      "descripcion": "BONIFICACION ESPECIAL",
      "tipo_concepto_id": 2
    },
    {
      "id": 5,
      "codigo": "005",
      "descripcion": "BONIFICACION POR PRODUCTIVIDAD",
      "tipo_concepto_id": 2
    }
  ]
}
```

---

## 💡 Ejemplos de Búsqueda

### Ejemplo 1: Búsqueda por Código
```
Usuario escribe: "001"
Click en 🔍 o Enter

Resultado:
✅ Concepto seleccionado: BONIFICACION ESPECIAL
Campo muestra: "001 - BONIFICACION ESPECIAL"
```

### Ejemplo 2: Búsqueda por Descripción
```
Usuario escribe: "bonificacion"
Click en 🔍 o Enter

Resultados múltiples:
┌────────────────────────────────────────────┐
│ 001 - BONIFICACION ESPECIAL               │
│ 005 - BONIFICACION POR PRODUCTIVIDAD      │
│ 012 - BONIFICACION NOCTURNA               │
└────────────────────────────────────────────┘

Usuario hace click en uno
✅ Concepto seleccionado
```

### Ejemplo 3: Búsqueda Parcial
```
Usuario escribe: "bon"
Click en 🔍

Encuentra todos los conceptos que contengan "bon":
- BONIFICACION ESPECIAL
- BONIFICACION POR PRODUCTIVIDAD
- BONIFICACION NOCTURNA
```

### Ejemplo 4: Sin Resultados
```
Usuario escribe: "xyz"
Click en 🔍

❌ No se encontraron conceptos
```

---

## 🎨 Interfaz Visual

### Estado Inicial
```
┌────────────────────────────────────────────┐
│ Buscar Concepto                            │
│ ┌────────────────────────────────────┐ 🔍 │
│ │ Ingresa datos del concepto         │    │
│ └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

### Con Resultados Múltiples
```
┌────────────────────────────────────────────┐
│ Buscar Concepto                            │
│ ┌────────────────────────────────────┐ 🔍 │
│ │ bonificacion                       │    │
│ └────────────────────────────────────┘    │
│                                            │
│ Resultados:                                │
│ ┌────────────────────────────────────────┐ │
│ │ 001 - BONIFICACION ESPECIAL          │ │ ← Hover
│ │ 005 - BONIFICACION POR PRODUCTIVIDAD │ │
│ │ 012 - BONIFICACION NOCTURNA          │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Concepto Seleccionado
```
┌────────────────────────────────────────────┐
│ Buscar Concepto                            │
│ ┌────────────────────────────────────┐ 🔍 │
│ │ 001 - BONIFICACION ESPECIAL        │    │
│ └────────────────────────────────────┘    │
│                                            │
│ ✅ Concepto seleccionado                   │
└────────────────────────────────────────────┘
```

---

## 🔧 Código Implementado

### Backend - Service
```java
public List<Map<String, Object>> buscarConceptos(Long empresaId, String busqueda) {
    String sql = "SELECT " +
            "imconceptos_id as id, " +
            "tc_codigo as codigo, " +
            "tc_descripcion as descripcion, " +
            "ic_tipoconcepto as tipo_concepto_id " +
            "FROM public.rrhh_mconceptos " +
            "WHERE ic_empresa = ? " +
            "AND ic_estado = 1 " +
            "AND (UPPER(tc_codigo) LIKE UPPER(?) OR UPPER(tc_descripcion) LIKE UPPER(?)) " +
            "ORDER BY tc_descripcion " +
            "LIMIT 10";
    
    String busquedaLike = "%" + busqueda + "%";
    return jdbcTemplate.queryForList(sql, empresaId, busquedaLike, busquedaLike);
}
```

### Frontend - JavaScript
```javascript
buscarConcepto: async function() {
    const busqueda = $('#buscarConcepto').val().trim();
    
    // Validaciones
    if (!busqueda) {
        showNotification('Ingrese un concepto para buscar', 'warning');
        return;
    }
    
    if (busqueda.length < 2) {
        showNotification('Ingrese al menos 2 caracteres', 'warning');
        return;
    }
    
    // Buscar en el backend
    const response = await fetch(
        `http://localhost:3000/api/concepto/buscar?empresaId=${this.empresaId}&busqueda=${busqueda}`
    );
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
        if (result.data.length === 1) {
            // Selección automática
            this.conceptoSeleccionado = result.data[0];
            showNotification(`✅ Concepto seleccionado`, 'success');
        } else {
            // Mostrar lista de resultados
            this.mostrarResultadosConcepto(result.data);
        }
    }
}
```

---

## 📊 Tabla: RRHH_MCONCEPTOS

### Estructura
```sql
CREATE TABLE rrhh_mconceptos (
    imconceptos_id BIGSERIAL PRIMARY KEY,
    tc_codigo VARCHAR(20),              -- ← Búsqueda por código
    tc_descripcion VARCHAR(200),        -- ← Búsqueda por descripción
    ic_tipoconcepto BIGINT,
    ic_empresa BIGINT,
    ic_estado INTEGER DEFAULT 1
);
```

### Ejemplos de Datos
```
id | codigo | descripcion                      | tipo_concepto_id
---+--------+----------------------------------+-----------------
1  | 001    | BONIFICACION ESPECIAL            | 2
2  | 002    | HORAS EXTRAS                     | 2
3  | 003    | COMISION POR VENTAS              | 2
4  | 004    | MOVILIDAD                        | 2
5  | 005    | BONIFICACION POR PRODUCTIVIDAD   | 2
```

---

## 🔄 Flujo de Búsqueda

### Flujo Completo
```
Usuario escribe en campo "Buscar Concepto"
    ↓
Click en 🔍 o presiona Enter
    ↓
JavaScript valida (mínimo 2 caracteres)
    ↓
Envía request al backend
    ↓
Backend busca en RRHH_MCONCEPTOS
    ↓
Retorna resultados (máximo 10)
    ↓
Frontend procesa resultados:
    ├─ 1 resultado → Selección automática
    ├─ Múltiples → Muestra lista desplegable
    └─ 0 resultados → Notificación de error
    ↓
Usuario selecciona de la lista (si hay múltiples)
    ↓
Concepto queda seleccionado
    ↓
Usuario puede agregar trabajadores con ese concepto
```

---

## ✨ Validaciones

### Frontend
1. **Campo vacío** → "Ingrese un concepto para buscar"
2. **Menos de 2 caracteres** → "Ingrese al menos 2 caracteres"
3. **Sin resultados** → "No se encontraron conceptos"

### Backend
1. **Empresa válida** → Filtra por `ic_empresa`
2. **Solo activos** → Filtra por `ic_estado = 1`
3. **Límite de resultados** → Máximo 10 con `LIMIT 10`

---

## 🎯 Casos de Uso

### Caso 1: Bonificación Mensual
```
1. Usuario abre modal
2. Escribe: "bonificacion"
3. Aparecen 3 resultados
4. Selecciona: "001 - BONIFICACION ESPECIAL"
5. Agrega trabajadores
6. Guarda → Todos reciben bonificación especial
```

### Caso 2: Horas Extras
```
1. Usuario abre modal
2. Escribe: "002"
3. Selección automática: "002 - HORAS EXTRAS"
4. Agrega trabajadores con sus valores
5. Guarda → Registra horas extras
```

### Caso 3: Comisiones
```
1. Usuario abre modal
2. Escribe: "comision"
3. Selecciona: "003 - COMISION POR VENTAS"
4. Agrega vendedores con sus comisiones
5. Guarda → Registra comisiones
```

---

## 📝 Archivos Creados/Modificados

### Backend
- ✅ `ConceptoController.java` - Endpoint de búsqueda
- ✅ `ConceptoService.java` - Lógica de búsqueda

### Frontend
- ✅ `conceptos-variables.js` - Función buscarConcepto()
- ✅ `conceptos-variables.html` - Estilos CSS para resultados

---

## 🎯 Estado: ✅ COMPLETADO

La búsqueda de conceptos está completamente implementada. Los usuarios pueden buscar por código o descripción, y el sistema muestra los resultados de forma inteligente (selección automática o lista desplegable).

---

## 🚀 Para Usar

1. **Reiniciar backend** - Para cargar los nuevos controllers
2. **Abrir modal** - Click en "Nuevo"
3. **Buscar concepto**:
   - Escribir código: "001"
   - O descripción: "bonificacion"
4. **Seleccionar** - Click en resultado si hay múltiples
5. **Agregar trabajadores** - Con el concepto seleccionado
6. **Guardar** - Registra todos los conceptos variables
