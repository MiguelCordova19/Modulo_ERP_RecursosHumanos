-- =====================================================
-- Script: Actualizar tabla RRHH_MCONCEPTOS
-- Descripción: Cambiar tipos de datos para coincidir con tablas relacionadas
-- Fecha: 2025-11-30
-- =====================================================

-- OPCIÓN 1: Si la tabla ya tiene datos, actualizar tipos de columnas
-- ⚠️ ADVERTENCIA: Esto puede fallar si hay datos incompatibles

ALTER TABLE rrhh_mconceptos 
    ALTER COLUMN ic_tributos TYPE VARCHAR(3) USING ic_tributos::VARCHAR(3);

ALTER TABLE rrhh_mconceptos 
    ALTER COLUMN ic_tipoconcepto TYPE VARCHAR(2) USING ic_tipoconcepto::VARCHAR(2);

ALTER TABLE rrhh_mconceptos 
    ALTER COLUMN ic_tipototales TYPE VARCHAR(2) USING ic_tipototales::VARCHAR(2);

-- Agregar campo descripción si no existe
ALTER TABLE rrhh_mconceptos 
    ADD COLUMN IF NOT EXISTS tc_descripcion VARCHAR(200);

-- Verificar cambios
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_mconceptos'
AND column_name IN ('ic_tributos', 'ic_tipoconcepto', 'ic_tipototales');

-- =====================================================
-- OPCIÓN 2: Si prefieres recrear la tabla (PERDERÁS DATOS)
-- =====================================================

-- Descomentar las siguientes líneas solo si quieres recrear la tabla

-- DROP TABLE IF EXISTS rrhh_mconceptos CASCADE;

-- CREATE TABLE rrhh_mconceptos (
--     imconceptos_id BIGSERIAL PRIMARY KEY,
--     ic_tributos VARCHAR(3),
--     ic_tipoconcepto VARCHAR(2),
--     ic_afecto INTEGER,
--     ic_tipototales VARCHAR(2),
--     ic_empresa INTEGER,
--     ic_estado INTEGER DEFAULT 1,
--     ic_usuarioregistro BIGINT,
--     fc_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     ic_usuarioedito BIGINT,
--     fc_fechaedito TIMESTAMP,
--     ic_usuarioelimino BIGINT,
--     fc_fechaelimino TIMESTAMP
-- );

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
