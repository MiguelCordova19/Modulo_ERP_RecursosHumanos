package com.meridian.erp.service;

import com.meridian.erp.entity.Sede;
import com.meridian.erp.repository.SedeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SedeService {
    
    private final SedeRepository sedeRepository;
    
    /**
     * Listar sedes por empresa (solo activas)
     */
    public List<Sede> listarPorEmpresa(Integer empresaId) {
        return sedeRepository.findByEmpresaIdAndEstado(empresaId, 1);
    }
    
    /**
     * Obtener sede por ID
     */
    public Optional<Sede> obtenerPorId(Long id) {
        return sedeRepository.findById(id);
    }
    
    /**
     * Crear nueva sede
     */
    @Transactional
    public Sede crear(Sede sede, Long usuarioId) {
        // Validar que no exista el código en la misma empresa
        Optional<Sede> existente = sedeRepository.findByCodigoAndEmpresaIdAndEstado(
            sede.getCodigo(), 
            sede.getEmpresaId(), 
            1
        );
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya existe una sede con el código '" + sede.getCodigo() + "' en esta empresa");
        }
        
        sede.setEstado(1);
        sede.setUsuarioRegistro(usuarioId);
        sede.setFechaRegistro(LocalDateTime.now());
        
        return sedeRepository.save(sede);
    }
    
    /**
     * Actualizar sede
     */
    @Transactional
    public Sede actualizar(Long id, Sede sedeActualizada, Long usuarioId) {
        Optional<Sede> sedeExistente = sedeRepository.findById(id);
        
        if (sedeExistente.isEmpty()) {
            throw new RuntimeException("Sede no encontrada");
        }
        
        Sede sede = sedeExistente.get();
        
        // Validar que no exista otro registro con el mismo código en la misma empresa
        if (!sede.getCodigo().equals(sedeActualizada.getCodigo())) {
            boolean existe = sedeRepository.existsByCodigoAndEmpresaIdAndEstadoAndIdNot(
                sedeActualizada.getCodigo(),
                sede.getEmpresaId(),
                1,
                id
            );
            
            if (existe) {
                throw new RuntimeException("Ya existe otra sede con el código '" + sedeActualizada.getCodigo() + "' en esta empresa");
            }
        }
        
        sede.setCodigo(sedeActualizada.getCodigo());
        sede.setDescripcion(sedeActualizada.getDescripcion());
        sede.setUsuarioEdito(usuarioId);
        sede.setFechaEdito(LocalDateTime.now());
        
        return sedeRepository.save(sede);
    }
    
    /**
     * Eliminar sede (soft delete)
     */
    @Transactional
    public boolean eliminar(Long id, Long usuarioId) {
        Optional<Sede> sedeExistente = sedeRepository.findById(id);
        
        if (sedeExistente.isEmpty()) {
            return false;
        }
        
        Sede sede = sedeExistente.get();
        sede.setEstado(0);
        sede.setUsuarioElimino(usuarioId);
        sede.setFechaElimino(LocalDateTime.now());
        sedeRepository.save(sede);
        
        return true;
    }
}
