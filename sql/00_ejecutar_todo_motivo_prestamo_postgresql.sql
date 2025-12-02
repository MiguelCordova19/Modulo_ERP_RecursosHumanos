-- =====================================================
-- Script Consolidado: Configuración Completa de Motivo Préstamo (PostgreSQL)
-- Descripción: Ejecuta todos los scripts necesarios en orden
-- Fecha: 2025-11-06
-- =====================================================

\echo '========================================'
\echo 'INICIANDO CONFIGURACIÓN DE MOTIVO PRÉSTAMO'
\echo '========================================'
\echo ''

-- =====================================================
-- PASO 1: CREAR TABLA
-- =====================================================
\echo 'PASO 1: Creando tabla RRHH_MMOTIVOPRESTAMO...'
\echo ''

-- Verificar si la tabla existe y eliminarla si es necesario
DROP TABLE IF EXISTS RRHH_MMOTIVOPRESTAMO CASCADE;

-- Crear la tabla
CREATE TABLE RRHH_MMOTIVOPRESTAMO (
    iMMMotivoPrestamo_Id SERIAL PRIMARY KEY,
    tMP_Descripcion VARCHAR(100) NOT NULL,
    iMP_Estado INT NOT NULL DEFAULT 1,
    iEmpresa_Id INT NOT NULL,
    dtMP_FechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dtMP_FechaModificacion TIMESTAMP NULL,
    
    CONSTRAINT FK_RRHH_MMOTIVOPRESTAMO_Empresa FOREIGN KEY (iEmpresa_Id) 
        REFERENCES RRHH_MEMPRESA(iEmpresa_Id)
);

-- Crear índices
CREATE INDEX IX_RRHH_MMOTIVOPRESTAMO_Estado 
    ON RRHH_MMOTIVOPRESTAMO(iMP_Estado);

CREATE INDEX IX_RRHH_MMOTIVOPRESTAMO_Empresa 
    ON RRHH_MMOTIVOPRESTAMO(iEmpresa_Id);

CREATE INDEX IX_RRHH_MMOTIVOPRESTAMO_Empresa_Estado 
    ON RRHH_MMOTIVOPRESTAMO(iEmpresa_Id, iMP_Estado);

\echo '✓ Tabla creada exitosamente'
\echo ''

-- =====================================================
-- PASO 2: INSERTAR DATOS DE EJEMPLO
-- =====================================================
\echo 'PASO 2: Insertando datos de ejemplo...'
\echo ''

DO $$
DECLARE
    v_EmpresaId INT;
BEGIN
    -- Obtener el ID de la primera empresa activa
    SELECT iEmpresa_Id INTO v_EmpresaId
    FROM RRHH_MEMPRESA 
    WHERE iEmpresa_Estado = 1
    ORDER BY iEmpresa_Id
    LIMIT 1;

    IF v_EmpresaId IS NOT NULL THEN
        RAISE NOTICE '  - Empresa ID: %', v_EmpresaId;
        
        INSERT INTO RRHH_MMOTIVOPRESTAMO (tMP_Descripcion, iMP_Estado, iEmpresa_Id)
        VALUES 
            ('Emergencia médica', 1, v_EmpresaId),
            ('Educación', 1, v_EmpresaId),
            ('Vivienda', 1, v_EmpresaId),
            ('Vehículo', 1, v_EmpresaId),
            ('Calamidad doméstica', 1, v_EmpresaId),
            ('Gastos personales', 1, v_EmpresaId),
            ('Consolidación de deudas', 1, v_EmpresaId);
        
        RAISE NOTICE '  ✓ 7 registros insertados';
    ELSE
        RAISE NOTICE '  ⚠ No se encontró ninguna empresa activa';
    END IF;
END $$;

\echo ''

-- =====================================================
-- PASO 3: CREAR FUNCIONES
-- =====================================================
\echo 'PASO 3: Creando funciones...'
\echo ''

-- FUNCIÓN: Listar motivos
CREATE OR REPLACE FUNCTION SP_LISTAR_MOTIVOS_PRESTAMO(p_EmpresaId INT)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaId INT,
    fechaCreacion TIMESTAMP,
    fechaModificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        iMMMotivoPrestamo_Id,
        tMP_Descripcion,
        iMP_Estado,
        iEmpresa_Id,
        dtMP_FechaCreacion,
        dtMP_FechaModificacion
    FROM RRHH_MMOTIVOPRESTAMO
    WHERE iEmpresa_Id = p_EmpresaId
    ORDER BY tMP_Descripcion;
END;
$$ LANGUAGE plpgsql;

\echo '  ✓ SP_LISTAR_MOTIVOS_PRESTAMO creada'

-- FUNCIÓN: Obtener motivo por ID
CREATE OR REPLACE FUNCTION SP_OBTENER_MOTIVO_PRESTAMO(
    p_MotivoId INT,
    p_EmpresaId INT
)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaId INT,
    fechaCreacion TIMESTAMP,
    fechaModificacion TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        iMMMotivoPrestamo_Id,
        tMP_Descripcion,
        iMP_Estado,
        iEmpresa_Id,
        dtMP_FechaCreacion,
        dtMP_FechaModificacion
    FROM RRHH_MMOTIVOPRESTAMO
    WHERE iMMMotivoPrestamo_Id = p_MotivoId
        AND iEmpresa_Id = p_EmpresaId;
END;
$$ LANGUAGE plpgsql;

\echo '  ✓ SP_OBTENER_MOTIVO_PRESTAMO creada'

-- FUNCIÓN: Crear motivo
CREATE OR REPLACE FUNCTION SP_CREAR_MOTIVO_PRESTAMO(
    p_Descripcion VARCHAR,
    p_EmpresaId INT
)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaId INT,
    fechaCreacion TIMESTAMP
) AS $$
DECLARE
    v_MotivoId INT;
BEGIN
    IF TRIM(p_Descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM RRHH_MEMPRESA WHERE iEmpresa_Id = p_EmpresaId) THEN
        RAISE EXCEPTION 'La empresa especificada no existe';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM RRHH_MMOTIVOPRESTAMO 
        WHERE tMP_Descripcion = p_Descripcion 
            AND iEmpresa_Id = p_EmpresaId
            AND iMP_Estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe un motivo activo con esta descripción';
    END IF;
    
    INSERT INTO RRHH_MMOTIVOPRESTAMO (
        tMP_Descripcion,
        iMP_Estado,
        iEmpresa_Id,
        dtMP_FechaCreacion
    )
    VALUES (
        p_Descripcion,
        1,
        p_EmpresaId,
        CURRENT_TIMESTAMP
    )
    RETURNING iMMMotivoPrestamo_Id INTO v_MotivoId;
    
    RETURN QUERY
    SELECT 
        iMMMotivoPrestamo_Id,
        tMP_Descripcion,
        iMP_Estado,
        iEmpresa_Id,
        dtMP_FechaCreacion
    FROM RRHH_MMOTIVOPRESTAMO
    WHERE iMMMotivoPrestamo_Id = v_MotivoId;
END;
$$ LANGUAGE plpgsql;

\echo '  ✓ SP_CREAR_MOTIVO_PRESTAMO creada'

-- FUNCIÓN: Actualizar motivo
CREATE OR REPLACE FUNCTION SP_ACTUALIZAR_MOTIVO_PRESTAMO(
    p_MotivoId INT,
    p_Descripcion VARCHAR,
    p_EmpresaId INT
)
RETURNS TABLE (
    id INT,
    descripcion VARCHAR,
    estado INT,
    empresaId INT,
    fechaCreacion TIMESTAMP,
    fechaModificacion TIMESTAMP
) AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM RRHH_MMOTIVOPRESTAMO 
        WHERE iMMMotivoPrestamo_Id = p_MotivoId 
            AND iEmpresa_Id = p_EmpresaId
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    IF TRIM(p_Descripcion) = '' THEN
        RAISE EXCEPTION 'La descripción no puede estar vacía';
    END IF;
    
    IF EXISTS (
        SELECT 1 
        FROM RRHH_MMOTIVOPRESTAMO 
        WHERE tMP_Descripcion = p_Descripcion 
            AND iEmpresa_Id = p_EmpresaId
            AND iMMMotivoPrestamo_Id != p_MotivoId
            AND iMP_Estado = 1
    ) THEN
        RAISE EXCEPTION 'Ya existe otro motivo activo con esta descripción';
    END IF;
    
    UPDATE RRHH_MMOTIVOPRESTAMO
    SET 
        tMP_Descripcion = p_Descripcion,
        dtMP_FechaModificacion = CURRENT_TIMESTAMP
    WHERE iMMMotivoPrestamo_Id = p_MotivoId
        AND iEmpresa_Id = p_EmpresaId;
    
    RETURN QUERY
    SELECT 
        iMMMotivoPrestamo_Id,
        tMP_Descripcion,
        iMP_Estado,
        iEmpresa_Id,
        dtMP_FechaCreacion,
        dtMP_FechaModificacion
    FROM RRHH_MMOTIVOPRESTAMO
    WHERE iMMMotivoPrestamo_Id = p_MotivoId;
END;
$$ LANGUAGE plpgsql;

\echo '  ✓ SP_ACTUALIZAR_MOTIVO_PRESTAMO creada'

-- FUNCIÓN: Eliminar motivo
CREATE OR REPLACE FUNCTION SP_ELIMINAR_MOTIVO_PRESTAMO(
    p_MotivoId INT,
    p_EmpresaId INT
)
RETURNS BOOLEAN AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM RRHH_MMOTIVOPRESTAMO 
        WHERE iMMMotivoPrestamo_Id = p_MotivoId 
            AND iEmpresa_Id = p_EmpresaId
    ) THEN
        RAISE EXCEPTION 'El motivo no existe o no pertenece a la empresa';
    END IF;
    
    UPDATE RRHH_MMOTIVOPRESTAMO
    SET 
        iMP_Estado = 0,
        dtMP_FechaModificacion = CURRENT_TIMESTAMP
    WHERE iMMMotivoPrestamo_Id = p_MotivoId
        AND iEmpresa_Id = p_EmpresaId;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

\echo '  ✓ SP_ELIMINAR_MOTIVO_PRESTAMO creada'
\echo ''

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================
\echo '========================================'
\echo 'VERIFICACIÓN FINAL'
\echo '========================================'
\echo ''

-- Mostrar datos insertados
SELECT 
    iMMMotivoPrestamo_Id AS "ID",
    tMP_Descripcion AS "Descripcion",
    CASE iMP_Estado 
        WHEN 1 THEN 'Activo' 
        ELSE 'Inactivo' 
    END AS "Estado",
    iEmpresa_Id AS "EmpresaID"
FROM RRHH_MMOTIVOPRESTAMO
ORDER BY iMMMotivoPrestamo_Id;

\echo ''
\echo '========================================'
\echo 'CONFIGURACIÓN COMPLETADA EXITOSAMENTE'
\echo '========================================'
\echo ''
\echo 'Puedes probar el sistema con:'
\echo 'SELECT * FROM SP_LISTAR_MOTIVOS_PRESTAMO(1);'
\echo ''
