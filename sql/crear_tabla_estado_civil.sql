-- =====================================================
-- Script: Crear tabla RRHH_MESTADOCIVIL
-- Descripción: Tabla de estados civiles
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mestadocivil CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mestadocivil (
    imestadocivil_id VARCHAR(2) PRIMARY KEY,
    tec_descripcion VARCHAR(50) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mestadocivil (imestadocivil_id, tec_descripcion, estado) VALUES
('01', 'Soltero(a)', 1),
('02', 'Casado(a)', 1),
('03', 'Viudo(a)', 1),
('04', 'Divorciado(a)', 1)
ON CONFLICT (imestadocivil_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mestadocivil IS 'Tabla de estados civiles';
COMMENT ON COLUMN rrhh_mestadocivil.imestadocivil_id IS 'ID del estado civil (PK)';
COMMENT ON COLUMN rrhh_mestadocivil.tec_descripcion IS 'Descripción del estado civil';
COMMENT ON COLUMN rrhh_mestadocivil.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mestadocivil.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mestadocivil.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mestadocivil ORDER BY imestadocivil_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
