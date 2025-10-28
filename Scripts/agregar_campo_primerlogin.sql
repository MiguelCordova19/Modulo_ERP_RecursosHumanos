-- Script para agregar campo primerLogin a la tabla de usuarios
-- Este campo indica si el usuario debe cambiar su contraseña en el primer login

-- Agregar columna primerLogin a la tabla rrhh_musuario
ALTER TABLE rrhh_musuario 
ADD COLUMN IF NOT EXISTS iu_primerlogin INTEGER DEFAULT 1;

-- Comentario de la columna
COMMENT ON COLUMN rrhh_musuario.iu_primerlogin IS 'Indica si el usuario debe cambiar contraseña en primer login: 1=Sí, 0=No';

-- Actualizar usuarios existentes para que NO necesiten cambiar contraseña
UPDATE rrhh_musuario 
SET iu_primerlogin = 0 
WHERE iu_primerlogin IS NULL;

-- Actualizar el procedimiento almacenado para incluir primerLogin
CREATE OR REPLACE FUNCTION sp_insertar_usuario(
    p_usuario VARCHAR,
    p_password VARCHAR,
    p_nombres VARCHAR,
    p_apellido_paterno VARCHAR,
    p_apellido_materno VARCHAR,
    p_empresa_id BIGINT,
    p_sede_id BIGINT,
    p_tipo_documento_id INTEGER,
    p_nro_documento VARCHAR,
    p_fecha_nacimiento DATE,
    p_rol_id INTEGER,
    p_puesto_id INTEGER,
    p_nro_celular VARCHAR,
    p_correo VARCHAR,
    p_estado INTEGER,
    p_primer_login INTEGER DEFAULT 1
)
RETURNS TABLE(
    id BIGINT,
    usuario VARCHAR,
    nombres VARCHAR,
    apellido_paterno VARCHAR,
    apellido_materno VARCHAR,
    empresa_id BIGINT,
    sede_id BIGINT,
    tipo_documento_id INTEGER,
    nro_documento VARCHAR,
    fecha_nacimiento DATE,
    rol_id INTEGER,
    puesto_id INTEGER,
    nro_celular VARCHAR,
    correo VARCHAR,
    estado INTEGER,
    primer_login INTEGER,
    empresa_nombre VARCHAR,
    rol_descripcion VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_usuario_id BIGINT;
BEGIN
    -- Insertar el nuevo usuario
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
        iu_estado,
        iu_primerlogin
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
        p_estado,
        p_primer_login
    )
    RETURNING imusuario_id INTO v_usuario_id;
    
    -- Retornar el usuario insertado con datos del JOIN
    RETURN QUERY
    SELECT 
        u.imusuario_id,
        u.tu_usuario,
        u.tu_nombres,
        u.tu_apellidopaterno,
        u.tu_apellidomaterno,
        u.iu_empresa,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado,
        u.iu_primerlogin,
        e.te_descripcion AS empresa_nombre,
        r.tr_descripcion AS rol_descripcion
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
    WHERE u.imusuario_id = v_usuario_id;
END;
$$;

-- Actualizar el procedimiento de listar usuarios para incluir primerLogin
CREATE OR REPLACE FUNCTION sp_listar_usuarios()
RETURNS TABLE(
    id BIGINT,
    usuario VARCHAR,
    nombres VARCHAR,
    apellido_paterno VARCHAR,
    apellido_materno VARCHAR,
    empresa_id BIGINT,
    sede_id BIGINT,
    tipo_documento_id INTEGER,
    nro_documento VARCHAR,
    fecha_nacimiento DATE,
    rol_id INTEGER,
    puesto_id INTEGER,
    nro_celular VARCHAR,
    correo VARCHAR,
    estado INTEGER,
    primer_login INTEGER,
    empresa_nombre VARCHAR,
    rol_descripcion VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.imusuario_id,
        u.tu_usuario,
        u.tu_nombres,
        u.tu_apellidopaterno,
        u.tu_apellidomaterno,
        u.iu_empresa,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado,
        COALESCE(u.iu_primerlogin, 1) AS iu_primerlogin,
        e.te_descripcion AS empresa_nombre,
        r.tr_descripcion AS rol_descripcion
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
    ORDER BY u.imusuario_id DESC;
END;
$$;

-- Crear procedimiento para cambiar contraseña
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

-- Verificar que todo se creó correctamente
SELECT 'Campo primerLogin agregado exitosamente' AS resultado;
