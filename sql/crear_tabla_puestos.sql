-- =====================================================
-- TABLA: RRHH_MPUESTOS (Puestos/Cargos)
-- Descripción: Tabla maestra de puestos o cargos laborales
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS public.rrhh_mpuestos CASCADE;

-- Crear secuencia para el ID
CREATE SEQUENCE IF NOT EXISTS public.rrhh_mpuestos_impuesto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Crear tabla
CREATE TABLE public.rrhh_mpuestos (
    impuesto_id INTEGER DEFAULT nextval('public.rrhh_mpuestos_impuesto_id_seq'::regclass) NOT NULL,
    tp_codigo VARCHAR(10) NOT NULL,
    tp_descripcion VARCHAR(100) NOT NULL,
    tp_empresa INTEGER NOT NULL DEFAULT 1,
    tp_estado INTEGER DEFAULT 1,
    tp_usuarioregistro BIGINT,
    tp_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tp_usuarioedito BIGINT,
    tp_fechaedito TIMESTAMP,
    
    CONSTRAINT pk_rrhh_mpuestos PRIMARY KEY (impuesto_id),
    CONSTRAINT uk_rrhh_mpuestos_codigo UNIQUE (tp_codigo, tp_empresa)
);

-- Comentarios
COMMENT ON TABLE public.rrhh_mpuestos IS 'Tabla maestra de puestos o cargos laborales';
COMMENT ON COLUMN public.rrhh_mpuestos.impuesto_id IS 'ID único del puesto';
COMMENT ON COLUMN public.rrhh_mpuestos.tp_codigo IS 'Código del puesto';
COMMENT ON COLUMN public.rrhh_mpuestos.tp_descripcion IS 'Descripción del puesto';
COMMENT ON COLUMN public.rrhh_mpuestos.tp_empresa IS 'ID de la empresa';
COMMENT ON COLUMN public.rrhh_mpuestos.tp_estado IS 'Estado (1=activo, 0=inactivo)';

-- Índices
CREATE INDEX idx_rrhh_mpuestos_empresa ON public.rrhh_mpuestos(tp_empresa);
CREATE INDEX idx_rrhh_mpuestos_estado ON public.rrhh_mpuestos(tp_estado);

-- Insertar datos iniciales
INSERT INTO public.rrhh_mpuestos (tp_codigo, tp_descripcion, tp_empresa, tp_estado) VALUES
('001', 'GERENTE GENERAL', 1, 1),
('002', 'GERENTE DE RECURSOS HUMANOS', 1, 1),
('003', 'CONTADOR', 1, 1),
('004', 'ASISTENTE CONTABLE', 1, 1),
('005', 'JEFE DE VENTAS', 1, 1),
('006', 'VENDEDOR', 1, 1),
('007', 'ASISTENTE ADMINISTRATIVO', 1, 1),
('008', 'RECEPCIONISTA', 1, 1),
('009', 'ALMACENERO', 1, 1),
('010', 'CHOFER', 1, 1),
('011', 'OPERARIO', 1, 1),
('012', 'SUPERVISOR', 1, 1),
('013', 'ANALISTA', 1, 1),
('014', 'ASISTENTE', 1, 1),
('015', 'PRACTICANTE', 1, 1)
ON CONFLICT DO NOTHING;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Tabla RRHH_MPUESTOS creada exitosamente';
    RAISE NOTICE '✅ 15 puestos iniciales insertados';
END $$;
