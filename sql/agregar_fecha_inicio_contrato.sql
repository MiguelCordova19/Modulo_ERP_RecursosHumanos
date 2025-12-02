-- =====================================================
-- AGREGAR CAMPO FECHA INICIO CONTRATO
-- Separar fecha de ingreso laboral de fecha inicio de contrato
-- =====================================================

-- Agregar nueva columna para fecha de inicio del contrato
ALTER TABLE public.rrhh_mcontratotrabajador
ADD COLUMN IF NOT EXISTS fct_fechainicio DATE;

-- Comentario
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechainicio IS 'Fecha de inicio del contrato específico';

-- Migrar datos existentes: copiar fct_fechainiciolaboral a fct_fechainicio
UPDATE public.rrhh_mcontratotrabajador
SET fct_fechainicio = fct_fechainiciolaboral
WHERE fct_fechainicio IS NULL;

-- Ahora fct_fechainiciolaboral será la fecha de ingreso a la empresa
-- y fct_fechainicio será la fecha de inicio del contrato

-- Actualizar comentarios para clarificar
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechainiciolaboral IS 'Fecha de ingreso laboral del trabajador a la empresa';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechainicio IS 'Fecha de inicio de este contrato específico';

-- Actualizar procedimiento sp_guardar_contrato_trabajador
DROP FUNCTION IF EXISTS public.sp_guardar_contrato_trabajador CASCADE;

CREATE OR REPLACE FUNCTION public.sp_guardar_contrato_trabajador(
    p_trabajador_id BIGINT,
    p_tipocontrato_id INTEGER,
    p_fecha_ingreso_laboral DATE,
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
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_contrato_id BIGINT;
    v_regimen_codigo VARCHAR(2);
    v_actualizado BOOLEAN;
BEGIN
    -- Insertar el contrato
    INSERT INTO public.rrhh_mcontratotrabajador (
        ict_trabajador,
        ict_tipocontrato,
        fct_fechainiciolaboral,
        fct_fechainicio,
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
        ict_empresa,
        ict_estado,
        ict_usuarioregistro,
        fct_fecharegistro
    ) VALUES (
        p_trabajador_id,
        p_tipocontrato_id,
        p_fecha_ingreso_laboral,
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
        p_empresa_id,
        1,
        p_usuario_id,
        CURRENT_TIMESTAMP
    )
    RETURNING imcontratotrabajador_id INTO v_contrato_id;
    
    -- Obtener el código del régimen pensionario
    SELECT trp_codsunat INTO v_regimen_codigo
    FROM public.rrhh_mregimenpensionario
    WHERE imregimenpensionario_id = p_regimen_pensionario_id;
    
    -- Actualizar el trabajador con los datos del contrato
    v_actualizado := public.sp_actualizar_trabajador_desde_contrato(
        p_trabajador_id,
        p_fecha_ingreso_laboral,
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
    
    RETURN v_contrato_id;
END;
$$;

COMMENT ON FUNCTION public.sp_guardar_contrato_trabajador IS 'Guarda un contrato con fecha de ingreso laboral y fecha de inicio de contrato separadas';

-- Actualizar procedimiento sp_actualizar_contrato_trabajador
DROP FUNCTION IF EXISTS public.sp_actualizar_contrato_trabajador CASCADE;

CREATE OR REPLACE FUNCTION public.sp_actualizar_contrato_trabajador(
    p_contrato_id BIGINT,
    p_trabajador_id BIGINT,
    p_tipocontrato_id INTEGER,
    p_fecha_ingreso_laboral DATE,
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
        fct_fechainiciolaboral = p_fecha_ingreso_laboral,
        fct_fechainicio = p_fecha_inicio,
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
        p_fecha_ingreso_laboral,
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

COMMENT ON FUNCTION public.sp_actualizar_contrato_trabajador IS 'Actualiza un contrato con fecha de ingreso laboral y fecha de inicio separadas';

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Campo fct_fechainicio agregado a la tabla';
    RAISE NOTICE '✅ Datos migrados de fct_fechainiciolaboral a fct_fechainicio';
    RAISE NOTICE '✅ Procedimientos actualizados para usar ambas fechas';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Ahora la tabla tiene:';
    RAISE NOTICE '   - fct_fechainiciolaboral: Fecha de ingreso a la empresa';
    RAISE NOTICE '   - fct_fechainicio: Fecha de inicio del contrato';
    RAISE NOTICE '   - fct_fechafinlaboral: Fecha de fin del contrato';
END $$;
