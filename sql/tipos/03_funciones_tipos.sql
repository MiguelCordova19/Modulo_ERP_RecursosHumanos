-- =====================================================
-- Script: Funciones para rrhh_mtipo (PostgreSQL)
-- Descripción: Funciones para tipos de trabajador
-- Fecha: 2025-11-06
-- =====================================================

-- =====================================================
-- FUNCIÓN: Listar todos los tipos de trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_tipos()
RETURNS TABLE (
    id INT,
    codsunat VARCHAR,
    descripcion VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imtipo_id,
        tt_codsunat,
        tt_descripcion
    FROM rrhh_mtipo
    ORDER BY imtipo_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener tipo por ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_tipo(p_tipoid INT)
RETURNS TABLE (
    id INT,
    codsunat VARCHAR,
    descripcion VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imtipo_id,
        tt_codsunat,
        tt_descripcion
    FROM rrhh_mtipo
    WHERE imtipo_id = p_tipoid;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Funciones de tipos creadas exitosamente';
END $$;
