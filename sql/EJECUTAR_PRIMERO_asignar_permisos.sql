-- ============================================
-- SCRIPT RÁPIDO: Asignar Permisos a Roles
-- ============================================
-- EJECUTAR ESTE SCRIPT PRIMERO después de los cambios
-- ============================================

-- PASO 1: Ver los roles disponibles en tu empresa
SELECT 
    imrol_id as id,
    tr_descripcion as rol,
    ir_empresa as empresa_id,
    ir_estado as estado
FROM rrhh_mrol
WHERE ir_estado = 1
ORDER BY imrol_id;

-- PASO 2: Ver cuántos menús hay disponibles
SELECT COUNT(*) as total_menus
FROM rrhh_mmenu
WHERE menu_estado = 1;

-- ============================================
-- PASO 3: ASIGNAR TODOS LOS MENÚS A UN ROL
-- ============================================
-- IMPORTANTE: Cambiar el número 3 por el ID de tu rol administrador

-- Limpiar permisos existentes del rol
DELETE FROM rrhh_drol_menu WHERE irm_rol = 3;

-- Asignar TODOS los menús al rol
INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
SELECT 
    3 as irm_rol,           -- ⚠️ CAMBIAR ESTE NÚMERO por tu rol
    menu_id as irm_menu,
    1 as irm_estado
FROM rrhh_mmenu
WHERE menu_estado = 1;

-- ============================================
-- PASO 4: VERIFICAR que se asignaron correctamente
-- ============================================

SELECT 
    rm.irm_rol as rol_id,
    r.tr_descripcion as rol,
    COUNT(rm.irm_menu) as menus_asignados
FROM rrhh_drol_menu rm
JOIN rrhh_mrol r ON rm.irm_rol = r.imrol_id
WHERE rm.irm_rol = 3  -- ⚠️ CAMBIAR ESTE NÚMERO
  AND rm.irm_estado = 1
GROUP BY rm.irm_rol, r.tr_descripcion;

-- Ver detalle de los menús asignados
SELECT 
    m.menu_id,
    m.menu_nombre as menu,
    m.menu_nivel as nivel,
    m.menu_posicion as posicion
FROM rrhh_drol_menu rm
JOIN rrhh_mmenu m ON rm.irm_menu = m.menu_id
WHERE rm.irm_rol = 3  -- ⚠️ CAMBIAR ESTE NÚMERO
  AND rm.irm_estado = 1
ORDER BY m.menu_posicion;

-- ============================================
-- OPCIONAL: Asignar a MÚLTIPLES roles a la vez
-- ============================================
-- Descomenta y ejecuta si quieres asignar a varios roles

/*
-- Ejemplo: Asignar todos los menús a los roles 1, 2 y 3
DO $$
DECLARE
    rol_id_var INTEGER;
BEGIN
    FOR rol_id_var IN SELECT unnest(ARRAY[1, 2, 3]) LOOP
        DELETE FROM rrhh_drol_menu WHERE irm_rol = rol_id_var;
        
        INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
        SELECT rol_id_var, menu_id, 1
        FROM rrhh_mmenu
        WHERE menu_estado = 1;
        
        RAISE NOTICE 'Menús asignados al rol %', rol_id_var;
    END LOOP;
END $$;
*/

-- ============================================
-- RESUMEN FINAL: Ver todos los roles y sus permisos
-- ============================================

SELECT 
    r.imrol_id as rol_id,
    r.tr_descripcion as rol,
    r.ir_empresa as empresa_id,
    COUNT(rm.irm_menu) as menus_asignados,
    (SELECT COUNT(*) FROM rrhh_mmenu WHERE menu_estado = 1) as total_menus_disponibles
FROM rrhh_mrol r
LEFT JOIN rrhh_drol_menu rm ON r.imrol_id = rm.irm_rol AND rm.irm_estado = 1
WHERE r.ir_estado = 1
GROUP BY r.imrol_id, r.tr_descripcion, r.ir_empresa
ORDER BY r.imrol_id;

-- ============================================
-- ⚠️ IMPORTANTE DESPUÉS DE EJECUTAR:
-- ============================================
-- 1. Reiniciar el backend (si no está corriendo)
-- 2. Limpiar caché del navegador (Ctrl + Shift + Delete)
-- 3. Cerrar sesión en la aplicación
-- 4. Volver a iniciar sesión
-- 5. Verificar que veas los menús asignados
-- ============================================
