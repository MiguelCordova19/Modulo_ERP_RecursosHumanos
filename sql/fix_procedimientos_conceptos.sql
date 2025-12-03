-- =====================================================
-- FIX: Corregir procedimientos almacenados
-- =====================================================

-- Eliminar procedimientos existentes
DROP FUNCTION IF EXISTS public.sp_guardar_conceptos_trabajador(BIGINT, TEXT, INTEGER, BIGINT);
DROP FUNCTION IF EXISTS public.sp_obtener_conceptos_trabajador(BIGINT, INTEGER);
DROP FUNCTION IF EXISTS public.sp_eliminar_conceptos_trabajador(BIGINT, INTEGER, BIGINT);

-- =====================================================
-- PROCEDIMIENTO: sp_guardar_conceptos_trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_guardar_conceptos_trabajador(
    p_contrato_id BIGINT,
    p_conceptos_json TEXT,
    p_empresa_id INTEGER,
    p_usuario_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_concepto JSON;
    v_concepto_id BIGINT;
    v_tipo INTEGER;
    v_tipo_valor INTEGER;
    v_valor DECIMAL(10,2);
BEGIN
    UPDATE public.rrhh_mconceptostrabajador
    SET ict_estado = 0,
        ict_usuarioelimino = p_usuario_id,
        fct_fechaelimino = CURRENT_TIMESTAMP
    WHERE ict_contratotrabajador = p_contrato_id
      AND ict_empresa = p_empresa_id
      AND ict_estado = 1;
    
    FOR v_concepto IN SELECT * FROM json_array_elements(p_conceptos_json::json)
    LOOP
        v_concepto_id := (v_concepto->>'conceptoId')::BIGINT;
        
        v_tipo := CASE 
            WHEN v_concepto->>'tipo' = 'VARIABLE' THEN 1
            WHEN v_concepto->>'tipo' = 'FIJO' THEN 2
            ELSE 1
        END;
        
        v_tipo_valor := CASE 
            WHEN v_concepto->>'tipoValor' = 'MONTO' THEN 1
            WHEN v_concepto->>'tipoValor' = 'PORCENTAJE' THEN 2
            ELSE 1
        END;
        
        v_valor := (v_concepto->>'valor')::DECIMAL(10,2);
        
        INSERT INTO public.rrhh_mconceptostrabajador (
            ict_contratotrabajador,
            ict_conceptos,
            ict_tipo,
            ict_tipovalor,
            dct_valor,
            ict_empresa,
            ict_estado,
            ict_usuarioregistro,
            fct_fecharegistro
        ) VALUES (
            p_contrato_id,
            v_concepto_id,
            v_tipo,
            v_tipo_valor,
            v_valor,
            p_empresa_id,
            1,
            p_usuario_id,
            CURRENT_TIMESTAMP
        );
    END LOOP;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO: sp_obtener_conceptos_trabajador
-- =====================================================
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
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.imconceptostrabajador_id as id,
        ct.ict_contratotrabajador as contrato_id,
        ct.ict_conceptos as concepto_id,
        t.tt_codsunat as concepto_codigo,
        c.tc_descripcion as concepto_descripcion,
        CASE ct.ict_tipo 
            WHEN 1 THEN 'VARIABLE'
            WHEN 2 THEN 'FIJO'
            ELSE 'VARIABLE'
        END as tipo,
        CASE ct.ict_tipovalor 
            WHEN 1 THEN 'MONTO'
            WHEN 2 THEN 'PORCENTAJE'
            ELSE 'MONTO'
        END as tipo_valor,
        ct.dct_valor as valor,
        ct.ict_empresa as empresa_id
    FROM public.rrhh_mconceptostrabajador ct
    INNER JOIN public.rrhh_mconceptos c ON ct.ict_conceptos = c.imconceptos_id
    LEFT JOIN public.rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
    WHERE ct.ict_contratotrabajador = p_contrato_id
      AND ct.ict_empresa = p_empresa_id
      AND ct.ict_estado = 1
    ORDER BY ct.imconceptostrabajador_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO: sp_eliminar_conceptos_trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_eliminar_conceptos_trabajador(
    p_contrato_id BIGINT,
    p_empresa_id INTEGER,
    p_usuario_id BIGINT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.rrhh_mconceptostrabajador
    SET ict_estado = 0,
        ict_usuarioelimino = p_usuario_id,
        fct_fechaelimino = CURRENT_TIMESTAMP
    WHERE ict_contratotrabajador = p_contrato_id
      AND ict_empresa = p_empresa_id
      AND ict_estado = 1;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Verificación
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Procedimientos corregidos exitosamente';
END $$;

-- Probar procedimiento
SELECT 'Procedimiento sp_obtener_conceptos_trabajador creado' as status;
