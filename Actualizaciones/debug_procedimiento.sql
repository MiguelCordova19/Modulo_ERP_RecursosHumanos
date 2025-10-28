-- Script para debuggear el problema del procedimiento

-- 1. Ver TODOS los procedimientos y funciones relacionados con usuario
SELECT 
    n.nspname as esquema,
    p.proname as nombre,
    CASE p.prokind
        WHEN 'f' THEN 'FUNCTION'
        WHEN 'p' THEN 'PROCEDURE'
        WHEN 'a' THEN 'AGGREGATE'
        WHEN 'w' THEN 'WINDOW'
    END as tipo,
    pg_get_function_arguments(p.oid) as argumentos,
    pg_get_function_result(p.oid) as retorno
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname LIKE '%guardar_usuario%'
ORDER BY p.proname, p.prokind;

-- 2. Intentar llamar al procedimiento directamente
DO $$
DECLARE
    v_resultado_id BIGINT;
    v_resultado_usuario VARCHAR(50);
    v_resultado_mensaje VARCHAR(200);
BEGIN
    CALL sp_guardar_usuario(
        7,                      -- p_id (usuario existente)
        'test_user',            -- p_usuario
        NULL,                   -- p_password (no cambiar)
        'Test',                 -- p_nombres
        'Usuario',              -- p_apellido_paterno
        'Prueba',               -- p_apellido_materno
        1,                      -- p_empresa_id
        NULL,                   -- p_sede_id
        1,                      -- p_tipo_documento_id
        '99999999',             -- p_nro_documento
        '1990-01-01'::DATE,     -- p_fecha_nacimiento
        1,                      -- p_rol_id
        1,                      -- p_puesto_id
        '999999999',            -- p_nro_celular
        'test@test.com',        -- p_correo
        v_resultado_id,         -- OUT
        v_resultado_usuario,    -- OUT
        v_resultado_mensaje     -- OUT
    );
    
    RAISE NOTICE 'Resultado ID: %', v_resultado_id;
    RAISE NOTICE 'Resultado Usuario: %', v_resultado_usuario;
    RAISE NOTICE 'Resultado Mensaje: %', v_resultado_mensaje;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;

-- 3. Ver la definición completa del procedimiento
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'sp_guardar_usuario'
  AND prokind = 'p';  -- Solo procedimientos
