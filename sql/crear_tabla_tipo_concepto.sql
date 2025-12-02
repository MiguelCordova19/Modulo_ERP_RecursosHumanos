-- =====================================================
-- Script: Crear tabla RRHH_MTIPOCONCEPTO
-- Descripción: Tabla maestra de tipos de conceptos
-- Fecha: 2025-11-30
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mtipoconcepto CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mtipoconcepto (
    imtipoconcepto VARCHAR(2) PRIMARY KEY,
    ttc_descripcion VARCHAR(100) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mtipoconcepto (imtipoconcepto, ttc_descripcion, estado) VALUES
('01', 'INGRESOS', 1),
('02', 'DESCUENTOS', 1),
('03', 'APORTES DEL TRABAJADOR', 1),
('04', 'APORTES DEL EMPLEADOR', 1),
('05', 'TOTALES', 1);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mtipoconcepto IS 'Tabla maestra de tipos de conceptos para planilla';
COMMENT ON COLUMN rrhh_mtipoconcepto.imtipoconcepto IS 'Código del tipo de concepto (PK)';
COMMENT ON COLUMN rrhh_mtipoconcepto.ttc_descripcion IS 'Descripción del tipo de concepto';
COMMENT ON COLUMN rrhh_mtipoconcepto.estado IS 'Estado del registro (1=Activo, 0=Inactivo)';
COMMENT ON COLUMN rrhh_mtipoconcepto.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mtipoconcepto.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mtipoconcepto ORDER BY imtipoconcepto;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
