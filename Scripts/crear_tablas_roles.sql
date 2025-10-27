-- ============================================================
-- SCRIPT COMPLETO PARA TABLAS DE ROLES
-- 1. RRHH_MROL - Roles del ERP (por empresa)
-- 2. RRHH_MROL_DASHBOARD - Roles del Dashboard (globales)
-- ============================================================

-- ============================================================
-- TABLA 1: RRHH_MROL (Roles del ERP de Recursos Humanos)
-- Roles específicos por empresa
-- ============================================================

-- PASO 1: Eliminar tabla y secuencia existente
DROP TABLE IF EXISTS public.rrhh_mrol CASCADE;
DROP SEQUENCE IF EXISTS public.rrhh_mrol_imrol_id_seq CASCADE;

-- PASO 2: Crear secuencia para autoincremento
CREATE SEQUENCE public.rrhh_mrol_imrol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.rrhh_mrol_imrol_id_seq OWNER TO root;

-- PASO 3: Crear tabla RRHH_MROL con empresa_id
CREATE TABLE public.rrhh_mrol (
    imrol_id INTEGER NOT NULL DEFAULT nextval('public.rrhh_mrol_imrol_id_seq'::regclass),
    tr_descripcion VARCHAR(100) NOT NULL,
    ir_estado INTEGER NOT NULL DEFAULT 1,
    ir_empresa BIGINT NOT NULL,  -- FK a rrhh_mempresa (OBLIGATORIO)
    CONSTRAINT rrhh_mrol_pkey PRIMARY KEY (imrol_id),
    CONSTRAINT fk_rol_empresa FOREIGN KEY (ir_empresa) 
        REFERENCES public.rrhh_mempresa(imempresa_id) 
        ON DELETE CASCADE
);

ALTER TABLE public.rrhh_mrol OWNER TO root;

-- PASO 4: Asociar secuencia con columna
ALTER SEQUENCE public.rrhh_mrol_imrol_id_seq 
    OWNED BY public.rrhh_mrol.imrol_id;

-- PASO 5: Crear índice para mejorar búsquedas por empresa
CREATE INDEX idx_rrhh_mrol_empresa ON public.rrhh_mrol(ir_empresa);

-- PASO 6: Insertar roles de ejemplo por empresa
INSERT INTO public.rrhh_mrol (tr_descripcion, ir_estado, ir_empresa) 
VALUES 
    -- Roles para Empresa 1 (EMPRESA TEST)
    ('Administrador RRHH', 1, 1),
    ('Gerente de Planilla', 1, 1),
    ('Asistente de RRHH', 1, 1),
    ('Supervisor', 1, 1),
    
    -- Roles para Empresa 2 (PROMART)
    ('Administrador RRHH', 1, 2),
    ('Jefe de Personal', 1, 2),
    
    -- Roles para Empresa 3 (SODIMAC)
    ('Administrador RRHH', 1, 3),
    ('Coordinador de Planilla', 1, 3);

-- PASO 7: Actualizar secuencia
SELECT setval('public.rrhh_mrol_imrol_id_seq', (SELECT MAX(imrol_id) FROM public.rrhh_mrol));


-- ============================================================
-- TABLA 2: RRHH_MROL_DASHBOARD (Roles del Dashboard Empresa)
-- Roles globales del sistema (sin empresa_id)
-- ============================================================

-- PASO 1: Eliminar tabla y secuencia si existe
DROP TABLE IF EXISTS public.rrhh_mrol_dashboard CASCADE;
DROP SEQUENCE IF EXISTS public.rrhh_mrol_dashboard_imrol_id_seq CASCADE;

-- PASO 2: Crear secuencia para autoincremento
CREATE SEQUENCE public.rrhh_mrol_dashboard_imrol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.rrhh_mrol_dashboard_imrol_id_seq OWNER TO root;

-- PASO 3: Crear tabla RRHH_MROL_DASHBOARD sin empresa_id
CREATE TABLE public.rrhh_mrol_dashboard (
    imrol_id INTEGER NOT NULL DEFAULT nextval('public.rrhh_mrol_dashboard_imrol_id_seq'::regclass),
    tr_descripcion VARCHAR(100) NOT NULL,
    ir_estado INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT rrhh_mrol_dashboard_pkey PRIMARY KEY (imrol_id)
);

ALTER TABLE public.rrhh_mrol_dashboard OWNER TO root;

-- PASO 4: Asociar secuencia con columna
ALTER SEQUENCE public.rrhh_mrol_dashboard_imrol_id_seq 
    OWNED BY public.rrhh_mrol_dashboard.imrol_id;

-- PASO 5: Insertar roles globales del dashboard
INSERT INTO public.rrhh_mrol_dashboard (tr_descripcion, ir_estado) 
VALUES 
    ('Super Administrador', 1),
    ('Administrador de Empresas', 1),
    ('Gestor de Usuarios', 1),
    ('Auditor', 1),
    ('Consultor', 1);

-- PASO 6: Actualizar secuencia
SELECT setval('public.rrhh_mrol_dashboard_imrol_id_seq', (SELECT MAX(imrol_id) FROM public.rrhh_mrol_dashboard));


-- ============================================================
-- VERIFICACIONES
-- ============================================================

-- Verificar tabla RRHH_MROL (con empresa)
SELECT 
    r.imrol_id,
    r.tr_descripcion,
    r.ir_estado,
    r.ir_empresa,
    e.te_descripcion as empresa_nombre
FROM public.rrhh_mrol r
LEFT JOIN public.rrhh_mempresa e ON r.ir_empresa = e.imempresa_id
ORDER BY r.ir_empresa, r.imrol_id;

-- Verificar tabla RRHH_MROL_DASHBOARD (sin empresa)
SELECT 
    imrol_id,
    tr_descripcion,
    ir_estado
FROM public.rrhh_mrol_dashboard
ORDER BY imrol_id;

-- Verificar estructura de RRHH_MROL
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'rrhh_mrol' 
ORDER BY ordinal_position;

-- Verificar estructura de RRHH_MROL_DASHBOARD
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'rrhh_mrol_dashboard' 
ORDER BY ordinal_position;


-- ============================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================

COMMENT ON TABLE public.rrhh_mrol IS 'Roles del ERP de Recursos Humanos - Específicos por empresa';
COMMENT ON COLUMN public.rrhh_mrol.imrol_id IS 'ID único del rol';
COMMENT ON COLUMN public.rrhh_mrol.tr_descripcion IS 'Nombre/descripción del rol';
COMMENT ON COLUMN public.rrhh_mrol.ir_estado IS 'Estado del rol (1=Activo, 0=Inactivo)';
COMMENT ON COLUMN public.rrhh_mrol.ir_empresa IS 'ID de la empresa a la que pertenece el rol';

COMMENT ON TABLE public.rrhh_mrol_dashboard IS 'Roles del Dashboard de Empresas - Roles globales del sistema';
COMMENT ON COLUMN public.rrhh_mrol_dashboard.imrol_id IS 'ID único del rol';
COMMENT ON COLUMN public.rrhh_mrol_dashboard.tr_descripcion IS 'Nombre/descripción del rol';
COMMENT ON COLUMN public.rrhh_mrol_dashboard.ir_estado IS 'Estado del rol (1=Activo, 0=Inactivo)';


-- ============================================================
-- NOTAS IMPORTANTES:
-- ============================================================
-- 
-- RRHH_MROL (Roles del ERP):
-- - Cada rol DEBE estar asociado a una empresa (ir_empresa NOT NULL)
-- - Se usa en el sistema principal de RRHH
-- - Permite que cada empresa tenga sus propios roles personalizados
-- - Ejemplo: "Administrador RRHH" de Empresa A es diferente al de Empresa B
--
-- RRHH_MROL_DASHBOARD (Roles del Dashboard):
-- - Roles globales del sistema, NO asociados a empresas
-- - Se usa en el dashboard de gestión de empresas
-- - Son roles de administración del sistema completo
-- - Ejemplo: "Super Administrador" puede gestionar todas las empresas
--
-- ============================================================
