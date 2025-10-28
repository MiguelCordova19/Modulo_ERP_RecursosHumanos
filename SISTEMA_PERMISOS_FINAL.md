# 🔐 Sistema de Permisos - Configuración Final

## ✅ Cambios Implementados

### 1. Nuevo Enfoque de Permisos
**ANTES:** El rol ID=1 veía todos los menús automáticamente
**AHORA:** TODOS los roles necesitan permisos explícitos en `rrhh_drol_menu`

### 2. Archivos Modificados

#### Backend
- **MenuService.java** - Eliminada lógica especial para rol ID=1
- **LoginResponse.java** - Agregado campo `rolId`
- **AuthService.java** - Incluye `rolId` en respuesta de login

#### Frontend
- **login.html** - Guarda correctamente `rol_id` en localStorage
- **dashboard.js** - Valida que exista `rol_id` antes de cargar menús

## 🚀 Pasos para Configurar

### Paso 1: Reiniciar el Backend
```bash
cd backend
mvn spring-boot:run
```

### Paso 2: Asignar Permisos a los Roles

Ejecuta este SQL para asignar TODOS los menús a un rol administrador:

```sql
-- Ver los roles disponibles
SELECT id, tr_descripcion, ir_empresa 
FROM rrhh_mrol 
WHERE ir_estado = 1;

-- Asignar TODOS los menús al rol (cambiar el ID según tu caso)
DELETE FROM rrhh_drol_menu WHERE iu_rol_id = 3;

INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 
    3 as iu_rol_id,  -- CAMBIAR por tu rol administrador
    id as iu_menu_id,
    1 as iu_estado
FROM rrhh_mmenu
WHERE iu_estado = 1;

-- Verificar
SELECT COUNT(*) as menus_asignados
FROM rrhh_drol_menu
WHERE iu_rol_id = 3 AND iu_estado = 1;
```

### Paso 3: Limpiar Caché del Navegador

1. Presiona **Ctrl + Shift + Delete**
2. Selecciona "Cookies y datos de sitios"
3. Click en "Borrar datos"
4. Cierra TODAS las pestañas del navegador

### Paso 4: Iniciar Sesión

1. Abre el navegador (o usa modo incógnito)
2. Ve a tu aplicación
3. Inicia sesión con un usuario que tenga el rol configurado
4. Abre la consola (F12) y verifica:

```javascript
console.log('rol_id:', localStorage.getItem('rol_id'));
// Debería mostrar el ID del rol, por ejemplo: "3"
```

### Paso 5: Verificar Menús

En la consola deberías ver:
```
🔐 Cargando menús para rol: 3
✅ Menús cargados con permisos para rol 3: X menús
```

## 📊 Estructura de Permisos

### Tabla: rrhh_drol_menu
```
iu_rol_id    | iu_menu_id | iu_estado
-------------|------------|----------
3            | 1          | 1
3            | 2          | 1
3            | 3          | 1
...
```

### Relaciones
- `iu_rol_id` → `rrhh_mrol.id` (Rol de la empresa)
- `iu_menu_id` → `rrhh_mmenu.id` (Menú del sistema)
- `iu_estado` → 1 = Activo, 0 = Inactivo

## 🎯 Casos de Uso

### Caso 1: Rol Administrador Total
**Objetivo:** Ver TODOS los menús del sistema

**Solución:**
```sql
-- Asignar todos los menús
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 3, id, 1 FROM rrhh_mmenu WHERE iu_estado = 1;
```

### Caso 2: Rol de Recursos Humanos
**Objetivo:** Solo ver menús de RRHH

**Solución:**
```sql
-- Asignar solo menús de RRHH
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 4, id, 1 
FROM rrhh_mmenu 
WHERE iu_estado = 1
  AND (tu_nombre LIKE '%Recursos Humanos%' 
    OR tu_nombre LIKE '%Empleado%'
    OR tu_nombre LIKE '%Contrato%');
```

### Caso 3: Rol de Solo Lectura
**Objetivo:** Ver menús pero sin acceso a crear/editar

**Solución:**
```sql
-- Asignar menús de consulta
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 5, id, 1 
FROM rrhh_mmenu 
WHERE iu_estado = 1
  AND tu_nombre LIKE '%Consultar%';
```

## 🔍 Diagnóstico de Problemas

### Problema: Usuario no ve ningún menú

**Causa:** El rol no tiene permisos asignados

**Solución:**
```sql
-- Verificar permisos del rol
SELECT COUNT(*) 
FROM rrhh_drol_menu 
WHERE iu_rol_id = [ID_ROL] AND iu_estado = 1;

-- Si retorna 0, asignar permisos
```

### Problema: rol_id es null en localStorage

**Causa:** Caché del navegador o backend no reiniciado

**Solución:**
1. Reiniciar backend
2. Limpiar caché del navegador
3. Usar modo incógnito para probar

### Problema: Menús no se actualizan

**Causa:** Los cambios en permisos requieren nueva sesión

**Solución:**
1. Cerrar sesión
2. Volver a iniciar sesión
3. Los menús se cargarán con los nuevos permisos

### Problema: Error "No se encontró rol_id"

**Causa:** El login no guardó el rol_id correctamente

**Solución:**
1. Verificar que el backend retorne `rolId` en el login
2. Ejecutar en consola:
```javascript
fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username: 'tu_usuario', password: 'tu_password'})
})
.then(r => r.json())
.then(d => console.log('Respuesta:', d));
```
3. Verificar que `d.data.rolId` exista

## 📝 Scripts SQL Útiles

### Ver todos los roles y sus permisos
```sql
SELECT 
    r.id,
    r.tr_descripcion as rol,
    COUNT(rm.iu_menu_id) as menus_asignados
FROM rrhh_mrol r
LEFT JOIN rrhh_drol_menu rm ON r.id = rm.iu_rol_id AND rm.iu_estado = 1
WHERE r.ir_estado = 1
GROUP BY r.id, r.tr_descripcion
ORDER BY r.id;
```

### Ver menús de un rol específico
```sql
SELECT 
    m.id,
    m.tu_nombre as menu,
    m.iu_nivel as nivel
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.iu_menu_id = m.id
WHERE rm.iu_rol_id = [ID_ROL]
  AND rm.iu_estado = 1
ORDER BY m.iu_posicion;
```

### Clonar permisos de un rol a otro
```sql
-- Copiar permisos del rol 3 al rol 4
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 4, iu_menu_id, iu_estado
FROM rrhh_drol_menu
WHERE iu_rol_id = 3;
```

## ✨ Ventajas del Nuevo Sistema

1. **Seguridad:** Permisos explícitos para todos los roles
2. **Flexibilidad:** Fácil asignar/quitar permisos
3. **Auditoría:** Clara trazabilidad de quién ve qué
4. **Escalabilidad:** Fácil agregar nuevos roles
5. **Consistencia:** Misma lógica para todos los roles

## 🎓 Mejores Prácticas

1. **Crear roles por función:** RRHH, Finanzas, Ventas, etc.
2. **Principio de mínimo privilegio:** Solo dar acceso necesario
3. **Documentar roles:** Mantener lista de qué hace cada rol
4. **Revisar permisos periódicamente:** Auditar accesos
5. **Usar el módulo de asignación:** Interfaz visual es más fácil

## 📚 Archivos de Referencia

- `sql/asignar_todos_menus_admin.sql` - Script para asignar todos los menús
- `sql/verificar_y_asignar_permisos.sql` - Scripts de diagnóstico
- `VERIFICACION_PERMISOS_ROL.md` - Guía de pruebas
- `CORRECCION_FILTRADO_MENUS.md` - Historial de correcciones

## 🚨 Importante

**Después de aplicar estos cambios:**
1. ✅ Reiniciar el backend
2. ✅ Asignar permisos a TODOS los roles activos
3. ✅ Limpiar caché del navegador
4. ✅ Probar con diferentes usuarios/roles
5. ✅ Verificar que cada rol vea solo sus menús

**Si un rol no tiene permisos asignados:**
- El usuario verá un sidebar vacío
- Mensaje: "No hay menús disponibles"
- Solución: Asignar permisos usando el script SQL o el módulo web
