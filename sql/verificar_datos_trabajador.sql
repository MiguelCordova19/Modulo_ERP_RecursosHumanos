-- =====================================================
-- VERIFICAR DATOS DE TRABAJADOR
-- =====================================================

-- Ver todos los campos de un trabajador específico
SELECT 
    itrabajador_id,
    tt_nrodoc,
    tt_apellidopaterno,
    tt_nombres,
    -- Datos Laborales
    ft_fechaingreso,
    it_sede,
    it_puesto,
    it_turno,
    it_horario,
    it_diadescanso,
    tt_horaentrada,
    tt_horasalida,
    -- Datos de Pensión
    it_regimenpensionario,
    tt_cuspp
FROM rrhh_trabajador
WHERE it_estado = 1
ORDER BY itrabajador_id DESC
LIMIT 5;

-- Ver trabajadores con datos laborales completos
SELECT 
    t.itrabajador_id,
    t.tt_nrodoc,
    t.tt_apellidopaterno || ' ' || t.tt_nombres as nombre_completo,
    t.ft_fechaingreso,
    s.ts_descripcion as sede,
    p.tp_descripcion as puesto,
    t.it_turno,
    t.it_horario,
    t.it_diadescanso,
    t.tt_horaentrada,
    t.tt_horasalida,
    t.it_regimenpensionario,
    t.tt_cuspp
FROM rrhh_trabajador t
LEFT JOIN rrhh_msede s ON t.it_sede = s.imsede_id
LEFT JOIN rrhh_mpuestos p ON t.it_puesto = p.impuesto_id
WHERE t.it_estado = 1
AND t.it_en = '01' -- Solo PLANILLA
ORDER BY t.itrabajador_id DESC
LIMIT 5;
