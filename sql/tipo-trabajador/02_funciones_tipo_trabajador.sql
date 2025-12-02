-- =====================================================
-- Script: Funciones para rrhh_mtipotrabajador (PostgreSQL)
-- Descripción: Funciones CRUD para tipos de trabajador
-- Fecha: 2025-11-25
-- =====================================================

-- =====================================================
-- FUNCIÓN: Listar tipos de trabajador por empresa
-- =====================================================
CREATE OR REPLACE FUNCTION sp_listar_tipos_trabajador(p_empresaid INT)
RETURNS TABLE (
    id INT,
    codigointerno VARCHAR,
    tipoid INT,
    tipocodsunat VARCHAR,
    tipodescripcion VARCHAR,
    regimenid INT,
    regimencodsunat VARCHAR,
    regimenabreviatura VARCHAR,
    descripcion VARCHAR,
    estado INT,
    empresaid INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.imtipotrabajador_id,
        tt.ttt_codigointerno,
        tt.itt_tipo,
        t.tt_codsunat,
        t.tt_descripcion,
        tt.itt_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        tt.ttt_descripcion,
        tt.itt_estado,
        tt.empresa_id
    FROM rrhh_mtipotrabajador tt
    INNER JOIN rrhh_mtipo t ON tt.itt_tipo = t.imtipo_id
    INNER JOIN rrhh_mregimenpensionario r ON tt.itt_regimenpensionario = r.imregimenpensionario_id
    WHERE tt.empresa_id = p_empresaid AND tt.itt_estado = 1
    ORDER BY tt.ttt_codigointerno;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Obtener tipo de trabajador por ID
-- =====================================================
CREATE OR REPLACE FUNCTION sp_obtener_tipo_trabajador(p_id INT)
RETURNS TABLE (
    id INT,
    codigointerno VARCHAR,
    tipoid INT,
    tipocodsunat VARCHAR,
    tipodescripcion VARCHAR,
    regimenid INT,
    regimencodsunat VARCHAR,
    regimenabreviatura VARCHAR,
    descripcion VARCHAR,
    estado INT,
    empresaid INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tt.imtipotrabajador_id,
        tt.ttt_codigointerno,
        tt.itt_tipo,
        t.tt_codsunat,
        t.tt_descripcion,
        tt.itt_regimenpensionario,
        r.trp_codsunat,
        r.trp_abreviatura,
        tt.ttt_descripcion,
        tt.itt_estado,
        tt.empresa_id
    FROM rrhh_mtipotrabajador tt
    INNER JOIN rrhh_mtipo t ON tt.itt_tipo = t.imtipo_id
    INNER JOIN rrhh_mregimenpensionario r ON tt.itt_regimenpensionario = r.imregimenpensionario_id
    WHERE tt.imtipotrabajador_id = p_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Guardar tipo de trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION sp_guardar_tipo_trabajador(
    p_codigointerno VARCHAR,
    p_tipoid INT,
    p_regimenid INT,
    p_descripcion VARCHAR,
    p_empresaid INT
)
RETURNS INT AS $$
DECLARE
    v_id INT;
BEGIN
    INSERT INTO rrhh_mtipotrabajador (
        ttt_codigointerno,
        itt_tipo,
        itt_regimenpensionario,
        ttt_descripcion,
        itt_estado,
        empresa_id
    ) VALUES (
        p_codigointerno,
        p_tipoid,
        p_regimenid,
        p_descripcion,
        1,
        p_empresaid
    )
    RETURNING imtipotrabajador_id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Actualizar tipo de trabajador
-- =====================================================
CREATE OR REPLACE FUNCTION sp_actualizar_tipo_trabajador(
    p_id INT,
    p_codigointerno VARCHAR,
    p_tipoid INT,
    p_regimenid INT,
    p_descripcion VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE rrhh_mtipotrabajador
    SET 
        ttt_codigointerno = p_codigointerno,
        itt_tipo = p_tipoid,
        itt_regimenpensionario = p_regimenid,
        ttt_descripcion = p_descripcion
    WHERE imtipotrabajador_id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNCIÓN: Eliminar tipo de trabajador (lógico)
-- =====================================================
CREATE OR REPLACE FUNCTION sp_eliminar_tipo_trabajador(p_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE rrhh_mtipotrabajador
    SET itt_estado = 0
    WHERE imtipotrabajador_id = p_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Funciones de tipos de trabajador creadas exitosamente';
END $$;
