# ✅ Modal de Conceptos Variables - Múltiples Trabajadores

## 📝 Descripción

Se ha implementado un **modal mejorado** para el módulo de Conceptos Variables que permite agregar el mismo concepto a múltiples trabajadores de forma eficiente, con una tabla interna para gestionar los registros antes de guardar.

---

## 🎯 Características Implementadas

### 1. **Interfaz de Usuario Mejorada**
- Modal de tamaño XL para mejor visualización
- Filtros superiores: Período y Planilla
- Búsqueda de concepto por texto
- Búsqueda de trabajador por número de documento
- Tabla interna con trabajadores agregados
- Paginación integrada

### 2. **Flujo de Trabajo**
1. Seleccionar período (mes/año)
2. Seleccionar tipo de planilla
3. Buscar y seleccionar concepto
4. Buscar trabajador por documento
5. Agregar trabajador a la tabla
6. Definir fecha y valor para cada trabajador
7. Guardar todos los registros en lote

### 3. **Tabla Interna de Trabajadores**
- Columnas: #, Nro Doc, Trabajador, Fecha, Valor, Acciones
- Edición inline de fecha y valor
- Botón eliminar por trabajador
- Paginación (10, 25, 50, 100 registros)
- Contador de registros

---

## 🎨 Interfaz del Modal

```
┌────────────────────────────────────────────────────────────────────┐
│ 📄 Nuevo Conceptos Variables                                  [X] │
├────────────────────────────────────────────────────────────────────┤
│ Período: [Diciembre de 2025]    Planilla: [* SELECCIONE *]       │
│                                                                     │
│ Buscar Concepto: [Ingresa datos del concepto]            [🔍]     │
│                                                                     │
│ Nro Doc: [Ingresa un Nro de Documento]                            │
│ Nombre Completo: [_____________________]                    [+]   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ # │ Nro Doc │ Trabajador │ Fecha      │ Valor    │ ⚙️      │   │
│ ├───┼─────────┼────────────┼────────────┼──────────┼────────┤   │
│ │ 1 │12345678 │ PEREZ JUAN │ 2025-12-15 │ 500.00   │ [🗑️]  │   │
│ │ 2 │87654321 │ GOMEZ MARIA│ 2025-12-15 │ 750.00   │ [🗑️]  │   │
│ └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│ Mostrar [10 ▼] registros    Mostrando 1 a 2 de 2 registros       │
│                                                                     │
│                    [Anterior]  [Siguiente]                         │
├────────────────────────────────────────────────────────────────────┤
│                    [❌ Cancelar]  [💾 Guardar]                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Uso

### Paso 1: Abrir Modal
```javascript
// Usuario hace clic en botón "Nuevo"
// Se abre modal vacío con período actual
```

### Paso 2: Configurar Período y Planilla
```javascript
// Seleccionar: Diciembre de 2025
// Seleccionar: Planilla Mensual
```

### Paso 3: Buscar Concepto
```javascript
// Escribir: "Bonificación"
// Click en 🔍 o Enter
// Sistema busca y selecciona el concepto
// Notificación: "Concepto seleccionado: Bonificación Especial"
```

### Paso 4: Agregar Trabajadores
```javascript
// Ingresar documento: 12345678
// Sistema busca automáticamente (blur o Enter)
// Nombre se llena automáticamente: "PEREZ GOMEZ JUAN"
// Click en botón [+]
// Trabajador se agrega a la tabla
```

### Paso 5: Configurar Valores
```javascript
// En la tabla, editar:
// - Fecha: 2025-12-15
// - Valor: 500.00
// Repetir para cada trabajador
```

### Paso 6: Guardar
```javascript
// Click en botón "Guardar"
// Sistema valida:
//   ✓ Período seleccionado
//   ✓ Planilla seleccionada
//   ✓ Concepto seleccionado
//   ✓ Al menos un trabajador agregado
// Guarda todos los registros en lote
// Notificación: "5 conceptos variables guardados exitosamente"
```

---

## 💡 Casos de Uso

### Caso 1: Bonificación para Equipo de Ventas
```
Período: Diciembre 2025
Planilla: Mensual
Concepto: Bonificación por Ventas

Trabajadores:
1. PEREZ JUAN     - Fecha: 2025-12-15 - Valor: 500.00
2. GOMEZ MARIA    - Fecha: 2025-12-15 - Valor: 750.00
3. LOPEZ CARLOS   - Fecha: 2025-12-15 - Valor: 600.00
4. TORRES ANA     - Fecha: 2025-12-15 - Valor: 800.00
5. SILVA PEDRO    - Fecha: 2025-12-15 - Valor: 550.00

✅ Guardado: 5 conceptos variables
```

### Caso 2: Horas Extras del Mes
```
Período: Noviembre 2025
Planilla: Mensual
Concepto: Horas Extras

Trabajadores:
1. RAMIREZ LUIS   - Fecha: 2025-11-30 - Valor: 350.00
2. CASTRO SOFIA   - Fecha: 2025-11-30 - Valor: 420.00
3. MENDEZ JORGE   - Fecha: 2025-11-30 - Valor: 280.00

✅ Guardado: 3 conceptos variables
```

### Caso 3: Descuento por Préstamo
```
Período: Diciembre 2025
Planilla: Mensual
Concepto: Descuento Préstamo

Trabajadores:
1. FLORES ROSA    - Fecha: 2025-12-01 - Valor: -200.00
2. VEGA MIGUEL    - Fecha: 2025-12-01 - Valor: -150.00

✅ Guardado: 2 conceptos variables
```

---

## 🔧 Funciones JavaScript Implementadas

### 1. Buscar Concepto
```javascript
buscarConcepto: async function() {
    const busqueda = $('#buscarConcepto').val().trim();
    
    const response = await fetch(
        `http://localhost:3000/api/concepto/buscar?empresaId=${this.empresaId}&busqueda=${busqueda}`
    );
    
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
        this.conceptoSeleccionado = result.data[0];
        showNotification(`Concepto seleccionado: ${this.conceptoSeleccionado.descripcion}`, 'success');
    }
}
```

### 2. Buscar Trabajador por Documento
```javascript
buscarTrabajadorPorDoc: async function() {
    const nroDoc = $('#nroDocTrabajador').val().trim();
    
    const response = await fetch(
        `http://localhost:3000/api/trabajador/buscar-por-doc?empresaId=${this.empresaId}&nroDoc=${nroDoc}`
    );
    
    const result = await response.json();
    
    if (result.success && result.data) {
        const trabajador = result.data;
        const nombreCompleto = `${trabajador.apellido_paterno} ${trabajador.apellido_materno} ${trabajador.nombres}`;
        $('#nombreTrabajador').val(nombreCompleto).data('trabajador-id', trabajador.id);
    }
}
```

### 3. Agregar Trabajador
```javascript
agregarTrabajador: function() {
    const trabajadorId = $('#nombreTrabajador').data('trabajador-id');
    
    // Validaciones
    if (!trabajadorId) {
        showNotification('Debe buscar y seleccionar un trabajador válido', 'warning');
        return;
    }
    
    if (!this.conceptoSeleccionado) {
        showNotification('Debe buscar y seleccionar un concepto primero', 'warning');
        return;
    }
    
    // Verificar duplicados
    const yaExiste = this.trabajadoresAgregados.some(t => t.trabajadorId === trabajadorId);
    if (yaExiste) {
        showNotification('Este trabajador ya fue agregado', 'warning');
        return;
    }
    
    // Agregar a la lista
    this.trabajadoresAgregados.push({
        trabajadorId: trabajadorId,
        nroDoc: nroDoc,
        nombreCompleto: nombreCompleto,
        fecha: new Date().toISOString().split('T')[0],
        valor: 0
    });
    
    this.renderizarTablaTrabajadores();
}
```

### 4. Renderizar Tabla con Paginación
```javascript
renderizarTablaTrabajadores: function() {
    const tbody = $('#tbodyConceptosVariables');
    tbody.empty();
    
    // Calcular paginación
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = Math.min(inicio + this.registrosPorPagina, this.trabajadoresAgregados.length);
    const trabajadoresPagina = this.trabajadoresAgregados.slice(inicio, fin);
    
    // Renderizar filas
    trabajadoresPagina.forEach((trabajador, index) => {
        tbody.append(`
            <tr>
                <td>${inicio + index + 1}</td>
                <td>${trabajador.nroDoc}</td>
                <td>${trabajador.nombreCompleto}</td>
                <td><input type="date" value="${trabajador.fecha}" /></td>
                <td><input type="number" value="${trabajador.valor}" /></td>
                <td><button class="btn-eliminar">🗑️</button></td>
            </tr>
        `);
    });
}
```

### 5. Guardar en Lote
```javascript
guardarConceptosVariables: async function() {
    const datos = {
        anio: parseInt(anio),
        mes: parseInt(mes),
        planillaId: parseInt(planillaId),
        conceptoId: this.conceptoSeleccionado.id,
        trabajadores: this.trabajadoresAgregados.map(t => ({
            trabajadorId: t.trabajadorId,
            fecha: t.fecha,
            valor: t.valor
        })),
        empresaId: this.empresaId,
        usuarioId: parseInt(localStorage.getItem('usuario_id'))
    };
    
    const response = await fetch('http://localhost:3000/api/conceptos-variables/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    
    const result = await response.json();
    
    if (result.success) {
        showNotification(`${this.trabajadoresAgregados.length} conceptos variables guardados`, 'success');
    }
}
```

---

## 📊 Estructura de Datos

### Array de Trabajadores Agregados
```javascript
trabajadoresAgregados = [
    {
        trabajadorId: 123,
        nroDoc: "12345678",
        nombreCompleto: "PEREZ GOMEZ JUAN",
        fecha: "2025-12-15",
        valor: 500.00
    },
    {
        trabajadorId: 456,
        nroDoc: "87654321",
        nombreCompleto: "GOMEZ LOPEZ MARIA",
        fecha: "2025-12-15",
        valor: 750.00
    }
]
```

### Datos Enviados al Backend
```json
{
  "anio": 2025,
  "mes": 12,
  "planillaId": 1,
  "conceptoId": 45,
  "trabajadores": [
    {
      "trabajadorId": 123,
      "fecha": "2025-12-15",
      "valor": 500.00
    },
    {
      "trabajadorId": 456,
      "fecha": "2025-12-15",
      "valor": 750.00
    }
  ],
  "empresaId": 1,
  "usuarioId": 1
}
```

---

## ✨ Ventajas del Nuevo Modal

1. **Eficiencia**: Agregar múltiples trabajadores con el mismo concepto en una sola operación
2. **Validación Previa**: Ver todos los registros antes de guardar
3. **Edición Flexible**: Modificar fecha y valor de cada trabajador individualmente
4. **Prevención de Duplicados**: No permite agregar el mismo trabajador dos veces
5. **Búsqueda Rápida**: Buscar concepto y trabajador sin combos largos
6. **Paginación**: Manejar grandes cantidades de trabajadores
7. **Feedback Visual**: Ver exactamente qué se va a guardar

---

## 🔌 Endpoints Necesarios (Backend)

### 1. Buscar Concepto
```
GET /api/concepto/buscar?empresaId=1&busqueda=bonificacion
```

### 2. Buscar Trabajador por Documento
```
GET /api/trabajador/buscar-por-doc?empresaId=1&nroDoc=12345678
```

### 3. Guardar en Lote
```
POST /api/conceptos-variables/batch
Body: { anio, mes, planillaId, conceptoId, trabajadores[], empresaId, usuarioId }
```

---

## 📝 Archivos Modificados

### Frontend
- ✅ `frontend/modules/conceptos-variables.html` - Nuevo modal con tabla interna
- ✅ `frontend/js/modules/conceptos-variables.js` - Lógica completa del modal

---

## 🎯 Estado: ✅ COMPLETADO (Frontend)

El modal está completamente implementado en el frontend. Para que funcione completamente, se necesitan implementar los endpoints en el backend:
1. Buscar concepto por texto
2. Buscar trabajador por documento
3. Guardar conceptos variables en lote

---

## 🚀 Próximos Pasos

1. **Backend**: Implementar los 3 endpoints necesarios
2. **Validaciones**: Agregar validaciones adicionales (valores negativos, fechas futuras, etc.)
3. **Mejoras**: 
   - Autocompletar en búsqueda de concepto
   - Sugerencias de trabajadores
   - Importar desde Excel
   - Copiar valores a todos los trabajadores
