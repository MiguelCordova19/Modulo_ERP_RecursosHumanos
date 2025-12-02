-- =====================================================
-- Script: Crear tabla RRHH_MTURNO
-- Descripción: Tabla maestra de turnos
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_mturno CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mturno (
    imturno_id VARCHAR(2) PRIMARY KEY,
    tt_descripcion VARCHAR(50) NOT NULL,
    
    -- Auditoría
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1 -- 1=ACTIVO, 0=INACTIVO
);

-- Insertar datos iniciales
INSERT INTO rrhh_mturno (imturno_id, tt_descripcion, it_estado) VALUES
('01', 'Mañana', 1),
('02', 'Tarde', 1),
('03', 'Noche', 1)
ON CONFLICT (imturno_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mturno IS 'Tabla maestra de turnos de trabajo';
COMMENT ON COLUMN rrhh_mturno.imturno_id IS 'ID del turno (PK)';
COMMENT ON COLUMN rrhh_mturno.tt_descripcion IS 'Descripción del turno';
COMMENT ON COLUMN rrhh_mturno.it_estado IS 'Estado: 1=ACTIVO, 0=INACTIVO';

-- Verificar datos insertados
SELECT * FROM rrhh_mturno ORDER BY imturno_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
