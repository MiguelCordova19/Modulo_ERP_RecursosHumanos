-- =====================================================
-- VERIFICAR REGÍMENES LABORALES POR EMPRESA
-- =====================================================

-- Ver todos los regímenes laborales con conceptos
SELECT 
    imconceptosregimen_id,
    ic_regimenlaboral,
    ic_empresa,
    ic_estado
FROM rrhh_conceptos_regimen_laboral
ORDER BY ic_empresa, imconceptosregimen_id;

-- Ver regímenes laborales para empresa 3
SELECT 
    imconceptosregimen_id,
    ic_regimenlaboral,
    ic_empresa,
    ic_estado
FROM rrhh_conceptos_regimen_laboral
WHERE ic_empresa = 3
AND ic_estado = 1;

-- Ver el régimen laboral del contrato ID 1
SELECT 
    c.imcontratotrabajador_id,
    c.ict_regimenlaboral,
    crl.ic_empresa
FROM rrhh_mcontratotrabajador c
LEFT JOIN rrhh_conceptos_regimen_laboral crl ON c.ict_regimenlaboral = crl.imconceptosregimen_id
WHERE c.imcontratotrabajador_id = 1;
