-- =====================================================
-- SCRIPT DE VERIFICACIÓN: Conceptos de Trabajador
-- =====================================================

-- 1. Verificar si la tabla existe
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_name = 'rrhh_mconceptostrabajador'
        ) THEN '✅ La tabla rrhh_mconceptostrabajador EXISTE'
        ELSE '❌ La tabla rrhh_mconceptostrabajador NO EXISTE'
    END as resultado;

-- 2. Verificar estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'rrhh_mconceptostrabajador'
ORDER BY ordinal_position;

-- 3. Verificar si hay datos en la tabla
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN ict_estado = 1 THEN 1 END) as activos,
    COUNT(CASE WHEN ict_estado = 0 THEN 1 END) as inactivos
FROM rrhh_mconceptostrabajador;

-- 4. Ver últimos registros insertados
SELECT 
    imconceptostrabajador_id,
    ict_contratotrabajador,
    ict_conceptos,
    ict_tipo,
    ict_tipovalor,
    dct_valor,
    ict_empresa,
    ict_estado,
    fct_fecharegistro
FROM rrhh_mconceptostrabajador
ORDER BY imconceptostrabajador_id DESC
LIMIT 10;

-- 5. Verificar procedimiento almacenado
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'sp_obtener_conceptos_trabajador';

-- 6. Probar procedimiento almacenado (cambiar IDs por valores reales)
-- SELECT * FROM public.sp_obtener_conceptos_trabajador(1, 1);

-- 7. Ver conceptos con información completa
SELECT 
    ct.imconceptostrabajador_id,
    ct.ict_contratotrabajador as contrato_id,
    c.tc_descripcion as concepto,
    t.tt_codsunat as codigo_sunat,
    CASE ct.ict_tipo 
        WHEN 1 THEN 'VARIABLE'
        WHEN 2 THEN 'FIJO'
    END as tipo,
    CASE ct.ict_tipovalor 
        WHEN 1 THEN 'MONTO'
        WHEN 2 THEN 'PORCENTAJE'
    END as tipo_valor,
    ct.dct_valor as valor,
    ct.ict_empresa,
    ct.ict_estado
FROM rrhh_mconceptostrabajador ct
LEFT JOIN rrhh_mconceptos c ON ct.ict_conceptos = c.imconceptos_id
LEFT JOIN rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
WHERE ct.ict_estado = 1
ORDER BY ct.imconceptostrabajador_id DESC
LIMIT 20;

-- =====================================================
-- Mensaje final
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Verificación completada';
    RAISE NOTICE '📋 Revisa los resultados arriba';
END $$;
