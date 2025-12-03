-- =====================================================
-- ACTUALIZAR: Función para obtener detalle de conceptos variables
-- =====================================================
-- Esta función devuelve información completa incluyendo datos de la cabecera
-- para poder editar conceptos variables en el frontend

DROP FUNCTION IF EXISTS public.sp_obtener_detalle_conceptos_variables(BIGINT);

CREATE OR REPLACE FUNCTION public.sp_obtener_detalle_conceptos_variables(
    p_cabecera_id BIGINT
) RETURNS TABLE (
    id BIGINT,
    anio INTEGER,
    mes INTEGER,
    planilla_id BIGINT,
    concepto_id BIGINT,
    concepto VARCHAR,
    trabajador_id BIGINT,
    numero_documento VARCHAR,
    trabajador VARCHAR,
    fecha DATE,
    valor DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cvd.imconceptosvariablesdetalle_id,
        cv.icv_anio,
        cv.icv_mes,
        cv.icv_tipoplanilla,
        cv.icv_conceptos,
        c.tc_descripcion,
        cvd.icvd_trabajador,
        t.tt_nrodoc,
        CAST(CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres) AS VARCHAR),
        cvd.fcvd_fecha,
        cvd.dcvd_valor
    FROM public.rrhh_mconceptosvariablesdetalle cvd
    INNER JOIN public.rrhh_mconceptosvariables cv ON cvd.icvd_conceptosvariables = cv.imconceptosvariables_id
    INNER JOIN public.rrhh_trabajador t ON cvd.icvd_trabajador = t.itrabajador_id
    INNER JOIN public.rrhh_mconceptos c ON cv.icv_conceptos = c.imconceptos_id
    WHERE cvd.icvd_conceptosvariables = p_cabecera_id
    AND cvd.icvd_estado = 1
    ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.sp_obtener_detalle_conceptos_variables IS 'Obtiene detalle completo de conceptos variables con información de cabecera y trabajadores para edición';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Ejecutar esta consulta para verificar que la función se creó correctamente:
-- SELECT * FROM public.sp_obtener_detalle_conceptos_variables(1);
