package com.meridian.erp.service;

import com.meridian.erp.entity.RegimenLaboral;
import com.meridian.erp.repository.RegimenLaboralRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegimenLaboralService {
    
    private final RegimenLaboralRepository regimenLaboralRepository;
    
    /**
     * Listar todos los regímenes laborales activos
     */
    public List<RegimenLaboral> listarActivos() {
        return regimenLaboralRepository.findByEstadoOrderByCodSunatAsc(1);
    }
    
    /**
     * Listar todos los regímenes laborales
     */
    public List<RegimenLaboral> listarTodos() {
        return regimenLaboralRepository.findAllByOrderByCodSunatAsc();
    }
    
    /**
     * Obtener régimen laboral por ID
     */
    public Optional<RegimenLaboral> obtenerPorId(String id) {
        return regimenLaboralRepository.findById(id);
    }
}
