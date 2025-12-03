-- =====================================================
-- SCRIPT: Actualizar Tipo de Planilla a GLOBAL
-- Convierte la tabla de tipo de planilla de por-empresa a global
-- =====================================================

-- 1. Eliminar constraint único anterior
ALTER TABLE public.rrhh_mtipoplanilla 
DROP CONSTRAINT IF EXISTS uk_tipoplanilla_descripcion_empresa;

-- 2. Eliminar índice de empresa
DROP INDEX IF EXISTS idx_tipoplanilla_empresa;

-- 3. Eliminar columna itp_empresa (si existe)
ALTER TABLE public.rrhh_mtipoplanilla 
DROP COLUMN IF EXISTS itp_empresa;

-- 4. Agregar constraint único solo por descripción
ALTER TABLE public.rrhh_mtipoplanilla 
ADD CONSTRAINT uk_tipoplanilla_descripcion UNIQUE (ttp_descripcion);

-- 5. Agregar constraint único para código
ALTER TABLE public.rrhh_mtipoplanilla 
ADD CONSTRAINT uk_tipoplanilla_codigo UNIQUE (ttp_codigo);

-- 6. Eliminar duplicados si existen (mantener el primero)
DELETE FROM public.rrhh_mtipoplanilla a
USING public.rrhh_mtipoplanilla b
WHERE a.imtipoplanilla_id > b.imtipoplanilla_id
AND a.ttp_descripcion = b.ttp_descripcion;

-- 7. Actualizar función sp_listar_tipos_planilla (sin parámetro empresa)
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

-- 8. Actualizar función sp_insertar_tipo_planilla (sin parámetro empresa)
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

-- 9. Actualizar comentarios
COMMENT ON TABLE public.rrhh_mtipoplanilla IS 'Tabla maestra de tipos de planilla (GLOBAL - compartida entre todas las empresas)';

-- 10. Verificar datos
SELECT * FROM public.rrhh_mtipoplanilla ORDER BY ttp_descripcion;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
