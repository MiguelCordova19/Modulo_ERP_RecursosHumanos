-- =====================================================
-- SCRIPT: Crear tablas de Asistencia (Cabecera y Detalle)
-- =====================================================

-- Tabla Cabecera: RRHH_MASISTENCIA
CREATE TABLE IF NOT EXISTS public.rrhh_masistencia (
    imasistencia_id BIGSERIAL PRIMARY KEY,
    fa_fechaasistencia DATE NOT NULL,
    ia_turno VARCHAR(2) NOT NULL,
    ia_sede BIGINT NOT NULL,
    ia_empresa BIGINT NOT NULL,
    ia_estado INTEGER DEFAULT 1,
    ia_usuarioregistro BIGINT,
    fa_fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ia_usuarioedito BIGINT,
    fa_fechaedito TIMESTAMP,
    ia_usuarioelimino BIGINT,
    fa_fechaelimino TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_asistencia_turno FOREIGN KEY (ia_turno) 
        REFERENCES public.rrhh_mturno(imturno_id),
    CONSTRAINT fk_asistencia_sede FOREIGN KEY (ia_sede) 
        REFERENCES public.rrhh_msede(imsede_id),
    
    -- Índices para mejorar rendimiento
    CONSTRAINT uk_asistencia_fecha_turno_sede UNIQUE (fa_fechaasistencia, ia_turno, ia_sede, ia_empresa)
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON public.rrhh_masistencia(fa_fechaasistencia);
CREATE INDEX IF NOT EXISTS idx_asistencia_empresa ON public.rrhh_masistencia(ia_empresa);
CREATE INDEX IF NOT EXISTS idx_asistencia_estado ON public.rrhh_masistencia(ia_estado);

-- Comentarios
COMMENT ON TABLE public.rrhh_masistencia IS 'Tabla cabecera de asistencia de trabajadores';
COMMENT ON COLUMN public.rrhh_masistencia.imasistencia_id IS 'ID único de la asistencia';
COMMENT ON COLUMN public.rrhh_masistencia.fa_fechaasistencia IS 'Fecha de la asistencia';
COMMENT ON COLUMN public.rrhh_masistencia.ia_turno IS 'ID del turno';
COMMENT ON COLUMN public.rrhh_masistencia.ia_sede IS 'ID de la sede';
COMMENT ON COLUMN public.rrhh_masistencia.ia_empresa IS 'ID de la empresa';
COMMENT ON COLUMN public.rrhh_masistencia.ia_estado IS 'Estado: 1=Activo, 0=Inactivo';

-- =====================================================

-- Tabla Detalle: RRHH_MASISTENCIADETALLE
CREATE TABLE IF NOT EXISTS public.rrhh_masistenciadetalle (
    imasistenciadetalle_id BIGSERIAL PRIMARY KEY,
    iad_asistencia BIGINT NOT NULL,
    iad_trabajador BIGINT NOT NULL,
    iad_diadescanso INTEGER DEFAULT 0,
    iad_compdiadescanso INTEGER DEFAULT 0,
    iad_diaferiado INTEGER DEFAULT 0,
    iad_trabdiaferiado INTEGER DEFAULT 0,
    iad_falto INTEGER DEFAULT 0,
    had_horaingreso TIME,
    had_horatardanza TIME,
    tad_observacion VARCHAR(200),
    iad_empresa BIGINT NOT NULL,
    iad_estado INTEGER DEFAULT 1,
    
    -- Constraints
    CONSTRAINT fk_asistenciadetalle_asistencia FOREIGN KEY (iad_asistencia) 
        REFERENCES public.rrhh_masistencia(imasistencia_id) ON DELETE CASCADE,
    CONSTRAINT fk_asistenciadetalle_trabajador FOREIGN KEY (iad_trabajador) 
        REFERENCES public.rrhh_trabajador(itrabajador_id),
    
    -- Índices para mejorar rendimiento
    CONSTRAINT uk_asistenciadetalle_asistencia_trabajador UNIQUE (iad_asistencia, iad_trabajador)
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_asistenciadetalle_asistencia ON public.rrhh_masistenciadetalle(iad_asistencia);
CREATE INDEX IF NOT EXISTS idx_asistenciadetalle_trabajador ON public.rrhh_masistenciadetalle(iad_trabajador);
CREATE INDEX IF NOT EXISTS idx_asistenciadetalle_empresa ON public.rrhh_masistenciadetalle(iad_empresa);
CREATE INDEX IF NOT EXISTS idx_asistenciadetalle_estado ON public.rrhh_masistenciadetalle(iad_estado);

-- Comentarios
COMMENT ON TABLE public.rrhh_masistenciadetalle IS 'Tabla detalle de asistencia por trabajador';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.imasistenciadetalle_id IS 'ID único del detalle de asistencia';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_asistencia IS 'ID de la asistencia cabecera';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_trabajador IS 'ID del trabajador';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_diadescanso IS 'Día de descanso: 1=Sí, 0=No';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_compdiadescanso IS 'Compró día de descanso: 1=Sí, 0=No';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_diaferiado IS 'Día feriado: 1=Sí, 0=No';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_trabdiaferiado IS 'Trabajó día feriado: 1=Sí, 0=No';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.iad_falto IS 'Faltó: 1=Sí, 0=No';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.had_horaingreso IS 'Hora de ingreso del trabajador';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.had_horatardanza IS 'Hora de tardanza calculada';
COMMENT ON COLUMN public.rrhh_masistenciadetalle.tad_observacion IS 'Observaciones adicionales';

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para guardar asistencia completa (cabecera + detalles)
CREATE OR REPLACE FUNCTION public.sp_guardar_asistencia_completa(
    p_fecha_asistencia DATE,
    p_turno_id VARCHAR,
    p_sede_id BIGINT,
    p_empresa_id BIGINT,
    p_usuario_id BIGINT,
    p_detalles JSONB
) RETURNS BIGINT AS $$
DECLARE
    v_asistencia_id BIGINT;
    v_detalle JSONB;
BEGIN
    -- Verificar si ya existe una asistencia para esa fecha, turno y sede
    SELECT imasistencia_id INTO v_asistencia_id
    FROM public.rrhh_masistencia
    WHERE fa_fechaasistencia = p_fecha_asistencia
    AND ia_turno = p_turno_id
    AND ia_sede = p_sede_id
    AND ia_empresa = p_empresa_id
    AND ia_estado = 1;
    
    -- Si existe, actualizar
    IF v_asistencia_id IS NOT NULL THEN
        UPDATE public.rrhh_masistencia
        SET ia_usuarioedito = p_usuario_id,
            fa_fechaedito = CURRENT_TIMESTAMP
        WHERE imasistencia_id = v_asistencia_id;
        
        -- Eliminar detalles anteriores
        DELETE FROM public.rrhh_masistenciadetalle
        WHERE iad_asistencia = v_asistencia_id;
    ELSE
        -- Insertar nueva cabecera
        INSERT INTO public.rrhh_masistencia (
            fa_fechaasistencia,
            ia_turno,
            ia_sede,
            ia_empresa,
            ia_estado,
            ia_usuarioregistro,
            fa_fecharegistro
        ) VALUES (
            p_fecha_asistencia,
            p_turno_id,
            p_sede_id,
            p_empresa_id,
            1,
            p_usuario_id,
            CURRENT_TIMESTAMP
        ) RETURNING imasistencia_id INTO v_asistencia_id;
    END IF;
    
    -- Insertar detalles
    FOR v_detalle IN SELECT * FROM jsonb_array_elements(p_detalles)
    LOOP
        INSERT INTO public.rrhh_masistenciadetalle (
            iad_asistencia,
            iad_trabajador,
            iad_diadescanso,
            iad_compdiadescanso,
            iad_diaferiado,
            iad_trabdiaferiado,
            iad_falto,
            had_horaingreso,
            had_horatardanza,
            tad_observacion,
            iad_empresa,
            iad_estado
        ) VALUES (
            v_asistencia_id,
            (v_detalle->>'trabajadorId')::BIGINT,
            (v_detalle->>'diaDescanso')::INTEGER,
            (v_detalle->>'comproDiaDescanso')::INTEGER,
            (v_detalle->>'diaFeriado')::INTEGER,
            (v_detalle->>'diaFeriadoTrabajo')::INTEGER,
            (v_detalle->>'falto')::INTEGER,
            CASE WHEN v_detalle->>'horaIngreso' IS NOT NULL AND v_detalle->>'horaIngreso' != '' 
                THEN (v_detalle->>'horaIngreso')::TIME 
                ELSE NULL END,
            CASE WHEN v_detalle->>'horaTardanza' IS NOT NULL AND v_detalle->>'horaTardanza' != '' 
                THEN (v_detalle->>'horaTardanza')::TIME 
                ELSE NULL END,
            v_detalle->>'observacion',
            p_empresa_id,
            1
        );
    END LOOP;
    
    RETURN v_asistencia_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================

-- Procedimiento para listar asistencias con filtros
CREATE OR REPLACE FUNCTION public.sp_listar_asistencias(
    p_empresa_id BIGINT,
    p_fecha_desde DATE DEFAULT NULL,
    p_fecha_hasta DATE DEFAULT NULL,
    p_sede_id BIGINT DEFAULT NULL,
    p_turno_id VARCHAR DEFAULT NULL
) RETURNS TABLE (
    asistencia_id BIGINT,
    fecha_asistencia DATE,
    turno_id VARCHAR,
    turno_descripcion VARCHAR,
    sede_id BIGINT,
    sede_descripcion VARCHAR,
    total_trabajadores BIGINT,
    total_asistieron BIGINT,
    total_faltaron BIGINT,
    total_dia_descanso BIGINT,
    total_feriado BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.imasistencia_id,
        a.fa_fechaasistencia,
        a.ia_turno,
        t.tt_descripcion,
        a.ia_sede,
        s.ts_descripcion,
        COUNT(d.imasistenciadetalle_id) as total_trabajadores,
        COUNT(CASE WHEN d.iad_falto = 0 THEN 1 END) as total_asistieron,
        COUNT(CASE WHEN d.iad_falto = 1 THEN 1 END) as total_faltaron,
        COUNT(CASE WHEN d.iad_diadescanso = 1 THEN 1 END) as total_dia_descanso,
        COUNT(CASE WHEN d.iad_diaferiado = 1 THEN 1 END) as total_feriado
    FROM public.rrhh_masistencia a
    INNER JOIN public.rrhh_mturno t ON a.ia_turno = t.imturno_id
    INNER JOIN public.rrhh_msede s ON a.ia_sede = s.imsede_id
    LEFT JOIN public.rrhh_masistenciadetalle d ON a.imasistencia_id = d.iad_asistencia
    WHERE a.ia_empresa = p_empresa_id
    AND a.ia_estado = 1
    AND (p_fecha_desde IS NULL OR a.fa_fechaasistencia >= p_fecha_desde)
    AND (p_fecha_hasta IS NULL OR a.fa_fechaasistencia <= p_fecha_hasta)
    AND (p_sede_id IS NULL OR a.ia_sede = p_sede_id)
    AND (p_turno_id IS NULL OR a.ia_turno = p_turno_id)
    GROUP BY a.imasistencia_id, a.fa_fechaasistencia, a.ia_turno, t.tt_descripcion, a.ia_sede, s.ts_descripcion
    ORDER BY a.fa_fechaasistencia DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================

COMMENT ON FUNCTION public.sp_guardar_asistencia_completa IS 'Guarda o actualiza una asistencia completa con sus detalles';
COMMENT ON FUNCTION public.sp_listar_asistencias IS 'Lista asistencias con resumen de trabajadores';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
