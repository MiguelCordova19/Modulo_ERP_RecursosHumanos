# 🔐 Sistema de Permisos por Rol

## 📋 Descripción General

El sistema de permisos permite controlar qué menús puede ver cada usuario según su rol y empresa. Cada empresa puede crear sus propios roles y asignarles permisos específicos.

## 🏗️ Arquitectura

### Tablas Involucradas

1. **rrhh_mempresa** - Empresas del sistema
2. **rrhh_mrol** - Roles por empresa
3. **rrhh_mmenu** - Menús del sistema
4. **rrhh_drol_menu** - Permisos (relación Rol-Menú)
5. **rrhh_musuario** - Usuarios con su rol asignado

### Flujo de Permisos

```
Usuario → Empresa → Rol → Permisos (Menús) → Dashboard
```

## 🚀 Instalación

### 1. Ejecutar Script SQL

```bash
# Ejecutar el script de creación de tabla
psql -U root -d root -f Scripts/06_crear_tabla_rol_menu.sql
```

Este script:
- Crea la tabla `rrhh_drol_menu`
- Crea el rol DASHBOARD (superadministrador) con ID=1
- Asigna todos los menús al rol DASHBOARD
- Crea índices para optimizar consultas

### 2. Reiniciar Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Verificar Frontend

El frontend ya está configurado. Solo asegúrate de que el servidor esté corriendo.

## 📖 Uso del Sistema

### Rol DASHBOARD (Superadministrador)

- **ID:** 1
- **Descripción:** DASHBOARD
- **Empresa:** NULL (global)
- **Permisos:** Todos los menús automáticamente
- **Características:**
  - No se puede modificar
  - No se puede eliminar
  - Tiene acceso completo al sistema
  - No aparece en la matriz de asignación de permisos

### Roles por Empresa

#### 1. Crear un Rol

1. Ir al módulo **Gestión de Seguridad → Rol**
2. Hacer clic en **Nuevo**
3. Llenar los datos:
   - Descripción: Nombre del rol (ej: "Administrador de Planilla")
   - Estado: Activo
   - Empresa: Se asigna automáticamente
4. Guardar

#### 2. Asignar Permisos al Rol

1. Ir al módulo **Gestión de Seguridad → Asignar Rol**
2. Se mostrará una matriz con:
   - **Filas:** Todos los menús del sistema (organizados jerárquicamente)
   - **Columnas:** Roles de tu empresa
3. Marcar las casillas de los menús que quieres asignar a cada rol
4. Hacer clic en **Guardar Permisos**

#### 3. Asignar Rol a Usuario

1. Ir al módulo **Gestión de Seguridad → Usuarios**
2. Al crear o editar un usuario, seleccionar el rol
3. El usuario solo verá los menús asignados a su rol

## 🎨 Interfaz de Asignación de Permisos

### Características

- **Matriz Visual:** Filas = Menús, Columnas = Roles
- **Jerarquía de Menús:**
  - Nivel 1: Menús principales (azul oscuro)
  - Nivel 2: Submenús (azul claro)
  - Nivel 3: Opciones (blanco con indentación)
- **Checkboxes:** Marcar/desmarcar permisos
- **Guardado por Rol:** Al guardar, se actualizan todos los permisos del rol

### Ejemplo Visual

```
┌─────────────────────────┬──────────────┬──────────────┬──────────────┐
│ Menú                    │ Admin        │ Supervisor   │ Operador     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┤
│ 📊 Gestión de Planilla  │ ☑            │ ☑            │ ☐            │
│   ⚙️ Maestros            │ ☑            │ ☑            │ ☐            │
│     💰 Motivo Préstamo   │ ☑            │ ☑            │ ☐            │
│     📅 Feriados          │ ☑            │ ☑            │ ☐            │
│   🔄 Procesos            │ ☑            │ ☑            │ ☑            │
│     👤 Trabajador        │ ☑            │ ☑            │ ☑            │
│     📝 Contrato          │ ☑            │ ☐            │ ☐            │
└─────────────────────────┴──────────────┴──────────────┴──────────────┘
```

## 🔧 API Endpoints

### Backend (Spring Boot)

#### 1. Obtener Matriz de Permisos
```http
GET /api/rol-menu/matriz?empresaId={empresaId}
```

**Response:**
```json
{
  "success": true,
  "message": "Matriz obtenida exitosamente",
  "data": {
    "menus": [
      {
        "menuId": 1,
        "menuNombre": "Motivo Préstamo",
        "menuRuta": "motivo-prestamo",
        "menuIcon": "fas fa-money-bill-wave",
        "menuPadre": 3,
        "menuNivel": 3,
        "menuPosicion": 1
      }
    ],
    "roles": [
      {
        "rolId": 2,
        "rolDescripcion": "Administrador de Planilla",
        "empresaId": 1
      }
    ],
    "permisos": [
      {
        "rolId": 2,
        "menuId": 1
      }
    ]
  }
}
```

#### 2. Asignar Permisos a Rol
```http
POST /api/rol-menu/asignar
Content-Type: application/json

{
  "rolId": 2,
  "menuIds": [1, 4, 5, 6, 8, 9, 10]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Permisos asignados exitosamente"
}
```

#### 3. Obtener Menús por Rol
```http
GET /api/rol-menu/rol/{rolId}
```

**Response:**
```json
{
  "success": true,
  "message": "Menús obtenidos exitosamente",
  "data": [1, 4, 5, 6, 8, 9, 10]
}
```

#### 4. Obtener Menús con Permisos (para Dashboard)
```http
GET /api/menus/rol/{rolId}
```

**Response:**
```json
{
  "success": true,
  "message": "Menús con permisos obtenidos",
  "data": [
    {
      "menu_id": 7,
      "menu_nombre": "Gestión de Seguridad",
      "menu_icon": "fas fa-cog",
      "menu_nivel": 1,
      "hijos": [
        {
          "menu_id": 8,
          "menu_nombre": "Usuarios",
          "menu_ruta": "usuarios",
          "menu_icon": "fas fa-user",
          "menu_nivel": 2,
          "hijos": []
        }
      ]
    }
  ]
}
```

## 🔍 Casos de Uso

### Caso 1: Usuario con Rol DASHBOARD

```javascript
// Usuario logueado
{
  "usuarioId": 1,
  "usuario": "admin",
  "rolId": 1,
  "rolDescripcion": "DASHBOARD",
  "empresaId": 1
}

// Resultado: Ve TODOS los menús del sistema
```

### Caso 2: Usuario con Rol Personalizado

```javascript
// Usuario logueado
{
  "usuarioId": 2,
  "usuario": "supervisor",
  "rolId": 2,
  "rolDescripcion": "Supervisor de Planilla",
  "empresaId": 1
}

// Resultado: Ve solo los menús asignados al rol 2
```

### Caso 3: Usuario sin Permisos

```javascript
// Usuario logueado
{
  "usuarioId": 3,
  "usuario": "operador",
  "rolId": 3,
  "rolDescripcion": "Operador",
  "empresaId": 1
}

// Si el rol 3 no tiene permisos asignados
// Resultado: No ve ningún menú (dashboard vacío)
```

## 🛡️ Seguridad

### Validaciones Backend

1. **No modificar rol DASHBOARD:** El rol con ID=1 no se puede modificar
2. **Permisos por empresa:** Solo se muestran roles de la empresa del usuario
3. **Transacciones:** Los cambios se guardan en transacciones atómicas
4. **Cascada:** Si se elimina un rol, se eliminan sus permisos automáticamente

### Validaciones Frontend

1. **Rol en localStorage:** Se valida que el usuario tenga un rol asignado
2. **Empresa en localStorage:** Se valida que el usuario tenga una empresa
3. **Confirmación:** Se pide confirmación antes de guardar cambios
4. **Feedback visual:** Se muestra el estado de las operaciones

## 📊 Consultas SQL Útiles

### Ver todos los permisos de un rol
```sql
SELECT 
    r.tr_descripcion AS rol,
    m.menu_nombre AS menu,
    m.menu_ruta AS ruta
FROM rrhh_drol_menu rm
JOIN rrhh_mrol r ON rm.irm_rol = r.imrol_id
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE rm.irm_rol = 2 AND rm.irm_estado = 1
ORDER BY m.menu_posicion;
```

### Ver usuarios y sus permisos
```sql
SELECT 
    u.tu_usuario AS usuario,
    r.tr_descripcion AS rol,
    COUNT(rm.idrm_id) AS cantidad_permisos
FROM rrhh_musuario u
JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
LEFT JOIN rrhh_drol_menu rm ON r.imrol_id = rm.irm_rol AND rm.irm_estado = 1
GROUP BY u.tu_usuario, r.tr_descripcion
ORDER BY u.tu_usuario;
```

### Ver roles sin permisos
```sql
SELECT 
    r.imrol_id,
    r.tr_descripcion,
    e.te_descripcion AS empresa
FROM rrhh_mrol r
LEFT JOIN rrhh_mempresa e ON r.ir_empresa = e.imempresa_id
LEFT JOIN rrhh_drol_menu rm ON r.imrol_id = rm.irm_rol
WHERE r.imrol_id != 1 
  AND rm.idrm_id IS NULL
  AND r.ir_estado = 1;
```

## 🐛 Troubleshooting

### Problema: No se muestran roles en la matriz

**Solución:**
1. Verificar que la empresa tenga roles creados
2. Verificar que los roles estén activos (ir_estado = 1)
3. Verificar que el usuario tenga empresaId en localStorage

### Problema: Los cambios no se guardan

**Solución:**
1. Verificar que el backend esté corriendo
2. Revisar la consola del navegador (F12)
3. Verificar que no sea el rol DASHBOARD (id=1)

### Problema: Usuario no ve menús después de asignar permisos

**Solución:**
1. Cerrar sesión y volver a iniciar
2. Verificar que el rol tenga permisos asignados
3. Verificar que los menús estén activos (menu_estado = 1)

### Problema: Error al cargar matriz

**Solución:**
1. Verificar que la tabla rrhh_drol_menu exista
2. Ejecutar el script SQL de creación
3. Reiniciar el backend

## 📝 Notas Importantes

1. **Rol DASHBOARD es especial:** Siempre tiene acceso a todo
2. **Permisos por empresa:** Cada empresa gestiona sus propios roles
3. **Jerarquía de menús:** Se respeta la estructura padre-hijo
4. **Guardado completo:** Al guardar, se reemplazan todos los permisos del rol
5. **Sin permisos = Sin menús:** Si un rol no tiene permisos, el usuario no verá menús

## 🎯 Mejoras Futuras

- [ ] Copiar permisos de un rol a otro
- [ ] Plantillas de roles predefinidas
- [ ] Historial de cambios de permisos
- [ ] Permisos a nivel de acción (crear, editar, eliminar)
- [ ] Exportar/Importar configuración de permisos
- [ ] Dashboard de auditoría de permisos

---

**Fecha de creación:** 2025-10-27  
**Versión:** 1.0  
**Autor:** Sistema ERP RRHH
