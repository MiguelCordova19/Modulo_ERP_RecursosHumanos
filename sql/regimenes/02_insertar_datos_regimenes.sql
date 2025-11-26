-- =====================================================
-- Script: Insertar datos en rrhh_mregimenpensionario
-- Descripción: Datos de regímenes pensionarios según SUNAT
-- Fecha: 2025-11-25
-- =====================================================

-- Insertar regímenes pensionarios
INSERT INTO rrhh_mregimenpensionario (imregimenpensionario_id, trp_codsunat, trp_descripcion, trp_abreviatura) VALUES
(1, '02', 'DECRETO LEY 1990 - SISTEMA NACIONAL DE PENSIONES - ONP', 'ONP'),
(2, '21', 'SPP INTEGRA', 'INTEGRA'),
(3, '22', 'SPP HORIZONTE', 'HORIZONTE'),
(4, '23', 'SPP PROFUTURO', 'PROFUTURO'),
(5, '24', 'SPP PRIMA', 'PRIMA');

-- Reiniciar secuencia
SELECT setval('rrhh_mregimenpensionario_imregimenpensionario_id_seq', 
    (SELECT MAX(imregimenpensionario_id) FROM rrhh_mregimenpensionario));

-- Mensaje de confirmación
DO $$
DECLARE
    total_registros INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_registros FROM rrhh_mregimenpensionario;
    RAISE NOTICE 'Se insertaron % regímenes pensionarios exitosamente', total_registros;
END $$;
