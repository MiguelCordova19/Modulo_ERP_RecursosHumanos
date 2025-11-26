-- =====================================================
-- Script: Crear tabla rrhh_mafp (PostgreSQL)
-- Descripción: Tabla de comisiones AFP por empresa
-- Fecha: 2025-11-25
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS rrhh_mafp CASCADE;

-- Crear tabla rrhh_mafp
CREATE TABLE rrhh_mafp (
    imafp_id SERIAL PRIMARY KEY,
    ia_mes INTEGER NOT NULL,
    ia_anio INTEGER NOT NULL,
    ia_regimenpensionario INTEGER NOT NULL,
    da_comisionflujo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    da_comisionanualsaldo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    da_primaseguro DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    da_aporteobligatorio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    da_remunmaxima DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    ia_estado INTEGER NOT NULL DEFAULT 1,
    empresa_id INTEGER NOT NULL DEFAULT 1,
    
    -- Constraints
    CONSTRAINT fk_afp_regimen FOREIGN KEY (ia_regimenpensionario) 
        REFERENCES rrhh_mregimenpensionario(imregimenpensionario_id) ON DELETE RESTRICT,
    CONSTRAINT uk_afp_periodo_regimen_empresa UNIQUE (ia_mes, ia_anio, ia_regimenpensionario, empresa_id),
    CONSTRAINT chk_mes_valido CHECK (ia_mes >= 1 AND ia_mes <= 12),
    CONSTRAINT chk_anio_valido CHECK (ia_anio >= 2000 AND ia_anio <= 2100)
);

-- Crear índices
CREATE INDEX idx_afp_regimen ON rrhh_mafp(ia_regimenpensionario);
CREATE INDEX idx_afp_empresa ON rrhh_mafp(empresa_id);
CREATE INDEX idx_afp_periodo ON rrhh_mafp(ia_anio, ia_mes);
CREATE INDEX idx_afp_estado ON rrhh_mafp(ia_estado);

-- Comentarios
COMMENT ON TABLE rrhh_mafp IS 'Tabla de comisiones AFP por empresa y periodo';
COMMENT ON COLUMN rrhh_mafp.imafp_id IS 'ID único de la comisión AFP';
COMMENT ON COLUMN rrhh_mafp.ia_mes IS 'Mes del periodo (1-12)';
COMMENT ON COLUMN rrhh_mafp.ia_anio IS 'Año del periodo';
COMMENT ON COLUMN rrhh_mafp.ia_regimenpensionario IS 'Referencia al régimen pensionario (AFP)';
COMMENT ON COLUMN rrhh_mafp.da_comisionflujo IS 'Comisión sobre flujo (%)';
COMMENT ON COLUMN rrhh_mafp.da_comisionanualsaldo IS 'Comisión anual sobre saldo';
COMMENT ON COLUMN rrhh_mafp.da_primaseguro IS 'Prima de seguro (%)';
COMMENT ON COLUMN rrhh_mafp.da_aporteobligatorio IS 'Aporte obligatorio (%)';
COMMENT ON COLUMN rrhh_mafp.da_remunmaxima IS 'Remuneración máxima (%)';
COMMENT ON COLUMN rrhh_mafp.ia_estado IS 'Estado del registro (1=activo, 0=inactivo)';
COMMENT ON COLUMN rrhh_mafp.empresa_id IS 'ID de la empresa';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Tabla rrhh_mafp creada exitosamente';
END $$;
