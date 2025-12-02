-- =====================================================
-- ACTUALIZAR SINCRONIZACIÓN CONTRATO-TRABAJADOR
-- Incluir actualización de fecha de ingreso laboral
-- =====================================================

-- Eliminar la función anterior con sus parámetros originales
DROP FUNCTION IF EXISTS public.sp_actualizar_trabajador_desde_contrato(
    BIGINT, INTEGER, INTEGER, VARCHAR, VARCHAR, VARCHAR, TIME, TIME, VARCHAR, VARCHAR
);

-- Crear nueva función para incluir fecha de ingreso
CREATE OR REPLACE FUNCTION public.sp_actualizar_trabajador_desde_contrato(
    p_trabajador_id BIGINT,
    p_fecha_ingreso DATE,
    p_sede_id INTEGER,
    p_puesto_id INTEGER,
    p_turno_id VARCHAR(2),
    p_horario_id VARCHAR(2),
    p_dia_descanso_id VARCHAR(2),
    p_hora_entrada TIME,
    p_hora_salida TIME,
    p_regimen_pensionario_id VARCHAR(2),
    p_cuspp VARCHAR(20)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.rrhh_trabajador
    SET 
        -- Solo actualizar fecha de ingreso si está NULL
        ft_fechaingreso = COALESCE(ft_fechaingreso, p_fecha_ingreso),
        it_sede = p_sede_id,
        it_puesto = p_puesto_id,
        it_turno = p_turno_id,
        it_horario = p_horario_id,
        it_diadescanso = p_dia_descanso_id,
        tt_horaentrada = p_hora_entrada,
        tt_horasalida = p_hora_salida,
        it_regimenpensionario = p_regimen_pensionario_id,
        tt_cuspp = p_cuspp,
        it_usuarioedito = 1,
        ft_fechaedito = CURRENT_TIMESTAMP
    WHERE itrabajador_id = p_trabajador_id;
    
    RETURN FOUND;
END;
$$;

COMMENT ON FUNCTION public.sp_actualizar_trabajador_desde_contrato IS 'Actualiza los datos del trabajador con la información del contrato, incluyendo fecha de ingreso si está vacía';

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Función sp_actualizar_trabajador_desde_contrato actualizada';
    RAISE NOTICE '✅ Ahora también actualiza la fecha de ingreso laboral si está vacía';
END $$;
