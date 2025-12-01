-- =====================================================
-- Script: Crear tabla RRHH_GRUPO_PUESTO_DETALLE
-- Descripción: Tabla intermedia para relacionar grupos con puestos
--              y guardar las evaluaciones (grados A, B, C, D)
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS rrhh_grupo_puesto_detalle CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_grupo_puesto_detalle (
    imgrupo_puesto_detalle_id SERIAL PRIMARY KEY,
    igpd_grupo_id INTEGER NOT NULL,
    igpd_puesto_id INTEGER NOT NULL,
    tgpd_evaluacion JSONB,  -- Almacena los grados seleccionados para cada item
    igpd_estado INTEGER DEFAULT 1,
    igpd_usuarioregistro BIGINT,
    fgpd_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    igpd_usuarioedito BIGINT,
    fgpd_fechaedito TIMESTAMP,
    FOREIGN KEY (igpd_grupo_id) REFERENCES rrhh_mgrupos(imgrupo_id),
    FOREIGN KEY (igpd_puesto_id) REFERENCES rrhh_mpuestos(impuesto_id)
);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_grupo_puesto_detalle IS 'Tabla intermedia que relaciona grupos con puestos y guarda evaluaciones';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.imgrupo_puesto_detalle_id IS 'ID autoincremental (PK)';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.igpd_grupo_id IS 'ID del grupo (FK a rrhh_mgrupos)';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.igpd_puesto_id IS 'ID del puesto (FK a rrhh_mpuestos)';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.tgpd_evaluacion IS 'JSON con las evaluaciones (formacion: A, pasado_profesional: B, etc.)';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.igpd_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.igpd_usuarioregistro IS 'ID del usuario que registró';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.fgpd_fecharegistro IS 'Fecha de registro';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.igpd_usuarioedito IS 'ID del usuario que editó';
COMMENT ON COLUMN rrhh_grupo_puesto_detalle.fgpd_fechaedito IS 'Fecha de edición';

-- Índices
CREATE INDEX idx_grupo_puesto_detalle_grupo ON rrhh_grupo_puesto_detalle(igpd_grupo_id);
CREATE INDEX idx_grupo_puesto_detalle_puesto ON rrhh_grupo_puesto_detalle(igpd_puesto_id);
CREATE INDEX idx_grupo_puesto_detalle_estado ON rrhh_grupo_puesto_detalle(igpd_estado);

-- Constraint único: un puesto solo puede estar en un grupo activo a la vez
CREATE UNIQUE INDEX idx_grupo_puesto_unico ON rrhh_grupo_puesto_detalle(igpd_puesto_id) 
WHERE igpd_estado = 1;

-- Verificar tabla creada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_name = 'rrhh_grupo_puesto_detalle'
ORDER BY ordinal_position;

-- Ejemplo de estructura JSON para evaluaciones:
-- {
--   "formacion": "A",
--   "pasado_profesional": "B",
--   "motivo_solicitud": "C",
--   "comportamiento": "A",
--   "potencial": "B",
--   "condiciones_personales": "C",
--   "situacion_familiar": "D",
--   "proceso_seleccion": "A"
-- }

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
