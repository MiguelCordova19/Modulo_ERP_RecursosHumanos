-- Script para verificar contratos activos y sus datos

-- 1. Ver todos los contratos activos con sus datos básicos
SELECT 
    c.imcontratotrabajador_id as contrato_id,
    c.ict_trabajador as trabajador_id,
    t.tt_nrodoc as documento,
    t.tt_apellidopaterno || ' ' || t.tt_apellidomaterno || ' ' || t.tt_nombres as nombre_completo,
    c.ict_sede as sede_id,
    s.ts_descripcion as sede,
    c.ict_turno as turno_id,
    tu.tt_descripcion as turno,
    c.fct_fechainiciolaboral as fecha_inicio_laboral,
    c.fct_fechainicio as fecha_inicio_contrato,
    c.fct_fechafinlaboral as fecha_fin_laboral,
    c.ict_estado as estado,
    c.ict_empresa as empresa_id
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
INNER JOIN public.rrhh_mturno tu ON c.ict_turno = tu.imturno_id
WHERE c.ict_estado = 1
ORDER BY c.fct_fechainiciolaboral DESC;

-- 2. Ver sedes disponibles
SELECT 
    imsede_id as id,
    ts_codigo as codigo,
    ts_descripcion as descripcion,
    is_empresa as empresa_id,
    is_estado as estado
FROM public.rrhh_msede
WHERE is_estado = 1
ORDER BY ts_descripcion;

-- 3. Ver turnos disponibles
SELECT 
    imturno_id as id,
    tt_descripcion as descripcion,
    it_estado as estado
FROM public.rrhh_mturno
WHERE it_estado = 1
ORDER BY tt_descripcion;

-- 4. Probar la consulta con filtros específicos (ajusta los valores según tus datos)
-- Ejemplo: empresaId=3, sedeId=1, turnoId='MA', fecha='2025-12-03'
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
    s.ts_descripcion as sededescripcion
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
INNER JOIN public.rrhh_mturno tu ON c.ict_turno = tu.imturno_id
WHERE c.ict_empresa = 3  -- Cambia este valor según tu empresa
AND c.ict_sede = 1       -- Cambia este valor según tu sede
AND c.ict_turno = 'MA'   -- Cambia este valor según tu turno
AND c.ict_estado = 1
AND c.fct_fechainicio <= '2025-12-03'  -- Cambia esta fecha
AND (c.fct_fechafinlaboral IS NULL OR c.fct_fechafinlaboral >= '2025-12-03')
ORDER BY t.tt_apellidopaterno, t.tt_apellidomaterno, t.tt_nombres;

-- 5. Ver qué contratos hay sin filtrar por turno (para ver si el problema es el turno)
SELECT 
    c.imcontratotrabajador_id,
    t.tt_nrodoc,
    t.tt_apellidopaterno || ' ' || t.tt_apellidomaterno || ' ' || t.tt_nombres as nombre,
    s.ts_descripcion as sede,
    tu.tt_descripcion as turno,
    c.ict_turno as turno_id,
    c.fct_fechainicio,
    c.fct_fechafinlaboral
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
INNER JOIN public.rrhh_mturno tu ON c.ict_turno = tu.imturno_id
WHERE c.ict_empresa = 3  -- Cambia según tu empresa
AND c.ict_sede = 1       -- Cambia según tu sede
AND c.ict_estado = 1
ORDER BY t.tt_apellidopaterno;
