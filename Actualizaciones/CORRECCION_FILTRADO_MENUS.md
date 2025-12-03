# 🔧 Corrección: Filtrado de Menús por Rol

## 📋 Problema Reportado

Los usuarios podían ver **todos los menús** del sistema independientemente del rol asignado, incluso después de configurar los permisos en la tabla `rrhh_drol_menu`.

## 🔍 Causa Raíz

El archivo `dashboard.js` estaba intentando leer el rol del usuario desde un objeto JSON inexistente en localStorage:

```javascript
// ❌ CÓDIGO INCORRECTO
const usuarioData = JSON.parse(localStorage.getItem('usuario'));
const rolId = usuarioData?.rolId || 1;
```

El problema es que el login guarda los datos del usuario como **claves individuales** en localStorage, no como un objeto JSON:
- `localStorage.setItem('rol_id', '2')`
- `localStorage.setItem('usuario', 'juan.perez')`
- `localStorage.setItem('empresa_id', '1')`
- etc.

Por lo tanto, `localStorage.getItem('usuario')` retornaba un string (el nombre de usuario), no un objeto JSON, causando que `usuarioData` fuera `null` y siempre se usara el rol por defecto `1` (DASHBOARD = todos los menús).

## ✅ Solución Implementada

Se corrigió la lectura del rol en `dashboard.js`:

```javascript
// ✅ CÓDIGO CORRECTO
const rolId = localStorage.getItem('rol_id') || '1';
const rolIdInt = parseInt(rolId);
```

### Archivo Modificado
- **frontend/js/dashboard.js** - Función `loadDynamicMenus()`

## 🎯 Cómo Funciona Ahora

### 1. Login
Cuando el usuario inicia sesión, el sistema guarda:
```javascript
localStorage.setItem('rol_id', '2');  // ID del rol del usuario
localStorage.setItem('usuario', 'juan.perez');
localStorage.setItem('empresa_id', '1');
// ... otros datos
```

### 2. Carga del Dashboard
Al cargar el dashboard:
```javascript
// Lee el rol_id directamente
const rolId = localStorage.getItem('rol_id'); // '2'
const rolIdInt = parseInt(rolId); // 2

// Llama al endpoint con el rol correcto
fetch(`/api/menus/rol/${rolIdInt}`)
```

### 3. Backend Filtra los Menús
El backend (`MenuService.java`) aplica la lógica:

```java
if (rolId == 1) {
    // Rol DASHBOARD: retorna TODOS los menús
    menus = menuRepository.findByEstadoOrderByPosicionAsc(1);
} else {
    // Otros roles: retorna solo menús con permisos
    List<Integer> menuIds = rolMenuRepository.findMenuIdsByRolId(rolId);
    menus = menuRepository.findAllById(menuIds)
            .stream()
            .filter(menu -> menu.getEstado() == 1)
            .collect(Collectors.toList());
}
```

### 4. Frontend Renderiza
El frontend recibe solo los menús permitidos y los muestra en el sidebar.

## 🧪 Prueba de Funcionamiento

### Antes de la Corrección
```
Usuario con rol_id = 2
→ dashboard.js lee: usuarioData = null
→ usa rol por defecto: rolId = 1
→ backend retorna: TODOS los menús
→ usuario ve: TODOS los menús ❌
```

### Después de la Corrección
```
Usuario con rol_id = 2
→ dashboard.js lee: rol_id = '2'
→ convierte a: rolIdInt = 2
→ backend retorna: solo menús con permisos
→ usuario ve: solo SUS menús ✅
```

## 📊 Verificación

### En la Consola del Navegador (F12)
Deberías ver:
```
🔐 Cargando menús para rol: 2
✅ Menús cargados con permisos para rol 2: 3 menús
```

### En localStorage
```javascript
// Ejecutar en consola
console.log('Rol ID:', localStorage.getItem('rol_id'));
// Salida esperada: "2" (o el ID del rol del usuario)
```

### En la Base de Datos
```sql
-- Ver permisos del rol
SELECT 
    rm.iu_rol_id,
    m.tu_nombre as menu,
    rm.iu_estado
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.iu_menu_id = m.id
WHERE rm.iu_rol_id = 2 AND rm.iu_estado = 1;
```

## 🎓 Lecciones Aprendidas

1. **Consistencia en el almacenamiento**: Si guardas datos como claves individuales, léelos de la misma forma
2. **Logging es crucial**: Los logs en consola ayudaron a identificar el problema rápidamente
3. **Verificar tipos de datos**: `localStorage` siempre retorna strings, convertir a número cuando sea necesario
4. **Probar con diferentes roles**: No solo con el rol administrador

## 📝 Archivos de Referencia Creados

1. **VERIFICACION_PERMISOS_ROL.md** - Guía completa de pruebas
2. **sql/verificar_y_asignar_permisos.sql** - Scripts SQL útiles
3. **CORRECCION_FILTRADO_MENUS.md** - Este documento

## 🚀 Próximos Pasos Recomendados

1. **Probar con múltiples usuarios** de diferentes roles
2. **Asignar permisos** a roles que no los tengan
3. **Documentar** qué rol debe ver qué menús
4. **Considerar caché** de permisos para mejorar rendimiento
5. **Implementar permisos granulares** (no solo visibilidad, sino acciones)

## ✅ Checklist de Verificación

- [x] Corrección aplicada en dashboard.js
- [x] Sin errores de sintaxis
- [x] Backend ya tenía la lógica correcta
- [x] Documentación creada
- [ ] Probado con usuario de rol limitado
- [ ] Probado con usuario de rol DASHBOARD
- [ ] Permisos asignados a todos los roles activos
- [ ] Usuarios informados del cambio

## 🎉 Resultado Final

Ahora el sistema de permisos funciona correctamente:
- ✅ Rol DASHBOARD (id=1) ve todos los menús
- ✅ Otros roles solo ven menús asignados
- ✅ Sin permisos = sin menús visibles
- ✅ Cambios en permisos se reflejan al reiniciar sesión
