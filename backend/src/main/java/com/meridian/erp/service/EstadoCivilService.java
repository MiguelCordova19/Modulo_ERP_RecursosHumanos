package com.meridian.erp.service;

import com.meridian.erp.entity.EstadoCivil;
import com.meridian.erp.repository.EstadoCivilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstadoCivilService {
    
    private final EstadoCivilRepository estadoCivilRepository;
    
    /**
     * Listar todos los estados civiles activos
     */
    public List<EstadoCivil> listarActivos() {
        return estadoCivilRepository.findByEstadoOrderById(1);
    }
    
    /**
     * Listar todos los estados civiles
     */
    public List<EstadoCivil> listarTodos() {
        return estadoCivilRepository.findAll();
    }
}
