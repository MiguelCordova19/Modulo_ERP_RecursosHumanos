-- =====================================================
-- LIMPIEZA Y CREACIÓN DE PROCEDIMIENTOS ALMACENADOS
-- CON NOMBRES CORRECTOS DE TABLAS
-- =====================================================

-- Eliminar versiones anteriores
DROP FUNCTION IF EXISTS sp_listar_usuarios_activos() CASCADE;
DROP FUNCTION IF EXISTS sp_obtener_usuario_por_id(BIGINT) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_usuario(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, BIGINT, INTEGER, VARCHAR, DATE, INTEGER, INTEGER, VARCHAR, VARCHAR, BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_usuario(BIGINT, BOOLEAN, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS sp_listar_empresas_activas() CASCADE;
DROP FUNCTION IF EXISTS sp_obtener_empresa_por_id(BIGINT) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_empresa(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_empresa(BIGINT, BOOLEAN, VARCHAR) CASCADE;

DROP FUNCTION IF EXISTS sp_listar_roles_activos() CASCADE;
DROP FUNCTION IF EXISTS sp_obtener_rol_por_id(BIGINT) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_rol(BIGINT, VARCHAR, BIGINT, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_rol(BIGINT, BOOLEAN, VARCHAR) CASCADE;

-- =====================================================
-- GESTIÓN DE USUARIOS
-- =====================================================

-- 1. Función para LISTAR USUARIOS ACTIVOS (con JOIN a roles)
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
    estado INTEGER
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
        e.te_descripcion,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        rd.tr_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol_dashboard rd ON u.iu_rol = rd.imrol_id
    WHERE u.iu_estado = 1
    ORDER BY u.imusuario_id DESC;
END;
$$;

-- 2. Función para OBTENER UN USUARIO POR ID
CREATE OR REPLACE FUNCTION sp_obtener_usuario_por_id(p_id BIGINT)
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
    estado INTEGER
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
        e.te_descripcion,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        rd.tr_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mrol_dashboard rd ON u.iu_rol = rd.imrol_id
    WHERE u.imusuario_id = p_id;
END;
$$;

-- 3. Procedimiento para GUARDAR/ACTUALIZAR USUARIO
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
    v_existe_usuario INTEGER;
BEGIN
    IF p_id > 0 THEN
        SELECT COUNT(*) INTO v_existe_usuario
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario AND imusuario_id != p_id;
        
        IF v_existe_usuario > 0 THEN
            p_resultado_id := p_id;
            p_resultado_usuario := p_usuario;
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        UPDATE rrhh_musuario SET
            tu_usuario = p_usuario,
            tu_password = COALESCE(p_password, tu_password),
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
        SELECT COUNT(*) INTO v_existe_usuario
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario;
        
        IF v_existe_usuario > 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := p_usuario;
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        INSERT INTO rrhh_musuario (
            tu_usuario, tu_password, tu_nombres, tu_apellidopaterno, tu_apellidomaterno,
            iu_empresa, iu_sede, iu_tipodocumento, tu_nrodocumento, fu_fechanacimiento,
            iu_rol, iu_puesto, tu_nrocelular, tu_correo, iu_estado
        ) VALUES (
            p_usuario, p_password, p_nombres, p_apellido_paterno, p_apellido_materno,
            p_empresa_id, p_sede_id, p_tipo_documento_id, p_nro_documento, p_fecha_nacimiento,
            p_rol_id, p_puesto_id, p_nro_celular, p_correo, 1
        )
        RETURNING imusuario_id INTO p_resultado_id;
        
        p_resultado_usuario := p_usuario;
        p_resultado_mensaje := 'Usuario creado exitosamente';
    END IF;
END;
$$;

-- 4. Procedimiento para ELIMINAR USUARIO
CREATE OR REPLACE PROCEDURE sp_eliminar_usuario(
    IN p_id BIGINT,
    OUT p_success BOOLEAN,
    OUT p_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_existe FROM rrhh_musuario WHERE imusuario_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Usuario no encontrado';
        RETURN;
    END IF;
    
    UPDATE rrhh_musuario SET iu_estado = 0 WHERE imusuario_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Usuario eliminado exitosamente';
END;
$$;

-- =====================================================
-- GESTIÓN DE EMPRESAS
-- =====================================================

CREATE OR REPLACE FUNCTION sp_listar_empresas_activas()
RETURNS TABLE (
    id BIGINT,
    descripcion VARCHAR(100),
    ruc VARCHAR(11),
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT imempresa_id, te_descripcion, te_ruc, te_telefono, te_direccion, ie_estado
    FROM rrhh_mempresa
    WHERE ie_estado = 1
    ORDER BY imempresa_id DESC;
END;
$$;

CREATE OR REPLACE FUNCTION sp_obtener_empresa_por_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    descripcion VARCHAR(100),
    ruc VARCHAR(11),
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT imempresa_id, te_descripcion, te_ruc, te_telefono, te_direccion, ie_estado
    FROM rrhh_mempresa
    WHERE imempresa_id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_guardar_empresa(
    IN p_id BIGINT,
    IN p_descripcion VARCHAR(100),
    IN p_ruc VARCHAR(11),
    IN p_telefono VARCHAR(20),
    IN p_direccion VARCHAR(200),
    OUT p_resultado_id BIGINT,
    OUT p_resultado_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe_ruc INTEGER;
BEGIN
    IF p_id > 0 THEN
        SELECT COUNT(*) INTO v_existe_ruc FROM rrhh_mempresa WHERE te_ruc = p_ruc AND imempresa_id != p_id;
        
        IF v_existe_ruc > 0 THEN
            p_resultado_id := p_id;
            p_resultado_mensaje := 'El RUC ya existe';
            RETURN;
        END IF;
        
        UPDATE rrhh_mempresa SET
            te_descripcion = p_descripcion,
            te_ruc = p_ruc,
            te_telefono = p_telefono,
            te_direccion = p_direccion
        WHERE imempresa_id = p_id;
        
        p_resultado_id := p_id;
        p_resultado_mensaje := 'Empresa actualizada exitosamente';
    ELSE
        SELECT COUNT(*) INTO v_existe_ruc FROM rrhh_mempresa WHERE te_ruc = p_ruc;
        
        IF v_existe_ruc > 0 THEN
            p_resultado_id := 0;
            p_resultado_mensaje := 'El RUC ya existe';
            RETURN;
        END IF;
        
        INSERT INTO rrhh_mempresa (te_descripcion, te_ruc, te_telefono, te_direccion, ie_estado)
        VALUES (p_descripcion, p_ruc, p_telefono, p_direccion, 1)
        RETURNING imempresa_id INTO p_resultado_id;
        
        p_resultado_mensaje := 'Empresa creada exitosamente';
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_eliminar_empresa(
    IN p_id BIGINT,
    OUT p_success BOOLEAN,
    OUT p_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_existe FROM rrhh_mempresa WHERE imempresa_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Empresa no encontrada';
        RETURN;
    END IF;
    
    UPDATE rrhh_mempresa SET ie_estado = 0 WHERE imempresa_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Empresa eliminada exitosamente';
END;
$$;

-- =====================================================
-- GESTIÓN DE ROLES
-- =====================================================

CREATE OR REPLACE FUNCTION sp_listar_roles_activos()
RETURNS TABLE (
    id INTEGER,
    descripcion VARCHAR(100),
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT imrol_id, tr_descripcion, ir_estado
    FROM rrhh_mrol_dashboard
    WHERE ir_estado = 1
    ORDER BY imrol_id DESC;
END;
$$;

CREATE OR REPLACE FUNCTION sp_obtener_rol_por_id(p_id BIGINT)
RETURNS TABLE (
    id INTEGER,
    descripcion VARCHAR(100),
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT imrol_id, tr_descripcion, ir_estado
    FROM rrhh_mrol_dashboard
    WHERE imrol_id = p_id;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_guardar_rol(
    IN p_id BIGINT,
    IN p_descripcion VARCHAR(100),
    OUT p_resultado_id BIGINT,
    OUT p_resultado_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_id > 0 THEN
        UPDATE rrhh_mrol_dashboard SET tr_descripcion = p_descripcion WHERE imrol_id = p_id;
        p_resultado_id := p_id;
        p_resultado_mensaje := 'Rol actualizado exitosamente';
    ELSE
        INSERT INTO rrhh_mrol_dashboard (tr_descripcion, ir_estado)
        VALUES (p_descripcion, 1)
        RETURNING imrol_id INTO p_resultado_id;
        
        p_resultado_mensaje := 'Rol creado exitosamente';
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE sp_eliminar_rol(
    IN p_id BIGINT,
    OUT p_success BOOLEAN,
    OUT p_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_existe INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_existe FROM rrhh_mrol_dashboard WHERE imrol_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Rol no encontrado';
        RETURN;
    END IF;
    
    UPDATE rrhh_mrol_dashboard SET ir_estado = 0 WHERE imrol_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Rol eliminado exitosamente';
END;
$$;

-- =====================================================
-- GESTIÓN DE TIPOS DE DOCUMENTO
-- =====================================================

CREATE OR REPLACE FUNCTION sp_listar_tipos_documento()
RETURNS TABLE (
    id INTEGER,
    codigo_sunat VARCHAR(10),
    descripcion VARCHAR(100),
    abreviatura VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imtipodoc_id,
        ttd_codsunat,
        ttd_descripcion,
        ttd_abreviatura
    FROM rrhh_mtipodocumento
    ORDER BY imtipodoc_id;
END;
$$;

SELECT 'Procedimientos almacenados creados exitosamente' AS mensaje;
