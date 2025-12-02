package com.meridian.erp.service;

import com.meridian.erp.entity.Horario;
import com.meridian.erp.repository.HorarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioService {
    
    @Autowired
    private HorarioRepository horarioRepository;
    
    // Listar todos los horarios
    public List<Horario> listarTodos() {
        return horarioRepository.findAll();
    }
    
    // Listar horarios activos
    public List<Horario> listarActivos() {
        return horarioRepository.findByEstadoOrderByIdAsc(1);
    }
    
    // Obtener horario por ID
    public Horario obtenerPorId(String id) {
        return horarioRepository.findById(id).orElse(null);
    }
}
