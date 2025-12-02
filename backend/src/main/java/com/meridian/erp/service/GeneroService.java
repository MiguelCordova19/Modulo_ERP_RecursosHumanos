package com.meridian.erp.service;

import com.meridian.erp.entity.Genero;
import com.meridian.erp.repository.GeneroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeneroService {
    
    private final GeneroRepository generoRepository;
    
    /**
     * Listar todos los géneros activos
     */
    public List<Genero> listarActivos() {
        return generoRepository.findByEstadoOrderById(1);
    }
    
    /**
     * Listar todos los géneros
     */
    public List<Genero> listarTodos() {
        return generoRepository.findAll();
    }
}
