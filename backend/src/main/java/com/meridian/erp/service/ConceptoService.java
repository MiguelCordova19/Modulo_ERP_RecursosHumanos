package com.meridian.erp.service;

import com.meridian.erp.entity.Concepto;
import com.meridian.erp.repository.ConceptoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConceptoService {
    
    private final ConceptoRepository conceptoRepository;
    private final JdbcTemplate jdbcTemplate;
    
    // RowMapper para conceptos con información relacionada
    private final RowMapper<Concepto> conceptoRowMapper = (rs, rowNum) -> {
        Concepto concepto = new Concepto();
        concepto.setId(rs.getLong("imconceptos_id"));
        concepto.setTributoId(rs.getString("ic_tributos"));
        concepto.setTipoConceptoId(rs.getString("ic_tipoconcepto"));
        concepto.setDescripcion(rs.getString("tc_descripcion"));
        concepto.setAfecto(rs.getInt("ic_afecto"));
        concepto.setTipoTotalesId(rs.getString("ic_tipototales"));
        concepto.setEmpresaId(rs.getInt("ic_empresa"));
        concepto.setEstado(rs.getInt("ic_estado"));
        
        // Información relacionada
        concepto.setTributoCodigoSunat(rs.getString("tributo_codigo"));
        concepto.setTributoDescripcion(rs.getString("tributo_descripcion"));
        concepto.setTipoConceptoDescripcion(rs.getString("tipo_concepto_descripcion"));
        concepto.setTipoTotalesDescripcion(rs.getString("tipo_totales_descripcion"));
        
        return concepto;
    };
    
    /**
     * Listar conceptos por empresa con información relacionada
     */
    public List<Concepto> listarPorEmpresa(Integer empresaId) {
        String sql = """
            SELECT 
                c.imconceptos_id,
                c.ic_tributos,
                c.ic_tipoconcepto,
                c.tc_descripcion,
                c.ic_afecto,
                c.ic_tipototales,
                c.ic_empresa,
                c.ic_estado,
                t.tt_codsunat as tributo_codigo,
                t.tt_descripcion as tributo_descripcion,
                tc.ttc_descripcion as tipo_concepto_descripcion,
                tt.ttt_descripcion as tipo_totales_descripcion
            FROM rrhh_mconceptos c
            LEFT JOIN rrhh_mtributos t ON c.ic_tributos = t.imtributos_id
            LEFT JOIN rrhh_mtipoconcepto tc ON c.ic_tipoconcepto = tc.imtipoconcepto
            LEFT JOIN rrhh_mtipototales tt ON c.ic_tipototales = tt.imtipototales_id
            WHERE c.ic_empresa = ? AND c.ic_estado = 1
            ORDER BY c.imconceptos_id DESC
        """;
        
        return jdbcTemplate.query(sql, conceptoRowMapper, empresaId);
    }
    
    /**
     * Obtener concepto por ID
     */
    public Optional<Concepto> obtenerPorId(Long id) {
        return conceptoRepository.findById(id);
    }
    
    /**
     * Crear nuevo concepto
     */
    public Concepto crear(Concepto concepto, Long usuarioId) {
        concepto.setEstado(1);
        concepto.setUsuarioRegistro(usuarioId);
        concepto.setFechaRegistro(LocalDateTime.now());
        return conceptoRepository.save(concepto);
    }
    
    /**
     * Actualizar concepto
     */
    public Concepto actualizar(Long id, Concepto conceptoActualizado, Long usuarioId) {
        Optional<Concepto> conceptoExistente = conceptoRepository.findById(id);
        
        if (conceptoExistente.isPresent()) {
            Concepto concepto = conceptoExistente.get();
            concepto.setTributoId(conceptoActualizado.getTributoId());
            concepto.setTipoConceptoId(conceptoActualizado.getTipoConceptoId());
            concepto.setDescripcion(conceptoActualizado.getDescripcion());
            concepto.setAfecto(conceptoActualizado.getAfecto());
            concepto.setTipoTotalesId(conceptoActualizado.getTipoTotalesId());
            concepto.setUsuarioEdito(usuarioId);
            concepto.setFechaEdito(LocalDateTime.now());
            
            return conceptoRepository.save(concepto);
        }
        
        return null;
    }
    
    /**
     * Eliminar concepto (soft delete)
     */
    public boolean eliminar(Long id, Long usuarioId) {
        Optional<Concepto> conceptoExistente = conceptoRepository.findById(id);
        
        if (conceptoExistente.isPresent()) {
            Concepto concepto = conceptoExistente.get();
            concepto.setEstado(0);
            concepto.setUsuarioElimino(usuarioId);
            concepto.setFechaElimino(LocalDateTime.now());
            conceptoRepository.save(concepto);
            return true;
        }
        
        return false;
    }
}
