-- =====================================================
-- Script: Crear tablas para Conceptos por Régimen Laboral
-- Descripción: Dos tablas relacionadas para gestionar conceptos por régimen
-- Fecha: 2025-11-30
-- =====================================================

-- =====================================================
-- TABLA 1: RRHH_CONCEPTOS_REGIMEN_LABORAL (Cabecera)
-- =====================================================

-- Eliminar tablas si existen (opcional)
-- DROP TABLE IF EXISTS rrhh_conceptos_regimen_detalle CASCADE;
-- DROP TABLE IF EXISTS rrhh_conceptos_regimen_laboral CASCADE;

-- Crear tabla cabecera
CREATE TABLE IF NOT EXISTS rrhh_conceptos_regimen_laboral (
    imconceptosregimen_id BIGSERIAL PRIMARY KEY,
    ic_regimenlaboral VARCHAR(2) NOT NULL,
    ic_empresa INTEGER NOT NULL,
    ic_estado INTEGER DEFAULT 1,
    ic_usuarioregistro BIGINT,
    fc_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ic_usuarioedito BIGINT,
    fc_fechaedito TIMESTAMP,
    ic_usuarioelimino BIGINT,
    fc_fechaelimino TIMESTAMP,
    
    -- Foreign key
    CONSTRAINT fk_regimen_laboral FOREIGN KEY (ic_regimenlaboral) 
        REFERENCES rrhh_regimenlaboral(imregimenlaboral_id)
);

-- Comentarios tabla cabecera
COMMENT ON TABLE rrhh_conceptos_regimen_laboral IS 'Tabla cabecera de conceptos por régimen laboral';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.imconceptosregimen_id IS 'ID autoincremental (PK)';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.ic_regimenlaboral IS 'ID del régimen laboral (FK)';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.ic_empresa IS 'ID de la empresa';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.ic_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.ic_usuarioregistro IS 'Usuario que creó';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.fc_fecharegistro IS 'Fecha de creación';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.ic_usuarioedito IS 'Usuario que editó';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.fc_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.ic_usuarioelimino IS 'Usuario que eliminó';
COMMENT ON COLUMN rrhh_conceptos_regimen_laboral.fc_fechaelimino IS 'Fecha de eliminación';

-- =====================================================
-- TABLA 2: RRHH_CONCEPTOS_REGIMEN_DETALLE (Detalle)
-- =====================================================

-- Crear tabla detalle
CREATE TABLE IF NOT EXISTS rrhh_conceptos_regimen_detalle (
    imconceptosregimendetalle_id BIGSERIAL PRIMARY KEY,
    ic_conceptosregimen_id BIGINT NOT NULL,
    ic_concepto_id BIGINT NOT NULL,
    ic_estado INTEGER DEFAULT 1,
    fc_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_conceptos_regimen FOREIGN KEY (ic_conceptosregimen_id) 
        REFERENCES rrhh_conceptos_regimen_laboral(imconceptosregimen_id) ON DELETE CASCADE,
    CONSTRAINT fk_concepto FOREIGN KEY (ic_concepto_id) 
        REFERENCES rrhh_mconceptos(imconceptos_id)
);

-- Comentarios tabla detalle
COMMENT ON TABLE rrhh_conceptos_regimen_detalle IS 'Tabla detalle de conceptos asignados a régimen laboral';
COMMENT ON COLUMN rrhh_conceptos_regimen_detalle.imconceptosregimendetalle_id IS 'ID autoincremental (PK)';
COMMENT ON COLUMN rrhh_conceptos_regimen_detalle.ic_conceptosregimen_id IS 'ID de la cabecera (FK)';
COMMENT ON COLUMN rrhh_conceptos_regimen_detalle.ic_concepto_id IS 'ID del concepto (FK)';
COMMENT ON COLUMN rrhh_conceptos_regimen_detalle.ic_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_conceptos_regimen_detalle.fc_fecharegistro IS 'Fecha de registro';

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Índices para mejorar el rendimiento
CREATE INDEX idx_conceptos_regimen_empresa ON rrhh_conceptos_regimen_laboral(ic_empresa);
CREATE INDEX idx_conceptos_regimen_estado ON rrhh_conceptos_regimen_laboral(ic_estado);
CREATE INDEX idx_conceptos_regimen_regimen ON rrhh_conceptos_regimen_laboral(ic_regimenlaboral);

CREATE INDEX idx_conceptos_regimen_detalle_cabecera ON rrhh_conceptos_regimen_detalle(ic_conceptosregimen_id);
CREATE INDEX idx_conceptos_regimen_detalle_concepto ON rrhh_conceptos_regimen_detalle(ic_concepto_id);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar tablas creadas
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('rrhh_conceptos_regimen_laboral', 'rrhh_conceptos_regimen_detalle')
ORDER BY table_name, ordinal_position;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

/*
EJEMPLO DE USO:

1. Insertar cabecera (régimen laboral para una empresa):
INSERT INTO rrhh_conceptos_regimen_laboral (
    ic_regimenlaboral, 
    ic_empresa, 
    ic_usuarioregistro
) VALUES ('01', 1, 1);

2. Obtener el ID generado:
SELECT currval('rrhh_conceptos_regimen_laboral_imconceptosregimen_id_seq');

3. Insertar detalles (conceptos asignados):
INSERT INTO rrhh_conceptos_regimen_detalle (
    ic_conceptosregimen_id, 
    ic_concepto_id
) VALUES 
(1, 1),  -- Concepto 1
(1, 3),  -- Concepto 3
(1, 5);  -- Concepto 5

4. Consultar conceptos de un régimen:
SELECT 
    cr.imconceptosregimen_id,
    rl.trl_codsunat,
    rl.trl_regimenlaboral,
    c.tc_descripcion,
    t.tt_codsunat
FROM rrhh_conceptos_regimen_laboral cr
INNER JOIN rrhh_regimenlaboral rl ON cr.ic_regimenlaboral = rl.imregimenlaboral_id
INNER JOIN rrhh_conceptos_regimen_detalle crd ON cr.imconceptosregimen_id = crd.ic_conceptosregimen_id
INNER JOIN rrhh_mconceptos c ON crd.ic_concepto_id = c.imconceptos_id
LEFT JOIN rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
WHERE cr.ic_empresa = 1 AND cr.ic_estado = 1;
*/
