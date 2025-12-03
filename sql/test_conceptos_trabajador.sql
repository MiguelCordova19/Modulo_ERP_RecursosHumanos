-- =====================================================
-- SCRIPT DE PRUEBA: Conceptos de Trabajador
-- =====================================================

-- 1. Verificar que la tabla existe
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'rrhh_mconceptostrabajador'
ORDER BY ordinal_position;

-- 2. Verificar que los procedimientos existen
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name LIKE '%conceptos_trabajador%'
ORDER BY routine_name;

-- 3. Prueba: Guardar conceptos de un trabajador
-- NOTA: Reemplazar los IDs con valores reales de tu base de datos
DO $$
DECLARE
    v_contrato_id BIGINT := 1; -- Reemplazar con un ID de contrato real
    v_usuario_id BIGINT := 1;
    v_conceptos_json TEXT := '[
        {
            "conceptoId": 1,
            "codigo": "0121",
            "descripcion": "REMUNERACION BASICA",
            "tipo": "FIJO",
            "tipoValor": "MONTO",
            "valor": 1500.00
        },
        {
            "conceptoId": 2,
            "codigo": "0804",
            "descripcion": "ESSALUD",
            "tipo": "FIJO",
            "tipoValor": "PORCENTAJE",
            "valor": 9.00
        }
    ]';
    v_resultado BOOLEAN;
BEGIN
    -- Guardar conceptos
    SELECT public.sp_guardar_conceptos_trabajador(
        v_contrato_id,
        v_conceptos_json,
        v_usuario_id
    ) INTO v_resultado;
    
    IF v_resultado THEN
        RAISE NOTICE '✅ Conceptos guardados exitosamente';
    ELSE
        RAISE NOTICE '❌ Error al guardar conceptos';
    END IF;
END $$;

-- 4. Prueba: Obtener conceptos de un trabajador
-- NOTA: Reemplazar el ID con un valor real
SELECT * FROM public.sp_obtener_conceptos_trabajador(1);

-- 5. Verificar datos en la tabla
SELECT 
    ct.imconceptostrabajador_id,
    ct.ict_contratotrabajador,
    c.tc_descripcion as concepto,
    CASE ct.ict_tipo 
        WHEN 1 THEN 'VARIABLE'
        WHEN 2 THEN 'FIJO'
    END as tipo,
    CASE ct.ict_tipovalor 
        WHEN 1 THEN 'MONTO'
        WHEN 2 THEN 'PORCENTAJE'
    END as tipo_valor,
    ct.dct_valor,
    ct.ict_estado
FROM rrhh_mconceptostrabajador ct
INNER JOIN rrhh_mconceptos c ON ct.ict_conceptos = c.imconceptos_id
WHERE ct.ict_estado = 1
ORDER BY ct.imconceptostrabajador_id DESC
LIMIT 10;

-- 6. Estadísticas
SELECT 
    COUNT(*) as total_conceptos,
    COUNT(CASE WHEN ict_estado = 1 THEN 1 END) as activos,
    COUNT(CASE WHEN ict_estado = 0 THEN 1 END) as inactivos,
    COUNT(CASE WHEN ict_tipo = 1 THEN 1 END) as variables,
    COUNT(CASE WHEN ict_tipo = 2 THEN 1 END) as fijos,
    COUNT(CASE WHEN ict_tipovalor = 1 THEN 1 END) as montos,
    COUNT(CASE WHEN ict_tipovalor = 2 THEN 1 END) as porcentajes
FROM rrhh_mconceptostrabajador;

-- 7. Conceptos por contrato
SELECT 
    ict_contratotrabajador as contrato_id,
    COUNT(*) as total_conceptos,
    SUM(CASE WHEN ict_tipovalor = 1 THEN dct_valor ELSE 0 END) as total_montos,
    AVG(CASE WHEN ict_tipovalor = 2 THEN dct_valor ELSE NULL END) as promedio_porcentajes
FROM rrhh_mconceptostrabajador
WHERE ict_estado = 1
GROUP BY ict_contratotrabajador
ORDER BY contrato_id;

-- =====================================================
-- Mensaje final
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Script de prueba ejecutado exitosamente';
    RAISE NOTICE '📋 Revisa los resultados arriba para verificar que todo funcione correctamente';
END $$;
