-- =====================================================
-- INSERTAR CONTRATO DE PRUEBA
-- =====================================================

-- Primero verificar que existan los datos necesarios
DO $$
DECLARE
    v_trabajador_id BIGINT;
    v_tipo_contrato_id INTEGER;
    v_sede_id BIGINT;
    v_puesto_id INTEGER;
    v_tipo_trabajador_id INTEGER;
    v_regimen_pensionario_id INTEGER;
    v_regimen_laboral_id BIGINT;
    v_contrato_id BIGINT;
BEGIN
    -- Obtener un trabajador de PLANILLA
    SELECT itrabajador_id INTO v_trabajador_id
    FROM public.rrhh_trabajador
    WHERE tt_tipotrabajador = '01' -- PLANILLA
    AND tt_estado = 1
    LIMIT 1;
    
    IF v_trabajador_id IS NULL THEN
        RAISE NOTICE '❌ No hay trabajadores de PLANILLA disponibles';
        RETURN;
    END IF;
    
    -- Obtener un tipo de contrato
    SELECT imtipocontrato_id INTO v_tipo_contrato_id
    FROM public.rrhh_mtipocontrato
    WHERE tmc_estado = 1
    LIMIT 1;
    
    IF v_tipo_contrato_id IS NULL THEN
        RAISE NOTICE '❌ No hay tipos de contrato disponibles';
        RETURN;
    END IF;
    
    -- Obtener una sede
    SELECT imsede_id INTO v_sede_id
    FROM public.rrhh_msede
    WHERE ts_estado = 1
    LIMIT 1;
    
    IF v_sede_id IS NULL THEN
        RAISE NOTICE '❌ No hay sedes disponibles';
        RETURN;
    END IF;
    
    -- Obtener un puesto
    SELECT impuesto_id INTO v_puesto_id
    FROM public.rrhh_mpuestos
    WHERE tp_estado = 1
    LIMIT 1;
    
    IF v_puesto_id IS NULL THEN
        RAISE NOTICE '❌ No hay puestos disponibles';
        RETURN;
    END IF;
    
    -- Obtener un tipo de trabajador
    SELECT imtipotrabajador_id INTO v_tipo_trabajador_id
    FROM public.rrhh_mtipotrabajador
    WHERE tmt_estado = 1
    LIMIT 1;
    
    IF v_tipo_trabajador_id IS NULL THEN
        RAISE NOTICE '❌ No hay tipos de trabajador disponibles';
        RETURN;
    END IF;
    
    -- Obtener un régimen pensionario
    SELECT imregimenpensionario_id INTO v_regimen_pensionario_id
    FROM public.rrhh_mregimenpensionario
    WHERE trp_estado = 1
    LIMIT 1;
    
    IF v_regimen_pensionario_id IS NULL THEN
        RAISE NOTICE '❌ No hay regímenes pensionarios disponibles';
        RETURN;
    END IF;
    
    -- Obtener un régimen laboral con conceptos
    SELECT imconceptosregimen_id INTO v_regimen_laboral_id
    FROM public.rrhh_conceptos_regimen_laboral
    WHERE tcrl_estado = 1
    LIMIT 1;
    
    IF v_regimen_laboral_id IS NULL THEN
        RAISE NOTICE '❌ No hay regímenes laborales con conceptos disponibles';
        RETURN;
    END IF;
    
    -- Verificar si ya existe un contrato para este trabajador
    SELECT imcontratotrabajador_id INTO v_contrato_id
    FROM public.rrhh_mcontratotrabajador
    WHERE ict_trabajador = v_trabajador_id
    AND ict_estado = 1
    LIMIT 1;
    
    IF v_contrato_id IS NOT NULL THEN
        RAISE NOTICE '⚠️ Ya existe un contrato activo para el trabajador ID: %', v_trabajador_id;
        RAISE NOTICE 'Contrato ID: %', v_contrato_id;
        RETURN;
    END IF;
    
    -- Insertar contrato de prueba usando el procedimiento almacenado
    v_contrato_id := public.sp_guardar_contrato_trabajador(
        v_trabajador_id,           -- trabajador_id
        v_tipo_contrato_id,        -- tipo_contrato_id
        CURRENT_DATE,              -- fecha_inicio
        NULL,                      -- fecha_fin (indefinido)
        v_sede_id,                 -- sede_id
        v_puesto_id,               -- puesto_id
        '01',                      -- turno_id (DIURNO)
        '01',                      -- horario_id (NORMAL)
        '08:00:00'::TIME,          -- hora_entrada
        '17:00:00'::TIME,          -- hora_salida
        '07',                      -- dia_descanso_id (DOMINGO)
        v_tipo_trabajador_id,      -- tipo_trabajador_id
        v_regimen_pensionario_id,  -- regimen_pensionario_id
        v_regimen_laboral_id,      -- regimen_laboral_id
        8.0,                       -- hora_laboral
        1500.00,                   -- remuneracion_basica
        0.00,                      -- remuneracion_rc
        1500.00,                   -- sueldo_mensual
        NULL,                      -- cuspp
        1,                         -- empresa_id
        1                          -- usuario_id
    );
    
    RAISE NOTICE '✅ Contrato de prueba insertado exitosamente';
    RAISE NOTICE 'Contrato ID: %', v_contrato_id;
    RAISE NOTICE 'Trabajador ID: %', v_trabajador_id;
    
END $$;
