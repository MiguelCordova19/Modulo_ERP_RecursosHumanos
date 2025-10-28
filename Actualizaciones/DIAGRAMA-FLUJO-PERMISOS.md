# 🔄 Diagrama de Flujo del Sistema de Permisos

## 📊 Flujo Completo: De Usuario a Menús

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. USUARIO INICIA SESIÓN                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    2. AUTENTICACIÓN                              │
│  POST /api/auth/login                                           │
│  { usuario: "admin", password: "***" }                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    3. RESPUESTA CON DATOS                        │
│  {                                                               │
│    usuarioId: 1,                                                │
│    usuario: "admin",                                            │
│    rolId: 1,              ← IMPORTANTE                          │
│    rolDescripcion: "DASHBOARD",                                 │
│    empresaId: 1           ← IMPORTANTE                          │
│  }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    4. GUARDAR EN LOCALSTORAGE                    │
│  localStorage.setItem('usuario', JSON.stringify(data))          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5. CARGAR DASHBOARD                           │
│  window.location.href = 'dashboard.html'                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    6. DASHBOARD.JS INICIA                        │
│  loadDynamicMenus()                                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    7. OBTENER ROL DEL USUARIO                    │
│  const usuario = JSON.parse(localStorage.getItem('usuario'))   │
│  const rolId = usuario.rolId  // Ejemplo: 1                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    8. SOLICITAR MENÚS POR ROL                    │
│  GET /api/menus/rol/{rolId}                                     │
│  Ejemplo: GET /api/menus/rol/1                                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    9. BACKEND PROCESA                            │
│  MenuController.findByRol(rolId)                                │
│      ↓                                                           │
│  MenuService.findActiveHierarchicalByRol(rolId)                 │
│      ↓                                                           │
│  ¿Es rol DASHBOARD (id=1)?                                      │
│      ├─ SÍ → Retornar TODOS los menús                           │
│      └─ NO → Consultar permisos en rrhh_drol_menu               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    10. CONSULTA SQL                              │
│  SELECT menu_id FROM rrhh_drol_menu                             │
│  WHERE irm_rol = {rolId} AND irm_estado = 1                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    11. FILTRAR MENÚS                             │
│  - Obtener menús por IDs                                        │
│  - Filtrar solo activos (menu_estado = 1)                       │
│  - Organizar jerárquicamente                                    │
│  - Ordenar por posición                                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    12. RESPUESTA AL FRONTEND                     │
│  {                                                               │
│    success: true,                                               │
│    data: [                                                       │
│      {                                                           │
│        menu_id: 7,                                              │
│        menu_nombre: "Gestión de Seguridad",                     │
│        hijos: [...]                                             │
│      }                                                           │
│    ]                                                             │
│  }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    13. RENDERIZAR MENÚS                          │
│  renderDynamicMenus(menus)                                      │
│  - Crear elementos HTML                                         │
│  - Agregar iconos                                               │
│  - Configurar eventos click                                     │
│  - Mostrar en sidebar                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    14. USUARIO VE SUS MENÚS                      │
│  ✅ Solo los menús con permisos                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Flujo de Asignación de Permisos

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. ADMIN ABRE ASIGNAR ROL                     │
│  Clic en: Gestión de Seguridad → Asignar Rol                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    2. CARGAR MATRIZ                              │
│  asignar-rol.js → cargarMatrizPermisos()                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    3. OBTENER EMPRESA DEL USUARIO                │
│  const usuario = JSON.parse(localStorage.getItem('usuario'))   │
│  const empresaId = usuario.empresaId                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    4. SOLICITAR MATRIZ                           │
│  GET /api/rol-menu/matriz?empresaId={empresaId}                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    5. BACKEND PROCESA                            │
│  RolMenuController.obtenerMatriz(empresaId)                     │
│      ↓                                                           │
│  RolMenuService.obtenerMatrizRolMenu(empresaId)                 │
│      ↓                                                           │
│  Consultar:                                                      │
│    - Todos los menús activos                                    │
│    - Roles de la empresa (excluir DASHBOARD)                    │
│    - Permisos existentes                                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    6. CONSULTAS SQL                              │
│                                                                  │
│  -- Menús                                                        │
│  SELECT * FROM rrhh_mmenu                                       │
│  WHERE menu_estado = 1                                          │
│  ORDER BY menu_posicion                                         │
│                                                                  │
│  -- Roles                                                        │
│  SELECT * FROM rrhh_mrol                                        │
│  WHERE ir_empresa = {empresaId}                                 │
│    AND ir_estado = 1                                            │
│    AND imrol_id != 1  -- Excluir DASHBOARD                      │
│                                                                  │
│  -- Permisos                                                     │
│  SELECT * FROM rrhh_drol_menu                                   │
│  WHERE irm_estado = 1                                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    7. RESPUESTA AL FRONTEND                      │
│  {                                                               │
│    menus: [29 menús],                                           │
│    roles: [roles de la empresa],                                │
│    permisos: [permisos existentes]                              │
│  }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    8. RENDERIZAR MATRIZ                          │
│  renderizarMatriz()                                             │
│  - Crear tabla HTML                                             │
│  - Filas = Menús (con jerarquía visual)                         │
│  - Columnas = Roles                                             │
│  - Checkboxes = Permisos                                        │
│  - Marcar checkboxes según permisos existentes                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    9. ADMIN MODIFICA PERMISOS                    │
│  - Marca/desmarca checkboxes                                    │
│  - Cambios se guardan en Map local                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    10. ADMIN HACE CLIC EN GUARDAR                │
│  Botón: "Guardar Permisos"                                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    11. CONFIRMAR ACCIÓN                          │
│  confirm("¿Está seguro de guardar los cambios?")               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    12. PREPARAR DATOS                            │
│  Para cada rol modificado:                                       │
│    - Obtener TODOS los checkboxes marcados                      │
│    - Crear array de menuIds                                     │
│    - Crear request: { rolId, menuIds }                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    13. ENVIAR AL BACKEND                         │
│  POST /api/rol-menu/asignar                                     │
│  Body: { rolId: 2, menuIds: [1, 4, 5, 6, 8] }                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    14. BACKEND PROCESA                           │
│  RolMenuController.asignarMenus(request)                        │
│      ↓                                                           │
│  RolMenuService.asignarMenusARol(request)                       │
│      ↓                                                           │
│  1. Validar que no sea rol DASHBOARD                            │
│  2. Eliminar permisos anteriores del rol                        │
│  3. Crear nuevos permisos                                       │
│  4. Guardar en base de datos                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    15. TRANSACCIÓN SQL                           │
│  BEGIN;                                                          │
│                                                                  │
│  -- Eliminar permisos anteriores                                │
│  DELETE FROM rrhh_drol_menu                                     │
│  WHERE irm_rol = {rolId};                                       │
│                                                                  │
│  -- Insertar nuevos permisos                                    │
│  INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)    │
│  VALUES                                                          │
│    ({rolId}, 1, 1),                                             │
│    ({rolId}, 4, 1),                                             │
│    ({rolId}, 5, 1),                                             │
│    ...                                                           │
│                                                                  │
│  COMMIT;                                                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    16. RESPUESTA AL FRONTEND                     │
│  { success: true, message: "Permisos asignados exitosamente" } │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    17. MOSTRAR MENSAJE DE ÉXITO                  │
│  Swal.fire("¡Éxito!", "Permisos guardados", "success")         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    18. RECARGAR MATRIZ                           │
│  cargarMatrizPermisos()  // Actualizar vista                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Casos de Uso Específicos

### Caso 1: Usuario con Rol DASHBOARD

```
Usuario: admin
Rol: DASHBOARD (id=1)

Flujo:
1. Login → rolId = 1
2. Dashboard carga → GET /api/menus/rol/1
3. Backend detecta rolId = 1
4. Retorna TODOS los menús (sin consultar permisos)
5. Usuario ve 29 menús

SQL ejecutado:
SELECT * FROM rrhh_mmenu 
WHERE menu_estado = 1 
ORDER BY menu_posicion;
```

### Caso 2: Usuario con Rol Personalizado

```
Usuario: supervisor
Rol: Supervisor (id=2)

Flujo:
1. Login → rolId = 2
2. Dashboard carga → GET /api/menus/rol/2
3. Backend consulta permisos:
   SELECT menu_id FROM rrhh_drol_menu 
   WHERE irm_rol = 2 AND irm_estado = 1
4. Obtiene IDs: [1, 4, 5, 6]
5. Busca menús por IDs
6. Retorna solo esos menús
7. Usuario ve 4 menús

SQL ejecutado:
SELECT * FROM rrhh_mmenu 
WHERE menu_id IN (1, 4, 5, 6) 
  AND menu_estado = 1 
ORDER BY menu_posicion;
```

### Caso 3: Usuario con Rol Sin Permisos

```
Usuario: nuevo
Rol: Operador (id=3)

Flujo:
1. Login → rolId = 3
2. Dashboard carga → GET /api/menus/rol/3
3. Backend consulta permisos:
   SELECT menu_id FROM rrhh_drol_menu 
   WHERE irm_rol = 3 AND irm_estado = 1
4. No encuentra permisos → []
5. Retorna array vacío
6. Usuario ve dashboard vacío

Mensaje mostrado:
"No hay menús disponibles"
```

## 📊 Diagrama de Base de Datos

```
┌─────────────────────┐
│   rrhh_mempresa     │
│  (Empresas)         │
├─────────────────────┤
│ imempresa_id (PK)   │◄──────────┐
│ te_descripcion      │           │
│ ie_estado           │           │
└─────────────────────┘           │
                                  │ FK: ir_empresa
                                  │
┌─────────────────────┐           │
│    rrhh_mrol        │           │
│    (Roles)          │           │
├─────────────────────┤           │
│ imrol_id (PK)       │           │
│ tr_descripcion      │           │
│ ir_estado           │           │
│ ir_empresa (FK)     │───────────┘
└──────┬──────────────┘
       │
       │ FK: irm_rol
       │
       ▼
┌─────────────────────┐           ┌─────────────────────┐
│  rrhh_drol_menu     │           │    rrhh_mmenu       │
│  (Permisos)         │           │    (Menús)          │
├─────────────────────┤           ├─────────────────────┤
│ idrm_id (PK)        │           │ menu_id (PK)        │
│ irm_rol (FK)        │           │ menu_ruta           │
│ irm_menu (FK)       │◄──────────┤ menu_nombre         │
│ irm_estado          │           │ menu_icon           │
└─────────────────────┘           │ menu_estado         │
                                  │ menu_padre          │
       ▲                          │ menu_nivel          │
       │                          │ menu_posicion       │
       │ FK: iu_rol               └─────────────────────┘
       │
┌──────┴──────────────┐
│  rrhh_musuario      │
│  (Usuarios)         │
├─────────────────────┤
│ imusuario_id (PK)   │
│ tu_usuario          │
│ tu_password         │
│ iu_rol (FK)         │
│ iu_empresa (FK)     │
└─────────────────────┘
```

## 🔄 Ciclo de Vida de un Permiso

```
1. CREACIÓN
   ┌─────────────────────────────────────┐
   │ Admin crea rol en módulo "Rol"      │
   │ INSERT INTO rrhh_mrol               │
   └─────────────────────────────────────┘
                    ↓
2. ASIGNACIÓN
   ┌─────────────────────────────────────┐
   │ Admin asigna permisos en            │
   │ módulo "Asignar Rol"                │
   │ INSERT INTO rrhh_drol_menu          │
   └─────────────────────────────────────┘
                    ↓
3. USO
   ┌─────────────────────────────────────┐
   │ Usuario inicia sesión               │
   │ Dashboard consulta permisos         │
   │ SELECT FROM rrhh_drol_menu          │
   └─────────────────────────────────────┘
                    ↓
4. MODIFICACIÓN
   ┌─────────────────────────────────────┐
   │ Admin modifica permisos             │
   │ DELETE + INSERT INTO rrhh_drol_menu │
   └─────────────────────────────────────┘
                    ↓
5. ELIMINACIÓN
   ┌─────────────────────────────────────┐
   │ Admin elimina rol                   │
   │ DELETE FROM rrhh_mrol               │
   │ CASCADE → DELETE FROM rrhh_drol_menu│
   └─────────────────────────────────────┘
```

---

**Este diagrama muestra el flujo completo del sistema de permisos desde el login hasta la visualización de menús.**
