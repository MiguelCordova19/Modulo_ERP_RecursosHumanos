-- =====================================================
-- ACTUALIZAR EMPRESA DEL RÉGIMEN LABORAL
-- =====================================================

-- Opción 1: Actualizar el régimen laboral ID 2 para que pertenezca a la empresa 3
UPDATE rrhh_conceptos_regimen_laboral
SET ic_empresa = 3
WHERE imconceptosregimen_id = 2;

-- Verificar el cambio
SELECT 
    imconceptosregimen_id,
    ic_regimenlaboral,
    ic_empresa,
    ic_estado
FROM rrhh_conceptos_regimen_laboral
WHERE imconceptosregimen_id = 2;

-- Mensaje
DO $$
BEGIN
    RAISE NOTICE '✅ Régimen laboral ID 2 actualizado para empresa 3';
END $$;
