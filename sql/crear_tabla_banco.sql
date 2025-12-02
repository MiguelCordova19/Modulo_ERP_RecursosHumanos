-- =====================================================
-- Script: Crear tabla RRHH_MBANCO
-- Descripción: Tabla de bancos del Perú
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_mbanco CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mbanco (
    imbanco_id VARCHAR(2) PRIMARY KEY,
    tb_codigo VARCHAR(10) NOT NULL,
    tb_descripcion VARCHAR(100) NOT NULL,
    estado INTEGER DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos - PARTE 1
INSERT INTO rrhh_mbanco (imbanco_id, tb_codigo, tb_descripcion, estado) VALUES
('01', '002', 'BANCO DE CREDITO DEL PERU', 1),
('02', '003', 'INTERBANK', 1),
('03', '007', 'CITIBANK DEL PERU', 1),
('04', '009', 'SCOTIABANK PERU', 1),
('05', '011', 'BBVA BANCO CONTINENTAL', 1),
('06', '018', 'BANCO DE LA NACION', 1),
('07', '020', 'BANCO FALABELLA', 1),
('08', '023', 'BANCO DE COMERCIO', 1),
('09', '035', 'BANCO FINANCIERO DEL PERU', 1),
('10', '038', 'BANCO INTERAMERICANO DE FINANZAS', 1),
('11', '043', 'CREDISCOTIA FINANCIERA', 1),
('12', '053', 'BANGO GNB', 1),
('13', '056', 'SANTANDER', 1),
('14', '057', 'BANCO AZTECA', 1),
('15', '058', 'BANCO CENCOSUD', 1),
('16', '059', 'BANCO RIPLEY', 1),
('17', '060', 'ICBC PERU BANK', 1),
('18', '070', 'MIBANCO', 1),
('19', '200', 'FINANC. CREDINKA', 1),
('20', '202', 'FINANC. PROEMPRESA', 1),
('21', '204', 'FINANC. CONFIANZA', 1),
('22', '206', 'CREDIRAIZ', 1),
('23', '208', 'COMPARTAMOS FINANCIERA', 1),
('24', '210', 'FINANCIERA QAPAQ', 1),
('25', '212', 'FINANCIERA TFC S A', 1),
('26', '214', 'FINANCIERA EFECTIVA', 1),
('27', '218', 'FINANCIERA OH!', 1),
('28', '800', 'CAJA METROPOLITANA DE LIMA', 1),
('29', '802', 'CMAC TRUJILLO', 1),
('30', '803', 'CMAC AREQUIPA', 1),
('31', '805', 'CMAC SULLANA', 1),
('32', '806', 'CMAC CUSCO', 1),
('33', '808', 'CMAC HUANCAYO', 1),
('34', '813', 'CMAC TACNA', 1),
('35', '820', 'CMAC DEL SANTA', 1),
('36', '822', 'CMAC ICA', 1),
('37', '824', 'CMAC PIURA', 1),
('38', '826', 'CMAC MAYNAS', 1),
('39', '828', 'CMAC PAITA', 1),
('40', '900', 'CRAC SIPAN', 1),
('41', '902', 'CRAC DEL CENTRO', 1),
('42', '904', 'CRAC INCASUR', 1),
('43', '906', 'CRAC PRYMERA', 1),
('44', '908', 'CRAC LOS ANDES', 1)
ON CONFLICT (imbanco_id) DO NOTHING;

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mbanco IS 'Tabla de bancos del Perú';
COMMENT ON COLUMN rrhh_mbanco.imbanco_id IS 'ID del banco (PK)';
COMMENT ON COLUMN rrhh_mbanco.tb_codigo IS 'Código del banco';
COMMENT ON COLUMN rrhh_mbanco.tb_descripcion IS 'Descripción/Nombre del banco';
COMMENT ON COLUMN rrhh_mbanco.estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mbanco.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mbanco.fecha_modificacion IS 'Fecha de última modificación';

-- Verificar datos insertados
SELECT * FROM rrhh_mbanco ORDER BY imbanco_id;

-- =====================================================
-- FIN DEL SCRIPT - COMPLETO (44 bancos)
-- =====================================================
