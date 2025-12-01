package com.meridian.erp.service;

import com.meridian.erp.entity.TipoTotales;
import com.meridian.erp.repository.TipoTotalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TipoTotalesService {
    
    private final TipoTotalesRepository tipoTotalesRepository;
    
    /**
     * Listar todos los tipos de totales activos
     */
    public List<TipoTotales> listarActivos() {
        return tipoTotalesRepository.findByEstadoOrderByIdAsc(1);
    }
    
    /**
     * Listar todos los tipos de totales (activos e inactivos)
     */
    public List<TipoTotales> listarTodos() {
        return tipoTotalesRepository.findAllByOrderByIdAsc();
    }
    
    /**
     * Obtener tipo de totales por ID
     */
    public Optional<TipoTotales> obtenerPorId(String id) {
        return tipoTotalesRepository.findById(id);
    }
}
