# 🧪 Prueba Rápida del Sistema de Permisos

## ⚡ Guía de Prueba en 5 Minutos

### Paso 1: Ejecutar Script SQL (1 min)

```bash
# Conectarse a PostgreSQL
psql -U root -d root

# Ejecutar el script
\i Scripts/06_crear_tabla_rol_menu.sql

# Verificar que se creó la tabla
\dt rrhh_drol_menu

# Verificar que se creó el rol DASHBOARD
SELECT * FROM rrhh_mrol WHERE imrol_id = 1;

# Verificar que se asignaron permisos al rol DASHBOARD
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = 1;
-- Debe retornar 29 (todos los menús)

# Salir
\q
```

### Paso 2: Reiniciar Backend (1 min)

```bash
cd backend

# Limpiar y compilar
mvn clean install

# Ejecutar
mvn spring-boot:run

# Esperar a ver: "Started ErpApplication in X seconds"
```

### Paso 3: Verificar Endpoints (1 min)

Abrir navegador o Postman y probar:

#### 3.1 Obtener Matriz de Permisos
```
GET http://localhost:3000/api/rol-menu/matriz?empresaId=1
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Matriz obtenida exitosamente",
  "data": {
    "menus": [...],  // 29 menús
    "roles": [],     // Vacío si no hay roles creados
    "permisos": [...] // Permisos del rol DASHBOARD
  }
}
```

#### 3.2 Obtener Menús por Rol DASHBOARD
```
GET http://localhost:3000/api/menus/rol/1
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Menús con permisos obtenidos",
  "data": [...]  // Todos los menús jerárquicos
}
```

### Paso 4: Crear un Rol de Prueba (1 min)

#### 4.1 Ir al módulo de Roles
1. Abrir: http://localhost:5500/dashboard.html
2. Login con usuario admin
3. Ir a: Gestión de Seguridad → Rol
4. Crear nuevo rol:
   - Descripción: "Rol de Prueba"
   - Estado: Activo
   - Guardar

#### 4.2 Verificar en Base de Datos
```sql
SELECT * FROM rrhh_mrol WHERE tr_descripcion = 'Rol de Prueba';
-- Debe aparecer el nuevo rol con su ID
```

### Paso 5: Asignar Permisos (1 min)

#### 5.1 Ir al módulo de Asignar Rol
1. Ir a: Gestión de Seguridad → Asignar Rol
2. Debe aparecer la matriz con:
   - Columna izquierda: Todos los menús
   - Columna derecha: "Rol de Prueba"
3. Marcar algunos checkboxes (ej: Usuarios, Rol, Asignar Rol)
4. Hacer clic en "Guardar Permisos"
5. Debe aparecer mensaje de éxito

#### 5.2 Verificar en Base de Datos
```sql
SELECT 
    r.tr_descripcion AS rol,
    m.menu_nombre AS menu
FROM rrhh_drol_menu rm
JOIN rrhh_mrol r ON rm.irm_rol = r.imrol_id
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE r.tr_descripcion = 'Rol de Prueba'
  AND rm.irm_estado = 1;
-- Debe mostrar los menús que marcaste
```

## ✅ Checklist de Verificación

### Base de Datos
- [ ] Tabla `rrhh_drol_menu` creada
- [ ] Rol DASHBOARD (id=1) existe
- [ ] Rol DASHBOARD tiene 29 permisos
- [ ] Índices creados correctamente

### Backend
- [ ] Backend inicia sin errores
- [ ] Endpoint `/api/rol-menu/matriz` funciona
- [ ] Endpoint `/api/rol-menu/asignar` funciona
- [ ] Endpoint `/api/menus/rol/{rolId}` funciona

### Frontend
- [ ] Módulo "Asignar Rol" carga correctamente
- [ ] Matriz se muestra con menús y roles
- [ ] Checkboxes funcionan
- [ ] Botón "Guardar Permisos" funciona
- [ ] Mensajes de éxito/error se muestran

### Integración
- [ ] Dashboard carga menús según rol
- [ ] Usuario con rol DASHBOARD ve todos los menús
- [ ] Usuario con rol personalizado ve solo sus menús

## 🐛 Problemas Comunes y Soluciones

### Problema 1: Error al ejecutar script SQL

**Error:** `relation "rrhh_mrol" does not exist`

**Solución:**
```sql
-- Verificar que existan las tablas necesarias
\dt rrhh_*

-- Si falta rrhh_mrol, ejecutar primero los scripts anteriores
```

### Problema 2: Backend no inicia

**Error:** `Could not autowire. No beans of 'RolMenuRepository' type found`

**Solución:**
```bash
# Limpiar y recompilar
mvn clean
mvn install
mvn spring-boot:run
```

### Problema 3: Matriz no carga roles

**Causa:** No hay roles creados para la empresa

**Solución:**
1. Ir a módulo de Roles
2. Crear al menos un rol
3. Actualizar la matriz

### Problema 4: Cambios no se guardan

**Causa:** Intentando modificar rol DASHBOARD

**Solución:**
- El rol DASHBOARD (id=1) no se puede modificar
- Solo se pueden modificar roles personalizados

### Problema 5: Usuario no ve menús

**Causa:** Rol sin permisos asignados

**Solución:**
1. Ir a Asignar Rol
2. Marcar menús para el rol del usuario
3. Guardar
4. Usuario debe cerrar sesión y volver a entrar

## 🎯 Prueba Completa (Escenario Real)

### Escenario: Crear un Supervisor con Permisos Limitados

#### 1. Crear el Rol
```
Nombre: Supervisor de Planilla
Estado: Activo
Empresa: (se asigna automáticamente)
```

#### 2. Asignar Permisos
Marcar solo estos menús:
- ✅ Gestión de Planilla
- ✅ Procesos
- ✅ Trabajador
- ✅ Asistencia
- ✅ Consultar Asistencia

#### 3. Crear Usuario
```
Usuario: supervisor
Contraseña: supervisor123
Rol: Supervisor de Planilla
Empresa: (la misma del rol)
```

#### 4. Probar
1. Cerrar sesión del admin
2. Iniciar sesión con: supervisor / supervisor123
3. Verificar que solo aparezcan los 5 menús asignados

#### 5. Verificar en Base de Datos
```sql
-- Ver permisos del supervisor
SELECT 
    u.tu_usuario,
    r.tr_descripcion AS rol,
    m.menu_nombre
FROM rrhh_musuario u
JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
JOIN rrhh_drol_menu rm ON r.imrol_id = rm.irm_rol
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE u.tu_usuario = 'supervisor'
  AND rm.irm_estado = 1
ORDER BY m.menu_posicion;
```

## 📊 Resultados Esperados

### Usuario Admin (Rol DASHBOARD)
```
Menús visibles: 29
- Gestión de Seguridad (completo)
- Gestión de Planilla (completo)
- Todos los maestros
- Todos los procesos
```

### Usuario Supervisor (Rol Personalizado)
```
Menús visibles: 5
- Gestión de Planilla
  - Procesos
    - Trabajador
    - Asistencia
    - Consultar Asistencia
```

## 🎉 ¡Prueba Exitosa!

Si todos los pasos funcionaron correctamente, tu sistema de permisos está listo para usar.

### Próximos Pasos

1. **Definir roles de tu empresa:**
   - Administrador
   - Supervisor
   - Operador
   - Contador
   - etc.

2. **Asignar permisos según responsabilidades:**
   - ¿Quién puede ver nóminas?
   - ¿Quién puede registrar asistencias?
   - ¿Quién puede gestionar usuarios?

3. **Crear usuarios y asignar roles:**
   - Cada usuario debe tener un rol
   - El rol determina qué puede ver

4. **Probar con usuarios reales:**
   - Pedir feedback
   - Ajustar permisos según necesidad

---

**Tiempo total de prueba:** ~5 minutos  
**Dificultad:** Fácil  
**Resultado:** Sistema de permisos funcionando ✅
