-- =====================================================
-- Script Consolidado: Configuración Completa de Feriados
-- Ejecutar todo de una vez
-- =====================================================

\echo '========================================';
\echo 'INICIANDO CONFIGURACIÓN DE FERIADOS';
\echo '========================================';
\echo '';

-- Ejecutar scripts en orden
\i sql/feriados/01_crear_tabla_feriados.sql
\i sql/feriados/02_insertar_datos_feriados.sql
\i sql/feriados/03_funciones_feriados.sql

\echo '';
\echo '========================================';
\echo 'VERIFICACIÓN FINAL';
\echo '========================================';
\echo '';

-- Verificar tabla
SELECT COUNT(*) as "Total Feriados" FROM rrhh_mferiados;

\echo '';
\echo '========================================';
\echo '✓ INSTALACIÓN COMPLETADA';
\echo '========================================';
\echo '';
\echo 'Probar con:';
\echo 'SELECT * FROM sp_listar_feriados(1);';
\echo '';
