-- Debug: Verificar paso a paso por qué no trae resultados

-- 1. Ver el contrato que vemos en la imagen
SELECT 
    imcontratotrabajador_id,
    ict_trabajador,
    ict_empresa,
    ict_sede,
    ict_turno,
    ict_estado,
    fct_fechainicio,
    fct_fechafinlaboral
FROM public.rrhh_mcontratotrabajador
WHERE imcontratotrabajador_id = 6;

-- 2. Verificar si el JOIN con trabajador funciona
SELECT 
    c.imcontratotrabajador_id,
    c.ict_trabajador,
    t.itrabajador_id,
    t.tt_nrodoc
FROM public.rrhh_mcontratotrabajador c
LEFT JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
WHERE c.imcontratotrabajador_id = 6;

-- 3. Verificar si el JOIN con sede funciona
SELECT 
    c.imcontratotrabajador_id,
    c.ict_sede,
    s.imsede_id,
    s.ts_descripcion
FROM public.rrhh_mcontratotrabajador c
LEFT JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
WHERE c.imcontratotrabajador_id = 6;

-- 4. Verificar si el JOIN con turno funciona
SELECT 
    c.imcontratotrabajador_id,
    c.ict_turno,
    tu.imturno_id,
    tu.tt_descripcion
FROM public.rrhh_mcontratotrabajador c
LEFT JOIN public.rrhh_mturno tu ON c.ict_turno = tu.imturno_id
WHERE c.imcontratotrabajador_id = 6;

-- 5. Consulta completa con LEFT JOINs para ver dónde falla
SELECT 
    c.imcontratotrabajador_id as contratoid,
    c.ict_trabajador as trabajadorid,
    t.tt_nrodoc as numerodocumento,
    t.tt_apellidopaterno as apellidopaterno,
    t.tt_apellidomaterno as apellidomaterno,
    t.tt_nombres as nombres,
    c.fct_fechainiciolaboral as fechainiciolaboral,
    c.fct_fechainicio as fechainiciocontrato,
    c.hct_horaentrada as horaentrada,
    c.hct_horasalida as horasalida,
    c.ict_turno as turnoid,
    tu.tt_descripcion as turnodescripcion,
    c.ict_sede as sedeid,
    s.ts_descripcion as sededescripcion,
    -- Campos de debug
    c.ict_empresa,
    c.ict_estado,
    c.fct_fechafinlaboral
FROM public.rrhh_mcontratotrabajador c
LEFT JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
LEFT JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
LEFT JOIN public.rrhh_mturno tu ON c.ict_turno = tu.imturno_id
WHERE c.ict_empresa = 3
AND c.ict_sede = 1
AND c.ict_turno = '01'
AND c.ict_estado = 1
AND c.fct_fechainicio <= '2025-12-03'
AND (c.fct_fechafinlaboral IS NULL OR c.fct_fechafinlaboral >= '2025-12-03');

-- 6. Verificar tipos de datos de las columnas
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'rrhh_mcontratotrabajador'
AND column_name IN ('ict_turno', 'ict_sede', 'ict_empresa', 'ict_estado', 'fct_fechainicio', 'fct_fechafinlaboral')
ORDER BY ordinal_position;

-- 7. Ver el valor exacto del turno (con espacios o caracteres especiales)
SELECT 
    imcontratotrabajador_id,
    ict_turno,
    LENGTH(ict_turno) as longitud_turno,
    ASCII(SUBSTRING(ict_turno, 1, 1)) as ascii_primer_char,
    ASCII(SUBSTRING(ict_turno, 2, 1)) as ascii_segundo_char
FROM public.rrhh_mcontratotrabajador
WHERE imcontratotrabajador_id = 6;
