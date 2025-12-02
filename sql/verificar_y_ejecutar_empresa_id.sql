-- =====================================================
-- VERIFICAR Y EJECUTAR SCRIPT DE EMPRESA_ID
-- =====================================================

-- Verificar si la columna ict_empresa existe
DO $$
DECLARE
    v_existe BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'rrhh_mcontratotrabajador' 
        AND column_name = 'ict_empresa'
    ) INTO v_existe;
    
    IF v_existe THEN
        RAISE NOTICE '✅ La columna ict_empresa ya existe en la tabla rrhh_mcontratotrabajador';
    ELSE
        RAISE NOTICE '❌ La columna ict_empresa NO existe. Ejecute el script: sql/agregar_empresa_id_contrato.sql';
    END IF;
END $$;

-- Consulta para verificar la estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'rrhh_mcontratotrabajador'
ORDER BY ordinal_position;
