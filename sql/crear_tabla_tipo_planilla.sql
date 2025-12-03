-- =====================================================
-- SCRIPT: Crear tabla Tipo de Planilla
-- Tabla: rrhh_mtipoplanilla
-- Descripción: Almacena los tipos de planilla (Remuneraciones, Gratificaciones, CTS, etc.)
-- =====================================================

-- Crear tabla (GLOBAL - No por empresa)
CREATE TABLE IF NOT EXISTS public.rrhh_mtipoplanilla (
    imtipoplanilla_id BIGSERIAL PRIMARY KEY,
    ttp_descripcion VARCHAR(100) NOT NULL UNIQUE,
    ttp_codigo VARCHAR(20) UNIQUE,
    itp_estado INTEGER DEFAULT 1,
    itp_usuarioregistro BIGINT,
    ftp_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    itp_usuarioedito BIGINT,
    ftp_fechaedito TIMESTAMP,
    itp_usuarioelimino BIGINT,
    ftp_fechaelimino TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tipoplanilla_estado ON public.rrhh_mtipoplanilla(itp_estado);
CREATE INDEX IF NOT EXISTS idx_tipoplanilla_codigo ON public.rrhh_mtipoplanilla(ttp_codigo);

-- Comentarios
COMMENT ON TABLE public.rrhh_mtipoplanilla IS 'Tabla maestra de tipos de planilla (GLOBAL - compartida entre todas las empresas)';
COMMENT ON COLUMN public.rrhh_mtipoplanilla.imtipoplanilla_id IS 'ID único del tipo de planilla';
COMMENT ON COLUMN public.rrhh_mtipoplanilla.ttp_descripcion IS 'Descripción del tipo de planilla';
COMMENT ON COLUMN public.rrhh_mtipoplanilla.ttp_codigo IS 'Código del tipo de planilla';
COMMENT ON COLUMN public.rrhh_mtipoplanilla.itp_estado IS 'Estado: 1=Activo, 0=Inactivo';

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar tipos de planilla comunes (GLOBALES)
INSERT INTO public.rrhh_mtipoplanilla (ttp_descripcion, ttp_codigo, itp_estado, itp_usuarioregistro)
VALUES 
    ('PLANILLA DE REMUNERACIONES', 'REM', 1, 1),
    ('PLANILLA DE GRATIFICACIONES', 'GRAT', 1, 1),
    ('PLANILLA DE CTS', 'CTS', 1, 1),
    ('PLANILLA DE UTILIDADES', 'UTIL', 1, 1),
    ('PLANILLA DE VACACIONES', 'VAC', 1, 1),
    ('PLANILLA DE LIQUIDACIONES', 'LIQ', 1, 1)
ON CONFLICT (ttp_descripcion) DO NOTHING;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Función para listar tipos de planilla (GLOBAL - sin filtro de empresa)
CREATE OR REPLACE FUNCTION public.sp_listar_tipos_planilla() 
RETURNS TABLE (
    id BIGINT,
    descripcion VARCHAR,
    codigo VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tp.imtipoplanilla_id,
        tp.ttp_descripcion,
        tp.ttp_codigo
    FROM public.rrhh_mtipoplanilla tp
    WHERE tp.itp_estado = 1
    ORDER BY tp.ttp_descripcion;
END;
$$ LANGUAGE plpgsql;

-- Función para insertar tipo de planilla (GLOBAL)
CREATE OR REPLACE FUNCTION public.sp_insertar_tipo_planilla(
    p_descripcion VARCHAR,
    p_codigo VARCHAR,
    p_usuario_id BIGINT
) RETURNS BIGINT AS $$
DECLARE
    v_id BIGINT;
BEGIN
    INSERT INTO public.rrhh_mtipoplanilla (
        ttp_descripcion,
        ttp_codigo,
        itp_estado,
        itp_usuarioregistro,
        ftp_fecharegistro
    ) VALUES (
        p_descripcion,
        p_codigo,
        1,
        p_usuario_id,
        CURRENT_TIMESTAMP
    ) RETURNING imtipoplanilla_id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar tipo de planilla
CREATE OR REPLACE FUNCTION public.sp_actualizar_tipo_planilla(
    p_id BIGINT,
    p_descripcion VARCHAR,
    p_codigo VARCHAR,
    p_usuario_id BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    v_rows INTEGER;
BEGIN
    UPDATE public.rrhh_mtipoplanilla
    SET ttp_descripcion = p_descripcion,
        ttp_codigo = p_codigo,
        itp_usuarioedito = p_usuario_id,
        ftp_fechaedito = CURRENT_TIMESTAMP
    WHERE imtipoplanilla_id = p_id;
    
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    RETURN v_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Función para eliminar tipo de planilla (soft delete)
CREATE OR REPLACE FUNCTION public.sp_eliminar_tipo_planilla(
    p_id BIGINT,
    p_usuario_id BIGINT
) RETURNS BOOLEAN AS $$
DECLARE
    v_rows INTEGER;
BEGIN
    UPDATE public.rrhh_mtipoplanilla
    SET itp_estado = 0,
        itp_usuarioelimino = p_usuario_id,
        ftp_fechaelimino = CURRENT_TIMESTAMP
    WHERE imtipoplanilla_id = p_id;
    
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    RETURN v_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMENTARIOS DE FUNCIONES
-- =====================================================

COMMENT ON FUNCTION public.sp_listar_tipos_planilla IS 'Lista tipos de planilla activos de una empresa';
COMMENT ON FUNCTION public.sp_insertar_tipo_planilla IS 'Inserta un nuevo tipo de planilla';
COMMENT ON FUNCTION public.sp_actualizar_tipo_planilla IS 'Actualiza un tipo de planilla existente';
COMMENT ON FUNCTION public.sp_eliminar_tipo_planilla IS 'Elimina (soft delete) un tipo de planilla';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Verificar datos insertados
SELECT * FROM public.rrhh_mtipoplanilla ORDER BY ttp_descripcion;

