-- =====================================================
-- ACTUALIZAR PROCEDIMIENTO sp_actualizar_contrato_trabajador
-- Para que use la nueva función con fecha de ingreso
-- =====================================================

DROP FUNCTION IF EXISTS public.sp_actualizar_contrato_trabajador CASCADE;

CREATE OR REPLACE FUNCTION public.sp_actualizar_contrato_trabajador(
    p_contrato_id BIGINT,
    p_trabajador_id BIGINT,
    p_tipocontrato_id INTEGER,
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_sede_id BIGINT,
    p_puesto_id INTEGER,
    p_turno_id VARCHAR(2),
    p_horario_id VARCHAR(2),
    p_hora_entrada TIME,
    p_hora_salida TIME,
    p_dia_descanso_id VARCHAR(2),
    p_tipo_trabajador_id INTEGER,
    p_regimen_pensionario_id INTEGER,
    p_regimen_laboral_id BIGINT,
    p_hora_laboral DECIMAL(5,2),
    p_remuneracion_basica DECIMAL(10,2),
    p_remuneracion_rc DECIMAL(10,2),
    p_sueldo_mensual DECIMAL(10,2),
    p_cuspp VARCHAR(20),
    p_empresa_id INTEGER,
    p_usuario_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    v_regimen_codigo VARCHAR(2);
    v_actualizado BOOLEAN;
BEGIN
    -- Actualizar el contrato
    UPDATE public.rrhh_mcontratotrabajador
    SET 
        ict_trabajador = p_trabajador_id,
        ict_tipocontrato = p_tipocontrato_id,
        fct_fechainiciolaboral = p_fecha_inicio,
        fct_fechafinlaboral = p_fecha_fin,
        ict_sede = p_sede_id,
        ict_puesto = p_puesto_id,
        ict_turno = p_turno_id,
        ict_horario = p_horario_id,
        hct_horaentrada = p_hora_entrada,
        hct_horasalida = p_hora_salida,
        ict_diadescanso = p_dia_descanso_id,
        ict_tipotrabajador = p_tipo_trabajador_id,
        ict_regimenpensionario = p_regimen_pensionario_id,
        ict_regimenlaboral = p_regimen_laboral_id,
        hct_horalaboral = p_hora_laboral,
        dct_remuneracionbasica = p_remuneracion_basica,
        dct_remuneracionrc = p_remuneracion_rc,
        dct_sueldomensual = p_sueldo_mensual,
        tct_cuspp = p_cuspp,
        ict_empresa = p_empresa_id,
        ict_usuarioedito = p_usuario_id,
        fct_fechaedito = CURRENT_TIMESTAMP
    WHERE imcontratotrabajador_id = p_contrato_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Obtener el código del régimen pensionario
    SELECT trp_codsunat INTO v_regimen_codigo
    FROM public.rrhh_mregimenpensionario
    WHERE imregimenpensionario_id = p_regimen_pensionario_id;
    
    -- Actualizar el trabajador con los datos del contrato
    v_actualizado := public.sp_actualizar_trabajador_desde_contrato(
        p_trabajador_id,
        p_fecha_inicio,  -- Fecha de ingreso (solo se actualiza si está NULL en trabajador)
        p_sede_id::INTEGER,
        p_puesto_id,
        p_turno_id,
        p_horario_id,
        p_dia_descanso_id,
        p_hora_entrada,
        p_hora_salida,
        v_regimen_codigo,
        p_cuspp
    );
    
    IF NOT v_actualizado THEN
        RAISE NOTICE 'Advertencia: No se pudo actualizar el trabajador con ID %', p_trabajador_id;
    END IF;
    
    RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION public.sp_actualizar_contrato_trabajador IS 'Actualiza un contrato y sincroniza automáticamente los datos del trabajador';

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Procedimiento sp_actualizar_contrato_trabajador actualizado';
    RAISE NOTICE '✅ Ahora usa la nueva función con fecha de ingreso';
END $$;
