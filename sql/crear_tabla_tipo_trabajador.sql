-- =====================================================
-- Script: Crear tabla RRHH_MPR
-- Descripción: Tabla maestra Planilla/RRHH
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mpr CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mpr (
    impr_id VARCHAR(2) PRIMARY KEY,
    tpr_descripcion VARCHAR(50) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mpr (impr_id, tpr_descripcion, estado) VALUES
('01', 'PLANILLA', 1),
('02', 'RRHH', 1)
ON CONFLICT (impr_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mpr IS 'Tabla maestra Planilla/RRHH';
COMMENT ON COLUMN rrhh_mpr.impr_id IS 'ID del tipo (PK)';
COMMENT ON COLUMN rrhh_mpr.tpr_descripcion IS 'Descripción (PLANILLA/RRHH)';
COMMENT ON COLUMN rrhh_mpr.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mpr.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mpr.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mpr ORDER BY impr_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
