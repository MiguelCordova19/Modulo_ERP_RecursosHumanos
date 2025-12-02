-- =====================================================
-- PROBAR CONSULTA DE CONTRATOS PASO A PASO
-- =====================================================

-- Paso 1: Verificar que hay datos en la tabla de contratos
SELECT COUNT(*) as total_contratos FROM public.rrhh_mcontratotrabajador;

-- Paso 2: Probar JOIN con trabajador
SELECT 
    c.imcontratotrabajador_id,
    c.ict_trabajador,
    t.tt_nrodoc,
    t.tt_apellidopaterno
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
LIMIT 5;

-- Paso 3: Probar JOIN con sede
SELECT 
    c.imcontratotrabajador_id,
    c.ict_sede,
    s.ts_descripcion
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
LIMIT 5;

-- Paso 4: Probar JOIN con puesto
SELECT 
    c.imcontratotrabajador_id,
    c.ict_puesto,
    p.tp_descripcion
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_mpuestos p ON c.ict_puesto = p.impuesto_id
LIMIT 5;

-- Paso 5: Probar JOIN con tipo contrato
SELECT 
    c.imcontratotrabajador_id,
    c.ict_tipocontrato,
    tc.ttc_descripcion
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_mtipocontrato tc ON c.ict_tipocontrato = tc.imtipocontrato_id
LIMIT 5;

-- Paso 6: Consulta completa
SELECT 
    c.imcontratotrabajador_id as id,
    c.ict_trabajador as trabajadorid,
    t.tt_nrodoc as numerodocumento,
    t.tt_apellidopaterno as apellidopaterno,
    t.tt_apellidomaterno as apellidomaterno,
    t.tt_nombres as nombres,
    c.fct_fechainiciolaboral as fechainiciolaboral,
    c.fct_fechafinlaboral as fechafinlaboral,
    c.ict_sede as sedeid,
    s.ts_descripcion as sededescripcion,
    c.ict_puesto as puestoid,
    p.tp_descripcion as puestodescripcion,
    c.ict_tipocontrato as tipocontratoid,
    tc.ttc_descripcion as tipocontratodescripcion,
    c.hct_horalaboral as horalaboral,
    c.dct_sueldomensual as sueldomensual,
    c.ict_estado as estado
FROM public.rrhh_mcontratotrabajador c
INNER JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
INNER JOIN public.rrhh_msede s ON c.ict_sede = s.imsede_id
INNER JOIN public.rrhh_mpuestos p ON c.ict_puesto = p.impuesto_id
INNER JOIN public.rrhh_mtipocontrato tc ON c.ict_tipocontrato = tc.imtipocontrato_id
WHERE c.ict_empresa = 1 AND c.ict_estado = 1
ORDER BY c.fct_fechainiciolaboral DESC
LIMIT 5;
