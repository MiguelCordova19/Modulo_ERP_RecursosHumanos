-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS PARA ROLES POR EMPRESA
-- Tabla: rrhh_mrol (roles específicos por empresa)
-- =====================================================

-- Eliminar versiones anteriores
DROP FUNCTION IF EXISTS sp_listar_roles_por_empresa(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_obtener_rol_empresa_por_id(INTEGER) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_rol_empresa(INTEGER, VARCHAR, BIGINT, INTEGER, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_rol_empresa(INTEGER, BOOLEAN, VARCHAR) CASCADE;

-- =====================================================
-- 1. Función para LISTAR ROLES POR EMPRESA
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_roles_por_empresa(p_empresa_id BIGINT)
RETURNS TABLE (
    id INTEGER,
    descripcion VARCHAR(100),
    estado INTEGER,
    empresa_id BIGINT,
    empresa_nombre VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.imrol_id,
        r.tr_descripcion,
        r.ir_estado,
        r.ir_empresa,
        e.te_descripcion
    FROM rrhh_mrol r
    LEFT JOIN rrhh_mempresa e ON r.ir_empresa = e.imempresa_id
    WHERE r.ir_empresa = p_empresa_id
      AND r.ir_estado = 1
    ORDER BY r.imrol_id DESC;
END;
$$;

-- =====================================================
-- 2. Función para OBTENER ROL POR ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_rol_empresa_por_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    descripcion VARCHAR(100),
    estado INTEGER,
    empresa_id BIGINT,
    empresa_nombre VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.imrol_id,
        r.tr_descripcion,
        r.ir_estado,
        r.ir_empresa,
        e.te_descripcion
    FROM rrhh_mrol r
    LEFT JOIN rrhh_mempresa e ON r.ir_empresa = e.imempresa_id
    WHERE r.imrol_id = p_id;
END;
$$;

-- =====================================================
-- 3. Procedimiento para GUARDAR/ACTUALIZAR ROL
-- =====================================================
CREATE OR REPLACE PROCEDURE sp_guardar_rol_empresa(
    IN p_id INTEGER,
    IN p_descripcion VARCHAR(100),
    IN p_empresa_id BIGINT,
    OUT p_resultado_id INTEGER,
    OUT p_resultado_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe_rol INTEGER;
BEGIN
    -- Si es actualización (p_id > 0)
    IF p_id > 0 THEN
        -- Verificar si el rol existe con el mismo nombre en la misma empresa
        SELECT COUNT(*) INTO v_existe_rol
        FROM rrhh_mrol
        WHERE tr_descripcion = p_descripcion 
          AND ir_empresa = p_empresa_id 
          AND imrol_id != p_id;
        
        IF v_existe_rol > 0 THEN
            p_resultado_id := p_id;
            p_resultado_mensaje := 'Ya existe un rol con ese nombre en esta empresa';
            RETURN;
        END IF;
        
        -- Actualizar rol
        UPDATE rrhh_mrol SET
            tr_descripcion = p_descripcion
        WHERE imrol_id = p_id;
        
        p_resultado_id := p_id;
        p_resultado_mensaje := 'Rol actualizado exitosamente';
        
    ELSE
        -- Verificar si el rol ya existe en la empresa
        SELECT COUNT(*) INTO v_existe_rol
        FROM rrhh_mrol
        WHERE tr_descripcion = p_descripcion 
          AND ir_empresa = p_empresa_id;
        
        IF v_existe_rol > 0 THEN
            p_resultado_id := 0;
            p_resultado_mensaje := 'Ya existe un rol con ese nombre en esta empresa';
            RETURN;
        END IF;
        
        -- Insertar nuevo rol (siempre con estado = 1)
        INSERT INTO rrhh_mrol (tr_descripcion, ir_estado, ir_empresa)
        VALUES (p_descripcion, 1, p_empresa_id)
        RETURNING imrol_id INTO p_resultado_id;
        
        p_resultado_mensaje := 'Rol creado exitosamente';
    END IF;
END;
$$;

-- =====================================================
-- 4. Procedimiento para ELIMINAR ROL (cambiar estado a 0)
-- =====================================================
CREATE OR REPLACE PROCEDURE sp_eliminar_rol_empresa(
    IN p_id INTEGER,
    OUT p_success BOOLEAN,
    OUT p_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe INTEGER;
    v_usuarios_asignados INTEGER;
BEGIN
    -- Verificar si el rol existe
    SELECT COUNT(*) INTO v_existe
    FROM rrhh_mrol
    WHERE imrol_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Rol no encontrado';
        RETURN;
    END IF;
    
    -- Verificar si hay usuarios asignados a este rol
    SELECT COUNT(*) INTO v_usuarios_asignados
    FROM rrhh_musuario
    WHERE iu_rol = p_id AND iu_estado = 1;
    
    IF v_usuarios_asignados > 0 THEN
        p_success := FALSE;
        p_mensaje := 'No se puede eliminar el rol porque tiene usuarios asignados';
        RETURN;
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mrol
    SET ir_estado = 0
    WHERE imrol_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Rol eliminado exitosamente';
END;
$$;

-- =====================================================
-- EJEMPLOS DE USO
-- =====================================================

-- Listar roles de una empresa:
-- SELECT * FROM sp_listar_roles_por_empresa(1);

-- Obtener rol por ID:
-- SELECT * FROM sp_obtener_rol_empresa_por_id(1);

-- Guardar nuevo rol:
-- CALL sp_guardar_rol_empresa(0, 'Gerente de RRHH', 1, NULL, NULL);

-- Eliminar rol:
-- CALL sp_eliminar_rol_empresa(1, NULL, NULL);

-- Verificar que funciona
SELECT 'Procedimientos almacenados de roles por empresa creados exitosamente' AS mensaje;
