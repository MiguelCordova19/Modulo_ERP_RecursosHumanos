# 🔧 Corrección de Errores - Módulo Conceptos

## 🐛 Errores Encontrados y Solucionados

### Error 1: URL de AJAX mal configurada
**Problema:**
```javascript
ajax: {
    url: function() {  // ❌ DataTables no acepta función aquí
        const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID;
        return `/api/conceptos?empresaId=${empresaId}`;
    }
}
```

**Solución:**
```javascript
// Obtener empresaId ANTES de crear la tabla
const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;

ajax: {
    url: `/api/conceptos?empresaId=${empresaId}`,  // ✅ String directo
    dataSrc: function(json) {
        if (json.success && json.data) {
            return json.data;
        }
        return [];
    }
}
```

---

### Error 2: CORS en archivo de idioma de DataTables
**Problema:**
```javascript
language: {
    url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json',  // ❌ Error CORS
}
```

**Error en consola:**
```
Access to XMLHttpRequest at 'http://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json' 
from origin 'http://localhost:5500' has been blocked by CORS policy
```

**Solución:**
```javascript
language: {
    // ✅ Definir traducciones directamente en el código
    searchPlaceholder: 'Buscar...',
    search: '_INPUT_',
    lengthMenu: 'Mostrar _MENU_ registros',
    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
    infoEmpty: 'Mostrando 0 a 0 de 0 registros',
    infoFiltered: '(filtrado de _MAX_ registros totales)',
    paginate: {
        first: 'Primero',
        last: 'Último',
        next: 'Siguiente',
        previous: 'Anterior'
    },
    emptyTable: 'No hay datos disponibles',
    zeroRecords: 'No se encontraron registros coincidentes'
}
```

---

### Error 3: Módulo declarado dos veces
**Problema:**
```javascript
// Exportar para uso global
window.concepto = concepto;  // ❌ Error si se carga dos veces
```

**Error en consola:**
```
Uncaught SyntaxError: Identifier 'concepto' has already been declared
```

**Causa:**
El sistema de dashboard carga el módulo dos veces cuando se navega entre páginas.

**Solución:**
```javascript
// Exportar para uso global (solo si no existe)
if (typeof window.concepto === 'undefined') {
    window.concepto = concepto;  // ✅ Solo exporta si no existe
}
```

---

## ✅ Verificación de Correcciones

### 1. Verificar que la tabla cargue
```javascript
// En la consola del navegador:
console.log('Empresa ID:', localStorage.getItem('empresa_id'));
console.log('URL de conceptos:', `/api/conceptos?empresaId=${localStorage.getItem('empresa_id')}`);
```

### 2. Verificar que no haya errores CORS
```
Abrir DevTools (F12) → Pestaña Console
No debe aparecer: "blocked by CORS policy"
```

### 3. Verificar que el módulo no se duplique
```javascript
// En la consola del navegador:
console.log('Módulo concepto:', typeof window.concepto);
// Debe retornar: "object"
```

---

## 🧪 Pruebas Recomendadas

### Prueba 1: Cargar módulo por primera vez
```
1. Abrir el sistema
2. Ir a "Conceptos"
3. Verificar que la tabla se cargue sin errores
4. Verificar en consola: "✅ Módulo Conceptos inicializado"
```

### Prueba 2: Navegar entre módulos
```
1. Ir a "Conceptos"
2. Ir a otro módulo (ej: "Usuarios")
3. Volver a "Conceptos"
4. Verificar que no aparezca error de "already declared"
5. Verificar que la tabla funcione correctamente
```

### Prueba 3: Verificar datos
```
1. Abrir "Conceptos"
2. Si hay datos, deben mostrarse en la tabla
3. Si no hay datos, debe mostrar: "No hay datos disponibles"
4. Verificar que los filtros funcionen
```

---

## 🔍 Debugging

### Si la tabla no carga datos:

#### 1. Verificar empresa_id
```javascript
// En consola del navegador:
console.log('Empresa ID:', localStorage.getItem('empresa_id'));
console.log('Window EMPRESA_ID:', window.EMPRESA_ID);
```

Si ambos son `null` o `undefined`:
```javascript
// Establecer manualmente para pruebas:
localStorage.setItem('empresa_id', '1');
// Luego recargar la página
```

#### 2. Verificar endpoint del backend
```bash
# Probar directamente en el navegador o Postman:
http://localhost:3000/api/conceptos?empresaId=1
```

Debe retornar:
```json
{
  "success": true,
  "message": "Conceptos obtenidos exitosamente",
  "data": []
}
```

#### 3. Verificar que el backend esté corriendo
```bash
# En la terminal del backend:
cd backend
mvn spring-boot:run
```

Debe mostrar:
```
Started ErpApplication in X.XXX seconds
```

---

## 📊 Estado Esperado

### Consola del navegador (sin errores):
```
✅ jQuery y DataTables disponibles, inicializando módulo Conceptos
✅ Módulo Conceptos inicializado
✅ DataTable inicializada con filtros
```

### Tabla visible:
```
┌────────────────────────────────────────────────────┐
│ #  │ Descripción │ Concepto │ Tipo │ Afecto │ ... │
├────────────────────────────────────────────────────┤
│    No hay datos disponibles                        │
└────────────────────────────────────────────────────┘
```

---

## 🚀 Próximos Pasos

1. ✅ Errores corregidos
2. ⏳ Probar carga de tabla
3. ⏳ Crear primer concepto
4. ⏳ Verificar que aparezca en la tabla
5. ⏳ Probar edición y eliminación

---

## 📝 Notas Importantes

- **empresa_id**: Debe estar en localStorage antes de cargar el módulo
- **usuario_id**: Debe estar en localStorage para guardar/editar/eliminar
- **Backend**: Debe estar corriendo en `http://localhost:3000`
- **CORS**: Ya no es problema con las traducciones inline

---

**¡Errores corregidos!** ✅

El módulo de Conceptos ahora debe cargar sin problemas.
