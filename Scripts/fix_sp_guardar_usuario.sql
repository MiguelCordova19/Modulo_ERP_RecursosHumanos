-- =====================================================
-- Script: Corregir sp_guardar_usuario
-- Descripción: Elimina y recrea el procedimiento correctamente
-- Fecha: 2025-10-27
-- =====================================================

-- Eliminar TODAS las versiones posibles del procedimiento
DROP PROCEDURE IF EXISTS sp_guardar_usuario(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, BIGINT, INTEGER, VARCHAR, DATE, INTEGER, INTEGER, VARCHAR, VARCHAR, BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_guardar_usuario(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, BIGINT, INTEGER, VARCHAR, DATE, INTEGER, INTEGER, VARCHAR, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_usuario CASCADE;
DROP FUNCTION IF EXISTS sp_guardar_usuario CASCADE;

-- Crear el procedimiento con la firma correcta
CREATE OR REPLACE PROCEDURE sp_guardar_usuario(
    IN p_id BIGINT,
    IN p_usuario VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_nombres VARCHAR(50),
    IN p_apellido_paterno VARCHAR(50),
    IN p_apellido_materno VARCHAR(50),
    IN p_empresa_id BIGINT,
    IN p_sede_id BIGINT,
    IN p_tipo_documento_id INTEGER,
    IN p_nro_documento VARCHAR(20),
    IN p_fecha_nacimiento DATE,
    IN p_rol_id INTEGER,
    IN p_puesto_id INTEGER,
    IN p_nro_celular VARCHAR(20),
    IN p_correo VARCHAR(50),
    OUT p_resultado_id BIGINT,
    OUT p_resultado_usuario VARCHAR(50),
    OUT p_resultado_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe INTEGER;
    v_usuario_existe INTEGER;
BEGIN
    -- Si es actualización (p_id > 0)
    IF p_id > 0 THEN
        -- Verificar si el usuario existe
        SELECT COUNT(*) INTO v_existe
        FROM rrhh_musuario
        WHERE imusuario_id = p_id;
        
        IF v_existe = 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := '';
            p_resultado_mensaje := 'Usuario no encontrado';
            RETURN;
        END IF;
        
        -- Verificar si el nombre de usuario ya existe (excepto el actual)
        SELECT COUNT(*) INTO v_usuario_existe
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario
          AND imusuario_id != p_id;
        
        IF v_usuario_existe > 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := '';
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        -- Actualizar usuario
        UPDATE rrhh_musuario SET
            tu_usuario = p_usuario,
            tu_password = COALESCE(p_password, tu_password), -- Solo actualizar si se proporciona
            tu_nombres = p_nombres,
            tu_apellidopaterno = p_apellido_paterno,
            tu_apellidomaterno = p_apellido_materno,
            iu_empresa = p_empresa_id,
            iu_sede = p_sede_id,
            iu_tipodocumento = p_tipo_documento_id,
            tu_nrodocumento = p_nro_documento,
            fu_fechanacimiento = p_fecha_nacimiento,
            iu_rol = p_rol_id,
            iu_puesto = p_puesto_id,
            tu_nrocelular = p_nro_celular,
            tu_correo = p_correo
        WHERE imusuario_id = p_id;
        
        p_resultado_id := p_id;
        p_resultado_usuario := p_usuario;
        p_resultado_mensaje := 'Usuario actualizado exitosamente';
        
    ELSE
        -- Verificar si el nombre de usuario ya existe
        SELECT COUNT(*) INTO v_usuario_existe
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario;
        
        IF v_usuario_existe > 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := '';
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        -- Insertar nuevo usuario (siempre con estado = 1)
        INSERT INTO rrhh_musuario (
            tu_usuario,
            tu_password,
            tu_nombres,
            tu_apellidopaterno,
            tu_apellidomaterno,
            iu_empresa,
            iu_sede,
            iu_tipodocumento,
            tu_nrodocumento,
            fu_fechanacimiento,
            iu_rol,
            iu_puesto,
            tu_nrocelular,
            tu_correo,
            iu_estado
        ) VALUES (
            p_usuario,
            p_password,
            p_nombres,
            p_apellido_paterno,
            p_apellido_materno,
            p_empresa_id,
            p_sede_id,
            p_tipo_documento_id,
            p_nro_documento,
            p_fecha_nacimiento,
            p_rol_id,
            p_puesto_id,
            p_nro_celular,
            p_correo,
            1
        )
        RETURNING imusuario_id INTO p_resultado_id;
        
        p_resultado_usuario := p_usuario;
        p_resultado_mensaje := 'Usuario creado exitosamente';
    END IF;
END;
$$;

-- Verificar que se creó correctamente
SELECT 
    p.proname AS nombre_procedimiento,
    pg_get_function_arguments(p.oid) AS argumentos
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'sp_guardar_usuario';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Procedimiento sp_guardar_usuario creado exitosamente';
END $$;
