-- =====================================================
-- Script: Crear tabla RRHH_MTIPOTOTALES
-- Descripción: Tabla maestra de tipos de totales
-- Fecha: 2025-11-30
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mtipototales CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mtipototales (
    imtipototales_id VARCHAR(2) PRIMARY KEY,
    ttt_descripcion VARCHAR(100) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_mtipototales (imtipototales_id, ttt_descripcion, estado) VALUES
('01', 'Apoyo Bono', 1),
('02', 'Trabajo Dia Feriado', 1),
('03', 'Tardanza', 1),
('04', 'Falta Sin Goce', 1),
('05', 'Falta Con Goce', 1),
('06', 'Comisiones AFP', 1),
('07', 'Vacaciones', 1);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mtipototales IS 'Tabla maestra de tipos de totales para planilla';
COMMENT ON COLUMN rrhh_mtipototales.imtipototales_id IS 'Código del tipo de total (PK)';
COMMENT ON COLUMN rrhh_mtipototales.ttt_descripcion IS 'Descripción del tipo de total';
COMMENT ON COLUMN rrhh_mtipototales.estado IS 'Estado del registro (1=Activo, 0=Inactivo)';
COMMENT ON COLUMN rrhh_mtipototales.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mtipototales.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mtipototales ORDER BY imtipototales_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
