-- =====================================================
-- Script: Crear tabla RRHH_MFERIADOS (PostgreSQL)
-- Descripción: Tabla para almacenar feriados
-- Fecha: 2025-11-06
-- =====================================================

-- Verificar si la tabla existe y eliminarla si es necesario
DROP TABLE IF EXISTS rrhh_mferiados CASCADE;

-- Crear la tabla rrhh_mferiados
CREATE TABLE rrhh_mferiados (
    imferiado_id SERIAL PRIMARY KEY,
    ff_fechaferiado DATE NOT NULL,
    tf_diaferiado VARCHAR(50) NOT NULL,
    tf_denominacion VARCHAR(200) NOT NULL,
    if_estado INT NOT NULL DEFAULT 1,
    imempresa_id INT NOT NULL,
    dtf_fechacreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dtf_fechamodificacion TIMESTAMP NULL,
    
    CONSTRAINT fk_rrhh_mferiados_empresa FOREIGN KEY (imempresa_id) 
        REFERENCES rrhh_mempresa(imempresa_id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX ix_rrhh_mferiados_estado 
    ON rrhh_mferiados(if_estado);

CREATE INDEX ix_rrhh_mferiados_empresa 
    ON rrhh_mferiados(imempresa_id);

CREATE INDEX ix_rrhh_mferiados_fecha 
    ON rrhh_mferiados(ff_fechaferiado);

CREATE INDEX ix_rrhh_mferiados_empresa_estado 
    ON rrhh_mferiados(imempresa_id, if_estado);

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla rrhh_mferiados creada exitosamente';
END $$;
