package com.meridian.erp.service;

import com.meridian.erp.entity.GrupoPuestoDetalle;
import com.meridian.erp.repository.GrupoPuestoDetalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GrupoPuestoDetalleService {
    
    private final GrupoPuestoDetalleRepository grupoPuestoDetalleRepository;
    private final JdbcTemplate jdbcTemplate;
    
    // RowMapper para detalles con información relacionada
    private final RowMapper<GrupoPuestoDetalle> detalleRowMapper = (rs, rowNum) -> {
        GrupoPuestoDetalle detalle = new GrupoPuestoDetalle();
        detalle.setId(rs.getInt("imgrupo_puesto_detalle_id"));
        detalle.setGrupoId(rs.getInt("igpd_grupo_id"));
        detalle.setPuestoId(rs.getInt("igpd_puesto_id"));
        detalle.setEstado(rs.getInt("igpd_estado"));
        
        // Información del puesto
        detalle.setPuestoNombre(rs.getString("puesto_nombre"));
        detalle.setPuestoDescripcion(rs.getString("puesto_descripcion"));
        
        // Información del grupo
        detalle.setGrupoNombre(rs.getString("grupo_nombre"));
        
        // Evaluación (JSON)
        String evaluacionJson = rs.getString("tgpd_evaluacion");
        if (evaluacionJson != null) {
            // El JSON ya viene como String, lo parseamos manualmente
            Map<String, String> evaluacion = new HashMap<>();
            // Aquí podrías usar Jackson o Gson para parsear, pero por simplicidad:
            detalle.setEvaluacion(evaluacion);
        }
        
        return detalle;
    };
    
    /**
     * Listar puestos asignados a un grupo con sus evaluaciones
     */
    public List<GrupoPuestoDetalle> listarPorGrupo(Integer grupoId) {
        // Usar el repositorio JPA que maneja automáticamente el JSON
        List<GrupoPuestoDetalle> detalles = grupoPuestoDetalleRepository.findByGrupoIdAndEstado(grupoId, 1);
        
        // Cargar información adicional de puestos usando SQL
        String sql = """
            SELECT 
                p.impuesto_id,
                p.tp_nombre,
                p.tp_descripcion
            FROM rrhh_mpuestos p
            WHERE p.impuesto_id = ? AND p.ip_estado = 1
        """;
        
        for (GrupoPuestoDetalle detalle : detalles) {
            try {
                Map<String, Object> puestoData = jdbcTemplate.queryForMap(sql, detalle.getPuestoId());
                detalle.setPuestoNombre((String) puestoData.get("tp_nombre"));
                detalle.setPuestoDescripcion((String) puestoData.get("tp_descripcion"));
            } catch (Exception e) {
                // Si no se encuentra el puesto, continuar
            }
        }
        
        return detalles;
    }
    
    /**
     * Asignar un puesto a un grupo con evaluación
     */
    @Transactional
    public GrupoPuestoDetalle asignar(Integer grupoId, Integer puestoId, Map<String, String> evaluacion, Long usuarioId) {
        // Verificar si el puesto ya está asignado a otro grupo
        if (grupoPuestoDetalleRepository.existsByPuestoIdAndEstado(puestoId, 1)) {
            throw new RuntimeException("El puesto ya está asignado a otro grupo activo");
        }
        
        GrupoPuestoDetalle detalle = new GrupoPuestoDetalle();
        detalle.setGrupoId(grupoId);
        detalle.setPuestoId(puestoId);
        detalle.setEvaluacion(evaluacion);
        detalle.setEstado(1);
        detalle.setUsuarioRegistro(usuarioId);
        detalle.setFechaRegistro(LocalDateTime.now());
        
        return grupoPuestoDetalleRepository.save(detalle);
    }
    
    /**
     * Desasignar todos los puestos de un grupo
     */
    @Transactional
    public void desasignarTodosPorGrupo(Integer grupoId) {
        grupoPuestoDetalleRepository.desactivarPorGrupo(grupoId);
    }
    
    /**
     * Reasignar puestos a un grupo (elimina anteriores y crea nuevos)
     */
    @Transactional
    public void reasignarPuestos(Integer grupoId, List<Map<String, Object>> puestos, Long usuarioId) {
        // Desactivar asignaciones anteriores
        desasignarTodosPorGrupo(grupoId);
        
        // Crear nuevas asignaciones
        for (Map<String, Object> puesto : puestos) {
            Integer puestoId = (Integer) puesto.get("puestoId");
            @SuppressWarnings("unchecked")
            Map<String, String> evaluacion = (Map<String, String>) puesto.get("evaluacion");
            
            asignar(grupoId, puestoId, evaluacion, usuarioId);
        }
    }
}
