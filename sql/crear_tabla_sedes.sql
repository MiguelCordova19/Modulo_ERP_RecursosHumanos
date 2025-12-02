-- =====================================================
-- Script: Crear tabla RRHH_MSEDE
-- Descripción: Tabla maestra de sedes por empresa
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_msede CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_msede (
    imsede_id BIGSERIAL PRIMARY KEY,
    ts_codigo VARCHAR(20) NOT NULL,
    ts_descripcion VARCHAR(100) NOT NULL,
    is_estado INTEGER DEFAULT 1,
    is_empresa INTEGER NOT NULL,
    is_usuarioregistro BIGINT,
    fs_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_usuarioedito BIGINT,
    fs_fechaedito TIMESTAMP,
    is_usuarioelimino BIGINT,
    fs_fechaelimino TIMESTAMP
);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_msede IS 'Tabla maestra de sedes por empresa';
COMMENT ON COLUMN rrhh_msede.imsede_id IS 'ID autoincremental de la sede (PK)';
COMMENT ON COLUMN rrhh_msede.ts_codigo IS 'Código de la sede';
COMMENT ON COLUMN rrhh_msede.ts_descripcion IS 'Descripción/nombre de la sede';
COMMENT ON COLUMN rrhh_msede.is_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_msede.is_empresa IS 'ID de la empresa (FK)';
COMMENT ON COLUMN rrhh_msede.is_usuarioregistro IS 'ID del usuario que registró';
COMMENT ON COLUMN rrhh_msede.fs_fecharegistro IS 'Fecha de registro';
COMMENT ON COLUMN rrhh_msede.is_usuarioedito IS 'ID del usuario que editó';
COMMENT ON COLUMN rrhh_msede.fs_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN rrhh_msede.is_usuarioelimino IS 'ID del usuario que eliminó';
COMMENT ON COLUMN rrhh_msede.fs_fechaelimino IS 'Fecha de eliminación';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_sedes_empresa ON rrhh_msede(is_empresa);
CREATE INDEX idx_sedes_estado ON rrhh_msede(is_estado);
CREATE INDEX idx_sedes_codigo ON rrhh_msede(ts_codigo);

-- Constraint único: código + empresa (no puede haber códigos duplicados en la misma empresa)
CREATE UNIQUE INDEX idx_sedes_codigo_empresa ON rrhh_msede(ts_codigo, is_empresa) WHERE is_estado = 1;

-- Verificar tabla creada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_msede'
ORDER BY ordinal_position;

-- Datos de ejemplo (opcional)
-- INSERT INTO rrhh_msede (ts_codigo, ts_descripcion, is_empresa, is_usuarioregistro) VALUES
-- ('SEDE01', 'Sede Principal - Lima', 1, 1),
-- ('SEDE02', 'Sede Norte - Trujillo', 1, 1),
-- ('SEDE03', 'Sede Sur - Arequipa', 1, 1);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
