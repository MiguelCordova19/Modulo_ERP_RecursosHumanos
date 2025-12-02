-- =====================================================
-- Script: Crear tabla RRHH_REGIMENLABORAL
-- Descripción: Tabla de regímenes laborales SUNAT
-- Fecha: 2025-11-30
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_regimenlaboral CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_regimenlaboral (
    imregimenlaboral_id VARCHAR(2) PRIMARY KEY,
    trl_codsunat VARCHAR(10) NOT NULL,
    trl_regimenlaboral VARCHAR(100) NOT NULL,
    trl_descripcion VARCHAR(500),
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos
INSERT INTO rrhh_regimenlaboral (imregimenlaboral_id, trl_codsunat, trl_regimenlaboral, trl_descripcion, estado) VALUES
('01', '10', 'Régimen General', 'Beneficios completos: CTS, gratificaciones, vacaciones 30 días, ESSALUD.', 1),
('02', '60', 'Pequeña Empresa', 'Beneficios parciales: CTS desde el 2° año, vacaciones 15 días.', 1),
('03', '70', 'Microempresa', 'Beneficios reducidos: sin CTS ni gratificación, vacaciones 15 días.', 1),
('04', '50', 'Agrario', 'Régimen especial para trabajadores del sector agrario.', 1),
('05', '20', 'Construcción Civil', 'Régimen especial para el sector construcción.', 1),
('06', '80', 'CAS', 'Contrato Administrativo de Servicios, sector público.', 1);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_regimenlaboral IS 'Tabla de regímenes laborales SUNAT';
COMMENT ON COLUMN rrhh_regimenlaboral.imregimenlaboral_id IS 'ID del régimen laboral (PK)';
COMMENT ON COLUMN rrhh_regimenlaboral.trl_codsunat IS 'Código SUNAT del régimen';
COMMENT ON COLUMN rrhh_regimenlaboral.trl_regimenlaboral IS 'Nombre del régimen laboral';
COMMENT ON COLUMN rrhh_regimenlaboral.trl_descripcion IS 'Descripción detallada del régimen';
COMMENT ON COLUMN rrhh_regimenlaboral.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_regimenlaboral.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_regimenlaboral.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_regimenlaboral ORDER BY imregimenlaboral_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
