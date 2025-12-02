-- =====================================================
-- Script: Crear tabla RRHH_MGRUPOS
-- Descripción: Tabla de grupos (simplificada)
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS rrhh_mgrupos CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mgrupos (
    imgrupo_id SERIAL PRIMARY KEY,
    tg_nombre VARCHAR(20) NOT NULL,
    tg_descripcion VARCHAR(100) NOT NULL,
    ig_estado INTEGER DEFAULT 1,
    ig_empresa INTEGER NOT NULL,
    ig_usuarioregistro BIGINT,
    fg_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ig_usuarioedito BIGINT,
    fg_fechaedito TIMESTAMP,
    ig_usuarioelimino BIGINT,
    fg_fechaelimino TIMESTAMP
);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mgrupos IS 'Tabla de grupos';
COMMENT ON COLUMN rrhh_mgrupos.imgrupo_id IS 'ID autoincremental del grupo (PK)';
COMMENT ON COLUMN rrhh_mgrupos.tg_nombre IS 'Nombre del grupo (máx 20 caracteres)';
COMMENT ON COLUMN rrhh_mgrupos.tg_descripcion IS 'Descripción del grupo (máx 100 caracteres)';
COMMENT ON COLUMN rrhh_mgrupos.ig_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mgrupos.ig_empresa IS 'ID de la empresa (FK)';
COMMENT ON COLUMN rrhh_mgrupos.ig_usuarioregistro IS 'ID del usuario que registró';
COMMENT ON COLUMN rrhh_mgrupos.fg_fecharegistro IS 'Fecha de registro';
COMMENT ON COLUMN rrhh_mgrupos.ig_usuarioedito IS 'ID del usuario que editó';
COMMENT ON COLUMN rrhh_mgrupos.fg_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN rrhh_mgrupos.ig_usuarioelimino IS 'ID del usuario que eliminó';
COMMENT ON COLUMN rrhh_mgrupos.fg_fechaelimino IS 'Fecha de eliminación';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_grupos_empresa ON rrhh_mgrupos(ig_empresa);
CREATE INDEX idx_grupos_estado ON rrhh_mgrupos(ig_estado);
CREATE INDEX idx_grupos_nombre ON rrhh_mgrupos(tg_nombre);

-- Constraint único: nombre + empresa (no puede haber nombres duplicados en la misma empresa)
CREATE UNIQUE INDEX idx_grupos_nombre_empresa ON rrhh_mgrupos(tg_nombre, ig_empresa) WHERE ig_estado = 1;

-- Verificar tabla creada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_mgrupos'
ORDER BY ordinal_position;

-- Datos de ejemplo (opcional)
-- INSERT INTO rrhh_mgrupos (tg_nombre, tg_descripcion, ig_empresa, ig_usuarioregistro) VALUES
-- ('ADMIN', 'Grupo Administrativo', 1, 1),
-- ('VENTAS', 'Grupo de Ventas', 1, 1),
-- ('PRODUCCION', 'Grupo de Producción', 1, 1);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
