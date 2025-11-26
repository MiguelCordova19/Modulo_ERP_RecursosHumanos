-- =====================================================
-- Script Consolidado: Configuración de RRHH_MTIPO
-- =====================================================

\echo '========================================';
\echo 'CONFIGURACIÓN DE TIPOS DE TRABAJADOR';
\echo '========================================';
\echo '';

\i sql/tipos/01_crear_tabla_tipos.sql
\i sql/tipos/02_insertar_datos_tipos.sql
\i sql/tipos/03_funciones_tipos.sql

\echo '';
\echo '========================================';
\echo '✓ INSTALACIÓN COMPLETADA';
\echo '========================================';
\echo '';
\echo 'Probar con:';
\echo 'SELECT * FROM sp_listar_tipos();';
