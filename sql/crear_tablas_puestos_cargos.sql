-- =====================================================
-- Script: Crear tablas para Puestos/Cargos
-- Descripción: Tablas para grupos y puestos de trabajo
-- Fecha: 2025-12-01
-- =====================================================

-- ========== TABLA: GRUPOS DE PUESTOS ==========
DROP TABLE IF EXISTS rrhh_grupos_puestos CASCADE;

CREATE TABLE rrhh_grupos_puestos (
    imgrupo_id BIGSERIAL PRIMARY KEY,
    tg_descripcion VARCHAR(200) NOT NULL,
    tg_evaluacion JSONB,  -- Almacena los grados seleccionados
    ig_estado INTEGER DEFAULT 1,
    ig_empresa INTEGER NOT NULL,
    ig_usuarioregistro BIGINT,
    fg_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ig_usuarioedito BIGINT,
    fg_fechaedito TIMESTAMP,
    ig_usuarioelimino BIGINT,
    fg_fechaelimino TIMESTAMP
);

COMMENT ON TABLE rrhh_grupos_puestos IS 'Tabla de grupos de puestos de trabajo';
COMMENT ON COLUMN rrhh_grupos_puestos.imgrupo_id IS 'ID autoincremental del grupo (PK)';
COMMENT ON COLUMN rrhh_grupos_puestos.tg_descripcion IS 'Nombre/descripción del grupo';
COMMENT ON COLUMN rrhh_grupos_puestos.tg_evaluacion IS 'JSON con los grados de evaluación (A, B, C, D)';
COMMENT ON COLUMN rrhh_grupos_puestos.ig_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_grupos_puestos.ig_empresa IS 'ID de la empresa (FK)';

-- Índices
CREATE INDEX idx_grupos_puestos_empresa ON rrhh_grupos_puestos(ig_empresa);
CREATE INDEX idx_grupos_puestos_estado ON rrhh_grupos_puestos(ig_estado);

-- ========== TABLA: PUESTOS ==========
DROP TABLE IF EXISTS rrhh_puestos CASCADE;

CREATE TABLE rrhh_puestos (
    impuesto_id BIGSERIAL PRIMARY KEY,
    tp_codigo_interno VARCHAR(20) NOT NULL,
    tp_descripcion VARCHAR(200) NOT NULL,
    ip_grupo_id BIGINT,  -- Ahora es opcional
    ip_estado INTEGER DEFAULT 1,
    ip_empresa INTEGER NOT NULL,
    ip_usuarioregistro BIGINT,
    fp_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuarioedito BIGINT,
    fp_fechaedito TIMESTAMP,
    ip_usuarioelimino BIGINT,
    fp_fechaelimino TIMESTAMP,
    FOREIGN KEY (ip_grupo_id) REFERENCES rrhh_grupos_puestos(imgrupo_id)
);

COMMENT ON TABLE rrhh_puestos IS 'Tabla de puestos de trabajo';
COMMENT ON COLUMN rrhh_puestos.impuesto_id IS 'ID autoincremental del puesto (PK)';
COMMENT ON COLUMN rrhh_puestos.tp_codigo_interno IS 'Código interno del puesto';
COMMENT ON COLUMN rrhh_puestos.tp_descripcion IS 'Nombre/descripción del puesto';
COMMENT ON COLUMN rrhh_puestos.ip_grupo_id IS 'ID del grupo al que pertenece (FK)';
COMMENT ON COLUMN rrhh_puestos.ip_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_puestos.ip_empresa IS 'ID de la empresa (FK)';

-- Índices
CREATE INDEX idx_puestos_empresa ON rrhh_puestos(ip_empresa);
CREATE INDEX idx_puestos_estado ON rrhh_puestos(ip_estado);
CREATE INDEX idx_puestos_grupo ON rrhh_puestos(ip_grupo_id);
CREATE INDEX idx_puestos_codigo ON rrhh_puestos(tp_codigo_interno);

-- Constraint único: código + empresa
CREATE UNIQUE INDEX idx_puestos_codigo_empresa ON rrhh_puestos(tp_codigo_interno, ip_empresa) WHERE ip_estado = 1;

-- ========== DATOS DE EJEMPLO (OPCIONAL) ==========
-- Grupos de ejemplo
-- INSERT INTO rrhh_grupos_puestos (tg_descripcion, tg_evaluacion, ig_empresa, ig_usuarioregistro) VALUES
-- ('Administrativo', '{"formacion": "A", "pasado_profesional": "B"}', 1, 1),
-- ('Operativo', '{"formacion": "C", "pasado_profesional": "C"}', 1, 1),
-- ('Gerencial', '{"formacion": "A", "pasado_profesional": "A"}', 1, 1);

-- Puestos de ejemplo
-- INSERT INTO rrhh_puestos (tp_codigo_interno, tp_descripcion, ip_grupo_id, ip_empresa, ip_usuarioregistro) VALUES
-- ('ADM001', 'Asistente Administrativo', 1, 1, 1),
-- ('OPE001', 'Operario de Producción', 2, 1, 1),
-- ('GER001', 'Gerente General', 3, 1, 1);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
