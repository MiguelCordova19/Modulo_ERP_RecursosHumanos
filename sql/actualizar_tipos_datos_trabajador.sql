-- =====================================================
-- Script: Actualizar tipos de datos en RRHH_TRABAJADOR
-- Descripción: Cambiar tipos de datos de INTEGER a VARCHAR(2)
-- Fecha: 2025-12-01
-- =====================================================

-- Cambiar tipo de dato de it_turno
ALTER TABLE rrhh_trabajador 
ALTER COLUMN it_turno TYPE VARCHAR(2);

-- Cambiar tipo de dato de it_horario
ALTER TABLE rrhh_trabajador 
ALTER COLUMN it_horario TYPE VARCHAR(2);

-- Cambiar tipo de dato de it_diadescanso
ALTER TABLE rrhh_trabajador 
ALTER COLUMN it_diadescanso TYPE VARCHAR(2);

-- Verificar los cambios
SELECT 
    column_name, 
    data_type, 
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'rrhh_trabajador' 
  AND column_name IN ('it_turno', 'it_horario', 'it_diadescanso')
ORDER BY column_name;

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
