-- =====================================================
-- Actualizar función sp_listar_motivos_prestamo
-- Para que solo muestre motivos activos (estado = 1)
-- =====================================================

DROP FUNCTION IF EXISTS sp_listar_motivos_prestamo(INT);

CREATE OR REPLACE FUNCTION sp_listar_motivos_prestamo(p_empresaid INT)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE imempresa_id = p_empresaid
        AND imp_estado = 1  -- Solo mostrar activos
    ORDER BY tmp_descripcion;
END;
$$ LANGUAGE plpgsql;

-- Probar la función
SELECT * FROM sp_listar_motivos_prestamo(1);

\echo '';
\echo '✓ Función actualizada - Solo mostrará motivos activos';
