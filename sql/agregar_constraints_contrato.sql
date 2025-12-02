-- =====================================================
-- AGREGAR CONSTRAINTS A RRHH_MCONTRATOTRABAJADOR
-- Ejecutar este script DESPUÉS de crear las tablas faltantes
-- =====================================================

-- =====================================================
-- NOTA: Este archivo ya NO es necesario
-- Los constraints ya están en crear_tabla_contrato_trabajador.sql
-- =====================================================

-- Las tablas existen con los siguientes nombres:
-- ✅ rrhh_trabajador (itrabajador_id)
-- ✅ rrhh_msede (imsede_id)
-- ✅ rrhh_mpuestos (impuestos_id)
-- ✅ rrhh_mturno (imturno_id)
-- ✅ rrhh_mhorario (imhorario_id)
-- ✅ rrhh_mdiasemana (imdiasemana_id)

-- Todos los constraints ya están activos en el script principal

-- =====================================================
-- Verificar que los constraints están activos
-- =====================================================
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.rrhh_mcontratotrabajador'::regclass
ORDER BY conname;
