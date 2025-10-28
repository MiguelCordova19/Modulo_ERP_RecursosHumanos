# 🔍 Comandos de Verificación - Sistema de Permisos

## 📋 Guía Rápida de Verificación

Este documento contiene todos los comandos necesarios para verificar que el sistema de permisos esté correctamente implementado.

---

## 🗄️ Verificación de Base de Datos

### Conectarse a PostgreSQL

```bash
psql -U root -d root
```

### 1. Verificar que la tabla existe

```sql
\dt rrhh_drol_menu
```

**Resultado esperado:**
```
Schema | Name            | Type  | Owner
-------|-----------------|-------|------
public | rrhh_drol_menu  | table | root
```

### 2. Verificar estructura de la tabla

```sql
\d rrhh_drol_menu
```

**Resultado esperado:**
```
Column      | Type    | Nullable | Default
------------|---------|----------|--------
idrm_id     | integer | not null | nextval(...)
irm_rol     | integer | not null |
irm_menu    | integer | not null |
irm_estado  | integer |          | 1

Indexes:
  "rrhh_drol_menu_pkey" PRIMARY KEY (idrm_id)
  "uk_rol_menu" UNIQUE (irm_rol, irm_menu)
  "idx_rol_menu_rol" btree (irm_rol)
  "idx_rol_menu_menu" btree (irm_menu)
  "idx_rol_menu_estado" btree (irm_estado)

Foreign-key constraints:
  "fk_rol_menu_rol" FOREIGN KEY (irm_rol) REFERENCES rrhh_mrol(imrol_id) ON DELETE CASCADE
  "fk_rol_menu_menu" FOREIGN KEY (irm_menu) REFERENCES rrhh_mmenu(menu_id) ON DELETE CASCADE
```

### 3. Verificar rol DASHBOARD

```sql
SELECT * FROM rrhh_mrol WHERE imrol_id = 1;
```

**Resultado esperado:**
```
imrol_id | tr_descripcion | ir_estado | ir_empresa
---------|----------------|-----------|------------
1        | DASHBOARD      | 1         | NULL
```

### 4. Verificar permisos del rol DASHBOARD

```sql
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = 1 AND irm_estado = 1;
```

**Resultado esperado:**
```
count
------
29
```

### 5. Ver todos los permisos del DASHBOARD

```sql
SELECT 
    rm.idrm_id,
    m.menu_id,
    m.menu_nombre,
    m.menu_ruta
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE rm.irm_rol = 1
ORDER BY m.menu_posicion;
```

### 6. Verificar índices

```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'rrhh_drol_menu';
```

**Resultado esperado:** 5 índices

### 7. Verificar foreign keys

```sql
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'rrhh_drol_menu'
    AND tc.constraint_type = 'FOREIGN KEY';
```

**Resultado esperado:** 2 foreign keys

---

## 🔧 Verificación de Backend

### 1. Verificar que los archivos existen

```bash
# Desde la raíz del proyecto
ls -la backend/src/main/java/com/meridian/erp/entity/RolMenu.java
ls -la backend/src/main/java/com/meridian/erp/repository/RolMenuRepository.java
ls -la backend/src/main/java/com/meridian/erp/service/RolMenuService.java
ls -la backend/src/main/java/com/meridian/erp/controller/RolMenuController.java
ls -la backend/src/main/java/com/meridian/erp/dto/AsignarRolRequest.java
ls -la backend/src/main/java/com/meridian/erp/dto/RolMenuResponse.java
```

### 2. Compilar el backend

```bash
cd backend
mvn clean compile
```

**Resultado esperado:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX s
```

### 3. Ejecutar tests (si existen)

```bash
mvn test
```

### 4. Compilar y empaquetar

```bash
mvn clean install
```

**Resultado esperado:**
```
[INFO] BUILD SUCCESS
[INFO] Total time: XX s
```

### 5. Ejecutar el backend

```bash
mvn spring-boot:run
```

**Resultado esperado:**
```
Started ErpApplication in X.XXX seconds
```

### 6. Verificar que el backend responde

```bash
# En otra terminal
curl http://localhost:3000/api/menus
```

**Resultado esperado:** JSON con menús

---

## 🌐 Verificación de API Endpoints

### 1. Obtener matriz de permisos

```bash
curl -X GET "http://localhost:3000/api/rol-menu/matriz?empresaId=1"
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Matriz obtenida exitosamente",
  "data": {
    "menus": [...],
    "roles": [...],
    "permisos": [...]
  }
}
```

### 2. Obtener menús por rol DASHBOARD

```bash
curl -X GET "http://localhost:3000/api/menus/rol/1"
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Menús con permisos obtenidos",
  "data": [...]
}
```

### 3. Obtener IDs de menús por rol

```bash
curl -X GET "http://localhost:3000/api/rol-menu/rol/1"
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Menús obtenidos exitosamente",
  "data": [1, 3, 4, 5, 6, 7, 8, 9, 10, ...]
}
```

### 4. Asignar permisos (crear rol primero)

```bash
# Primero crear un rol de prueba en la interfaz
# Luego asignar permisos:

curl -X POST "http://localhost:3000/api/rol-menu/asignar" \
  -H "Content-Type: application/json" \
  -d '{
    "rolId": 2,
    "menuIds": [1, 4, 5, 6, 8]
  }'
```

**Resultado esperado:**
```json
{
  "success": true,
  "message": "Permisos asignados exitosamente",
  "data": null
}
```

---

## 🎨 Verificación de Frontend

### 1. Verificar que los archivos existen

```bash
# Desde la raíz del proyecto
ls -la frontend/modules/asignar-rol.html
ls -la frontend/js/modules/asignar-rol.js
```

### 2. Verificar que el servidor frontend está corriendo

```bash
# Abrir en navegador
http://localhost:5500/dashboard.html
```

### 3. Verificar módulo Asignar Rol

```
1. Login con admin
2. Ir a: Gestión de Seguridad → Asignar Rol
3. Debe cargar la matriz de permisos
```

### 4. Verificar consola del navegador

```
F12 → Console
No debe haber errores en rojo
```

---

## 🧪 Pruebas Funcionales

### Prueba 1: Crear Rol

```sql
-- Verificar antes
SELECT COUNT(*) FROM rrhh_mrol WHERE ir_empresa = 1;

-- Crear rol en la interfaz
-- Descripción: "Rol de Prueba"
-- Estado: Activo

-- Verificar después
SELECT * FROM rrhh_mrol WHERE tr_descripcion = 'Rol de Prueba';
```

### Prueba 2: Asignar Permisos

```sql
-- Verificar antes
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = 2;

-- Asignar permisos en la interfaz
-- Marcar 5 menús para el rol

-- Verificar después
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = 2;
-- Debe retornar: 5

-- Ver detalle
SELECT 
    m.menu_nombre
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE rm.irm_rol = 2;
```

### Prueba 3: Filtrado de Menús

```sql
-- Crear usuario con rol personalizado
INSERT INTO rrhh_musuario (
    tu_apellidopaterno, tu_apellidomaterno, tu_nombres,
    iu_empresa, iu_tipodocumento, tu_nrodocumento,
    iu_rol, tu_usuario, tu_password, iu_estado
) VALUES (
    'Prueba', 'Test', 'Usuario',
    1, 1, '99999999',
    2, 'prueba', '$2b$12$...', 1
);

-- Login con usuario "prueba"
-- Debe ver solo los 5 menús asignados
```

### Prueba 4: Rol DASHBOARD

```sql
-- Verificar que el rol DASHBOARD no se puede modificar
-- Intentar asignar permisos al rol id=1 en la interfaz
-- Debe mostrar error: "No se puede modificar el rol DASHBOARD"
```

---

## 📊 Consultas SQL Útiles

### Ver todos los roles con cantidad de permisos

```sql
SELECT 
    r.imrol_id,
    r.tr_descripcion,
    e.te_descripcion AS empresa,
    COUNT(rm.idrm_id) AS cantidad_permisos
FROM rrhh_mrol r
LEFT JOIN rrhh_mempresa e ON r.ir_empresa = e.imempresa_id
LEFT JOIN rrhh_drol_menu rm ON r.imrol_id = rm.irm_rol AND rm.irm_estado = 1
GROUP BY r.imrol_id, r.tr_descripcion, e.te_descripcion
ORDER BY r.imrol_id;
```

### Ver usuarios con sus roles y permisos

```sql
SELECT 
    u.tu_usuario,
    u.tu_nombres,
    r.tr_descripcion AS rol,
    COUNT(rm.idrm_id) AS cantidad_permisos
FROM rrhh_musuario u
JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
LEFT JOIN rrhh_drol_menu rm ON r.imrol_id = rm.irm_rol AND rm.irm_estado = 1
GROUP BY u.tu_usuario, u.tu_nombres, r.tr_descripcion
ORDER BY u.tu_usuario;
```

### Ver menús sin asignar a ningún rol (excepto DASHBOARD)

```sql
SELECT 
    m.menu_id,
    m.menu_nombre,
    m.menu_ruta
FROM rrhh_mmenu m
WHERE m.menu_estado = 1
  AND m.menu_id NOT IN (
    SELECT DISTINCT irm_menu 
    FROM rrhh_drol_menu 
    WHERE irm_rol != 1 AND irm_estado = 1
  )
ORDER BY m.menu_posicion;
```

### Ver roles sin permisos asignados

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

### Ver permisos duplicados (no debería haber)

```sql
SELECT 
    irm_rol,
    irm_menu,
    COUNT(*) as cantidad
FROM rrhh_drol_menu
GROUP BY irm_rol, irm_menu
HAVING COUNT(*) > 1;
```

**Resultado esperado:** 0 filas (gracias al constraint UNIQUE)

---

## 🔍 Verificación de Integridad

### 1. Verificar que no hay permisos huérfanos

```sql
-- Permisos sin rol
SELECT COUNT(*) 
FROM rrhh_drol_menu rm
LEFT JOIN rrhh_mrol r ON rm.irm_rol = r.imrol_id
WHERE r.imrol_id IS NULL;
```

**Resultado esperado:** 0

```sql
-- Permisos sin menú
SELECT COUNT(*) 
FROM rrhh_drol_menu rm
LEFT JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE m.menu_id IS NULL;
```

**Resultado esperado:** 0

### 2. Verificar cascada de eliminación

```sql
-- Crear rol de prueba
INSERT INTO rrhh_mrol (tr_descripcion, ir_estado, ir_empresa)
VALUES ('Rol Temporal', 1, 1)
RETURNING imrol_id;

-- Asignar permisos
INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
VALUES (LAST_INSERT_ID, 1, 1);

-- Verificar que existe
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = LAST_INSERT_ID;

-- Eliminar rol
DELETE FROM rrhh_mrol WHERE imrol_id = LAST_INSERT_ID;

-- Verificar que los permisos se eliminaron (cascada)
SELECT COUNT(*) FROM rrhh_drol_menu WHERE irm_rol = LAST_INSERT_ID;
```

**Resultado esperado:** 0 (permisos eliminados automáticamente)

---

## 📝 Checklist de Verificación Rápida

### Base de Datos
- [ ] Tabla `rrhh_drol_menu` existe
- [ ] Rol DASHBOARD (id=1) existe
- [ ] 29 permisos asignados al DASHBOARD
- [ ] Índices creados
- [ ] Foreign keys configuradas
- [ ] Constraint UNIQUE funciona

### Backend
- [ ] Archivos Java creados (8 archivos)
- [ ] Backend compila sin errores
- [ ] Backend inicia correctamente
- [ ] No hay errores en logs

### API
- [ ] GET /api/rol-menu/matriz funciona
- [ ] POST /api/rol-menu/asignar funciona
- [ ] GET /api/rol-menu/rol/{rolId} funciona
- [ ] GET /api/menus/rol/{rolId} funciona

### Frontend
- [ ] Archivos HTML/JS creados (3 archivos)
- [ ] Módulo Asignar Rol carga
- [ ] Matriz se muestra correctamente
- [ ] Checkboxes funcionan
- [ ] Botón Guardar funciona

### Funcionalidad
- [ ] Se pueden crear roles
- [ ] Se pueden asignar permisos
- [ ] Dashboard filtra menús por rol
- [ ] Rol DASHBOARD ve todos los menús
- [ ] Rol personalizado ve solo sus menús

---

## 🎯 Comando Todo-en-Uno

```bash
# Script de verificación completa
echo "=== Verificación del Sistema de Permisos ==="
echo ""
echo "1. Verificando Base de Datos..."
psql -U root -d root -c "SELECT COUNT(*) as permisos_dashboard FROM rrhh_drol_menu WHERE irm_rol = 1;"
echo ""
echo "2. Compilando Backend..."
cd backend && mvn clean compile -q && echo "✅ Backend compila correctamente"
echo ""
echo "3. Verificando Archivos Frontend..."
ls frontend/modules/asignar-rol.html > /dev/null 2>&1 && echo "✅ asignar-rol.html existe"
ls frontend/js/modules/asignar-rol.js > /dev/null 2>&1 && echo "✅ asignar-rol.js existe"
echo ""
echo "=== Verificación Completa ==="
```

---

**¡Usa estos comandos para verificar que todo esté funcionando correctamente!** ✅
