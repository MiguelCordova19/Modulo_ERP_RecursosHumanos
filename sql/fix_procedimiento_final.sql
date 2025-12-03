-- =====================================================
-- FIX FINAL: Procedimiento con tipos de datos correctos
-- =====================================================

-- Eliminar procedimiento existente
DROP FUNCTION IF EXISTS public.sp_obtener_conceptos_trabajador(BIGINT, INTEGER) CASCADE;

-- Crear procedimiento con tipos correctos
CREATE OR REPLACE FUNCTION public.sp_obtener_conceptos_trabajador(
    p_contrato_id BIGINT,
    p_empresa_id INTEGER
)
RETURNS TABLE (
    id BIGINT,
    contrato_id BIGINT,
    concepto_id BIGINT,
    concepto_codigo VARCHAR,
    concepto_descripcion VARCHAR,
    tipo VARCHAR,
    tipo_valor VARCHAR,
    valor DECIMAL(10,2),
    empresa_id INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.imconceptostrabajador_id,
        ct.ict_contratotrabajador,
        ct.ict_conceptos,
        CAST(t.tt_codsunat AS VARCHAR),
        CAST(c.tc_descripcion AS VARCHAR),
        CAST(CASE ct.ict_tipo 
            WHEN 1 THEN 'VARIABLE'
            WHEN 2 THEN 'FIJO'
            ELSE 'VARIABLE'
        END AS VARCHAR),
        CAST(CASE ct.ict_tipovalor 
            WHEN 1 THEN 'MONTO'
            WHEN 2 THEN 'PORCENTAJE'
            ELSE 'MONTO'
        END AS VARCHAR),
        ct.dct_valor,
        ct.ict_empresa
    FROM public.rrhh_mconceptostrabajador ct
    INNER JOIN public.rrhh_mconceptos c ON ct.ict_conceptos = c.imconceptos_id
    LEFT JOIN public.rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
    WHERE ct.ict_contratotrabajador = p_contrato_id
      AND ct.ict_empresa = p_empresa_id
      AND ct.ict_estado = 1
    ORDER BY ct.imconceptostrabajador_id;
END;
$$;

-- Verificar
SELECT 'Procedimiento creado exitosamente' as status;

-- Probar (ajusta los IDs según tu BD)
SELECT * FROM public.sp_obtener_conceptos_trabajador(6, 3);
