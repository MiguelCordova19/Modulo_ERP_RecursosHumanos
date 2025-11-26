-- =====================================================
-- Crear solo la función sp_crear_motivo_prestamo
-- Para debugging
-- =====================================================

DROP FUNCTION IF EXISTS sp_crear_motivo_prestamo(VARCHAR, INT);

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
    IF NOT EXISTS (SELECT 1 FROM rrhh_mempresa WHERE iempresa_id = p_empresaid) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    -- Validar que no exista un motivo con la misma descripción en la empresa
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND iempresa_id = p_empresaid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un motivo activo con esta descripción';
    END IF;
    
    -- Insertar el nuevo motivo
    INSERT INTO rrhh_mmotivoprestamo (
        tmp_descripcion,
        imp_estado,
        iempresa_id,
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
        iempresa_id,
        dtmp_fechacreacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = v_motivoid;
END;
$$ LANGUAGE plpgsql;

-- Probar la función
SELECT * FROM sp_crear_motivo_prestamo('Prueba desde SQL', 1);
