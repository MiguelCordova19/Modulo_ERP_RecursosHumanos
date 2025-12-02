package com.meridian.erp.service;

import com.meridian.erp.entity.Turno;
import com.meridian.erp.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurnoService {
    
    @Autowired
    private TurnoRepository turnoRepository;
    
    // Listar todos los turnos
    public List<Turno> listarTodos() {
        return turnoRepository.findAll();
    }
    
    // Listar turnos activos
    public List<Turno> listarActivos() {
        return turnoRepository.findByEstadoOrderByIdAsc(1);
    }
    
    // Obtener turno por ID
    public Turno obtenerPorId(String id) {
        return turnoRepository.findById(id).orElse(null);
    }
}
