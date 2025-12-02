-- =====================================================
-- Script: Insertar datos en RRHH_MTIPO (PostgreSQL)
-- Descripción: Tipos de trabajador según SUNAT
-- Fecha: 2025-11-06
-- =====================================================

INSERT INTO rrhh_mtipo (imtipo_id, tt_codsunat, tt_descripcion) VALUES
(1, '19', 'EJECUTIVO'),
(2, '20', 'OBRERO'),
(3, '21', 'EMPLEADO'),
(4, '22', 'TRAB.PORTUARIO'),
(5, '23', 'PRACT. SENATI'),
(6, '27', 'CONSTRUCCION CIVIL'),
(7, '28', 'PILOTO Y COPIL DE AVIA. COM.'),
(8, '29', 'MARIT. FLUVIAL O LACUSTRE'),
(9, '30', 'PERIODISTA'),
(10, '31', 'TRAB. DE LA IND. DE CUERO'),
(11, '32', 'MINERO DE SOCAVON'),
(12, '36', 'PESCADOR - LEY 28320'),
(13, '37', 'MINERO DE TAJO ABIERTO'),
(14, '38', 'MINERO IND. MINERA METAL'),
(15, '56', 'ARTISTA - LEY 28131'),
(16, '64', 'AGRARIO DEPEND. - LEY 27360'),
(17, '65', 'TRAB. ACTIV.ACUICOLA LEY 27460'),
(18, '67', 'REG. ESPECIAL D. LEG.1057 - CAS'),
(19, '82', 'FUNCIONARIO PUBLICO'),
(20, '83', 'EMPLEADO DE CONFIANZA'),
(21, '84', 'SERVIDOR PUB - DIRECT SUPERIOR'),
(22, '85', 'SERVIDOR PUB - EJECUTIVO'),
(23, '86', 'SERVIDOR PUB - ESPECIALISTA'),
(24, '87', 'SERVIDOR PUB - DE APOYO'),
(25, '90', 'GERENTES PUB - D.LEG 1024'),
(26, '91', 'MIIEMBROS DE OTROS REG. ESPEC S.PUBLICO'),
(27, '98', 'CUARTA - QUINTA CATEGORIA');

-- Reiniciar la secuencia del ID
SELECT setval('rrhh_mtipo_imtipo_id_seq', (SELECT MAX(imtipo_id) FROM rrhh_mtipo));

-- Mostrar los datos insertados
SELECT 
    imtipo_id AS "ID",
    tt_codsunat AS "Código SUNAT",
    tt_descripcion AS "Descripción"
FROM rrhh_mtipo
ORDER BY imtipo_id;

DO $$
BEGIN
    RAISE NOTICE '27 tipos de trabajador insertados exitosamente';
END $$;
