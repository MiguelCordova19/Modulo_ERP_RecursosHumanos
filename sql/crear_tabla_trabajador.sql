-- =====================================================
-- Script: Crear tabla RRHH_TRABAJADOR
-- Descripción: Tabla principal de trabajadores
-- Fecha: 2025-12-01
-- =====================================================

-- Eliminar tabla si existe (opcional, comentar si no quieres eliminar)
DROP TABLE IF EXISTS rrhh_trabajador CASCADE;

-- Crear tabla
CREATE TABLE IF NOT EXISTS rrhh_trabajador (
    itrabajador_id BIGSERIAL PRIMARY KEY,
    
    -- Datos Personales
    it_en VARCHAR(2) NOT NULL DEFAULT '01', -- FK a rrhh_mpr (01=PLANILLA, 02=RRHH)
    it_tipodoc VARCHAR(2) NOT NULL, -- FK a rrhh_mtipodocumento
    tt_nrodoc VARCHAR(20) NOT NULL,
    tt_apellidopaterno VARCHAR(50) NOT NULL,
    tt_apellidomaterno VARCHAR(50) NOT NULL,
    tt_nombres VARCHAR(50) NOT NULL,
    tt_nrocelular VARCHAR(20),
    tt_correo VARCHAR(50),
    ft_fechanacimiento DATE,
    it_genero VARCHAR(2), -- FK a rrhh_mgenero
    it_estadocivil VARCHAR(2), -- FK a rrhh_mestadocivil
    it_regimenlaboral VARCHAR(2), -- FK a rrhh_regimenlaboral
    
    -- Datos Laborales
    ft_fechaingreso DATE,
    it_empresa INTEGER NOT NULL, -- FK a rrhh_mempresa
    it_sede INTEGER, -- FK a rrhh_msede
    it_puesto INTEGER, -- FK a rrhh_mpuestos
    it_turno INTEGER, -- FK a rrhh_mturno (si existe)
    it_horario INTEGER, -- FK a rrhh_mhorario (si existe)
    it_diadescanso INTEGER, -- Día de la semana (1=Lunes, 7=Domingo)
    tt_horaentrada TIME,
    tt_horasalida TIME,
    
    -- Datos de Pensión
    it_regimenpensionario VARCHAR(2), -- FK a rrhh_mregimenpensionario (si existe)
    tt_cuspp VARCHAR(20), -- Código CUSPP para AFP
    
    -- Remuneración
    it_tipopago VARCHAR(2), -- FK a rrhh_mtipopago
    it_bancorem VARCHAR(2), -- FK a rrhh_mbanco
    tt_nrocuentarem VARCHAR(50),
    it_tipocuenta VARCHAR(2), -- FK a rrhh_mtipocuenta
    
    -- CTS
    it_bancocts VARCHAR(2), -- FK a rrhh_mbanco
    tt_nrocuentacts VARCHAR(50),
    
    -- Control de Estado
    it_estado INTEGER DEFAULT 1, -- 1=ACTIVO, 2=BAJA, 3=SUSPENDIDO
    ft_fechacese DATE,
    
    -- Auditoría
    it_usuariocreo BIGINT,
    ft_fechacreo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    it_usuarioedito BIGINT,
    ft_fechaedito TIMESTAMP,
    it_usuarioelimino BIGINT,
    ft_fechaelimino TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uk_trabajador_doc UNIQUE (it_tipodoc, tt_nrodoc, it_empresa)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_trabajador_empresa ON rrhh_trabajador(it_empresa);
CREATE INDEX IF NOT EXISTS idx_trabajador_sede ON rrhh_trabajador(it_sede);
CREATE INDEX IF NOT EXISTS idx_trabajador_estado ON rrhh_trabajador(it_estado);
CREATE INDEX IF NOT EXISTS idx_trabajador_nrodoc ON rrhh_trabajador(tt_nrodoc);
CREATE INDEX IF NOT EXISTS idx_trabajador_nombres ON rrhh_trabajador(tt_nombres, tt_apellidopaterno, tt_apellidomaterno);

-- Comentarios en la tabla
COMMENT ON TABLE rrhh_trabajador IS 'Tabla principal de trabajadores';
COMMENT ON COLUMN rrhh_trabajador.itrabajador_id IS 'ID del trabajador (PK)';
COMMENT ON COLUMN rrhh_trabajador.it_en IS 'Tipo de trabajador (FK a rrhh_mpr)';
COMMENT ON COLUMN rrhh_trabajador.it_tipodoc IS 'Tipo de documento (FK)';
COMMENT ON COLUMN rrhh_trabajador.tt_nrodoc IS 'Número de documento';
COMMENT ON COLUMN rrhh_trabajador.tt_apellidopaterno IS 'Apellido paterno';
COMMENT ON COLUMN rrhh_trabajador.tt_apellidomaterno IS 'Apellido materno';
COMMENT ON COLUMN rrhh_trabajador.tt_nombres IS 'Nombres';
COMMENT ON COLUMN rrhh_trabajador.tt_nrocelular IS 'Número de celular';
COMMENT ON COLUMN rrhh_trabajador.tt_correo IS 'Correo electrónico';
COMMENT ON COLUMN rrhh_trabajador.ft_fechanacimiento IS 'Fecha de nacimiento';
COMMENT ON COLUMN rrhh_trabajador.it_genero IS 'Género (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_estadocivil IS 'Estado civil (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_regimenlaboral IS 'Régimen laboral (FK)';
COMMENT ON COLUMN rrhh_trabajador.ft_fechaingreso IS 'Fecha de ingreso laboral';
COMMENT ON COLUMN rrhh_trabajador.it_empresa IS 'Empresa (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_sede IS 'Sede (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_puesto IS 'Puesto (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_turno IS 'Turno (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_horario IS 'Horario (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_diadescanso IS 'Día de descanso (1-7)';
COMMENT ON COLUMN rrhh_trabajador.tt_horaentrada IS 'Hora de entrada';
COMMENT ON COLUMN rrhh_trabajador.tt_horasalida IS 'Hora de salida';
COMMENT ON COLUMN rrhh_trabajador.it_regimenpensionario IS 'Régimen pensionario (FK)';
COMMENT ON COLUMN rrhh_trabajador.tt_cuspp IS 'Código CUSPP (AFP)';
COMMENT ON COLUMN rrhh_trabajador.it_tipopago IS 'Tipo de pago (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_bancorem IS 'Banco remuneración (FK)';
COMMENT ON COLUMN rrhh_trabajador.tt_nrocuentarem IS 'Número de cuenta remuneración';
COMMENT ON COLUMN rrhh_trabajador.it_tipocuenta IS 'Tipo de cuenta (FK)';
COMMENT ON COLUMN rrhh_trabajador.it_bancocts IS 'Banco CTS (FK)';
COMMENT ON COLUMN rrhh_trabajador.tt_nrocuentacts IS 'Número de cuenta CTS';
COMMENT ON COLUMN rrhh_trabajador.it_estado IS 'Estado: 1=ACTIVO, 2=BAJA, 3=SUSPENDIDO';
COMMENT ON COLUMN rrhh_trabajador.ft_fechacese IS 'Fecha de cese';
COMMENT ON COLUMN rrhh_trabajador.it_usuariocreo IS 'Usuario que creó el registro';
COMMENT ON COLUMN rrhh_trabajador.ft_fechacreo IS 'Fecha de creación';
COMMENT ON COLUMN rrhh_trabajador.it_usuarioedito IS 'Usuario que editó el registro';
COMMENT ON COLUMN rrhh_trabajador.ft_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN rrhh_trabajador.it_usuarioelimino IS 'Usuario que eliminó el registro';
COMMENT ON COLUMN rrhh_trabajador.ft_fechaelimino IS 'Fecha de eliminación';

-- Verificar estructura de la tabla
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'rrhh_trabajador' 
ORDER BY ordinal_position;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
