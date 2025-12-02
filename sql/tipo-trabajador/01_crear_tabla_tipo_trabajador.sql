-- =====================================================
-- Script: Crear tabla rrhh_mtipotrabajador (PostgreSQL)
-- Descripción: Tabla de tipos de trabajador por empresa
-- Fecha: 2025-11-25
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS rrhh_mtipotrabajador CASCADE;

-- Crear tabla rrhh_mtipotrabajador
CREATE TABLE rrhh_mtipotrabajador (
    imtipotrabajador_id SERIAL PRIMARY KEY,
    ttt_codigointerno VARCHAR(20) NOT NULL,
    itt_tipo INTEGER NOT NULL,
    itt_regimenpensionario INTEGER NOT NULL,
    ttt_descripcion VARCHAR(200) NOT NULL,
    itt_estado INTEGER NOT NULL DEFAULT 1,
    empresa_id INTEGER NOT NULL DEFAULT 1,
    
    -- Constraints
    CONSTRAINT fk_tipotrabajador_tipo FOREIGN KEY (itt_tipo) 
        REFERENCES rrhh_mtipo(imtipo_id) ON DELETE RESTRICT,
    CONSTRAINT fk_tipotrabajador_regimen FOREIGN KEY (itt_regimenpensionario) 
        REFERENCES rrhh_mregimenpensionario(imregimenpensionario_id) ON DELETE RESTRICT,
    CONSTRAINT uk_tipotrabajador_codigo_empresa UNIQUE (ttt_codigointerno, empresa_id)
);

-- Crear índices
CREATE INDEX idx_tipotrabajador_tipo ON rrhh_mtipotrabajador(itt_tipo);
CREATE INDEX idx_tipotrabajador_regimen ON rrhh_mtipotrabajador(itt_regimenpensionario);
CREATE INDEX idx_tipotrabajador_empresa ON rrhh_mtipotrabajador(empresa_id);
CREATE INDEX idx_tipotrabajador_estado ON rrhh_mtipotrabajador(itt_estado);

-- Comentarios
COMMENT ON TABLE rrhh_mtipotrabajador IS 'Tabla de tipos de trabajador por empresa';
COMMENT ON COLUMN rrhh_mtipotrabajador.imtipotrabajador_id IS 'ID único del tipo de trabajador';
COMMENT ON COLUMN rrhh_mtipotrabajador.ttt_codigointerno IS 'Código interno de 3 dígitos';
COMMENT ON COLUMN rrhh_mtipotrabajador.itt_tipo IS 'Referencia al tipo SUNAT (rrhh_mtipo)';
COMMENT ON COLUMN rrhh_mtipotrabajador.itt_regimenpensionario IS 'Referencia al régimen pensionario';
COMMENT ON COLUMN rrhh_mtipotrabajador.ttt_descripcion IS 'Descripción del tipo de trabajador';
COMMENT ON COLUMN rrhh_mtipotrabajador.itt_estado IS 'Estado del registro (1=activo, 0=inactivo)';
COMMENT ON COLUMN rrhh_mtipotrabajador.empresa_id IS 'ID de la empresa';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla rrhh_mtipotrabajador creada exitosamente';
END $$;
