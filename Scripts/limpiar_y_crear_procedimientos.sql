-- =====================================================
-- SCRIPT DE LIMPIEZA Y CREACIÓN DE PROCEDIMIENTOS
-- =====================================================
-- Este script elimina las versiones anteriores y crea las nuevas

-- =====================================================
-- PASO 1: ELIMINAR VERSIONES ANTERIORES
-- =====================================================

-- Eliminar procedimientos y funciones de USUARIOS
DROP FUNCTION IF EXISTS sp_listar_usuarios_activos() CASCADE;
DROP PROCEDURE IF EXISTS sp_listar_usuarios_activos(REFCURSOR) CASCADE;
DROP PROCEDURE IF EXISTS sp_listar_usuarios_activos() CASCADE;

DROP FUNCTION IF EXISTS sp_obtener_usuario_por_id(BIGINT) CASCADE;
DROP PROCEDURE IF EXISTS sp_obtener_usuario_por_id(BIGINT, REFCURSOR) CASCADE;
DROP PROCEDURE IF EXISTS sp_obtener_usuario_por_id(BIGINT) CASCADE;

DROP PROCEDURE IF EXISTS sp_guardar_usuario(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, BIGINT, INTEGER, VARCHAR, DATE, INTEGER, INTEGER, VARCHAR, VARCHAR, BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_guardar_usuario(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, BIGINT, INTEGER, VARCHAR, DATE, INTEGER, INTEGER, VARCHAR, VARCHAR) CASCADE;

DROP PROCEDURE IF EXISTS sp_eliminar_usuario(BIGINT, BOOLEAN, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_usuario(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_eliminar_usuario(BIGINT) CASCADE;

-- Eliminar procedimientos y funciones de EMPRESAS
DROP FUNCTION IF EXISTS sp_listar_empresas_activas() CASCADE;
DROP PROCEDURE IF EXISTS sp_listar_empresas_activas(REFCURSOR) CASCADE;
DROP PROCEDURE IF EXISTS sp_listar_empresas_activas() CASCADE;

DROP FUNCTION IF EXISTS sp_obtener_empresa_por_id(BIGINT) CASCADE;
DROP PROCEDURE IF EXISTS sp_obtener_empresa_por_id(BIGINT, REFCURSOR) CASCADE;
DROP PROCEDURE IF EXISTS sp_obtener_empresa_por_id(BIGINT) CASCADE;

DROP PROCEDURE IF EXISTS sp_guardar_empresa(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BIGINT, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_empresa(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_guardar_empresa(BIGINT, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;

DROP PROCEDURE IF EXISTS sp_eliminar_empresa(BIGINT, BOOLEAN, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_empresa(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_eliminar_empresa(BIGINT) CASCADE;

-- Eliminar procedimientos y funciones de ROLES
DROP FUNCTION IF EXISTS sp_listar_roles_activos() CASCADE;
DROP PROCEDURE IF EXISTS sp_listar_roles_activos(REFCURSOR) CASCADE;
DROP PROCEDURE IF EXISTS sp_listar_roles_activos() CASCADE;

DROP FUNCTION IF EXISTS sp_obtener_rol_por_id(BIGINT) CASCADE;
DROP PROCEDURE IF EXISTS sp_obtener_rol_por_id(BIGINT, REFCURSOR) CASCADE;
DROP PROCEDURE IF EXISTS sp_obtener_rol_por_id(BIGINT) CASCADE;

DROP PROCEDURE IF EXISTS sp_guardar_rol(BIGINT, VARCHAR, BIGINT, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_guardar_rol(BIGINT, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_guardar_rol(BIGINT, VARCHAR) CASCADE;

DROP PROCEDURE IF EXISTS sp_eliminar_rol(BIGINT, BOOLEAN, VARCHAR) CASCADE;
DROP PROCEDURE IF EXISTS sp_eliminar_rol(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_eliminar_rol(BIGINT) CASCADE;

-- =====================================================
-- PASO 2: CREAR NUEVAS FUNCIONES Y PROCEDIMIENTOS
-- =====================================================

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
        e.tu_descripcion,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        rd.tu_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mroldashboard rd ON u.iu_rol = rd.imroldashboard_id
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
        e.tu_descripcion,
        u.iu_sede,
        u.iu_tipodocumento,
        u.tu_nrodocumento,
        u.fu_fechanacimiento,
        u.iu_rol,
        rd.tu_descripcion,
        u.iu_puesto,
        u.tu_nrocelular,
        u.tu_correo,
        u.iu_estado
    FROM rrhh_musuario u
    LEFT JOIN rrhh_mempresa e ON u.iu_empresa = e.imempresa_id
    LEFT JOIN rrhh_mroldashboard rd ON u.iu_rol = rd.imroldashboard_id
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
    -- Si es actualización (p_id > 0)
    IF p_id > 0 THEN
        -- Verificar si el usuario existe con otro ID
        SELECT COUNT(*) INTO v_existe_usuario
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario AND imusuario_id != p_id;
        
        IF v_existe_usuario > 0 THEN
            p_resultado_id := p_id;
            p_resultado_usuario := p_usuario;
            p_resultado_mensaje := 'El nombre de usuario ya existe';
            RETURN;
        END IF;
        
        -- Actualizar usuario
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
        -- Verificar si el usuario ya existe
        SELECT COUNT(*) INTO v_existe_usuario
        FROM rrhh_musuario
        WHERE tu_usuario = p_usuario;
        
        IF v_existe_usuario > 0 THEN
            p_resultado_id := 0;
            p_resultado_usuario := p_usuario;
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

-- 4. Procedimiento para ELIMINAR USUARIO (cambiar estado a 0)
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
    -- Verificar si el usuario existe
    SELECT COUNT(*) INTO v_existe
    FROM rrhh_musuario
    WHERE imusuario_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Usuario no encontrado';
        RETURN;
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_musuario
    SET iu_estado = 0
    WHERE imusuario_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Usuario eliminado exitosamente';
END;
$$;

-- =====================================================
-- GESTIÓN DE EMPRESAS
-- =====================================================

-- 1. Función para LISTAR EMPRESAS ACTIVAS
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
    SELECT 
        imempresa_id,
        tu_descripcion,
        tu_ruc,
        tu_telefono,
        tu_direccion,
        iu_estado
    FROM rrhh_mempresa
    WHERE iu_estado = 1
    ORDER BY imempresa_id DESC;
END;
$$;

-- 2. Función para OBTENER EMPRESA POR ID
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
    SELECT 
        imempresa_id,
        tu_descripcion,
        tu_ruc,
        tu_telefono,
        tu_direccion,
        iu_estado
    FROM rrhh_mempresa
    WHERE imempresa_id = p_id;
END;
$$;

-- 3. Procedimiento para GUARDAR/ACTUALIZAR EMPRESA
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
    -- Si es actualización (p_id > 0)
    IF p_id > 0 THEN
        -- Verificar si el RUC existe con otro ID
        SELECT COUNT(*) INTO v_existe_ruc
        FROM rrhh_mempresa
        WHERE tu_ruc = p_ruc AND imempresa_id != p_id;
        
        IF v_existe_ruc > 0 THEN
            p_resultado_id := p_id;
            p_resultado_mensaje := 'El RUC ya existe';
            RETURN;
        END IF;
        
        -- Actualizar empresa
        UPDATE rrhh_mempresa SET
            tu_descripcion = p_descripcion,
            tu_ruc = p_ruc,
            tu_telefono = p_telefono,
            tu_direccion = p_direccion
        WHERE imempresa_id = p_id;
        
        p_resultado_id := p_id;
        p_resultado_mensaje := 'Empresa actualizada exitosamente';
        
    ELSE
        -- Verificar si el RUC ya existe
        SELECT COUNT(*) INTO v_existe_ruc
        FROM rrhh_mempresa
        WHERE tu_ruc = p_ruc;
        
        IF v_existe_ruc > 0 THEN
            p_resultado_id := 0;
            p_resultado_mensaje := 'El RUC ya existe';
            RETURN;
        END IF;
        
        -- Insertar nueva empresa (siempre con estado = 1)
        INSERT INTO rrhh_mempresa (
            tu_descripcion,
            tu_ruc,
            tu_telefono,
            tu_direccion,
            iu_estado
        ) VALUES (
            p_descripcion,
            p_ruc,
            p_telefono,
            p_direccion,
            1
        )
        RETURNING imempresa_id INTO p_resultado_id;
        
        p_resultado_mensaje := 'Empresa creada exitosamente';
    END IF;
END;
$$;

-- 4. Procedimiento para ELIMINAR EMPRESA (cambiar estado a 0)
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
    -- Verificar si la empresa existe
    SELECT COUNT(*) INTO v_existe
    FROM rrhh_mempresa
    WHERE imempresa_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Empresa no encontrada';
        RETURN;
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mempresa
    SET iu_estado = 0
    WHERE imempresa_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Empresa eliminada exitosamente';
END;
$$;

-- =====================================================
-- GESTIÓN DE ROLES
-- =====================================================

-- 1. Función para LISTAR ROLES ACTIVOS
CREATE OR REPLACE FUNCTION sp_listar_roles_activos()
RETURNS TABLE (
    id BIGINT,
    descripcion VARCHAR(100),
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imroldashboard_id,
        tu_descripcion,
        iu_estado
    FROM rrhh_mroldashboard
    WHERE iu_estado = 1
    ORDER BY imroldashboard_id DESC;
END;
$$;

-- 2. Función para OBTENER ROL POR ID
CREATE OR REPLACE FUNCTION sp_obtener_rol_por_id(p_id BIGINT)
RETURNS TABLE (
    id BIGINT,
    descripcion VARCHAR(100),
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imroldashboard_id,
        tu_descripcion,
        iu_estado
    FROM rrhh_mroldashboard
    WHERE imroldashboard_id = p_id;
END;
$$;

-- 3. Procedimiento para GUARDAR/ACTUALIZAR ROL
CREATE OR REPLACE PROCEDURE sp_guardar_rol(
    IN p_id BIGINT,
    IN p_descripcion VARCHAR(100),
    OUT p_resultado_id BIGINT,
    OUT p_resultado_mensaje VARCHAR(200)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Si es actualización (p_id > 0)
    IF p_id > 0 THEN
        -- Actualizar rol
        UPDATE rrhh_mroldashboard SET
            tu_descripcion = p_descripcion
        WHERE imroldashboard_id = p_id;
        
        p_resultado_id := p_id;
        p_resultado_mensaje := 'Rol actualizado exitosamente';
        
    ELSE
        -- Insertar nuevo rol (siempre con estado = 1)
        INSERT INTO rrhh_mroldashboard (
            tu_descripcion,
            iu_estado
        ) VALUES (
            p_descripcion,
            1
        )
        RETURNING imroldashboard_id INTO p_resultado_id;
        
        p_resultado_mensaje := 'Rol creado exitosamente';
    END IF;
END;
$$;

-- 4. Procedimiento para ELIMINAR ROL (cambiar estado a 0)
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
    -- Verificar si el rol existe
    SELECT COUNT(*) INTO v_existe
    FROM rrhh_mroldashboard
    WHERE imroldashboard_id = p_id;
    
    IF v_existe = 0 THEN
        p_success := FALSE;
        p_mensaje := 'Rol no encontrado';
        RETURN;
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mroldashboard
    SET iu_estado = 0
    WHERE imroldashboard_id = p_id;
    
    p_success := TRUE;
    p_mensaje := 'Rol eliminado exitosamente';
END;
$$;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'Procedimientos almacenados creados exitosamente' AS mensaje;
