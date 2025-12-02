-- =====================================================
-- Script: Crear tabla RRHH_MTIPOPAGO
-- Descripción: Tabla de tipos de pago
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mtipopago CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mtipopago (
    imtipopago_id VARCHAR(2) PRIMARY KEY,
    ttp_descripcion VARCHAR(50) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mtipopago (imtipopago_id, ttp_descripcion, estado) VALUES
('01', 'Efectivo', 1),
('02', 'Depósito', 1)
ON CONFLICT (imtipopago_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mtipopago IS 'Tabla de tipos de pago';
COMMENT ON COLUMN rrhh_mtipopago.imtipopago_id IS 'ID del tipo de pago (PK)';
COMMENT ON COLUMN rrhh_mtipopago.ttp_descripcion IS 'Descripción del tipo de pago';
COMMENT ON COLUMN rrhh_mtipopago.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mtipopago.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mtipopago.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mtipopago ORDER BY imtipopago_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
