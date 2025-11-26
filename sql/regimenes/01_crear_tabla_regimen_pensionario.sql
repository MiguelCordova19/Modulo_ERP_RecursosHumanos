-- =====================================================
-- Script: Crear tabla rrhh_mregimenpensionario (PostgreSQL)
-- Descripción: Tabla maestra de regímenes pensionarios
-- Fecha: 2025-11-25
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS rrhh_mregimenpensionario CASCADE;

-- Crear tabla rrhh_mregimenpensionario
CREATE TABLE rrhh_mregimenpensionario (
    imregimenpensionario_id SERIAL PRIMARY KEY,
    trp_codsunat VARCHAR(50) NOT NULL,
    trp_descripcion VARCHAR(200) NOT NULL,
    trp_abreviatura VARCHAR(100) NOT NULL,
    
    -- Constraints
    CONSTRAINT uk_regimen_codsunat UNIQUE (trp_codsunat)
);

-- Crear índices
CREATE INDEX idx_regimen_codsunat ON rrhh_mregimenpensionario(trp_codsunat);

-- Comentarios
COMMENT ON TABLE rrhh_mregimenpensionario IS 'Tabla maestra de regímenes pensionarios según SUNAT';
COMMENT ON COLUMN rrhh_mregimenpensionario.imregimenpensionario_id IS 'ID único del régimen pensionario';
COMMENT ON COLUMN rrhh_mregimenpensionario.trp_codsunat IS 'Código SUNAT del régimen pensionario';
COMMENT ON COLUMN rrhh_mregimenpensionario.trp_descripcion IS 'Descripción del régimen pensionario';
COMMENT ON COLUMN rrhh_mregimenpensionario.trp_abreviatura IS 'Abreviatura del régimen pensionario';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla rrhh_mregimenpensionario creada exitosamente';
END $$;
