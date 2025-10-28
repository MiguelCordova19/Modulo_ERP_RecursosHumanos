-- Script para verificar si el procedimiento sp_guardar_usuario existe

-- 1. Ver si el procedimiento existe
SELECT 
    p.proname AS nombre_procedimiento,
    pg_get_function_arguments(p.oid) AS argumentos,
    pg_get_function_result(p.oid) AS retorno
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'sp_guardar_usuario';

-- 2. Ver la definición completa del procedimiento
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'sp_guardar_usuario';

-- 3. Listar todos los procedimientos relacionados con usuarios
SELECT 
    p.proname AS nombre,
    p.prokind AS tipo,
    pg_get_function_arguments(p.oid) AS argumentos
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname LIKE '%usuario%'
ORDER BY p.proname;
