-- ============================================
-- Script para Asignar TODOS los Menús a un Rol Administrador
-- ============================================

-- IMPORTANTE: Cambiar el ID del rol según tu base de datos
-- Este script asigna TODOS los menús activos a un rol específico

-- 1. Ver los roles disponibles
SELECT 
    id,
    tr_descripcion as rol,
    ir_empresa as empresa_id,
    ir_estado as estado
FROM rrhh_mrol
ORDER BY id;

-- 2. Ver los menús disponibles
SELECT 
    id,
    tu_nombre as menu,
    iu_nivel as nivel,
    iu_menu_padre as padre_id,
    iu_estado as estado
FROM rrhh_mmenu
WHERE iu_estado = 1
ORDER BY iu_posicion;

-- ============================================
-- ASIGNAR TODOS LOS MENÚS A UN ROL
-- ============================================

-- Ejemplo: Asignar todos los menús al rol con ID = 3 (CAMBIAR SEGÚN TU CASO)
-- Primero, limpiar permisos existentes de ese rol
DELETE FROM rrhh_drol_menu WHERE irm_rol = 3;

-- Luego, asignar TODOS los menús activos
INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
SELECT 
    3 as irm_rol,  -- CAMBIAR ESTE ID por el rol que quieres hacer administrador
    id as irm_menu,
    1 as irm_estado
FROM rrhh_mmenu
WHERE iu_estado = 1;

-- Verificar que se asignaron correctamente
SELECT 
    rm.irm_rol,
    r.tr_descripcion as rol,
    COUNT(rm.irm_menu) as cantidad_menus
FROM rrhh_drol_menu rm
JOIN rrhh_mrol r ON rm.irm_rol = r.id
WHERE rm.irm_rol = 3  -- CAMBIAR ESTE ID
  AND rm.irm_estado = 1
GROUP BY rm.irm_rol, r.tr_descripcion;

-- Ver detalle de menús asignados
SELECT 
    r.tr_descripcion as rol,
    m.id as menu_id,
    m.tu_nombre as menu,
    m.iu_nivel as nivel,
    m.iu_posicion as posicion
FROM rrhh_drol_menu rm
JOIN rrhh_mrol r ON rm.irm_rol = r.id
JOIN rrhh_mmenu m ON rm.irm_menu = m.id
WHERE rm.irm_rol = 3  -- CAMBIAR ESTE ID
  AND rm.irm_estado = 1
ORDER BY m.iu_posicion;

-- ============================================
-- SCRIPT GENÉRICO PARA MÚLTIPLES ROLES
-- ============================================

-- Si quieres asignar todos los menús a VARIOS roles a la vez:
/*
-- Ejemplo: Asignar a roles 1, 2 y 3
DO $$
DECLARE
    rol_id_var INTEGER;
BEGIN
    FOR rol_id_var IN SELECT unnest(ARRAY[1, 2, 3]) LOOP
        -- Limpiar permisos existentes
        DELETE FROM rrhh_drol_menu WHERE irm_rol = rol_id_var;
        
        -- Asignar todos los menús
        INSERT INTO rrhh_drol_menu (irm_rol, irm_menu, irm_estado)
        SELECT 
            rol_id_var,
            id,
            1
        FROM rrhh_mmenu
        WHERE iu_estado = 1;
        
        RAISE NOTICE 'Menús asignados al rol %', rol_id_var;
    END LOOP;
END $$;
*/

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

-- Ver resumen de permisos por rol
SELECT 
    r.id as rol_id,
    r.tr_descripcion as rol,
    COUNT(rm.irm_menu) as menus_asignados,
    (SELECT COUNT(*) FROM rrhh_mmenu WHERE iu_estado = 1) as total_menus
FROM rrhh_mrol r
LEFT JOIN rrhh_drol_menu rm ON r.id = rm.irm_rol AND rm.irm_estado = 1
WHERE r.ir_estado = 1
GROUP BY r.id, r.tr_descripcion
ORDER BY r.id;

-- Ver roles SIN permisos asignados (estos usuarios no verán ningún menú)
SELECT 
    r.id,
    r.tr_descripcion as rol,
    r.ir_empresa as empresa_id
FROM rrhh_mrol r
WHERE r.ir_estado = 1
  AND NOT EXISTS (
    SELECT 1 
    FROM rrhh_drol_menu rm 
    WHERE rm.irm_rol = r.id 
      AND rm.irm_estado = 1
  )
ORDER BY r.id;

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. TODOS los roles ahora necesitan permisos explícitos
   - No hay roles "especiales" que vean todo automáticamente
   - Si un rol no tiene permisos, el usuario no verá ningún menú

2. Para crear un rol "Administrador Total":
   - Asignarle TODOS los menús usando este script
   - Cambiar el ID del rol en las líneas marcadas con "CAMBIAR ESTE ID"

3. Para roles limitados:
   - Usar el módulo "Asignar Permisos a Rol" en el sistema
   - O usar el script sql/verificar_y_asignar_permisos.sql

4. Jerarquía de menús:
   - Si asignas un menú hijo, el padre se mostrará automáticamente
   - Si solo asignas el padre, los hijos NO se mostrarán

5. Actualización de permisos:
   - Los cambios requieren cerrar sesión y volver a entrar
   - O recargar los menús desde el dashboard

6. Seguridad:
   - Este enfoque es más seguro: permisos explícitos para todos
   - Evita que usuarios sin permisos vean menús por error
   - Facilita la auditoría de accesos
*/
