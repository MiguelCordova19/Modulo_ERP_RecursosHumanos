package com.meridian.erp.service;

import com.meridian.erp.entity.DiaSemana;
import com.meridian.erp.repository.DiaSemanaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiaSemanaService {
    
    @Autowired
    private DiaSemanaRepository diaSemanaRepository;
    
    // Listar todos los días
    public List<DiaSemana> listarTodos() {
        return diaSemanaRepository.findAll();
    }
    
    // Listar días activos
    public List<DiaSemana> listarActivos() {
        return diaSemanaRepository.findByEstadoOrderByIdAsc(1);
    }
    
    // Obtener día por ID
    public DiaSemana obtenerPorId(String id) {
        return diaSemanaRepository.findById(id).orElse(null);
    }
}
