-- ============================================
-- Script de Verificación y Asignación de Permisos
-- ============================================

-- 1. Ver todos los roles existentes
SELECT 
    id,
    tu_descripcion as rol,
    iu_estado as estado
FROM rrhh_drol
ORDER BY id;

-- 2. Ver todos los menús disponibles
SELECT 
    id,
    tu_nombre as menu,
    iu_nivel as nivel,
    iu_menu_padre as padre_id,
    iu_posicion as posicion,
    iu_estado as estado
FROM rrhh_mmenu
WHERE iu_estado = 1
ORDER BY iu_posicion;

-- 3. Ver permisos asignados a cada rol
SELECT 
    r.id as rol_id,
    r.tu_descripcion as rol,
    COUNT(rm.iu_menu_id) as cantidad_menus
FROM rrhh_drol r
LEFT JOIN rrhh_drol_menu rm ON r.id = rm.iu_rol_id AND rm.iu_estado = 1
GROUP BY r.id, r.tu_descripcion
ORDER BY r.id;

-- 4. Ver detalle de permisos de un rol específico (cambiar el ID)
SELECT 
    r.tu_descripcion as rol,
    m.id as menu_id,
    m.tu_nombre as menu,
    m.iu_nivel as nivel,
    rm.iu_estado as permiso_activo
FROM rrhh_drol r
LEFT JOIN rrhh_drol_menu rm ON r.id = rm.iu_rol_id
LEFT JOIN rrhh_mmenu m ON rm.iu_menu_id = m.id
WHERE r.id = 2  -- Cambiar este ID por el rol que quieres verificar
ORDER BY m.iu_posicion;

-- 5. Ver usuarios y sus roles
SELECT 
    u.id,
    u.tu_usuario as usuario,
    u.tu_nombres as nombres,
    u.tu_apellido_paterno as apellido,
    r.tu_descripcion as rol,
    u.iu_estado as estado
FROM rrhh_musuario u
LEFT JOIN rrhh_drol r ON u.iu_rol_id = r.id
WHERE u.iu_estado = 1
ORDER BY u.id;

-- ============================================
-- ASIGNACIÓN DE PERMISOS DE EJEMPLO
-- ============================================

-- Ejemplo 1: Asignar permisos básicos a un rol (ID 2)
-- Esto le da acceso solo a Dashboard y Usuarios

-- Primero, limpiar permisos existentes del rol 2
DELETE FROM rrhh_drol_menu WHERE iu_rol_id = 2;

-- Asignar permisos básicos
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
VALUES 
    (2, 1, 1),  -- Dashboard
    (2, 2, 1);  -- Usuarios (ajustar IDs según tu BD)

-- Verificar que se asignaron correctamente
SELECT 
    rm.iu_rol_id,
    m.tu_nombre as menu,
    rm.iu_estado
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.iu_menu_id = m.id
WHERE rm.iu_rol_id = 2;

-- ============================================
-- Ejemplo 2: Asignar permisos completos de RRHH a un rol (ID 3)
-- ============================================

-- Limpiar permisos del rol 3
DELETE FROM rrhh_drol_menu WHERE iu_rol_id = 3;

-- Obtener IDs de menús de RRHH (ajustar según tu estructura)
-- Asumiendo que los menús de RRHH tienen IDs del 10 al 20
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 
    3 as iu_rol_id,
    id as iu_menu_id,
    1 as iu_estado
FROM rrhh_mmenu
WHERE tu_nombre LIKE '%Recursos Humanos%'
   OR tu_nombre LIKE '%Empleado%'
   OR tu_nombre LIKE '%Contrato%'
   OR tu_nombre LIKE '%Asistencia%';

-- ============================================
-- Ejemplo 3: Clonar permisos de un rol a otro
-- ============================================

-- Copiar permisos del rol 2 al rol 4
INSERT INTO rrhh_drol_menu (iu_rol_id, iu_menu_id, iu_estado)
SELECT 
    4 as iu_rol_id,  -- Rol destino
    iu_menu_id,
    iu_estado
FROM rrhh_drol_menu
WHERE iu_rol_id = 2;  -- Rol origen

-- ============================================
-- CONSULTAS DE DIAGNÓSTICO
-- ============================================

-- Ver menús que NO tienen permisos asignados a ningún rol
SELECT 
    m.id,
    m.tu_nombre as menu,
    m.iu_nivel as nivel
FROM rrhh_mmenu m
WHERE m.iu_estado = 1
  AND NOT EXISTS (
    SELECT 1 
    FROM rrhh_drol_menu rm 
    WHERE rm.iu_menu_id = m.id 
      AND rm.iu_estado = 1
  )
ORDER BY m.iu_posicion;

-- Ver roles que NO tienen permisos asignados
SELECT 
    r.id,
    r.tu_descripcion as rol
FROM rrhh_drol r
WHERE r.iu_estado = 1
  AND r.id != 1  -- Excluir DASHBOARD
  AND NOT EXISTS (
    SELECT 1 
    FROM rrhh_drol_menu rm 
    WHERE rm.iu_rol_id = r.id 
      AND rm.iu_estado = 1
  );

-- Ver estructura jerárquica de menús con permisos de un rol
WITH RECURSIVE menu_tree AS (
    -- Menús principales (nivel 1)
    SELECT 
        m.id,
        m.tu_nombre,
        m.iu_nivel,
        m.iu_menu_padre,
        m.iu_posicion,
        CAST(m.tu_nombre AS VARCHAR(500)) as ruta,
        CASE WHEN rm.iu_menu_id IS NOT NULL THEN 'SÍ' ELSE 'NO' END as tiene_permiso
    FROM rrhh_mmenu m
    LEFT JOIN rrhh_drol_menu rm ON m.id = rm.iu_menu_id 
        AND rm.iu_rol_id = 2  -- Cambiar por el rol que quieres ver
        AND rm.iu_estado = 1
    WHERE m.iu_menu_padre IS NULL 
      AND m.iu_estado = 1
    
    UNION ALL
    
    -- Submenús recursivos
    SELECT 
        m.id,
        m.tu_nombre,
        m.iu_nivel,
        m.iu_menu_padre,
        m.iu_posicion,
        CAST(mt.ruta || ' > ' || m.tu_nombre AS VARCHAR(500)),
        CASE WHEN rm.iu_menu_id IS NOT NULL THEN 'SÍ' ELSE 'NO' END
    FROM rrhh_mmenu m
    INNER JOIN menu_tree mt ON m.iu_menu_padre = mt.id
    LEFT JOIN rrhh_drol_menu rm ON m.id = rm.iu_menu_id 
        AND rm.iu_rol_id = 2  -- Cambiar por el rol que quieres ver
        AND rm.iu_estado = 1
    WHERE m.iu_estado = 1
)
SELECT 
    id,
    REPEAT('  ', iu_nivel - 1) || tu_nombre as menu_jerarquico,
    iu_nivel as nivel,
    tiene_permiso
FROM menu_tree
ORDER BY ruta;

-- ============================================
-- SCRIPT DE LIMPIEZA (¡USAR CON CUIDADO!)
-- ============================================

-- Eliminar TODOS los permisos de un rol específico
-- DELETE FROM rrhh_drol_menu WHERE iu_rol_id = [ID_ROL];

-- Eliminar permisos de menús inactivos
-- DELETE FROM rrhh_drol_menu 
-- WHERE iu_menu_id IN (
--     SELECT id FROM rrhh_mmenu WHERE iu_estado = 0
-- );

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. El rol DASHBOARD (id=1) NO necesita permisos asignados
   - Siempre ve todos los menús
   - Es el superadministrador

2. Otros roles SÍ necesitan permisos explícitos
   - Deben tener registros en rrhh_drol_menu
   - Solo con iu_estado = 1

3. Jerarquía de menús:
   - Si asignas un hijo, el padre se muestra automáticamente
   - Si solo asignas el padre, los hijos NO se muestran

4. Para que los cambios surtan efecto:
   - El usuario debe cerrar sesión y volver a entrar
   - O actualizar los menús desde el dashboard

5. Verificar siempre después de asignar:
   - Ejecutar las consultas de verificación
   - Probar con un usuario de ese rol
*/
