package com.meridian.erp.service;

import com.meridian.erp.entity.ConceptoRegimenLaboral;
import com.meridian.erp.entity.ConceptoRegimenDetalle;
import com.meridian.erp.repository.ConceptoRegimenLaboralRepository;
import com.meridian.erp.repository.ConceptoRegimenDetalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConceptoRegimenLaboralService {
    
    private final ConceptoRegimenLaboralRepository conceptoRegimenLaboralRepository;
    private final ConceptoRegimenDetalleRepository conceptoRegimenDetalleRepository;
    private final JdbcTemplate jdbcTemplate;
    
    /**
     * Listar conceptos por régimen laboral con información completa
     */
    public List<Map<String, Object>> listarPorEmpresa(Integer empresaId) {
        String sql = """
            SELECT 
                cr.imconceptosregimen_id,
                cr.ic_regimenlaboral,
                cr.ic_empresa,
                cr.ic_estado,
                rl.trl_codsunat as regimen_codigo,
                rl.trl_regimenlaboral as regimen_nombre,
                COUNT(crd.imconceptosregimendetalle_id) as total_conceptos
            FROM rrhh_conceptos_regimen_laboral cr
            INNER JOIN rrhh_regimenlaboral rl ON cr.ic_regimenlaboral = rl.imregimenlaboral_id
            LEFT JOIN rrhh_conceptos_regimen_detalle crd ON cr.imconceptosregimen_id = crd.ic_conceptosregimen_id 
                AND crd.ic_estado = 1
            WHERE cr.ic_empresa = ? AND cr.ic_estado = 1
            GROUP BY cr.imconceptosregimen_id, cr.ic_regimenlaboral, cr.ic_empresa, cr.ic_estado, 
                     rl.trl_codsunat, rl.trl_regimenlaboral
            ORDER BY cr.imconceptosregimen_id DESC
        """;
        
        return jdbcTemplate.queryForList(sql, empresaId);
    }
    
    /**
     * Obtener detalles de conceptos de un régimen
     */
    public List<Map<String, Object>> obtenerDetalles(Long conceptoRegimenId) {
        String sql = """
            SELECT 
                crd.imconceptosregimendetalle_id,
                crd.ic_concepto_id as concepto_id,
                c.tc_descripcion as concepto_descripcion,
                t.tt_codsunat as concepto_codigo,
                cr.ic_regimenlaboral as regimen_id
            FROM rrhh_conceptos_regimen_detalle crd
            INNER JOIN rrhh_mconceptos c ON crd.ic_concepto_id = c.imconceptos_id
            LEFT JOIN rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
            INNER JOIN rrhh_conceptos_regimen_laboral cr ON crd.ic_conceptosregimen_id = cr.imconceptosregimen_id
            WHERE crd.ic_conceptosregimen_id = ? AND crd.ic_estado = 1
            ORDER BY crd.imconceptosregimendetalle_id
        """;
        
        return jdbcTemplate.queryForList(sql, conceptoRegimenId);
    }
    
    /**
     * Guardar o actualizar conceptos por régimen laboral
     */
    @Transactional
    public ConceptoRegimenLaboral guardar(
            String regimenLaboralId, 
            Integer empresaId, 
            List<Long> conceptosIds, 
            Long usuarioId) {
        
        // Buscar si ya existe una asignación para este régimen y empresa
        Optional<ConceptoRegimenLaboral> existente = conceptoRegimenLaboralRepository
            .findByRegimenLaboralIdAndEmpresaIdAndEstado(regimenLaboralId, empresaId, 1);
        
        ConceptoRegimenLaboral conceptoRegimen;
        
        if (existente.isPresent()) {
            // Actualizar existente
            conceptoRegimen = existente.get();
            conceptoRegimen.setUsuarioEdito(usuarioId);
            conceptoRegimen.setFechaEdito(LocalDateTime.now());
            
            // Eliminar detalles anteriores
            conceptoRegimenDetalleRepository.deleteByConceptoRegimenId(conceptoRegimen.getId());
        } else {
            // Crear nuevo
            conceptoRegimen = new ConceptoRegimenLaboral();
            conceptoRegimen.setRegimenLaboralId(regimenLaboralId);
            conceptoRegimen.setEmpresaId(empresaId);
            conceptoRegimen.setEstado(1);
            conceptoRegimen.setUsuarioRegistro(usuarioId);
            conceptoRegimen.setFechaRegistro(LocalDateTime.now());
        }
        
        // Guardar cabecera
        conceptoRegimen = conceptoRegimenLaboralRepository.save(conceptoRegimen);
        
        // Guardar detalles
        for (Long conceptoId : conceptosIds) {
            ConceptoRegimenDetalle detalle = new ConceptoRegimenDetalle();
            detalle.setConceptoRegimenId(conceptoRegimen.getId());
            detalle.setConceptoId(conceptoId);
            detalle.setEstado(1);
            detalle.setFechaRegistro(LocalDateTime.now());
            conceptoRegimenDetalleRepository.save(detalle);
        }
        
        return conceptoRegimen;
    }
    
    /**
     * Eliminar (soft delete)
     */
    @Transactional
    public boolean eliminar(Long id, Long usuarioId) {
        Optional<ConceptoRegimenLaboral> existente = conceptoRegimenLaboralRepository.findById(id);
        
        if (existente.isPresent()) {
            ConceptoRegimenLaboral conceptoRegimen = existente.get();
            conceptoRegimen.setEstado(0);
            conceptoRegimen.setUsuarioElimino(usuarioId);
            conceptoRegimen.setFechaElimino(LocalDateTime.now());
            conceptoRegimenLaboralRepository.save(conceptoRegimen);
            
            // Desactivar detalles
            List<ConceptoRegimenDetalle> detalles = conceptoRegimenDetalleRepository
                .findByConceptoRegimenIdAndEstado(id, 1);
            detalles.forEach(d -> {
                d.setEstado(0);
                conceptoRegimenDetalleRepository.save(d);
            });
            
            return true;
        }
        
        return false;
    }
}
