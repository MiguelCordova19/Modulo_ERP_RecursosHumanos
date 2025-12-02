-- =====================================================
-- Script: Crear tabla RRHH_MTIPOCUENTA
-- Descripción: Tabla de tipos de cuenta bancaria
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mtipocuenta CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mtipocuenta (
    imtipocuenta_id VARCHAR(2) PRIMARY KEY,
    ttc_descripcion VARCHAR(50) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mtipocuenta (imtipocuenta_id, ttc_descripcion, estado) VALUES
('01', 'Corriente', 1),
('02', 'Maestra', 1),
('03', 'Ahorros', 1),
('04', 'Interbancaria', 1)
ON CONFLICT (imtipocuenta_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mtipocuenta IS 'Tabla de tipos de cuenta bancaria';
COMMENT ON COLUMN rrhh_mtipocuenta.imtipocuenta_id IS 'ID del tipo de cuenta (PK)';
COMMENT ON COLUMN rrhh_mtipocuenta.ttc_descripcion IS 'Descripción del tipo de cuenta';
COMMENT ON COLUMN rrhh_mtipocuenta.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mtipocuenta.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mtipocuenta.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mtipocuenta ORDER BY imtipocuenta_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
