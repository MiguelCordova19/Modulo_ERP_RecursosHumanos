-- =====================================================
-- Script: Insertar datos RRHH_MTRIBUTOS - PARTE 7
-- Descripción: Continuación de tributos SUNAT (150-169)
-- Fecha: 2025-11-30
-- =====================================================

-- Insertar datos - PARTE 7 (Registros 150-169)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('150', '08', '2037', 'OTROS INGRESOS NO REMUNERATIVOS FFAA Y PNP', 1),
('151', '08', '2038', 'ASIGNACION ESPECIAL - D.U. 126-2001', 1),
('152', '08', '2039', 'INGRESOS D.LEG. 1057 - CAS', 1),
('153', '08', '2040', 'REMUNERACION POR DIAS CON RELACION LABORAL EN EL PERIODO DE UN CAS', 1),
('154', '08', '2041', 'AGUINALDOS DE JULIO Y DICIEMBRE - LEY 29351', 1),
('155', '09', '0601', 'SISTEMA PRIVADO DE PENSIONES - COMISION PORCENTUAL', 1),
('156', '09', '0602', 'CONAFOVICER', 1),
('157', '09', '0603', 'CONTRIBUCION SOLIDARIA PARA LA ASISTENCIA PREVISIONAL', 1),
('158', '09', '0604', 'ESSALUD +VIDA', 1),
('159', '09', '0605', 'RENTA QUINTA CATEGORIA RETENCIONES', 1),
('160', '09', '0606', 'SISTEMA PRIVADO DE PENSIONES - PRIMA DE SEGURO', 1),
('161', '09', '0607', 'SISTEMA NACIONAL DE PENSIONES - D.L 19990', 1),
('162', '09', '0608', 'SISTEMA PRIVADO DE PENSIONES - APORTACION OBLIGATORIA', 1),
('163', '09', '0609', 'SISTEMA PRIVADO DE PENSIONES - APORTACION VOLUNTARIA', 1),
('164', '09', '0610', 'ESSALUD - SEGURO REGULAR - PENSIONISTA', 1),
('165', '09', '0611', 'OTROS APORTACIONES DEL TRABAJADOR / PENSIONISTA', 1),
('166', '09', '0612', 'SISTEMA NACIONAL DE PENSIONES - ASEGURA TU PENSION', 1),
('167', '09', '0613', 'REGIMEN PENSIONARIO - D.L. 20530', 1),
('168', '10', '0701', 'ADELANTO', 1),
('169', '10', '0702', 'CUOTA SINDICAL', 1);

-- Verificar datos insertados hasta ahora
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos WHERE imtributos_id BETWEEN '150' AND '169' ORDER BY imtributos_id;

-- =====================================================
-- FIN DE LA PARTE 7 (20 registros insertados)
-- Total acumulado: 169 registros
-- Esperar parte 8 para continuar...
-- =====================================================
