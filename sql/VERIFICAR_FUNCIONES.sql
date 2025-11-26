-- =====================================================
-- Verificar que las funciones existan
-- =====================================================

\echo 'Verificando funciones de motivo préstamo...';
\echo '';

-- Listar todas las funciones relacionadas con motivo_prestamo
SELECT 
    routine_name as "Nombre Función",
    routine_type as "Tipo"
FROM information_schema.routines
WHERE routine_schema = 'public'
    AND routine_name LIKE '%motivo%prestamo%'
ORDER BY routine_name;

\echo '';
\echo 'Si no aparecen funciones, ejecutar:';
\echo '\i sql/EJECUTAR_COMPLETO_POSTGRESQL.sql';
