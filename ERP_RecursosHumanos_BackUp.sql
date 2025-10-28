--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-10-28 02:09:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS bd_rrhh;
--
-- TOC entry 4976 (class 1262 OID 40989)
-- Name: bd_rrhh; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE bd_rrhh WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'es_ES.UTF-8';


ALTER DATABASE bd_rrhh OWNER TO postgres;

\connect bd_rrhh

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 245 (class 1255 OID 41109)
-- Name: sp_cambiar_password(bigint, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_cambiar_password(p_usuario_id bigint, p_password_nueva character varying) RETURNS TABLE(success boolean, message character varying)
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


ALTER FUNCTION public.sp_cambiar_password(p_usuario_id bigint, p_password_nueva character varying) OWNER TO postgres;

--
-- TOC entry 247 (class 1255 OID 41125)
-- Name: sp_cambiar_password_validado(bigint, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_cambiar_password_validado(p_usuario_id bigint, p_password_actual character varying, p_password_nueva character varying) RETURNS TABLE(success boolean, message character varying)
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


ALTER FUNCTION public.sp_cambiar_password_validado(p_usuario_id bigint, p_password_actual character varying, p_password_nueva character varying) OWNER TO postgres;

--
-- TOC entry 257 (class 1255 OID 41176)
-- Name: sp_eliminar_empresa(bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_eliminar_empresa(IN p_id bigint, OUT p_success boolean, OUT p_mensaje character varying)
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


ALTER PROCEDURE public.sp_eliminar_empresa(IN p_id bigint, OUT p_success boolean, OUT p_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 261 (class 1255 OID 41180)
-- Name: sp_eliminar_rol(bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_eliminar_rol(IN p_id bigint, OUT p_success boolean, OUT p_mensaje character varying)
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


ALTER PROCEDURE public.sp_eliminar_rol(IN p_id bigint, OUT p_success boolean, OUT p_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 41105)
-- Name: sp_eliminar_rol_empresa(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_eliminar_rol_empresa(IN p_id integer, OUT p_success boolean, OUT p_mensaje character varying)
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


ALTER PROCEDURE public.sp_eliminar_rol_empresa(IN p_id integer, OUT p_success boolean, OUT p_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 41172)
-- Name: sp_eliminar_usuario(bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_eliminar_usuario(IN p_id bigint, OUT p_success boolean, OUT p_mensaje character varying)
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


ALTER PROCEDURE public.sp_eliminar_usuario(IN p_id bigint, OUT p_success boolean, OUT p_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 41175)
-- Name: sp_guardar_empresa(bigint, character varying, character varying, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_guardar_empresa(IN p_id bigint, IN p_descripcion character varying, IN p_ruc character varying, IN p_telefono character varying, IN p_direccion character varying, OUT p_resultado_id bigint, OUT p_resultado_mensaje character varying)
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


ALTER PROCEDURE public.sp_guardar_empresa(IN p_id bigint, IN p_descripcion character varying, IN p_ruc character varying, IN p_telefono character varying, IN p_direccion character varying, OUT p_resultado_id bigint, OUT p_resultado_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 260 (class 1255 OID 41179)
-- Name: sp_guardar_rol(bigint, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_guardar_rol(IN p_id bigint, IN p_descripcion character varying, OUT p_resultado_id bigint, OUT p_resultado_mensaje character varying)
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


ALTER PROCEDURE public.sp_guardar_rol(IN p_id bigint, IN p_descripcion character varying, OUT p_resultado_id bigint, OUT p_resultado_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 41104)
-- Name: sp_guardar_rol_empresa(integer, character varying, bigint); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_guardar_rol_empresa(IN p_id integer, IN p_descripcion character varying, IN p_empresa_id bigint, OUT p_resultado_id integer, OUT p_resultado_mensaje character varying)
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


ALTER PROCEDURE public.sp_guardar_rol_empresa(IN p_id integer, IN p_descripcion character varying, IN p_empresa_id bigint, OUT p_resultado_id integer, OUT p_resultado_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 262 (class 1255 OID 41182)
-- Name: sp_guardar_usuario(bigint, character varying, character varying, character varying, character varying, character varying, bigint, bigint, integer, character varying, date, integer, integer, character varying, character varying); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_guardar_usuario(IN p_id bigint, IN p_usuario character varying, IN p_password character varying, IN p_nombres character varying, IN p_apellido_paterno character varying, IN p_apellido_materno character varying, IN p_empresa_id bigint, IN p_sede_id bigint, IN p_tipo_documento_id integer, IN p_nro_documento character varying, IN p_fecha_nacimiento date, IN p_rol_id integer, IN p_puesto_id integer, IN p_nro_celular character varying, IN p_correo character varying, OUT p_resultado_id bigint, OUT p_resultado_usuario character varying, OUT p_resultado_mensaje character varying)
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


ALTER PROCEDURE public.sp_guardar_usuario(IN p_id bigint, IN p_usuario character varying, IN p_password character varying, IN p_nombres character varying, IN p_apellido_paterno character varying, IN p_apellido_materno character varying, IN p_empresa_id bigint, IN p_sede_id bigint, IN p_tipo_documento_id integer, IN p_nro_documento character varying, IN p_fecha_nacimiento date, IN p_rol_id integer, IN p_puesto_id integer, IN p_nro_celular character varying, IN p_correo character varying, OUT p_resultado_id bigint, OUT p_resultado_usuario character varying, OUT p_resultado_mensaje character varying) OWNER TO postgres;

--
-- TOC entry 248 (class 1255 OID 41126)
-- Name: sp_insertar_usuario(character varying, character varying, character varying, character varying, character varying, bigint, bigint, integer, character varying, date, integer, integer, character varying, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_insertar_usuario(p_usuario character varying, p_password character varying, p_nombres character varying, p_apellido_paterno character varying, p_apellido_materno character varying, p_empresa_id bigint, p_sede_id bigint, p_tipo_documento_id integer, p_nro_documento character varying, p_fecha_nacimiento date, p_rol_id integer, p_puesto_id integer, p_nro_celular character varying, p_correo character varying, p_estado integer, p_primer_login integer DEFAULT 1) RETURNS TABLE(id bigint, usuario character varying, nombres character varying, apellido_paterno character varying, apellido_materno character varying, empresa_id bigint, sede_id bigint, tipo_documento_id integer, nro_documento character varying, fecha_nacimiento date, rol_id integer, puesto_id integer, nro_celular character varying, correo character varying, estado integer, primer_login integer, empresa_nombre character varying, rol_descripcion character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_usuario_id BIGINT;
BEGIN
    -- Insertar el nuevo usuario (imusuario_id se genera automáticamente)
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


ALTER FUNCTION public.sp_insertar_usuario(p_usuario character varying, p_password character varying, p_nombres character varying, p_apellido_paterno character varying, p_apellido_materno character varying, p_empresa_id bigint, p_sede_id bigint, p_tipo_documento_id integer, p_nro_documento character varying, p_fecha_nacimiento date, p_rol_id integer, p_puesto_id integer, p_nro_celular character varying, p_correo character varying, p_estado integer, p_primer_login integer) OWNER TO postgres;

--
-- TOC entry 254 (class 1255 OID 41173)
-- Name: sp_listar_empresas_activas(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_empresas_activas() RETURNS TABLE(id bigint, descripcion character varying, ruc character varying, telefono character varying, direccion character varying, estado integer)
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


ALTER FUNCTION public.sp_listar_empresas_activas() OWNER TO postgres;

--
-- TOC entry 258 (class 1255 OID 41177)
-- Name: sp_listar_roles_activos(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_roles_activos() RETURNS TABLE(id integer, descripcion character varying, estado integer)
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


ALTER FUNCTION public.sp_listar_roles_activos() OWNER TO postgres;

--
-- TOC entry 240 (class 1255 OID 41102)
-- Name: sp_listar_roles_por_empresa(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_roles_por_empresa(p_empresa_id bigint) RETURNS TABLE(id integer, descripcion character varying, estado integer, empresa_id bigint, empresa_nombre character varying)
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


ALTER FUNCTION public.sp_listar_roles_por_empresa(p_empresa_id bigint) OWNER TO postgres;

--
-- TOC entry 242 (class 1255 OID 41089)
-- Name: sp_listar_tipos_documento(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_tipos_documento() RETURNS TABLE(id integer, codigo_sunat character varying, descripcion character varying, abreviatura character varying)
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


ALTER FUNCTION public.sp_listar_tipos_documento() OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 242
-- Name: FUNCTION sp_listar_tipos_documento(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.sp_listar_tipos_documento() IS 'Lista todos los tipos de documento disponibles en el sistema';


--
-- TOC entry 249 (class 1255 OID 41127)
-- Name: sp_listar_todos_usuarios(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_todos_usuarios() RETURNS TABLE(id bigint, usuario character varying, nombres character varying, apellido_paterno character varying, apellido_materno character varying, empresa_id bigint, empresa_nombre character varying, sede_id bigint, tipo_documento_id integer, nro_documento character varying, fecha_nacimiento date, rol_id integer, rol_descripcion character varying, puesto_id integer, nro_celular character varying, correo character varying, estado integer, primer_login integer)
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


ALTER FUNCTION public.sp_listar_todos_usuarios() OWNER TO postgres;

--
-- TOC entry 246 (class 1255 OID 41108)
-- Name: sp_listar_usuarios(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_usuarios() RETURNS TABLE(id bigint, usuario character varying, nombres character varying, apellido_paterno character varying, apellido_materno character varying, empresa_id bigint, sede_id bigint, tipo_documento_id integer, nro_documento character varying, fecha_nacimiento date, rol_id integer, puesto_id integer, nro_celular character varying, correo character varying, estado integer, primer_login integer, empresa_nombre character varying, rol_descripcion character varying)
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


ALTER FUNCTION public.sp_listar_usuarios() OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 41169)
-- Name: sp_listar_usuarios_activos(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_usuarios_activos() RETURNS TABLE(id bigint, usuario character varying, nombres character varying, apellido_paterno character varying, apellido_materno character varying, empresa_id bigint, empresa_nombre character varying, sede_id bigint, tipo_documento_id integer, nro_documento character varying, fecha_nacimiento date, rol_id integer, rol_descripcion character varying, puesto_id integer, nro_celular character varying, correo character varying, estado integer)
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


ALTER FUNCTION public.sp_listar_usuarios_activos() OWNER TO postgres;

--
-- TOC entry 250 (class 1255 OID 41130)
-- Name: sp_listar_usuarios_por_empresa(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_usuarios_por_empresa(p_empresa_id bigint) RETURNS TABLE(id bigint, usuario character varying, nombres character varying, apellido_paterno character varying, apellido_materno character varying, empresa_id bigint, empresa_nombre character varying, sede_id bigint, tipo_documento_id integer, nro_documento character varying, fecha_nacimiento date, rol_id integer, rol_descripcion character varying, puesto_id integer, nro_celular character varying, correo character varying, estado integer, primer_login integer)
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
    WHERE u.iu_empresa = p_empresa_id
    ORDER BY u.imusuario_id DESC;
END;
$$;


ALTER FUNCTION public.sp_listar_usuarios_por_empresa(p_empresa_id bigint) OWNER TO postgres;

--
-- TOC entry 255 (class 1255 OID 41174)
-- Name: sp_obtener_empresa_por_id(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_empresa_por_id(p_id bigint) RETURNS TABLE(id bigint, descripcion character varying, ruc character varying, telefono character varying, direccion character varying, estado integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT imempresa_id, te_descripcion, te_ruc, te_telefono, te_direccion, ie_estado
    FROM rrhh_mempresa
    WHERE imempresa_id = p_id;
END;
$$;


ALTER FUNCTION public.sp_obtener_empresa_por_id(p_id bigint) OWNER TO postgres;

--
-- TOC entry 228 (class 1255 OID 41002)
-- Name: sp_obtener_menus_activos(refcursor); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.sp_obtener_menus_activos(INOUT resultado refcursor DEFAULT 'menu_cursor'::refcursor)
    LANGUAGE plpgsql
    AS $$
BEGIN
    OPEN resultado FOR
    SELECT 
        m.Menu_Id,
        m.Menu_Ruta,
        m.Menu_Nombre,
        m.Menu_Icon,
        m.Menu_Estado,
        m.menu_padre,
        m.menu_nivel,
        m.menu_posicion
    FROM RRHH_MMENU m
    WHERE m.Menu_Estado = 1
    ORDER BY m.menu_posicion ASC;
END;
$$;


ALTER PROCEDURE public.sp_obtener_menus_activos(INOUT resultado refcursor) OWNER TO postgres;

--
-- TOC entry 241 (class 1255 OID 41103)
-- Name: sp_obtener_rol_empresa_por_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_rol_empresa_por_id(p_id integer) RETURNS TABLE(id integer, descripcion character varying, estado integer, empresa_id bigint, empresa_nombre character varying)
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


ALTER FUNCTION public.sp_obtener_rol_empresa_por_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 259 (class 1255 OID 41178)
-- Name: sp_obtener_rol_por_id(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_rol_por_id(p_id bigint) RETURNS TABLE(id integer, descripcion character varying, estado integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT imrol_id, tr_descripcion, ir_estado
    FROM rrhh_mrol_dashboard
    WHERE imrol_id = p_id;
END;
$$;


ALTER FUNCTION public.sp_obtener_rol_por_id(p_id bigint) OWNER TO postgres;

--
-- TOC entry 252 (class 1255 OID 41170)
-- Name: sp_obtener_usuario_por_id(bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_usuario_por_id(p_id bigint) RETURNS TABLE(id bigint, usuario character varying, nombres character varying, apellido_paterno character varying, apellido_materno character varying, empresa_id bigint, empresa_nombre character varying, sede_id bigint, tipo_documento_id integer, nro_documento character varying, fecha_nacimiento date, rol_id integer, rol_descripcion character varying, puesto_id integer, nro_celular character varying, correo character varying, estado integer)
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


ALTER FUNCTION public.sp_obtener_usuario_por_id(p_id bigint) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 41162)
-- Name: rrhh_drol_menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_drol_menu (
    idrm_id integer NOT NULL,
    irm_rol integer NOT NULL,
    irm_menu integer NOT NULL,
    irm_estado integer DEFAULT 1
);


ALTER TABLE public.rrhh_drol_menu OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 41161)
-- Name: rrhh_drol_menu_idrm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_drol_menu_idrm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_drol_menu_idrm_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 226
-- Name: rrhh_drol_menu_idrm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_drol_menu_idrm_id_seq OWNED BY public.rrhh_drol_menu.idrm_id;


--
-- TOC entry 216 (class 1259 OID 41003)
-- Name: rrhh_mempresa_imempresa_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rrhh_mempresa_imempresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mempresa_imempresa_id_seq OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 41004)
-- Name: rrhh_mempresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mempresa (
    imempresa_id bigint DEFAULT nextval('public.rrhh_mempresa_imempresa_id_seq'::regclass) NOT NULL,
    te_descripcion character varying(100),
    te_ruc character varying(11),
    te_telefono character varying(20),
    te_direccion character varying(255),
    ie_estado integer DEFAULT 1
);


ALTER TABLE public.rrhh_mempresa OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 40994)
-- Name: rrhh_mmenu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mmenu (
    menu_id integer NOT NULL,
    menu_ruta character varying(150),
    menu_icon character varying(50),
    menu_nombre character varying(150),
    menu_estado integer,
    menu_padre integer,
    menu_nivel integer,
    menu_posicion integer
);


ALTER TABLE public.rrhh_mmenu OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 41011)
-- Name: rrhh_mrol_imrol_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rrhh_mrol_imrol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mrol_imrol_id_seq OWNER TO root;

--
-- TOC entry 219 (class 1259 OID 41012)
-- Name: rrhh_mrol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mrol (
    imrol_id integer DEFAULT nextval('public.rrhh_mrol_imrol_id_seq'::regclass) NOT NULL,
    tr_descripcion character varying(100) NOT NULL,
    ir_estado integer DEFAULT 1 NOT NULL,
    ir_empresa bigint NOT NULL
);


ALTER TABLE public.rrhh_mrol OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 41032)
-- Name: rrhh_mrol_dashboard_imrol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mrol_dashboard_imrol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mrol_dashboard_imrol_id_seq OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41033)
-- Name: rrhh_mrol_dashboard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mrol_dashboard (
    imrol_id integer DEFAULT nextval('public.rrhh_mrol_dashboard_imrol_id_seq'::regclass) NOT NULL,
    tr_descripcion character varying(100) NOT NULL,
    ir_estado integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.rrhh_mrol_dashboard OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41083)
-- Name: rrhh_mtipodocumento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mtipodocumento (
    imtipodoc_id integer NOT NULL,
    ttd_codsunat character varying(10) NOT NULL,
    ttd_descripcion character varying(100) NOT NULL,
    ttd_abreviatura character varying(100) NOT NULL
);


ALTER TABLE public.rrhh_mtipodocumento OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 41082)
-- Name: rrhh_mtipodocumento_imtipodoc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq OWNER TO postgres;

--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 222
-- Name: rrhh_mtipodocumento_imtipodoc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq OWNED BY public.rrhh_mtipodocumento.imtipodoc_id;


--
-- TOC entry 224 (class 1259 OID 41112)
-- Name: rrhh_musuario_imusuario_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rrhh_musuario_imusuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_musuario_imusuario_id_seq OWNER TO root;

--
-- TOC entry 225 (class 1259 OID 41113)
-- Name: rrhh_musuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_musuario (
    imusuario_id bigint DEFAULT nextval('public.rrhh_musuario_imusuario_id_seq'::regclass) NOT NULL,
    tu_apellidopaterno character varying(50),
    tu_apellidomaterno character varying(50),
    tu_nombres character varying(50),
    iu_empresa bigint,
    iu_sede bigint,
    iu_tipodocumento integer,
    tu_nrodocumento character varying(20),
    fu_fechanacimiento date,
    iu_rol integer,
    iu_puesto integer,
    tu_nrocelular character varying(20),
    tu_correo character varying(50),
    iu_estado integer DEFAULT 1,
    tu_usuario character varying(50),
    tu_password character varying(255),
    iu_primerlogin integer DEFAULT 1
);


ALTER TABLE public.rrhh_musuario OWNER TO postgres;

--
-- TOC entry 4798 (class 2604 OID 41165)
-- Name: rrhh_drol_menu idrm_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_drol_menu ALTER COLUMN idrm_id SET DEFAULT nextval('public.rrhh_drol_menu_idrm_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 41086)
-- Name: rrhh_mtipodocumento imtipodoc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipodocumento ALTER COLUMN imtipodoc_id SET DEFAULT nextval('public.rrhh_mtipodocumento_imtipodoc_id_seq'::regclass);


--
-- TOC entry 4970 (class 0 OID 41162)
-- Dependencies: 227
-- Data for Name: rrhh_drol_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_drol_menu VALUES (150, 5, 18, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (151, 5, 19, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (152, 5, 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (153, 5, 17, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (154, 5, 20, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (155, 5, 21, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (156, 5, 22, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (157, 5, 23, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (158, 5, 24, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (159, 5, 25, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (160, 5, 26, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (161, 5, 28, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (162, 5, 29, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (123, 4, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (124, 4, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (125, 4, 5, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (126, 4, 4, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (127, 4, 6, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (128, 4, 7, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (129, 4, 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (130, 4, 8, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (131, 4, 9, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (132, 4, 10, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (133, 4, 13, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (134, 4, 14, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (135, 4, 15, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (136, 4, 16, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (137, 4, 17, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (138, 4, 18, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (139, 4, 19, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (140, 4, 20, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (141, 4, 21, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (142, 4, 22, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (143, 4, 23, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (144, 4, 24, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (145, 4, 25, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (146, 4, 26, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (147, 4, 27, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (148, 4, 28, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_drol_menu VALUES (149, 4, 29, 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 4960 (class 0 OID 41004)
-- Dependencies: 217
-- Data for Name: rrhh_mempresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_mempresa VALUES (3, 'EMPRESA_TEST', '12345678910', '9283647583', 'Av. Los Alamos', 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 4958 (class 0 OID 40994)
-- Dependencies: 215
-- Data for Name: rrhh_mmenu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_mmenu VALUES (3, NULL, 'fas fa-cog', 'Maestros', 1, 2, 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (1, 'motivo-prestamo', 'fas fa-money-bill-wave', 'Motivo Préstamo', 1, 3, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (5, 'tipo-trabajador', 'fas fa-user-cog', 'Tipo Trabajador', 1, 3, 3, 3) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (4, 'feriados', 'fas fa-calendar-check', 'Feriados', 1, 3, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (6, 'comisiones-afp', 'fas fa-file-invoice-dollar', 'Comisiones AFP', 1, 3, 3, 4) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (7, NULL, 'fas fa-cog', 'Gestión de Seguridad', 1, NULL, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (2, NULL, 'fas fa-users', 'Gestión de Planilla', 1, NULL, 1, 2) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (8, 'usuarios', 'fas fa-user', 'Usuarios', 1, 7, 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (9, 'rol', 'fas fa-user-shield', 'Rol', 1, 7, 2, 2) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (10, 'asignar-rol', 'fas fa-user-check', 'Asignar Rol', 1, 7, 2, 3) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (12, 'registro-usuario', 'fas fa-user-plus', 'Registrar Usuario', NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (13, 'concepto', 'fas fa-list-alt', 'Concepto', 1, 3, 3, 5) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (14, 'conceptos-regimen-laboral', 'fas fa-list-alt', 'Conceptos Régimen Laboral', 1, 3, 3, 6) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (15, 'sede', 'fas fa-building', 'Sede', 1, 3, 3, 7) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (16, 'puestos-cargos', 'fas fa-user-tie', 'Puestos / Cargos', 1, 3, 3, 8) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (17, NULL, 'fas fa-sync-alt', 'Procesos', 1, 2, 2, 2) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (18, 'trabajador', 'fas fa-user-circle', 'Trabajador', 1, 17, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (19, 'contrato', 'fas fa-pen', 'Contrato', 1, 17, 3, 2) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (20, 'asistencia', 'fas fa-calendar-check', 'Asistencia', 1, 17, 3, 3) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (21, 'consultar-asistencia', 'fas fa-calendar', 'Consultar Asistencia', 1, 17, 3, 4) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (22, 'cronograma-vacaciones', 'fas fa-umbrella-beach', 'Cronograma Vacaciones', 1, 17, 3, 5) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (23, 'conceptos-variables', 'fas fa-file-signature', 'Conceptos Variables', 1, 17, 3, 6) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (24, 'subsidios', 'fas fa-hands-helping', 'Subsidios', 1, 17, 3, 7) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (25, 'apoyo-bono', 'fas fa-hand-holding-usd', 'Apoyo / Bono', 1, 17, 3, 8) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (26, 'prestamos', 'fas fa-money-bill-wave', 'Préstamos', 1, 17, 3, 9) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (27, 'creditos', 'fas fa-dollar-sign', 'Créditos', 1, 17, 3, 10) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (28, 'jornada-laboral', 'fas fa-clock', 'Jornada Laboral', 1, 17, 3, 11) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mmenu VALUES (29, 'generar-planilla', 'fas fa-check-circle', 'Generar Planilla', 1, 17, 3, 12) ON CONFLICT DO NOTHING;


--
-- TOC entry 4962 (class 0 OID 41012)
-- Dependencies: 219
-- Data for Name: rrhh_mrol; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_mrol VALUES (5, 'Administrador', 1, 3) ON CONFLICT DO NOTHING;


--
-- TOC entry 4964 (class 0 OID 41033)
-- Dependencies: 221
-- Data for Name: rrhh_mrol_dashboard; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_mrol_dashboard VALUES (4, 'Super Administrador', 1) ON CONFLICT DO NOTHING;


--
-- TOC entry 4966 (class 0 OID 41083)
-- Dependencies: 223
-- Data for Name: rrhh_mtipodocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_mtipodocumento VALUES (1, '01', 'Doc. Nacional de Identidad', 'DNI') ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mtipodocumento VALUES (2, '04', 'Carné de Extranjería', 'CARNET EXT.') ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mtipodocumento VALUES (3, '06', 'Reg. Único de Contribuyentes', 'RUC') ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_mtipodocumento VALUES (4, '07', 'Pasaporte', 'PASAPORTE') ON CONFLICT DO NOTHING;


--
-- TOC entry 4968 (class 0 OID 41113)
-- Dependencies: 225
-- Data for Name: rrhh_musuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.rrhh_musuario VALUES (8, 'Desarrollador', 'Chidoris', 'Super', 3, NULL, 1, '912344756', '2002-10-19', 4, 2, '924566734', 'admin@admin.com', 1, 'admin', '$2a$10$8UuRnlfjcMuB.l/zy4osfuWue.ZLTmA8y4pvkisLV9F0Xn4i5ejGS', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.rrhh_musuario VALUES (9, 'Tercero', '', 'Sr. Michu', 3, NULL, 1, '74561799', '2002-02-19', 5, NULL, '986608586', 'macsyt19@gmail.com', 1, 'tercero', '$2a$10$RZVubL7xjmE04UtAIoA5ZehyIa716678aeuGOK64DwSVWRPrggeBS', 0) ON CONFLICT DO NOTHING;


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 226
-- Name: rrhh_drol_menu_idrm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_drol_menu_idrm_id_seq', 162, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 216
-- Name: rrhh_mempresa_imempresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rrhh_mempresa_imempresa_id_seq', 3, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 220
-- Name: rrhh_mrol_dashboard_imrol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mrol_dashboard_imrol_id_seq', 4, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 218
-- Name: rrhh_mrol_imrol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rrhh_mrol_imrol_id_seq', 5, true);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 222
-- Name: rrhh_mtipodocumento_imtipodoc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mtipodocumento_imtipodoc_id_seq', 4, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 224
-- Name: rrhh_musuario_imusuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rrhh_musuario_imusuario_id_seq', 9, true);


--
-- TOC entry 4813 (class 2606 OID 41168)
-- Name: rrhh_drol_menu rrhh_drol_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_drol_menu
    ADD CONSTRAINT rrhh_drol_menu_pkey PRIMARY KEY (idrm_id);


--
-- TOC entry 4801 (class 2606 OID 41010)
-- Name: rrhh_mempresa rrhh_mempresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mempresa
    ADD CONSTRAINT rrhh_mempresa_pkey PRIMARY KEY (imempresa_id);


--
-- TOC entry 4805 (class 2606 OID 41039)
-- Name: rrhh_mrol_dashboard rrhh_mrol_dashboard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mrol_dashboard
    ADD CONSTRAINT rrhh_mrol_dashboard_pkey PRIMARY KEY (imrol_id);


--
-- TOC entry 4803 (class 2606 OID 41018)
-- Name: rrhh_mrol rrhh_mrol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mrol
    ADD CONSTRAINT rrhh_mrol_pkey PRIMARY KEY (imrol_id);


--
-- TOC entry 4807 (class 2606 OID 41088)
-- Name: rrhh_mtipodocumento rrhh_mtipodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipodocumento
    ADD CONSTRAINT rrhh_mtipodocumento_pkey PRIMARY KEY (imtipodoc_id);


--
-- TOC entry 4809 (class 2606 OID 41122)
-- Name: rrhh_musuario rrhh_musuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_musuario
    ADD CONSTRAINT rrhh_musuario_pkey PRIMARY KEY (imusuario_id);


--
-- TOC entry 4811 (class 2606 OID 41124)
-- Name: rrhh_musuario rrhh_musuario_tu_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_musuario
    ADD CONSTRAINT rrhh_musuario_tu_usuario_key UNIQUE (tu_usuario);


--
-- TOC entry 4814 (class 2606 OID 41019)
-- Name: rrhh_mrol fk_rol_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mrol
    ADD CONSTRAINT fk_rol_empresa FOREIGN KEY (ir_empresa) REFERENCES public.rrhh_mempresa(imempresa_id) ON DELETE CASCADE;


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 4976
-- Name: DATABASE root; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE root TO root;


-- Completed on 2025-10-28 02:09:19

--
-- PostgreSQL database dump complete
--

