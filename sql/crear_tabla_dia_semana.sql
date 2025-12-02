-- =====================================================
-- Script: Crear tabla RRHH_MDIASEMANA
-- Descripción: Tabla maestra de días de la semana
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_mdiasemana CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mdiasemana (
    idiasemana_id VARCHAR(2) PRIMARY KEY,
    tds_descripcion VARCHAR(20) NOT NULL,
    tds_abreviatura VARCHAR(3) NOT NULL,
    
    -- Auditoría
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1 -- 1=ACTIVO, 0=INACTIVO
);

-- Insertar datos iniciales
INSERT INTO rrhh_mdiasemana (idiasemana_id, tds_descripcion, tds_abreviatura, it_estado) VALUES
('01', 'Lunes', 'LUN', 1),
('02', 'Martes', 'MAR', 1),
('03', 'Miércoles', 'MIE', 1),
('04', 'Jueves', 'JUE', 1),
('05', 'Viernes', 'VIE', 1),
('06', 'Sábado', 'SAB', 1),
('07', 'Domingo', 'DOM', 1)
ON CONFLICT (idiasemana_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mdiasemana IS 'Tabla maestra de días de la semana';
COMMENT ON COLUMN rrhh_mdiasemana.idiasemana_id IS 'ID del día (PK)';
COMMENT ON COLUMN rrhh_mdiasemana.tds_descripcion IS 'Nombre completo del día';
COMMENT ON COLUMN rrhh_mdiasemana.tds_abreviatura IS 'Abreviatura del día (3 letras)';
COMMENT ON COLUMN rrhh_mdiasemana.it_estado IS 'Estado: 1=ACTIVO, 0=INACTIVO';

-- Verificar datos insertados
SELECT * FROM rrhh_mdiasemana ORDER BY idiasemana_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
