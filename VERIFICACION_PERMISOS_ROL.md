# 🔐 Verificación de Permisos por Rol

## ✅ Corrección Aplicada

Se corrigió el problema donde todos los usuarios veían todos los menús independientemente de su rol.

### Problema Identificado
El dashboard estaba intentando leer el rol desde `localStorage.getItem('usuario')` (que no existe), en lugar de leer directamente `localStorage.getItem('rol_id')`.

### Solución Implementada
```javascript
// ANTES (❌ Incorrecto)
const usuarioData = JSON.parse(localStorage.getItem('usuario'));
const rolId = usuarioData?.rolId || 1;

// DESPUÉS (✅ Correcto)
const rolId = localStorage.getItem('rol_id') || '1';
const rolIdInt = parseInt(rolId);
```

## 🧪 Cómo Probar

### 1. Verificar Asignación de Permisos

Primero, asegúrate de que los roles tengan permisos asignados:

```sql
-- Ver permisos del rol
SELECT 
    r.id as rol_id,
    r.tu_descripcion as rol,
    m.id as menu_id,
    m.tu_nombre as menu,
    rm.iu_estado as estado
FROM rrhh_drol r
LEFT JOIN rrhh_drol_menu rm ON r.id = rm.iu_rol_id
LEFT JOIN rrhh_mmenu m ON rm.iu_menu_id = m.id
WHERE r.id = [ID_DEL_ROL]
ORDER BY m.iu_posicion;
```

### 2. Asignar Permisos a un Rol

Si un rol no tiene permisos asignados:

1. Ve al módulo "Asignar Permisos a Rol"
2. Selecciona el rol
3. Marca los menús que debe ver
4. Guarda los cambios

### 3. Probar con Diferentes Usuarios

#### Paso 1: Crear Usuario con Rol Limitado
```sql
-- Verificar que el usuario tenga un rol específico
SELECT 
    id,
    tu_usuario,
    tu_nombres,
    iu_rol_id
FROM rrhh_musuario
WHERE tu_usuario = 'usuario_prueba';
```

#### Paso 2: Iniciar Sesión
1. Cierra sesión si estás logueado
2. Inicia sesión con el usuario de prueba
3. Abre la consola del navegador (F12)

#### Paso 3: Verificar en Consola
Deberías ver estos logs:
```
🔐 Cargando menús para rol: [ID_DEL_ROL]
✅ Menús cargados con permisos para rol [ID_DEL_ROL]: [CANTIDAD] menús
```

#### Paso 4: Verificar localStorage
En la consola del navegador, ejecuta:
```javascript
console.log('Rol ID:', localStorage.getItem('rol_id'));
console.log('Usuario:', localStorage.getItem('usuario'));
console.log('Empresa ID:', localStorage.getItem('empresa_id'));
```

### 4. Comparar Menús Visibles

#### Usuario con Rol DASHBOARD (id=1)
- ✅ Debe ver TODOS los menús del sistema
- Este es el rol de superadministrador

#### Usuario con Rol Limitado (id > 1)
- ✅ Solo debe ver los menús asignados a su rol
- Si no tiene permisos asignados, no verá ningún menú

## 🔍 Verificación del Backend

### Endpoint de Menús por Rol
```bash
# Probar endpoint directamente
curl http://localhost:3000/api/menus/rol/2

# Respuesta esperada:
{
  "success": true,
  "message": "Menús con permisos obtenidos",
  "data": [
    {
      "menu_id": 1,
      "menu_ruta": "dashboard",
      "menu_icon": "fas fa-home",
      "menu_nombre": "Dashboard",
      "menu_estado": 1,
      "menu_padre": null,
      "menu_nivel": 1,
      "menu_posicion": 1,
      "hijos": []
    }
  ]
}
```

### Verificar Permisos en BD
```sql
-- Ver qué menús tiene asignados un rol
SELECT 
    rm.iu_rol_id,
    rm.iu_menu_id,
    m.tu_nombre as menu_nombre,
    rm.iu_estado
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.iu_menu_id = m.id
WHERE rm.iu_rol_id = 2 
  AND rm.iu_estado = 1;
```

## 📊 Casos de Prueba

### Caso 1: Rol sin Permisos
**Configuración:**
- Rol ID: 3
- Permisos asignados: Ninguno

**Resultado Esperado:**
- Sidebar vacío o mensaje "No hay menús disponibles"

### Caso 2: Rol con Permisos Limitados
**Configuración:**
- Rol ID: 2
- Permisos asignados: Dashboard, Usuarios (solo lectura)

**Resultado Esperado:**
- Solo ve menús: Dashboard y Usuarios
- No ve: Empresas, Roles, Asignar Permisos, etc.

### Caso 3: Rol DASHBOARD (Superadmin)
**Configuración:**
- Rol ID: 1

**Resultado Esperado:**
- Ve TODOS los menús del sistema
- Acceso completo

### Caso 4: Rol con Submenús
**Configuración:**
- Rol ID: 4
- Permisos asignados: 
  - Recursos Humanos (padre)
  - Empleados (hijo)
  - Contratos (hijo)

**Resultado Esperado:**
- Ve el menú padre "Recursos Humanos"
- Al expandir, ve solo "Empleados" y "Contratos"
- No ve otros submenús no asignados

## 🐛 Solución de Problemas

### Problema: Usuario ve todos los menús
**Causa:** El rol_id no se está guardando correctamente en localStorage

**Solución:**
1. Verifica en la consola: `localStorage.getItem('rol_id')`
2. Si es null, el problema está en el login
3. Cierra sesión y vuelve a iniciar sesión

### Problema: Usuario no ve ningún menú
**Causa:** El rol no tiene permisos asignados

**Solución:**
1. Verifica en BD: `SELECT * FROM rrhh_drol_menu WHERE iu_rol_id = [ID]`
2. Asigna permisos desde el módulo "Asignar Permisos a Rol"

### Problema: Menús aparecen pero no cargan
**Causa:** El usuario tiene permiso al menú pero no al módulo

**Solución:**
- Esto es normal, los permisos solo controlan visibilidad
- Para controlar acceso a funciones, implementar permisos a nivel de API

### Problema: Error 404 en /api/menus/rol/undefined
**Causa:** El rol_id no se está leyendo correctamente

**Solución:**
1. Verifica que el dashboard.js tenga la corrección aplicada
2. Limpia caché del navegador (Ctrl + Shift + R)
3. Cierra sesión y vuelve a iniciar

## 🎯 Checklist de Verificación

- [ ] El login guarda `rol_id` en localStorage
- [ ] El dashboard lee `rol_id` correctamente
- [ ] El endpoint `/api/menus/rol/{rolId}` funciona
- [ ] Los permisos están asignados en la tabla `rrhh_drol_menu`
- [ ] Usuario con rol limitado solo ve sus menús
- [ ] Usuario con rol DASHBOARD ve todos los menús
- [ ] Los logs en consola muestran el rol correcto
- [ ] Los menús se cargan según los permisos

## 📝 Notas Importantes

1. **Rol DASHBOARD (id=1)** es especial:
   - Siempre ve todos los menús
   - No necesita permisos asignados
   - Es el superadministrador

2. **Otros roles** necesitan permisos explícitos:
   - Deben tener registros en `rrhh_drol_menu`
   - Solo ven menús con `iu_estado = 1`

3. **Jerarquía de menús:**
   - Si asignas un menú hijo, el padre se muestra automáticamente
   - Si solo asignas el padre, no se muestran los hijos

4. **Actualización de permisos:**
   - Los cambios en permisos requieren cerrar sesión y volver a entrar
   - O hacer click en "Actualizar Menús" si existe el botón

## 🚀 Mejoras Futuras Sugeridas

1. **Caché de permisos:** Guardar permisos en localStorage para evitar consultas repetidas
2. **Actualización en tiempo real:** WebSocket para actualizar permisos sin cerrar sesión
3. **Permisos granulares:** Controlar no solo visibilidad sino también acciones (crear, editar, eliminar)
4. **Auditoría:** Registrar intentos de acceso a menús sin permiso
5. **Roles múltiples:** Permitir que un usuario tenga varios roles
