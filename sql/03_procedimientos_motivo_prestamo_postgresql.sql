-- =====================================================
-- Script: Funciones para rrhh_mmotivoprestamo (PostgreSQL)
-- Descripción: CRUD completo para motivos de préstamos
-- Fecha: 2025-11-06
-- =====================================================

-- =====================================================
-- FUNCIÓN: Listar motivos de préstamo por empresa
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_motivos_prestamo(p_empresaid INT)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE imempresa_id = p_empresaid
        AND imp_estado = 1  -- Solo mostrar activos
    ORDER BY tmp_descripcion;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener motivo de préstamo por ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_motivo_prestamo(
    p_motivoid INT,
    p_empresaid INT
)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = p_motivoid
        AND imempresa_id = p_empresaid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Crear motivo de préstamo
-- =====================================================
CREATE OR REPLACE FUNCTION sp_crear_motivo_prestamo(
    p_descripcion VARCHAR,
    p_empresaid INT
)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP
) AS $$
DECLARE
    v_motivoid INT;
BEGIN
    -- Validar que la descripción no esté vacía
    IF TRIM(p_descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    -- Validar que la empresa exista
    IF NOT EXISTS (SELECT 1 FROM rrhh_mempresa WHERE imempresa_id = p_empresaid) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    -- Validar que no exista un motivo con la misma descripción en la empresa
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND imempresa_id = p_empresaid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un motivo activo con esta descripción en la empresa';
    END IF;
    
    -- Insertar el nuevo motivo
    INSERT INTO rrhh_mmotivoprestamo (
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion
    )
    VALUES (
        p_descripcion,
        1,
        p_empresaid,
        CURRENT_TIMESTAMP
    )
    RETURNING immmotivoprestamo_id INTO v_motivoid;
    
    -- Retornar el motivo creado
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = v_motivoid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Actualizar motivo de préstamo
-- =====================================================
CREATE OR REPLACE FUNCTION sp_actualizar_motivo_prestamo(
    p_motivoid INT,
    p_descripcion VARCHAR,
    p_empresaid INT
)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaid INT,
    fechacreacion TIMESTAMP,
    fechamodificacion TIMESTAMP
) AS $$
BEGIN
    -- Validar que el motivo exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE immmotivoprestamo_id = p_motivoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    -- Validar que la descripción no esté vacía
    IF TRIM(p_descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    -- Validar que no exista otro motivo con la misma descripción
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND imempresa_id = p_empresaid
            AND immmotivoprestamo_id != p_motivoid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe otro motivo activo con esta descripción';
    END IF;
    
    -- Actualizar el motivo
    UPDATE rrhh_mmotivoprestamo
    SET 
        tmp_descripcion = p_descripcion,
        dtmp_fechamodificacion = CURRENT_TIMESTAMP
    WHERE immmotivoprestamo_id = p_motivoid
        AND imempresa_id = p_empresaid;
    
    -- Retornar el motivo actualizado
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        imempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = p_motivoid;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Eliminar (cambiar estado) motivo de préstamo
-- =====================================================
CREATE OR REPLACE FUNCTION sp_eliminar_motivo_prestamo(
    p_motivoid INT,
    p_empresaid INT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validar que el motivo exista y pertenezca a la empresa
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE immmotivoprestamo_id = p_motivoid 
            AND imempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    -- Cambiar estado a inactivo (0)
    UPDATE rrhh_mmotivoprestamo
    SET 
        imp_estado = 0,
        dtmp_fechamodificacion = CURRENT_TIMESTAMP
    WHERE immmotivoprestamo_id = p_motivoid
        AND imempresa_id = p_empresaid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Funciones creadas exitosamente';
END $$;
