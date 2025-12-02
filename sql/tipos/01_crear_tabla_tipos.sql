-- =====================================================
-- Script: Crear tabla RRHH_MTIPO (PostgreSQL)
-- Descripción: Tabla maestra de tipos de trabajador (SUNAT)
-- Fecha: 2025-11-06
-- =====================================================

-- Verificar si la tabla existe y eliminarla si es necesario
DROP TABLE IF EXISTS rrhh_mtipo CASCADE;

-- Crear la tabla rrhh_mtipo
CREATE TABLE rrhh_mtipo (
    imtipo_id SERIAL PRIMARY KEY,
    tt_codsunat VARCHAR(20) NOT NULL UNIQUE,
    tt_descripcion VARCHAR(200) NOT NULL
);

-- Crear índice para búsquedas por código SUNAT
CREATE INDEX ix_rrhh_mtipo_codsunat 
    ON rrhh_mtipo(tt_codsunat);

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla rrhh_mtipo creada exitosamente';
END $$;
