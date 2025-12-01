-- =====================================================
-- Script: Crear tabla RRHH_MCONCEPTOS
-- Descripción: Tabla de conceptos de planilla
-- Fecha: 2025-11-30
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_mconceptos CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mconceptos (
    imconceptos_id BIGSERIAL PRIMARY KEY,
    ic_tributos VARCHAR(3),
    ic_tipoconcepto VARCHAR(2),
    tc_descripcion VARCHAR(200),
    ic_afecto INTEGER,
    ic_tipototales VARCHAR(2),
    ic_empresa INTEGER,
    ic_estado INTEGER DEFAULT 1,
    ic_usuarioregistro BIGINT,
    fc_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ic_usuarioedito BIGINT,
    fc_fechaedito TIMESTAMP,
    ic_usuarioelimino BIGINT,
    fc_fechaelimino TIMESTAMP
);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mconceptos IS 'Tabla de conceptos de planilla';
COMMENT ON COLUMN rrhh_mconceptos.imconceptos_id IS 'ID autoincremental del concepto (PK)';
COMMENT ON COLUMN rrhh_mconceptos.ic_tributos IS 'ID del tributo (FK a rrhh_mtributos)';
COMMENT ON COLUMN rrhh_mconceptos.ic_tipoconcepto IS 'ID del tipo de concepto (FK a rrhh_mtipoconcepto)';
COMMENT ON COLUMN rrhh_mconceptos.tc_descripcion IS 'Descripción del concepto (editable)';
COMMENT ON COLUMN rrhh_mconceptos.ic_afecto IS 'Afecto: 1=SI, 0=NO';
COMMENT ON COLUMN rrhh_mconceptos.ic_tipototales IS 'ID del tipo de totales (FK a rrhh_mtipototales)';
COMMENT ON COLUMN rrhh_mconceptos.ic_empresa IS 'ID de la empresa';
COMMENT ON COLUMN rrhh_mconceptos.ic_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mconceptos.ic_usuarioregistro IS 'ID del usuario que registró';
COMMENT ON COLUMN rrhh_mconceptos.fc_fecharegistro IS 'Fecha de registro';
COMMENT ON COLUMN rrhh_mconceptos.ic_usuarioedito IS 'ID del usuario que editó';
COMMENT ON COLUMN rrhh_mconceptos.fc_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN rrhh_mconceptos.ic_usuarioelimino IS 'ID del usuario que eliminó';
COMMENT ON COLUMN rrhh_mconceptos.fc_fechaelimino IS 'Fecha de eliminación';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_conceptos_empresa ON rrhh_mconceptos(ic_empresa);
CREATE INDEX idx_conceptos_estado ON rrhh_mconceptos(ic_estado);
CREATE INDEX idx_conceptos_tributo ON rrhh_mconceptos(ic_tributos);
CREATE INDEX idx_conceptos_tipoconcepto ON rrhh_mconceptos(ic_tipoconcepto);

-- Verificar tabla creada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'rrhh_mconceptos'
ORDER BY ordinal_position;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
