# Solución: Datos desaparecen al cambiar de módulo

## 🔍 Problema Identificado

Cuando cambias de pestaña/módulo y regresas, los datos desaparecen de las tablas DataTables.

## 🎯 Causa Raíz

El problema ocurre por cómo se cargan los módulos dinámicamente:

1. **Primera carga**: 
   - Se carga el HTML del módulo
   - Se ejecuta el JavaScript
   - Se inicializa DataTable
   - Se cargan los datos

2. **Al cambiar de módulo**:
   - El HTML del módulo anterior se reemplaza
   - Pero la instancia de DataTable queda en memoria

3. **Al regresar al módulo**:
   - Se carga el HTML nuevamente
   - El JavaScript detecta que ya existe una instancia de DataTable
   - Intenta reutilizarla, pero el DOM ya no coincide
   - **Resultado**: Tabla vacía o con errores

## ✅ Solución Implementada

### 1. **Eliminar variables de control globales**

**Antes:**
```javascript
if (!window.rolesModuloInicializado) {
    roles.init();
    window.rolesModuloInicializado = true;
} else {
    roles.cargarRoles(); // Esto fallaba
}
```

**Ahora:**
```javascript
// Siempre reinicializar cuando se carga el módulo
console.log('🔄 Inicializando módulo de roles...');

// Destruir DataTable anterior si existe
if ($.fn.DataTable.isDataTable('#tablaRoles')) {
    $('#tablaRoles').DataTable().destroy();
}

// Inicializar el módulo
roles.init();
```

### 2. **Mejorar la inicialización de DataTable**

**Antes:**
```javascript
inicializarDataTable: function() {
    if ($.fn.DataTable.isDataTable('#tablaRoles')) {
        $('#tablaRoles').DataTable().destroy();
    }
    
    this.table = $('#tablaRoles').DataTable({ ... });
}
```

**Ahora:**
```javascript
inicializarDataTable: function() {
    // Verificar que la tabla existe en el DOM
    if (!$('#tablaRoles').length) {
        console.warn('⚠️ Tabla no encontrada');
        return;
    }
    
    // Destruir instancia anterior
    if ($.fn.DataTable.isDataTable('#tablaRoles')) {
        $('#tablaRoles').DataTable().destroy();
        $('#tablaRoles').empty(); // Limpiar contenido
    }
    
    this.table = $('#tablaRoles').DataTable({ ... });
}
```

## 🔧 Cambios Aplicados

### Archivos Modificados:

1. ✅ `frontend/js/modules/rol.js`
   - Eliminada variable `window.rolesModuloInicializado`
   - Siempre reinicializa al cargar el módulo
   - Destruye DataTable anterior correctamente

2. ✅ `frontend/js/modules/usuarios.js`
   - Eliminada variable `window.usuariosModuloInicializado`
   - Siempre reinicializa al cargar el módulo
   - Destruye DataTable anterior correctamente

## 📋 Ventajas de la Solución

✅ **Consistencia**: Cada vez que cargas un módulo, se inicializa desde cero
✅ **Sin memoria residual**: Se destruyen instancias anteriores de DataTable
✅ **Datos siempre frescos**: Se recargan los datos del backend cada vez
✅ **Sin conflictos**: No hay conflictos entre instancias de DataTable
✅ **Más simple**: Menos lógica condicional, más predecible

## 🎯 Resultado

Ahora cuando:
1. Cargas el módulo de Roles → Se muestran los datos ✅
2. Cambias a otro módulo → El módulo anterior se limpia ✅
3. Regresas a Roles → Se reinicializa y muestra los datos ✅

## 📝 Notas Importantes

- **No es un problema de Bootstrap**: Es un problema de gestión de estado de DataTables
- **Aplica a todos los módulos**: Cualquier módulo con DataTables debe seguir este patrón
- **Performance**: La reinicialización es rápida y no afecta la experiencia del usuario
- **Datos del backend**: Siempre se obtienen datos frescos del servidor

## 🔄 Patrón Recomendado para Nuevos Módulos

```javascript
// Al final del archivo JS del módulo
$(document).ready(function() {
    console.log('🔄 Inicializando módulo...');
    
    // Destruir DataTable anterior si existe
    if ($.fn.DataTable.isDataTable('#miTabla')) {
        $('#miTabla').DataTable().destroy();
    }
    
    // Inicializar el módulo
    miModulo.init();
});
```

## ✨ Conclusión

El problema estaba en intentar reutilizar instancias de DataTable entre cargas de módulos. La solución es **siempre reinicializar** cuando se carga un módulo, destruyendo correctamente las instancias anteriores.
