# Solución al Error del Módulo Trabajador

## 🐛 Problema Identificado

El módulo de trabajadores no se cargaba correctamente y mostraba los siguientes errores:
1. `Uncaught SyntaxError: Async functions can only be declared at the top level or inside a block`
2. `❌ Módulo trabajador no encontrado`
3. La tabla no se cargaba y el botón "Nuevo" no funcionaba

## 🔧 Causas del Problema

### 1. Error de Sintaxis en JavaScript
Las funciones `editar()`, `eliminar()`, `exportar()` y `consultar()` se agregaron **fuera** del objeto `trabajador`, después del cierre `};`, lo que causaba un error de sintaxis.

### 2. Problema de Carga del Módulo
El script se estaba cargando con `<script src="...">` pero el objeto no estaba disponible cuando se intentaba inicializar.

## ✅ Soluciones Aplicadas

### 1. Corrección de la Estructura del Objeto JavaScript

**Antes (INCORRECTO):**
```javascript
const trabajador = {
    // ... funciones ...
    consultar: function() {
        // ...
    }
};

// Exportar
window.trabajador = trabajador;

// ❌ ESTAS FUNCIONES ESTABAN FUERA DEL OBJETO
editar: async function(id) {
    // ...
}
```

**Después (CORRECTO):**
```javascript
const trabajador = {
    // ... funciones ...
    consultar: function() {
        // ...
    },
    
    // ✅ FUNCIONES DENTRO DEL OBJETO
    editar: async function(id) {
        // ...
    },
    
    eliminar: function(id) {
        // ...
    },
    
    exportar: function() {
        // ...
    }
};

// Exportar
window.trabajador = trabajador;
```

### 2. Mejora en la Carga del Módulo

**Antes:**
```html
<script src="/js/modules/trabajador.js"></script>
<script>
    // Intentaba usar el módulo inmediatamente
    if (typeof trabajador !== 'undefined') {
        trabajador.init();
    }
</script>
```

**Después:**
```html
<script>
    (function initTrabajador() {
        // Esperar a que jQuery y DataTables estén disponibles
        if (typeof jQuery === 'undefined' || typeof $.fn.DataTable === 'undefined') {
            setTimeout(initTrabajador, 100);
            return;
        }
        
        // Cargar el script dinámicamente
        if (typeof window.trabajador === 'undefined') {
            $.getScript('/js/modules/trabajador.js')
                .done(function() {
                    window.trabajador.init();
                })
                .fail(function(jqxhr, settings, exception) {
                    console.error('Error al cargar trabajador.js:', exception);
                });
        } else {
            window.trabajador.init();
        }
    })();
</script>
```

### 3. Cambios Adicionales

- Cambié `const trabajador = window.trabajador || {` a `const trabajador = {` para evitar conflictos
- Moví la exportación `window.trabajador = trabajador;` antes del `$(document).ready()`
- Aseguré que todas las funciones estén dentro del objeto

## 📝 Archivos Modificados

1. **frontend/js/modules/trabajador.js**
   - Corregida la estructura del objeto
   - Todas las funciones ahora están dentro del objeto `trabajador`
   - Sintaxis validada con Node.js

2. **frontend/modules/trabajador.html**
   - Mejorado el script de inicialización
   - Ahora usa `$.getScript()` para carga dinámica
   - Mejor manejo de errores

## 🧪 Verificación

Para verificar que el archivo JavaScript es sintácticamente correcto:
```bash
cd frontend/js/modules
node -c trabajador.js
```

Si no hay salida, el archivo es válido.

## 🚀 Cómo Probar

1. **Limpiar caché del navegador:**
   - Presionar `Ctrl + Shift + Delete`
   - O `Ctrl + F5` para recargar sin caché

2. **Abrir la consola del navegador:**
   - Presionar `F12`
   - Ir a la pestaña "Console"

3. **Navegar al módulo Trabajador:**
   - Hacer clic en el menú "Trabajador"

4. **Verificar los logs:**
   Deberías ver:
   ```
   ✅ jQuery y DataTables disponibles
   📥 Cargando módulo trabajador...
   ✅ Módulo trabajador cargado exitosamente
   ✅ Módulo Trabajador inicializado
   ```

5. **Probar funcionalidades:**
   - La tabla debe cargarse automáticamente
   - El botón "Nuevo" debe abrir el modal
   - Los selects deben cargarse con datos
   - El botón "Guardar" debe funcionar

## ⚠️ Troubleshooting

### Si sigue sin funcionar:

1. **Verificar que el backend esté corriendo:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Verificar que la tabla exista en la base de datos:**
   ```sql
   SELECT * FROM rrhh_trabajador LIMIT 1;
   ```

3. **Verificar los endpoints en el navegador:**
   - Abrir: `http://localhost:8080/api/trabajadores/empresa/1`
   - Debe devolver JSON con `success: true`

4. **Verificar que los maestros estén disponibles:**
   - `/api/tipos-documento`
   - `/api/generos`
   - `/api/estados-civiles`
   - `/api/regimenes-laborales`
   - `/api/tipos-pago`
   - `/api/bancos`
   - `/api/tipos-cuenta`

### Error: "Failed to load resource"

Si ves este error, verifica:
- Que el archivo `trabajador.js` exista en `frontend/js/modules/`
- Que el servidor web esté sirviendo archivos estáticos correctamente
- Que la ruta sea correcta (con o sin `/` al inicio)

### Error: "DataTable is not a function"

Si ves este error:
- Verifica que jQuery esté cargado antes que DataTables
- Verifica que DataTables esté cargado correctamente
- Revisa el orden de los scripts en `index.html`

## 📊 Resultado Esperado

Después de aplicar estos cambios:
- ✅ El módulo se carga sin errores
- ✅ La tabla muestra los trabajadores
- ✅ El botón "Nuevo" abre el modal
- ✅ Los formularios tienen validación
- ✅ Se puede guardar, editar y eliminar trabajadores
- ✅ Los selects se cargan dinámicamente

## 🎯 Próximos Pasos

Una vez que el módulo funcione correctamente:
1. Probar crear un trabajador nuevo
2. Probar editar un trabajador existente
3. Probar eliminar un trabajador
4. Verificar las validaciones de campos
5. Implementar las funcionalidades dinámicas pendientes
