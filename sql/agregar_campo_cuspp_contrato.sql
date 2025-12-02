-- =====================================================
-- AGREGAR CAMPO CUSPP A TABLA CONTRATO
-- =====================================================

-- Agregar columna CUSPP
ALTER TABLE public.rrhh_mcontratotrabajador
ADD COLUMN tct_cuspp VARCHAR(20);

-- Agregar comentario
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.tct_cuspp IS 'Código CUSPP para AFP (solo si régimen pensionario es AFP)';

-- Actualizar procedimiento sp_guardar_contrato_trabajador
DROP FUNCTION IF EXISTS public.sp_guardar_contrato_trabajador CASCADE;

CREATE OR REPLACE FUNCTION public.sp_guardar_contrato_trabajador(
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
    p_usuario_id BIGINT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_contrato_id BIGINT;
BEGIN
    INSERT INTO public.rrhh_mcontratotrabajador (
        ict_trabajador,
        ict_tipocontrato,
        fct_fechainiciolaboral,
        fct_fechafinlaboral,
        ict_sede,
        ict_puesto,
        ict_turno,
        ict_horario,
        hct_horaentrada,
        hct_horasalida,
        ict_diadescanso,
        ict_tipotrabajador,
        ict_regimenpensionario,
        ict_regimenlaboral,
        hct_horalaboral,
        dct_remuneracionbasica,
        dct_remuneracionrc,
        dct_sueldomensual,
        tct_cuspp,
        ict_estado,
        ict_usuarioregistro,
        fct_fecharegistro
    ) VALUES (
        p_trabajador_id,
        p_tipocontrato_id,
        p_fecha_inicio,
        p_fecha_fin,
        p_sede_id,
        p_puesto_id,
        p_turno_id,
        p_horario_id,
        p_hora_entrada,
        p_hora_salida,
        p_dia_descanso_id,
        p_tipo_trabajador_id,
        p_regimen_pensionario_id,
        p_regimen_laboral_id,
        p_hora_laboral,
        p_remuneracion_basica,
        p_remuneracion_rc,
        p_sueldo_mensual,
        p_cuspp,
        1,
        p_usuario_id,
        CURRENT_TIMESTAMP
    )
    RETURNING imcontratotrabajador_id INTO v_contrato_id;
    
    RETURN v_contrato_id;
END;
$$;

-- Actualizar procedimiento sp_actualizar_contrato_trabajador
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
    p_usuario_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
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
        ict_usuarioedito = p_usuario_id,
        fct_fechaedito = CURRENT_TIMESTAMP
    WHERE imcontratotrabajador_id = p_contrato_id;
    
    RETURN FOUND;
END;
$$;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Campo CUSPP agregado exitosamente';
    RAISE NOTICE '✅ Procedimientos almacenados actualizados';
END $$;
