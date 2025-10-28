-- ============================================
-- SCRIPT SIMPLE: Asignar Permisos (SIN ERRORES)
-- ============================================

-- PASO 1: Ver tus roles
SELECT 
    imrol_id,
    tr_descripcion,
    ir_empresa
FROM rrhh_mrol
WHERE ir_estado = 1;

-- PASO 2: Ver cuántos menús hay
SELECT COUNT(*) FROM rrhh_mmenu WHERE menu_estado = 1;

-- ============================================
-- PASO 3: ASIGNAR PERMISOS
-- Cambia el número 3 por el ID de tu rol
-- ============================================

-- Limpiar permisos del rol
DELETE FROM rrhh_drol_menu WHERE irm_rol = 3;

-- Asignar TODOS los menús
INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
SELECT 3, menu_id, 1
FROM rrhh_mmenu
WHERE menu_estado = 1;

-- ============================================
-- PASO 4: VERIFICAR
-- ============================================

-- Contar menús asignados
SELECT COUNT(*) as menus_asignados
FROM rrhh_drol_menu
WHERE irm_rol = 3 AND irm_estado = 1;

-- Ver los menús asignados
SELECT 
    irm_rol,
    irm_menu,
    irm_estado
FROM rrhh_drol_menu
WHERE irm_rol = 3
ORDER BY irm_menu;

-- ============================================
-- RESUMEN: Ver todos los roles y sus permisos
-- ============================================

SELECT 
    irm_rol as rol_id,
    COUNT(*) as menus_asignados
FROM rrhh_drol_menu
WHERE irm_estado = 1
GROUP BY irm_rol
ORDER BY irm_rol;

-- ============================================
-- DESPUÉS DE EJECUTAR:
-- 1. Reiniciar backend
-- 2. Limpiar caché navegador (Ctrl+Shift+Delete)
-- 3. Cerrar sesión
-- 4. Iniciar sesión nuevamente
-- ============================================
