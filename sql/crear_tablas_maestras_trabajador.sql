-- =====================================================
-- Script: Crear tablas maestras para Trabajador
-- Descripción: Crea las tablas de Turno, Horario y Día Semana
-- Fecha: 2025-12-01
-- =====================================================

-- =====================================================
-- 1. TABLA TURNO
-- =====================================================
DROP TABLE IF EXISTS rrhh_mturno CASCADE;

CREATE TABLE IF NOT EXISTS rrhh_mturno (
    imturno_id VARCHAR(2) PRIMARY KEY,
    tt_descripcion VARCHAR(50) NOT NULL,
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1
);

INSERT INTO rrhh_mturno (imturno_id, tt_descripcion, it_estado) VALUES
('01', 'Mañana', 1),
('02', 'Tarde', 1),
('03', 'Noche', 1)
ON CONFLICT (imturno_id) DO NOTHING;

COMMENT ON TABLE rrhh_mturno IS 'Tabla maestra de turnos de trabajo';

-- =====================================================
-- 2. TABLA HORARIO
-- =====================================================
DROP TABLE IF EXISTS rrhh_mhorario CASCADE;

CREATE TABLE IF NOT EXISTS rrhh_mhorario (
    imhorario_id VARCHAR(2) PRIMARY KEY,
    th_descripcion VARCHAR(50) NOT NULL,
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1
);

INSERT INTO rrhh_mhorario (imhorario_id, th_descripcion, it_estado) VALUES
('01', 'FullTime', 1),
('02', 'PartTime', 1)
ON CONFLICT (imhorario_id) DO NOTHING;

COMMENT ON TABLE rrhh_mhorario IS 'Tabla maestra de horarios de trabajo';

-- =====================================================
-- 3. TABLA DÍA SEMANA
-- =====================================================
DROP TABLE IF EXISTS rrhh_mdiasemana CASCADE;

CREATE TABLE IF NOT EXISTS rrhh_mdiasemana (
    idiasemana_id VARCHAR(2) PRIMARY KEY,
    tds_descripcion VARCHAR(20) NOT NULL,
    tds_abreviatura VARCHAR(3) NOT NULL,
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_estado INTEGER DEFAULT 1
);

INSERT INTO rrhh_mdiasemana (idiasemana_id, tds_descripcion, tds_abreviatura, it_estado) VALUES
('01', 'Lunes', 'LUN', 1),
('02', 'Martes', 'MAR', 1),
('03', 'Miércoles', 'MIE', 1),
('04', 'Jueves', 'JUE', 1),
('05', 'Viernes', 'VIE', 1),
('06', 'Sábado', 'SAB', 1),
('07', 'Domingo', 'DOM', 1)
ON CONFLICT (idiasemana_id) DO NOTHING;

COMMENT ON TABLE rrhh_mdiasemana IS 'Tabla maestra de días de la semana';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
SELECT 'TURNOS' as tabla, COUNT(*) as registros FROM rrhh_mturno
UNION ALL
SELECT 'HORARIOS' as tabla, COUNT(*) as registros FROM rrhh_mhorario
UNION ALL
SELECT 'DÍAS SEMANA' as tabla, COUNT(*) as registros FROM rrhh_mdiasemana;

-- Ver datos
SELECT * FROM rrhh_mturno ORDER BY imturno_id;
SELECT * FROM rrhh_mhorario ORDER BY imhorario_id;
SELECT * FROM rrhh_mdiasemana ORDER BY idiasemana_id;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
