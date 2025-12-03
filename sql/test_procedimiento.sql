-- =====================================================
-- TEST: Verificar que el procedimiento funciona
-- =====================================================

-- 1. Verificar que el procedimiento existe
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_name = 'sp_obtener_conceptos_trabajador';

-- 2. Verificar la firma del procedimiento
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname = 'sp_obtener_conceptos_trabajador'
  AND n.nspname = 'public';

-- 3. Probar el procedimiento con datos de prueba
-- IMPORTANTE: Reemplaza 6 y 3 con IDs reales de tu base de datos
SELECT * FROM public.sp_obtener_conceptos_trabajador(6, 3);

-- 4. Si el paso 3 falla, verificar si hay datos en la tabla
SELECT 
    COUNT(*) as total_registros,
    COUNT(CASE WHEN ict_contratotrabajador = 6 THEN 1 END) as registros_contrato_6,
    COUNT(CASE WHEN ict_empresa = 3 THEN 1 END) as registros_empresa_3
FROM rrhh_mconceptostrabajador
WHERE ict_estado = 1;

-- 5. Ver todos los contratos disponibles
SELECT DISTINCT 
    ict_contratotrabajador,
    ict_empresa
FROM rrhh_mconceptostrabajador
WHERE ict_estado = 1
ORDER BY ict_contratotrabajador;
