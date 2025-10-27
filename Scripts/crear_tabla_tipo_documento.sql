-- ============================================================
-- TABLA: RRHH_MTIPODOCUMENTO
-- Tipos de documentos de identidad
-- ============================================================

-- PASO 1: Eliminar tabla y secuencia si existe
DROP TABLE IF EXISTS public.rrhh_mtipodocumento CASCADE;
DROP SEQUENCE IF EXISTS public.rrhh_mtipodocumento_imtipodoc_id_seq CASCADE;

-- PASO 2: Crear secuencia para autoincremento
CREATE SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq OWNER TO postgres;

-- PASO 3: Crear tabla RRHH_MTIPODOCUMENTO
CREATE TABLE public.rrhh_mtipodocumento (
    imtipodoc_id INTEGER NOT NULL DEFAULT nextval('public.rrhh_mtipodocumento_imtipodoc_id_seq'::regclass),
    ttd_codsunat VARCHAR(10) NOT NULL,
    ttd_descripcion VARCHAR(100) NOT NULL,
    ttd_abreviatura VARCHAR(100) NOT NULL,
    CONSTRAINT rrhh_mtipodocumento_pkey PRIMARY KEY (imtipodoc_id)
);

ALTER TABLE public.rrhh_mtipodocumento OWNER TO postgres;

-- PASO 4: Asociar secuencia con columna
ALTER SEQUENCE public.rrhh_mtipodocumento_imtipodoc_id_seq 
    OWNED BY public.rrhh_mtipodocumento.imtipodoc_id;

-- PASO 5: Insertar datos de tipos de documento
INSERT INTO public.rrhh_mtipodocumento (ttd_codsunat, ttd_descripcion, ttd_abreviatura) 
VALUES 
    ('01', 'Doc. Nacional de Identidad', 'DNI'),
    ('04', 'Carné de Extranjería', 'CARNET EXT.'),
    ('06', 'Reg. Único de Contribuyentes', 'RUC'),
    ('07', 'Pasaporte', 'PASAPORTE');

-- PASO 6: Actualizar secuencia
SELECT setval('public.rrhh_mtipodocumento_imtipodoc_id_seq', (SELECT MAX(imtipodoc_id) FROM public.rrhh_mtipodocumento));

-- PASO 7: Verificar datos insertados
SELECT 
    imtipodoc_id,
    ttd_codsunat,
    ttd_descripcion,
    ttd_abreviatura
FROM public.rrhh_mtipodocumento
ORDER BY imtipodoc_id;

-- PASO 8: Comentarios
COMMENT ON TABLE public.rrhh_mtipodocumento IS 'Catálogo de tipos de documentos de identidad';
COMMENT ON COLUMN public.rrhh_mtipodocumento.imtipodoc_id IS 'ID único del tipo de documento';
COMMENT ON COLUMN public.rrhh_mtipodocumento.ttd_codsunat IS 'Código SUNAT del tipo de documento';
COMMENT ON COLUMN public.rrhh_mtipodocumento.ttd_descripcion IS 'Descripción completa del tipo de documento';
COMMENT ON COLUMN public.rrhh_mtipodocumento.ttd_abreviatura IS 'Abreviatura del tipo de documento';
