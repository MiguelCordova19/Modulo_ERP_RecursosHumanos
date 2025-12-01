-- =====================================================
-- Script: Insertar datos RRHH_MTRIBUTOS - PARTE 8 FINAL
-- Descripción: Últimos tributos SUNAT (170-185)
-- Fecha: 2025-11-30
-- =====================================================

-- Insertar datos - PARTE 8 FINAL (Registros 170-185)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('170', '10', '0703', 'DESCUENTO AUTORIZADO U ORDENADO POR MANDATO JUDICIAL', 1),
('171', '10', '0704', 'TARDANZAS', 1),
('172', '10', '0705', 'INASISTENCIAS', 1),
('173', '10', '0706', 'OTROS DESCUENTOS NO DEDUCIBLES DE LA BASE IMPONIBLE', 1),
('174', '10', '0707', 'OTROS DESCUENTOS DEDUCIBLES DE LA BASE IMPONIBLE', 1),
('175', '11', '0801', 'SISTEMA PRIVADO DE PENSIONES - APORTACION VOLUNTARIA', 1),
('176', '11', '0802', 'FONDO DE DERECHOS SOCIALES DEL ARTISTA', 1),
('177', '11', '0803', 'POLIZA DE SEGURO - D. LEG. 688', 1),
('178', '11', '0804', 'ESSALUD (SEGURO REGULAR, CBBSP, AGRARIO/ACUICULTOR) - TRABAJADOR', 1),
('179', '11', '0805', 'PENSIONES - SEGURO COMPLEMENTARIO DE TRABAJO DE RIESGO', 1),
('180', '11', '0806', 'ESSALUD - SEGURO COMPLEMENTARIO DE TRABAJO DE RIESGO', 1),
('181', '11', '0807', 'SENATI', 1),
('182', '11', '0808', 'IMPUESTO EXTRAORDINARIO DE SOLIDARIDAD', 1),
('183', '11', '0809', 'OTRAS APORTACIONES DE CARGO DEL EMPLEADOR', 1),
('184', '11', '0810', 'EPS - SEGURO COMPLEMENTARIO DE TRABAJO DE RIESGO', 1),
('185', '11', '0811', 'SEGURO INTEGRAL DE SALUD - SIS', 1);

-- Verificar datos insertados hasta ahora
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos WHERE imtributos_id BETWEEN '170' AND '185' ORDER BY imtributos_id;

-- Verificar todos los registros por tipo
SELECT it_tid, COUNT(*) as cantidad 
FROM rrhh_mtributos 
GROUP BY it_tid 
ORDER BY it_tid;

-- =====================================================
-- FIN DE LA PARTE 8 - TABLA COMPLETA
-- Total final: 185 registros
-- =====================================================

-- Resumen de registros por tipo:
-- Tipo 01: Ingresos (27 registros)
-- Tipo 02: Asignaciones (15 registros)
-- Tipo 03: Bonificaciones (13 registros)
-- Tipo 04: Gratificaciones (7 registros)
-- Tipo 05: Indemnizaciones (7 registros)
-- Tipo 06: Otros ingresos (28 registros)
-- Tipo 07: Otros conceptos (20 registros)
-- Tipo 08: Sector público (41 registros)
-- Tipo 09: Descuentos trabajador (13 registros)
-- Tipo 10: Otros descuentos (7 registros)
-- Tipo 11: Aportaciones empleador (11 registros)
-- TOTAL: 185 registros
