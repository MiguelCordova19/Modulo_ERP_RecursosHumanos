-- =====================================================
-- Script: Crear tabla RRHH_MMOTIVOPRESTAMO (PostgreSQL)
-- Descripción: Tabla para almacenar motivos de préstamos
-- Fecha: 2025-11-06
-- =====================================================

-- Verificar si la tabla existe y eliminarla si es necesario
DROP TABLE IF EXISTS rrhh_mmotivoprestamo CASCADE;

-- Crear la tabla rrhh_mmotivoprestamo
CREATE TABLE rrhh_mmotivoprestamo (
    immmotivoprestamo_id SERIAL PRIMARY KEY,
    tmp_descripcion VARCHAR(100) NOT NULL,
    imp_estado INT NOT NULL DEFAULT 1,
    imempresa_id INT NOT NULL,
    dtmp_fechacreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dtmp_fechamodificacion TIMESTAMP NULL,
    
    CONSTRAINT fk_rrhh_mmotivoprestamo_empresa FOREIGN KEY (imempresa_id) 
        REFERENCES rrhh_mempresa(imempresa_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX ix_rrhh_mmotivoprestamo_estado 
    ON rrhh_mmotivoprestamo(imp_estado);

CREATE INDEX ix_rrhh_mmotivoprestamo_empresa 
    ON rrhh_mmotivoprestamo(imempresa_id);

CREATE INDEX ix_rrhh_mmotivoprestamo_empresa_estado 
    ON rrhh_mmotivoprestamo(imempresa_id, imp_estado);

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla RRHH_MMOTIVOPRESTAMO creada exitosamente';
END $$;
