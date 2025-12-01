-- =====================================================
-- Script: Insertar datos RRHH_MTRIBUTOS - PARTE 5
-- Descripción: Continuación de tributos SUNAT (93-131)
-- Fecha: 2025-11-30
-- =====================================================

-- Insertar datos - PARTE 5 (Registros 93-131)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('93', '06', '0925', 'INGRESO DEL PESCADOR Y PROCESADOR ARTESANAL INDEPENDIENTE - BASE DE CALCULO APORTE ESSALUD - LEY 27177', 1),
('94', '07', '1001', 'OTROS CONCEPTOS 1', 1),
('95', '07', '1002', 'OTROS CONCEPTOS 2', 1),
('96', '07', '1003', 'OTROS CONCEPTOS 3', 1),
('97', '07', '1004', 'OTROS CONCEPTOS 4', 1),
('98', '07', '1005', 'OTROS CONCEPTOS 5', 1),
('99', '07', '1006', 'OTROS CONCEPTOS 6', 1),
('100', '07', '1007', 'OTROS CONCEPTOS 7', 1),
('101', '07', '1008', 'OTROS CONCEPTOS 8', 1),
('102', '07', '1009', 'OTROS CONCEPTOS 9', 1),
('103', '07', '1010', 'OTROS CONCEPTOS 10', 1),
('104', '07', '1011', 'OTROS CONCEPTOS 11', 1),
('105', '07', '1012', 'OTROS CONCEPTOS 12', 1),
('106', '07', '1013', 'OTROS CONCEPTOS 13', 1),
('107', '07', '1014', 'OTROS CONCEPTOS 14', 1),
('108', '07', '1015', 'OTROS CONCEPTOS 15', 1),
('109', '07', '1016', 'OTROS CONCEPTOS 16', 1),
('110', '07', '1017', 'OTROS CONCEPTOS 17', 1),
('111', '07', '1018', 'OTROS CONCEPTOS 18', 1),
('112', '07', '1019', 'OTROS CONCEPTOS 19', 1),
('113', '07', '1020', 'OTROS CONCEPTOS 20', 1),
('114', '08', '2001', 'REMUNERACION', 1),
('115', '08', '2002', 'SALARIO OBREROS', 1),
('116', '08', '2003', 'BONIFICACION PERSONAL - QUINQUENIO', 1),
('117', '08', '2004', 'BONIFICACION FAMILIAR', 1),
('118', '08', '2005', 'BONIFICACION DIFERENCIAL', 1),
('119', '08', '2006', 'AGUINALDOS', 1),
('120', '08', '2007', 'REMUNERACION VACACIONAL', 1),
('121', '08', '2008', 'ASIGNACION POR AÑOS DE SERVICIOS', 1),
('122', '08', '2009', 'BONIFICACION POR ESCOLARIDAD', 1),
('123', '08', '2010', 'COMPENSACION POR TIEMPO DE SERVICIOS', 1),
('124', '08', '2011', 'ALIMENTACION - CAFAE (3)', 1),
('125', '08', '2012', 'MOVILIDAD - CAFAE (3)', 1),
('126', '08', '2013', 'RACIONAMIENTO - CAFAE', 1),
('127', '08', '2014', 'INCENTIVOS LABORALES - CAFAE (3)', 1),
('128', '08', '2015', 'BONO JURISDICCIONAL/ BONO FISCAL', 1),
('129', '08', '2016', 'GASTOS OPERATIVOS DE MAGISTRADOS Y FISCALES', 1),
('130', '08', '2017', 'ASIGNACION POR SERVICIO EXTERIOR', 1),
('131', '08', '2018', 'BONIFICACION CONSULAR', 1);

-- Verificar datos insertados hasta ahora
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos WHERE imtributos_id BETWEEN '93' AND '131' ORDER BY imtributos_id;

-- =====================================================
-- FIN DE LA PARTE 5 (39 registros insertados)
-- Total acumulado: 131 registros
-- Esperar parte 6 para continuar...
-- =====================================================
