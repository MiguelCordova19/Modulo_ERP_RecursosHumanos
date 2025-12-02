-- =====================================================
-- VERIFICAR TABLAS Y COLUMNAS PARA JOINS
-- =====================================================

-- 1. Verificar tabla rrhh_mcontratotrabajador
SELECT 'rrhh_mcontratotrabajador' as tabla, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rrhh_mcontratotrabajador') 
       THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado;

-- 2. Verificar tabla rrhh_trabajador
SELECT 'rrhh_trabajador' as tabla,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rrhh_trabajador')
       THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado;

-- 3. Verificar tabla rrhh_msede
SELECT 'rrhh_msede' as tabla,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rrhh_msede')
       THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado;

-- 4. Verificar tabla rrhh_mpuestos
SELECT 'rrhh_mpuestos' as tabla,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rrhh_mpuestos')
       THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado;

-- 5. Verificar tabla rrhh_mtipocontrato
SELECT 'rrhh_mtipocontrato' as tabla,
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rrhh_mtipocontrato')
       THEN '✅ EXISTE' ELSE '❌ NO EXISTE' END as estado;

-- 6. Verificar columnas de rrhh_mcontratotrabajador
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'rrhh_mcontratotrabajador'
AND column_name IN ('imcontratotrabajador_id', 'ict_trabajador', 'ict_sede', 'ict_puesto', 'ict_tipocontrato', 'ict_empresa', 'ict_estado')
ORDER BY column_name;

-- 7. Verificar columnas de rrhh_trabajador
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'rrhh_trabajador'
AND column_name IN ('itrabajador_id', 'tt_nrodoc', 'tt_apellidopaterno', 'tt_apellidomaterno', 'tt_nombres')
ORDER BY column_name;

-- 8. Verificar columnas de rrhh_msede
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'rrhh_msede'
AND column_name IN ('imsede_id', 'ts_descripcion')
ORDER BY column_name;

-- 9. Verificar columnas de rrhh_mpuestos
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'rrhh_mpuestos'
AND column_name IN ('impuesto_id', 'tp_descripcion')
ORDER BY column_name;

-- 10. Verificar columnas de rrhh_mtipocontrato
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'rrhh_mtipocontrato'
AND column_name IN ('imtipocontrato_id', 'tmc_descripcion')
ORDER BY column_name;
