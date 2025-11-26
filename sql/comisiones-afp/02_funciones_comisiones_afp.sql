-- =====================================================
-- Script: Funciones para rrhh_mafp (PostgreSQL)
-- Descripción: Funciones CRUD para comisiones AFP
-- Fecha: 2025-11-25
-- =====================================================

-- =====================================================
-- FUNCIÓN: Listar comisiones AFP por empresa
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_comisiones_afp(p_empresaid INT)
RETURNS TABLE (
    id INT,
    mes INT,
    anio INT,
    regimenid INT,
    regimencodsunat VARCHAR,
    regimenabreviatura VARCHAR,
    comisionflujo DECIMAL,
    comisionanualsaldo DECIMAL,
    primaseguro DECIMAL,
    aporteobligatorio DECIMAL,
    remunmaxima DECIMAL,
    estado INT,
    empresaid INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.imafp_id,
        a.ia_mes,
        a.ia_anio,
        a.ia_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        a.da_comisionflujo,
        a.da_comisionanualsaldo,
        a.da_primaseguro,
        a.da_aporteobligatorio,
        a.da_remunmaxima,
        a.ia_estado,
        a.empresa_id
    FROM rrhh_mafp a
    INNER JOIN rrhh_mregimenpensionario r ON a.ia_regimenpensionario = r.imregimenpensionario_id
    WHERE a.empresa_id = p_empresaid AND a.ia_estado = 1
    ORDER BY a.ia_anio DESC, a.ia_mes DESC, r.trp_abreviatura;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener comisión AFP por ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_comision_afp(p_id INT)
RETURNS TABLE (
    id INT,
    mes INT,
    anio INT,
    regimenid INT,
    regimencodsunat VARCHAR,
    regimenabreviatura VARCHAR,
    comisionflujo DECIMAL,
    comisionanualsaldo DECIMAL,
    primaseguro DECIMAL,
    aporteobligatorio DECIMAL,
    remunmaxima DECIMAL,
    estado INT,
    empresaid INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.imafp_id,
        a.ia_mes,
        a.ia_anio,
        a.ia_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        a.da_comisionflujo,
        a.da_comisionanualsaldo,
        a.da_primaseguro,
        a.da_aporteobligatorio,
        a.da_remunmaxima,
        a.ia_estado,
        a.empresa_id
    FROM rrhh_mafp a
    INNER JOIN rrhh_mregimenpensionario r ON a.ia_regimenpensionario = r.imregimenpensionario_id
    WHERE a.imafp_id = p_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Guardar comisión AFP
-- =====================================================
CREATE OR REPLACE FUNCTION sp_guardar_comision_afp(
    p_mes INT,
    p_anio INT,
    p_regimenid INT,
    p_comisionflujo DECIMAL,
    p_comisionanualsaldo DECIMAL,
    p_primaseguro DECIMAL,
    p_aporteobligatorio DECIMAL,
    p_remunmaxima DECIMAL,
    p_empresaid INT
)
RETURNS INT AS $$
DECLARE
    v_id INT;
BEGIN
    INSERT INTO rrhh_mafp (
        ia_mes,
        ia_anio,
        ia_regimenpensionario,
        da_comisionflujo,
        da_comisionanualsaldo,
        da_primaseguro,
        da_aporteobligatorio,
        da_remunmaxima,
        ia_estado,
        empresa_id
    ) VALUES (
        p_mes,
        p_anio,
        p_regimenid,
        p_comisionflujo,
        p_comisionanualsaldo,
        p_primaseguro,
        p_aporteobligatorio,
        p_remunmaxima,
        1,
        p_empresaid
    )
    RETURNING imafp_id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Actualizar comisión AFP
-- =====================================================
CREATE OR REPLACE FUNCTION sp_actualizar_comision_afp(
    p_id INT,
    p_mes INT,
    p_anio INT,
    p_regimenid INT,
    p_comisionflujo DECIMAL,
    p_comisionanualsaldo DECIMAL,
    p_primaseguro DECIMAL,
    p_aporteobligatorio DECIMAL,
    p_remunmaxima DECIMAL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE rrhh_mafp
    SET 
        ia_mes = p_mes,
        ia_anio = p_anio,
        ia_regimenpensionario = p_regimenid,
        da_comisionflujo = p_comisionflujo,
        da_comisionanualsaldo = p_comisionanualsaldo,
        da_primaseguro = p_primaseguro,
        da_aporteobligatorio = p_aporteobligatorio,
        da_remunmaxima = p_remunmaxima
    WHERE imafp_id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Eliminar comisión AFP (lógico)
-- =====================================================
CREATE OR REPLACE FUNCTION sp_eliminar_comision_afp(p_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE rrhh_mafp
    SET ia_estado = 0
    WHERE imafp_id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Funciones de comisiones AFP creadas exitosamente';
END $$;
