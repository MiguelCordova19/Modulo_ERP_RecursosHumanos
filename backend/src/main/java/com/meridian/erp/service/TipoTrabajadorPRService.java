package com.meridian.erp.service;

import com.meridian.erp.entity.TipoTrabajadorPR;
import com.meridian.erp.repository.TipoTrabajadorPRRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipoTrabajadorPRService {
    
    private final TipoTrabajadorPRRepository tipoTrabajadorPRRepository;
    
    /**
     * Listar todos los tipos activos
     */
    public List<TipoTrabajadorPR> listarActivos() {
        return tipoTrabajadorPRRepository.findByEstadoOrderById(1);
    }
    
    /**
     * Listar todos los tipos
     */
    public List<TipoTrabajadorPR> listarTodos() {
        return tipoTrabajadorPRRepository.findAll();
    }
}
