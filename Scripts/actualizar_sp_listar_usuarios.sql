-- Script para actualizar el procedimiento sp_listar_usuarios_activos
-- Incluye el campo primer_login y corrige la tabla de roles

-- Eliminar versión anterior
DROP FUNCTION IF EXISTS sp_listar_usuarios_activos() CASCADE;

-- Crear función actualizada
CREATE OR REPLACE FUNCTION sp_listar_usuarios_activos()
RETURNS TABLE (
    id BIGINT,
    usuario VARCHAR(50),
    nombres VARCHAR(50),
    apellido_paterno VARCHAR(50),
    apellido_materno VARCHAR(50),
    empresa_id BIGINT,
    empresa_nombre VARCHAR(100),
    sede_id BIGINT,
    tipo_documento_id INTEGER,
    nro_documento VARCHAR(20),
    fecha_nacimiento DATE,
    rol_id INTEGER,
    rol_descripcion VARCHAR(100),
    puesto_id INTEGER,
    nro_celular VARCHAR(20),
    correo VARCHAR(50),
    estado INTEGER,
    primer_login INTEGER
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
        e.te_descripcion AS empresa_nombre,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        r.tr_descripcion AS rol_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado,
        COALESCE(u.iu_primerlogin, 0) AS primer_login
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol r ON u.iu_rol = r.imrol_id
    WHERE u.iu_estado = 1
    ORDER BY u.imusuario_id DESC;
END;
$$;

-- Verificar que funciona
SELECT * FROM sp_listar_usuarios_activos();
