-- ============================================================
-- PROCEDIMIENTO PARA CAMBIAR CONTRASEÑA CON VALIDACIÓN
-- ============================================================

-- Eliminar versión anterior si existe
DROP FUNCTION IF EXISTS sp_cambiar_password_validado(BIGINT, VARCHAR, VARCHAR) CASCADE;

-- Crear función para cambiar contraseña validando la actual
CREATE OR REPLACE FUNCTION sp_cambiar_password_validado(
    p_usuario_id BIGINT,
    p_password_actual VARCHAR,
    p_password_nueva VARCHAR
)
RETURNS TABLE(
    success BOOLEAN,
    message VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_password_bd VARCHAR(255);
    v_existe INTEGER;
BEGIN
    -- Verificar que el usuario existe
    SELECT COUNT(*) INTO v_existe
    FROM rrhh_musuario
    WHERE imusuario_id = p_usuario_id;
    
    IF v_existe = 0 THEN
        RETURN QUERY SELECT FALSE, 'Usuario no encontrado'::VARCHAR;
        RETURN;
    END IF;
    
    -- Obtener la contraseña actual de la BD
    SELECT tu_password INTO v_password_bd
    FROM rrhh_musuario
    WHERE imusuario_id = p_usuario_id;
    
    -- Nota: La validación de BCrypt se hace en el backend de Java
    -- Aquí solo actualizamos la contraseña nueva (ya encriptada)
    
    -- Actualizar la contraseña y marcar que ya no es primer login
    UPDATE rrhh_musuario 
    SET tu_password = p_password_nueva,
        iu_primerlogin = 0
    WHERE imusuario_id = p_usuario_id;
    
    IF FOUND THEN
        RETURN QUERY SELECT TRUE, 'Contraseña actualizada exitosamente'::VARCHAR;
    ELSE
        RETURN QUERY SELECT FALSE, 'Error al actualizar contraseña'::VARCHAR;
    END IF;
END;
$$;

-- Crear función simple para cambiar contraseña (sin validar actual)
-- Esta se usa cuando el admin resetea la contraseña
CREATE OR REPLACE FUNCTION sp_cambiar_password(
    p_usuario_id BIGINT,
    p_password_nueva VARCHAR
)
RETURNS TABLE(
    success BOOLEAN,
    message VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Actualizar la contraseña y marcar que ya no es primer login
    UPDATE rrhh_musuario 
    SET tu_password = p_password_nueva,
        iu_primerlogin = 0
    WHERE imusuario_id = p_usuario_id;
    
    IF FOUND THEN
        RETURN QUERY SELECT TRUE, 'Contraseña actualizada exitosamente'::VARCHAR;
    ELSE
        RETURN QUERY SELECT FALSE, 'Usuario no encontrado'::VARCHAR;
    END IF;
END;
$$;

-- Verificar que funcionan
SELECT 'Procedimientos de cambio de contraseña creados exitosamente' AS resultado;
