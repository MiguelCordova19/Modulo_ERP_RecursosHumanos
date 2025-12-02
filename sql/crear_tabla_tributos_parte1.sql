-- =====================================================
-- Script: Crear tabla RRHH_MTRIBUTOS - PARTE 1
-- Descripción: Tabla maestra de tributos SUNAT
-- Fecha: 2025-11-30
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_mtributos CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mtributos (
    imtributos_id VARCHAR(3) PRIMARY KEY,
    it_tid VARCHAR(2) NOT NULL,
    tt_codsunat VARCHAR(10) NOT NULL,
    tt_descripcion VARCHAR(200) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos - PARTE 1 (Registros 01-26)
INSERT INTO rrhh_mtributos (imtributos_id, it_tid, tt_codsunat, tt_descripcion, estado) VALUES
('01', '01', '0101', 'ALIMENTACION PRINCIPAL EN DINERO', 1),
('02', '01', '0102', 'ALIMENTACION PRINCIPAL EN ESPECIE', 1),
('03', '01', '0103', 'COMISIONES O DESTAJO', 1),
('04', '01', '0104', 'COMISIONES EVENTUALES A TRABAJADORES', 1),
('05', '01', '0105', 'TRABAJO EN SOBRETIEMPO (HORAS EXTRAS) 25%', 1),
('06', '01', '0106', 'TRABAJO EN SOBRETIEMPO (HORAS EXTRAS) 35%', 1),
('07', '01', '0107', 'TRABAJO EN DIA FERIADO O DIA DE DESCANSO', 1),
('08', '01', '0108', 'INCREMENTO EN SNP 3.3%', 1),
('09', '01', '0109', 'INCREMENTO POR AFILIACION A AFP 10.23%', 1),
('10', '01', '0110', 'INCREMENTO POR AFILIACION A AFP 3.00%', 1),
('11', '01', '0111', 'PREMIOS POR VENTAS', 1),
('12', '01', '0112', 'PRESTACIONES ALIMENTARIAS - SUMINISTROS DIRECTOS', 1),
('13', '01', '0113', 'PRESTACIONES ALIMENTARIAS - SUMINISTROS INDIRECTOS', 1),
('14', '01', '0114', 'VACACIONES TRUNCAS', 1),
('15', '01', '0115', 'REMUNERACION DIA DE DESCANSO Y FERIADOS (INCLUIDA LA DEL 1 DE MAYO)', 1),
('16', '01', '0116', 'REMUNERACION EN ESPECIE', 1),
('17', '01', '0117', 'COMPENSACION VACACIONAL', 1),
('18', '01', '0118', 'REMUNERACION VACACIONAL', 1),
('19', '01', '0119', 'REMUNERACIONES DEVENGADAS', 1),
('20', '01', '0120', 'SUBVENCION ECONOMICA MENSUAL (PRACTICANTE SENATI)', 1),
('21', '01', '0121', 'REMUNERACION O JORNAL BASICO', 1),
('22', '01', '0122', 'REMUNERACION PERMANENTE', 1),
('23', '01', '0123', 'REMUNERACION DE LOS SOCIOS DE COOPERATIVAS', 1),
('24', '01', '0124', 'REMUNERACION POR LA HORA DE PERMISO POR LACTANCIA', 1),
('25', '01', '0125', 'REMUNERACION INTEGRAL ANUAL - CUOTA', 1),
('26', '01', '0126', 'INGRESOS DEL CONDUCTOR DE LA MICROEMPRESA AFILIADO AL SIS', 1);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mtributos IS 'Tabla maestra de tributos SUNAT para planilla';
COMMENT ON COLUMN rrhh_mtributos.imtributos_id IS 'ID del tributo (PK)';
COMMENT ON COLUMN rrhh_mtributos.it_tid IS 'ID del tipo de tributo (FK a tipo concepto)';
COMMENT ON COLUMN rrhh_mtributos.tt_codsunat IS 'Código SUNAT del tributo';
COMMENT ON COLUMN rrhh_mtributos.tt_descripcion IS 'Descripción del tributo';
COMMENT ON COLUMN rrhh_mtributos.estado IS 'Estado del registro (1=Activo, 0=Inactivo)';
COMMENT ON COLUMN rrhh_mtributos.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mtributos.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT COUNT(*) as total_registros FROM rrhh_mtributos;
SELECT * FROM rrhh_mtributos ORDER BY imtributos_id;

-- =====================================================
-- FIN DE LA PARTE 1 (26 registros insertados)
-- Esperar parte 2 para continuar...
-- =====================================================
