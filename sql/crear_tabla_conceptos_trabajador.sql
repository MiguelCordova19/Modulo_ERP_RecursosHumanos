-- =====================================================
-- TABLA: RRHH_MCONCEPTOSTRABAJADOR
-- Descripción: Almacena los conceptos asignados a cada trabajador
-- =====================================================

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS public.rrhh_mconceptostrabajador (
    imconceptostrabajador_id BIGSERIAL PRIMARY KEY,
    ict_contratotrabajador BIGINT NOT NULL,
    ict_conceptos BIGINT NOT NULL,
    ict_tipo INTEGER NOT NULL, -- 1=VARIABLE, 2=FIJO
    ict_tipovalor INTEGER NOT NULL, -- 1=MONTO, 2=PORCENTAJE
    dct_valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    ict_empresa INTEGER NOT NULL, -- ID de la empresa
    ict_estado INTEGER DEFAULT 1,
    ict_usuarioregistro BIGINT,
    fct_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ict_usuarioedito BIGINT,
    fct_fechaedito TIMESTAMP,
    ict_usuarioelimino BIGINT,
    fct_fechaelimino TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_conceptostrabajador_contrato 
        FOREIGN KEY (ict_contratotrabajador) 
        REFERENCES public.rrhh_mcontratotrabajador(imcontratotrabajador_id),
    
    CONSTRAINT fk_conceptostrabajador_concepto 
        FOREIGN KEY (ict_conceptos) 
        REFERENCES public.rrhh_mconceptos(imconceptos_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_contrato 
    ON public.rrhh_mconceptostrabajador(ict_contratotrabajador);

CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_concepto 
    ON public.rrhh_mconceptostrabajador(ict_conceptos);

CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_empresa 
    ON public.rrhh_mconceptostrabajador(ict_empresa);

CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_estado 
    ON public.rrhh_mconceptostrabajador(ict_estado);

CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_empresa_estado 
    ON public.rrhh_mconceptostrabajador(ict_empresa, ict_estado);

-- Comentarios
COMMENT ON TABLE public.rrhh_mconceptostrabajador IS 'Conceptos asignados a cada trabajador';
COMMENT ON COLUMN public.rrhh_mconceptostrabajador.ict_tipo IS '1=VARIABLE, 2=FIJO';
COMMENT ON COLUMN public.rrhh_mconceptostrabajador.ict_tipovalor IS '1=MONTO, 2=PORCENTAJE';

-- =====================================================
-- PROCEDIMIENTO: sp_guardar_conceptos_trabajador
-- Descripción: Guarda los conceptos de un trabajador (elimina los anteriores y crea nuevos)
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_guardar_conceptos_trabajador(
    p_contrato_id BIGINT,
    p_conceptos_json TEXT, -- JSON array con los conceptos
    p_empresa_id INTEGER,
    p_usuario_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_concepto JSON;
    v_concepto_id BIGINT;
    v_tipo INTEGER;
    v_tipo_valor INTEGER;
    v_valor DECIMAL(10,2);
BEGIN
    -- Eliminar conceptos anteriores del contrato (soft delete)
    UPDATE public.rrhh_mconceptostrabajador
    SET ict_estado = 0,
        ict_usuarioelimino = p_usuario_id,
        fct_fechaelimino = CURRENT_TIMESTAMP
    WHERE ict_contratotrabajador = p_contrato_id
      AND ict_empresa = p_empresa_id
      AND ict_estado = 1;
    
    -- Insertar nuevos conceptos
    FOR v_concepto IN SELECT * FROM json_array_elements(p_conceptos_json::json)
    LOOP
        v_concepto_id := (v_concepto->>'conceptoId')::BIGINT;
        
        -- Convertir tipo: VARIABLE=1, FIJO=2
        v_tipo := CASE 
            WHEN v_concepto->>'tipo' = 'VARIABLE' THEN 1
            WHEN v_concepto->>'tipo' = 'FIJO' THEN 2
            ELSE 1
        END;
        
        -- Convertir tipo valor: MONTO=1, PORCENTAJE=2
        v_tipo_valor := CASE 
            WHEN v_concepto->>'tipoValor' = 'MONTO' THEN 1
            WHEN v_concepto->>'tipoValor' = 'PORCENTAJE' THEN 2
            ELSE 1
        END;
        
        v_valor := (v_concepto->>'valor')::DECIMAL(10,2);
        
        -- Insertar concepto
        INSERT INTO public.rrhh_mconceptostrabajador (
            ict_contratotrabajador,
            ict_conceptos,
            ict_tipo,
            ict_tipovalor,
            dct_valor,
            ict_empresa,
            ict_estado,
            ict_usuarioregistro,
            fct_fecharegistro
        ) VALUES (
            p_contrato_id,
            v_concepto_id,
            v_tipo,
            v_tipo_valor,
            v_valor,
            p_empresa_id,
            1,
            p_usuario_id,
            CURRENT_TIMESTAMP
        );
    END LOOP;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en sp_guardar_conceptos_trabajador: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO: sp_obtener_conceptos_trabajador
-- Descripción: Obtiene los conceptos de un trabajador por contrato y empresa
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_obtener_conceptos_trabajador(
    p_contrato_id BIGINT,
    p_empresa_id INTEGER
)
RETURNS TABLE (
    id BIGINT,
    contrato_id BIGINT,
    concepto_id BIGINT,
    concepto_codigo VARCHAR,
    concepto_descripcion VARCHAR,
    tipo VARCHAR,
    tipo_valor VARCHAR,
    valor DECIMAL(10,2),
    empresa_id INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.imconceptostrabajador_id as id,
        ct.ict_contratotrabajador as contrato_id,
        ct.ict_conceptos as concepto_id,
        t.tt_codsunat as concepto_codigo,
        c.tc_descripcion as concepto_descripcion,
        CASE ct.ict_tipo 
            WHEN 1 THEN 'VARIABLE'
            WHEN 2 THEN 'FIJO'
            ELSE 'VARIABLE'
        END as tipo,
        CASE ct.ict_tipovalor 
            WHEN 1 THEN 'MONTO'
            WHEN 2 THEN 'PORCENTAJE'
            ELSE 'MONTO'
        END as tipo_valor,
        ct.dct_valor as valor,
        ct.ict_empresa as empresa_id
    FROM public.rrhh_mconceptostrabajador ct
    INNER JOIN public.rrhh_mconceptos c ON ct.ict_conceptos = c.imconceptos_id
    LEFT JOIN public.rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
    WHERE ct.ict_contratotrabajador = p_contrato_id
      AND ct.ict_empresa = p_empresa_id
      AND ct.ict_estado = 1
    ORDER BY ct.imconceptostrabajador_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PROCEDIMIENTO: sp_eliminar_conceptos_trabajador
-- Descripción: Elimina todos los conceptos de un contrato (soft delete)
-- =====================================================
CREATE OR REPLACE FUNCTION public.sp_eliminar_conceptos_trabajador(
    p_contrato_id BIGINT,
    p_empresa_id INTEGER,
    p_usuario_id BIGINT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.rrhh_mconceptostrabajador
    SET ict_estado = 0,
        ict_usuarioelimino = p_usuario_id,
        fct_fechaelimino = CURRENT_TIMESTAMP
    WHERE ict_contratotrabajador = p_contrato_id
      AND ict_empresa = p_empresa_id
      AND ict_estado = 1;
    
    RETURN TRUE;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en sp_eliminar_conceptos_trabajador: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Mensaje de confirmación
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Tabla rrhh_mconceptostrabajador y procedimientos creados exitosamente';
END $$;
