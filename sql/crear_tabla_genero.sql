-- =====================================================
-- Script: Crear tabla RRHH_MGENERO
-- Descripción: Tabla de géneros
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mgenero CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mgenero (
    imgenero_id VARCHAR(2) PRIMARY KEY,
    td_descripcion VARCHAR(50) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mgenero (imgenero_id, td_descripcion, estado) VALUES
('01', 'Masculino', 1),
('02', 'Femenino', 1)
ON CONFLICT (imgenero_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mgenero IS 'Tabla de géneros';
COMMENT ON COLUMN rrhh_mgenero.imgenero_id IS 'ID del género (PK)';
COMMENT ON COLUMN rrhh_mgenero.td_descripcion IS 'Descripción del género';
COMMENT ON COLUMN rrhh_mgenero.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mgenero.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mgenero.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mgenero ORDER BY imgenero_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
