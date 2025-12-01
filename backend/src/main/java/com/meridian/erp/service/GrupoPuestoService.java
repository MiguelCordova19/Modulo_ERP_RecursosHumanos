package com.meridian.erp.service;

import com.meridian.erp.entity.GrupoPuesto;
import com.meridian.erp.repository.GrupoPuestoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GrupoPuestoService {
    
    private final GrupoPuestoRepository grupoPuestoRepository;
    
    /**
     * Listar grupos por empresa (solo activos)
     */
    public List<GrupoPuesto> listarPorEmpresa(Integer empresaId) {
        return grupoPuestoRepository.findByEmpresaIdAndEstado(empresaId, 1);
    }
    
    /**
     * Obtener grupo por ID
     */
    public Optional<GrupoPuesto> obtenerPorId(Long id) {
        return grupoPuestoRepository.findById(id);
    }
    
    /**
     * Crear nuevo grupo
     */
    @Transactional
    public GrupoPuesto crear(GrupoPuesto grupo, Long usuarioId) {
        grupo.setEstado(1);
        grupo.setUsuarioRegistro(usuarioId);
        grupo.setFechaRegistro(LocalDateTime.now());
        
        return grupoPuestoRepository.save(grupo);
    }
    
    /**
     * Actualizar grupo
     */
    @Transactional
    public GrupoPuesto actualizar(Long id, GrupoPuesto grupoActualizado, Long usuarioId) {
        Optional<GrupoPuesto> grupoExistente = grupoPuestoRepository.findById(id);
        
        if (grupoExistente.isEmpty()) {
            throw new RuntimeException("Grupo no encontrado");
        }
        
        GrupoPuesto grupo = grupoExistente.get();
        grupo.setDescripcion(grupoActualizado.getDescripcion());
        grupo.setEvaluacion(grupoActualizado.getEvaluacion());
        grupo.setUsuarioEdito(usuarioId);
        grupo.setFechaEdito(LocalDateTime.now());
        
        return grupoPuestoRepository.save(grupo);
    }
    
    /**
     * Eliminar grupo (soft delete)
     */
    @Transactional
    public boolean eliminar(Long id, Long usuarioId) {
        Optional<GrupoPuesto> grupoExistente = grupoPuestoRepository.findById(id);
        
        if (grupoExistente.isEmpty()) {
            return false;
        }
        
        GrupoPuesto grupo = grupoExistente.get();
        grupo.setEstado(0);
        grupo.setUsuarioElimino(usuarioId);
        grupo.setFechaElimino(LocalDateTime.now());
        grupoPuestoRepository.save(grupo);
        
        return true;
    }
}
