-- =====================================================
-- SCRIPT: Crear tablas de Cronograma de Vacaciones (Cabecera y Detalle)
-- =====================================================

-- Tabla Cabecera: RRHH_MCRONOGRAMAVACACIONES
CREATE TABLE IF NOT EXISTS public.rrhh_mcronogramavacaciones (
    imcronogramavacaciones_id BIGSERIAL PRIMARY KEY,
    fcv_fechadesde DATE NOT NULL,
    fcv_fechahasta DATE NOT NULL,
    icv_anio INTEGER NOT NULL,
    icv_empresa BIGINT NOT NULL,
    icv_estado INTEGER DEFAULT 1,
    icv_usuarioregistro BIGINT,
    fcv_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    icv_usuarioedito BIGINT,
    fcv_fechaedito TIMESTAMP,
    icv_usuarioelimino BIGINT,
    fcv_fechaelimino TIMESTAMP,
    
    -- Índices para mejorar rendimiento
    CONSTRAINT uk_cronograma_anio_empresa UNIQUE (icv_anio, icv_empresa)
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_cronograma_empresa ON public.rrhh_mcronogramavacaciones(icv_empresa);
CREATE INDEX IF NOT EXISTS idx_cronograma_anio ON public.rrhh_mcronogramavacaciones(icv_anio);
CREATE INDEX IF NOT EXISTS idx_cronograma_estado ON public.rrhh_mcronogramavacaciones(icv_estado);

-- Comentarios
COMMENT ON TABLE public.rrhh_mcronogramavacaciones IS 'Tabla cabecera de cronograma de vacaciones';
COMMENT ON COLUMN public.rrhh_mcronogramavacaciones.imcronogramavacaciones_id IS 'ID único del cronograma';
COMMENT ON COLUMN public.rrhh_mcronogramavacaciones.fcv_fechadesde IS 'Fecha desde del cronograma';
COMMENT ON COLUMN public.rrhh_mcronogramavacaciones.fcv_fechahasta IS 'Fecha hasta del cronograma';
COMMENT ON COLUMN public.rrhh_mcronogramavacaciones.icv_anio IS 'Año del cronograma';
COMMENT ON COLUMN public.rrhh_mcronogramavacaciones.icv_empresa IS 'ID de la empresa';
COMMENT ON COLUMN public.rrhh_mcronogramavacaciones.icv_estado IS 'Estado: 1=Activo, 0=Inactivo';

-- =====================================================

-- Tabla Detalle: RRHH_MCRONOGRAMAVACACIONESDETALLE
CREATE TABLE IF NOT EXISTS public.rrhh_mcronogramavacacionesdetalle (
    imcronogramavacacionesdetalle_id BIGSERIAL PRIMARY KEY,
    icvd_cronogramavacaciones BIGINT NOT NULL,
    icvd_trabajador BIGINT NOT NULL,
    fcvd_fechainicio DATE,
    fcvd_fechafin DATE,
    icvd_dias INTEGER,
    tcvd_observaciones VARCHAR(500),
    icvd_empresa BIGINT NOT NULL,
    icvd_estado INTEGER DEFAULT 1,
    
    -- Constraints
    CONSTRAINT fk_cronogramadetalle_cronograma FOREIGN KEY (icvd_cronogramavacaciones) 
        REFERENCES public.rrhh_mcronogramavacaciones(imcronogramavacaciones_id) ON DELETE CASCADE,
    CONSTRAINT fk_cronogramadetalle_trabajador FOREIGN KEY (icvd_trabajador) 
        REFERENCES public.rrhh_trabajador(itrabajador_id),
    
    -- Índices para mejorar rendimiento
    CONSTRAINT uk_cronogramadetalle_cronograma_trabajador UNIQUE (icvd_cronogramavacaciones, icvd_trabajador)
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_cronogramadetalle_cronograma ON public.rrhh_mcronogramavacacionesdetalle(icvd_cronogramavacaciones);
CREATE INDEX IF NOT EXISTS idx_cronogramadetalle_trabajador ON public.rrhh_mcronogramavacacionesdetalle(icvd_trabajador);
CREATE INDEX IF NOT EXISTS idx_cronogramadetalle_empresa ON public.rrhh_mcronogramavacacionesdetalle(icvd_empresa);
CREATE INDEX IF NOT EXISTS idx_cronogramadetalle_estado ON public.rrhh_mcronogramavacacionesdetalle(icvd_estado);

-- Comentarios
COMMENT ON TABLE public.rrhh_mcronogramavacacionesdetalle IS 'Tabla detalle de cronograma de vacaciones por trabajador';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.imcronogramavacacionesdetalle_id IS 'ID único del detalle';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.icvd_cronogramavacaciones IS 'ID del cronograma cabecera';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.icvd_trabajador IS 'ID del trabajador';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.fcvd_fechainicio IS 'Fecha inicio de vacaciones';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.fcvd_fechafin IS 'Fecha fin de vacaciones';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.icvd_dias IS 'Días de vacaciones';
COMMENT ON COLUMN public.rrhh_mcronogramavacacionesdetalle.tcvd_observaciones IS 'Observaciones';

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para generar cronograma de vacaciones
CREATE OR REPLACE FUNCTION public.sp_generar_cronograma_vacaciones(
    p_fecha_desde DATE,
    p_fecha_hasta DATE,
    p_empresa_id BIGINT,
    p_usuario_id BIGINT
) RETURNS BIGINT AS $$
DECLARE
    v_cronograma_id BIGINT;
    v_anio INTEGER;
BEGIN
    -- Obtener año
    v_anio := EXTRACT(YEAR FROM p_fecha_desde);
    
    -- Verificar si ya existe un cronograma para ese año y empresa
    SELECT imcronogramavacaciones_id INTO v_cronograma_id
    FROM public.rrhh_mcronogramavacaciones
    WHERE icv_anio = v_anio
    AND icv_empresa = p_empresa_id
    AND icv_estado = 1;
    
    -- Si existe, eliminar detalles anteriores
    IF v_cronograma_id IS NOT NULL THEN
        DELETE FROM public.rrhh_mcronogramavacacionesdetalle
        WHERE icvd_cronogramavacaciones = v_cronograma_id;
        
        -- Actualizar cabecera
        UPDATE public.rrhh_mcronogramavacaciones
        SET fcv_fechadesde = p_fecha_desde,
            fcv_fechahasta = p_fecha_hasta,
            icv_usuarioedito = p_usuario_id,
            fcv_fechaedito = CURRENT_TIMESTAMP
        WHERE imcronogramavacaciones_id = v_cronograma_id;
    ELSE
        -- Insertar nueva cabecera
        INSERT INTO public.rrhh_mcronogramavacaciones (
            fcv_fechadesde,
            fcv_fechahasta,
            icv_anio,
            icv_empresa,
            icv_estado,
            icv_usuarioregistro,
            fcv_fecharegistro
        ) VALUES (
            p_fecha_desde,
            p_fecha_hasta,
            v_anio,
            p_empresa_id,
            1,
            p_usuario_id,
            CURRENT_TIMESTAMP
        ) RETURNING imcronogramavacaciones_id INTO v_cronograma_id;
    END IF;
    
    -- Insertar detalles para todos los trabajadores activos
    INSERT INTO public.rrhh_mcronogramavacacionesdetalle (
        icvd_cronogramavacaciones,
        icvd_trabajador,
        fcvd_fechainicio,
        fcvd_fechafin,
        icvd_dias,
        icvd_empresa,
        icvd_estado
    )
    SELECT 
        v_cronograma_id,
        c.ict_trabajador,
        NULL, -- Fecha inicio vacaciones (a definir por usuario)
        NULL, -- Fecha fin vacaciones (a definir por usuario)
        NULL, -- Días (a definir por usuario)
        p_empresa_id,
        1
    FROM public.rrhh_mcontratotrabajador c
    WHERE c.ict_empresa = p_empresa_id
    AND c.ict_estado = 1
    AND c.fct_fechainicio <= p_fecha_hasta
    AND (c.fct_fechafinlaboral IS NULL OR c.fct_fechafinlaboral >= p_fecha_desde)
    GROUP BY c.ict_trabajador; -- Evitar duplicados si hay múltiples contratos
    
    RETURN v_cronograma_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================

-- Procedimiento para listar cronogramas con información completa
CREATE OR REPLACE FUNCTION public.sp_listar_cronogramas_vacaciones(
    p_empresa_id BIGINT
) RETURNS TABLE (
    cronograma_id BIGINT,
    fecha_desde DATE,
    fecha_hasta DATE,
    anio INTEGER,
    total_trabajadores BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.imcronogramavacaciones_id,
        c.fcv_fechadesde,
        c.fcv_fechahasta,
        c.icv_anio,
        COUNT(d.imcronogramavacacionesdetalle_id) as total_trabajadores
    FROM public.rrhh_mcronogramavacaciones c
    LEFT JOIN public.rrhh_mcronogramavacacionesdetalle d ON c.imcronogramavacaciones_id = d.icvd_cronogramavacaciones
    WHERE c.icv_empresa = p_empresa_id
    AND c.icv_estado = 1
    GROUP BY c.imcronogramavacaciones_id, c.fcv_fechadesde, c.fcv_fechahasta, c.icv_anio
    ORDER BY c.icv_anio DESC, c.fcv_fechadesde DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================

COMMENT ON FUNCTION public.sp_generar_cronograma_vacaciones IS 'Genera cronograma de vacaciones para todos los trabajadores activos';
COMMENT ON FUNCTION public.sp_listar_cronogramas_vacaciones IS 'Lista cronogramas de vacaciones con resumen';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
