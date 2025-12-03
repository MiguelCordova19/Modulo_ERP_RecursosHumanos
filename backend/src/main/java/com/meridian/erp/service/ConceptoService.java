package com.meridian.erp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConceptoService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Buscar conceptos por descripción
     * Busca usando LIKE en la descripción
     */
    public List<Map<String, Object>> buscarConceptos(Long empresaId, String busqueda) {
        String sql = "SELECT " +
                "imconceptos_id as id, " +
                "tc_descripcion as descripcion, " +
                "ic_tipoconcepto as tipo_concepto_id, " +
                "ic_tributos as tributo_id " +
                "FROM public.rrhh_mconceptos " +
                "WHERE ic_empresa = ? " +
                "AND ic_estado = 1 " +
                "AND UPPER(tc_descripcion) LIKE UPPER(?) " +
                "ORDER BY tc_descripcion " +
                "LIMIT 10";
        
        String busquedaLike = "%" + busqueda + "%";
        return jdbcTemplate.queryForList(sql, empresaId, busquedaLike);
    }
    
    /**
     * Listar todos los conceptos activos de una empresa
     */
    public List<Map<String, Object>> listarConceptos(Long empresaId) {
        String sql = "SELECT " +
                "imconceptos_id as id, " +
                "tc_descripcion as descripcion, " +
                "ic_tipoconcepto as tipo_concepto_id, " +
                "ic_tributos as tributo_id " +
                "FROM public.rrhh_mconceptos " +
                "WHERE ic_empresa = ? " +
                "AND ic_estado = 1 " +
                "ORDER BY tc_descripcion";
        
        return jdbcTemplate.queryForList(sql, empresaId);
    }
    
    /**
     * Obtener concepto por ID
     */
    public Map<String, Object> obtenerConceptoPorId(Long id) {
        String sql = "SELECT " +
                "imconceptos_id as id, " +
                "tc_descripcion as descripcion, " +
                "ic_tipoconcepto as tipo_concepto_id, " +
                "ic_tributos as tributo_id, " +
                "ic_empresa as empresa_id " +
                "FROM public.rrhh_mconceptos " +
                "WHERE imconceptos_id = ? " +
                "AND ic_estado = 1";
        
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
        return result.isEmpty() ? null : result.get(0);
    }
}
