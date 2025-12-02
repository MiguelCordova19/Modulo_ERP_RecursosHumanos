-- =====================================================
-- Script Completo: Motivo Préstamo para PostgreSQL
-- Ejecutar todo de una vez
-- =====================================================

\echo '========================================';
\echo 'ELIMINANDO TABLA ANTERIOR SI EXISTE';
\echo '========================================';

DROP TABLE IF EXISTS rrhh_mmotivoprestamo CASCADE;

\echo '';
\echo '========================================';
\echo 'CREANDO TABLA';
\echo '========================================';

CREATE TABLE rrhh_mmotivoprestamo (
    immmotivoprestamo_id SERIAL PRIMARY KEY,
    tmp_descripcion VARCHAR(100) NOT NULL,
    imp_estado INT NOT NULL DEFAULT 1,
    iempresa_id INT NOT NULL,
    dtmp_fechacreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dtmp_fechamodificacion TIMESTAMP NULL,
    
    CONSTRAINT fk_rrhh_mmotivoprestamo_empresa FOREIGN KEY (iempresa_id) 
        REFERENCES rrhh_mempresa(iempresa_id)
);

CREATE INDEX ix_rrhh_mmotivoprestamo_estado 
    ON rrhh_mmotivoprestamo(imp_estado);

CREATE INDEX ix_rrhh_mmotivoprestamo_empresa 
    ON rrhh_mmotivoprestamo(iempresa_id);

CREATE INDEX ix_rrhh_mmotivoprestamo_empresa_estado 
    ON rrhh_mmotivoprestamo(iempresa_id, imp_estado);

\echo '✓ Tabla creada';
\echo '';
\echo '========================================';
\echo 'INSERTANDO DATOS DE EJEMPLO';
\echo '========================================';

DO $$
DECLARE
    v_empresaid INT;
BEGIN
    SELECT iempresa_id INTO v_empresaid
    FROM rrhh_mempresa 
    WHERE iempresa_estado = 1
    ORDER BY iempresa_id
    LIMIT 1;

    IF v_empresaid IS NOT NULL THEN
        INSERT INTO rrhh_mmotivoprestamo (tmp_descripcion, imp_estado, iempresa_id)
        VALUES 
            ('Emergencia médica', 1, v_empresaid),
            ('Educación', 1, v_empresaid),
            ('Vivienda', 1, v_empresaid),
            ('Vehículo', 1, v_empresaid),
            ('Calamidad doméstica', 1, v_empresaid),
            ('Gastos personales', 1, v_empresaid),
            ('Consolidación de deudas', 1, v_empresaid);
        
        RAISE NOTICE '✓ 7 registros insertados para empresa %', v_empresaid;
    ELSE
        RAISE NOTICE '⚠ No se encontró empresa activa';
    END IF;
END $$;

\echo '';
\echo '========================================';
\echo 'CREANDO FUNCIONES';
\echo '========================================';

-- Función: Listar
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
        iempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE iempresa_id = p_empresaid
    ORDER BY tmp_descripcion;
END;
$$ LANGUAGE plpgsql;

\echo '✓ sp_listar_motivos_prestamo';

-- Función: Obtener por ID
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
        iempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = p_motivoid
        AND iempresa_id = p_empresaid;
END;
$$ LANGUAGE plpgsql;

\echo '✓ sp_obtener_motivo_prestamo';

-- Función: Crear
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
    IF TRIM(p_descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM rrhh_mempresa WHERE iempresa_id = p_empresaid) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND iempresa_id = p_empresaid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un motivo activo con esta descripción';
    END IF;
    
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

\echo '✓ sp_crear_motivo_prestamo';

-- Función: Actualizar
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
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE immmotivoprestamo_id = p_motivoid 
            AND iempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    IF TRIM(p_descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE tmp_descripcion = p_descripcion 
            AND iempresa_id = p_empresaid
            AND immmotivoprestamo_id != p_motivoid
            AND imp_estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe otro motivo activo con esta descripción';
    END IF;
    
    UPDATE rrhh_mmotivoprestamo
    SET 
        tmp_descripcion = p_descripcion,
        dtmp_fechamodificacion = CURRENT_TIMESTAMP
    WHERE immmotivoprestamo_id = p_motivoid
        AND iempresa_id = p_empresaid;
    
    RETURN QUERY
    SELECT 
        immmotivoprestamo_id,
        tmp_descripcion,
        imp_estado,
        iempresa_id,
        dtmp_fechacreacion,
        dtmp_fechamodificacion
    FROM rrhh_mmotivoprestamo
    WHERE immmotivoprestamo_id = p_motivoid;
END;
$$ LANGUAGE plpgsql;

\echo '✓ sp_actualizar_motivo_prestamo';

-- Función: Eliminar
CREATE OR REPLACE FUNCTION sp_eliminar_motivo_prestamo(
    p_motivoid INT,
    p_empresaid INT
)
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM rrhh_mmotivoprestamo 
        WHERE immmotivoprestamo_id = p_motivoid 
            AND iempresa_id = p_empresaid
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    UPDATE rrhh_mmotivoprestamo
    SET 
        imp_estado = 0,
        dtmp_fechamodificacion = CURRENT_TIMESTAMP
    WHERE immmotivoprestamo_id = p_motivoid
        AND iempresa_id = p_empresaid;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

\echo '✓ sp_eliminar_motivo_prestamo';
\echo '';
\echo '========================================';
\echo 'VERIFICACIÓN';
\echo '========================================';

SELECT COUNT(*) as total_motivos FROM rrhh_mmotivoprestamo;

\echo '';
\echo '========================================';
\echo '✓ INSTALACIÓN COMPLETADA';
\echo '========================================';
\echo '';
\echo 'Probar con:';
\echo 'SELECT * FROM sp_listar_motivos_prestamo(1);';
\echo '';
