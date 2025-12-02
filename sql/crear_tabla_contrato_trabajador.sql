-- =====================================================
-- TABLA: RRHH_MCONTRATOTRABAJADOR
-- Descripción: Tabla para almacenar contratos de trabajadores
-- =====================================================

-- Eliminar tabla si existe
DROP TABLE IF EXISTS public.rrhh_mcontratotrabajador CASCADE;

-- Crear tabla
CREATE TABLE public.rrhh_mcontratotrabajador (
    -- Clave primaria
    imcontratotrabajador_id BIGSERIAL PRIMARY KEY,
    
    -- Información del trabajador y contrato
    ict_trabajador BIGINT NOT NULL,
    ict_tipocontrato INTEGER NOT NULL,
    fct_fechainiciolaboral DATE NOT NULL,
    fct_fechafinlaboral DATE,
    
    -- Ubicación y puesto
    ict_sede BIGINT NOT NULL,
    ict_puesto INTEGER NOT NULL,
    
    -- Horario y turno
    ict_turno VARCHAR(2) NOT NULL,
    ict_horario VARCHAR(2) NOT NULL,
    hct_horaentrada TIME NOT NULL,
    hct_horasalida TIME NOT NULL,
    ict_diadescanso VARCHAR(2) NOT NULL,
    
    -- Tipo de trabajador y regímenes
    ict_tipotrabajador INTEGER NOT NULL,
    ict_regimenpensionario INTEGER NOT NULL,
    ict_regimenlaboral BIGINT NOT NULL,  -- FK a rrhh_conceptos_regimen_laboral
    
    -- Horas laborales
    hct_horalaboral DECIMAL(5,2) DEFAULT 0.00,
    
    -- Remuneraciones
    dct_remuneracionbasica DECIMAL(10,2) DEFAULT 0.00,
    dct_remuneracionrc DECIMAL(10,2) DEFAULT 0.00,
    dct_sueldomensual DECIMAL(10,2) DEFAULT 0.00,
    
    -- Estado y auditoría
    ict_estado INTEGER DEFAULT 1,
    ict_usuarioregistro BIGINT,
    fct_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ict_usuarioedito BIGINT,
    fct_fechaedito TIMESTAMP,
    ict_usuarioelimino BIGINT,
    fct_fechaelimino TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_contrato_trabajador FOREIGN KEY (ict_trabajador) 
        REFERENCES public.rrhh_trabajador(itrabajador_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_tipocontrato FOREIGN KEY (ict_tipocontrato) 
        REFERENCES public.rrhh_mtipocontrato(imtipocontrato_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_sede FOREIGN KEY (ict_sede) 
        REFERENCES public.rrhh_msede(imsede_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_puesto FOREIGN KEY (ict_puesto) 
        REFERENCES public.rrhh_mpuestos(impuesto_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_turno FOREIGN KEY (ict_turno) 
        REFERENCES public.rrhh_mturno(imturno_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_horario FOREIGN KEY (ict_horario) 
        REFERENCES public.rrhh_mhorario(imhorario_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_diadescanso FOREIGN KEY (ict_diadescanso) 
        REFERENCES public.rrhh_mdiasemana(idiasemana_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_tipotrabajador FOREIGN KEY (ict_tipotrabajador) 
        REFERENCES public.rrhh_mtipotrabajador(imtipotrabajador_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_regimenpensionario FOREIGN KEY (ict_regimenpensionario) 
        REFERENCES public.rrhh_mregimenpensionario(imregimenpensionario_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_regimenlaboral FOREIGN KEY (ict_regimenlaboral) 
        REFERENCES public.rrhh_conceptos_regimen_laboral(imconceptosregimen_id) ON DELETE RESTRICT
);

-- Comentarios de la tabla
COMMENT ON TABLE public.rrhh_mcontratotrabajador IS 'Tabla de contratos de trabajadores';

-- Comentarios de columnas
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.imcontratotrabajador_id IS 'ID único del contrato';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_trabajador IS 'ID del trabajador (FK a rrhh_trabajador)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_tipocontrato IS 'ID del tipo de contrato (FK a rrhh_mtipocontrato)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechainiciolaboral IS 'Fecha de inicio del contrato';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechafinlaboral IS 'Fecha de fin del contrato';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_sede IS 'ID de la sede (FK a rrhh_msede)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_puesto IS 'ID del puesto (FK a rrhh_mpuestos.impuesto_id)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_turno IS 'Código del turno (FK a rrhh_mturno) - VARCHAR(2)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_horario IS 'Código del horario (FK a rrhh_mhorario) - VARCHAR(2)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.hct_horaentrada IS 'Hora de entrada';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.hct_horasalida IS 'Hora de salida';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_diadescanso IS 'Código del día de descanso (FK a rrhh_mdiasemana.idiasemana_id) - VARCHAR(2)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_tipotrabajador IS 'ID del tipo de trabajador (FK a rrhh_mtipotrabajador)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_regimenpensionario IS 'ID del régimen pensionario (FK a rrhh_mregimenpensionario)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_regimenlaboral IS 'ID del concepto régimen laboral (FK a rrhh_conceptos_regimen_laboral)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.hct_horalaboral IS 'Horas laborales diarias';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.dct_remuneracionbasica IS 'Remuneración básica mensual';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.dct_remuneracionrc IS 'Remuneración R.C. (Recibo por Caja)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.dct_sueldomensual IS 'Sueldo mensual total (Básica + RC)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_estado IS 'Estado del contrato (1=activo, 0=inactivo)';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_usuarioregistro IS 'ID del usuario que registró';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fecharegistro IS 'Fecha de registro';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_usuarioedito IS 'ID del usuario que editó';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechaedito IS 'Fecha de edición';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.ict_usuarioelimino IS 'ID del usuario que eliminó';
COMMENT ON COLUMN public.rrhh_mcontratotrabajador.fct_fechaelimino IS 'Fecha de eliminación';

-- Índices para mejorar el rendimiento
CREATE INDEX idx_contrato_trabajador ON public.rrhh_mcontratotrabajador(ict_trabajador);
CREATE INDEX idx_contrato_estado ON public.rrhh_mcontratotrabajador(ict_estado);
CREATE INDEX idx_contrato_sede ON public.rrhh_mcontratotrabajador(ict_sede);
CREATE INDEX idx_contrato_fechas ON public.rrhh_mcontratotrabajador(fct_fechainiciolaboral, fct_fechafinlaboral);
CREATE INDEX idx_contrato_regimenlaboral ON public.rrhh_mcontratotrabajador(ict_regimenlaboral);

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Eliminar funciones existentes si existen
DROP FUNCTION IF EXISTS public.sp_guardar_contrato_trabajador CASCADE;
DROP FUNCTION IF EXISTS public.sp_actualizar_contrato_trabajador CASCADE;
DROP FUNCTION IF EXISTS public.sp_eliminar_contrato_trabajador CASCADE;
DROP FUNCTION IF EXISTS public.sp_obtener_contrato_por_id CASCADE;

-- =====================================================
-- SP: Guardar Contrato Trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_guardar_contrato_trabajador(
    p_trabajador_id BIGINT,
    p_tipocontrato_id INTEGER,
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_sede_id BIGINT,
    p_puesto_id INTEGER,
    p_turno_id VARCHAR(2),
    p_horario_id VARCHAR(2),
    p_hora_entrada TIME,
    p_hora_salida TIME,
    p_dia_descanso_id VARCHAR(2),
    p_tipo_trabajador_id INTEGER,
    p_regimen_pensionario_id INTEGER,
    p_regimen_laboral_id BIGINT,
    p_hora_laboral DECIMAL(5,2),
    p_remuneracion_basica DECIMAL(10,2),
    p_remuneracion_rc DECIMAL(10,2),
    p_sueldo_mensual DECIMAL(10,2),
    p_usuario_id BIGINT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_contrato_id BIGINT;
BEGIN
    INSERT INTO public.rrhh_mcontratotrabajador (
        ict_trabajador,
        ict_tipocontrato,
        fct_fechainiciolaboral,
        fct_fechafinlaboral,
        ict_sede,
        ict_puesto,
        ict_turno,
        ict_horario,
        hct_horaentrada,
        hct_horasalida,
        ict_diadescanso,
        ict_tipotrabajador,
        ict_regimenpensionario,
        ict_regimenlaboral,
        hct_horalaboral,
        dct_remuneracionbasica,
        dct_remuneracionrc,
        dct_sueldomensual,
        ict_estado,
        ict_usuarioregistro,
        fct_fecharegistro
    ) VALUES (
        p_trabajador_id,
        p_tipocontrato_id,
        p_fecha_inicio,
        p_fecha_fin,
        p_sede_id,
        p_puesto_id,
        p_turno_id,
        p_horario_id,
        p_hora_entrada,
        p_hora_salida,
        p_dia_descanso_id,
        p_tipo_trabajador_id,
        p_regimen_pensionario_id,
        p_regimen_laboral_id,
        p_hora_laboral,
        p_remuneracion_basica,
        p_remuneracion_rc,
        p_sueldo_mensual,
        1,
        p_usuario_id,
        CURRENT_TIMESTAMP
    )
    RETURNING imcontratotrabajador_id INTO v_contrato_id;
    
    RETURN v_contrato_id;
END;
$$;

COMMENT ON FUNCTION public.sp_guardar_contrato_trabajador IS 'Guarda un nuevo contrato de trabajador';

-- =====================================================
-- SP: Actualizar Contrato Trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_actualizar_contrato_trabajador(
    p_contrato_id BIGINT,
    p_trabajador_id BIGINT,
    p_tipocontrato_id INTEGER,
    p_fecha_inicio DATE,
    p_fecha_fin DATE,
    p_sede_id BIGINT,
    p_puesto_id INTEGER,
    p_turno_id VARCHAR(2),
    p_horario_id VARCHAR(2),
    p_hora_entrada TIME,
    p_hora_salida TIME,
    p_dia_descanso_id VARCHAR(2),
    p_tipo_trabajador_id INTEGER,
    p_regimen_pensionario_id INTEGER,
    p_regimen_laboral_id BIGINT,
    p_hora_laboral DECIMAL(5,2),
    p_remuneracion_basica DECIMAL(10,2),
    p_remuneracion_rc DECIMAL(10,2),
    p_sueldo_mensual DECIMAL(10,2),
    p_usuario_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.rrhh_mcontratotrabajador
    SET 
        ict_trabajador = p_trabajador_id,
        ict_tipocontrato = p_tipocontrato_id,
        fct_fechainiciolaboral = p_fecha_inicio,
        fct_fechafinlaboral = p_fecha_fin,
        ict_sede = p_sede_id,
        ict_puesto = p_puesto_id,
        ict_turno = p_turno_id,
        ict_horario = p_horario_id,
        hct_horaentrada = p_hora_entrada,
        hct_horasalida = p_hora_salida,
        ict_diadescanso = p_dia_descanso_id,
        ict_tipotrabajador = p_tipo_trabajador_id,
        ict_regimenpensionario = p_regimen_pensionario_id,
        ict_regimenlaboral = p_regimen_laboral_id,
        hct_horalaboral = p_hora_laboral,
        dct_remuneracionbasica = p_remuneracion_basica,
        dct_remuneracionrc = p_remuneracion_rc,
        dct_sueldomensual = p_sueldo_mensual,
        ict_usuarioedito = p_usuario_id,
        fct_fechaedito = CURRENT_TIMESTAMP
    WHERE imcontratotrabajador_id = p_contrato_id;
    
    RETURN FOUND;
END;
$$;

COMMENT ON FUNCTION public.sp_actualizar_contrato_trabajador IS 'Actualiza un contrato de trabajador existente';

-- =====================================================
-- SP: Eliminar Contrato Trabajador (Soft Delete)
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_eliminar_contrato_trabajador(
    p_contrato_id BIGINT,
    p_usuario_id BIGINT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.rrhh_mcontratotrabajador
    SET 
        ict_estado = 0,
        ict_usuarioelimino = p_usuario_id,
        fct_fechaelimino = CURRENT_TIMESTAMP
    WHERE imcontratotrabajador_id = p_contrato_id;
    
    RETURN FOUND;
END;
$$;

COMMENT ON FUNCTION public.sp_eliminar_contrato_trabajador IS 'Elimina (soft delete) un contrato de trabajador';

-- =====================================================
-- SP: Listar Contratos por Sede
-- NOTA: Este SP se creará cuando todas las tablas existan
-- =====================================================
-- CREATE OR REPLACE FUNCTION public.sp_listar_contratos_por_sede(
--     p_sede_id BIGINT
-- )
-- RETURNS TABLE (
--     contrato_id BIGINT,
--     trabajador_id BIGINT,
--     tipo_contrato_id INTEGER,
--     fecha_inicio DATE,
--     fecha_fin DATE,
--     sede_id BIGINT,
--     puesto_id INTEGER,
--     turno_id INTEGER,
--     horario_id INTEGER,
--     hora_entrada TIME,
--     hora_salida TIME,
--     hora_laboral DECIMAL,
--     dia_descanso_id INTEGER,
--     tipo_trabajador_id INTEGER,
--     regimen_pensionario_id INTEGER,
--     regimen_laboral_id BIGINT,
--     remuneracion_basica DECIMAL,
--     remuneracion_rc DECIMAL,
--     sueldo_mensual DECIMAL,
--     estado INTEGER
-- )
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         c.imcontratotrabajador_id,
--         c.ict_trabajador,
--         c.ict_tipocontrato,
--         c.fct_fechainiciolaboral,
--         c.fct_fechafinlaboral,
--         c.ict_sede,
--         c.ict_puesto,
--         c.ict_turno,
--         c.ict_horario,
--         c.hct_horaentrada,
--         c.hct_horasalida,
--         c.hct_horalaboral,
--         c.ict_diadescanso,
--         c.ict_tipotrabajador,
--         c.ict_regimenpensionario,
--         c.ict_regimenlaboral,
--         c.dct_remuneracionbasica,
--         c.dct_remuneracionrc,
--         c.dct_sueldomensual,
--         c.ict_estado
--     FROM public.rrhh_mcontratotrabajador c
--     WHERE c.ict_sede = p_sede_id AND c.ict_estado = 1
--     ORDER BY c.fct_fechainiciolaboral DESC;
-- END;
-- $$;

-- COMMENT ON FUNCTION public.sp_listar_contratos_por_sede IS 'Lista todos los contratos de una sede específica';

-- =====================================================
-- SP: Obtener Contrato por ID
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_obtener_contrato_por_id(
    p_contrato_id BIGINT
)
RETURNS TABLE (
    contrato_id BIGINT,
    trabajador_id BIGINT,
    tipo_contrato_id INTEGER,
    fecha_inicio DATE,
    fecha_fin DATE,
    sede_id BIGINT,
    puesto_id INTEGER,
    turno_id VARCHAR,
    horario_id VARCHAR,
    hora_entrada TIME,
    hora_salida TIME,
    dia_descanso_id VARCHAR,
    tipo_trabajador_id INTEGER,
    regimen_pensionario_id INTEGER,
    regimen_laboral_id BIGINT,
    hora_laboral DECIMAL,
    remuneracion_basica DECIMAL,
    remuneracion_rc DECIMAL,
    sueldo_mensual DECIMAL,
    estado INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.imcontratotrabajador_id,
        c.ict_trabajador,
        c.ict_tipocontrato,
        c.fct_fechainiciolaboral,
        c.fct_fechafinlaboral,
        c.ict_sede,
        c.ict_puesto,
        c.ict_turno,
        c.ict_horario,
        c.hct_horaentrada,
        c.hct_horasalida,
        c.ict_diadescanso,
        c.ict_tipotrabajador,
        c.ict_regimenpensionario,
        c.ict_regimenlaboral,
        c.hct_horalaboral,
        c.dct_remuneracionbasica,
        c.dct_remuneracionrc,
        c.dct_sueldomensual,
        c.ict_estado
    FROM public.rrhh_mcontratotrabajador c
    WHERE c.imcontratotrabajador_id = p_contrato_id;
END;
$$;

COMMENT ON FUNCTION public.sp_obtener_contrato_por_id IS 'Obtiene un contrato específico por su ID';

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE '✅ Tabla RRHH_MCONTRATOTRABAJADOR creada exitosamente';
    RAISE NOTICE '✅ Procedimientos almacenados creados exitosamente';
    RAISE NOTICE '✅ Índices creados para optimizar consultas';
END $$;
