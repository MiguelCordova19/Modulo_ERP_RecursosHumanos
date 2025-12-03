package com.meridian.erp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConceptosVariablesService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Guardar conceptos variables en lote
     */
    @Transactional
    public Long guardarConceptosVariablesBatch(
            Integer anio,
            Integer mes,
            Long planillaId,
            Long conceptoId,
            String trabajadoresJson,
            Long empresaId,
            Long usuarioId
    ) {
        String sql = "SELECT public.sp_guardar_conceptos_variables_batch(?, ?, ?, ?, ?::jsonb, ?, ?)";
        
        return jdbcTemplate.queryForObject(sql, Long.class,
                anio,
                mes,
                planillaId,
                conceptoId,
                trabajadoresJson,
                empresaId,
                usuarioId
        );
    }
    
    /**
     * Listar conceptos variables
     */
    public List<Map<String, Object>> listarConceptosVariables(
            Long empresaId,
            Integer anio,
            Integer mes
    ) {
        String sql = "SELECT * FROM public.sp_listar_conceptos_variables(?, ?, ?)";
        return jdbcTemplate.queryForList(sql, empresaId, anio, mes);
    }
    
    /**
     * Obtener detalle de conceptos variables
     */
    public List<Map<String, Object>> obtenerDetalleConceptosVariables(Long cabeceraId) {
        String sql = "SELECT * FROM public.sp_obtener_detalle_conceptos_variables(?)";
        return jdbcTemplate.queryForList(sql, cabeceraId);
    }
    
    /**
     * Eliminar conceptos variables (soft delete)
     */
    @Transactional
    public boolean eliminarConceptosVariables(Long cabeceraId, Long usuarioId) {
        String sql = "SELECT public.sp_eliminar_conceptos_variables(?, ?)";
        
        Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class, cabeceraId, usuarioId);
        return result != null && result;
    }
}
