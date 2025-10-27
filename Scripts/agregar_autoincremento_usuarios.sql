-- ============================================================
-- SCRIPT PARA AGREGAR AUTOINCREMENTO A LA TABLA EXISTENTE
-- SIN ELIMINAR DATOS
-- ============================================================

-- Este script es más seguro si ya tienes datos en la tabla

-- PASO 1: Verificar si la secuencia ya existe, si no, crearla
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'rrhh_musuario_imusuario_id_seq') THEN
        CREATE SEQUENCE public.rrhh_musuario_imusuario_id_seq
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
        
        ALTER TABLE public.rrhh_musuario_imusuario_id_seq OWNER TO root;
        
        RAISE NOTICE 'Secuencia creada exitosamente';
    ELSE
        RAISE NOTICE 'La secuencia ya existe';
    END IF;
END $$;

-- PASO 2: Verificar si imusuario_id es PRIMARY KEY, si no, agregarlo
DO $$
BEGIN
    -- Eliminar constraint de PK si existe con otro nombre
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.rrhh_musuario'::regclass 
        AND contype = 'p'
    ) THEN
        ALTER TABLE public.rrhh_musuario DROP CONSTRAINT IF EXISTS rrhh_musuario_pkey CASCADE;
        RAISE NOTICE 'Constraint PK anterior eliminado';
    END IF;
    
    -- Agregar PRIMARY KEY
    ALTER TABLE public.rrhh_musuario 
        ADD CONSTRAINT rrhh_musuario_pkey PRIMARY KEY (imusuario_id);
    
    RAISE NOTICE 'PRIMARY KEY agregado a imusuario_id';
END $$;

-- PASO 3: Configurar el valor por defecto de imusuario_id para usar la secuencia
ALTER TABLE public.rrhh_musuario 
    ALTER COLUMN imusuario_id SET DEFAULT nextval('public.rrhh_musuario_imusuario_id_seq'::regclass);

-- PASO 4: Asociar la secuencia con la columna
ALTER SEQUENCE public.rrhh_musuario_imusuario_id_seq 
    OWNED BY public.rrhh_musuario.imusuario_id;

-- PASO 5: Actualizar el valor de la secuencia al siguiente disponible
-- Esto es importante para que no haya conflictos con IDs existentes
SELECT setval('public.rrhh_musuario_imusuario_id_seq', 
    COALESCE((SELECT MAX(imusuario_id) FROM public.rrhh_musuario), 1), 
    true
);

-- PASO 6: Verificar que el campo iu_primerlogin existe, si no, agregarlo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rrhh_musuario' 
        AND column_name = 'iu_primerlogin'
    ) THEN
        ALTER TABLE public.rrhh_musuario 
            ADD COLUMN iu_primerlogin INTEGER DEFAULT 1;
        
        -- Actualizar usuarios existentes para que NO necesiten cambiar contraseña
        UPDATE public.rrhh_musuario 
        SET iu_primerlogin = 0 
        WHERE iu_primerlogin IS NULL;
        
        RAISE NOTICE 'Campo iu_primerlogin agregado';
    ELSE
        RAISE NOTICE 'Campo iu_primerlogin ya existe';
    END IF;
END $$;

-- PASO 7: Asegurar que tu_usuario sea UNIQUE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.rrhh_musuario'::regclass 
        AND conname = 'rrhh_musuario_tu_usuario_key'
    ) THEN
        ALTER TABLE public.rrhh_musuario 
            ADD CONSTRAINT rrhh_musuario_tu_usuario_key UNIQUE (tu_usuario);
        
        RAISE NOTICE 'Constraint UNIQUE agregado a tu_usuario';
    ELSE
        RAISE NOTICE 'Constraint UNIQUE en tu_usuario ya existe';
    END IF;
END $$;

-- PASO 8: Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_usuario_empresa ON public.rrhh_musuario(iu_empresa);
CREATE INDEX IF NOT EXISTS idx_usuario_rol ON public.rrhh_musuario(iu_rol);
CREATE INDEX IF NOT EXISTS idx_usuario_estado ON public.rrhh_musuario(iu_estado);

-- PASO 9: Verificar la configuración
SELECT 
    'Configuración completada' AS resultado,
    COUNT(*) AS total_usuarios,
    (SELECT last_value FROM public.rrhh_musuario_imusuario_id_seq) AS proximo_id
FROM public.rrhh_musuario;

-- Verificar que el autoincremento funciona
SELECT 
    column_name,
    column_default,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'rrhh_musuario' 
    AND column_name = 'imusuario_id';

-- Mostrar información de la secuencia
SELECT 
    sequencename,
    last_value,
    is_called
FROM pg_sequences
WHERE schemaname = 'public' 
    AND sequencename = 'rrhh_musuario_imusuario_id_seq';
