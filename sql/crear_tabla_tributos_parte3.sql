-- =====================================================
-- Script: Insertar datos RRHH_MTRIBUTOS - PARTE 3
-- Descripción: Continuación de tributos SUNAT (56-75)
-- Fecha: 2025-11-30
-- =====================================================

-- Insertar datos - PARTE 3 (Registros 56-75)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('56', '04', '0402', 'OTRAS GRATIFICACIONES ORDINARIAS', 1),
('57', '04', '0403', 'GRATIFICACIONES EXTRAORDINARIAS', 1),
('58', '04', '0404', 'AGUINALDOS DE JULIO Y DICIEMBRE', 1),
('59', '04', '0405', 'GRATIFICACIONES PROPORCIONAL', 1),
('60', '04', '0406', 'GRATIFICACIONES DE FIESTAS PATRIAS Y NAVIDAD - LEY 29351', 1),
('61', '04', '0407', 'GRATIFICACIONES PROPORCIONAL - LEY 29351', 1),
('62', '05', '0501', 'INDEMNIZACION POR DESPIDO INJUSTIFICADO U HOSTILIDAD', 1),
('63', '05', '0502', 'INDEMNIZACION POR MUERTE O INCAPACIDAD', 1),
('64', '05', '0503', 'INDEMNIZACION POR RESOLUCION DE CONTRATO SUJETO A MODALIDAD', 1),
('65', '05', '0504', 'INDEMNIZACION POR VACACIONES NO GOZADAS', 1),
('66', '05', '0505', 'INDEMNIZACION POR RETENCION INDEBIDA DE CTS ART. 52 D.S Nº 001-97-TR', 1),
('67', '05', '0506', 'INDEMNIZACION POR NO REINCORPORAR A UN TRABAJADOR CESADO EN UN PROCEDIMIENTO DE CESE COLECTIVO - DS 001-96-TR', 1),
('68', '05', '0507', 'INDEMNIZACION POR REALIZAR HORAS EXTRAS IMPUESTAS POR EL EMPLEADOR', 1),
('69', '06', '0901', 'BIENES DE LA PROPIA EMPRESA OTORGADOS PARA EL CONSUMO DEL TRABAJADOR', 1),
('70', '06', '0902', 'BONO DE PRODUCTIVIDAD', 1),
('71', '06', '0903', 'CANASTA DE NAVIDAD O SIMILARES', 1),
('72', '06', '0904', 'COMPENSACION POR TIEMPO DE SERVICIOS', 1),
('73', '06', '0905', 'GASTOS DE REPRESENTACION (MOVIL, VESTUARIO, VIATICOS Y SIMILARES) - LIBRE DISPONIBILIDAD', 1),
('74', '06', '0906', 'INCENTIVO POR CESE DEL TRABAJADOR (4)', 1),
('75', '06', '0907', 'LICENCIA CON GOCE DE HABER', 1);

-- Verificar datos insertados hasta ahora
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos WHERE imtributos_id BETWEEN '56' AND '75' ORDER BY imtributos_id;

-- =====================================================
-- FIN DE LA PARTE 3 (20 registros insertados)
-- Total acumulado: 75 registros
-- Esperar parte 4 para continuar...
-- =====================================================
