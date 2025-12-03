-- =====================================================
-- SCRIPT: Crear tablas de Conceptos Variables (Cabecera y Detalle)
-- =====================================================

-- =====================================================
-- TABLA CABECERA: RRHH_MCONCEPTOSVARIABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.rrhh_mconceptosvariables (
    imconceptosvariables_id BIGSERIAL PRIMARY KEY,
    icv_mes INTEGER NOT NULL,
    icv_anio INTEGER NOT NULL,
    icv_tipoplanilla BIGINT NOT NULL,
    icv_conceptos BIGINT NOT NULL,
    icv_sede BIGINT,
    icv_empresa BIGINT NOT NULL,
    icv_estado INTEGER DEFAULT 1,
    icv_usuarioregistro BIGINT,
    fcv_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    icv_usuarioedito BIGINT,
    fcv_fechaedito TIMESTAMP,
    icv_usuarioelimino BIGINT,
    fcv_fechaelimino TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_conceptosvariables_tipoplanilla FOREIGN KEY (icv_tipoplanilla) 
        REFERENCES public.rrhh_mtipoplanilla(imtipoplanilla_id),
    CONSTRAINT fk_conceptosvariables_conceptos FOREIGN KEY (icv_conceptos) 
        REFERENCES public.rrhh_mconceptos(imconceptos_id),
    
    -- Constraint único por mes, año, planilla y concepto
    CONSTRAINT uk_conceptosvariables_periodo_planilla_concepto 
        UNIQUE (icv_mes, icv_anio, icv_tipoplanilla, icv_conceptos, icv_empresa)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_conceptosvariables_empresa ON public.rrhh_mconceptosvariables(icv_empresa);
CREATE INDEX IF NOT EXISTS idx_conceptosvariables_estado ON public.rrhh_mconceptosvariables(icv_estado);
CREATE INDEX IF NOT EXISTS idx_conceptosvariables_periodo ON public.rrhh_mconceptosvariables(icv_anio, icv_mes);
CREATE INDEX IF NOT EXISTS idx_conceptosvariables_planilla ON public.rrhh_mconceptosvariables(icv_tipoplanilla);
CREATE INDEX IF NOT EXISTS idx_conceptosvariables_concepto ON public.rrhh_mconceptosvariables(icv_conceptos);

-- Comentarios
COMMENT ON TABLE public.rrhh_mconceptosvariables IS 'Tabla cabecera de conceptos variables';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.imconceptosvariables_id IS 'ID único del concepto variable (PK)';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_mes IS 'Mes del concepto variable (1-12)';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_anio IS 'Año del concepto variable';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_tipoplanilla IS 'ID del tipo de planilla (FK)';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_conceptos IS 'ID del concepto (FK)';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_sede IS 'ID de la sede (opcional)';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_empresa IS 'ID de la empresa';
COMMENT ON COLUMN public.rrhh_mconceptosvariables.icv_estado IS 'Estado: 1=Activo, 0=Inactivo';

-- =====================================================
-- TABLA DETALLE: RRHH_MCONCEPTOSVARIABLESDETALLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.rrhh_mconceptosvariablesdetalle (
    imconceptosvariablesdetalle_id BIGSERIAL PRIMARY KEY,
    icvd_conceptosvariables BIGINT NOT NULL,
    icvd_trabajador BIGINT NOT NULL,
    fcvd_fecha DATE NOT NULL,
    dcvd_valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    icvd_empresa BIGINT NOT NULL,
    icvd_estado INTEGER DEFAULT 1,
    
    -- Foreign Keys
    CONSTRAINT fk_conceptosvariablesdetalle_cabecera FOREIGN KEY (icvd_conceptosvariables) 
        REFERENCES public.rrhh_mconceptosvariables(imconceptosvariables_id) ON DELETE CASCADE,
    CONSTRAINT fk_conceptosvariablesdetalle_trabajador FOREIGN KEY (icvd_trabajador) 
        REFERENCES public.rrhh_trabajador(itrabajador_id),
    
    -- Constraint único por cabecera y trabajador
    CONSTRAINT uk_conceptosvariablesdetalle_cabecera_trabajador 
        UNIQUE (icvd_conceptosvariables, icvd_trabajador)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_conceptosvariablesdetalle_cabecera ON public.rrhh_mconceptosvariablesdetalle(icvd_conceptosvariables);
CREATE INDEX IF NOT EXISTS idx_conceptosvariablesdetalle_trabajador ON public.rrhh_mconceptosvariablesdetalle(icvd_trabajador);
CREATE INDEX IF NOT EXISTS idx_conceptosvariablesdetalle_empresa ON public.rrhh_mconceptosvariablesdetalle(icvd_empresa);
CREATE INDEX IF NOT EXISTS idx_conceptosvariablesdetalle_estado ON public.rrhh_mconceptosvariablesdetalle(icvd_estado);
CREATE INDEX IF NOT EXISTS idx_conceptosvariablesdetalle_fecha ON public.rrhh_mconceptosvariablesdetalle(fcvd_fecha);

-- Comentarios
COMMENT ON TABLE public.rrhh_mconceptosvariablesdetalle IS 'Tabla detalle de conceptos variables por trabajador';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.imconceptosvariablesdetalle_id IS 'ID único del detalle (PK)';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.icvd_conceptosvariables IS 'ID de la cabecera (FK)';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.icvd_trabajador IS 'ID del trabajador (FK)';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.fcvd_fecha IS 'Fecha del concepto variable';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.dcvd_valor IS 'Valor del concepto variable';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.icvd_empresa IS 'ID de la empresa';
COMMENT ON COLUMN public.rrhh_mconceptosvariablesdetalle.icvd_estado IS 'Estado: 1=Activo, 0=Inactivo';

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Función para guardar conceptos variables en lote
CREATE OR REPLACE FUNCTION public.sp_guardar_conceptos_variables_batch(
    p_anio INTEGER,
    p_mes INTEGER,
    p_planilla_id BIGINT,
    p_concepto_id BIGINT,
    p_trabajadores JSONB,
    p_empresa_id BIGINT,
    p_usuario_id BIGINT
) RETURNS BIGINT AS $$
DECLARE
    v_cabecera_id BIGINT;
    v_trabajador JSONB;
BEGIN
    -- Verificar si ya existe una cabecera para este período, planilla y concepto
    SELECT imconceptosvariables_id INTO v_cabecera_id
    FROM public.rrhh_mconceptosvariables
    WHERE icv_mes = p_mes
    AND icv_anio = p_anio
    AND icv_tipoplanilla = p_planilla_id
    AND icv_conceptos = p_concepto_id
    AND icv_empresa = p_empresa_id
    AND icv_estado = 1;
    
    -- Si existe, eliminar detalles anteriores
    IF v_cabecera_id IS NOT NULL THEN
        DELETE FROM public.rrhh_mconceptosvariablesdetalle
        WHERE icvd_conceptosvariables = v_cabecera_id;
        
        -- Actualizar cabecera
        UPDATE public.rrhh_mconceptosvariables
        SET icv_usuarioedito = p_usuario_id,
            fcv_fechaedito = CURRENT_TIMESTAMP
        WHERE imconceptosvariables_id = v_cabecera_id;
    ELSE
        -- Insertar nueva cabecera
        INSERT INTO public.rrhh_mconceptosvariables (
            icv_mes,
            icv_anio,
            icv_tipoplanilla,
            icv_conceptos,
            icv_empresa,
            icv_estado,
            icv_usuarioregistro,
            fcv_fecharegistro
        ) VALUES (
            p_mes,
            p_anio,
            p_planilla_id,
            p_concepto_id,
            p_empresa_id,
            1,
            p_usuario_id,
            CURRENT_TIMESTAMP
        ) RETURNING imconceptosvariables_id INTO v_cabecera_id;
    END IF;
    
    -- Insertar detalles para cada trabajador
    FOR v_trabajador IN SELECT * FROM jsonb_array_elements(p_trabajadores)
    LOOP
        INSERT INTO public.rrhh_mconceptosvariablesdetalle (
            icvd_conceptosvariables,
            icvd_trabajador,
            fcvd_fecha,
            dcvd_valor,
            icvd_empresa,
            icvd_estado
        ) VALUES (
            v_cabecera_id,
            (v_trabajador->>'trabajadorId')::BIGINT,
            (v_trabajador->>'fecha')::DATE,
            (v_trabajador->>'valor')::DECIMAL,
            p_empresa_id,
            1
        );
    END LOOP;
    
    RETURN v_cabecera_id;
END;
$$ LANGUAGE plpgsql;

-- Función para listar conceptos variables
CREATE OR REPLACE FUNCTION public.sp_listar_conceptos_variables(
    p_empresa_id BIGINT,
    p_anio INTEGER DEFAULT NULL,
    p_mes INTEGER DEFAULT NULL
) RETURNS TABLE (
    id BIGINT,
    anio INTEGER,
    mes INTEGER,
    tipo_planilla VARCHAR,
    concepto VARCHAR,
    total_trabajadores BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.imconceptosvariables_id,
        cv.icv_anio,
        cv.icv_mes,
        tp.ttp_descripcion,
        c.tc_descripcion,
        COUNT(cvd.imconceptosvariablesdetalle_id) as total_trabajadores
    FROM public.rrhh_mconceptosvariables cv
    INNER JOIN public.rrhh_mtipoplanilla tp ON cv.icv_tipoplanilla = tp.imtipoplanilla_id
    INNER JOIN public.rrhh_mconceptos c ON cv.icv_conceptos = c.imconceptos_id
    LEFT JOIN public.rrhh_mconceptosvariablesdetalle cvd ON cv.imconceptosvariables_id = cvd.icvd_conceptosvariables
    WHERE cv.icv_empresa = p_empresa_id
    AND cv.icv_estado = 1
    AND (p_anio IS NULL OR cv.icv_anio = p_anio)
    AND (p_mes IS NULL OR cv.icv_mes = p_mes)
    GROUP BY cv.imconceptosvariables_id, cv.icv_anio, cv.icv_mes, tp.ttp_descripcion, c.tc_descripcion
    ORDER BY cv.icv_anio DESC, cv.icv_mes DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener detalle de conceptos variables
CREATE OR REPLACE FUNCTION public.sp_obtener_detalle_conceptos_variables(
    p_cabecera_id BIGINT
) RETURNS TABLE (
    detalle_id BIGINT,
    trabajador_id BIGINT,
    numero_documento VARCHAR,
    nombre_completo VARCHAR,
    fecha DATE,
    valor DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cvd.imconceptosvariablesdetalle_id,
        cvd.icvd_trabajador,
        t.tt_nrodoc,
        CONCAT(t.tt_apellidopaterno, ' ', t.tt_apellidomaterno, ' ', t.tt_nombres),
        cvd.fcvd_fecha,
        cvd.dcvd_valor
    FROM public.rrhh_mconceptosvariablesdetalle cvd
    INNER JOIN public.rrhh_trabajador t ON cvd.icvd_trabajador = t.itrabajador_id
    WHERE cvd.icvd_conceptosvariables = p_cabecera_id
    AND cvd.icvd_estado = 1
    ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar conceptos variables (soft delete)
CREATE OR REPLACE FUNCTION public.sp_eliminar_conceptos_variables(
    p_cabecera_id BIGINT,
    p_usuario_id BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    v_rows INTEGER;
BEGIN
    -- Eliminar cabecera (soft delete)
    UPDATE public.rrhh_mconceptosvariables
    SET icv_estado = 0,
        icv_usuarioelimino = p_usuario_id,
        fcv_fechaelimino = CURRENT_TIMESTAMP
    WHERE imconceptosvariables_id = p_cabecera_id;
    
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    
    -- Eliminar detalles (soft delete)
    IF v_rows > 0 THEN
        UPDATE public.rrhh_mconceptosvariablesdetalle
        SET icvd_estado = 0
        WHERE icvd_conceptosvariables = p_cabecera_id;
    END IF;
    
    RETURN v_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS DE FUNCIONES
-- =====================================================

COMMENT ON FUNCTION public.sp_guardar_conceptos_variables_batch IS 'Guarda conceptos variables en lote (cabecera + múltiples detalles)';
COMMENT ON FUNCTION public.sp_listar_conceptos_variables IS 'Lista conceptos variables con resumen';
COMMENT ON FUNCTION public.sp_obtener_detalle_conceptos_variables IS 'Obtiene detalle de conceptos variables con información de trabajadores';
COMMENT ON FUNCTION public.sp_eliminar_conceptos_variables IS 'Elimina (soft delete) conceptos variables';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Verificar tablas creadas
SELECT 
    table_name, 
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name IN ('rrhh_mconceptosvariables', 'rrhh_mconceptosvariablesdetalle')
ORDER BY table_name, ordinal_position;
