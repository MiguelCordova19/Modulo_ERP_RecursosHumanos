-- =====================================================
-- SCRIPT: Agregar campo empresa a tabla existente
-- Descripción: Agrega el campo ict_empresa si la tabla ya existe
-- =====================================================

-- Verificar si la columna ya existe
DO $$
BEGIN
    -- Agregar columna ict_empresa si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'rrhh_mconceptostrabajador' 
        AND column_name = 'ict_empresa'
    ) THEN
        ALTER TABLE public.rrhh_mconceptostrabajador 
        ADD COLUMN ict_empresa INTEGER;
        
        RAISE NOTICE '✅ Columna ict_empresa agregada';
    ELSE
        RAISE NOTICE '⚠️ Columna ict_empresa ya existe';
    END IF;
END $$;

-- Actualizar registros existentes con empresa_id desde el contrato
UPDATE public.rrhh_mconceptostrabajador ct
SET ict_empresa = c.ict_empresa
FROM public.rrhh_mcontratotrabajador c
WHERE ct.ict_contratotrabajador = c.imcontratotrabajador_id
  AND ct.ict_empresa IS NULL;

-- Hacer el campo NOT NULL después de actualizar
ALTER TABLE public.rrhh_mconceptostrabajador 
ALTER COLUMN ict_empresa SET NOT NULL;

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_empresa 
    ON public.rrhh_mconceptostrabajador(ict_empresa);

CREATE INDEX IF NOT EXISTS idx_conceptostrabajador_empresa_estado 
    ON public.rrhh_mconceptostrabajador(ict_empresa, ict_estado);

-- Actualizar procedimientos almacenados
-- (Los procedimientos se reemplazan automáticamente con CREATE OR REPLACE)

-- Mensaje final
DO $$
BEGIN
    RAISE NOTICE '✅ Campo empresa agregado exitosamente';
    RAISE NOTICE '📋 Ejecuta el script crear_tabla_conceptos_trabajador.sql para actualizar los procedimientos';
END $$;
