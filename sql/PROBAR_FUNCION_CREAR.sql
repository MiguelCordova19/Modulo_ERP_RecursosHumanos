-- =====================================================
-- Probar la función sp_crear_motivo_prestamo directamente
-- =====================================================

-- Verificar que la tabla existe
SELECT COUNT(*) as total_registros FROM rrhh_mmotivoprestamo;

-- Verificar que la empresa existe
SELECT * FROM rrhh_mempresa WHERE iempresa_id = 1;

-- Probar la función directamente
SELECT * FROM sp_crear_motivo_prestamo('Prueba directa desde SQL', 1);

-- Ver todos los motivos
SELECT * FROM rrhh_mmotivoprestamo;
