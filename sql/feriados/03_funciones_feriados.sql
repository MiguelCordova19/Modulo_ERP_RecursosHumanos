-- =====================================================
-- Script: Funciones para rrhh_mferiados (PostgreSQL)
-- Descripción: CRUD completo para feriados
-- Fecha: 2025-11-06
-- =====================================================

-- =====================================================
-- FUNCIÓN: Listar feriados por empresa (solo activos)
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_feriados(p_empresaid INT)
RETURNS TABLE (
    id INT,
    fechaferiado DATE,
    diaferiado VARCHAR,
    denominacion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion,
        dtf_fechamodificacion
    FROM rrhh_mferiados
    WHERE imempresa_id = p_empresaid
        AND if_estado = 1
    ORDER BY ff_fechaferiado;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener feriado por ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_feriado(
    p_feriadoid INT,
    p_empresaid INT
)
RETURNS TABLE (
    id INT,
    fechaferiado DATE,
    diaferiado VARCHAR,
    denominacion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion,
        dtf_fechamodificacion
    FROM rrhh_mferiados
    WHERE imferiado_id = p_feriadoid
        AND imempresa_id = p_empresaid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Crear feriado
-- =====================================================
CREATE OR REPLACE FUNCTION sp_crear_feriado(
    p_fechaferiado DATE,
    p_diaferiado VARCHAR,
    p_denominacion VARCHAR,
    p_empresaid INT
)
RETURNS TABLE (
    id INT,
    fechaferiado DATE,
    diaferiado VARCHAR,
    denominacion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP
) AS $$
DECLARE
    v_feriadoid INT;
BEGIN
    -- Validar que la denominación no esté vacía
    IF TRIM(p_denominacion) = '' THEN
        RAISE EXCEPTION 'La denominación no puede estar vacía';
    END IF;
    
    -- Validar que la fecha no esté vacía
    IF p_fechaferiado IS NULL THEN
        RAISE EXCEPTION 'La fecha no puede estar vacía';
    END IF;
    
    -- Validar que la empresa exista
    IF NOT EXISTS (SELECT 1 FROM rrhh_mempresa WHERE imempresa_id = p_empresaid) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    -- Validar que no exista un feriado en la misma fecha para la empresa
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE ff_fechaferiado = p_fechaferiado 
            AND imempresa_id = p_empresaid
            AND if_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un feriado activo en esta fecha';
    END IF;
    
    -- Insertar el nuevo feriado
    INSERT INTO rrhh_mferiados (
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion
    )
    VALUES (
        p_fechaferiado,
        p_diaferiado,
        p_denominacion,
        1,
        p_empresaid,
        CURRENT_TIMESTAMP
    )
    RETURNING imferiado_id INTO v_feriadoid;
    
    -- Retornar el feriado creado
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion
    FROM rrhh_mferiados
    WHERE imferiado_id = v_feriadoid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Actualizar feriado
-- =====================================================
CREATE OR REPLACE FUNCTION sp_actualizar_feriado(
    p_feriadoid INT,
    p_fechaferiado DATE,
    p_diaferiado VARCHAR,
    p_denominacion VARCHAR,
    p_empresaid INT
)
RETURNS TABLE (
    id INT,
    fechaferiado DATE,
    diaferiado VARCHAR,
    denominacion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    -- Validar que el feriado exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE imferiado_id = p_feriadoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El feriado no existe o no pertenece a la empresa';
    END IF;
    
    -- Validar que la denominación no esté vacía
    IF TRIM(p_denominacion) = '' THEN
        RAISE EXCEPTION 'La denominación no puede estar vacía';
    END IF;
    
    -- Validar que no exista otro feriado en la misma fecha
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE ff_fechaferiado = p_fechaferiado 
            AND imempresa_id = p_empresaid
            AND imferiado_id != p_feriadoid
            AND if_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe otro feriado activo en esta fecha';
    END IF;
    
    -- Actualizar el feriado
    UPDATE rrhh_mferiados
    SET 
        ff_fechaferiado = p_fechaferiado,
        tf_diaferiado = p_diaferiado,
        tf_denominacion = p_denominacion,
        dtf_fechamodificacion = CURRENT_TIMESTAMP
    WHERE imferiado_id = p_feriadoid
        AND imempresa_id = p_empresaid;
    
    -- Retornar el feriado actualizado
    RETURN QUERY
    SELECT 
        imferiado_id,
        ff_fechaferiado,
        tf_diaferiado,
        tf_denominacion,
        if_estado,
        imempresa_id,
        dtf_fechacreacion,
        dtf_fechamodificacion
    FROM rrhh_mferiados
    WHERE imferiado_id = p_feriadoid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Eliminar (cambiar estado) feriado
-- =====================================================
CREATE OR REPLACE FUNCTION sp_eliminar_feriado(
    p_feriadoid INT,
    p_empresaid INT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validar que el feriado exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mferiados 
        WHERE imferiado_id = p_feriadoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El feriado no existe o no pertenece a la empresa';
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mferiados
    SET 
        if_estado = 0,
        dtf_fechamodificacion = CURRENT_TIMESTAMP
    WHERE imferiado_id = p_feriadoid
        AND imempresa_id = p_empresaid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Funciones de feriados creadas exitosamente';
END $$;
