-- =====================================================
-- Script: Funciones para rrhh_mregimenpensionario (PostgreSQL)
-- Descripción: Funciones para regímenes pensionarios
-- Fecha: 2025-11-25
-- =====================================================

-- =====================================================
-- FUNCIÓN: Listar todos los regímenes pensionarios
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_regimenes()
RETURNS TABLE (
    id INT,
    codsunat VARCHAR,
    descripcion VARCHAR,
    abreviatura VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imregimenpensionario_id,
        trp_codsunat,
        trp_descripcion,
        trp_abreviatura
    FROM rrhh_mregimenpensionario
    ORDER BY imregimenpensionario_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener régimen por ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_regimen(p_regimenid INT)
RETURNS TABLE (
    id INT,
    codsunat VARCHAR,
    descripcion VARCHAR,
    abreviatura VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imregimenpensionario_id,
        trp_codsunat,
        trp_descripcion,
        trp_abreviatura
    FROM rrhh_mregimenpensionario
    WHERE imregimenpensionario_id = p_regimenid;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Funciones de regímenes pensionarios creadas exitosamente';
END $$;
