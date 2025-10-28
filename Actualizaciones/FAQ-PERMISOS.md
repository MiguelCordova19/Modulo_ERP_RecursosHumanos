# ❓ Preguntas Frecuentes - Sistema de Permisos

## 🎯 Conceptos Generales

### ¿Qué es el sistema de permisos?

Es un sistema que controla qué menús puede ver cada usuario según su rol. Cada empresa puede crear sus propios roles y asignarles permisos específicos de menús.

### ¿Cómo funciona?

```
Usuario → tiene un → Rol → tiene → Permisos → determinan → Menús visibles
```

### ¿Qué es un rol?

Un rol es un conjunto de permisos que se asigna a usuarios. Por ejemplo:
- **Administrador:** Ve todos los menús
- **Supervisor:** Ve solo menús de consulta
- **Operador:** Ve solo menús básicos

### ¿Qué es un permiso?

Un permiso es la relación entre un rol y un menú. Si existe el permiso, el usuario con ese rol puede ver ese menú.

## 🔐 Rol DASHBOARD

### ¿Qué es el rol DASHBOARD?

Es un rol especial de superadministrador que tiene acceso completo al sistema automáticamente.

### ¿Puedo modificar el rol DASHBOARD?

No. El rol DASHBOARD (id=1) está protegido y no se puede modificar ni eliminar.

### ¿Puedo crear usuarios con rol DASHBOARD?

Sí, pero ten cuidado. Los usuarios con rol DASHBOARD tienen acceso completo a todo el sistema.

### ¿El rol DASHBOARD pertenece a una empresa?

No. El rol DASHBOARD es global (ir_empresa = NULL) y funciona para todas las empresas.

## 👥 Roles Personalizados

### ¿Cómo creo un rol?

1. Ir a: Gestión de Seguridad → Rol
2. Clic en "Nuevo"
3. Llenar:
   - Descripción: Nombre del rol
   - Estado: Activo
   - Empresa: Se asigna automáticamente
4. Guardar

### ¿Puedo crear roles para otras empresas?

No. Solo puedes crear roles para tu empresa. El sistema asigna automáticamente la empresa del usuario logueado.

### ¿Cuántos roles puedo crear?

Ilimitados. Puedes crear tantos roles como necesites.

### ¿Puedo eliminar un rol?

Sí, pero ten cuidado:
- Si eliminas un rol, se eliminan todos sus permisos (cascada)
- Los usuarios con ese rol quedarán sin acceso a menús
- Debes asignarles otro rol antes de eliminar

## 📋 Permisos

### ¿Cómo asigno permisos a un rol?

1. Ir a: Gestión de Seguridad → Asignar Rol
2. Marcar los checkboxes de los menús que quieres asignar
3. Clic en "Guardar Permisos"

### ¿Puedo asignar permisos a varios roles a la vez?

Sí. La matriz muestra todos los roles y puedes marcar permisos para varios roles antes de guardar.

### ¿Qué pasa si no asigno permisos a un rol?

Los usuarios con ese rol no verán ningún menú en el dashboard.

### ¿Puedo asignar solo algunos menús de un grupo?

Sí. Puedes asignar menús específicos sin necesidad de asignar todo el grupo.

**Ejemplo:**
```
✅ Gestión de Planilla (padre)
  ✅ Procesos (padre)
    ✅ Trabajador (hijo)
    ❌ Contrato (hijo)  ← No asignado
    ✅ Asistencia (hijo)
```

### ¿Los permisos se heredan?

No. Cada menú es independiente. Si quieres que un usuario vea un submenú, debes asignar tanto el padre como el hijo.

## 🎨 Interfaz de Asignación

### ¿Qué significan los colores en la matriz?

- **Azul oscuro:** Menús de nivel 1 (principales)
- **Azul claro:** Menús de nivel 2 (submenús)
- **Blanco:** Menús de nivel 3 (opciones)

### ¿Por qué algunos menús están indentados?

La indentación muestra la jerarquía de menús:
- Sin indentación: Nivel 1
- 1 indentación: Nivel 2
- 2 indentaciones: Nivel 3

### ¿Por qué no aparecen roles en la matriz?

Posibles causas:
1. No has creado roles para tu empresa
2. Los roles están inactivos
3. Solo se muestran roles de tu empresa

**Solución:** Crea roles en el módulo "Rol" primero.

## 💾 Guardado de Permisos

### ¿Cómo se guardan los permisos?

Al hacer clic en "Guardar Permisos":
1. Se eliminan todos los permisos anteriores del rol
2. Se crean nuevos permisos según los checkboxes marcados
3. Se guarda en la base de datos

### ¿Puedo deshacer cambios?

No. Una vez guardados, los cambios son permanentes. Por eso se pide confirmación antes de guardar.

### ¿Los cambios se aplican inmediatamente?

Sí, pero:
- Los usuarios ya logueados deben cerrar sesión y volver a entrar
- Los nuevos usuarios verán los cambios inmediatamente

### ¿Qué pasa si hay un error al guardar?

Se muestra un mensaje de error y los cambios no se aplican. Los permisos anteriores se mantienen.

## 👤 Usuarios y Permisos

### ¿Cómo asigno un rol a un usuario?

1. Ir a: Gestión de Seguridad → Usuarios
2. Al crear o editar usuario, seleccionar el rol
3. Guardar

### ¿Un usuario puede tener varios roles?

No. Cada usuario tiene un solo rol.

### ¿Puedo cambiar el rol de un usuario?

Sí. Edita el usuario y selecciona otro rol. Los cambios se aplican en el próximo login.

### ¿Qué pasa si cambio los permisos de un rol?

Todos los usuarios con ese rol verán los cambios en su próximo login.

## 🔍 Visualización de Menús

### ¿Por qué no veo menús en el dashboard?

Posibles causas:
1. Tu rol no tiene permisos asignados
2. Los menús están inactivos
3. Hay un error de conexión

**Solución:**
1. Verifica que tu rol tenga permisos
2. Cierra sesión y vuelve a entrar
3. Contacta al administrador

### ¿Por qué veo menos menús que antes?

Tu administrador modificó los permisos de tu rol. Contacta al administrador si necesitas acceso a más menús.

### ¿Puedo ver menús de otras empresas?

No. Solo ves menús de tu empresa según tu rol.

## 🛠️ Administración

### ¿Cómo sé qué permisos tiene un rol?

**Opción 1: Interfaz**
1. Ir a: Asignar Rol
2. Ver los checkboxes marcados para ese rol

**Opción 2: Base de datos**
```sql
SELECT 
    r.tr_descripcion AS rol,
    m.menu_nombre AS menu
FROM rrhh_drol_menu rm
JOIN rrhh_mrol r ON rm.irm_rol = r.imrol_id
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE r.imrol_id = {rolId}
  AND rm.irm_estado = 1;
```

### ¿Cómo sé qué usuarios tienen un rol?

```sql
SELECT 
    u.tu_usuario,
    u.tu_nombres,
    r.tr_descripcion AS rol
FROM rrhh_musuario u
JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
WHERE r.imrol_id = {rolId};
```

### ¿Puedo copiar permisos de un rol a otro?

Actualmente no hay una función automática, pero puedes:
1. Ver los permisos del rol origen en la matriz
2. Marcar los mismos checkboxes en el rol destino
3. Guardar

### ¿Puedo exportar/importar permisos?

Actualmente no, pero puedes usar SQL:

**Exportar:**
```sql
SELECT irm_rol, irm_menu 
FROM rrhh_drol_menu 
WHERE irm_rol = {rolId};
```

**Importar:**
```sql
INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
VALUES 
  ({nuevoRolId}, {menuId1}, 1),
  ({nuevoRolId}, {menuId2}, 1);
```

## 🐛 Problemas Comunes

### Error: "No se puede modificar el rol DASHBOARD"

**Causa:** Intentaste asignar permisos al rol con id=1

**Solución:** El rol DASHBOARD no se puede modificar. Es automático.

### Error: "No hay roles creados para esta empresa"

**Causa:** Tu empresa no tiene roles personalizados

**Solución:** Crea roles en el módulo "Rol" primero.

### Los cambios no se reflejan en el dashboard

**Causa:** El usuario no ha cerrado sesión

**Solución:** Cierra sesión y vuelve a entrar.

### No puedo guardar permisos

**Causas posibles:**
1. Backend no está corriendo
2. Error de conexión
3. Intentando modificar rol DASHBOARD

**Solución:**
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12)
3. Verifica que no sea el rol DASHBOARD

### La matriz no carga

**Causas posibles:**
1. No tienes empresaId en localStorage
2. Backend no responde
3. Error en la base de datos

**Solución:**
1. Cierra sesión y vuelve a entrar
2. Verifica que el backend esté corriendo
3. Revisa los logs del backend

## 📊 Mejores Prácticas

### ¿Cuántos roles debería crear?

Depende de tu organización, pero generalmente:
- **Pequeña empresa:** 2-3 roles (Admin, Operador)
- **Mediana empresa:** 4-6 roles (Admin, Supervisor, Contador, Operador)
- **Grande empresa:** 7+ roles (según departamentos)

### ¿Cómo organizo los roles?

**Por responsabilidad:**
- Administrador de Sistema
- Administrador de Planilla
- Supervisor de RRHH
- Contador
- Operador de Asistencia

**Por departamento:**
- RRHH - Administrador
- RRHH - Operador
- Contabilidad
- Gerencia

### ¿Debo dar muchos permisos o pocos?

**Principio de mínimo privilegio:** Da solo los permisos necesarios para que el usuario haga su trabajo.

**Ejemplo:**
- ❌ Dar todos los permisos a todos
- ✅ Dar permisos específicos según función

### ¿Cómo pruebo los permisos?

1. Crea un usuario de prueba
2. Asígnale el rol
3. Inicia sesión con ese usuario
4. Verifica que vea solo los menús esperados
5. Ajusta permisos si es necesario

## 🔄 Actualizaciones

### ¿Qué pasa si agrego un nuevo menú al sistema?

1. El menú se agrega a la tabla rrhh_mmenu
2. Aparece automáticamente en la matriz de asignación
3. Debes asignar permisos manualmente a los roles que lo necesiten
4. El rol DASHBOARD lo verá automáticamente

### ¿Puedo desactivar un menú temporalmente?

Sí, en la base de datos:
```sql
UPDATE rrhh_mmenu 
SET menu_estado = 0 
WHERE menu_id = {menuId};
```

El menú desaparecerá para todos los usuarios (incluso DASHBOARD).

### ¿Cómo reactivo un menú?

```sql
UPDATE rrhh_mmenu 
SET menu_estado = 1 
WHERE menu_id = {menuId};
```

## 📞 Soporte

### ¿Dónde encuentro más información?

- **Guía completa:** INSTRUCCIONES-PERMISOS.md
- **Resumen:** RESUMEN-SISTEMA-PERMISOS.md
- **Pruebas:** PRUEBA-RAPIDA-PERMISOS.md
- **Diagramas:** DIAGRAMA-FLUJO-PERMISOS.md

### ¿Cómo reporto un problema?

1. Revisa esta FAQ primero
2. Revisa los logs del backend
3. Revisa la consola del navegador (F12)
4. Documenta el error con capturas
5. Contacta al equipo de desarrollo

### ¿Puedo sugerir mejoras?

¡Sí! Algunas ideas para el futuro:
- Copiar permisos entre roles
- Plantillas de roles predefinidas
- Historial de cambios
- Permisos a nivel de acción (crear, editar, eliminar)
- Exportar/Importar configuración

---

**¿No encontraste tu pregunta?** Revisa la documentación completa o contacta al administrador del sistema.
