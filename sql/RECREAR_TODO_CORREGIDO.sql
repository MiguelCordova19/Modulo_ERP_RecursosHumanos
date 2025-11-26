-- =====================================================
-- Recrear todo con los nombres de columna corregidos
-- =====================================================

\echo '========================================';
\echo 'ELIMINANDO TABLA Y FUNCIONES ANTERIORES';
\echo '========================================';

DROP TABLE IF EXISTS rrhh_mmotivoprestamo CASCADE;
DROP FUNCTION IF EXISTS sp_listar_motivos_prestamo(INT);
DROP FUNCTION IF EXISTS sp_obtener_motivo_prestamo(INT, INT);
DROP FUNCTION IF EXISTS sp_crear_motivo_prestamo(VARCHAR, INT);
DROP FUNCTION IF EXISTS sp_actualizar_motivo_prestamo(INT, VARCHAR, INT);
DROP FUNCTION IF EXISTS sp_eliminar_motivo_prestamo(INT, INT);

\echo '✓ Limpieza completada';
\echo '';

-- Ejecutar scripts corregidos
\i sql/01_crear_tabla_motivo_prestamo.sql
\i sql/02_insertar_datos_motivo_prestamo.sql
\i sql/03_procedimientos_motivo_prestamo_postgresql.sql

\echo '';
\echo '========================================';
\echo '✓ TODO RECREADO CORRECTAMENTE';
\echo '========================================';
\echo '';
\echo 'Probar con:';
\echo 'SELECT * FROM sp_crear_motivo_prestamo(''Prueba'', 1);';
