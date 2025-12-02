-- =====================================================
-- Script: Insertar datos RRHH_MTRIBUTOS - PARTE 4
-- Descripción: Continuación de tributos SUNAT (76-92)
-- Fecha: 2025-11-30
-- =====================================================

-- Insertar datos - PARTE 4 (Registros 76-92)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('76', '06', '0908', 'MOVILIDAD DE LIBRE DISPOSICION', 1),
('77', '06', '0909', 'MOVILIDAD SUPEDITADA A ASISTENCIA Y QUE CUBRE SOLO EL TRASLADO', 1),
('78', '06', '0910', 'PARTICIPACION EN LAS UTILIDADES - PAGADAS ANTES DE LA DECLARACION ANUAL DEL IMPUESTO A LA RENTA', 1),
('79', '06', '0911', 'PARTICIPACION EN LAS UTILIDADES - PAGADAS DESPUES DE LA DECLARACION ANUAL DEL IMPUESTO A LA RENTA', 1),
('80', '06', '0912', 'PENSIONES DE JUBILACION O CESANTIA, MONTEPIO O INVALIDEZ', 1),
('81', '06', '0913', 'RECARGO AL CONSUMO', 1),
('82', '06', '0914', 'REFRIGERIO QUE NO ES ALIMENTACION PRINCIPAL', 1),
('83', '06', '0915', 'SUBSIDIOS POR MATERNIDAD', 1),
('84', '06', '0916', 'SUBSIDIOS DE INCAPACIDAD POR ENFERMEDAD', 1),
('85', '06', '0917', 'CONDICIONES DE TRABAJO', 1),
('86', '06', '0918', 'IMPUESTO A LA RENTA DE QUINTA CATEGORIA ASUMIDO', 1),
('87', '06', '0919', 'SISTEMA NACIONAL DE PENSIONES ASUMIDO', 1),
('88', '06', '0920', 'SISTEMA PRIVADO DE PENSIONES ASUMIDO', 1),
('89', '06', '0921', 'PENSIONES DE JUBILACION O CESANTIA, MONTEPIO O INVALIDEZ PENDIENTES POR LIQUIDAR', 1),
('90', '06', '0922', 'SUMAS O BIENES QUE NO SON DE LIBRE DISPOSICION', 1),
('91', '06', '0923', 'INGRESOS DE CUARTA CATEGORIA QUE SON CONSIDERADOS DE QUINTA CATEGORIA', 1),
('92', '06', '0924', 'INGRESOS CUARTA-QUINTA SIN RELACION DE DEPENDENCIA', 1);

-- Verificar datos insertados hasta ahora
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos WHERE imtributos_id BETWEEN '76' AND '92' ORDER BY imtributos_id;

-- =====================================================
-- FIN DE LA PARTE 4 (17 registros insertados)
-- Total acumulado: 92 registros
-- Esperar parte 5 para continuar...
-- =====================================================
