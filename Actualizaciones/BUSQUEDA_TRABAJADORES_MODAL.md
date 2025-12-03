# ✅ Búsqueda de Trabajadores - Modal Conceptos Variables

## 📝 Descripción

Se ha implementado la funcionalidad de **búsqueda de trabajadores** por número de documento o nombre en el modal de Conceptos Variables, con autocompletado y selección inteligente.

---

## 🎯 Características Implementadas

### 1. **Búsqueda Flexible**
- Busca por **número de documento** o **nombre completo**
- Búsqueda en **tiempo real** (mientras escribe)
- **Debounce** de 500ms para optimizar requests
- Mínimo **2 caracteres** para buscar

### 2. **Resultados Inteligentes**
- **1 resultado** → Selección automática
- **Múltiples resultados** → Lista desplegable
- **Sin resultados** → Notificación de error
- Límite de **10 resultados** máximo

### 3. **Campo Nombre Readonly**
- Se llena automáticamente al encontrar trabajador
- **No editable** (readonly)
- Solo se puede modificar buscando otro trabajador

### 4. **Botón Agregar (+)**
- Agrega el trabajador seleccionado a la tabla
- Valida que haya un trabajador seleccionado
- Valida que haya un concepto seleccionado
- Previene duplicados

---

## 🔌 Endpoints Backend

### 1. **GET** `/api/trabajador/buscar?empresaId={id}&busqueda={texto}`

Busca trabajadores por documento o nombre.

**Response:**
```json
{
  "success": true,
  "message": "Trabajadores encontrados",
  "data": [
    {
      "id": 123,
      "numero_documento": "12345678",
      "apellido_paterno": "PEREZ",
      "apellido_materno": "GOMEZ",
      "nombres": "JUAN",
      "nombre_completo": "PEREZ GOMEZ JUAN"
    }
  ]
}
```

### 2. **GET** `/api/trabajador/buscar-por-doc?empresaId={id}&nroDoc={doc}`

Busca un trabajador específico por documento (legacy).

---

## 💡 Ejemplos de Búsqueda

### Ejemplo 1: Búsqueda por Documento
```
Usuario escribe: "12345678"
Búsqueda automática después de 500ms

Resultado:
✅ Trabajador seleccionado: PEREZ GOMEZ JUAN
Campo "Nro Doc": 12345678
Campo "Nombre Completo": PEREZ GOMEZ JUAN (readonly)
```

### Ejemplo 2: Búsqueda por Nombre
```
Usuario escribe: "juan"
Búsqueda automática

Resultados múltiples:
┌────────────────────────────────────────────┐
│ 12345678 - PEREZ GOMEZ JUAN               │
│ 87654321 - LOPEZ MARTINEZ JUAN            │
│ 11223344 - GARCIA RODRIGUEZ JUAN CARLOS   │
└────────────────────────────────────────────┘

Usuario hace click en uno
✅ Trabajador seleccionado
```

### Ejemplo 3: Búsqueda Parcial por Apellido
```
Usuario escribe: "per"
Búsqueda automática

Encuentra:
- PEREZ GOMEZ JUAN
- PEREZ LOPEZ MARIA
- PEREIRA SANTOS CARLOS
```

### Ejemplo 4: Sin Resultados
```
Usuario escribe: "xyz"
Búsqueda automática

❌ Trabajador no encontrado
Campo "Nombre Completo" se limpia
```

---

## 🎨 Interfaz Visual

### Estado Inicial
```
┌────────────────────────────────────────────┐
│ Nro Doc                  Nombre Completo   │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ Ingresa Nro Doc  │ │ (readonly)       │ │
│ └──────────────────┘ └──────────────────┘ │
│                                        [+] │
└────────────────────────────────────────────┘
```

### Escribiendo (Búsqueda Automática)
```
┌────────────────────────────────────────────┐
│ Nro Doc                  Nombre Completo   │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ 123...           │ │ (readonly)       │ │
│ └──────────────────┘ └──────────────────┘ │
│                                        [+] │
│ 🔍 Buscando...                             │
└────────────────────────────────────────────┘
```

### Con Resultados Múltiples
```
┌────────────────────────────────────────────┐
│ Nro Doc                  Nombre Completo   │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ juan             │ │ (readonly)       │ │
│ └──────────────────┘ └──────────────────┘ │
│                                        [+] │
│                                            │
│ Resultados:                                │
│ ┌────────────────────────────────────────┐ │
│ │ 12345678 - PEREZ GOMEZ JUAN          │ │ ← Hover
│ │ 87654321 - LOPEZ MARTINEZ JUAN       │ │
│ │ 11223344 - GARCIA RODRIGUEZ JUAN C.  │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Trabajador Seleccionado
```
┌────────────────────────────────────────────┐
│ Nro Doc                  Nombre Completo   │
│ ┌──────────────────┐ ┌──────────────────┐ │
│ │ 12345678         │ │ PEREZ GOMEZ JUAN │ │
│ └──────────────────┘ └──────────────────┘ │
│                                        [+] │
│ ✅ Trabajador seleccionado                 │
└────────────────────────────────────────────┘
```

---

## 🔄 Flujo Completo

### Flujo de Búsqueda y Agregado
```
Usuario escribe en "Nro Doc"
    ↓
Espera 500ms (debounce)
    ↓
Envía request al backend
    ↓
Backend busca en rrhh_trabajador + rrhh_mcontratotrabajador
    ↓
Retorna resultados (máximo 10)
    ↓
Frontend procesa:
    ├─ 1 resultado → Selección automática
    ├─ Múltiples → Muestra lista desplegable
    └─ 0 resultados → Notificación de error
    ↓
Usuario selecciona (si hay múltiples)
    ↓
Campo "Nombre Completo" se llena (readonly)
    ↓
Usuario hace click en botón [+]
    ↓
Validaciones:
    ├─ ¿Hay concepto seleccionado? → Sí
    ├─ ¿Hay trabajador seleccionado? → Sí
    └─ ¿Ya está en la tabla? → No
    ↓
Trabajador se agrega a la tabla
    ↓
Campos se limpian para agregar otro
```

---

## 🔧 Código Implementado

### Backend - Service
```java
public List<Map<String, Object>> buscarTrabajadores(Long empresaId, String busqueda) {
    String sql = "SELECT " +
            "t.itrabajador_id as id, " +
            "t.tt_nrodoc as numero_documento, " +
            "CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres) as nombre_completo " +
            "FROM public.rrhh_trabajador t " +
            "INNER JOIN public.rrhh_mcontratotrabajador c ON t.itrabajador_id = c.ict_trabajador " +
            "WHERE c.ict_empresa = ? " +
            "AND c.ict_estado = 1 " +
            "AND (" +
            "    t.tt_nrodoc LIKE ? " +
            "    OR UPPER(CONCAT(...)) LIKE UPPER(?)" +
            ") " +
            "ORDER BY t.tt_apellidopaterno " +
            "LIMIT 10";
    
    String busquedaLike = "%" + busqueda + "%";
    return jdbcTemplate.queryForList(sql, empresaId, busquedaLike, busquedaLike);
}
```

### Frontend - JavaScript
```javascript
// Búsqueda con debounce
let timeoutBusquedaTrabajador;
$('#nroDocTrabajador').on('input', function() {
    clearTimeout(timeoutBusquedaTrabajador);
    timeoutBusquedaTrabajador = setTimeout(function() {
        buscarTrabajadorPorDoc();
    }, 500);
});

// Función de búsqueda
buscarTrabajadorPorDoc: async function() {
    const busqueda = $('#nroDocTrabajador').val().trim();
    
    if (busqueda.length < 2) return;
    
    const response = await fetch(
        `http://localhost:3000/api/trabajador/buscar?empresaId=${this.empresaId}&busqueda=${busqueda}`
    );
    
    const result = await response.json();
    
    if (result.data.length === 1) {
        // Selección automática
        this.seleccionarTrabajador(result.data[0]);
    } else if (result.data.length > 1) {
        // Mostrar lista
        this.mostrarResultadosTrabajador(result.data);
    }
}
```

---

## ✨ Validaciones

### Al Buscar
1. **Mínimo 2 caracteres** → No busca si hay menos
2. **Debounce 500ms** → Evita requests excesivos
3. **Solo trabajadores activos** → Filtra por `ict_estado = 1`
4. **Solo de la empresa** → Filtra por `ict_empresa`

### Al Agregar
1. **Concepto seleccionado** → "Debe buscar y seleccionar un concepto primero"
2. **Trabajador seleccionado** → "Debe buscar y seleccionar un trabajador válido"
3. **No duplicado** → "Este trabajador ya fue agregado"

---

## 📊 Tablas Utilizadas

### rrhh_trabajador
```sql
- itrabajador_id (PK)
- tt_nrodoc          -- ← Búsqueda por documento
- tt_apellidopaterno -- ← Búsqueda por nombre
- tt_apellidomaterno
- tt_nombres
```

### rrhh_mcontratotrabajador
```sql
- ict_trabajador (FK)
- ict_empresa    -- ← Filtro por empresa
- ict_estado     -- ← Solo activos (1)
```

---

## 🎯 Casos de Uso

### Caso 1: Agregar Bonificación a Varios Trabajadores
```
1. Buscar concepto: "bonificacion"
2. Buscar trabajador: "12345678"
3. Nombre se llena: "PEREZ GOMEZ JUAN"
4. Click en [+]
5. Trabajador agregado a la tabla
6. Repetir para más trabajadores
7. Guardar todos juntos
```

### Caso 2: Buscar por Nombre
```
1. Buscar concepto: "horas extras"
2. Escribir en Nro Doc: "maria"
3. Aparecen 3 Marías
4. Seleccionar: "GOMEZ LOPEZ MARIA"
5. Click en [+]
6. Agregada a la tabla
```

---

## 📝 Archivos Creados/Modificados

### Backend
- ✅ `TrabajadorController.java` - Endpoints de búsqueda
- ✅ `TrabajadorService.java` - Lógica de búsqueda

### Frontend
- ✅ `conceptos-variables.js` - Búsqueda con debounce y autocompletado
- ✅ `conceptos-variables.html` - Campo readonly

---

## 🎯 Estado: ✅ COMPLETADO

La búsqueda de trabajadores está completamente implementada con autocompletado, búsqueda en tiempo real, y campo readonly para el nombre completo.

---

## 🚀 Para Usar

1. **Reiniciar backend** - Cargar nuevos controllers
2. **Abrir modal** - Click en "Nuevo"
3. **Buscar concepto** - Seleccionar concepto
4. **Buscar trabajador**:
   - Por documento: "12345678"
   - Por nombre: "juan perez"
5. **Nombre se llena automáticamente** (readonly)
6. **Click en [+]** - Agregar a la tabla
7. **Repetir** para más trabajadores
8. **Guardar** - Registra todos los conceptos variables
