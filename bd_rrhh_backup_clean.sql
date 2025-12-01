--
-- PostgreSQL database dump
--


-- Dumped from database version 17.7 (Debian 17.7-3.pgdg13+1)
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: sp_actualizar_comision_afp(integer, integer, integer, integer, numeric, numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_actualizar_comision_afp(p_id integer, p_mes integer, p_anio integer, p_regimenid integer, p_comisionflujo numeric, p_comisionanualsaldo numeric, p_primaseguro numeric, p_aporteobligatorio numeric, p_remunmaxima numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE rrhh_mafp
    SET 
        ia_mes = p_mes,
        ia_anio = p_anio,
        ia_regimenpensionario = p_regimenid,
        da_comisionflujo = p_comisionflujo,
        da_comisionanualsaldo = p_comisionanualsaldo,
        da_primaseguro = p_primaseguro,
        da_aporteobligatorio = p_aporteobligatorio,
        da_remunmaxima = p_remunmaxima
    WHERE imafp_id = p_id;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_actualizar_comision_afp(p_id integer, p_mes integer, p_anio integer, p_regimenid integer, p_comisionflujo numeric, p_comisionanualsaldo numeric, p_primaseguro numeric, p_aporteobligatorio numeric, p_remunmaxima numeric) OWNER TO postgres;

--
-- Name: sp_actualizar_feriado(integer, date, character varying, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_actualizar_feriado(p_feriadoid integer, p_fechaferiado date, p_diaferiado character varying, p_denominacion character varying, p_empresaid integer) RETURNS TABLE(id integer, fechaferiado date, diaferiado character varying, denominacion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone, fechamodificacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Validar que el feriado exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE imferiado_id = p_feriadoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El feriado no existe o no pertenece a la empresa';
    END IF;
    
    -- Validar que la denominación no esté vacía
    IF TRIM(p_denominacion) = '' THEN
        RAISE EXCEPTION 'La denominación no puede estar vacía';
    END IF;
    
    -- Validar que no exista otro feriado en la misma fecha
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE ff_fechaferiado = p_fechaferiado 
            AND imempresa_id = p_empresaid
            AND imferiado_id != p_feriadoid
            AND if_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe otro feriado activo en esta fecha';
    END IF;
    
    -- Actualizar el feriado
    UPDATE rrhh_mferiados
    SET 
        ff_fechaferiado = p_fechaferiado,
        tf_diaferiado = p_diaferiado,
        tf_denominacion = p_denominacion,
        dtf_fechamodificacion = CURRENT_TIMESTAMP
    WHERE imferiado_id = p_feriadoid
        AND imempresa_id = p_empresaid;
    
    -- Retornar el feriado actualizado
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion,
        dtf_fechamodificacion
    FROM rrhh_mferiados
    WHERE imferiado_id = p_feriadoid;
END;
$$;


ALTER FUNCTION public.sp_actualizar_feriado(p_feriadoid integer, p_fechaferiado date, p_diaferiado character varying, p_denominacion character varying, p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_actualizar_motivo_prestamo(integer, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_actualizar_motivo_prestamo(p_motivoid integer, p_descripcion character varying, p_empresaid integer) RETURNS TABLE(id integer, descripcion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone, fechamodificacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Validar que el motivo exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE immmotivoprestamo_id = p_motivoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    -- Validar que la descripción no esté vacía
    IF TRIM(p_descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    -- Validar que no exista otro motivo con la misma descripción
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND imempresa_id = p_empresaid
            AND immmotivoprestamo_id != p_motivoid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe otro motivo activo con esta descripción';
    END IF;
    
    -- Actualizar el motivo
    UPDATE rrhh_mmotivoprestamo
    SET 
        tmp_descripcion = p_descripcion,
        dtmp_fechamodificacion = CURRENT_TIMESTAMP
    WHERE immmotivoprestamo_id = p_motivoid
        AND imempresa_id = p_empresaid;
    
    -- Retornar el motivo actualizado
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = p_motivoid;
END;
$$;


ALTER FUNCTION public.sp_actualizar_motivo_prestamo(p_motivoid integer, p_descripcion character varying, p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_actualizar_tipo_trabajador(integer, character varying, integer, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_actualizar_tipo_trabajador(p_id integer, p_codigointerno character varying, p_tipoid integer, p_regimenid integer, p_descripcion character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE rrhh_mtipotrabajador
    SET 
        ttt_codigointerno = p_codigointerno,
        itt_tipo = p_tipoid,
        itt_regimenpensionario = p_regimenid,
        ttt_descripcion = p_descripcion
    WHERE imtipotrabajador_id = p_id;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_actualizar_tipo_trabajador(p_id integer, p_codigointerno character varying, p_tipoid integer, p_regimenid integer, p_descripcion character varying) OWNER TO postgres;

--
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
-- Name: sp_crear_feriado(date, character varying, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_crear_feriado(p_fechaferiado date, p_diaferiado character varying, p_denominacion character varying, p_empresaid integer) RETURNS TABLE(id integer, fechaferiado date, diaferiado character varying, denominacion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_feriadoid INT;
BEGIN
    -- Validar que la denominación no esté vacía
    IF TRIM(p_denominacion) = '' THEN
        RAISE EXCEPTION 'La denominación no puede estar vacía';
    END IF;
    
    -- Validar que la fecha no esté vacía
    IF p_fechaferiado IS NULL THEN
        RAISE EXCEPTION 'La fecha no puede estar vacía';
    END IF;
    
    -- Validar que la empresa exista
    IF NOT EXISTS (SELECT 1 FROM rrhh_mempresa WHERE imempresa_id = p_empresaid) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    -- Validar que no exista un feriado en la misma fecha para la empresa
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE ff_fechaferiado = p_fechaferiado 
            AND imempresa_id = p_empresaid
            AND if_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un feriado activo en esta fecha';
    END IF;
    
    -- Insertar el nuevo feriado
    INSERT INTO rrhh_mferiados (
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion
    )
    VALUES (
        p_fechaferiado,
        p_diaferiado,
        p_denominacion,
        1,
        p_empresaid,
        CURRENT_TIMESTAMP
    )
    RETURNING imferiado_id INTO v_feriadoid;
    
    -- Retornar el feriado creado
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion
    FROM rrhh_mferiados
    WHERE imferiado_id = v_feriadoid;
END;
$$;


ALTER FUNCTION public.sp_crear_feriado(p_fechaferiado date, p_diaferiado character varying, p_denominacion character varying, p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_crear_motivo_prestamo(character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_crear_motivo_prestamo(p_descripcion character varying, p_empresaid integer) RETURNS TABLE(id integer, descripcion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_motivoid INT;
BEGIN
    -- Validar que la descripción no esté vacía
    IF TRIM(p_descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    -- Validar que la empresa exista
    IF NOT EXISTS (SELECT 1 FROM rrhh_mempresa WHERE imempresa_id = p_empresaid) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    -- Validar que no exista un motivo con la misma descripción en la empresa
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND imempresa_id = p_empresaid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un motivo activo con esta descripción en la empresa';
    END IF;
    
    -- Insertar el nuevo motivo
    INSERT INTO rrhh_mmotivoprestamo (
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion
    )
    VALUES (
        p_descripcion,
        1,
        p_empresaid,
        CURRENT_TIMESTAMP
    )
    RETURNING immmotivoprestamo_id INTO v_motivoid;
    
    -- Retornar el motivo creado
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = v_motivoid;
END;
$$;


ALTER FUNCTION public.sp_crear_motivo_prestamo(p_descripcion character varying, p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_eliminar_comision_afp(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_eliminar_comision_afp(p_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE rrhh_mafp
    SET ia_estado = 0
    WHERE imafp_id = p_id;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_eliminar_comision_afp(p_id integer) OWNER TO postgres;

--
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
-- Name: sp_eliminar_feriado(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_eliminar_feriado(p_feriadoid integer, p_empresaid integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Validar que el feriado exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE imferiado_id = p_feriadoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El feriado no existe o no pertenece a la empresa';
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mferiados
    SET 
        if_estado = 0,
        dtf_fechamodificacion = CURRENT_TIMESTAMP
    WHERE imferiado_id = p_feriadoid
        AND imempresa_id = p_empresaid;
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION public.sp_eliminar_feriado(p_feriadoid integer, p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_eliminar_motivo_prestamo(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_eliminar_motivo_prestamo(p_motivoid integer, p_empresaid integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Validar que el motivo exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE immmotivoprestamo_id = p_motivoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mmotivoprestamo
    SET 
        imp_estado = 0,
        dtmp_fechamodificacion = CURRENT_TIMESTAMP
    WHERE immmotivoprestamo_id = p_motivoid
        AND imempresa_id = p_empresaid;
    
    RETURN TRUE;
END;
$$;


ALTER FUNCTION public.sp_eliminar_motivo_prestamo(p_motivoid integer, p_empresaid integer) OWNER TO postgres;

--
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
-- Name: sp_eliminar_tipo_trabajador(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_eliminar_tipo_trabajador(p_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE rrhh_mtipotrabajador
    SET itt_estado = 0
    WHERE imtipotrabajador_id = p_id;
    
    RETURN FOUND;
END;
$$;


ALTER FUNCTION public.sp_eliminar_tipo_trabajador(p_id integer) OWNER TO postgres;

--
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
-- Name: sp_guardar_comision_afp(integer, integer, integer, numeric, numeric, numeric, numeric, numeric, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_guardar_comision_afp(p_mes integer, p_anio integer, p_regimenid integer, p_comisionflujo numeric, p_comisionanualsaldo numeric, p_primaseguro numeric, p_aporteobligatorio numeric, p_remunmaxima numeric, p_empresaid integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id INT;
BEGIN
    INSERT INTO rrhh_mafp (
        ia_mes,
        ia_anio,
        ia_regimenpensionario,
        da_comisionflujo,
        da_comisionanualsaldo,
        da_primaseguro,
        da_aporteobligatorio,
        da_remunmaxima,
        ia_estado,
        empresa_id
    ) VALUES (
        p_mes,
        p_anio,
        p_regimenid,
        p_comisionflujo,
        p_comisionanualsaldo,
        p_primaseguro,
        p_aporteobligatorio,
        p_remunmaxima,
        1,
        p_empresaid
    )
    RETURNING imafp_id INTO v_id;
    
    RETURN v_id;
END;
$$;


ALTER FUNCTION public.sp_guardar_comision_afp(p_mes integer, p_anio integer, p_regimenid integer, p_comisionflujo numeric, p_comisionanualsaldo numeric, p_primaseguro numeric, p_aporteobligatorio numeric, p_remunmaxima numeric, p_empresaid integer) OWNER TO postgres;

--
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
-- Name: sp_guardar_tipo_trabajador(character varying, integer, integer, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_guardar_tipo_trabajador(p_codigointerno character varying, p_tipoid integer, p_regimenid integer, p_descripcion character varying, p_empresaid integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_id INT;
BEGIN
    INSERT INTO rrhh_mtipotrabajador (
        ttt_codigointerno,
        itt_tipo,
        itt_regimenpensionario,
        ttt_descripcion,
        itt_estado,
        empresa_id
    ) VALUES (
        p_codigointerno,
        p_tipoid,
        p_regimenid,
        p_descripcion,
        1,
        p_empresaid
    )
    RETURNING imtipotrabajador_id INTO v_id;
    
    RETURN v_id;
END;
$$;


ALTER FUNCTION public.sp_guardar_tipo_trabajador(p_codigointerno character varying, p_tipoid integer, p_regimenid integer, p_descripcion character varying, p_empresaid integer) OWNER TO postgres;

--
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
-- Name: sp_listar_comisiones_afp(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_comisiones_afp(p_empresaid integer) RETURNS TABLE(id integer, mes integer, anio integer, regimenid integer, regimencodsunat character varying, regimenabreviatura character varying, comisionflujo numeric, comisionanualsaldo numeric, primaseguro numeric, aporteobligatorio numeric, remunmaxima numeric, estado integer, empresaid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.imafp_id,
        a.ia_mes,
        a.ia_anio,
        a.ia_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        a.da_comisionflujo,
        a.da_comisionanualsaldo,
        a.da_primaseguro,
        a.da_aporteobligatorio,
        a.da_remunmaxima,
        a.ia_estado,
        a.empresa_id
    FROM rrhh_mafp a
    INNER JOIN rrhh_mregimenpensionario r ON a.ia_regimenpensionario = r.imregimenpensionario_id
    WHERE a.empresa_id = p_empresaid AND a.ia_estado = 1
    ORDER BY a.ia_anio DESC, a.ia_mes DESC, r.trp_abreviatura;
END;
$$;


ALTER FUNCTION public.sp_listar_comisiones_afp(p_empresaid integer) OWNER TO postgres;

--
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
-- Name: sp_listar_feriados(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_feriados(p_empresaid integer) RETURNS TABLE(id integer, fechaferiado date, diaferiado character varying, denominacion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone, fechamodificacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion,
        dtf_fechamodificacion
    FROM rrhh_mferiados
    WHERE imempresa_id = p_empresaid
        AND if_estado = 1
    ORDER BY ff_fechaferiado;
END;
$$;


ALTER FUNCTION public.sp_listar_feriados(p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_listar_motivos_prestamo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_motivos_prestamo(p_empresaid integer) RETURNS TABLE(id integer, descripcion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone, fechamodificacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE imempresa_id = p_empresaid
        AND imp_estado = 1  -- Solo mostrar activos
    ORDER BY tmp_descripcion;
END;
$$;


ALTER FUNCTION public.sp_listar_motivos_prestamo(p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_listar_regimenes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_regimenes() RETURNS TABLE(id integer, codsunat character varying, descripcion character varying, abreviatura character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imregimenpensionario_id,
        trp_codsunat,
        trp_descripcion,
        trp_abreviatura
    FROM rrhh_mregimenpensionario
    ORDER BY imregimenpensionario_id;
END;
$$;


ALTER FUNCTION public.sp_listar_regimenes() OWNER TO postgres;

--
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
-- Name: sp_listar_tipos(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_tipos() RETURNS TABLE(id integer, codsunat character varying, descripcion character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imtipo_id,
        tt_codsunat,
        tt_descripcion
    FROM rrhh_mtipo
    ORDER BY imtipo_id;
END;
$$;


ALTER FUNCTION public.sp_listar_tipos() OWNER TO postgres;

--
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
-- Name: FUNCTION sp_listar_tipos_documento(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.sp_listar_tipos_documento() IS 'Lista todos los tipos de documento disponibles en el sistema';


--
-- Name: sp_listar_tipos_trabajador(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_listar_tipos_trabajador(p_empresaid integer) RETURNS TABLE(id integer, codigointerno character varying, tipoid integer, tipocodsunat character varying, tipodescripcion character varying, regimenid integer, regimencodsunat character varying, regimenabreviatura character varying, descripcion character varying, estado integer, empresaid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.imtipotrabajador_id,
        tt.ttt_codigointerno,
        tt.itt_tipo,
        t.tt_codsunat,
        t.tt_descripcion,
        tt.itt_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        tt.ttt_descripcion,
        tt.itt_estado,
        tt.empresa_id
    FROM rrhh_mtipotrabajador tt
    INNER JOIN rrhh_mtipo t ON tt.itt_tipo = t.imtipo_id
    INNER JOIN rrhh_mregimenpensionario r ON tt.itt_regimenpensionario = r.imregimenpensionario_id
    WHERE tt.empresa_id = p_empresaid AND tt.itt_estado = 1
    ORDER BY tt.ttt_codigointerno;
END;
$$;


ALTER FUNCTION public.sp_listar_tipos_trabajador(p_empresaid integer) OWNER TO postgres;

--
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
-- Name: sp_obtener_comision_afp(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_comision_afp(p_id integer) RETURNS TABLE(id integer, mes integer, anio integer, regimenid integer, regimencodsunat character varying, regimenabreviatura character varying, comisionflujo numeric, comisionanualsaldo numeric, primaseguro numeric, aporteobligatorio numeric, remunmaxima numeric, estado integer, empresaid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.imafp_id,
        a.ia_mes,
        a.ia_anio,
        a.ia_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        a.da_comisionflujo,
        a.da_comisionanualsaldo,
        a.da_primaseguro,
        a.da_aporteobligatorio,
        a.da_remunmaxima,
        a.ia_estado,
        a.empresa_id
    FROM rrhh_mafp a
    INNER JOIN rrhh_mregimenpensionario r ON a.ia_regimenpensionario = r.imregimenpensionario_id
    WHERE a.imafp_id = p_id;
END;
$$;


ALTER FUNCTION public.sp_obtener_comision_afp(p_id integer) OWNER TO postgres;

--
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
-- Name: sp_obtener_feriado(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_feriado(p_feriadoid integer, p_empresaid integer) RETURNS TABLE(id integer, fechaferiado date, diaferiado character varying, denominacion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone, fechamodificacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion,
        dtf_fechamodificacion
    FROM rrhh_mferiados
    WHERE imferiado_id = p_feriadoid
        AND imempresa_id = p_empresaid;
END;
$$;


ALTER FUNCTION public.sp_obtener_feriado(p_feriadoid integer, p_empresaid integer) OWNER TO postgres;

--
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
-- Name: sp_obtener_motivo_prestamo(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_motivo_prestamo(p_motivoid integer, p_empresaid integer) RETURNS TABLE(id integer, descripcion character varying, estado integer, empresaid integer, fechacreacion timestamp without time zone, fechamodificacion timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = p_motivoid
        AND imempresa_id = p_empresaid;
END;
$$;


ALTER FUNCTION public.sp_obtener_motivo_prestamo(p_motivoid integer, p_empresaid integer) OWNER TO postgres;

--
-- Name: sp_obtener_regimen(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_regimen(p_regimenid integer) RETURNS TABLE(id integer, codsunat character varying, descripcion character varying, abreviatura character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imregimenpensionario_id,
        trp_codsunat,
        trp_descripcion,
        trp_abreviatura
    FROM rrhh_mregimenpensionario
    WHERE imregimenpensionario_id = p_regimenid;
END;
$$;


ALTER FUNCTION public.sp_obtener_regimen(p_regimenid integer) OWNER TO postgres;

--
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
-- Name: sp_obtener_tipo(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_tipo(p_tipoid integer) RETURNS TABLE(id integer, codsunat character varying, descripcion character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imtipo_id,
        tt_codsunat,
        tt_descripcion
    FROM rrhh_mtipo
    WHERE imtipo_id = p_tipoid;
END;
$$;


ALTER FUNCTION public.sp_obtener_tipo(p_tipoid integer) OWNER TO postgres;

--
-- Name: sp_obtener_tipo_trabajador(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sp_obtener_tipo_trabajador(p_id integer) RETURNS TABLE(id integer, codigointerno character varying, tipoid integer, tipocodsunat character varying, tipodescripcion character varying, regimenid integer, regimencodsunat character varying, regimenabreviatura character varying, descripcion character varying, estado integer, empresaid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.imtipotrabajador_id,
        tt.ttt_codigointerno,
        tt.itt_tipo,
        t.tt_codsunat,
        t.tt_descripcion,
        tt.itt_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        tt.ttt_descripcion,
        tt.itt_estado,
        tt.empresa_id
    FROM rrhh_mtipotrabajador tt
    INNER JOIN rrhh_mtipo t ON tt.itt_tipo = t.imtipo_id
    INNER JOIN rrhh_mregimenpensionario r ON tt.itt_regimenpensionario = r.imregimenpensionario_id
    WHERE tt.imtipotrabajador_id = p_id;
END;
$$;


ALTER FUNCTION public.sp_obtener_tipo_trabajador(p_id integer) OWNER TO postgres;

--
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
-- Name: rrhh_drol_menu_idrm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_drol_menu_idrm_id_seq OWNED BY public.rrhh_drol_menu.idrm_id;


--
-- Name: rrhh_mafp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mafp (
    imafp_id integer NOT NULL,
    ia_mes integer NOT NULL,
    ia_anio integer NOT NULL,
    ia_regimenpensionario integer NOT NULL,
    da_comisionflujo numeric(10,2) DEFAULT 0.00 NOT NULL,
    da_comisionanualsaldo numeric(10,2) DEFAULT 0.00 NOT NULL,
    da_primaseguro numeric(10,2) DEFAULT 0.00 NOT NULL,
    da_aporteobligatorio numeric(10,2) DEFAULT 0.00 NOT NULL,
    da_remunmaxima numeric(10,2) DEFAULT 0.00 NOT NULL,
    ia_estado integer DEFAULT 1 NOT NULL,
    empresa_id integer DEFAULT 1 NOT NULL,
    CONSTRAINT chk_anio_valido CHECK (((ia_anio >= 2000) AND (ia_anio <= 2100))),
    CONSTRAINT chk_mes_valido CHECK (((ia_mes >= 1) AND (ia_mes <= 12)))
);


ALTER TABLE public.rrhh_mafp OWNER TO postgres;

--
-- Name: TABLE rrhh_mafp; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rrhh_mafp IS 'Tabla de comisiones AFP por empresa y periodo';


--
-- Name: COLUMN rrhh_mafp.imafp_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.imafp_id IS 'ID único de la comisión AFP';


--
-- Name: COLUMN rrhh_mafp.ia_mes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.ia_mes IS 'Mes del periodo (1-12)';


--
-- Name: COLUMN rrhh_mafp.ia_anio; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.ia_anio IS 'Año del periodo';


--
-- Name: COLUMN rrhh_mafp.ia_regimenpensionario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.ia_regimenpensionario IS 'Referencia al régimen pensionario (AFP)';


--
-- Name: COLUMN rrhh_mafp.da_comisionflujo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.da_comisionflujo IS 'Comisión sobre flujo (%)';


--
-- Name: COLUMN rrhh_mafp.da_comisionanualsaldo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.da_comisionanualsaldo IS 'Comisión anual sobre saldo';


--
-- Name: COLUMN rrhh_mafp.da_primaseguro; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.da_primaseguro IS 'Prima de seguro (%)';


--
-- Name: COLUMN rrhh_mafp.da_aporteobligatorio; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.da_aporteobligatorio IS 'Aporte obligatorio (%)';


--
-- Name: COLUMN rrhh_mafp.da_remunmaxima; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.da_remunmaxima IS 'Remuneración máxima (%)';


--
-- Name: COLUMN rrhh_mafp.ia_estado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.ia_estado IS 'Estado del registro (1=activo, 0=inactivo)';


--
-- Name: COLUMN rrhh_mafp.empresa_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mafp.empresa_id IS 'ID de la empresa';


--
-- Name: rrhh_mafp_imafp_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mafp_imafp_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mafp_imafp_id_seq OWNER TO postgres;

--
-- Name: rrhh_mafp_imafp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mafp_imafp_id_seq OWNED BY public.rrhh_mafp.imafp_id;


--
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
-- Name: rrhh_mferiados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mferiados (
    imferiado_id integer NOT NULL,
    ff_fechaferiado date NOT NULL,
    tf_diaferiado character varying(50) NOT NULL,
    tf_denominacion character varying(200) NOT NULL,
    if_estado integer DEFAULT 1 NOT NULL,
    imempresa_id integer NOT NULL,
    dtf_fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dtf_fechamodificacion timestamp without time zone
);


ALTER TABLE public.rrhh_mferiados OWNER TO postgres;

--
-- Name: rrhh_mferiados_imferiado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mferiados_imferiado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mferiados_imferiado_id_seq OWNER TO postgres;

--
-- Name: rrhh_mferiados_imferiado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mferiados_imferiado_id_seq OWNED BY public.rrhh_mferiados.imferiado_id;


--
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
-- Name: rrhh_mmotivoprestamo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mmotivoprestamo (
    immmotivoprestamo_id integer NOT NULL,
    tmp_descripcion character varying(100) NOT NULL,
    imp_estado integer DEFAULT 1 NOT NULL,
    imempresa_id integer NOT NULL,
    dtmp_fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dtmp_fechamodificacion timestamp without time zone
);


ALTER TABLE public.rrhh_mmotivoprestamo OWNER TO postgres;

--
-- Name: rrhh_mmotivoprestamo_immmotivoprestamo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mmotivoprestamo_immmotivoprestamo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mmotivoprestamo_immmotivoprestamo_id_seq OWNER TO postgres;

--
-- Name: rrhh_mmotivoprestamo_immmotivoprestamo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mmotivoprestamo_immmotivoprestamo_id_seq OWNED BY public.rrhh_mmotivoprestamo.immmotivoprestamo_id;


--
-- Name: rrhh_mregimenpensionario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mregimenpensionario (
    imregimenpensionario_id integer NOT NULL,
    trp_codsunat character varying(50) NOT NULL,
    trp_descripcion character varying(200) NOT NULL,
    trp_abreviatura character varying(100) NOT NULL
);


ALTER TABLE public.rrhh_mregimenpensionario OWNER TO postgres;

--
-- Name: TABLE rrhh_mregimenpensionario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rrhh_mregimenpensionario IS 'Tabla maestra de regímenes pensionarios según SUNAT';


--
-- Name: COLUMN rrhh_mregimenpensionario.imregimenpensionario_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mregimenpensionario.imregimenpensionario_id IS 'ID único del régimen pensionario';


--
-- Name: COLUMN rrhh_mregimenpensionario.trp_codsunat; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mregimenpensionario.trp_codsunat IS 'Código SUNAT del régimen pensionario';


--
-- Name: COLUMN rrhh_mregimenpensionario.trp_descripcion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mregimenpensionario.trp_descripcion IS 'Descripción del régimen pensionario';


--
-- Name: COLUMN rrhh_mregimenpensionario.trp_abreviatura; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mregimenpensionario.trp_abreviatura IS 'Abreviatura del régimen pensionario';


--
-- Name: rrhh_mregimenpensionario_imregimenpensionario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mregimenpensionario_imregimenpensionario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mregimenpensionario_imregimenpensionario_id_seq OWNER TO postgres;

--
-- Name: rrhh_mregimenpensionario_imregimenpensionario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mregimenpensionario_imregimenpensionario_id_seq OWNED BY public.rrhh_mregimenpensionario.imregimenpensionario_id;


--
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
-- Name: rrhh_mrol_dashboard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mrol_dashboard (
    imrol_id integer DEFAULT nextval('public.rrhh_mrol_dashboard_imrol_id_seq'::regclass) NOT NULL,
    tr_descripcion character varying(100) NOT NULL,
    ir_estado integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.rrhh_mrol_dashboard OWNER TO postgres;

--
-- Name: rrhh_mtipo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mtipo (
    imtipo_id integer NOT NULL,
    tt_codsunat character varying(20) NOT NULL,
    tt_descripcion character varying(200) NOT NULL
);


ALTER TABLE public.rrhh_mtipo OWNER TO postgres;

--
-- Name: rrhh_mtipo_imtipo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mtipo_imtipo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mtipo_imtipo_id_seq OWNER TO postgres;

--
-- Name: rrhh_mtipo_imtipo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mtipo_imtipo_id_seq OWNED BY public.rrhh_mtipo.imtipo_id;


--
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
-- Name: rrhh_mtipodocumento_imtipodoc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq OWNED BY public.rrhh_mtipodocumento.imtipodoc_id;


--
-- Name: rrhh_mtipotrabajador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rrhh_mtipotrabajador (
    imtipotrabajador_id integer NOT NULL,
    ttt_codigointerno character varying(20) NOT NULL,
    itt_tipo integer NOT NULL,
    itt_regimenpensionario integer NOT NULL,
    ttt_descripcion character varying(200) NOT NULL,
    itt_estado integer DEFAULT 1 NOT NULL,
    empresa_id integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.rrhh_mtipotrabajador OWNER TO postgres;

--
-- Name: TABLE rrhh_mtipotrabajador; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rrhh_mtipotrabajador IS 'Tabla de tipos de trabajador por empresa';


--
-- Name: COLUMN rrhh_mtipotrabajador.imtipotrabajador_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.imtipotrabajador_id IS 'ID único del tipo de trabajador';


--
-- Name: COLUMN rrhh_mtipotrabajador.ttt_codigointerno; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.ttt_codigointerno IS 'Código interno de 3 dígitos';


--
-- Name: COLUMN rrhh_mtipotrabajador.itt_tipo; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.itt_tipo IS 'Referencia al tipo SUNAT (rrhh_mtipo)';


--
-- Name: COLUMN rrhh_mtipotrabajador.itt_regimenpensionario; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.itt_regimenpensionario IS 'Referencia al régimen pensionario';


--
-- Name: COLUMN rrhh_mtipotrabajador.ttt_descripcion; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.ttt_descripcion IS 'Descripción del tipo de trabajador';


--
-- Name: COLUMN rrhh_mtipotrabajador.itt_estado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.itt_estado IS 'Estado del registro (1=activo, 0=inactivo)';


--
-- Name: COLUMN rrhh_mtipotrabajador.empresa_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rrhh_mtipotrabajador.empresa_id IS 'ID de la empresa';


--
-- Name: rrhh_mtipotrabajador_imtipotrabajador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rrhh_mtipotrabajador_imtipotrabajador_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rrhh_mtipotrabajador_imtipotrabajador_id_seq OWNER TO postgres;

--
-- Name: rrhh_mtipotrabajador_imtipotrabajador_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rrhh_mtipotrabajador_imtipotrabajador_id_seq OWNED BY public.rrhh_mtipotrabajador.imtipotrabajador_id;


--
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
-- Name: rrhh_drol_menu idrm_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_drol_menu ALTER COLUMN idrm_id SET DEFAULT nextval('public.rrhh_drol_menu_idrm_id_seq'::regclass);


--
-- Name: rrhh_mafp imafp_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mafp ALTER COLUMN imafp_id SET DEFAULT nextval('public.rrhh_mafp_imafp_id_seq'::regclass);


--
-- Name: rrhh_mferiados imferiado_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mferiados ALTER COLUMN imferiado_id SET DEFAULT nextval('public.rrhh_mferiados_imferiado_id_seq'::regclass);


--
-- Name: rrhh_mmotivoprestamo immmotivoprestamo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mmotivoprestamo ALTER COLUMN immmotivoprestamo_id SET DEFAULT nextval('public.rrhh_mmotivoprestamo_immmotivoprestamo_id_seq'::regclass);


--
-- Name: rrhh_mregimenpensionario imregimenpensionario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mregimenpensionario ALTER COLUMN imregimenpensionario_id SET DEFAULT nextval('public.rrhh_mregimenpensionario_imregimenpensionario_id_seq'::regclass);


--
-- Name: rrhh_mtipo imtipo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipo ALTER COLUMN imtipo_id SET DEFAULT nextval('public.rrhh_mtipo_imtipo_id_seq'::regclass);


--
-- Name: rrhh_mtipodocumento imtipodoc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipodocumento ALTER COLUMN imtipodoc_id SET DEFAULT nextval('public.rrhh_mtipodocumento_imtipodoc_id_seq'::regclass);


--
-- Name: rrhh_mtipotrabajador imtipotrabajador_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipotrabajador ALTER COLUMN imtipotrabajador_id SET DEFAULT nextval('public.rrhh_mtipotrabajador_imtipotrabajador_id_seq'::regclass);


--
-- Data for Name: rrhh_drol_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_drol_menu (idrm_id, irm_rol, irm_menu, irm_estado) FROM stdin;
150	5	18	1
151	5	19	1
152	5	2	1
153	5	17	1
154	5	20	1
155	5	21	1
156	5	22	1
157	5	23	1
158	5	24	1
159	5	25	1
160	5	26	1
161	5	28	1
162	5	29	1
123	4	3	1
124	4	1	1
125	4	5	1
126	4	4	1
127	4	6	1
128	4	7	1
129	4	2	1
130	4	8	1
131	4	9	1
132	4	10	1
133	4	13	1
134	4	14	1
135	4	15	1
136	4	16	1
137	4	17	1
138	4	18	1
139	4	19	1
140	4	20	1
141	4	21	1
142	4	22	1
143	4	23	1
144	4	24	1
145	4	25	1
146	4	26	1
147	4	27	1
148	4	28	1
149	4	29	1
\.


--
-- Data for Name: rrhh_mafp; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mafp (imafp_id, ia_mes, ia_anio, ia_regimenpensionario, da_comisionflujo, da_comisionanualsaldo, da_primaseguro, da_aporteobligatorio, da_remunmaxima, ia_estado, empresa_id) FROM stdin;
1	11	2025	2	1.55	0.78	1.37	10.00	12178.56	1	3
\.


--
-- Data for Name: rrhh_mempresa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mempresa (imempresa_id, te_descripcion, te_ruc, te_telefono, te_direccion, ie_estado) FROM stdin;
3	EMPRESA_TEST	12345678910	9283647583	Av. Los Alamos	1
4	PROMART	12345677890	9345673844	Av. Los Cipreses	1
\.


--
-- Data for Name: rrhh_mferiados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mferiados (imferiado_id, ff_fechaferiado, tf_diaferiado, tf_denominacion, if_estado, imempresa_id, dtf_fechacreacion, dtf_fechamodificacion) FROM stdin;
1	2025-01-01	Miércoles	Año Nuevo	1	3	2025-11-25 22:50:03.477967	2025-11-25 22:53:47.447869
2	2025-11-20	Jueves	asdas	0	3	2025-11-26 09:21:50.49392	2025-11-26 09:21:59.225082
\.


--
-- Data for Name: rrhh_mmenu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mmenu (menu_id, menu_ruta, menu_icon, menu_nombre, menu_estado, menu_padre, menu_nivel, menu_posicion) FROM stdin;
3	\N	fas fa-cog	Maestros	1	2	2	1
1	motivo-prestamo	fas fa-money-bill-wave	Motivo Préstamo	1	3	3	1
5	tipo-trabajador	fas fa-user-cog	Tipo Trabajador	1	3	3	3
4	feriados	fas fa-calendar-check	Feriados	1	3	3	2
6	comisiones-afp	fas fa-file-invoice-dollar	Comisiones AFP	1	3	3	4
7	\N	fas fa-cog	Gestión de Seguridad	1	\N	1	1
2	\N	fas fa-users	Gestión de Planilla	1	\N	1	2
8	usuarios	fas fa-user	Usuarios	1	7	2	1
9	rol	fas fa-user-shield	Rol	1	7	2	2
10	asignar-rol	fas fa-user-check	Asignar Rol	1	7	2	3
12	registro-usuario	fas fa-user-plus	Registrar Usuario	\N	\N	\N	\N
13	concepto	fas fa-list-alt	Concepto	1	3	3	5
14	conceptos-regimen-laboral	fas fa-list-alt	Conceptos Régimen Laboral	1	3	3	6
15	sede	fas fa-building	Sede	1	3	3	7
16	puestos-cargos	fas fa-user-tie	Puestos / Cargos	1	3	3	8
17	\N	fas fa-sync-alt	Procesos	1	2	2	2
18	trabajador	fas fa-user-circle	Trabajador	1	17	3	1
19	contrato	fas fa-pen	Contrato	1	17	3	2
20	asistencia	fas fa-calendar-check	Asistencia	1	17	3	3
21	consultar-asistencia	fas fa-calendar	Consultar Asistencia	1	17	3	4
22	cronograma-vacaciones	fas fa-umbrella-beach	Cronograma Vacaciones	1	17	3	5
23	conceptos-variables	fas fa-file-signature	Conceptos Variables	1	17	3	6
24	subsidios	fas fa-hands-helping	Subsidios	1	17	3	7
25	apoyo-bono	fas fa-hand-holding-usd	Apoyo / Bono	1	17	3	8
26	prestamos	fas fa-money-bill-wave	Préstamos	1	17	3	9
27	creditos	fas fa-dollar-sign	Créditos	1	17	3	10
28	jornada-laboral	fas fa-clock	Jornada Laboral	1	17	3	11
29	generar-planilla	fas fa-check-circle	Generar Planilla	1	17	3	12
\.


--
-- Data for Name: rrhh_mmotivoprestamo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mmotivoprestamo (immmotivoprestamo_id, tmp_descripcion, imp_estado, imempresa_id, dtmp_fechacreacion, dtmp_fechamodificacion) FROM stdin;
1	Motivo 1	1	3	2025-11-06 10:30:50.879704	2025-11-25 22:20:30.207632
\.


--
-- Data for Name: rrhh_mregimenpensionario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mregimenpensionario (imregimenpensionario_id, trp_codsunat, trp_descripcion, trp_abreviatura) FROM stdin;
1	02	DECRETO LEY 1990 - SISTEMA NACIONAL DE PENSIONES - ONP	ONP
2	21	SPP INTEGRA	INTEGRA
3	22	SPP HORIZONTE	HORIZONTE
4	23	SPP PROFUTURO	PROFUTURO
5	24	SPP PRIMA	PRIMA
\.


--
-- Data for Name: rrhh_mrol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mrol (imrol_id, tr_descripcion, ir_estado, ir_empresa) FROM stdin;
5	Administrador	1	3
6	Administrador	1	4
7	Gerente	1	4
\.


--
-- Data for Name: rrhh_mrol_dashboard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mrol_dashboard (imrol_id, tr_descripcion, ir_estado) FROM stdin;
4	Super Administrador	1
\.


--
-- Data for Name: rrhh_mtipo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mtipo (imtipo_id, tt_codsunat, tt_descripcion) FROM stdin;
1	19	EJECUTIVO
2	20	OBRERO
3	21	EMPLEADO
4	22	TRAB.PORTUARIO
5	23	PRACT. SENATI
6	27	CONSTRUCCION CIVIL
7	28	PILOTO Y COPIL DE AVIA. COM.
8	29	MARIT. FLUVIAL O LACUSTRE
9	30	PERIODISTA
10	31	TRAB. DE LA IND. DE CUERO
11	32	MINERO DE SOCAVON
12	36	PESCADOR - LEY 28320
13	37	MINERO DE TAJO ABIERTO
14	38	MINERO IND. MINERA METAL
15	56	ARTISTA - LEY 28131
16	64	AGRARIO DEPEND. - LEY 27360
17	65	TRAB. ACTIV.ACUICOLA LEY 27460
18	67	REG. ESPECIAL D. LEG.1057 - CAS
19	82	FUNCIONARIO PUBLICO
20	83	EMPLEADO DE CONFIANZA
21	84	SERVIDOR PUB - DIRECT SUPERIOR
22	85	SERVIDOR PUB - EJECUTIVO
23	86	SERVIDOR PUB - ESPECIALISTA
24	87	SERVIDOR PUB - DE APOYO
25	90	GERENTES PUB - D.LEG 1024
26	91	MIIEMBROS DE OTROS REG. ESPEC S.PUBLICO
27	98	CUARTA - QUINTA CATEGORIA
\.


--
-- Data for Name: rrhh_mtipodocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mtipodocumento (imtipodoc_id, ttd_codsunat, ttd_descripcion, ttd_abreviatura) FROM stdin;
1	01	Doc. Nacional de Identidad	DNI
2	04	Carné de Extranjería	CARNET EXT.
3	06	Reg. Único de Contribuyentes	RUC
4	07	Pasaporte	PASAPORTE
\.


--
-- Data for Name: rrhh_mtipotrabajador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_mtipotrabajador (imtipotrabajador_id, ttt_codigointerno, itt_tipo, itt_regimenpensionario, ttt_descripcion, itt_estado, empresa_id) FROM stdin;
1	001	1	1	EJECUTIVO - ONP	1	3
\.


--
-- Data for Name: rrhh_musuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rrhh_musuario (imusuario_id, tu_apellidopaterno, tu_apellidomaterno, tu_nombres, iu_empresa, iu_sede, iu_tipodocumento, tu_nrodocumento, fu_fechanacimiento, iu_rol, iu_puesto, tu_nrocelular, tu_correo, iu_estado, tu_usuario, tu_password, iu_primerlogin) FROM stdin;
8	Desarrollador	Chidoris	Super	3	\N	1	912344756	2002-10-19	4	2	924566734	admin@admin.com	1	admin	$2a$10$8UuRnlfjcMuB.l/zy4osfuWue.ZLTmA8y4pvkisLV9F0Xn4i5ejGS	0
9	Tercero		Sr. Michu	3	\N	1	74561799	2002-02-19	5	\N	986608586	macsyt19@gmail.com	1	tercero	$2a$10$RZVubL7xjmE04UtAIoA5ZehyIa716678aeuGOK64DwSVWRPrggeBS	0
10	Perez	Lobrego	Roberto	4	\N	1	87456733	2002-02-19	4	1	9233444756	prueba@prueba.com	1	prueba	$2a$10$Nv0FMJK8pP5zcNJMCET2x.KLYOowk11/OAC9g3Ud4uED6YX203EyC	0
\.


--
-- Name: rrhh_drol_menu_idrm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_drol_menu_idrm_id_seq', 162, true);


--
-- Name: rrhh_mafp_imafp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mafp_imafp_id_seq', 1, true);


--
-- Name: rrhh_mempresa_imempresa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rrhh_mempresa_imempresa_id_seq', 4, true);


--
-- Name: rrhh_mferiados_imferiado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mferiados_imferiado_id_seq', 2, true);


--
-- Name: rrhh_mmotivoprestamo_immmotivoprestamo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mmotivoprestamo_immmotivoprestamo_id_seq', 1, true);


--
-- Name: rrhh_mregimenpensionario_imregimenpensionario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mregimenpensionario_imregimenpensionario_id_seq', 5, true);


--
-- Name: rrhh_mrol_dashboard_imrol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mrol_dashboard_imrol_id_seq', 4, true);


--
-- Name: rrhh_mrol_imrol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rrhh_mrol_imrol_id_seq', 7, true);


--
-- Name: rrhh_mtipo_imtipo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mtipo_imtipo_id_seq', 27, true);


--
-- Name: rrhh_mtipodocumento_imtipodoc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mtipodocumento_imtipodoc_id_seq', 4, true);


--
-- Name: rrhh_mtipotrabajador_imtipotrabajador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rrhh_mtipotrabajador_imtipotrabajador_id_seq', 1, true);


--
-- Name: rrhh_musuario_imusuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rrhh_musuario_imusuario_id_seq', 10, true);


--
-- Name: rrhh_drol_menu rrhh_drol_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_drol_menu
    ADD CONSTRAINT rrhh_drol_menu_pkey PRIMARY KEY (idrm_id);


--
-- Name: rrhh_mafp rrhh_mafp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mafp
    ADD CONSTRAINT rrhh_mafp_pkey PRIMARY KEY (imafp_id);


--
-- Name: rrhh_mempresa rrhh_mempresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mempresa
    ADD CONSTRAINT rrhh_mempresa_pkey PRIMARY KEY (imempresa_id);


--
-- Name: rrhh_mferiados rrhh_mferiados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mferiados
    ADD CONSTRAINT rrhh_mferiados_pkey PRIMARY KEY (imferiado_id);


--
-- Name: rrhh_mmotivoprestamo rrhh_mmotivoprestamo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mmotivoprestamo
    ADD CONSTRAINT rrhh_mmotivoprestamo_pkey PRIMARY KEY (immmotivoprestamo_id);


--
-- Name: rrhh_mregimenpensionario rrhh_mregimenpensionario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mregimenpensionario
    ADD CONSTRAINT rrhh_mregimenpensionario_pkey PRIMARY KEY (imregimenpensionario_id);


--
-- Name: rrhh_mrol_dashboard rrhh_mrol_dashboard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mrol_dashboard
    ADD CONSTRAINT rrhh_mrol_dashboard_pkey PRIMARY KEY (imrol_id);


--
-- Name: rrhh_mrol rrhh_mrol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mrol
    ADD CONSTRAINT rrhh_mrol_pkey PRIMARY KEY (imrol_id);


--
-- Name: rrhh_mtipo rrhh_mtipo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipo
    ADD CONSTRAINT rrhh_mtipo_pkey PRIMARY KEY (imtipo_id);


--
-- Name: rrhh_mtipo rrhh_mtipo_tt_codsunat_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipo
    ADD CONSTRAINT rrhh_mtipo_tt_codsunat_key UNIQUE (tt_codsunat);


--
-- Name: rrhh_mtipodocumento rrhh_mtipodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipodocumento
    ADD CONSTRAINT rrhh_mtipodocumento_pkey PRIMARY KEY (imtipodoc_id);


--
-- Name: rrhh_mtipotrabajador rrhh_mtipotrabajador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipotrabajador
    ADD CONSTRAINT rrhh_mtipotrabajador_pkey PRIMARY KEY (imtipotrabajador_id);


--
-- Name: rrhh_musuario rrhh_musuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_musuario
    ADD CONSTRAINT rrhh_musuario_pkey PRIMARY KEY (imusuario_id);


--
-- Name: rrhh_musuario rrhh_musuario_tu_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_musuario
    ADD CONSTRAINT rrhh_musuario_tu_usuario_key UNIQUE (tu_usuario);


--
-- Name: rrhh_mafp uk_afp_periodo_regimen_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mafp
    ADD CONSTRAINT uk_afp_periodo_regimen_empresa UNIQUE (ia_mes, ia_anio, ia_regimenpensionario, empresa_id);


--
-- Name: rrhh_mregimenpensionario uk_regimen_codsunat; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mregimenpensionario
    ADD CONSTRAINT uk_regimen_codsunat UNIQUE (trp_codsunat);


--
-- Name: rrhh_mtipotrabajador uk_tipotrabajador_codigo_empresa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipotrabajador
    ADD CONSTRAINT uk_tipotrabajador_codigo_empresa UNIQUE (ttt_codigointerno, empresa_id);


--
-- Name: idx_afp_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_afp_empresa ON public.rrhh_mafp USING btree (empresa_id);


--
-- Name: idx_afp_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_afp_estado ON public.rrhh_mafp USING btree (ia_estado);


--
-- Name: idx_afp_periodo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_afp_periodo ON public.rrhh_mafp USING btree (ia_anio, ia_mes);


--
-- Name: idx_afp_regimen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_afp_regimen ON public.rrhh_mafp USING btree (ia_regimenpensionario);


--
-- Name: idx_regimen_codsunat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_regimen_codsunat ON public.rrhh_mregimenpensionario USING btree (trp_codsunat);


--
-- Name: idx_tipotrabajador_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipotrabajador_empresa ON public.rrhh_mtipotrabajador USING btree (empresa_id);


--
-- Name: idx_tipotrabajador_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipotrabajador_estado ON public.rrhh_mtipotrabajador USING btree (itt_estado);


--
-- Name: idx_tipotrabajador_regimen; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipotrabajador_regimen ON public.rrhh_mtipotrabajador USING btree (itt_regimenpensionario);


--
-- Name: idx_tipotrabajador_tipo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tipotrabajador_tipo ON public.rrhh_mtipotrabajador USING btree (itt_tipo);


--
-- Name: ix_rrhh_mferiados_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mferiados_empresa ON public.rrhh_mferiados USING btree (imempresa_id);


--
-- Name: ix_rrhh_mferiados_empresa_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mferiados_empresa_estado ON public.rrhh_mferiados USING btree (imempresa_id, if_estado);


--
-- Name: ix_rrhh_mferiados_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mferiados_estado ON public.rrhh_mferiados USING btree (if_estado);


--
-- Name: ix_rrhh_mferiados_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mferiados_fecha ON public.rrhh_mferiados USING btree (ff_fechaferiado);


--
-- Name: ix_rrhh_mmotivoprestamo_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mmotivoprestamo_empresa ON public.rrhh_mmotivoprestamo USING btree (imempresa_id);


--
-- Name: ix_rrhh_mmotivoprestamo_empresa_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mmotivoprestamo_empresa_estado ON public.rrhh_mmotivoprestamo USING btree (imempresa_id, imp_estado);


--
-- Name: ix_rrhh_mmotivoprestamo_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mmotivoprestamo_estado ON public.rrhh_mmotivoprestamo USING btree (imp_estado);


--
-- Name: ix_rrhh_mtipo_codsunat; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_rrhh_mtipo_codsunat ON public.rrhh_mtipo USING btree (tt_codsunat);


--
-- Name: rrhh_mafp fk_afp_regimen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mafp
    ADD CONSTRAINT fk_afp_regimen FOREIGN KEY (ia_regimenpensionario) REFERENCES public.rrhh_mregimenpensionario(imregimenpensionario_id) ON DELETE RESTRICT;


--
-- Name: rrhh_mrol fk_rol_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mrol
    ADD CONSTRAINT fk_rol_empresa FOREIGN KEY (ir_empresa) REFERENCES public.rrhh_mempresa(imempresa_id) ON DELETE CASCADE;


--
-- Name: rrhh_mferiados fk_rrhh_mferiados_empresa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mferiados
    ADD CONSTRAINT fk_rrhh_mferiados_empresa FOREIGN KEY (imempresa_id) REFERENCES public.rrhh_mempresa(imempresa_id);


--
-- Name: rrhh_mtipotrabajador fk_tipotrabajador_regimen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipotrabajador
    ADD CONSTRAINT fk_tipotrabajador_regimen FOREIGN KEY (itt_regimenpensionario) REFERENCES public.rrhh_mregimenpensionario(imregimenpensionario_id) ON DELETE RESTRICT;


--
-- Name: rrhh_mtipotrabajador fk_tipotrabajador_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rrhh_mtipotrabajador
    ADD CONSTRAINT fk_tipotrabajador_tipo FOREIGN KEY (itt_tipo) REFERENCES public.rrhh_mtipo(imtipo_id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict Axvp3PCCON0yEmfBmhHRoF2hS1Qh7Z9Q6hskWP5ZJXdXeFsfjMIYb0aujyJ6ya7

