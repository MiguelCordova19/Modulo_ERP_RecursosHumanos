-- =====================================================
-- Script: Insertar datos iniciales en RRHH_MMOTIVOPRESTAMO (PostgreSQL)
-- Descripción: Datos de ejemplo para motivos de préstamos
-- Fecha: 2025-11-06
-- =====================================================

DO $$
DECLARE
    v_EmpresaId INT;
BEGIN
    -- Obtener el ID de la primera empresa activa
    SELECT imempresa_id INTO v_EmpresaId
    FROM rrhh_mempresa 
    WHERE imempresa_estado = 1
    ORDER BY imempresa_id
    LIMIT 1;

    IF v_EmpresaId IS NOT NULL THEN
        RAISE NOTICE 'Insertando motivos de préstamo para empresa ID: %', v_EmpresaId;
        
        INSERT INTO rrhh_mmotivoprestamo (tmp_descripcion, imp_estado, imempresa_id)
        VALUES 
            ('Emergencia médica', 1, v_EmpresaId),
            ('Educación', 1, v_EmpresaId),
            ('Vivienda', 1, v_EmpresaId),
            ('Vehículo', 1, v_EmpresaId),
            ('Calamidad doméstica', 1, v_EmpresaId),
            ('Gastos personales', 1, v_EmpresaId),
            ('Consolidación de deudas', 1, v_EmpresaId);
        
        RAISE NOTICE 'Datos de ejemplo insertados exitosamente';
    ELSE
        RAISE NOTICE 'No se encontró ninguna empresa activa. Por favor, cree una empresa primero.';
    END IF;
END $$;

-- Mostrar los datos insertados
SELECT 
    iMMMotivoPrestamo_Id AS "ID",
    tMP_Descripcion AS "Descripcion",
    CASE iMP_Estado 
        WHEN 1 THEN 'Activo' 
        ELSE 'Inactivo' 
    END AS "Estado",
    iEmpresa_Id AS "EmpresaID",
    dtMP_FechaCreacion AS "FechaCreacion"
FROM RRHH_MMOTIVOPRESTAMO
ORDER BY iMMMotivoPrestamo_Id;
