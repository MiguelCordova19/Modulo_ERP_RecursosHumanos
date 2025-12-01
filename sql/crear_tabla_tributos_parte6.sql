-- =====================================================
-- Script: Insertar datos RRHH_MTRIBUTOS - PARTE 6
-- Descripción: Continuación de tributos SUNAT (132-149)
-- Fecha: 2025-11-30
-- =====================================================

-- Insertar datos - PARTE 6 (Registros 132-149)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('132', '08', '2019', 'ASIGNACION ESPECIAL PARA DOCENTES UNIVERSITARIOS', 1),
('133', '08', '2020', 'HOMOLOGACION DE DOCENTES UNIVERSITARIOS', 1),
('134', '08', '2021', 'ASIGNACION ESPECIAL POR LABOR PEDAGOGICA EFECTIVA', 1),
('135', '08', '2022', 'ASIGNACION EXTRAORDINARIA POR TRABAJO ASISTENCIAL', 1),
('136', '08', '2023', 'SERVICIOS EXTRAORDINARIOS PNP', 1),
('137', '08', '2024', 'ASIGNACIONES FFAA Y PNP', 1),
('138', '08', '2025', 'COMBUSTIBLE FFAA Y PNP', 1),
('139', '08', '2026', 'OTROS INGRESOS REMUNERATIVOS PERSONAL ADMINISTRATIVO', 1),
('140', '08', '2027', 'OTROS INGRESOS NO REMUNERATIVOS PERSONAL ADMINISTRATIVO', 1),
('141', '08', '2028', 'OTROS INGRESOS REMUNERATIVOS MAGISTRADOS', 1),
('142', '08', '2029', 'OTROS INGRESOS NO REMUNERATIVOS MAGISTRADOS', 1),
('143', '08', '2030', 'OTROS INGRESOS REMUNERATIVOS DOCENTES UNIVERSITARIOS', 1),
('144', '08', '2031', 'OTROS INGRESOS NO REMUNERATIVOS DOCENTES UNIVERSITARIOS', 1),
('145', '08', '2032', 'OTROS INGRESOS REMUNERATIVOS PROFESORADO', 1),
('146', '08', '2033', 'OTROS INGRESOS NO REMUNERATIVOS PROFESORADO', 1),
('147', '08', '2034', 'OTROS INGRESOS REMUNERATIVOS PROFESIONALES DE LA SALUD', 1),
('148', '08', '2035', 'OTROS INGRESOS NO REMUNERATIVOS PROFESIONALES DE LA SALUD', 1),
('149', '08', '2036', 'OTROS INGRESOS REMUNERATIVOS FFAA Y PNP', 1);

-- Verificar datos insertados hasta ahora
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos WHERE imtributos_id BETWEEN '132' AND '149' ORDER BY imtributos_id;

-- =====================================================
-- FIN DE LA PARTE 6 (18 registros insertados)
-- Total acumulado: 149 registros
-- Esperar parte 7 para continuar...
-- =====================================================
