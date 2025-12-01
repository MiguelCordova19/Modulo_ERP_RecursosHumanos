package com.meridian.erp.service;

import com.meridian.erp.entity.Tributo;
import com.meridian.erp.repository.TributoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TributoService {
    
    private final TributoRepository tributoRepository;
    
    /**
     * Listar todos los tributos activos
     */
    public List<Tributo> listarActivos() {
        return tributoRepository.findByEstadoOrderByIdAsc(1);
    }
    
    /**
     * Listar todos los tributos (activos e inactivos)
     */
    public List<Tributo> listarTodos() {
        return tributoRepository.findAllByOrderByIdAsc();
    }
    
    /**
     * Obtener tributo por ID
     */
    public Optional<Tributo> obtenerPorId(String id) {
        return tributoRepository.findById(id);
    }
    
    /**
     * Buscar tributos por código o descripción (para autocomplete)
     */
    public List<Tributo> buscar(String busqueda) {
        if (busqueda == null || busqueda.trim().isEmpty()) {
            return List.of();
        }
        return tributoRepository.buscarPorCodigoODescripcion(busqueda.trim());
    }
    
    /**
     * Listar tributos por tipo
     */
    public List<Tributo> listarPorTipo(String tipoId) {
        return tributoRepository.findByTipoIdAndEstadoOrderByCodigoSunatAsc(tipoId, 1);
    }
}
