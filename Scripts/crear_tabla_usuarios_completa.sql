-- ============================================================
-- SCRIPT COMPLETO PARA RECREAR LA TABLA rrhh_musuario
-- CON AUTOINCREMENTO Y TODOS LOS CAMPOS NECESARIOS
-- ============================================================

-- ADVERTENCIA: Este script eliminará la tabla existente y todos sus datos
-- Si tienes datos importantes, haz un backup primero con:
-- pg_dump -U root -d nombre_base_datos -t rrhh_musuario > backup_usuarios.sql

-- PASO 1: Eliminar la tabla existente y su secuencia
DROP TABLE IF EXISTS public.rrhh_musuario CASCADE;
DROP SEQUENCE IF EXISTS public.rrhh_musuario_imusuario_id_seq CASCADE;

-- PASO 2: Crear la secuencia para el autoincremento
CREATE SEQUENCE public.rrhh_musuario_imusuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.rrhh_musuario_imusuario_id_seq OWNER TO root;

-- PASO 3: Crear la tabla con todos los campos
CREATE TABLE public.rrhh_musuario (
    imusuario_id BIGINT NOT NULL DEFAULT nextval('public.rrhh_musuario_imusuario_id_seq'::regclass),
    tu_apellidopaterno VARCHAR(50),
    tu_apellidomaterno VARCHAR(50),
    tu_nombres VARCHAR(50),
    iu_empresa BIGINT,
    iu_sede BIGINT,
    iu_tipodocumento INTEGER,
    tu_nrodocumento VARCHAR(20),
    fu_fechanacimiento DATE,
    iu_rol INTEGER,
    iu_puesto INTEGER,
    tu_nrocelular VARCHAR(20),
    tu_correo VARCHAR(50),
    iu_estado INTEGER DEFAULT 1,
    tu_usuario VARCHAR(50) UNIQUE,
    tu_password VARCHAR(255),
    iu_primerlogin INTEGER DEFAULT 1,
    CONSTRAINT rrhh_musuario_pkey PRIMARY KEY (imusuario_id)
);

ALTER TABLE public.rrhh_musuario OWNER TO root;

-- PASO 4: Asociar la secuencia con la columna
ALTER SEQUENCE public.rrhh_musuario_imusuario_id_seq 
    OWNED BY public.rrhh_musuario.imusuario_id;

-- PASO 5: Crear índices para mejorar el rendimiento
CREATE INDEX idx_usuario_empresa ON public.rrhh_musuario(iu_empresa);
CREATE INDEX idx_usuario_rol ON public.rrhh_musuario(iu_rol);
CREATE INDEX idx_usuario_estado ON public.rrhh_musuario(iu_estado);
CREATE UNIQUE INDEX idx_usuario_username ON public.rrhh_musuario(tu_usuario);

-- PASO 6: Agregar foreign keys (opcional, descomentar si las tablas relacionadas existen)
-- ALTER TABLE public.rrhh_musuario 
--     ADD CONSTRAINT fk_usuario_empresa 
--     FOREIGN KEY (iu_empresa) REFERENCES public.rrhh_mempresa(imempresa_id) ON DELETE CASCADE;

-- ALTER TABLE public.rrhh_musuario 
--     ADD CONSTRAINT fk_usuario_rol 
--     FOREIGN KEY (iu_rol) REFERENCES public.rrhh_mrol(imrol_id) ON DELETE SET NULL;

-- ALTER TABLE public.rrhh_musuario 
--     ADD CONSTRAINT fk_usuario_tipodoc 
--     FOREIGN KEY (iu_tipodocumento) REFERENCES public.rrhh_mtipodocumento(imtipodocumento_id) ON DELETE SET NULL;

-- PASO 7: Agregar comentarios a las columnas
COMMENT ON COLUMN public.rrhh_musuario.imusuario_id IS 'ID único del usuario (autoincremental)';
COMMENT ON COLUMN public.rrhh_musuario.tu_usuario IS 'Nombre de usuario para login (único)';
COMMENT ON COLUMN public.rrhh_musuario.tu_password IS 'Contraseña encriptada con BCrypt';
COMMENT ON COLUMN public.rrhh_musuario.iu_primerlogin IS 'Indica si debe cambiar contraseña: 1=Sí, 0=No';
COMMENT ON COLUMN public.rrhh_musuario.iu_estado IS 'Estado del usuario: 1=Activo, 0=Inactivo';

-- PASO 8: Insertar usuario administrador por defecto
-- Contraseña: admin123 (encriptada con BCrypt)
INSERT INTO public.rrhh_musuario (
    tu_usuario,
    tu_password,
    tu_nombres,
    tu_apellidopaterno,
    tu_apellidomaterno,
    iu_empresa,
    iu_sede,
    iu_tipodocumento,
    tu_nrodocumento,
    fu_fechanacimiento,
    iu_rol,
    iu_puesto,
    tu_nrocelular,
    tu_correo,
    iu_estado,
    iu_primerlogin
) VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- admin123
    'Administrador',
    'Sistema',
    'Principal',
    1, -- Asegúrate de que existe una empresa con ID 1
    NULL,
    1, -- Asegúrate de que existe un tipo de documento con ID 1
    '00000000',
    '1990-01-01',
    1, -- Asegúrate de que existe un rol con ID 1
    NULL,
    '999999999',
    'admin@sistema.com',
    1,
    0 -- No requiere cambio de contraseña
);

-- PASO 9: Actualizar el valor de la secuencia al siguiente disponible
SELECT setval('public.rrhh_musuario_imusuario_id_seq', (SELECT MAX(imusuario_id) FROM public.rrhh_musuario));

-- PASO 10: Verificar que todo se creó correctamente
SELECT 
    'Tabla creada exitosamente' AS resultado,
    COUNT(*) AS total_usuarios
FROM public.rrhh_musuario;

-- Verificar la secuencia
SELECT 
    'Secuencia configurada' AS resultado,
    last_value AS ultimo_valor,
    is_called
FROM public.rrhh_musuario_imusuario_id_seq;

-- Verificar el usuario admin
SELECT 
    imusuario_id,
    tu_usuario,
    tu_nombres,
    tu_apellidopaterno,
    iu_estado,
    iu_primerlogin
FROM public.rrhh_musuario
WHERE tu_usuario = 'admin';
