-- ============================================================
-- PROCEDIMIENTO PARA LISTAR TODOS LOS USUARIOS
-- Para el dashboard principal (muestra usuarios de todas las empresas)
-- Usa rrhh_mrol_dashboard para obtener el rol
-- ============================================================

-- Eliminar versión anterior si existe
DROP FUNCTION IF EXISTS sp_listar_todos_usuarios() CASCADE;

-- Crear función para listar todos los usuarios
CREATE OR REPLACE FUNCTION sp_listar_todos_usuarios()
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
        rd.tr_descripcion AS rol_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado,
        COALESCE(u.iu_primerlogin, 0) AS primer_login
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol_dashboard rd ON u.iu_rol = rd.imrol_id
    ORDER BY u.imusuario_id DESC;
END;
$$;

-- Crear función para listar usuarios activos (solo estado = 1)
-- Esta es la que ya existe pero la actualizamos para usar rrhh_mrol_dashboard
DROP FUNCTION IF EXISTS sp_listar_usuarios_activos() CASCADE;

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
        rd.tr_descripcion AS rol_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado,
        COALESCE(u.iu_primerlogin, 0) AS primer_login
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol_dashboard rd ON u.iu_rol = rd.imrol_id
    WHERE u.iu_estado = 1
    ORDER BY u.imusuario_id DESC;
END;
$$;

-- Verificar que funcionan
SELECT 'Procedimientos creados exitosamente' AS resultado;

-- Probar el procedimiento de todos los usuarios
SELECT COUNT(*) AS total_usuarios FROM sp_listar_todos_usuarios();

-- Probar el procedimiento de usuarios activos
SELECT COUNT(*) AS usuarios_activos FROM sp_listar_usuarios_activos();

-- Ver algunos datos de ejemplo
SELECT 
    id,
    usuario,
    nombres,
    apellido_paterno,
    empresa_nombre,
    rol_descripcion,
    estado
FROM sp_listar_todos_usuarios()
LIMIT 5;
