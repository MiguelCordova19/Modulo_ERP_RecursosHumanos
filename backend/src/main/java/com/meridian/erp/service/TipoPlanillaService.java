package com.meridian.erp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TipoPlanillaService {
    
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Listar tipos de planilla activos (GLOBAL)
     */
    public List<Map<String, Object>> listarTiposPlanilla() {
        String sql = "SELECT * FROM public.sp_listar_tipos_planilla()";
        return jdbcTemplate.queryForList(sql);
    }
    
    /**
     * Obtener tipo de planilla por ID (GLOBAL)
     */
    public Map<String, Object> obtenerTipoPlanillaPorId(Long id) {
        String sql = "SELECT " +
                "imtipoplanilla_id as id, " +
                "ttp_descripcion as descripcion, " +
                "ttp_codigo as codigo " +
                "FROM public.rrhh_mtipoplanilla " +
                "WHERE imtipoplanilla_id = ? " +
                "AND itp_estado = 1";
        
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
        return result.isEmpty() ? null : result.get(0);
    }
    
    /**
     * Insertar nuevo tipo de planilla (GLOBAL)
     */
    @Transactional
    public Long insertarTipoPlanilla(
            String descripcion,
            String codigo,
            Long usuarioId
    ) {
        String sql = "SELECT public.sp_insertar_tipo_planilla(?, ?, ?)";
        
        return jdbcTemplate.queryForObject(sql, Long.class,
                descripcion,
                codigo,
                usuarioId
        );
    }
    
    /**
     * Actualizar tipo de planilla
     */
    @Transactional
    public boolean actualizarTipoPlanilla(
            Long id,
            String descripcion,
            String codigo,
            Long usuarioId
    ) {
        String sql = "SELECT public.sp_actualizar_tipo_planilla(?, ?, ?, ?)";
        
        Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class,
                id,
                descripcion,
                codigo,
                usuarioId
        );
        
        return result != null && result;
    }
    
    /**
     * Eliminar tipo de planilla (soft delete)
     */
    @Transactional
    public boolean eliminarTipoPlanilla(Long id, Long usuarioId) {
        String sql = "SELECT public.sp_eliminar_tipo_planilla(?, ?)";
        
        Boolean result = jdbcTemplate.queryForObject(sql, Boolean.class, id, usuarioId);
        return result != null && result;
    }
}
