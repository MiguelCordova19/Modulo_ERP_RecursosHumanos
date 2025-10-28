-- =====================================================
-- PROCEDIMIENTO ALMACENADO PARA TIPOS DE DOCUMENTO
-- =====================================================

-- Eliminar versión anterior si existe
DROP FUNCTION IF EXISTS sp_listar_tipos_documento() CASCADE;

-- Crear función para listar tipos de documento
CREATE OR REPLACE FUNCTION sp_listar_tipos_documento()
RETURNS TABLE (
    id INTEGER,
    codigo_sunat VARCHAR(10),
    descripcion VARCHAR(100),
    abreviatura VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imtipodoc_id,
        ttd_codsunat,
        ttd_descripcion,
        ttd_abreviatura
    FROM rrhh_mtipodocumento
    ORDER BY imtipodoc_id;
END;
$$;

-- Verificar que funciona
SELECT * FROM sp_listar_tipos_documento();

-- Comentario
COMMENT ON FUNCTION sp_listar_tipos_documento() IS 'Lista todos los tipos de documento disponibles en el sistema';
