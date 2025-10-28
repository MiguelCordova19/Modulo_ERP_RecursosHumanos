-- ============================================================
-- SCRIPT COMPLETO PARA RECREAR LA TABLA rrhh_mempresa
-- CON AUTOINCREMENTO Y TODOS LOS CAMPOS NECESARIOS
-- ============================================================

-- PASO 1: Eliminar la tabla existente y su secuencia (CUIDADO: Esto borra todos los datos)
-- Si tienes datos importantes, haz un backup primero
DROP TABLE IF EXISTS public.rrhh_mempresa CASCADE;
DROP SEQUENCE IF EXISTS public.rrhh_mempresa_imempresa_id_seq CASCADE;

-- PASO 2: Crear la secuencia para el autoincremento
CREATE SEQUENCE public.rrhh_mempresa_imempresa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.rrhh_mempresa_imempresa_id_seq OWNER TO root;

-- PASO 3: Crear la tabla con todos los campos
CREATE TABLE public.rrhh_mempresa (
    imempresa_id BIGINT NOT NULL DEFAULT nextval('public.rrhh_mempresa_imempresa_id_seq'::regclass),
    te_descripcion VARCHAR(100),
    te_ruc VARCHAR(11),
    te_telefono VARCHAR(20),
    te_direccion VARCHAR(255),
    ie_estado INTEGER DEFAULT 1,
    CONSTRAINT rrhh_mempresa_pkey PRIMARY KEY (imempresa_id)
);

ALTER TABLE public.rrhh_mempresa OWNER TO root;

-- PASO 4: Asociar la secuencia con la columna
ALTER SEQUENCE public.rrhh_mempresa_imempresa_id_seq 
    OWNED BY public.rrhh_mempresa.imempresa_id;

-- PASO 5: Insertar datos de prueba
INSERT INTO public.rrhh_mempresa (te_descripcion, te_ruc, te_telefono, te_direccion, ie_estado) 
VALUES 
    ('EMPRESA TEST', '20123456789', '01-1234567', 'Av. Principal 123, Lima', 1),
    ('PROMART HOMECENTER', '20100070970', '01-6189999', 'Av. Angamos Este 2681, Surquillo', 1),
    ('SODIMAC PERÚ', '20112273922', '01-2119000', 'Av. Angamos Este 1805, Surquillo', 1);

-- PASO 6: Actualizar el valor de la secuencia al siguiente disponible
SELECT setval('public.rrhh_mempresa_imempresa_id_seq', (SELECT MAX(imempresa_id) FROM public.rrhh_mempresa));

-- PASO 7: Verificar la creación
SELECT * FROM public.rrhh_mempresa;

-- PASO 8: Verificar que el autoincremento funciona
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'rrhh_mempresa' 
ORDER BY ordinal_position;

-- ============================================================
-- NOTA IMPORTANTE:
-- Si ya tienes usuarios en la tabla rrhh_musuario que referencian
-- empresas, necesitarás actualizar las referencias después de
-- recrear esta tabla, o usar el script alternativo de actualización
-- que se encuentra más abajo.
-- ============================================================


-- ============================================================
-- SCRIPT ALTERNATIVO: SOLO AGREGAR COLUMNAS SIN BORRAR DATOS
-- ============================================================
-- Si prefieres NO borrar los datos existentes, usa este script:

/*
-- Agregar las columnas faltantes
ALTER TABLE public.rrhh_mempresa 
ADD COLUMN IF NOT EXISTS te_ruc VARCHAR(11),
ADD COLUMN IF NOT EXISTS te_telefono VARCHAR(20),
ADD COLUMN IF NOT EXISTS te_direccion VARCHAR(255);

-- Asegurar que el autoincremento esté configurado
ALTER TABLE ONLY public.rrhh_mempresa 
ALTER COLUMN imempresa_id SET DEFAULT nextval('public.rrhh_mempresa_imempresa_id_seq'::regclass);

-- Actualizar el registro existente con datos de ejemplo
UPDATE public.rrhh_mempresa 
SET 
    te_ruc = '20123456789',
    te_telefono = '01-1234567',
    te_direccion = 'Av. Principal 123, Lima'
WHERE imempresa_id = 1 AND te_ruc IS NULL;

-- Verificar los cambios
SELECT * FROM public.rrhh_mempresa;
*/
