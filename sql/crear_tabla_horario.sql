-- =====================================================
-- Script: Crear tabla RRHH_MHORARIO
-- Descripción: Tabla maestra de horarios
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_mhorario CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mhorario (
    imhorario_id VARCHAR(2) PRIMARY KEY,
    th_descripcion VARCHAR(50) NOT NULL,
    
    -- Auditoría
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1 -- 1=ACTIVO, 0=INACTIVO
);

-- Insertar datos iniciales
INSERT INTO rrhh_mhorario (imhorario_id, th_descripcion, it_estado) VALUES
('01', 'FullTime', 1),
('02', 'PartTime', 1)
ON CONFLICT (imhorario_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mhorario IS 'Tabla maestra de horarios de trabajo';
COMMENT ON COLUMN rrhh_mhorario.imhorario_id IS 'ID del horario (PK)';
COMMENT ON COLUMN rrhh_mhorario.th_descripcion IS 'Descripción del horario';
COMMENT ON COLUMN rrhh_mhorario.it_estado IS 'Estado: 1=ACTIVO, 0=INACTIVO';

-- Verificar datos insertados
SELECT * FROM rrhh_mhorario ORDER BY imhorario_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
