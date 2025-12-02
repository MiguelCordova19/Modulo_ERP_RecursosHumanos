-- =====================================================
-- Script: Insertar datos iniciales en RRHH_MFERIADOS (PostgreSQL)
-- Descripción: Feriados de ejemplo para Perú 2025
-- Fecha: 2025-11-06
-- =====================================================

DO $$
DECLARE
    v_empresaid INT;
BEGIN
    -- Obtener el ID de la primera empresa activa
    SELECT imempresa_id INTO v_empresaid
    FROM rrhh_mempresa 
    WHERE imempresa_estado = 1
    ORDER BY imempresa_id
    LIMIT 1;

    IF v_empresaid IS NOT NULL THEN
        RAISE NOTICE 'Insertando feriados para empresa ID: %', v_empresaid;
        
        INSERT INTO rrhh_mferiados (ff_fechaferiado, tf_diaferiado, tf_denominacion, if_estado, imempresa_id)
        VALUES 
            ('2025-01-01', 'Miércoles', 'Año Nuevo', 1, v_empresaid),
            ('2025-04-17', 'Jueves', 'Jueves Santo', 1, v_empresaid),
            ('2025-04-18', 'Viernes', 'Viernes Santo', 1, v_empresaid),
            ('2025-05-01', 'Jueves', 'Día del Trabajador', 1, v_empresaid),
            ('2025-06-29', 'Domingo', 'Día de San Pedro y San Pablo', 1, v_empresaid),
            ('2025-07-28', 'Lunes', 'Fiestas Patrias', 1, v_empresaid),
            ('2025-07-29', 'Martes', 'Fiestas Patrias', 1, v_empresaid),
            ('2025-08-30', 'Sábado', 'Santa Rosa de Lima', 1, v_empresaid),
            ('2025-10-08', 'Miércoles', 'Combate de Angamos', 1, v_empresaid),
            ('2025-11-01', 'Sábado', 'Todos los Santos', 1, v_empresaid),
            ('2025-12-08', 'Lunes', 'Inmaculada Concepción', 1, v_empresaid),
            ('2025-12-25', 'Jueves', 'Navidad', 1, v_empresaid);
        
        RAISE NOTICE 'Datos de ejemplo insertados exitosamente';
    ELSE
        RAISE NOTICE 'No se encontró ninguna empresa activa';
    END IF;
END $$;

-- Mostrar los datos insertados
SELECT 
    imferiado_id AS "ID",
    ff_fechaferiado AS "Fecha",
    tf_diaferiado AS "Día",
    tf_denominacion AS "Denominación",
    CASE if_estado 
        WHEN 1 THEN 'Activo' 
        ELSE 'Inactivo' 
    END AS "Estado",
    imempresa_id AS "EmpresaID"
FROM rrhh_mferiados
ORDER BY ff_fechaferiado;
