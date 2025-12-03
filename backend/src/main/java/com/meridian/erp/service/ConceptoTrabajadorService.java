package com.meridian.erp.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meridian.erp.dto.ConceptoTrabajadorRequest;
import com.meridian.erp.entity.ConceptoTrabajador;
import com.meridian.erp.repository.ConceptoTrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConceptoTrabajadorService {
    
    private final ConceptoTrabajadorRepository conceptoTrabajadorRepository;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    
    /**
     * Guardar conceptos de un trabajador usando procedimiento almacenado
     */
    @Transactional
    public boolean guardarConceptos(Long contratoId, Integer empresaId, List<ConceptoTrabajadorRequest.ConceptoItem> conceptos, Long usuarioId) {
        try {
            // Convertir lista de conceptos a JSON
            String conceptosJson = objectMapper.writeValueAsString(conceptos);
            
            // Llamar al procedimiento almacenado
            String sql = "SELECT public.sp_guardar_conceptos_trabajador(?, ?::TEXT, ?, ?)";
            Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class, contratoId, conceptosJson, empresaId, usuarioId);
            
            return resultado != null && resultado;
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar conceptos del trabajador: " + e.getMessage(), e);
        }
    }
    
    /**
     * Obtener conceptos de un trabajador por contrato y empresa
     */
    public List<Map<String, Object>> obtenerConceptosPorContrato(Long contratoId, Integer empresaId) {
        String sql = "SELECT * FROM public.sp_obtener_conceptos_trabajador(?, ?)";
        return jdbcTemplate.queryForList(sql, contratoId, empresaId);
    }
    
    /**
     * Eliminar conceptos de un trabajador (soft delete)
     */
    @Transactional
    public boolean eliminarConceptos(Long contratoId, Integer empresaId, Long usuarioId) {
        String sql = "SELECT public.sp_eliminar_conceptos_trabajador(?, ?, ?)";
        Boolean resultado = jdbcTemplate.queryForObject(sql, Boolean.class, contratoId, empresaId, usuarioId);
        return resultado != null && resultado;
    }
    
    /**
     * Obtener conceptos activos por contrato y empresa (usando repository)
     */
    public List<ConceptoTrabajador> obtenerConceptosActivos(Long contratoId, Integer empresaId) {
        return conceptoTrabajadorRepository.findActivosByContratoIdAndEmpresaId(contratoId, empresaId);
    }
    
    /**
     * Obtener todos los conceptos activos de una empresa
     */
    public List<ConceptoTrabajador> obtenerConceptosPorEmpresa(Integer empresaId) {
        return conceptoTrabajadorRepository.findByEmpresaIdAndEstado(empresaId, 1);
    }
}
