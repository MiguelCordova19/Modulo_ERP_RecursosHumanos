-- =====================================================
-- Script: Crear tabla RRHH_MPUESTOS
-- Descripción: Tabla de puestos relacionada con grupos
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS rrhh_mpuestos CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_mpuestos (
    impuesto_id SERIAL PRIMARY KEY,
    tp_nombre VARCHAR(20) NOT NULL,
    tp_descripcion VARCHAR(100) NOT NULL,
    ip_estado INTEGER DEFAULT 1,
    ip_empresa INTEGER NOT NULL,
    ip_usuarioregistro BIGINT,
    fp_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_usuarioedito BIGINT,
    fp_fechaedito TIMESTAMP,
    ip_usuarioelimino BIGINT,
    fp_fechaelimino TIMESTAMP
);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_mpuestos IS 'Tabla de puestos de trabajo';
COMMENT ON COLUMN rrhh_mpuestos.impuesto_id IS 'ID autoincremental del puesto (PK)';

COMMENT ON COLUMN rrhh_mpuestos.tp_nombre IS 'Nombre del puesto (máx 20 caracteres)';
COMMENT ON COLUMN rrhh_mpuestos.tp_descripcion IS 'Descripción del puesto (máx 100 caracteres)';
COMMENT ON COLUMN rrhh_mpuestos.ip_estado IS 'Estado: 1=Activo, 0=Inactivo';
COMMENT ON COLUMN rrhh_mpuestos.ip_empresa IS 'ID de la empresa (FK)';
COMMENT ON COLUMN rrhh_mpuestos.ip_usuarioregistro IS 'ID del usuario que registró';
COMMENT ON COLUMN rrhh_mpuestos.fp_fecharegistro IS 'Fecha de registro';
COMMENT ON COLUMN rrhh_mpuestos.ip_usuarioedito IS 'ID del usuario que editó';
COMMENT ON COLUMN rrhh_mpuestos.fp_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN rrhh_mpuestos.ip_usuarioelimino IS 'ID del usuario que eliminó';
COMMENT ON COLUMN rrhh_mpuestos.fp_fechaelimino IS 'Fecha de eliminación';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_puestos_empresa ON rrhh_mpuestos(ip_empresa);
CREATE INDEX idx_puestos_estado ON rrhh_mpuestos(ip_estado);

CREATE INDEX idx_puestos_nombre ON rrhh_mpuestos(tp_nombre);

-- Constraint único: nombre + empresa (no puede haber nombres duplicados en la misma empresa)
CREATE UNIQUE INDEX idx_puestos_nombre_empresa ON rrhh_mpuestos(tp_nombre, ip_empresa) WHERE ip_estado = 1;

-- Verificar tabla creada
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_mpuestos'
ORDER BY ordinal_position;

-- Datos de ejemplo (opcional)
-- INSERT INTO rrhh_mpuestos (tp_nombre, tp_descripcion, ip_empresa, ip_usuarioregistro) VALUES
-- ('GERENTE', 'Gerente General', 1, 1),
-- ('ASISTENTE', 'Asistente Administrativo', 1, 1),
-- ('VENDEDOR', 'Vendedor de Campo', 1, 1);

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
