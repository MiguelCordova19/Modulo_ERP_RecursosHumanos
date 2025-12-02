-- =====================================================
-- VERIFICAR DATOS EN TABLA DE CONTRATOS
-- =====================================================

-- Contar contratos por empresa
SELECT 
    ict_empresa as empresa_id,
    COUNT(*) as total_contratos,
    SUM(CASE WHEN ict_estado = 1 THEN 1 ELSE 0 END) as contratos_activos,
    SUM(CASE WHEN ict_estado = 0 THEN 1 ELSE 0 END) as contratos_inactivos
FROM public.rrhh_mcontratotrabajador
GROUP BY ict_empresa;

-- Ver los primeros 5 contratos con información básica
SELECT 
    c.imcontratotrabajador_id as id,
    c.ict_trabajador as trabajador_id,
    t.tt_nrodoc as documento,
    t.tt_apellidopaterno || ' ' || t.tt_apellidomaterno || ' ' || t.tt_nombres as nombre_completo,
    c.fct_fechainiciolaboral as fecha_inicio,
    c.dct_sueldomensual as sueldo,
    c.ict_empresa as empresa_id,
    c.ict_estado as estado
FROM public.rrhh_mcontratotrabajador c
LEFT JOIN public.rrhh_trabajador t ON c.ict_trabajador = t.itrabajador_id
ORDER BY c.imcontratotrabajador_id DESC
LIMIT 5;
