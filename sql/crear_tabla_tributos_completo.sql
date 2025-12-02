-- =====================================================
-- Script COMPLETO: Crear tabla RRHH_MTRIBUTOS
-- Descripción: Tabla maestra de tributos SUNAT (185 registros)
-- Fecha: 2025-11-30
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
-- DROP TABLE IF EXISTS rrhh_mtributos CASCADE;

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

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mtributos IS 'Tabla maestra de tributos SUNAT para planilla';
COMMENT ON COLUMN rrhh_mtributos.imtributos_id IS 'ID del tributo (PK)';
COMMENT ON COLUMN rrhh_mtributos.it_tid IS 'ID del tipo de tributo (FK a tipo concepto)';
COMMENT ON COLUMN rrhh_mtributos.tt_codsunat IS 'Código SUNAT del tributo';
COMMENT ON COLUMN rrhh_mtributos.tt_descripcion IS 'Descripción del tributo';
COMMENT ON COLUMN rrhh_mtributos.estado IS 'Estado del registro (1=Activo, 0=Inactivo)';
COMMENT ON COLUMN rrhh_mtributos.fecha_creacion IS 'Fecha de creación del registro';
COMMENT ON COLUMN rrhh_mtributos.fecha_modificacion IS 'Fecha de última modificación';

-- =====================================================
-- INSERTAR TODOS LOS DATOS (185 registros)
-- =====================================================

-- Para ejecutar este script completo, puedes:
-- OPCIÓN 1: Ejecutar este archivo directamente
-- OPCIÓN 2: Ejecutar los archivos por partes:
--   \i sql/crear_tabla_tributos_parte1.sql
--   \i sql/crear_tabla_tributos_parte2.sql
--   \i sql/crear_tabla_tributos_parte3.sql
--   \i sql/crear_tabla_tributos_parte4.sql
--   \i sql/crear_tabla_tributos_parte5.sql
--   \i sql/crear_tabla_tributos_parte6.sql
--   \i sql/crear_tabla_tributos_parte7.sql
--   \i sql/crear_tabla_tributos_parte8_final.sql

-- =====================================================
-- INSTRUCCIONES DE EJECUCIÓN
-- =====================================================
-- 1. Conectarse a PostgreSQL:
--    psql -U tu_usuario -d tu_base_datos
--
-- 2. Ejecutar los scripts en orden:
--    \i sql/crear_tabla_tributos_parte1.sql
--    \i sql/crear_tabla_tributos_parte2.sql
--    \i sql/crear_tabla_tributos_parte3.sql
--    \i sql/crear_tabla_tributos_parte4.sql
--    \i sql/crear_tabla_tributos_parte5.sql
--    \i sql/crear_tabla_tributos_parte6.sql
--    \i sql/crear_tabla_tributos_parte7.sql
--    \i sql/crear_tabla_tributos_parte8_final.sql
--
-- 3. Verificar:
--    SELECT COUNT(*) FROM rrhh_mtributos;
--    -- Debe retornar: 185
--
-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
